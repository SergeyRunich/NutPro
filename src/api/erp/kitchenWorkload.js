import createApiCall from '../apicall'

export const getKitchenWorkload = async () => {
  const options = {
    method: 'GET',
    endpoint: `/erp/kitchen-power`,
  }

  return createApiCall(options).fetch()
}

export const createKitchenLimit = async body => {
  const options = {
    method: 'POST',
    endpoint: `/erp/kitchen-power`,
    body,
  }

  return createApiCall(options).fetch()
}

export const updateKitchenLimit = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/erp/kitchen-power/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const removeKitchenWorkload = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/erp/kitchen-power/${id}`,
  }

  return createApiCall(options).fetch()
}
