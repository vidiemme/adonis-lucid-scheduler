declare module '@ioc:Vidiemme/Scheduler/Runner' {
  import { LoggerContract } from '@ioc:Adonis/Core/Logger'
  import { DatabaseContract } from '@ioc:Adonis/Lucid/Database'
  import { DBJobModel, JobHandler } from '@ioc:Vidiemme/Scheduler/Job'

  export interface RunnerInterface {
    run()
  }

  export class Runner implements RunnerInterface {
    constructor(
      logger: LoggerContract,
      database: DatabaseContract,
      prefixJobName: string,
      jobModel: DBJobModel,
      jobHandler: typeof JobHandler
    )
    public run()
  }
}
