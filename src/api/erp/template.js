import createApiCall from '../apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const getTemplateMenu = async (id = '') => {
  const lastEndpoint = id ? `/erp/template/day/?id=${id}` : `/erp/template/day/`
  const options = {
    method: 'GET',
    endpoint: lastEndpoint,
  }

  return createApiCall(options).fetch()
}

export const createTemplateMenu = async body => {
  const options = {
    method: 'POST',
    endpoint: `/erp/template/day/`,
    body,
  }

  return createApiCall(options).fetch()
}

export const editTemplateMenu = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/erp/template/day/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const deleteTemplateMenu = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/erp/template/day/${id}`,
  }

  return createApiCall(options).fetch()
}

export const copyTemplate = async id => {
  const options = {
    method: 'PUT',
    endpoint: `/erp/template/day/${id}/copy`,
  }

  return createApiCall(options).fetch()
}

export const markDayAsCompleted = async id => {
  const options = {
    method: 'PUT',
    endpoint: `/erp/template/day/${id}/completed`,
  }

  return createApiCall(options).fetch()
}
