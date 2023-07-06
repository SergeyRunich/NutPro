import React, { Fragment } from 'react'
import { useIntl } from 'react-intl'
import Authorize from 'components/LayoutComponents/Authorize'
import VerificationOrders from './components/VerificationOrders'
import VerificationWithoutPrice from './components/VerificationWithoutPrice'
import CustomMenuOrders from './components/CustomMenuOrders'
import VerificationRecalculatedPrice from './components/VerificationRecalculatedPrice'
import VerificationExtraDays from './components/VerificationExtraDays'
import VerificationDeliveryFee from './components/VerificationDeliveryFee'

function DashboardApprovals() {
  const { formatMessage } = useIntl()
  const approvals = [
    {
      id: 'Approvals.WithoutInvoiceOrdersApproval',
      Component: VerificationWithoutPrice,
    },
    {
      id: 'Approvals.WithoutDeliveryFee',
      Component: VerificationDeliveryFee,
    },
    {
      id: 'Approvals.CustomOrdersApproval',
      Component: CustomMenuOrders,
    },
    {
      id: 'Approvals.CustomPriceApproval',
      Component: VerificationOrders,
    },
    {
      id: 'Approvals.RecalculatedPriceApproval',
      Component: VerificationRecalculatedPrice,
    },
    {
      id: 'Approvals.ExtraDaysApproval',
      Component: VerificationExtraDays,
    },
  ]
  return (
    <Authorize roles={['root', 'salesDirector']} users={['Jitka']} redirect to="/dashboard/stf">
      <Authorize roles={['root', 'salesDirector']} users={['Jitka']}>
        {approvals.map(approval => (
          <Fragment key={approval.id}>
            <div className="utils__title utils__title--flat mb-3">
              <strong className="text-uppercase font-size-16">
                {formatMessage({ id: approval.id })}
              </strong>
            </div>
            <div className="card card--fullHeight">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12">
                    <approval.Component />
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        ))}
      </Authorize>
    </Authorize>
  )
}

export default DashboardApprovals
