import createApiCall from './apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const createKitchenUser = async body => {
  const options = {
    method: 'POST',
    endpoint: `/kitchen/sign_up`,
    body,
  }

  return createApiCall(options).fetch()
}

export const getKitchenUsers = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/kitchen/user`,
  }

  return createApiCall(options).fetch()
}

export const updateSettings = async body => {
  const options = {
    method: 'PATCH',
    endpoint: `/users/me`,
    body,
  }

  return createApiCall(options).fetch()
}
