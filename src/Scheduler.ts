import { DateTime } from 'luxon'

const later = require('@breejs/later')

import { SchedulerContract } from '@ioc:Vidiemme/Scheduler/Scheduler'
import { DBJobModel, JobMapType } from '@ioc:Vidiemme/Scheduler/Job'
import { RunnerContract } from '@ioc:Vidiemme/Scheduler/Runner'
import { DatabaseContract } from '@ioc:Adonis/Lucid/Database'

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

      const schedule = later.parse.cron(dbJob.cron)
      const now = new Date(new Date().setSeconds(0))
      const valid = later.schedule(schedule).isValid(now)
      if (!valid) {
        // the cron job does not match the current date, hour and minute
        // seconds not supported
        return
      }

      this.runnerInstance.run(dbJob, new jobClass())
    })
  }
}
