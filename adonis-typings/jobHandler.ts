declare module '@ioc:Vidiemme/Scheduler/Job' {
  export interface JobHandlerContract {
    handle(param?: { [key: string]: any }): void
  }

  export class JobHandler implements JobHandlerContract {
    public handle(param?: { [key: string]: any }): void
  }
}
