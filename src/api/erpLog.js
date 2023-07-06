import createApiCall from './apicall'

export const getErpLog = async ({ limit = '', systemUser = '', entity = '', action = '' }) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/logs/erp?limit=${limit}&systemUser=${systemUser}&action=${action}&entity=${entity}`,
  }

  return createApiCall(options).fetch()
}

export const noop = () => {}
