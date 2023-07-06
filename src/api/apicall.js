import { EventEmitter } from 'events'

const ErrorEmitter = new EventEmitter()

const { REACT_APP_API_BASE_URL } = process.env

const createApiCall = ({
  method,
  headers = new Headers(),
  body,
  endpoint,
  authorization = localStorage.getItem('accessToken'),
}) => {
  return {
    method,
    headers,
    body,
    endpoint: `${REACT_APP_API_BASE_URL}${endpoint}`,
    authorization,

    async fetch() {
      if (this.authorization) {
        this.headers.append('Authorization', `Bearer ${authorization}`)
      }

      this.headers.append('content-type', 'application/json')

      this.headers.append('Referrer-Policy', 'same-origin')

      const res = await fetch(`${REACT_APP_API_BASE_URL}${endpoint}`, {
        method: this.method,
        headers: this.headers,
        body: JSON.stringify(this.body),
      }).catch(error => {
        throw error
      })

      if (res.status === 401) {
        ErrorEmitter.emit('401')
      }

      return res
    },
  }
}

export default createApiCall
