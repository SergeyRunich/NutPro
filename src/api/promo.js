import createApiCall from './apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const getPromoCodes = async (status = 'all') => {
  const options = {
    method: 'GET',
    endpoint: `/admin/promo?status=${status}`,
  }

  return createApiCall(options).fetch()
}

export const removePromoCode = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/admin/promo/${id}`,
  }

  return createApiCall(options).fetch()
}

export const createPromoCode = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/promo`,
    body,
  }

  return createApiCall(options).fetch()
}

export const editPromoCode = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/promo/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}
