/// <reference path="../../adonis-typings/index.ts" />

import { DateTime } from 'luxon'

const later = require('@breejs/later')

import { RunnerInstance } from '@ioc:Adonis/Scheduler/Runner'
import { JobModel } from '@ioc:Adonis/Scheduler/Model'
import { BaseJob } from '@ioc:Adonis/Scheduler/Job'

export const JobMap: Map<string, BaseJob> = new Map<string, BaseJob>([
  // list of job name and job class
])

export const checkJobs = async () => {
  const dbJobs = await JobModel.query()
    .whereNull('lockedAt')
    .where((query) => {
      query.whereNull('nextRunAt').orWhere('nextRunAt', '<=', DateTime.now().toSQL())
    })

  dbJobs.forEach((dbJob) => {
    const jobClass = JobMap.get(dbJob.name)
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

    RunnerInstance.run(dbJob, jobClass)
  })
}
