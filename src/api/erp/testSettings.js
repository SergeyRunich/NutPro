import createApiCall from '../apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const getIngredientFrequency = async () => {
  const options = {
    method: 'GET',
    endpoint: `/settings/erp/test/ingredientFrequency`,
  }

  return createApiCall(options).fetch()
}

export const updateIngredientFrequency = async body => {
  const options = {
    method: 'POST',
    endpoint: `/settings/erp/test/ingredientFrequency`,
    body,
  }

  return createApiCall(options).fetch()
}

export const getDayKcal = async () => {
  const options = {
    method: 'GET',
    endpoint: `/settings/erp/test/dayKcal`,
  }

  return createApiCall(options).fetch()
}

export const updateDayKcal = async body => {
  const options = {
    method: 'POST',
    endpoint: `/settings/erp/test/dayKcal`,
    body,
  }

  return createApiCall(options).fetch()
}

export const startMainWeekTest = async body => {
  const options = {
    method: 'POST',
    endpoint: `/erp/test/week/energy`,
    body,
  }

  return createApiCall(options).fetch()
}

export const startUserWeekTest = async body => {
  const options = {
    method: 'POST',
    endpoint: `/erp/test/week/user`,
    body,
  }

  return createApiCall(options).fetch()
}

export const loadLastWeekTest = async id => {
  const options = {
    method: 'GET',
    endpoint: `/erp/test/week/user/${id}`,
  }

  return createApiCall(options).fetch()
}

export const startMainDayTest = async body => {
  const options = {
    method: 'POST',
    endpoint: `/erp/test/day/energy`,
    body,
  }

  return createApiCall(options).fetch()
}

export const startTagWeekTest = async body => {
  const options = {
    method: 'POST',
    endpoint: `/erp/test/week/tag`,
    body,
  }

  return createApiCall(options).fetch()
}
