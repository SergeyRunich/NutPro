import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import { currentAccountJWT, logout, loginJWT } from 'services/user'
import actions from './actions'

export function* LOGIN({ payload }) {
  const { login, password } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const success = yield call(loginJWT, login, password)
  if (success === 200) {
    notification.success({
      message: 'Logged In',
      description: 'You have successfully logged!',
    })
    yield put({
      type: 'user/LOAD_CURRENT_ACCOUNT',
    })
  }
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
  if (success === 401) {
    notification.error({
      message: 'Auth error',
      description: 'Incorrect login or password!',
    })
  }
  if (success === 422) {
    notification.error({
      message: 'Data error',
      description: 'Unknown error!',
    })
  }
}

export function* LOAD_CURRENT_ACCOUNT() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(currentAccountJWT)
  if (response) {
    if (response.responseCode !== 401) {
      // const { uid: id, email, photoURL: avatar } = response
      const { userId: id, inBodyId: name, role, branches } = response
      if (name === 'Slava') {
        yield call(logout)
        yield put({
          type: 'user/SET_STATE',
          payload: {
            id: '',
            name: '',
            role: '',
            // email: '',
            // avatar: '',
            branches: [],
            authorized: false,
            loading: false,
          },
        })
      } else {
        yield put({
          type: 'user/SET_STATE',
          payload: {
            id,
            name,
            role,
            branches,
            authorized: true,
          },
        })
      }
    }
  }
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* LOGOUT() {
  yield call(logout)
  yield put({
    type: 'user/SET_STATE',
    payload: {
      id: '',
      name: '',
      role: '',
      // email: '',
      // avatar: '',
      branches: [],
      authorized: false,
      loading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
