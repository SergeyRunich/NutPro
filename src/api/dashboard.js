import createApiCall from './apicall'

export const getMainData = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/dashboard/main`,
  }

  return createApiCall(options).fetch()
}

export const getCompareData = async (period, dates = ['', ''], kcalError = false) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/dashboard/compare/${period}/?startDate=${dates[0]}&endDate=${dates[1]}&kcalError=${kcalError}`,
  }

  return createApiCall(options).fetch()
}

export const removeRegeneratedDay = async id => {
  const options = {
    method: 'DELETE',
    endpoint: `/admin/erp/remove-day/${id}`,
  }

  return createApiCall(options).fetch()
}

export const getCustomersData = async (start, end) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/dashboard/finance/customers/${start}/${end}`,
  }

  return createApiCall(options).fetch()
}

export const getSalesWeeksData = async (start, end) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/dashboard/sales/sold-weeks?start=${start}&end=${end}`,
  }

  return createApiCall(options).fetch()
}

// /admin/dashboard/sales/sold-weeks/start=01-10-2021&end=31-10-2021
// /admin/dashboard/sales/sold-weeks?start=01-08-2021&end=31-08-2021

export const getKitchenData = async (kitchen, start, end) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/dashboard/finance/kitchen/${kitchen}/${start}/${end}`,
  }

  return createApiCall(options).fetch()
}

export const getKitchenInvoice = async (kitchen, start, end) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/finance/kitchen-invoice?kitchenId=${kitchen}&endDate=${end}&startDate=${start}`,
  }

  return createApiCall(options).fetch()
}

export const getCustomerCost = async (kitchen, start, end) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/finance/customer-cost?kitchenId=${kitchen}&endDate=${end}&startDate=${start}`,
  }

  return createApiCall(options).fetch()
}

export const getMargin = async (kitchen, start, end) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/finance/margin?kitchenId=${kitchen}&endDate=${end}&startDate=${start}`,
  }

  return createApiCall(options).fetch()
}

export const getOrdersByDayData = async (kitchen, start, end) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/dashboard/finance/orders/${kitchen}/${start}/${end}`,
  }

  return createApiCall(options).fetch()
}

export const getMarginByPeriodData = async (
  kitchen,
  start,
  end,
  b2b = { filter: '', status: '' },
) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/dashboard/finance/${kitchen}/${start}/${end}?b2bFilter=${b2b.filter}&b2bStatus=${b2b.status}`,
  }

  return createApiCall(options).fetch()
}

export const getMarginByMonth = async kitchen => {
  const options = {
    method: 'GET',
    endpoint: `/admin/dashboard/finance/${kitchen}`,
  }

  return createApiCall(options).fetch()
}

export const regenerateErpKitchen = async () => {
  const options = {
    method: 'POST',
    endpoint: `/admin/erp/regenerate`,
  }

  return createApiCall(options).fetch()
}

export const regenerationProgress = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/kitchen/generation/status`,
  }

  return createApiCall(options).fetch()
}

export const multiSearch = async body => {
  const options = {
    method: 'POST',
    endpoint: `/admin/search/`,
    body,
  }

  return createApiCall(options).fetch()
}

export const getVerificationOrders = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/order/status/verification`,
  }

  return createApiCall(options).fetch()
}

export const getCustomOrders = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/order/status/verification/customMenu`,
  }

  return createApiCall(options).fetch()
}

export const approveCustomOrder = async id => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/order/${id}/approveCustomMenu`,
  }

  return createApiCall(options).fetch()
}

export const approveOrder = async id => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/order/${id}/approve`,
  }

  return createApiCall(options).fetch()
}

export const getOrdersWithReculculatedPrice = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/order/approval/changedPrice`,
  }

  return createApiCall(options).fetch()
}

export const getVerificationDeliveryFeeOrders = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/approveDeliveryFee/getList`,
  }

  return createApiCall(options).fetch()
}

export const approveRecalculatedPrice = async id => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/order/${id}/approveNewPrice`,
  }

  return createApiCall(options).fetch()
}

export const approveDeliveryFee = async id => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/order/${id}/approveDeliveryFee`,
  }

  return createApiCall(options).fetch()
}

export const rejectRecalculatedPrice = async id => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/order/${id}/rejectNewPrice`,
  }

  return createApiCall(options).fetch()
}

export const getMacroRanges = async (meals = 5) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/test/view/minmax?meals=${meals}`,
  }

  return createApiCall(options).fetch()
}

export const getNumberOfOrders = async past => {
  const options = {
    method: 'GET',
    endpoint: `/admin/ordersCount/${past}`,
  }

  return createApiCall(options).fetch()
}

export const getSalesDashboardMainData = async (start = null, end = null) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/dashboard/sales/main-data?start=${start}&end=${end}`,
  }

  return createApiCall(options).fetch()
}

export const getSalesDashboardActiveOrders = async (start = null, end = null) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/dashboard/sales/active-orders?start=${start}&end=${end}`,
  }

  return createApiCall(options).fetch()
}

export const getSalesDashboardB2B = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/dashboard/sales/b2b`,
  }

  return createApiCall(options).fetch()
}

export const getSalesDataByManager = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/dashboard/sales/byManager`,
  }

  return createApiCall(options).fetch()
}

export const getPromoStats = async (start, end) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/dashboard/sales/promocodes?start=${start}&end=${end}`,
  }

  return createApiCall(options).fetch()
}

export const getSalesDashboardStatsData = async (start = null, end = null) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/dashboard/sales/chart-data/${
      start && end ? `?start=${start}&end=${end}` : ''
    }`,
  }

  return createApiCall(options).fetch()
}

export const getSalesDashboardGlobalData = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/dashboard/sales/global-chart-data/`,
  }

  return createApiCall(options).fetch()
}

export const getStfData = async (start, end) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/dashboard/sales/stf/${start}/${end}`,
  }

  return createApiCall(options).fetch()
}

export const getStfByPeriod = async (start, end, body) => {
  const options = {
    method: 'POST',
    endpoint: `/admin/sales/stf/${start}/${end}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const getPMTByPeriod = async (start, end, body) => {
  const options = {
    method: 'POST',
    endpoint: `/admin/tool/price-modelling/${start}/${end}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const getLodData = async (start, end, download) => {
  const options = {
    method: 'GET',
    endpoint: !download
      ? `/admin/debtors/?start=${start}&end=${end}`
      : `/admin/debtors/?export=1&start=${start}&end=${end}`,
  }

  return createApiCall(options).fetch()
}

export const sendLodNotification = async params => {
  const { id, status } = params
  const options = {
    method: 'PUT',
    endpoint: `/admin/order-turn-debt-notification`,
    body: {
      id,
      status,
    },
  }

  return createApiCall(options).fetch()
}

export const sendLodCollector = async params => {
  const { id, status } = params
  const options = {
    method: 'PUT',
    endpoint: `/admin/order-turn-debt-collector`,
    body: {
      id,
      status,
    },
  }

  return createApiCall(options).fetch()
}

export const approveWithoutInvoice = async (id, answer = 'reject') => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/order/${id}/approve-without-invoice/${answer}`,
  }

  return createApiCall(options).fetch()
}

export const getWithoutInvoice = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/order/approve/without-invoice`,
  }

  return createApiCall(options).fetch()
}

export const getInvoicesForRefund = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/invoices/refund`,
  }

  return createApiCall(options).fetch()
}

export const changeRefundStatus = async body => {
  const options = {
    method: 'PUT',
    endpoint: `/admin/invoices/refund/status`,
    body,
  }

  return createApiCall(options).fetch()
}
