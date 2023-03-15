declare module '@ioc:Vidiemme/Scheduler/Job' {
  export type JobMapType = Map<string, typeof JobHandler>
  export const JobMap: JobMapType
}
