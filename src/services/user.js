import { notification } from 'antd'
import * as API from '../api/user'

async function loginReq(username, password) {
  const res = await API.loginUser({ username, password })
  if (res.ok) {
    const { accessToken } = await res.json()
    if (!accessToken) {
      return 500
    }
    localStorage.setItem('accessToken', accessToken)
    return 200
  }
  return res.status
}

export async function loginJWT(username, password) {
  return loginReq(username, password)
    .then(code => code)
    .catch(error => {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    })
}

export async function currentAccountJWT() {
  function getCurrentUser() {
    return new Promise(resolve => {
      API.getUserData().then(res => resolve(res.json()))
    })
  }
  return getCurrentUser()
}

export async function logout() {
  localStorage.removeItem('accessToken')
  return true
}
