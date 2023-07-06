import createApiCall from '../apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const getWeekTemplate = async (id = '') => {
  const lastEndpoint = id ? `/erp/template/week/?id=${id}` : `/erp/template/week/`
  const options = {
    method: 'GET',
    endpoint: lastEndpoint,
  }

  return createApiCall(options).fetch()
}

export const createWeekTemplate = async body => {
  const options = {
    method: 'POST',
    endpoint: `/erp/template/week/`,
    body,
  }

  return createApiCall(options).fetch()
}

export const editWeekTemplate = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/erp/template/week/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const deleteWeekTemplate = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/erp/template/week/${id}`,
  }

  return createApiCall(options).fetch()
}

export const getExpandedWeekTemplate = async (
  id = '',
  saladOnDinner = false,
  ratingStart = '',
  ratingEnd = '',
) => {
  const options = {
    method: 'GET',
    endpoint: `/erp/week-template/${id}?saladOnDinner=${saladOnDinner}&ratingStart=${ratingStart}&ratingEnd=${ratingEnd}`,
  }

  return createApiCall(options).fetch()
}

export const changeTemplateByWeekday = async body => {
  const options = {
    method: 'PUT',
    endpoint: `/erp/week-template`,
    body,
  }

  return createApiCall(options).fetch()
}

export const markAsCompleted = async id => {
  const options = {
    method: 'PUT',
    endpoint: `/erp/week-template/${id}/completed`,
  }

  return createApiCall(options).fetch()
}
