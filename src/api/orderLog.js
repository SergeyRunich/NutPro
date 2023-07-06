import createApiCall from './apicall'

export const getOrderLog = async ({
  limit = '',
  systemUser = '',
  user = '',
  order = '',
  action = '',
}) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/logs/order?limit=${limit}&systemUser=${systemUser}&user=${user}&order=${order}&action=${action}`,
  }

  return createApiCall(options).fetch()
}

export const getLogsforOrder = async order => {
  const options = {
    method: 'GET',
    endpoint: `/admin/logs/order?order=${order}`,
  }

  return createApiCall(options).fetch()
}
