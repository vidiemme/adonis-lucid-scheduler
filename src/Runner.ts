import parser from 'cron-parser'
import { DateTime } from 'luxon'

import { JobHandler, DBJobModel } from '@ioc:Vidiemme/Scheduler/Job'
import { RunnerInterface } from '@ioc:Vidiemme/Scheduler/Runner'
import { DatabaseContract } from '@ioc:Adonis/Lucid/Database'
import { LoggerContract } from '@ioc:Adonis/Core/Logger'

export class Runner implements RunnerInterface {
  protected jobName: string
  protected jobModel: DBJobModel
  protected jobHandler: JobHandler

  constructor(protected logger: LoggerContract, protected database: DatabaseContract) {}

  public async run(jobModel: DBJobModel, jobHandler: typeof JobHandler) {
    this.jobModel = jobModel
    this.jobHandler = new jobHandler()

    this.jobName = `${this.jobModel.id}_${this.jobModel.name}`

    const getLock = await this.lock()
    if (!getLock) {
      return
    }

    try {
      await this.exec()
    } catch (e) {
      this.logger.debug(`Job "${this.jobName}" finished with error.`)
      this.logger.error(e)
    } finally {
      await this.reschedule()
      await this.unlock()
    }
  }

  private async lock(): Promise<boolean> {
    const client = this.database.connection()
    const locked = await client.getAdvisoryLock(this.jobName)
    if (!locked) {
      this.logger.debug(`Job "${this.jobName}" blocked: can't be lock.`)
      return false
    }

    this.logger.debug(`Job "${this.jobName}" locked.`)
    await this.updateJobModel({
      lockedAt: DateTime.now(),
    })

    return true
  }

  private async exec() {
    this.logger.debug(`Job "${this.jobName}" started.`)
    const data = this.jobModel.data ? JSON.parse(JSON.stringify(this.jobModel.data)) : undefined
    await this.jobHandler.handle(data)
    this.logger.debug(`Job "${this.jobName}" finished.`)
  }

  private async reschedule() {
    const schedule = parser.parseExpression(this.jobModel.cron)

    await this.updateJobModel({
      lastRunAt: this.jobModel.lockedAt,
      lastFinishedAt: DateTime.now(),
      nextRunAt: DateTime.fromISO(schedule.next().toISOString()),
    })
    this.logger.debug(`Job "${this.jobName}" rescheduled at '${this.jobModel.nextRunAt}'.`)
  }

  private async unlock() {
    await this.updateJobModel({
      lockedAt: null,
    })

    const client = this.database.connection()
    await client.releaseAdvisoryLock(this.jobName)

    this.logger.debug(`Job "${this.jobName}" released.`)
  }

  private async updateJobModel(params: Partial<Omit<DBJobModel, 'id'>>) {
    this.jobModel.merge(params)
    await this.jobModel.save()
  }
}
