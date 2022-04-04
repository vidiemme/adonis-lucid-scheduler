# Adonis Scheduler

[![npm-image]][npm-url] [![license-image]][license-url] [![typescript-image]][typescript-url]

This addon adds the functionality to schedule jobs managed via databases.

## Introduction

This package leverages Lucid for database job management, it can be used with all types of databases supported by
Lucid (MySQL, SQLite, Postgresql, ...). \
For some databases that support locking, the job lock function has been
implemented so that, in case of multiple server instances, only one node takes over the job from the DB.

## Installation

Install the package \
`npm i @vidiemme/adonis-scheduler`

Configure the package \
`node ace configure @vidiemme/adonis-scheduler`

Perform migration \
`node ace migration:run`

## Usage

Make a job handler with the command `node ace make:job << job name >>`. \
Then you must record the list of your jobs in the map inside the file `start/scheduler.ts`.

e.g.:

```typescript
import JobClass from 'App/Jobs/JobClass'
JobMap.set('jobName', JobClass)
```

The Job can work with any resource on the server. \
You can also pass metadata in Json format to the `handle` method.

```typescript
interface MyCustomInterface {
  ...
}

public async handle(params: MyCustomInterface) {
  // your job here
}
```

Jobs are managed directly in DB:
- The `name` field must be aligned to the names entered in the JobMap.
- the `data` field is optional and can contain a json of parameters to pass to the JobHandler
- The `cron` field represents how often to run the job.

[npm-image]: https://img.shields.io/npm/v/@vidiemme/adonis-scheduler?logo=npm&style=for-the-badge

[npm-url]: https://www.npmjs.com/package/@vidiemme/adonis-scheduler

[license-image]: https://img.shields.io/npm/l/@vidiemme/adonis-scheduler?style=for-the-badge&color=blueviolet

[license-url]: https://github.com/vidiemme/adonis-lucid-scheduler/blob/main/LICENSE.md

[typescript-image]: https://img.shields.io/npm/types/@vidiemme/adonis-scheduler?color=294E80&label=%20&logo=typescript&style=for-the-badge

[typescript-url]: https://github.com/vidiemme
