import { join } from 'path'
import * as sinkStatic from '@adonisjs/sink'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

/**
 * Create the migration file
 */
function makeUsersMigration(
  projectRoot: string,
  app: ApplicationContract,
  sink: typeof sinkStatic
) {
  const migrationsDirectory = app.directoriesMap.get('migrations') || 'database'
  const migrationPath = join(migrationsDirectory, `${Date.now()}_jobs.ts`)

  const template = new sink.files.MustacheFile(
    projectRoot,
    migrationPath,
    join(__dirname, 'templates', 'migration.txt')
  )
  if (template.exists()) {
    sink.logger.action('create').skipped(`${migrationPath} file already exists`)
    return
  }

  template.apply().commit()
  sink.logger.action('create').succeeded(migrationPath)
}

/**
 * Register preload
 */
function registerPreload(projectRoot: string, sink: typeof sinkStatic) {
  const packageName = '@vidiemme/adonis-mysql-scheduler'

  const rcFile = new sink.files.AdonisRcFile(projectRoot)
  rcFile.setPreload('./start/scheduler', ['web'])
  rcFile.commit()

  sink.logger.action('registered').succeeded(packageName)
}

/**
 * Instructions to be executed when setting up the package.
 */
export default async function instructions(
  projectRoot: string,
  app: ApplicationContract,
  sink: typeof sinkStatic
) {
  makeUsersMigration(projectRoot, app, sink)
  registerPreload(projectRoot, sink)
}
