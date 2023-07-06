import createApiCall from './apicall'

export const getAllKitchen = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/kitchen`,
  }

  return createApiCall(options).fetch()
}

export const getPrefKitchen = async (date, salad) => {
  const options = {
    method: 'GET',
    endpoint: !salad
      ? `/erp/kitchen-by-timestamp/${date}`
      : `/erp/kitchen-by-timestamp/${date}?salad=1`,
  }

  return createApiCall(options).fetch()
}

export const regenerateErpKitchen = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/erp/regenerate`,
    body,
  }

  return createApiCall(options).fetch()
}

export const downloadWeekMenu = async (date, b2b = '') => {
  const options = {
    method: 'GET',
    endpoint: `/admin/menu/week/${date}?b2b=${b2b}`,
  }

  return createApiCall(options).fetch()
}

// export const createUser = async body => {
//     const options = {
//         method: 'POST',
//         endpoint: `/admin/user`,
//         body,
//     }

//     return createApiCall(options).fetch()
// }

// export const deleteUser = async id => {
//     const options = {
//         method: 'DELETE',
//         endpoint: `/admin/user/${id}`,
//     }

//     return createApiCall(options).fetch()
// }

// export const resetPasswordToUser = async (id, body) => {
//     const options = {
//         method: 'PUT',
//         endpoint: `/admin/user/password/${id}`,
//         body,
//     }
//     return createApiCall(options).fetch()
// }

// export const changeUserTag = async (id, tag) => {
//     const options = {
//         method: 'POST',
//         endpoint: `/admin/users/${id}/tag`,
//         body: { tag },
//     }

//     return createApiCall(options).fetch()
// }

// export const syncBitrixAll = async () => {
//     const options = {
//         method: 'POST',
//         endpoint: `/admin/bitrix/sync`,
//     }

//     return createApiCall(options).fetch()
// }

// export const syncBitrixCompare = async () => {
//     const options = {
//         method: 'POST',
//         endpoint: `/admin/bitrix/compare`,
//     }

//     return createApiCall(options).fetch()
// }

// export const syncBitrixUser = async id => {
//     const options = {
//         method: 'POST',
//         endpoint: `/admin/bitrix/sync/one/${id}`,
//     }
//     return createApiCall(options).fetch()
// }

// export const pushKitchenHistory = async body => {
//     const options = {
//         method: 'POST',
//         endpoint: `/admin/user/kitchen`,
//         body,
//     }

//     return createApiCall(options).fetch()
// }
