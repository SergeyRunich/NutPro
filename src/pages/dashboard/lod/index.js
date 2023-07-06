import React, { useState } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Select, DatePicker, notification, Button } from 'antd'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import TableOfOrders from './Table'
import TableDownload from './Table/TableDownload'
import { getLodData, sendLodNotification, sendLodCollector } from '../../../api/dashboard'

const { Option } = Select
const { RangePicker } = DatePicker

moment.updateLocale('en', {
  week: { dow: 1 },
})

function ListOfDebtors(dispatch) {
  const [notifications, setNotifications] = useState([])
  const [orderStatus, setOrderStatus] = useState(-1)
  const [notificationStatus, setNotificationStatus] = useState(-1)
  const [loading, setLoading] = useState(false)
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

  const onChangeOrderStatus = e => {
    try {
      setOrderStatus(e)
    } catch (error) {
      console.log(error)
    }
  }

  const onChangeNotificationStatus = e => {
    try {
      setNotificationStatus(e)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangePeriod = async period => {
    setStart(period[0].unix())
    setEnd(period[1].unix())
  }

  const onSendLodNotification = async id => {
    const req = await sendLodNotification({ id })
    if (req.status === 200) {
      show()
      notification.success({
        message: 'Success',
        description: 'Permition Successfully Changed!',
      })
    } else {
      notification.error({
        message: <FormattedMessage id="global.error" />,
        description: req.statusText,
      })
    }
  }

  const onSendLodCollector = async id => {
    const req = await sendLodCollector({ id })
    if (req.status === 200) {
      show()
      notification.success({
        message: 'Success',
        description: 'Permission Successfully Changed!',
      })
    } else {
      notification.error({
        message: <FormattedMessage id="global.error" />,
        description: req.statusText,
      })
    }
  }

  const filterTableData = () => {
    const filteredTableData = tableData.filter(item => {
      if (notifications.includes('Sent to collector') && !item.send_to_collector) return false
      if (notifications.includes('N 1') && !item.notifications[0]) return false
      if (notifications.includes('N 2') && !item.notifications[1]) return false
      if (notifications.includes('N 3') && !item.notifications[2]) return false
      if (notifications.includes('N 4') && !item.notifications[3]) return false
      if (notificationStatus > -1) {
        if (notificationStatus === 0 && item.notification_status !== 'In progress') return false
        if (notificationStatus === 1 && item.notification_status !== 'Sending paused') return false
        if (notificationStatus === 2 && item.notification_status !== 'All sent') return false
      }
      if (orderStatus > -1) {
        if (orderStatus === 0 && item.order_status !== 'Completed') return false
        if (orderStatus === 1 && item.order_status !== 'Paused') return false
        if (orderStatus === 2 && item.order_status !== 'Active') return false
        if (orderStatus === 3 && item.order_status !== 'Not Accepted') return false
        if (orderStatus === 4 && item.order_status !== 'All sent') return false
      }
      return true
    })

    return filteredTableData
  }

  const show = () => {
    setLoading(true)
    getLodData(
      moment.unix(start).format('DD-MM-YYYY'),
      moment.unix(end).format('DD-MM-YYYY'),
      false,
    ).then(async req => {
      if (req.status === 401) {
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            authorized: false,
          },
        })
        return
      }
      if (req.status === 200) {
        const lod = await req.json()
        setTableData(lod.result)
        setLoading(false)
      } else {
        notification.error({
          message: req.status,
          description: req.statusText,
        })
        setLoading(false)
      }
    })
  }

  const filteredTableData = filterTableData()

  return (
    <Authorize roles={['finance', 'root', 'salesDirector', 'readonlySearch']} redirect to="/main">
      <Helmet title="List of debtors" />
      <div className="row">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <div className="utils__title">
                <strong>
                  <FormattedMessage id="ListOfDebtors.ListOfDebtors" />
                </strong>
              </div>
            </div>
            <div style={{ textAlign: 'center' }} className="card-body">
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
              <br />
              <Button
                loading={loading}
                style={{ marginTop: '10px' }}
                type="primary"
                onClick={show}
                size="large"
              >
                <FormattedMessage id="global.show" />
              </Button>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-12">
                  <small>
                    <FormattedMessage id="ListOfDebtors.Notifications" />
                  </small>
                  <br />
                  <Select
                    placeholder={<FormattedMessage id="ListOfDebtors.Notifications" />}
                    mode="tags"
                    value={notifications}
                    onChange={e => setNotifications(e)}
                    size="default"
                    style={{ width: '100%' }}
                  >
                    {['N 1', 'N 2', 'N 3', 'N 4', 'Sent to collector'].map(tag => (
                      <Option key={tag} value={tag}>
                        {`${tag}`}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2">
                  <small>
                    <FormattedMessage id="ListOfDebtors.OrdersStatus" />
                  </small>
                  <br />
                  <Select
                    value={orderStatus}
                    style={{ width: 120 }}
                    onChange={onChangeOrderStatus}
                    size="default"
                  >
                    <Option value={-1}>
                      <FormattedMessage id="ListOfDebtors.All" />
                    </Option>
                    <Option value={4}>
                      <FormattedMessage id="ListOfDebtors.AllSent" />
                    </Option>
                    <Option value={3}>
                      <FormattedMessage id="ListOfDebtors.NotAccepted" />
                    </Option>
                    <Option value={2}>
                      <FormattedMessage id="ListOfDebtors.Active" />
                    </Option>
                    <Option value={1}>
                      <FormattedMessage id="ListOfDebtors.Paused" />
                    </Option>
                    <Option value={0}>
                      <FormattedMessage id="ListOfDebtors.Complated" />
                    </Option>
                  </Select>
                </div>
                <div className="col-lg-2">
                  <small>
                    <FormattedMessage id="ListOfDebtors.NotificationStatus" />
                  </small>
                  <br />
                  <Select
                    value={notificationStatus}
                    style={{ width: 120 }}
                    onChange={onChangeNotificationStatus}
                    size="default"
                  >
                    <Option value={-1}>
                      <FormattedMessage id="ListOfDebtors.All" />
                    </Option>
                    <Option value={2}>
                      <FormattedMessage id="ListOfDebtors.AllSent" />
                    </Option>
                    <Option value={1}>
                      <FormattedMessage id="ListOfDebtors.SendingPaused" />
                    </Option>
                    <Option value={0}>
                      <FormattedMessage id="ListOfDebtors.InProgress" />
                    </Option>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <TableOfOrders
                data={filteredTableData}
                onSendLodNotification={onSendLodNotification}
                onSendLodCollector={onSendLodCollector}
                loading={loading}
              />
              <br />
              <TableDownload data={filteredTableData} start={start} end={end} />
            </div>
          </div>
        </div>
      </div>
    </Authorize>
  )
}

export default injectIntl(ListOfDebtors)
