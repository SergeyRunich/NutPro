import createApiCall from './apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const getExtraDayRequests = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/extra-day`,
  }

  return createApiCall(options).fetch()
}

export const deleteExtraDayRequest = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/admin/extra-day/${id}`,
  }

  return createApiCall(options).fetch()
}

export const createExtraDayRequest = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/extra-day`,
    body,
  }

  return createApiCall(options).fetch()
}

export const updateExtraDayRequest = async body => {
  const options = {
    method: 'PATCH',
    endpoint: `/admin/extra-day/`,
    body,
  }

  return createApiCall(options).fetch()
}
