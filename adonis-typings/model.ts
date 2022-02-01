/// <reference path="./runner.ts" />

declare module '@ioc:Adonis/Scheduler/Model' {
  import { BaseModel } from '@ioc:Adonis/Lucid/Orm'
  import { DateTime } from 'luxon'

  export class JobModel extends BaseModel {
    public id: number
    public name: string
    public cron: string
    public data: string
    public nextRunAt: DateTime | null
    public lastRunAt: DateTime | null
    public lastFinishedAt: DateTime | null
    public lockedAt: DateTime | null
    public createdAt: DateTime
    public updatedAt: DateTime
  }
}
