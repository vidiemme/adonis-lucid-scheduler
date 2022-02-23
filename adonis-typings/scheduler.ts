declare module '@ioc:Vidiemme/Scheduler/Scheduler' {
  export interface SchedulerContract {
    checkJobs()
  }

  export const SchedulerInstance: SchedulerContract
}
