import { JobHandlerContract } from '@ioc:Vidiemme/Scheduler/Job'

export abstract class JobHandler implements JobHandlerContract {
  abstract handle(param?: { [key: string]: any }): void
}
