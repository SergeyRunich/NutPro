import createApiCall from '../apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const getIngredient = async (id = '') => {
  const lastEndpoint = id ? `/erp/ingredient/?id=${id}` : `/erp/ingredient/`
  const options = {
    method: 'GET',
    endpoint: lastEndpoint,
  }

  return createApiCall(options).fetch()
}

export const createIngredient = async body => {
  const options = {
    method: 'POST',
    endpoint: `/erp/ingredient/`,
    body,
  }

  return createApiCall(options).fetch()
}

export const editIngredient = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/erp/ingredient/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const deleteIngredient = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/erp/ingredient/${id}`,
  }

  return createApiCall(options).fetch()
}
