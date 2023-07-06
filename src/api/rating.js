import createApiCall from './apicall'

// const port = window.location.hostname === 'localhost' ? '3005' : window.location.port
// const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}/api`

export const getRating = async (
  source = 'rating',
  min = 0,
  diet = '',
  nation = '',
  isIgnoreInRating = true,
  kitchen = 'all',
  isOnlyReview = false,
  minScore = 0,
  maxScore = 5,
  tags = '',
  ignoreTags,
) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/${
      source === 'customer' ? 'ratings-by-customers' : 'ratings'
    }?type=all&min=${min}&diet=${diet}&isCzech=${nation}&isIgnored=${isIgnoreInRating}&kitchen=${kitchen}&isOnlyReview=${isOnlyReview}&minScore=${minScore}&maxScore=${maxScore}&tags=${tags}&ignoreTags=${ignoreTags}`,
  }

  return createApiCall(options).fetch()
}

export const getIgnoredList = async () => {
  const options = {
    method: 'GET',
    endpoint: `/admin/ratings-ignored-list`,
  }

  return createApiCall(options).fetch()
}

export const getTagsList = async () => {
  const options = {
    method: 'GET',
    endpoint: `/erp/techcard/tags `,
  }

  return createApiCall(options).fetch()
}

export const getRatingPeriod = async (
  source = 'rating',
  start,
  end,
  min = 0,
  diet = '',
  nation = '',
  isIgnoreInRating = true,
  kitchen = 'all',
  isOnlyReview = false,
  minScore = 0,
  maxScore = 5,
  tags = '',
  ignoreTags,
) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/${
      source === 'customer' ? 'ratings-by-customers' : 'ratings'
    }?type=period&start=${start}&end=${end}&min=${min}&diet=${diet}&isCzech=${nation}&isIgnored=${isIgnoreInRating}&kitchen=${kitchen}&isOnlyReview=${isOnlyReview}&minScore=${minScore}&maxScore=${maxScore}&tags=${tags}&ignoreTags=${ignoreTags}`,
  }

  return createApiCall(options).fetch()
}

export const getRatingDay = async (
  source = 'rating',
  day,
  min = 0,
  diet = '',
  nation = '',
  isIgnoreInRating = true,
  kitchen = 'all',
  isOnlyReview = false,
  minScore = 0,
  maxScore = 5,
  tags = '',
  ignoreTags,
) => {
  const options = {
    method: 'GET',
    endpoint: `/admin/${
      source === 'customer' ? 'ratings-by-customers' : 'ratings'
    }?type=day&day=${day}&min=${min}&diet=${diet}&isCzech=${nation}&isIgnored=${isIgnoreInRating}&kitchen=${kitchen}&isOnlyReview=${isOnlyReview}&minScore=${minScore}&maxScore=${maxScore}&tags=${tags}&ignoreTags=${ignoreTags}`,
  }

  return createApiCall(options).fetch()
}
