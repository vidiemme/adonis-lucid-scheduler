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

    dbJobs.forEach((dbJob) => {
      const jobClass = this.jobMap.get(dbJob.name)
      if (!jobClass) {
        // job not in list
        return
      }

      if (!timeMatches(dbJob.cron)) {
        // the cron job does not match the current date, hour and minute
        // seconds not supported
        return
      }

      new Runner(this.logger, this.database).run(dbJob, jobClass)
    })
  }
}
