import { join } from 'path'
import * as sinkStatic from '@adonisjs/sink'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

function getStub(...relativePaths: string[]) {
  return join(__dirname, 'templates', ...relativePaths)
}

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

  const template = new sink.files.MustacheFile(projectRoot, migrationPath, getStub('migration.txt'))
  if (template.exists()) {
    sink.logger.action('create').skipped(`${migrationPath} file already exists`)
    return
  }

  template.apply().commit()
  sink.logger.action('create').succeeded(migrationPath)
}

/**
 * Create the configuration file
 */
function addConfigurationFile(
  projectRoot: string,
  app: ApplicationContract,
  sink: typeof sinkStatic
) {
  const configPath = app.configPath('scheduler.ts')

  const template = new sink.files.MustacheFile(projectRoot, configPath, getStub('config.txt'))
  if (template.exists()) {
    sink.logger.action('create').skipped(`${configPath} file already exists`)
    return
  }

  template.apply().commit()
  sink.logger.action('create').succeeded(configPath)
}

/**
 * Register preload
 */
function registerPreload(projectRoot: string, app: ApplicationContract, sink: typeof sinkStatic) {
  const preloadFilePath = app.makePath('start/scheduler.ts')
  const schedulerPreloadFile = new sink.files.MustacheFile(
    projectRoot,
    preloadFilePath,
    getStub('scheduler.txt')
  )

  schedulerPreloadFile.overwrite = true

  schedulerPreloadFile.commit()
  sink.logger.action('create').succeeded('start/scheduler.ts')

  const preload = new sink.files.AdonisRcFile(projectRoot)
  preload.setPreload('./start/scheduler')
  preload.commit()

  sink.logger.action('update').succeeded('.adonisrc.json')
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
  addConfigurationFile(projectRoot, app, sink)
  registerPreload(projectRoot, app, sink)
}
