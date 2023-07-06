import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import { getDocument } from 'services/document'
import actions from './actions'

export function* GET_DOCUMENT({ payload }) {
  const { doc, period, kitchen, start, end, event } = payload
  yield put({
    type: 'document/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(getDocument, doc, period, kitchen, [start, end], event)
  if (response) {
    notification.success({
      message: 'Download document',
      description: 'You have successfully download!',
    })
  }
  yield put({
    type: 'document/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([takeEvery(actions.GET_DOCUMENT, GET_DOCUMENT)])
}
