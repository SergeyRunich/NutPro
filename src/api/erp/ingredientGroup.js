import createApiCall from '../apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const getIngredientGroup = async (id = '') => {
  const lastEndpoint = id ? `/erp/ingredientGroup/?id=${id}` : `/erp/ingredientGroup/`
  const options = {
    method: 'GET',
    endpoint: lastEndpoint,
  }

  return createApiCall(options).fetch()
}

export const createNewGroup = async body => {
  const options = {
    method: 'POST',
    endpoint: `/erp/ingredientGroup/`,
    body,
  }

  return createApiCall(options).fetch()
}

export const editGroup = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/erp/ingredientGroup/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const deleteGroup = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/erp/ingredientGroup/${id}`,
  }

  return createApiCall(options).fetch()
}
