import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import { DatePicker, notification, Button, Select } from 'antd'
import moment from 'moment'
import Authorize from 'components/LayoutComponents/Authorize'
import TableOfPayments from './Table'
import { getGoPayOrderPayments } from '../../api/payments'

const { RangePicker } = DatePicker
const { Option } = Select

const statuses = {
  All: 'All',
  TIMEOUTED: 'Timeouted',
  PAID: 'Paid',
  CREATED: 'Created',
  CANCELED: 'Canceled',
  PAYMENT_METHOD_CHOSEN: 'Payment method chosen',
  AUTHORIZED: 'Authorized',
  REFUNDED: 'Refunded',
  PARTIALLY_REFUNDED: 'Partially refunded',
  FAILED: 'Failed',
}

const gateway = {
  All: 'All',
  Fakturoid: 'Fakturoid',
  GoPay: 'GoPay',
  Null: 'None',
}

const Payments = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [start, setStart] = useState(
    moment()
      .startOf('month')
      .unix(),
  )
  const [end, setEnd] = useState(
    moment()
      .endOf('month')
      .unix(),
  )
  const [paymentGateway, setPaymentGateway] = useState('All')
  const [paymentStatus, setPaymentStatus] = useState('All')

  const dispatch = useDispatch()
  const { formatMessage } = useIntl()

  const handleChangePeriod = async period => {
    const [startPeriod, endPeriod] = period
    setStart(startPeriod.unix())
    setEnd(endPeriod.unix())
  }

  const show = async () => {
    try {
      setIsLoading(true)
      const res = await getGoPayOrderPayments(
        moment.unix(start).format('DD-MM-YYYY'),
        moment.unix(end).format('DD-MM-YYYY'),
      )
      if (res.status === 401) {
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            authorized: false,
          },
        })
        return
      }
      if (res.status === 200) {
        const json = await res.json()
        setTableData(json.result)
      }
    } catch (e) {
      notification.error({
        message: e.status,
        description: e.statusText,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'List of payments'
  }, [])

  return (
    <Authorize roles={['finance', 'root', 'salesDirector']} redirect to="/main">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div className="utils__title d-flex">
                <strong>{formatMessage({ id: 'Payments.ListOfPayments' })}</strong>
              </div>
              <div className="d-flex align-items-center" style={{ marginRight: '20px' }}>
                <Select
                  placeholder="Status"
                  defaultValue={paymentStatus}
                  style={{ width: 190, marginRight: '20px' }}
                  onChange={e => setPaymentStatus(e)}
                >
                  {Object.keys(statuses).map(key => (
                    <Option key={key} value={key}>
                      {statuses[key]}
                    </Option>
                  ))}
                </Select>
                <Select
                  placeholder="Gateway"
                  defaultValue={paymentGateway}
                  style={{ width: 100, marginRight: '20px' }}
                  onChange={e => setPaymentGateway(e)}
                >
                  {Object.keys(gateway).map(key => (
                    <Option key={key} value={key}>
                      {gateway[key]}
                    </Option>
                  ))}
                </Select>
                <RangePicker
                  ranges={{
                    'Previous Month': [
                      moment()
                        .subtract(1, 'month')
                        .startOf('month'),
                      moment()
                        .subtract(1, 'month')
                        .endOf('month'),
                    ],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                  }}
                  defaultValue={[moment(start * 1000), moment(end * 1000)]}
                  format="DD.MM.YYYY"
                  onChange={handleChangePeriod}
                />
                <Button
                  loading={isLoading}
                  style={{ marginLeft: '20px' }}
                  type="primary"
                  onClick={show}
                  size="default"
                >
                  {formatMessage({ id: 'global.show' })}
                </Button>
              </div>
            </div>
            <div className="card-body">
              <TableOfPayments
                payments={tableData}
                type={paymentGateway}
                status={paymentStatus}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </Authorize>
  )
}

export default Payments
