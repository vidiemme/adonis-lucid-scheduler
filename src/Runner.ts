import parser from 'cron-parser'
import { DateTime } from 'luxon'
import md5 from 'md5'

import { DatabaseContract, TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { JobHandler, DBJobModel } from '@ioc:Vidiemme/Scheduler/Job'
import { RunnerInterface } from '@ioc:Vidiemme/Scheduler/Runner'
import { LoggerContract } from '@ioc:Adonis/Core/Logger'

export class Runner implements RunnerInterface {
  protected jobName: string
  protected jobModel: DBJobModel
  protected jobHandler: JobHandler

  constructor(
    protected logger: LoggerContract,
    protected database: DatabaseContract,
    protected prefixJobName: string,
    jobModel: DBJobModel,
    jobHandler: typeof JobHandler
  ) {
    this.jobModel = jobModel
    this.jobHandler = new jobHandler()

    this.jobName = `${this.jobModel.id}_${this.jobModel.name}`
  }

  public async run() {
    const trx = await this.database.transaction()
    try {
      await this.runWithTransaction(trx)
      await trx.commit()
    } catch (e) {
      this.logger.error(e)
      await trx.rollback()
    }
  }

  private async runWithTransaction(trx: TransactionClientContract) {
    const getLock = await this.lock(trx)
    if (!getLock) {
      return
    }

    try {
      await this.exec()
    } catch (e) {
      this.logger.debug(`Scheduler - Job "${this.jobName}" finished with error.`)
      this.logger.error(e)
    } finally {
      await this.reschedule(trx)
      await this.unlock(trx)
    }
  }

  private getAdvisoryLockName(): string {
    return md5(`${this.prefixJobName}_${this.jobName}`)
  }

  private async lock(trx: TransactionClientContract): Promise<boolean> {
    const locked = await trx.getAdvisoryLock(this.getAdvisoryLockName())
    if (!locked) {
      this.logger.warn(`Scheduler - Job "${this.jobName}" blocked: can't be lock.`)
      return false
    }

    this.logger.debug(`Scheduler - Job "${this.jobName}" locked.`)
    await this.updateJobModel(trx, {
      lockedAt: DateTime.now(),
    })

    return true
  }

  private async exec() {
    this.logger.debug(`Scheduler - Job "${this.jobName}" started.`)
    const data = this.jobModel.data ? JSON.parse(JSON.stringify(this.jobModel.data)) : undefined
    await this.jobHandler.handle(data)
    this.logger.debug(`Scheduler - Job "${this.jobName}" finished.`)
  }

  private async reschedule(trx: TransactionClientContract) {
    const schedule = parser.parseExpression(this.jobModel.cron)

    await this.updateJobModel(trx, {
      lastRunAt: this.jobModel.lockedAt,
      lastFinishedAt: DateTime.now(),
      nextRunAt: DateTime.fromISO(schedule.next().toISOString()),
    })
    this.logger.debug(
      `Scheduler - Job "${this.jobName}" rescheduled at '${this.jobModel.nextRunAt}'.`
    )
  }

  private async unlock(trx: TransactionClientContract) {
    await this.updateJobModel(trx, {
      lockedAt: null,
    })

    await trx.releaseAdvisoryLock(this.getAdvisoryLockName())
    this.logger.debug(`Scheduler - Job "${this.jobName}" released.`)
  }

  private async updateJobModel(
    trx: TransactionClientContract,
    params: Partial<Omit<DBJobModel, 'id'>>
  ) {
    this.jobModel.merge(params)
    await this.jobModel.useTransaction(trx).save()
  }
}
