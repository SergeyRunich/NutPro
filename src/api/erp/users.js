import createApiCall from '../apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const getUsersKcal = async () => {
  const options = {
    method: 'GET',
    endpoint: `/erp/test/user`,
  }

  return createApiCall(options).fetch()
}

export const getUsersAdvancedTest = async () => {
  const options = {
    method: 'GET',
    endpoint: `/erp/test/user/advanced`,
  }

  return createApiCall(options).fetch()
}

export const getUserMenu = async ({ order = '', user = '' }) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/user/view/menu?order=${order}&user=${user}`,
  }

  return createApiCall(options).fetch()
}
