declare module '@ioc:Vidiemme/Scheduler/Runner' {
  import { DBJobModel, JobHandlerContract } from '@ioc:Vidiemme/Scheduler/Job'

  export interface RunnerContract {
    run(jobModel: DBJobModel, jobHandler: JobHandlerContract)
  }

  export const RunnerInstance: RunnerContract
}
