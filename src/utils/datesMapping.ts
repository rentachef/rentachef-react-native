import {Timing, WeekDayAndTime} from "../models/chef/ChefProfileSetup";
import moment from "moment";
import ChefResults from "../screens/customer/dashboard/chef-results";

export function _getWeekDayByShortDayString(shortDay: string): number | undefined {
  switch(shortDay) {
    case 'Mon':
      return 1
    case 'Tue':
      return 2
    case 'Wed':
      return 3
    case 'Thu':
      return 4
    case 'Fri':
      return 5
    case 'Sat':
      return 6
    case 'Sun':
      return 7
  }
}

export function _getNextDatesFromWeeklyHours(wh: WeekDayAndTime, quantity: number = 3): Timing[] | [] {
  const dayINeed = _getWeekDayByShortDayString(wh.day)
  const today = moment().isoWeekday()
  const timeFrom = moment(wh.timing.from).format('HH:mm')
  const timeTo = moment(wh.timing.to).format('HH:mm')
  let date
  let result: Timing[] = []

  if(wh.day === moment().format('ddd'))
    result.push({
      from: moment(`${moment().format('YYYY-MM-DD')} ${timeFrom}`).toDate(),
      to: moment(`${moment().format('YYYY-MM-DD')} ${timeTo}`).toDate()
    })

  if(!!dayINeed) {
    if(today < dayINeed)
      date = moment().isoWeekday(dayINeed).format('YYYY-MM-DD')
    else
      date = moment().add(1, 'weeks').isoWeekday(dayINeed).format('YYYY-MM-DD')

    for(let i = 0; i < quantity; i++)
    result.push({
      from: moment(`${date} ${timeFrom}`).add(i, 'weeks').toDate(),
      to: moment(`${date} ${timeTo}`).add(i, 'weeks').toDate()
    })

    return result
  } else
    return []
}

export function _getDatesByHourRange(dateFrom: Date, dateTo: Date): Date[] {
  let diff = moment.duration(moment(dateTo).diff(moment(dateFrom))).asHours()
  console.log(diff)

  let currentDate = dateFrom
  let datesRange: Date[] = [currentDate]

  while (moment(currentDate) < moment(dateTo)) {
    diff = diff - 1
    let nextDate = new Date()
    if(diff > 0) {
      nextDate = moment(currentDate).add(1, 'hours').toDate()
      datesRange.push(nextDate)
      currentDate = nextDate
    } else {
      currentDate = dateTo
      datesRange.push(currentDate)
    }
  }
  return datesRange
}
