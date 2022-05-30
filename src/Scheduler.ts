import { DateTime } from 'luxon'

import { SchedulerContract } from '@ioc:Vidiemme/Scheduler/Scheduler'
import { DBJobModel, JobMapType } from '@ioc:Vidiemme/Scheduler/Job'
import { RunnerContract } from '@ioc:Vidiemme/Scheduler/Runner'
import { DatabaseContract } from '@ioc:Adonis/Lucid/Database'
import { timeMatches } from './utils'

export class Scheduler implements SchedulerContract {
  constructor(
    protected runnerInstance: RunnerContract,
    protected database: DatabaseContract,
    protected jobMap: JobMapType
  ) {}

  public async checkJobs() {
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

      this.runnerInstance.run(dbJob, new jobClass())
    })
  }
}
