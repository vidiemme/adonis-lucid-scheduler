import { JobHandlerInterface, JobParams } from '@ioc:Vidiemme/Scheduler/Job'

export abstract class JobHandler implements JobHandlerInterface {
  abstract handle(param?: JobParams): void
}
