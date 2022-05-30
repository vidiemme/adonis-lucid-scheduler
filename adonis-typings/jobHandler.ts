declare module '@ioc:Vidiemme/Scheduler/Job' {
  type Primitive = string | boolean | number | bigint | symbol | null | undefined
  export type JobParams = { [key: string]: Primitive }

  export interface JobHandlerInterface {
    handle(param?: JobParams): void
  }

  export class JobHandler implements JobHandlerInterface {
    public handle(param?: JobParams): void
  }
}
