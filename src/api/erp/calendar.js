import createApiCall from '../apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const getCalendarMenu = async (classMenu, id = '') => {
  const lastEndpoint = id
    ? `/erp/template/calendar/${classMenu}/?id=${id}`
    : `/erp/template/calendar/${classMenu}`
  const options = {
    method: 'GET',
    endpoint: lastEndpoint,
  }

  return createApiCall(options).fetch()
}

export const createCalendarMenu = async body => {
  const options = {
    method: 'POST',
    endpoint: `/erp/template/calendar/`,
    body,
  }

  return createApiCall(options).fetch()
}

export const editCalendarMenu = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/erp/template/calendar/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const deleteCalendarMenu = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/erp/template/calendar/${id}`,
  }

  return createApiCall(options).fetch()
}

export const setWeekMenu = async body => {
  const options = {
    method: 'POST',
    endpoint: `/erp/template/week/calendar/`,
    body,
  }

  return createApiCall(options).fetch()
}

export const getWeeklyCalendar = async date => {
  const options = {
    method: 'GET',
    endpoint: `/erp/calendar/weekly/${date}`,
  }

  return createApiCall(options).fetch()
}
