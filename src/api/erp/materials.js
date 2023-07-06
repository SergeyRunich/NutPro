import createApiCall from '../apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const getMaterialLog = async kitchen => {
  const options = {
    method: 'GET',
    endpoint: `/admin/material-log?kitchen=${kitchen}`,
  }

  return createApiCall(options).fetch()
}

export const createMateralLog = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/material-log`,
    body,
  }

  return createApiCall(options).fetch()
}
