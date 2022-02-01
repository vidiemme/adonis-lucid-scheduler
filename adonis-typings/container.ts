declare module '@ioc:Adonis/Core/Application' {
  import * as Job from '@ioc:Adonis/Scheduler/Job'
  import * as Model from '@ioc:Adonis/Scheduler/Model'
  import * as Runner from '@ioc:Adonis/Scheduler/Runner'
  import * as Scheduler from '@ioc:Adonis/Scheduler/Scheduler'

  export interface ContainerBindings {
    'Adonis/Scheduler/Job': typeof Job
    'Adonis/Scheduler/Model': typeof Model
    'Adonis/Scheduler/Runner': typeof Runner
    'Adonis/Scheduler/Scheduler': typeof Scheduler
  }
}
