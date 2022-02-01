declare module '@ioc:Adonis/Scheduler/Scheduler' {
  import { BaseJob } from '@ioc:Adonis/Scheduler/Job'

  export const JobMap: Map<string, BaseJob>
  export const checkJobs: () => void
}
