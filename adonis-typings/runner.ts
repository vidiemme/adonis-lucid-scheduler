declare module '@ioc:Adonis/Scheduler/Runner' {
  import { JobModel } from '@ioc:Adonis/Scheduler/Model'
  import { BaseJob } from '@ioc:Adonis/Scheduler/Job'

  export class Runner {
    public run(jobModel: JobModel, jobHandler: BaseJob)
  }

  export const RunnerInstance: Runner
}
