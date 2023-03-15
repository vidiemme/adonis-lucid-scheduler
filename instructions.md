The package has been configured successfully.

Complete the installation by performing the migration and creating your first job.

Use the command `node ace migration:run` to perform the migration.

Use the command `node ace make:job << job name >>` to create a job, remember that you will have to insert it into the
list of jobs in the file `start/scheduler.ts` as shown in the example:

```typescript
import ExampleJob from 'App/Jobs/ExampleJob'

JobMap.set('jobName', ExampleJob)
```
