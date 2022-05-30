import parser from 'cron-parser'
import {
  DayOfTheMonthRange,
  DayOfTheWeekRange,
  HourRange,
  MonthRange,
  SixtyRange,
} from 'cron-parser/types'

const timeMatches = (expression) => {
  const date = new Date(new Date().setSeconds(0))

  const interval = parser.parseExpression(expression)
  const data = interval.fields

  if (!data.second.includes(date.getSeconds() as SixtyRange)) {
    return false
  }
  if (!data.minute.includes(date.getMinutes() as SixtyRange)) {
    return false
  }
  if (!data.hour.includes(date.getHours() as HourRange)) {
    return false
  }
  if (!data.dayOfMonth.includes(date.getDate() as DayOfTheMonthRange)) {
    return false
  }
  if (!data.month.includes((date.getMonth() + 1) as MonthRange)) {
    return false
  }
  if (!data.dayOfWeek.includes(date.getDay() as DayOfTheWeekRange)) {
    return false
  }
  return true
}

export { timeMatches }
