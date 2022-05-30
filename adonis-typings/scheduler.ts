declare module '@ioc:Vidiemme/Scheduler/Scheduler' {
  import { JobMapType } from '@ioc:Vidiemme/Scheduler/Job'
  import { LoggerContract } from '@ioc:Adonis/Core/Logger'
  import { DatabaseContract } from '@ioc:Adonis/Lucid/Database'

  export interface SchedulerInterface {
    checkJobs()
  }

  export class Scheduler implements SchedulerInterface {
    constructor(logger: LoggerContract, database: DatabaseContract, jobMap: JobMapType)
    public checkJobs()
  }
}
