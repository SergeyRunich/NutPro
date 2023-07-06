import createApiCall from './apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const getPickupPoints = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/pickup-points`,
  }

  return createApiCall(options).fetch()
}

export const getPickupPointByDate = async (id, start, end) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/pickup-point/${id}/scheduled-days?orderStartDate=${start}&orderEndDate=${end}&orderStatus=accepted`,
  }

  return createApiCall(options).fetch()
}

export const deletePickupPoint = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/admin/pickup-points/${id}`,
  }

  return createApiCall(options).fetch()
}

export const createPickupPoint = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/pickup-points`,
    body,
  }

  return createApiCall(options).fetch()
}

export const updatePickupPoint = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/pickup-points/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}
