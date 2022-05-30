import { DateTime } from 'luxon'

import { SchedulerInterface } from '@ioc:Vidiemme/Scheduler/Scheduler'
import { DBJobModel, JobMapType } from '@ioc:Vidiemme/Scheduler/Job'
import { DatabaseContract } from '@ioc:Adonis/Lucid/Database'
import { Runner } from '@ioc:Vidiemme/Scheduler/Runner'
import { LoggerContract } from '@ioc:Adonis/Core/Logger'
import { timeMatches } from './utils'

export class Scheduler implements SchedulerInterface {
  constructor(
    protected logger: LoggerContract,
    protected database: DatabaseContract,
    protected jobMap: JobMapType
  ) {}

  public async extractJobs() {
    const dbJobs = await DBJobModel.query()
      .whereNull('lockedAt')
      .where((query) => {
        query.whereNull('nextRunAt').orWhere('nextRunAt', '<=', DateTime.now().toSQL())
      })

    await Promise.all(
      dbJobs.map(async (dbJob) => {
        const jobClass = this.jobMap.get(dbJob.name)
        if (!jobClass) {
          this.logger.debug(`Scheduler - Job '${dbJob.name}' not in list`)
          // job not in list
          return
        }

        if (!timeMatches(dbJob.cron)) {
          // the cron job does not match the current date, hour and minute
          // seconds not supported
          return
        }

        this.logger.debug(`Scheduler - Running job '${dbJob.name}'`)
        new Runner(this.logger, this.database, dbJob, jobClass).run()
      })
    )
  }
}
