import createApiCall from '../apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const getTechcard = async (id = '') => {
  const lastEndpoint = id ? `/erp/techcard/?id=${id}` : `/erp/techcard/`
  const options = {
    method: 'GET',
    endpoint: lastEndpoint,
  }

  return createApiCall(options).fetch()
}

export const getTechcardByTag = async tag => {
  const options = {
    method: 'GET',
    endpoint: `/erp/techcard/?tag=${tag}`,
  }

  return createApiCall(options).fetch()
}

export const downloadTechcard = async (id, cf) => {
  const options = {
    method: 'GET',
    endpoint: `/erp/download-techcard/?techcardId=${id}&cf=${cf}`,
  }

  return createApiCall(options).fetch()
}

export const createTechcard = async body => {
  const options = {
    method: 'POST',
    endpoint: `/erp/techcard/`,
    body,
  }

  return createApiCall(options).fetch()
}

export const editTechcard = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/erp/techcard/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const deleteTechcard = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/erp/techcard/${id}`,
  }

  return createApiCall(options).fetch()
}

export const getTechcardTags = async () => {
  const options = {
    method: 'GET',
    endpoint: `/erp/techcard/tags`,
  }

  return createApiCall(options).fetch()
}
