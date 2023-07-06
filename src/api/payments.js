import createApiCall from './apicall'

export const getGoPayOrderPayments = async (start, end) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/payments?start=${start}&end=${end}`,
  }

  return createApiCall(options).fetch()
}

export const getGoPayOrderPayment = async id => {
  const options = {
    method: 'GET',
    endpoint: `/admin/orders/${id}/payments`,
  }

  return createApiCall(options).fetch()
}

export const createGoPayOrderPayment = async id => {
  const options = {
    method: 'POST',
    endpoint: `/admin/gopay-payment/${id}`,
  }

  return createApiCall(options).fetch()
}
