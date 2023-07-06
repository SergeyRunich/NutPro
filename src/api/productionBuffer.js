import createApiCall from './apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const getBufferList = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/production-buffer`,
  }

  return createApiCall(options).fetch()
}

export const getBuffer = async (date, kitchen) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/production-buffer/${date}/${kitchen}`,
  }

  return createApiCall(options).fetch()
}

export const postBuffer = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/production-buffer`,
    body,
  }

  return createApiCall(options).fetch()
}
