import createApiCall from './apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const checkAddress = async address => {
  const options = {
    method: 'POST',
    endpoint: `/admin/delivery/checkAddress`,
    body: {
      q: address,
    },
  }

  return createApiCall(options).fetch()
}

export const getDeliveryLog = async (start, end) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/dashboard/finance/delivery-log/?start=${start}&end=${end}`,
  }

  return createApiCall(options).fetch()
}

export const getDeliveryFeeXlsx = async (start, end) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/dashboard/finance/delivery-fee/export/?start=${start}&end=${end}`,
  }

  return createApiCall(options).fetch()
}

export const putDeliveryLog = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/dashboard/finance/delivery-log/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}
