import { DateTime } from 'luxon'

import { BaseModel } from '@adonisjs/lucid/build/src/Orm/BaseModel'
import { column } from '@adonisjs/lucid/build/src/Orm/Decorators'

export class DBJobModel extends BaseModel {
  public static table = 'jobs'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public cron: string

  @column()
  public data: string

  @column.dateTime()
  public nextRunAt: DateTime | null

  @column.dateTime()
  public lastRunAt: DateTime | null

  @column.dateTime()
  public lastFinishedAt: DateTime | null

  @column.dateTime()
  public lockedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
