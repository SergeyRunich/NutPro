import createApiCall from './apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const getDocument = async (doc, period, kitchen, dates, event) => {
  const options = {
    method: 'POST',
    endpoint: `/erp/document/${doc}/${kitchen}/${period}?start=${dates[0]}&end=${dates[1]}&event=${event}`,
  }

  return createApiCall(options).fetch()
}

export const sendDocuments = async (doc, period, kitchen, dates, body) => {
  const options = {
    method: 'POST',
    endpoint: `/erp/document/${doc}/${kitchen}/${period}?start=${dates[0]}&end=${dates[1]}`,
    body,
  }

  return createApiCall(options).fetch()
}

export const showDocument = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/meta`,
  }

  return createApiCall(options).fetch()
}

export const sendMenu = async (timestamp, kitchen) => {
  const options = {
    method: 'POST',
    endpoint: `/erp/menu/generate?timestamp=${timestamp}&kitchen=${kitchen}`,
  }

  return createApiCall(options).fetch()
}

export const sendWatchdog = async (dateMin, dateMax) => {
  const options = {
    method: 'POST',
    endpoint: `/erp/utils/watchdog/${dateMin}/${dateMax}`,
  }

  return createApiCall(options).fetch()
}

export const getSettings = async () => {
  const options = {
    method: 'GET',
    endpoint: `/kitchen/settings`,
  }

  return createApiCall(options).fetch()
}

export const turnAllowForKitchen = async () => {
  const options = {
    method: 'POST',
    endpoint: `/admin/kitchen/settings/turn/allowDownload/`,
  }

  return createApiCall(options).fetch()
}

export const getAllowStatus = async (kitchen, timestamp) => {
  const options = {
    method: 'GET',
    endpoint: `/kitchen/allowDownload/${kitchen}/${timestamp}`,
  }

  return createApiCall(options).fetch()
}

export const turnAllowStatus = async (kitchen, timestamp) => {
  const options = {
    method: 'POST',
    endpoint: `/admin/kitchen/allowDownload/${kitchen}/${timestamp}`,
  }

  return createApiCall(options).fetch()
}

export const getAllowHistory = async kitchen => {
  const options = {
    method: 'GET',
    endpoint: `/kitchen/allowDownload/${kitchen}`,
  }

  return createApiCall(options).fetch()
}

export const getExtremeIngredients = async (period, kitchen, dates) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/kitchen/extreme-ingredients/${period}/${kitchen}?start=${dates[0]}&end=${dates[1]}`,
  }

  return createApiCall(options).fetch()
}

export const postKitchenApplicationLog = async (period, kitchen, dates) => {
  const options = {
    method: 'POST',
    endpoint: `/admin/kitchen/application-log/`,
    body: {
      period,
      kitchen,
      start: dates[0],
      end: dates[1],
    },
  }

  return createApiCall(options).fetch()
}

export const getKitchenApplicationLog = async (period, kitchen, dates, diffPercent) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/kitchen/application-log/?period=${period}&kitchen=${kitchen}&start=${dates[0]}&end=${dates[1]}&percent=${diffPercent}`,
  }

  return createApiCall(options).fetch()
}
