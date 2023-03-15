import { join } from 'path'
import { BaseCommand, args } from '@adonisjs/core/build/standalone'

export default class MakeJob extends BaseCommand {
  /**
   * Command Name is used to run the command
   */
  public static commandName = 'make:job'

  /**
   * Command Name is displayed in the "help" output
   */
  public static description = 'Make a new job'

  @args.string({ description: 'Name of the job', required: true })
  public name: string

  /**
   * This command loads the application
   */
  public static settings = {
    loadApp: true,
  }

  /**
   * Execute command
   */
  public async run(): Promise<void> {
    const stub = join(__dirname, '..', 'templates', 'models', 'job.txt')

    const path = this.application.resolveNamespaceDirectory('jobs')

    this.generator
      .addFile(this.name, { pattern: 'pascalcase', form: 'singular' })
      .stub(stub)
      .destinationDir(path || 'app/Jobs')
      .useMustache()
      .appRoot(this.application.cliCwd || this.application.appRoot)

    await this.generator.run()
  }
}
