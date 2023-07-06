import createApiCall from './apicall'

export const getAllOrders = async (
  stage = 'active',
  status = 'all',
  sales = 'all',
  filter = 'all',
  type = 'normal',
) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/order/?stage=${stage}&status=${status}&sales=${sales}&filter=${filter}&type=${type}`,
  }

  return createApiCall(options).fetch()
}

export const getWebOrders = async (stage = 'active', status = 'all') => {
  const options = {
    method: 'GET',
    endpoint: `/admin/web-order/?stage=${stage}&status=${status}`,
  }

  return createApiCall(options).fetch()
}

export const getUnpaidOrders = async (stage = '') => {
  const options = {
    method: 'GET',
    endpoint: `/admin/unpaid-order/?stage=${stage}`,
  }

  return createApiCall(options).fetch()
}

export const getUserOrders = async user => {
  const options = {
    method: 'GET',
    endpoint: `/admin/order/?user=${user}&stage=all&sales=all`,
  }

  return createApiCall(options).fetch()
}

export const getOrder = async id => {
  const options = {
    method: 'GET',
    endpoint: `/admin/order/${id}`,
  }

  return createApiCall(options).fetch()
}

export const changeOrderStatus = async (status, id, invoice = true) => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/orders/${id}/status/${status}?invoice=${invoice}`,
  }

  return createApiCall(options).fetch()
}

export const acceptCompanyOrder = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/orders/${id}/accept-company`,
    body,
  }

  return createApiCall(options).fetch()
}

export const getOrdersReqForApproval = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/invoices/request-for-approval/`,
  }

  return createApiCall(options).fetch()
}

export const updateOrder = async params => {
  const { id, ...body } = params
  const options = {
    method: 'PUT',
    endpoint: `/admin/orders/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const deleteOrder = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/admin/orders/${id}`,
  }

  return createApiCall(options).fetch()
}

export const rejectOrApprovePrice = async body => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/invoices/request-for-approval/status`,
    body,
  }

  return createApiCall(options).fetch()
}

export const quickProlongOrder = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/orders/prolong`,
    body,
  }

  return createApiCall(options).fetch()
}

export const deletePriceApprovalReq = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/admin/invoices/request-for-approval/${id}`,
  }

  return createApiCall(options).fetch()
}

export const getNewPriceAprrovalPending = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/invoices/request-for-approval/`,
  }

  return createApiCall(options).fetch()
}

export const postOrder = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/order/create`,
    body,
  }

  return createApiCall(options).fetch()
}

export const postB2BOrder = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/b2b-order`,
    body,
  }

  return createApiCall(options).fetch()
}

export const getInfoB2BOrder = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/b2b-order-info`,
    body,
  }

  return createApiCall(options).fetch()
}

export const calculateOrder = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/order/calculate`,
    body,
  }

  return createApiCall(options).fetch()
}

export const getOrderPrice = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/order/getPrice`,
    body,
  }

  return createApiCall(options).fetch()
}

export const regenerateOrder = async id => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/orders/newAlgo/${id}/regenerate`,
  }

  return createApiCall(options).fetch()
}

export const regenerateAllOrders = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/orders/regenerate-many`,
    body,
  }

  return createApiCall(options).fetch()
}

export const removeAllOrders = async body => {
  const options = {
    method: 'DELETE',
    endpoint: `/admin/erp/remove-day-many`,
    body,
  }

  return createApiCall(options).fetch()
}

export const sendInvoiceEmail = async id => {
  const options = {
    method: 'POST',
    endpoint: `/admin/orders/${id}/resend_invoice`,
  }
  return createApiCall(options).fetch()
}

export const sendAdditionalInfoEmail = async id => {
  const options = {
    method: 'POST',
    endpoint: `/admin/orders/${id}/send-additional-info-email`,
  }
  return createApiCall(options).fetch()
}

export const calculatePriceWithPromo = async ({ originalPrice, promoCode }) => {
  const options = {
    method: 'POST',
    endpoint: `/admin/promo/price`,
    body: { originalPrice, promoCode },
  }

  return createApiCall(options).fetch()
}

export const addPause = async params => {
  const { id, ...body } = params
  const options = {
    method: 'POST',
    endpoint: `/admin/orders/pauses/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const updatePause = async params => {
  const { id, ...body } = params
  const options = {
    method: 'PUT',
    endpoint: `/admin/orders/pauses/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const checkPriceChange = async params => {
  const { id, ...body } = params
  const options = {
    method: 'PATCH',
    endpoint: `/admin/orders/price-status/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const deletePause = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/admin/orders/pauses/${id}`,
  }

  return createApiCall(options).fetch()
}

export const customInvoiceName = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/orders/custom-invoice-name/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const getInvoicesByStatus = async (status = 'overdue') => {
  const options = {
    method: 'GET',
    endpoint: `/admin/order/invoices/status/${status}`,
  }

  return createApiCall(options).fetch()
}

export const sendApprovalRequest = async id => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/order/${id}/requestForApprovalNewPrice/`,
  }

  return createApiCall(options).fetch()
}

export const sendApprovalWithoutInvoice = async id => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/order/${id}/request-approve-without-invoice/`,
  }

  return createApiCall(options).fetch()
}

export const createQuickOrder = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/order/quick`,
    body,
  }

  return createApiCall(options).fetch()
}

export const checkUserInQuickOrder = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/order/quick/checkUser`,
    body,
  }

  return createApiCall(options).fetch()
}

export const acceptWeb = async id => {
  const options = {
    method: 'POST',
    endpoint: `/admin/order/${id}/acceptWeb`,
  }

  return createApiCall(options).fetch()
}

export const shorteringOrder = async (id, body) => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/order/${id}/shortering`,
    body,
  }

  return createApiCall(options).fetch()
}

export const getEvents = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/events`,
  }

  return createApiCall(options).fetch()
}

export const createEvent = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/events`,
    body,
  }

  return createApiCall(options).fetch()
}

export const approveEvent = async id => {
  const options = {
    method: 'POST',
    endpoint: `/admin/events/approve/${id}`,
  }

  return createApiCall(options).fetch()
}

export const editEvent = async (id, body) => {
  const options = {
    method: 'PATCH',
    endpoint: `/admin/events/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const getInvoiceStatus = async id => {
  const options = {
    method: 'GET',
    endpoint: `/admin/invoice-status/${id}`,
  }

  return createApiCall(options).fetch()
}

export const cancelOrder = async (id, body) => {
  const options = {
    method: 'POST',
    endpoint: `/admin/cancel-order/${id}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const getSalesList = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/sales-list`,
  }

  return createApiCall(options).fetch()
}

export const getPauseData = async (start, end) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/orders-multi-pause?start=${start}&end=${end}`,
  }

  return createApiCall(options).fetch()
}

export const setMultiPauses = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/set-multi-pauses`,
    body,
  }

  return createApiCall(options).fetch()
}

export const getCalculatedSplitPaymentData = async orderId => {
  const options = {
    method: 'GET',
    endpoint: `/admin/calculate-split-payments?orderId=${orderId}`,
  }

  return createApiCall(options).fetch()
}

export const acceptOrderWithSplitedInvoice = async id => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/orders/${id}/status/accepted?invoice=true&isSplitPayment=true`,
  }

  return createApiCall(options).fetch()
}
