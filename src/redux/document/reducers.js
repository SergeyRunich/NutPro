import actions from './actions'

const initialState = {
  loading: false,
  blob: '',
}

export default function documentReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
