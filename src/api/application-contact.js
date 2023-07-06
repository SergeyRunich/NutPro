import createApiCall from './apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const getEmails = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/application-contact`,
  }

  return createApiCall(options).fetch()
}

export const deleteEmail = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/admin/application-contact/${id}`,
  }

  return createApiCall(options).fetch()
}

export const createEmail = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/application-contact`,
    body,
  }

  return createApiCall(options).fetch()
}

export const updateEmail = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/application-contact/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}
