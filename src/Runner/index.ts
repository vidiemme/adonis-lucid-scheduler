/// <reference path="../../adonis-typings/index.ts" />

import parser from 'cron-parser'
import { DateTime } from 'luxon'

import Database from '@ioc:Adonis/Lucid/Database'
import Logger from '@ioc:Adonis/Core/Logger'
import { JobModel } from '@ioc:Adonis/Scheduler/Model'
import { BaseJob } from '@ioc:Adonis/Scheduler/Job'

export class Runner {
  protected jobName: string
  protected jobModel: JobModel
  protected jobHandler: BaseJob

  public async run(jobModel: JobModel, jobHandler: BaseJob) {
    this.jobModel = jobModel
    this.jobHandler = jobHandler

    this.jobName = this.makeJobName()

    const getLock = await this.lock()
    if (!getLock) {
      return
    }

    try {
      await this.exec()
    } catch (e) {
      Logger.debug(`Job "${this.jobName}" finished with error.`)
      Logger.error(e)
    } finally {
      await this.reschedule()
      await this.unlock()
    }
  }

  private makeJobName(): string {
    return `${this.jobModel.id}_${this.jobModel.name}`
  }

  private async lock(): Promise<boolean> {
    const client = Database.connection()
    const locked = await client.getAdvisoryLock(this.jobName)
    if (locked) {
      Logger.debug(`Job "${this.jobName}" blocked: can't be lock.`)
      return false
    }

    Logger.debug(`Job "${this.jobName}" locked.`)

    this.jobModel.lockedAt = DateTime.now()
    await this.jobModel.save()

    return true
  }

  private async exec() {
    Logger.debug(`Job "${this.jobName}" started.`)
    const data = this.jobModel.data ? JSON.parse(this.jobModel.data) : undefined
    await this.jobHandler.handle(data)
    Logger.debug(`Job "${this.jobName}" finished.`)
  }

  private async reschedule() {
    this.jobModel.lastRunAt = this.jobModel.lockedAt
    this.jobModel.lastFinishedAt = DateTime.now()

    const schedule = parser.parseExpression(this.jobModel.cron)
    this.jobModel.nextRunAt = DateTime.fromISO(schedule.next().toISOString())
    Logger.debug(`Job "${this.jobName}" rescheduled at '${this.jobModel.nextRunAt}'.`)

    await this.jobModel.save()
  }

  private async unlock() {
    this.jobModel.lockedAt = null
    await this.jobModel.save()

    const client = Database.connection()
    await client.releaseAdvisoryLock(this.jobName)

    Logger.debug(`Job "${this.jobName}" released.`)
  }
}
