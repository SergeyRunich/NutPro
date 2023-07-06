/* eslint-disable react/jsx-indent */
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Dropdown,
  Icon,
  InputNumber,
  Menu,
  Modal,
  notification,
  Popconfirm,
  Row,
  Select,
  Statistic,
  Tag,
  Tooltip,
} from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import moment from 'moment'
import React, { useState } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { checkAddress } from '../../../../api/deliveryTools'
import { createExtraDayRequest } from '../../../../api/extraDays'
import {
  acceptWeb,
  changeOrderStatus,
  deleteOrder,
  getInvoiceStatus,
  regenerateOrder,
  quickProlongOrder,
} from '../../../../api/order'
import { createGoPayOrderPayment } from '../../../../api/payments'
import CancelModal from '../FullCancelModal'
import OverlayMenu from '../OverlayMenu'
import Calendar from '../../../../components/NutritionPRO/Calendar'
import styles from '../style.module.scss'
import { getOrderDays } from '../../../../services/order'

const { Option } = Select

function Card({
  id,
  order,
  customMenu,
  showPauseDrawer,
  showAcceptCompanyModal,
  showDrawerEditOrder,
  update,
  intl,
  getOrderPayments,
  isRequestApproval,
  tags,
  // paymentData,
}) {
  const [extendDaysModalOpen, setExtendDaysModalOpen] = useState(false)
  const [cancelOrderModalOpen, setCancelOrderModalOpen] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const [newDays, setNewDays] = useState([])
  const [loading, setLoading] = useState(true)
  const [prolonging, setProlonging] = useState(false)
  const [, setDeleted] = useState(false)
  const [isRegenerated, setIsRegenerated] = useState(false)
  const [isDropdownPopconfirm, setIsDropdownPopconfirm] = useState(false)
  const [popconfirmOption, setPopconfirmOption] = useState('')
  const history = useHistory()
  const updateOrderDays = async () => {
    setExtendDaysModalOpen(false)
    const req = await createExtraDayRequest({ orderId: order.id, days: newDays.length })
    if (req.status === 201) {
      await update()
      notification.success({
        message: 'Extra days added',
        description: 'Extra days added',
      })
    }
  }

  const onRegenerateOrder = async () => {
    setIsRegenerated(true)
    const req = await regenerateOrder(id)
    if (req.status === 202) {
      notification.success({
        message: 'Success',
        description: 'Regeneration successfully started!',
      })
      setIsRegenerated(false)
    } else {
      notification.error({
        message: 'Error',
        description: req.statusText,
      })
      setIsRegenerated(false)
    }
  }

  const checkCurrentAddress = async () => {
    const req = await checkAddress(order.user.address)
    if (req.ok) {
      const json = await req.json()
      if (json.result.isPointInPolygon) {
        notification.success({
          message: 'Included',
          description: 'The address is included in the delivery area!',
        })
      } else {
        notification.info({
          message: 'Not included',
          description: 'The address is not included in the delivery area',
        })
      }
    } else {
      notification.error({
        placement: 'topLeft',
        message: 'Error',
        description: req.statusText,
      })
    }
  }

  const acceptFromWeb = async () => {
    acceptWeb(id).then(async req => {
      if (req.ok) {
        update()
        notification.success({
          message: 'Success',
          description: 'Order status successfully changed!',
        })
      } else if (req.status === 402) {
        update()
        notification.info({
          message: 'Payment required',
          description: 'Order not paid!!',
        })
      } else {
        setLoading(false)
        notification.error({
          message: 'Error',
          description: req.statusText,
        })
      }
    })
  }

  const onChangeStatus = async (newStatus, invoice = true) => {
    setLoading(false)
    const req = await changeOrderStatus(newStatus, id, invoice)
    if (req.status === 202) {
      update()
      setLoading(false)
      if (newStatus === 'accepted') {
        notification.success({
          message: 'Success',
          description: 'Order successfully accepted!',
        })
      } else if (newStatus === 'accepted') {
        notification.success({
          message: 'Success',
          description: 'Order successfully rejected!',
        })
      } else {
        notification.success({
          message: 'Success',
          description: 'Order status successfully changed!',
        })
      }
    } else {
      setLoading(false)
      notification.error({
        message: 'Error',
        description: req.statusText,
      })
    }
  }

  const addExtraDays = days => {
    const orderDays = order.orderDays.map(day => moment.unix(day))
    const lastDay = [...orderDays].pop()
    const dayOfWeek = moment(lastDay).day()
    const isLong = order.size === 'long'

    const one = () => {
      if (isLong) {
        if (dayOfWeek <= 5) return 1
        if (dayOfWeek === 6) return 2
        if (dayOfWeek === 7) return 1
      } else {
        if (dayOfWeek <= 4) return 1
        if (dayOfWeek === 5) return 3
        if (dayOfWeek === 6) return 2
        if (dayOfWeek === 7) return 1
      }
    }

    const two = () => {
      if (isLong) {
        if (dayOfWeek <= 4) return 2
        if (dayOfWeek === 5) return 3
        if (dayOfWeek === 6) return 3
        if (dayOfWeek === 7) return 2
      } else {
        if (dayOfWeek <= 3) return 2
        if (dayOfWeek === 4) return 4
        if (dayOfWeek === 5) return 4
        if (dayOfWeek === 6) return 3
        if (dayOfWeek === 7) return 2
      }
    }

    const plusOne = moment(lastDay).add(one(), 'days')
    const plusTwo = moment(lastDay).add(two(), 'days')

    let newDaysTemp
    if (days === 1) newDaysTemp = [plusOne]
    else if (days === 2) newDaysTemp = [plusOne, plusTwo]
    else newDaysTemp = []
    setNewDays(newDaysTemp)
  }

  const removeOrder = async () => {
    setIsDropdownPopconfirm(false)
    deleteOrder(id).then(async req => {
      if (req.status === 204) {
        setDeleted(true)
        notification.success({
          message: 'Success',
          description: 'Order was successfully deleted!',
        })
        history.push('/orders')
      } else {
        notification.error({
          message: 'Error',
          description: 'Order was not deleted!',
        })
      }
    })
  }

  const onQuickProlong = async () => {
    setProlonging(true)
    const body = {
      orderId: id,
    }
    quickProlongOrder(body).then(async req => {
      if (req.status === 201) {
        setProlonging(false)
        notification.success({
          message: 'Success',
          description: 'Order successfully prolonged!',
        })
        const json = await req.json()
        const newOrderId = json.result.id
        const url = window.location.href.split('/')
        url.pop()
        const newUrl = `${url.join('/')}/${newOrderId}`
        window.open(newUrl, '_blank')
      } else {
        notification.error({
          message: 'Error',
        })
      }
    })
  }

  const openCancelModal = async () => {
    const req = await getInvoiceStatus(id)
    if (req.ok) {
      const json = await req.json()
      setIsPaid(json.isPaid)
      setCancelOrderModalOpen(true)
    }
  }

  const isEditButtonDisabled = order.isOnApprovalOfRecalculatedPrice || order.status === 'canceled'
  // TODO: Set up rules to creat order payment
  // const isCreatePaymentDisabled =
  //   paymentData?.length !== 0 && !paymentData.some(({ status }) => status === 'TIMEOUTED')
  const handleEditButtonClick = () => {
    if (!isEditButtonDisabled) showDrawerEditOrder()
  }

  const createOrderPayment = () => {
    setIsDropdownPopconfirm(false)
    const { formatMessage } = intl
    const orderId = order.id
    if (!orderId) throw new Error("Order ID doesn't exist")
    createGoPayOrderPayment(orderId).then(async res => {
      if (res.status === 201) {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'Payment.CreateSuccess' }),
        })
        getOrderPayments()
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: formatMessage({ id: 'Payment.CreateError' }),
        })
      }
    })
  }

  const { role } = useSelector(state => state.user)

  const actionMenu = () => (
    <Menu style={{ padding: '0px' }} disabled={isEditButtonDisabled}>
      {role !== 'admin' && (
        <Menu.Item key="viewCustomerKey">
          <Link to={`/users/${order.user.id}`}>
            <i className="icmn-user mr-1" />
            <FormattedMessage id="Orders.ViewCustomer" />
          </Link>
        </Menu.Item>
      )}
      {['root', 'sales', 'salesDirector', 'admin'].includes(role) && (
        <Menu.Item key="viewMenuKey">
          <Link to={`/menu/${order.user.id}/${order.id}`}>
            <i className="icmn-list mr-1" />
            <FormattedMessage id="Orders.ViewMenu" />
          </Link>
        </Menu.Item>
      )}
      {role !== 'admin' && (
        <Menu.Item
          key="createOrderPaymentKey"
          // disabled={isCreatePaymentDisabled}
          onClick={() => {
            setIsDropdownPopconfirm(true)
            setPopconfirmOption('create')
          }}
        >
          <Icon type="credit-card" />
          <FormattedMessage id="Payment.Create" />
        </Menu.Item>
      )}
      {((order.timestamp > moment().unix() && order.status !== 'canceled') ||
        order.status === 'waitingPayment') && (
        <Menu.Item key="cancelOrderKey" onClick={() => openCancelModal()}>
          <i className="icmn-blocked mr-1" />
          <FormattedMessage id="Orders.CancelOrder" />
        </Menu.Item>
      )}
      {(order.status === 'new' || order.status === 'fromWeb') && (
        <Menu.Item
          key="removeOrderKey"
          onClick={() => {
            setIsDropdownPopconfirm(true)
            setPopconfirmOption('remove')
          }}
        >
          <i className="icmn-bin mr-1" />
          <FormattedMessage id="Orders.Remove" />
        </Menu.Item>
      )}
    </Menu>
  )

  let days = order.extraDays > 0 ? `${order.length} (+${order.extraDays})` : order.length
  if (order.extraDays === -1) {
    days = `${order.length} (+${order.orderDays.length - order.length})`
  }

  const highlightedDays = getOrderDays(order.timestamp, order.length, order.size).map(orderDay =>
    moment.unix(Number(orderDay)).format('DD-MM-YYYY'),
  )

  return (
    <div className="card">
      <div className="card-body">
        <div>
          <div className="row">
            <div className="col-xl-12">
              <Row gutter={16}>
                <Col md={7} xs={12}>
                  <Statistic
                    title={<FormattedMessage id="Orders.Start" />}
                    value={moment.unix(order.timestamp).format('DD.MM.YYYY')}
                  />
                </Col>
                <Col md={7} xs={12}>
                  <Statistic
                    title={<FormattedMessage id="Orders.End" />}
                    value={moment.unix(order.orderDays.slice(-1)[0]).format('DD.MM.YYYY')}
                  />
                </Col>
                <Col md={5} xs={12}>
                  <Statistic title={<FormattedMessage id="Orders.Days" />} value={days} />
                </Col>
                <Col md={5} xs={12}>
                  <Statistic title={<FormattedMessage id="Orders.Week" />} value={order.size} />
                </Col>
              </Row>
              <Divider />
              <Row gutter={16}>
                <Col md={12} xs={24}>
                  <p className="mb-1">
                    <b>
                      <FormattedMessage id="Orders.Diet:SPACE" />
                    </b>
                    <Tag color="blue" key={Math.random()}>
                      {order.diet || '-'}
                    </Tag>
                  </p>
                  <p className="mb-1">
                    <b>
                      <FormattedMessage id="Orders.MealsPerDay:SPACE" />
                    </b>{' '}
                    <Tag color="blue" key={Math.random()}>
                      {order.mealsPerDay}
                    </Tag>
                    {order.saladOnDinner && (
                      <Tag color="green" key={Math.random()}>
                        <FormattedMessage id="Orders.SaladOnDinner" />
                      </Tag>
                    )}
                  </p>
                  <p className="mb-1">
                    <b>
                      <FormattedMessage id="Orders.PAL:SPACE" />
                    </b>
                    {order.PAL || '-'}
                  </p>
                  <p className="mb-1">
                    <b>
                      <FormattedMessage id="Orders.Wizard:SPACE" />
                    </b>
                    {order.wizardSteps || '-'}
                  </p>
                  <p className="mb-1">
                    <b>
                      <FormattedMessage id="Orders.IgnoredMeals:SPACE" />
                    </b>
                    {order.ignoredMealTypes.map(ignoredMeal => (
                      <Tag color="cyan" key={Math.random()}>
                        {ignoredMeal}
                      </Tag>
                    ))}
                  </p>
                  <p className="mb-1">
                    <b>
                      <FormattedMessage id="Orders.KitchenDescription:SPACE" />
                    </b>
                    {order.kitchenDescription || '-'}
                  </p>
                  <p className="mb-1">
                    <b>
                      <FormattedMessage id="Orders.Exceptions:SPACE" />
                    </b>
                    {order?.exeptions?.length > 0
                      ? tags
                          .filter(tag => order.exeptions.includes(tag.id))
                          .map(tag => (
                            <Tag color="orange" key={tag.id}>
                              {tag.title}
                            </Tag>
                          ))
                      : '-'}
                  </p>
                </Col>
                <Col md={12} xs={24}>
                  <p className="mb-1">
                    <b>
                      <FormattedMessage id="Orders.Phone:SPACE" />
                    </b>
                    {order.user.phone}
                  </p>
                  {order.user.address && !order.pickupPoint.id && (
                    <p className="mb-1">
                      <b>
                        <FormattedMessage id="Orders.Address:SPACE" />
                      </b>
                      {order.user.address}
                      <Button style={{ marginLeft: '20px' }} onClick={checkCurrentAddress}>
                        <FormattedMessage id="Orders.CheckAddress:SPACE" />
                      </Button>
                    </p>
                  )}
                  {order.pickupPoint.id && (
                    <p className="mb-1">
                      <b>
                        <FormattedMessage id="Orders.Pick-upPoint:SPACE" />
                      </b>
                      {order.pickupPoint.name} - {order.pickupPoint.address}
                    </p>
                  )}
                  <p className="mb-1">
                    <b>
                      <FormattedMessage id="Orders.Email:SPACE" />
                    </b>
                    {order.user.email}
                  </p>
                  <p className="mb-1">
                    <b>
                      <FormattedMessage id="Orders.DeliveryDescription:SPACE" />
                    </b>
                    {order.deliveryDescription || '-'}
                  </p>
                  <p className="mb-1">
                    <b>
                      <FormattedMessage id="Orders.DeliveryTime:SPACE" />
                    </b>
                    {order.deliveryRange
                      ? `${order.deliveryRange[0]}:00-${order.deliveryRange[1]}:00`
                      : '-'}
                  </p>
                </Col>
              </Row>
              {order.customMenu.isActive && (
                <>
                  <Divider>
                    <FormattedMessage id="Orders.CustomMenu" />
                  </Divider>
                  <Row gutter={16} className="mt-3">
                    <Col md={4} sm={24}>
                      <Checkbox checked={customMenu.meals[0]} disabled>
                        <FormattedMessage id="Orders.Breakfast" />
                      </Checkbox>
                    </Col>
                    <Col md={4} sm={24}>
                      <Checkbox checked={customMenu.meals[1]} disabled>
                        <FormattedMessage id="Orders.1Snack" />
                      </Checkbox>
                    </Col>
                    <Col md={4} sm={24}>
                      <Checkbox checked={customMenu.meals[2]} disabled>
                        <FormattedMessage id="Orders.Lunch" />
                      </Checkbox>
                    </Col>
                    <Col md={4} sm={24}>
                      <Checkbox checked={customMenu.meals[3]} disabled>
                        <FormattedMessage id="Orders.2Snack" />
                      </Checkbox>
                    </Col>
                    <Col md={4} sm={24}>
                      <Checkbox checked={customMenu.meals[4]} disabled>
                        <FormattedMessage id="Orders.Dinner" />
                      </Checkbox>
                    </Col>
                    <Col md={4} sm={24}>
                      <Checkbox checked={customMenu.meals[10]} disabled>
                        <FormattedMessage id="Orders.Salad" />
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row gutter={16} className="mt-3">
                    {[0, 1, 2, 3, 4, 10].map(col => (
                      <Col key={col} md={4} sm={24}>
                        <Select placeholder="Cf" disabled value={customMenu.cf[col]}>
                          <Option key="0" value={0}>
                            <FormattedMessage id="Orders.Auto" />
                          </Option>
                          <Option key="c1" value={1}>
                            1
                          </Option>
                          <Option key="c2" value={1.5}>
                            1.5
                          </Option>
                          <Option key="c3" value={2}>
                            2
                          </Option>
                        </Select>
                      </Col>
                    ))}
                  </Row>
                  <Row gutter={16} className="mt-3">
                    {[0, 1, 2, 3, 4, 10].map(col => (
                      <Col key={col} md={4} sm={24}>
                        <InputNumber
                          min={0}
                          disabled
                          placeholder="Count"
                          value={customMenu.count[col]}
                        />
                      </Col>
                    ))}
                  </Row>
                </>
              )}
              <Divider />
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.controls}>
                {order.status === 'accepted' && (
                  <>
                    <Authorize
                      roles={['root', 'admin', 'sales', 'salesDirector', 'finance', 'trainer']}
                    >
                      <Button
                        loading={isRegenerated}
                        type="primary"
                        size="large"
                        onClick={() => onRegenerateOrder(id)}
                      >
                        <Icon type="robot" />
                        <FormattedMessage id="Orders.Regenerate" />
                      </Button>
                    </Authorize>
                    <Authorize roles={['root', 'sales', 'salesDirector']}>
                      <Link
                        to={`/orders/create/${order.user.id}/${order.id}`}
                        className="btn btn-link"
                      >
                        <Button type="primary" size="large">
                          <FormattedMessage id="Orders.Prolong" />
                        </Button>
                      </Link>
                      <Button
                        style={{ marginRight: '1.23rem' }}
                        loading={prolonging}
                        type="primary"
                        onClick={() => onQuickProlong(order.id)}
                        size="large"
                      >
                        <FormattedMessage id="Orders.QuickProlong" />
                      </Button>
                      {order.extraDays !== -1 && (
                        <Button
                          style={{ marginRight: '1.23rem' }}
                          type="primary"
                          onClick={() => setExtendDaysModalOpen(true)}
                          size="large"
                        >
                          <FormattedMessage id="Orders.AddExtraDay" />
                        </Button>
                      )}
                      <Modal
                        visible={extendDaysModalOpen}
                        onOk={() => updateOrderDays()}
                        okText={<FormattedMessage id="Orders.SubmitToApproval" />}
                        onCancel={() => {
                          setExtendDaysModalOpen(false)
                          addExtraDays(0)
                        }}
                        okButtonProps={{
                          disabled: newDays.length === 0,
                        }}
                      >
                        <Row gutter={16} style={{ display: 'flex' }}>
                          <Col md={15} xs={24}>
                            <Calendar highlightedDays={highlightedDays} />
                          </Col>
                          <Col md={9} xs={24}>
                            <div className={styles.extraDayBtn}>
                              <Button
                                type={newDays.length === 1 ? 'primary' : 'default'}
                                disabled={newDays.length === 1}
                                onClick={() => addExtraDays(1)}
                                size="large"
                              >
                                <FormattedMessage id="Orders.Add1ExtraDay" />
                              </Button>
                              <Button
                                type={newDays.length === 2 ? 'primary' : 'default'}
                                disabled={newDays.length === 2}
                                onClick={() => addExtraDays(2)}
                                size="large"
                              >
                                <FormattedMessage id="Orders.Add2ExtraDay" />
                              </Button>
                              {newDays.length !== 0 && (
                                <p>
                                  {newDays.length}{' '}
                                  <FormattedMessage id="Orders.ExtraDaysWillBeAdded" />
                                </p>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </Modal>
                      <Button type="dashed" onClick={showPauseDrawer} size="large">
                        <FormattedMessage id="Orders.Pause" />
                      </Button>
                    </Authorize>
                  </>
                )}
                <Authorize roles={['root', 'sales', 'salesDirector', 'admin']}>
                  {order.status === 'new' &&
                    !order.isOnApprovalWithoutInvoice &&
                    !order.onApproveDeliveryFee &&
                    !order.user.paymentData.isCompany && (
                      <>
                        <Popconfirm
                          title={<FormattedMessage id="Orders.AreYouSureAcceptThisOrder?" />}
                          onConfirm={() => onChangeStatus('accepted')}
                          okText={<FormattedMessage id="Orders.Accept" />}
                          cancelText={<FormattedMessage id="Orders.Cancel" />}
                        >
                          <Dropdown.Button
                            type="primary"
                            size="large"
                            loading={loading.toString()}
                            overlay={<OverlayMenu update={update} id={id} />}
                            style={{ marginRight: '10px', marginBottom: '10px' }}
                          >
                            <FormattedMessage id="Orders.Accept" />
                          </Dropdown.Button>
                        </Popconfirm>
                        <Popconfirm
                          title={<FormattedMessage id="Orders.AreYouSureRejectThisOrder?" />}
                          onConfirm={() => onChangeStatus('rejected')}
                          okText="Accept"
                          cancelText="Cancel"
                        >
                          <Button
                            type="danger"
                            style={{ marginRight: '10px', marginBottom: '10px' }}
                            size="large"
                          >
                            <FormattedMessage id="Orders.Reject" />
                          </Button>
                        </Popconfirm>
                      </>
                    )}
                  {order.status === 'new' &&
                    !order.isOnApprovalWithoutInvoice &&
                    !order.onApproveDeliveryFee &&
                    order.user.paymentData.isCompany && (
                      <>
                        <Button
                          type="primary"
                          size="large"
                          onClick={showAcceptCompanyModal}
                          style={{ marginRight: '10px', marginBottom: '10px' }}
                        >
                          <FormattedMessage id="Orders.Accept as Company (s.r.o.)" />
                        </Button>
                        <Popconfirm
                          title={<FormattedMessage id="Orders.AreYouSureRejectThisOrder?" />}
                          onConfirm={() => onChangeStatus('rejected')}
                          okText={<FormattedMessage id="Orders.Accept" />}
                          cancelText={<FormattedMessage id="Orders.Cancel" />}
                        >
                          <Button
                            type="danger"
                            style={{ marginRight: '10px', marginBottom: '10px' }}
                            size="large"
                          >
                            <FormattedMessage id="Orders.Reject" />
                          </Button>
                        </Popconfirm>
                      </>
                    )}

                  {order.status === 'fromWeb' && (
                    <>
                      <Popconfirm
                        title={<FormattedMessage id="Orders.AreYouSureAcceptThisOrder?" />}
                        onConfirm={() => onChangeStatus('waitingPayment')}
                        okText="Yes"
                        cancelText="Cancel"
                      >
                        <Button
                          type="primary"
                          size="large"
                          style={{ marginRight: '10px', marginBottom: '10px' }}
                        >
                          <FormattedMessage id="Orders.GenerateInvoice" />
                        </Button>
                      </Popconfirm>
                      <Popconfirm
                        title={<FormattedMessage id="Orders.AreYouSureRejectThisOrder?" />}
                        onConfirm={() => onChangeStatus('rejected')}
                        okText={<FormattedMessage id="Orders.Accept" />}
                        cancelText={<FormattedMessage id="Orders.Cancel" />}
                      >
                        <Button
                          type="danger"
                          style={{ marginRight: '10px', marginBottom: '10px' }}
                          size="large"
                        >
                          <FormattedMessage id="Orders.Reject" />
                        </Button>
                      </Popconfirm>
                    </>
                  )}
                  {order.status === 'waitingPayment' && (
                    <>
                      <Popconfirm
                        title={<FormattedMessage id="Orders.AreYouSureAcceptThisOrder?" />}
                        onConfirm={() => acceptFromWeb()}
                        okText={<FormattedMessage id="Orders.Yes" />}
                        cancelText={<FormattedMessage id="Orders.Cancel" />}
                      >
                        <Button
                          type="primary"
                          size="large"
                          style={{ marginRight: '10px', marginBottom: '10px' }}
                        >
                          <FormattedMessage id="Orders.AcceptFromWeb" />
                        </Button>
                      </Popconfirm>
                    </>
                  )}
                  <Tooltip
                    title={isRequestApproval ? 'Check Approval Request!' : null}
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                  >
                    <Popconfirm
                      placement="top"
                      title={
                        popconfirmOption === 'remove' ? (
                          <FormattedMessage id="Orders.AreYouSureDeleteThisOrder?" />
                        ) : (
                          <FormattedMessage id="Orders.Create payment?" />
                        )
                      }
                      onConfirm={popconfirmOption === 'remove' ? removeOrder : createOrderPayment}
                      okText={<FormattedMessage id="Orders.Yes" />}
                      cancelText={<FormattedMessage id="Orders.No" />}
                      onCancel={() => setIsDropdownPopconfirm(false)}
                      visible={isDropdownPopconfirm}
                    >
                      <Dropdown.Button
                        onClick={handleEditButtonClick}
                        overlay={actionMenu(order)}
                        style={{ float: 'right' }}
                        size="large"
                        disabled={isRequestApproval}
                      >
                        <i className="icmn-pencil mr-1" />
                        <span
                          style={{
                            color:
                              order.isOnApprovalOfRecalculatedPrice || order.status === 'canceled'
                                ? '#ccc'
                                : 'default',
                          }}
                        >
                          <FormattedMessage id="global.edit" />
                        </span>
                      </Dropdown.Button>
                    </Popconfirm>
                  </Tooltip>
                </Authorize>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CancelModal
        visible={cancelOrderModalOpen}
        order={order}
        onClose={() => setCancelOrderModalOpen(false)}
        isPaid={isPaid}
        update={update}
      />
    </div>
  )
}

export default injectIntl(Card)
