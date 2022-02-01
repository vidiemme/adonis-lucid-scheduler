import { ApplicationContract } from '@ioc:Adonis/Core/Application'
// import { scheduleJob } from 'node-schedule'

/**
 * Mysql scheduler service provider
 */
export default class MysqlSchedulerProvider {
  constructor(protected app: ApplicationContract) {}

  public static needsApplication = true

  private registerJob() {
    this.app.container.bind('Adonis/Scheduler/Job', () => {
      return require('../src/Job')
    })
  }

  private registerModel() {
    this.app.container.singleton('Adonis/Scheduler/Model', () => {
      return require('../src/Model')
    })
  }

  private registerRunner() {
    this.app.container.singleton('Adonis/Scheduler/Runner', () => {
      const { Runner } = require('../src/Runner')
      return { Runner, RunnerInstance: new Runner() }
    })
  }

  private registerScheduler() {
    this.app.container.singleton('Adonis/Scheduler/Scheduler', () => {
      return require('../src/Scheduler')
    })
  }
  /*
  private async startScheduler() {
    const { checkJobs } = await this.app.container.import('Adonis/Scheduler/Scheduler')
    scheduleJob('* * * * *', checkJobs)
  }*/

  /**
   * Called when registering providers
   */
  public register(): void {
    console.log('start register...')
    this.registerJob()
    this.registerModel()
    this.registerRunner()
    this.registerScheduler()
    console.log('end register')
  }

  /**
   * Called when all bindings are in place
   */
  public async ready(): Promise<void> {
    console.log('start boot...')
    // await this.startScheduler()
    console.log('end boot')
  }
}
