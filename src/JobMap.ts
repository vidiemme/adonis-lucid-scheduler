import { JobHandler, JobMapType } from '@ioc:Vidiemme/Scheduler/Job'

export const JobMap: JobMapType = new Map<string, typeof JobHandler>([
  // list of job name and job class
])
