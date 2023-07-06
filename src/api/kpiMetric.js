import createApiCall from './apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const createKpiMetric = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/kpi-metric`,
    body,
  }

  return createApiCall(options).fetch()
}

export const getKpiMetric = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/kpi-metric`,
  }

  return createApiCall(options).fetch()
}

export const updateKpiMetric = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/kpi-metric/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const deleteKpiMetric = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/admin/kpi-metric/${id}`,
  }

  return createApiCall(options).fetch()
}

// -----------------------------------------

export const createKpiPlan = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/kpi-plan`,
    body,
  }

  return createApiCall(options).fetch()
}

export const getKpiPlan = async (start = '', end = '') => {
  const options = {
    method: 'GET',
    endpoint: `/admin/kpi-plan?start=${start}&end=${end}`,
  }

  return createApiCall(options).fetch()
}

export const updateKpiPlan = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/kpi-plan/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const deleteKpiPlan = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/admin/kpi-plan/${id}`,
  }

  return createApiCall(options).fetch()
}

// -----------------------------------------

export const getKpiSource = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/kpi-source`,
  }

  return createApiCall(options).fetch()
}

export const getCustomersByPeriod = async (start, end) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/kpi-customers?start=${start}&end=${end}`,
  }

  return createApiCall(options).fetch()
}
