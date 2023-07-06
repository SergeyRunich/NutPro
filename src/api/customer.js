import createApiCall from './apicall'

export const getAllUsers = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/user`,
  }

  return createApiCall(options).fetch()
}

export const getUser = async id => {
  const options = {
    method: 'GET',
    endpoint: `/admin/user/${id}`,
  }

  return createApiCall(options).fetch()
}

export const getUserCreditHistory = async id => {
  const options = {
    method: 'GET',
    endpoint: `/admin/customer-credit-balance/${id}`,
  }

  return createApiCall(options).fetch()
}

export const getUserKitchenByDate = async (id, date) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/user-kitchen/${id}/${date}`,
  }

  return createApiCall(options).fetch()
}

export const createUser = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/user`,
    body,
  }

  return createApiCall(options).fetch()
}

export const createUserMulti = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/user/multi`,
    body,
  }

  return createApiCall(options).fetch()
}

export const deleteUser = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/admin/user/${id}`,
  }

  return createApiCall(options).fetch()
}

export const resetPasswordToUser = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/user/password/${id}`,
    body,
  }
  return createApiCall(options).fetch()
}

export const generatePasswordToUser = async id => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/user/generate-password/${id}`,
  }
  return createApiCall(options).fetch()
}

export const changeUserTag = async (id, tag) => {
  const options = {
    method: 'POST',
    endpoint: `/admin/users/${id}/tag`,
    body: { tag },
  }

  return createApiCall(options).fetch()
}

export const changeUserLanguage = async (id, language) => {
  const options = {
    method: 'POST',
    endpoint: `/admin/user/${id}/language`,
    body: { lang: language },
  }

  return createApiCall(options).fetch()
}

export const changeIgnoreTag = async (id, isIgnoreInRating) => {
  const options = {
    method: 'POST',
    endpoint: `/admin/user/${id}/ignore-rating`,
    body: { isIgnoreInRating },
  }

  return createApiCall(options).fetch()
}

export const setCzech = async id => {
  const options = {
    method: 'POST',
    endpoint: `/admin/user/${id}/notCzech`,
  }

  return createApiCall(options).fetch()
}

export const syncBitrixAll = async () => {
  const options = {
    method: 'POST',
    endpoint: `/admin/bitrix/sync`,
  }

  return createApiCall(options).fetch()
}

export const syncBitrixCompare = async () => {
  const options = {
    method: 'POST',
    endpoint: `/admin/bitrix/compare`,
  }

  return createApiCall(options).fetch()
}

export const syncBitrixUser = async id => {
  const options = {
    method: 'POST',
    endpoint: `/admin/bitrix/sync/one/${id}`,
  }
  return createApiCall(options).fetch()
}

export const syncNewBitrixUser = async id => {
  const options = {
    method: 'POST',
    endpoint: `/admin/bitrix/sync-new/one/${id}/?token=DS968r7DVsyUq65rXZ2NY7cz`,
  }
  return createApiCall(options).fetch()
}

export const pushKitchenHistory = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/user/kitchen`,
    body,
  }

  return createApiCall(options).fetch()
}

export const deleteLastKitchenHistory = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/admin/user/kitchen/last/${id}`,
  }

  return createApiCall(options).fetch()
}

export const restoreUser = async id => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/user/restore/${id}`,
  }

  return createApiCall(options).fetch()
}

export const editProfile = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/user/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const createNewDataset = async (id, body) => {
  const options = {
    method: 'POST',
    endpoint: `/admin/users/${id}/dataset`,
    body,
  }

  return createApiCall(options).fetch()
}

export const deleteDataset = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/admin/users/dataset/${id}`,
  }

  return createApiCall(options).fetch()
}
