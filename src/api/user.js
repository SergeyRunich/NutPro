import createApiCall from './apicall'

export const loginUser = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/sign_in`,
    body,
    authorization: false,
  }

  return createApiCall(options).fetch()
}

export const getUserData = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/meta`,
  }

  return createApiCall(options).fetch()
}

export const getSystemUsers = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/system-users`,
  }

  return createApiCall(options).fetch()
}

export const updateSettings = async body => {
  const options = {
    method: 'PATCH',
    endpoint: `/users/me`,
    body,
  }

  return createApiCall(options).fetch()
}

export const changePassword = async body => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/password`,
    body,
  }

  return createApiCall(options).fetch()
}

export const getAllUsers = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/system-users?all=1`,
  }

  return createApiCall(options).fetch()
}

export const getAllBranches = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/branches`,
  }

  return createApiCall(options).fetch()
}

export const deactivateUser = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/admin/system-users/${id}`,
  }

  return createApiCall(options).fetch()
}

export const createUser = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/system-users`,
    body,
  }

  return createApiCall(options).fetch()
}

export const editUser = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/system-users/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const changeUserPassword = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/system-user/${id}/change-password`,
    body,
  }

  return createApiCall(options).fetch()
}
