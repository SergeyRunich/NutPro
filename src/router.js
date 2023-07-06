import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Loadable from 'react-loadable'

import Loader from 'components/LayoutComponents/Loader'
import IndexLayout from 'layouts'
import NotFoundPage from 'pages/404'

const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => <Loader />,
  })

const routes = [
  // System Pages
  {
    path: '/user/login',
    component: loadable(() => import('pages/user/login')),
    exact: true,
  },

  // ERP:documents
  {
    path: '/documents/send',
    component: loadable(() => import('pages/documents/send')),
  },

  // ERP
  {
    path: '/erp/groupIngredient',
    component: loadable(() => import('pages/erp/groupIngredient')),
  },
  {
    path: '/erp/ingredient',
    component: loadable(() => import('pages/erp/ingredient')),
  },
  {
    path: '/erp/tags',
    component: loadable(() => import('pages/erp/tags')),
  },
  {
    path: '/erp/techcard',
    component: loadable(() => import('pages/erp/techcard')),
  },
  {
    path: '/erp/template',
    component: loadable(() => import('pages/erp/templateMenu')),
  },
  {
    path: '/erp/weekTemplate',
    component: loadable(() => import('pages/erp/weekTemplate')),
  },
  {
    path: '/erp/calendar/weekly',
    component: loadable(() => import('pages/erp/weeklyCalendar')),
  },
  {
    path: '/erp/week-template',
    component: loadable(() => import('pages/erp/templateManagementSystem')),
  },
  {
    path: '/erp/calendar',
    component: loadable(() => import('pages/erp/calendar')),
  },
  {
    path: '/erp/foodcost',
    component: loadable(() => import('pages/erp/foodcost')),
  },
  {
    path: '/settings/algo',
    component: loadable(() => import('pages/settings/algo')),
  },

  {
    path: '/events',
    component: loadable(() => import('pages/events')),
  },
  {
    path: '/erp/kitchen-workload',
    component: loadable(() => import('pages/erp/kitchenWorkload')),
  },

  // Control panel
  {
    path: '/users/test/kcal',
    component: loadable(() => import('pages/erp/users/testKcal')),
  },
  {
    path: '/menu/:userId',
    component: loadable(() => import('pages/erp/users/MenuList')),
  },
  {
    path: '/menu/:userId/:orderId',
    component: loadable(() => import('pages/erp/users/MenuList')),
  },
  {
    path: '/dashboard/ranges/macro',
    component: loadable(() => import('pages/dashboard/macroRanges')),
  },
  {
    path: '/users/:id',
    component: loadable(() => import('pages/users/profile')),
  },
  {
    path: '/users',
    component: loadable(() => import('pages/users')),
  },
  {
    path: '/main',
    component: loadable(() => import('pages/dashboard/main')),
  },
  {
    path: '/logs/order',
    component: loadable(() => import('pages/dashboard/orderLog')),
  },
  {
    path: '/logs/erp',
    component: loadable(() => import('pages/dashboard/erpLog')),
  },
  {
    path: '/dashboard/kitchen',
    component: loadable(() => import('pages/dashboard/kitchen')),
  },
  {
    path: '/dashboard/approvals',
    component: loadable(() => import('pages/dashboard/approvals')),
  },
  {
    path: '/dashboard/production-dashboard',
    component: loadable(() => import('pages/dashboard/ProductionDashboard')),
  },
  {
    path: '/dashboard/production-buffer',
    component: loadable(() => import('pages/dashboard/BufferWidget')),
  },
  {
    path: '/dashboard/finance',
    component: loadable(() => import('pages/dashboard/finance')),
  },
  {
    path: '/payments',
    component: loadable(() => import('pages/payments')),
  },
  {
    path: '/orders/create/:id/:prolong',
    component: loadable(() => import('pages/orders/createOrder')),
  },
  {
    path: '/orders/create/:id',
    component: loadable(() => import('pages/orders/createOrder')),
  },
  {
    path: '/orders/create',
    component: loadable(() => import('pages/orders/quickOrder')),
  },
  {
    path: '/b2b-order/:id',
    component: loadable(() => import('pages/orders/b2bOrder')),
  },
  {
    path: '/orders/:id',
    component: loadable(() => import('pages/orders/viewOrder')),
  },
  {
    path: '/orders',
    component: loadable(() => import('pages/orders')),
  },
  {
    path: '/promocodes',
    component: loadable(() => import('pages/promocodes')),
  },
  {
    path: '/vouchers',
    component: loadable(() => import('pages/voucher')),
  },
  {
    path: '/pickup-points',
    component: loadable(() => import('pages/pickup-point')),
  },
  {
    path: '/checking-pauses',
    component: loadable(() => import('pages/checking-pauses')),
  },
  {
    path: '/dashboard/kpi',
    component: loadable(() => import('pages/dashboard/kpi')),
  },

  {
    path: '/settings/kitchenUser',
    component: loadable(() => import('pages/settings/kitchenUser')),
  },

  {
    path: '/settings/userManagement',
    component: loadable(() => import('pages/settings/userManagement')),
  },

  {
    path: '/settings/erpTest',
    component: loadable(() => import('pages/settings/erpTest')),
  },

  {
    path: '/materials',
    component: loadable(() => import('pages/settings/materials')),
  },
  {
    path: '/dashboard/sales',
    component: loadable(() => import('pages/dashboard/sales')),
    exact: true,
  },
  {
    path: '/dashboard/production',
    component: loadable(() => import('pages/dashboard/production')),
    exact: true,
  },
  {
    path: '/dashboard/stf',
    component: loadable(() => import('pages/dashboard/stf')),
    exact: true,
  },
  {
    path: '/dashboard/pmt',
    component: loadable(() => import('pages/dashboard/pmt')),
    exact: true,
  },
  {
    path: '/dashboard/lod',
    component: loadable(() => import('pages/dashboard/lod')),
    exact: true,
  },
  {
    path: '/ratings',
    component: loadable(() => import('pages/rating')),
    exact: true,
  },
  {
    path: '/ratings-by-customers',
    component: loadable(() => import('pages/rating-by-customers')),
    exact: true,
  },
  {
    path: '/feedback',
    component: loadable(() => import('pages/feedback')),
    exact: true,
  },
  {
    path: '/refund-invoice',
    component: loadable(() => import('pages/dashboard/refundInvoiceTable')),
    exact: true,
  },
]

class Router extends React.Component {
  render() {
    const { history } = this.props
    return (
      <ConnectedRouter history={history}>
        <IndexLayout>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/main" />} />
            {routes.map(route => (
              <Route
                path={route.path}
                component={route.component}
                key={route.path}
                exact={route.exact}
              />
            ))}
            <Route component={NotFoundPage} />
          </Switch>
        </IndexLayout>
      </ConnectedRouter>
    )
  }
}

export default Router
