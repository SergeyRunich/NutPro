import React from 'react'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { notification } from 'antd'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import TableOfOrders from './Table'
import { getInvoicesForRefund } from '../../../api/dashboard'

@injectIntl
@connect(({ user }) => ({ user }))
class SalesTargetFulfilment extends React.Component {
  state = {
    loading: true,
    tableData: [],
  }

  constructor(props) {
    super(props)

    this.show = this.show.bind(this)
  }

  componentDidMount() {
    this.show()
  }

  show() {
    this.setState({
      loading: true,
    })
    getInvoicesForRefund().then(async req => {
      if (req.status === 401) {
        const { dispatch } = this.props
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            authorized: false,
          },
        })
        return
      }
      if (req.status === 200) {
        const json = await req.json()
        this.setState({
          tableData: json.result,
          loading: false,
        })
      } else {
        notification.error({
          message: req.status,
          description: req.statusText,
        })
        this.setState({
          loading: false,
        })
      }
    })
  }

  render() {
    const { loading, tableData } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    return (
      <Authorize roles={['root', 'finance', 'salesDirector']} redirect to="/main">
        <Helmet title="Invoices for refund" />
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <div className="utils__title">
                  <strong>{formatMessage({ id: 'TableOfInvoices.InvoicesForRefund' })}</strong>
                </div>
              </div>
              <div className="card-body">
                <TableOfOrders data={tableData} loading={loading} show={this.show} />
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default SalesTargetFulfilment
