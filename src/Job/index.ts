/// <reference path="../../adonis-typings/index.ts" />

export abstract class BaseJob {
  abstract handle(param?: { [key: string]: any })
}
