import createApiCall from './apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const getFeedback = async (kitchen = 'all') => {
  const options = {
    method: 'GET',
    endpoint: `/admin/feedback?type=all&kitchen=${kitchen}`,
  }

  return createApiCall(options).fetch()
}

export const getFeedbackPeriod = async (start, end, kitchen = 'all') => {
  const options = {
    method: 'GET',
    endpoint: `/admin/feedback?type=period&start=${start}&end=${end}&kitchen=${kitchen}`,
  }

  return createApiCall(options).fetch()
}

export const getFeedbackDay = async (day, kitchen = 'all') => {
  const options = {
    method: 'GET',
    endpoint: `/admin/feedback?type=day&day=${day}&kitchen=${kitchen}`,
  }

  return createApiCall(options).fetch()
}
