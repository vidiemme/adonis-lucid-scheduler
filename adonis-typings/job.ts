/// <reference path="./runner.ts" />
/// <reference path="./scheduler.ts" />

declare module '@ioc:Adonis/Scheduler/Job' {
  export abstract class BaseJob {
    abstract handle(param?: { [key: string]: any })
  }
}
