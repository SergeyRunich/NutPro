/* eslint-disable func-names */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
const moment = require('moment')
const lodash = require('lodash')

// IN UNIX TIMESTAMP FORMAT
const getStepOrderDays = (start, length, size) => {
  const cursor = new Date(start * 1000) // Date cursor
  let days = length // Days left to fill
  const result = [] // Days of order

  while (days > 0) {
    if (cursor.getDay() === 6) {
      // If Saturday
      if (size === 'long') {
        // if long
        result.push(Math.floor(cursor.getTime() / 1000)) // day is used
        days--
      }
      cursor.setDate(cursor.getDate() + 2) // Jump to monday
      continue
    }

    if (cursor.getDate() === 0) {
      // If sunday
      cursor.setDate(cursor.getDate() + 1) // Jump to monday
      continue
    }

    result.push(Math.floor(cursor.getTime() / 1000)) // day is used
    cursor.setDate(cursor.getDate() + 1)
    days--
  }

  return result
}

// IN UNIX TIMESTAMP FORMAT
const getOrderDays = (
  start,
  length,
  size,
  pausesArray = [],
  additionalDays = [],
  removedDays = [],
) => {
  let fixDays = 0
  if (removedDays.length !== 0) {
    fixDays += removedDays.length
  }
  if (additionalDays.length !== 0) {
    fixDays -= additionalDays.length
  }
  let result = getStepOrderDays(start, length + fixDays, size) // Days of order
  const pauses = pausesArray.sort(function(a, b) {
    return a.start - b.start
  })
  if (removedDays.length !== 0) {
    removedDays.forEach(ad => {
      const index = result.findIndex(i => i === ad)
      result.splice(index, 1)
    })
  }
  if (additionalDays.length !== 0) {
    additionalDays.forEach(ad => {
      if (!result.includes(ad)) result.push(ad)
    })
  }
  result = lodash.sortBy(result)
  if (pauses.length === 0) {
    return result
  }

  function compareDates(a, b) {
    if (a > b) return 1
    if (a === b) return 0
    if (a < b) return -1
  }

  result.sort(compareDates)

  for (let i = 0; i < pauses.length; i += 1) {
    const pauseStart = pauses[i].start
    const pauseEnd = pauses[i].end
    for (let j = 0; j < result.length; j += 1) {
      if (result[j] === pauseStart) {
        const newDays = getStepOrderDays(pauseEnd, result.length - j, size) // Days after pause
        result.splice(j, result.length + 1 - j)
        newDays.forEach(newDay => {
          result.push(newDay)
        })
      }
    }
  }

  return result
}

// IN UNIX TIMESTAMP FORMAT
// TODO: replace with getLastDeliveryDate
const getEndDateMS = (start, length, size, pauses = [], additionalDays = [], removedDays = []) => {
  const days = getOrderDays(start, length, size, pauses, additionalDays, removedDays)
  const lastDay = new Date(days[days.length - 1] * 1000)
  lastDay.setDate(lastDay.getDate() + 1)
  return Math.floor(lastDay.getTime() / 1000)
}

const getLastDeliveryDate = (
  start,
  length,
  size,
  pauses = [],
  additionalDays = [],
  removedDays = [],
) => {
  const days = getOrderDays(start, length, size, pauses, additionalDays, removedDays)
  const lastDay = new Date(days[days.length - 1] * 1000)
  return Math.floor(lastDay.getTime() / 1000)
}

const getStage = (order, date = moment()) => {
  const today = date.startOf('day').unix()
  const start = order.timestamp
  const end = order.endTimestamp
  // 0 - Not Accepted
  // 1 - Waiting
  // 2 - Active
  // 3 - Pause
  // 4 - Completed

  if (order.status !== 'accepted') return { code: 0, text: 'Not Accepted' }

  if (today <= end) {
    if (start <= today) {
      if (order.pauses.length !== 0) {
        for (const pause of order.pauses) {
          if (pause.start <= today && today < pause.end) {
            return { code: 3, text: 'Pause' }
          }
        }
      }
      return { code: 2, text: 'Active' }
    }
    return { code: 1, text: 'Waiting' }
  }

  return { code: 4, text: 'Completed' }
}

const isActive = order =>
  order.timestamp <= Math.floor(Date.now() / 1000) &&
  getEndDateMS(
    order.timestamp,
    order.length,
    order.size,
    order.pauses,
    order.additionalDays,
    order.removedDays,
  ) >= Math.floor(Date.now() / 1000)

const isActiveInFuture = order =>
  getEndDateMS(
    order.timestamp,
    order.length,
    order.size,
    order.pauses,
    order.additionalDays,
    order.removedDays,
  ) >= Math.floor(Date.now() / 1000)

const noActiveOrder = orders => {
  let flag = true
  orders.forEach(order => {
    // if (getEndDateMS(order.timestamp, order.length, order.size) * 1000 >= Date.now()) flag = false
    if (isActive(order)) flag = false
  })
  return flag
}

const getTransformedTimestamp = date =>
  moment(date)
    .utc()
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0)
    .unix()

const isTimestampEditable = timestamp => {
  if (
    [1, 4, 6].indexOf(moment().isoWeekday()) !== -1 &&
    timestamp >= getTransformedTimestamp(moment().add(4, 'days'))
  ) {
    return true
  }
  if (
    [2].indexOf(moment().isoWeekday()) !== -1 &&
    timestamp >= getTransformedTimestamp(moment().add(3, 'days'))
  ) {
    return true
  }
  if (
    [3, 5, 7].indexOf(moment().isoWeekday()) !== -1 &&
    timestamp >= getTransformedTimestamp(moment().add(5, 'days'))
  ) {
    return true
  }
  return false
}

export {
  isActive,
  getOrderDays,
  getEndDateMS,
  isActiveInFuture,
  getLastDeliveryDate,
  getStage,
  getTransformedTimestamp,
  noActiveOrder,
  isTimestampEditable,
}
