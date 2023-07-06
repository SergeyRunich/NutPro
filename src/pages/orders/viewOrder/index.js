import React, { useState, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, Redirect, useParams } from 'react-router-dom'
import { useIntl } from 'react-intl'
import moment from 'moment'
import { Button, Result, Tabs, Icon, Divider, notification } from 'antd'
import Calendar from '../../../components/NutritionPRO/Calendar'
import EditOrderForm from './EditOrderForm'
import PauseDrawer from './PauseDrawer'
import CancelModal from './CancelModal'
import AcceptCompanyModal from './AcceptCompany'

import {
  getOrder,
  updateOrder,
  sendApprovalRequest,
  acceptCompanyOrder,
  deletePriceApprovalReq,
} from '../../../api/order'

import { getIngredientTags } from '../../../api/erp/ingredientTags'
import { getGoPayOrderPayment } from '../../../api/payments'
import { getLogsforOrder } from '../../../api/orderLog'

import SideTabs from './SideTabs'
import SocialInfo from './SocialInfo'
import Card from './Card'
import InvoicesTable from './InvoicesTable'
import LogsTable from './LogsTable'
import PaymentsTable from './PaymentsTable'

const { TabPane } = Tabs

moment.updateLocale('en', {
  week: { dow: 1 },
})

const OrderCard = () => {
  const [loading, setLoading] = useState(true)
  const [deleted, setDeleted] = useState(false)
  const [status, setStatus] = useState(404)
  const [invoices, setInvoices] = useState([])
  const [logs, setLogs] = useState([])
  const [pauseDrawerVisible, setPauseDrawerVisible] = useState(false)
  const [editOrderFormVisible, setEditOrderFormVisible] = useState(false)
  const [acceptCompanyVisible, setAcceptCompanyVisible] = useState(false)
  const [order, setOrder] = useState({})
  const [customMenu] = useState({
    meals: [false, false, false, false, false, false, false, false, false, false, false],
    cf: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    count: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    isActive: false,
  })
  const [requestApprovalPrice, setRequestApprovalPrice] = useState({})
  const [paymentData, setPaymentData] = useState([])
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const [tags, setTags] = useState([])
  const [orderDays, setOrderDays] = useState([])

  const { id } = useParams()
  const dispatch = useDispatch()
  const { formatMessage } = useIntl()

  const currentPrice = order.currentPrice || {}
  const acceptedPrice = order.acceptedPrice || {}

  const getOrderPayments = useCallback(async () => {
    setLoading(true)
    const req = await getGoPayOrderPayment(id)
    const { result } = await req.json()
    setPaymentData(result)
    setLoading(false)
  }, [id])

  const ingredientTags = useCallback(async () => {
    const res = await getIngredientTags(true)
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
      setTags(json.result)
    }
  }, [dispatch])

  const logsForOrder = useCallback(async () => {
    try {
      const req = await getLogsforOrder(id)
      const json = await req.json()
      setLogs(json.result)
    } catch (e) {
      notification.error({
        message: formatMessage({ id: 'global.error' }),
        description: 'Failed to get logs',
      })
    } finally {
      setLoading(false)
    }
  }, [formatMessage, id])

  const update = useCallback(async () => {
    setLoading(true)
    try {
      const req = await getOrder(id)
      const json = await req.json()
      json.result.customMenu.data.forEach(m => {
        customMenu.meals[m.meal] = true
        customMenu.cf[m.meal] = m.coefficient
        customMenu.count[m.meal] = m.count
        customMenu.isActive = json.result.customMenu.isActive
      })
      setOrder(json.result)
      setStatus(json.status)
      setAcceptCompanyVisible(false)
      setInvoices(json.result.invoices)
      setRequestApprovalPrice(json.result.requestApprovalPrice)
      setLoading(false)

      await getOrderPayments()
      await ingredientTags()
      await logsForOrder()
    } catch (e) {
      notification.error({
        message: formatMessage({ id: 'global.error' }),
        description: 'Failed to get order',
      })
    }
  }, [
    customMenu.cf,
    customMenu.count,
    customMenu.isActive,
    customMenu.meals,
    formatMessage,
    getOrderPayments,
    id,
    ingredientTags,
    logsForOrder,
  ])

  const acceptAsCompany = async (unit, description) => {
    setLoading(true)
    const req = await acceptCompanyOrder(id, { description, unit })
    if (req.status === 202) {
      await update()
      notification.success({
        message: formatMessage({ id: 'global.success' }),
        description: formatMessage({ id: 'Orders.OrderSuccessfullyAccepted!' }),
      })
    } else {
      setLoading(false)
      notification.error({
        message: formatMessage({ id: 'global.error' }),
        description: req.statusText,
      })
    }
  }

  const reqForApprovalPrice = async () => {
    const req = await sendApprovalRequest(id)
    if (req.status === 200) {
      await update()
    }
  }

  useEffect(() => {
    document.title = `Order ${id}`
    update().finally(() => setLoading(false))
  }, [update, id])

  useEffect(() => {
    if (order.orderDays) {
      setOrderDays(
        order.orderDays.map(orderDay => moment.unix(Number(orderDay)).format('DD-MM-YYYY')),
      )
    }
  }, [order])

  return (
    <div>
      {deleted && <Redirect to="/orders" />}

      {id && !loading && status === 200 && (
        <div className="row">
          <div className="col-xl-8">
            <SocialInfo id={id} order={order} />
            {!order.customMenu.isActive && order.customMenu.data.length !== 0 && (
              <div className="card card-body mb-4">
                <div>
                  <h2>
                    <span className="text-black mr-2">
                      <center>
                        <strong style={{ color: '#fb434a' }}>
                          {formatMessage({ id: 'Orders.ORDER HAS A CUSTOM MENU!' })}
                        </strong>
                        <br />
                        {formatMessage({
                          id: 'Orders.Request for approval was sent automatically',
                        })}
                        <br />
                        <small>{formatMessage({ id: 'Orders.Please contact the CEO' })}</small>
                      </center>
                    </span>
                  </h2>
                </div>
              </div>
            )}

            {order.isModifiedPrice && order.invoiceStatus === 'open' && (
              <div className="card card-body mb-4">
                <div>
                  <h2>
                    <span className="text-black mr-2">
                      <center>
                        <strong style={{ color: '#fb434a' }}>
                          {formatMessage({ id: 'Orders.PRICE WAS RECALCULATED!' })}
                        </strong>
                        <br />
                        {!order.isOnApprovalOfRecalculatedPrice && (
                          <Button
                            type="primary"
                            size="default"
                            onClick={reqForApprovalPrice}
                            style={{ backgroundColor: '#46be8a', border: 0 }}
                          >
                            <Icon type="pull-request" />
                            {formatMessage({ id: 'Orders.Request for approval' })}
                          </Button>
                        )}
                      </center>
                    </span>
                  </h2>
                  <Divider>{formatMessage({ id: 'Orders.PRICE PER DAY' })}</Divider>
                  <div style={{ fontSize: 48, textAlign: 'center' }}>
                    <span>{acceptedPrice.totalPerDay}</span>
                    <span style={{ fontSize: 30 }}>Kč</span>
                    <span style={{ fontSize: 52, margin: '0 25px 0 25px' }}>
                      <i className="fa fa-long-arrow-right" color="green" />
                    </span>
                    <span>{currentPrice.totalPerDay}</span>
                    <span style={{ fontSize: 30 }}>Kč</span>
                    <span
                      style={{
                        marginLeft: '10px',
                        color:
                          acceptedPrice.totalPerDay > currentPrice.totalPerDay
                            ? '#46be8a'
                            : '#fb434a',
                      }}
                    >
                      <i
                        className={`fa fa-sort-${
                          acceptedPrice.totalPerDay > currentPrice.totalPerDay ? 'down' : 'up'
                        }`}
                        color="green"
                      />
                    </span>
                    <span
                      style={{
                        marginLeft: '10px',
                        color:
                          acceptedPrice.totalPerDay > currentPrice.totalPerDay
                            ? '#46be8a'
                            : '#fb434a',
                      }}
                    >
                      {acceptedPrice.totalPerDay < currentPrice.totalPerDay && <span>+</span>}
                      {currentPrice.totalPerDay - acceptedPrice.totalPerDay}
                    </span>
                    <span style={{ fontSize: 30 }}>Kč</span>
                  </div>
                  <Divider>{formatMessage({ id: 'Orders.TOTAL PRICE' })}</Divider>
                  <div style={{ fontSize: 48, textAlign: 'center' }}>
                    <span>{acceptedPrice.total}</span>
                    <span style={{ fontSize: 30 }}>Kč</span>
                    <span style={{ fontSize: 52, margin: '0 25px 0 25px' }}>
                      <i className="fa fa-long-arrow-right" color="green" />
                    </span>
                    <span>{currentPrice.total}</span>
                    <span style={{ fontSize: 30 }}>Kč</span>
                    <span
                      style={{
                        marginLeft: '10px',
                        color: acceptedPrice.total > order.price ? '#46be8a' : '#fb434a',
                      }}
                    >
                      <i
                        className={`fa fa-sort-${
                          acceptedPrice.total > order.price ? 'down' : 'up'
                        }`}
                        color="green"
                      />
                    </span>
                    <span
                      style={{
                        marginLeft: '10px',
                        color: acceptedPrice.total > order.price ? '#46be8a' : '#fb434a',
                      }}
                    >
                      {currentPrice.total > acceptedPrice.total && <span>+</span>}
                      {currentPrice.total - acceptedPrice.total}
                    </span>
                    <span style={{ fontSize: 30 }}>Kč</span>
                  </div>
                </div>
              </div>
            )}

            {Object.keys(requestApprovalPrice).length !== 0 &&
            typeof requestApprovalPrice === 'object' ? (
              <div className="card card-body mb-4">
                <h2>
                  <span className="text-black mr-2">
                    <center>
                      <strong style={{ color: '#fb434a' }}>
                        {formatMessage({
                          id: 'Orders.PRICE WAS RECALCULATED AND WAITING FOR APPROVAL!',
                        })}
                      </strong>
                      <br />
                      <br />
                      <div>
                        {requestApprovalPrice.before.length !==
                          requestApprovalPrice.after.length && (
                          <p>
                            {`${requestApprovalPrice.before.length} days → ${requestApprovalPrice.after.length} days`}
                          </p>
                        )}
                        {requestApprovalPrice.before.mealsPerDay !==
                          requestApprovalPrice.after.mealsPerDay && (
                          <p>
                            {`${requestApprovalPrice.before.mealsPerDay} meals → ${requestApprovalPrice.after.mealsPerDay} meals`}
                          </p>
                        )}
                        {requestApprovalPrice.before.params.energy !==
                          requestApprovalPrice.after.params.energy && (
                          <p>
                            {`${requestApprovalPrice.before.params.energy} kcal → ${requestApprovalPrice.after.params.energy} kcal`}
                          </p>
                        )}
                        {requestApprovalPrice.before.price !== requestApprovalPrice.after.price && (
                          <p>
                            {`${requestApprovalPrice.before.price} Kč → ${requestApprovalPrice.after.price} Kč`}
                          </p>
                        )}
                      </div>
                      <br />
                      <Button
                        type="danger"
                        onClick={async () => {
                          await deletePriceApprovalReq(requestApprovalPrice.id)
                          await update()
                        }}
                      >
                        {formatMessage({ id: 'Orders.RemoveRequest' })}
                      </Button>
                    </center>
                  </span>
                </h2>
              </div>
            ) : (
              ''
            )}

            <Card
              id={id}
              order={order}
              customMenu={customMenu}
              showPauseDrawer={() => setPauseDrawerVisible(true)}
              showAcceptCompanyModal={() => setAcceptCompanyVisible(true)}
              showDrawerEditOrder={() => setEditOrderFormVisible(true)}
              updateOrder={updateOrder}
              update={update}
              setLoading={e => setLoading(e)}
              setDeleted={e => setDeleted(e)}
              getOrderPayments={getOrderPayments}
              isRequestApproval={Object.keys(requestApprovalPrice).length !== 0}
              tags={tags}
              paymentData={paymentData}
            />
            <div className="card card-body mb-4">
              <Tabs defaultActiveKey="1">
                {invoices.length > 0 && (
                  <TabPane
                    tab={
                      <span>
                        <i className="icmn-history" />
                        {formatMessage({ id: 'Orders.Invoices' })}
                      </span>
                    }
                    key="1"
                  >
                    <InvoicesTable data={invoices} />
                  </TabPane>
                )}
                {Array.isArray(paymentData) && (
                  <TabPane
                    tab={
                      <span>
                        <i className="icmn-history" />
                        {formatMessage({ id: 'Orders.Payments' })}
                      </span>
                    }
                    key="2"
                  >
                    <PaymentsTable data={paymentData} />
                  </TabPane>
                )}
                <TabPane
                  tab={
                    <span>
                      <i className="icmn-history" />
                      {formatMessage({ id: 'Orders.OrderLogs' })}
                    </span>
                  }
                  key="3"
                >
                  <LogsTable data={logs} />
                </TabPane>
              </Tabs>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-3 text-black">
                  <strong>{formatMessage({ id: 'Orders.PRICE' })}</strong>
                </h5>
                <SideTabs id={id} order={order} />
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <Calendar highlightedDays={orderDays} />
              </div>
            </div>
          </div>
        </div>
      )}

      {editOrderFormVisible && (
        <EditOrderForm
          visible={editOrderFormVisible}
          onClose={() => setEditOrderFormVisible(false)}
          onCreate={updateOrder}
          update={update}
          order={order}
          tags={tags}
        />
      )}

      {pauseDrawerVisible && (
        <PauseDrawer
          visible={pauseDrawerVisible}
          orderDays={orderDays}
          onClose={() => setPauseDrawerVisible(false)}
          update={update}
          order={order}
        />
      )}

      {cancelModalVisible && (
        <CancelModal
          visible={cancelModalVisible}
          onClose={() => setCancelModalVisible(false)}
          update={update}
          order={order}
        />
      )}

      {acceptCompanyVisible && (
        <AcceptCompanyModal
          visible={acceptCompanyVisible}
          onClose={() => setAcceptCompanyVisible(false)}
          update={update}
          createInvoice={acceptAsCompany}
          accept={acceptAsCompany}
          order={order}
        />
      )}

      {status === 404 && !loading && (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Link to="/orders">
              <Button type="primary">{formatMessage({ id: 'Orders.BackOrders' })}</Button>
            </Link>
          }
        />
      )}
      {status === 500 && !loading && (
        <Result
          status="500"
          title="500"
          subTitle="Sorry, the server is wrong."
          extra={
            <Link to="/orders">
              <Button type="primary">{formatMessage({ id: 'Orders.BackOrders' })}</Button>
            </Link>
          }
        />
      )}
    </div>
  )
}

export default OrderCard
