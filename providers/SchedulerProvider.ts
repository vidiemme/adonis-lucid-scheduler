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

      const logger = this.app.container.use('Adonis/Core/Logger')
      const database = this.app.container.use('Adonis/Lucid/Database')

      const runnerInstance = new Runner(logger, database)

      return {
        Runner,
        RunnerInstance: runnerInstance,
      }
    })
  }

  private registerScheduler() {
    this.app.container.singleton('Vidiemme/Scheduler/Scheduler', () => {
      const { JobMap } = require('../src/JobMap')
      const { Scheduler } = require('../src/Scheduler')

      const Database = this.app.container.use('Adonis/Lucid/Database')
      const { RunnerInstance } = this.app.container.use('Vidiemme/Scheduler/Runner')

      const schedulerInstance = new Scheduler(RunnerInstance, Database, JobMap)

      return {
        Scheduler,
        SchedulerInstance: schedulerInstance,
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
    const { SchedulerInstance } = this.app.container.use('Vidiemme/Scheduler/Scheduler')
    scheduleJob('* * * * *', SchedulerInstance.checkJobs.bind(SchedulerInstance))
  }
}
