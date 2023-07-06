import createApiCall from '../apicall'

export const getIngredientTags = async showInactive => {
  const options = {
    method: 'GET',
    endpoint: !showInactive ? `/admin/tag-replacement/all` : `/admin/tag-replacement/active`,
  }

  return createApiCall(options).fetch()
}

export const createIngredientTag = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/tag-replacement`,
    body,
  }

  return createApiCall(options).fetch()
}

export const editIngredientTag = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/tag-replacement/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const deleteIngredientTag = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/admin/tag-replacement/${id}`,
  }

  return createApiCall(options).fetch()
}
