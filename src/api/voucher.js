import createApiCall from './apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const getVouchers = async () => {
  const options = {
    method: 'GET',
    endpoint: `/voucher`,
  }

  return createApiCall(options).fetch()
}

export const deleteVoucher = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/voucher/${id}`,
  }

  return createApiCall(options).fetch()
}

export const createVoucher = async body => {
  const options = {
    method: 'POST',
    endpoint: `/voucher`,
    body,
  }

  return createApiCall(options).fetch()
}

export const updateVoucher = async body => {
  const options = {
    method: 'PUT',
    endpoint: `/voucher`,
    body,
  }

  return createApiCall(options).fetch()
}

export const sentVoucher = async id => {
  const options = {
    method: 'POST',
    endpoint: `/voucher/mark-as-sent/${id}`,
  }

  return createApiCall(options).fetch()
}

export const acceptVoucher = async id => {
  const options = {
    method: 'POST',
    endpoint: `/voucher/accept/${id}`,
  }

  return createApiCall(options).fetch()
}
