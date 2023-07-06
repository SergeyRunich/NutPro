import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { logger } from 'redux-logger'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import { composeWithDevToolsDevelopmentOnly } from '@redux-devtools/extension'
import createSagaMiddleware from 'redux-saga'
import { createHashHistory } from 'history'
import reducers from 'redux/reducers'
import sagas from 'redux/sagas'
import Router from 'router'
import Localization from 'components/LayoutComponents/Localization'
// import * as serviceWorker from './serviceWorker'
import { QueryClient, QueryClientProvider } from 'react-query'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

// app styles
import './global.scss'

const { REACT_APP_SENTRY_DSN, REACT_APP_REDUX_LOGGER } = process.env

Sentry.init({
  dsn: REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
})

const history = createHashHistory()
const sagaMiddleware = createSagaMiddleware()
const routeMiddleware = routerMiddleware(history)
const middlewares = [thunk, sagaMiddleware, routeMiddleware]
if (REACT_APP_REDUX_LOGGER === 'true') {
  middlewares.push(logger)
}
const store = createStore(
  reducers(history),
  compose(composeWithDevToolsDevelopmentOnly(applyMiddleware(...middlewares))),
)
sagaMiddleware.run(sagas)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
})

ReactDOM.render(
  <Provider store={store}>
    <Localization>
      <QueryClientProvider client={queryClient}>
        <Router history={history} />
      </QueryClientProvider>
    </Localization>
  </Provider>,
  document.getElementById('root'),
)

// serviceWorker.register()
export { store, history }
