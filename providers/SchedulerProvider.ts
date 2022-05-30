import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { scheduleJob } from 'node-schedule'

/**
 * Scheduler service provider
 */
export default class SchedulerProvider {
  constructor(protected app: ApplicationContract) {}

  public static needsApplication = true

  private registerJob() {
    this.app.container.bind('Vidiemme/Scheduler/Job', () => {
      const { JobHandler } = require('../src/JobHandler')
      const { DBJobModel } = require('../src/JobModel')
      const { JobMap } = require('../src/JobMap')

      return {
        JobHandler,
        DBJobModel,
        JobMap,
      }
    })
  }

  private registerRunner() {
    this.app.container.singleton('Vidiemme/Scheduler/Runner', () => {
      const { Runner } = require('../src/Runner')
      return { Runner }
    })
  }

  private registerScheduler() {
    this.app.container.singleton('Vidiemme/Scheduler/Scheduler', () => {
      const { Scheduler } = require('../src/Scheduler')

      const { JobMap } = this.app.container.resolveBinding('Vidiemme/Scheduler/Job')
      const logger = this.app.container.resolveBinding('Adonis/Core/Logger')
      const database = this.app.container.resolveBinding('Adonis/Lucid/Database')

      return {
        Scheduler: new Scheduler(logger, database, JobMap),
      }
    })
  }

  /**
   * Called when registering providers
   */
  public register(): void {
    this.registerJob()
    this.registerRunner()
    this.registerScheduler()
  }

  /**
   * Called when all bindings are in place
   */
  public boot(): void {
    const { Scheduler } = this.app.container.resolveBinding('Vidiemme/Scheduler/Scheduler')
    scheduleJob('* * * * *', Scheduler.checkJobs.bind(Scheduler))
  }
}
