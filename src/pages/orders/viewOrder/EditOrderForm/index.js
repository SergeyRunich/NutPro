import React from 'react'
import lodash from 'lodash'
import { injectIntl } from 'react-intl'
import Authorize from 'components/LayoutComponents/Authorize'
import moment from 'moment'
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  DatePicker,
  Select,
  notification,
  InputNumber,
  Input,
  Checkbox,
  Slider,
  Modal,
  Radio,
  Divider,
} from 'antd'

import { getLastDeliveryDate, isTimestampEditable } from '../../../../services/order'
import { getPickupPoints, getPickupPointByDate } from '../../../../api/pickupPoint'
import { checkPriceChange, getSalesList } from '../../../../api/order'

const { Option } = Select

@injectIntl
@Form.create()
class EditOrderForm extends React.Component {
  state = {
    status: '',
    diet: '',
    PAL: '',
    timestamp: 0,
    size: '',
    length: 0,
    promoCode: '',
    invoice: '',
    ignoredMealTypes: [],
    mealsPerDay: '',
    kitchenDescription: '',
    deliveryDescription: '',
    email: '',
    phone: '',
    address: '',
    kcal: 0,
    prot: 0,
    fat: 0,
    carb: 0,
    isAddDeliveryFee: false,
    sales: '',
    customMenu: {
      meals: [false, false, false, false, false, false, false, false, false, false, false],
      cf: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      count: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      isActive: false,
    },
    saladOnDinner: false,
    customInvoiceName: '',
    acceptedTimestamp: 0,
    pickupPoint: '',
    pickupPoints: [],
    deliveryRange: [17, 22],
    modalVisible: false,
    isPaid: undefined,
    orderChanges: {},
    refund: 'none',
    moneybackDescription: '',
    salesList: [],
    exeptions: [],
    checkingIsAvailable: false,
    isApprovalSent: false,
  }

  constructor(props) {
    super(props)

    this.onSend = this.onSend.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  componentDidMount() {
    const { order } = this.props
    const { customMenu } = this.state
    order.customMenu.data.forEach(m => {
      customMenu.meals[m.meal] = true
      customMenu.cf[m.meal] = m.coefficient
      customMenu.count[m.meal] = m.count
      customMenu.isActive = order.customMenu.isActive
    })
    this.setState({
      status: order.status,
      diet: order.diet,
      PAL: order.PAL,
      timestamp: order.timestamp,
      size: order.size,
      length: order.length,
      promoCode: order.promoCode.active ? order.promoCode.code : '',
      invoice: order.invoice || '',
      ignoredMealTypes: order.ignoredMealTypes,
      mealsPerDay: order.mealsPerDay,
      exeptions: order.exeptions,
      kitchenDescription: order.kitchenDescription,
      deliveryDescription: order.deliveryDescription,
      deliveryRange: order.deliveryRange,
      email: order.user.email,
      phone: order.user.phone,
      address: order.user.address,
      kcal: order.customParams.kcal,
      prot: order.customParams.prot,
      fat: order.customParams.fat,
      carb: order.customParams.carb,
      isAddDeliveryFee: order.isAddDeliveryFee,
      sales: order.sales.id,
      customMenu,
      saladOnDinner: order.saladOnDinner,
      customInvoiceName: order.customInvoiceName,
      acceptedTimestamp: order.acceptedTimestamp,
      pickupPoint: order.pickupPoint.id,
    })
    getPickupPoints().then(async req => {
      if (req.status !== 401) {
        const pickupPoints = await req.json()
        this.setState({
          pickupPoints: pickupPoints.result,
        })
      }
    })
    getSalesList().then(async req => {
      if (req.status !== 401) {
        const salesList = await req.json()
        this.setState({
          salesList: salesList.result,
        })
      }
    })
  }

  onChangeField(e, field) {
    if (field === 'mealsPerDay') {
      this.setState({
        ignoredMealTypes: [],
      })
    }
    if (e !== null && e.target) {
      if (e.target.type === 'checkbox') {
        this.setState({
          [field]: e.target.checked,
        })
      } else {
        this.setState({
          [field]: e.target.value,
        })
      }
    } else {
      this.setState({
        [field]: e,
      })
    }
  }

  onChangeCustomMenu(e, field, index = 0) {
    const { customMenu } = this.state
    if (field === 'isActive') {
      customMenu[field] = e.target.checked
    } else if (e !== null && e.target) {
      if (e.target.type === 'checkbox') {
        customMenu[field][index] = e.target.checked
      } else {
        customMenu[field][index] = e.target.value
      }
    } else {
      customMenu[field][index] = e
    }

    this.setState({
      customMenu,
    })
  }

  onChangeDate(e) {
    if (e !== null) {
      this.setState({
        timestamp: e.utc().unix(),
      })
    }
  }

  onChangeAcceptedTimestamp(e) {
    if (e !== null) {
      this.setState({
        acceptedTimestamp: e.utc().unix(),
      })
    }
  }

  async onSend(e) {
    e.preventDefault()
    const {
      form,
      onCreate,
      update,
      order,
      intl: { formatMessage },
    } = this.props
    const {
      diet,
      status,
      PAL,
      size,
      length,
      promoCode,
      invoice,
      ignoredMealTypes,
      kcal,
      prot,
      fat,
      carb,
      mealsPerDay,
      timestamp,
      deliveryDescription,
      kitchenDescription,
      email,
      phone,
      address,
      isAddDeliveryFee,
      sales,
      customMenu,
      saladOnDinner,
      customInvoiceName,
      acceptedTimestamp,
      pickupPoint,
      deliveryRange,
      exeptions,
    } = this.state

    const checkIscustomMenuSelected =
      !customMenu.isActive ||
      (customMenu.isActive &&
        (customMenu.meals[0] ||
          customMenu.meals[1] ||
          customMenu.meals[2] ||
          customMenu.meals[3] ||
          customMenu.meals[4]))

    if (checkIscustomMenuSelected) {
      try {
        await form.validateFields()

        const promoCodeChanged = order.promoCode.active
          ? promoCode !== order.promoCode.code
          : promoCode.length > 0
        const lengthChanged = length !== order.length
        const ignoredMealTypesChanged = ignoredMealTypes !== order.ignoredMealTypes
        const mealsPerDayChanged = mealsPerDay !== order.mealsPerDay
        const kcalChanged = kcal !== order.customParams.kcal
        const protChanged = prot !== order.customParams.prot
        const fatChanged = fat !== order.customParams.fat
        const carbChanged = carb !== order.customParams.carb

        const isAnyFieldChanged =
          promoCodeChanged ||
          lengthChanged ||
          ignoredMealTypesChanged ||
          mealsPerDayChanged ||
          kcalChanged ||
          protChanged ||
          fatChanged ||
          carbChanged

        const onSendData = {
          diet,
          status,
          PAL,
          size,
          length,
          promoCode,
          invoice,
          ignoredMealTypes,
          mealsPerDay: Number(mealsPerDay),
          timestamp,
          kcal,
          prot,
          fat,
          carb,
          deliveryDescription,
          kitchenDescription,
          email,
          phone,
          address,
          isAddDeliveryFee,
          sales,
          customMenu,
          saladOnDinner,
          customInvoiceName,
          acceptedTimestamp,
          pickupPoint,
          deliveryRange,
          exeptions,
        }

        const isPriceChangedData = {
          promoCode,
          length,
          ignoredMealTypes,
          mealsPerDay: Number(mealsPerDay),
          kcal,
          prot,
          fat,
          carb,
        }

        if ((status === 'accepted' || status === 'waitingPayment') && isAnyFieldChanged) {
          const req = await checkPriceChange({ id: order.id, ...isPriceChangedData })
          const res = await req.json()
          this.setState({ orderChanges: res })
          if (res.isChangedPrice) {
            this.setState({ modalVisible: true })
            if (res.isPaid) {
              this.setState({ isPaid: true })
            } else {
              this.setState({ isPaid: false })
            }
            return
          }
        }
        const req = await onCreate({ id: order.id, ...onSendData })

        if (req.status === 202) {
          notification.success({
            message: formatMessage({ id: 'Orders.Changed' }),
            description: formatMessage({ id: 'Orders.OrderSuccessfullyChanged!' }),
          })
          this.closeDrawer()
          update()
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
            placement: 'topLeft',
          })
        }
      } catch (errorInfo) {
        console.log('Failed:', errorInfo)
      }
    } else {
      notification.error({
        message: formatMessage({ id: 'Orders.CustomMenu' }),
        description: formatMessage({
          id: 'Orders.WhenCustomMenu,need at last one custom meal selected!',
        }),
        placement: 'topRight',
      })
    }
  }

  checkIsAvailable = async () => {
    this.setState({
      checkingIsAvailable: true,
    })
    const { endTimestamp, pickupPoints } = this.state
    const start = moment().format('YYYY-MM-DD')
    const end = moment(endTimestamp).format('YYYY-MM-DD')

    pickupPoints.forEach(async pp => {
      await getPickupPointByDate(pp.id, start, end).then(async req => {
        if (req.status === 200) {
          const json = await req.json()
          const loadArray = json.result.map(r => r.orders.length)
          pp.currentValue = lodash.max(loadArray)
          this.setState({
            pickupPoints,
          })
        }
      })
    })

    this.setState({
      checkingIsAvailable: false,
    })
  }

  handleChangeRefund = e => {
    this.setState({ refund: e.target.value })
  }

  async handleOk() {
    if (this.state.isApprovalSent) {
      return
    }
    try {
      this.setState({ modalVisible: false, isApprovalSent: true })
      const {
        onCreate,
        update,
        order,
        intl: { formatMessage },
      } = this.props
      const {
        isPaid,
        orderChanges,
        refund,
        moneybackDescription,
        diet,
        status,
        PAL,
        size,
        length,
        promoCode,
        invoice,
        ignoredMealTypes,
        kcal,
        prot,
        fat,
        carb,
        mealsPerDay,
        timestamp,
        deliveryDescription,
        kitchenDescription,
        email,
        phone,
        address,
        isAddDeliveryFee,
        sales,
        customMenu,
        saladOnDinner,
        customInvoiceName,
        acceptedTimestamp,
        pickupPoint,
        deliveryRange,
        exeptions,
      } = this.state

      const onSendData = {
        diet,
        status,
        PAL,
        size,
        length,
        promoCode,
        invoice,
        ignoredMealTypes,
        mealsPerDay: Number(mealsPerDay),
        timestamp,
        kcal,
        prot,
        fat,
        carb,
        deliveryDescription,
        kitchenDescription,
        email,
        phone,
        address,
        isAddDeliveryFee,
        sales,
        customMenu,
        saladOnDinner,
        customInvoiceName,
        acceptedTimestamp,
        pickupPoint,
        deliveryRange,
        exeptions,
      }

      if (
        isPaid &&
        orderChanges.data &&
        orderChanges.data.before.price > orderChanges.data.after.price &&
        refund === 'moneyback'
      ) {
        const req = await onCreate({ id: order.id, ...onSendData, refund, moneybackDescription })
        if (req.status === 202) {
          notification.success({
            message: formatMessage({ id: 'global.success' }),
            description: formatMessage({ id: 'Orders.OrderSuccessfullySentForApproval!' }),
          })
          this.closeDrawer()
          update()
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
            placement: 'topLeft',
          })
        }
      } else if (
        isPaid &&
        orderChanges.data &&
        orderChanges.data.before.price > orderChanges.data.after.price &&
        refund === 'credit'
      ) {
        const req = await onCreate({ id: order.id, ...onSendData, refund })
        if (req.status === 202) {
          notification.success({
            message: formatMessage({ id: 'Orders.Changed' }),
            description: formatMessage({ id: 'Orders.OrderSuccessfullySentForApproval!' }),
          })
          this.closeDrawer()
          update()
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
            placement: 'topLeft',
          })
        }
      } else {
        const req = await onCreate({ id: order.id, ...onSendData })
        if (req.status === 202) {
          notification.success({
            message: formatMessage({ id: 'Orders.Changed' }),
            description: formatMessage({ id: 'Orders.OrderSuccessfullySentForApproval!' }),
          })
          this.closeDrawer()
          update()
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
            placement: 'topLeft',
          })
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    } finally {
      this.setState({ isApprovalSent: false })
    }
  }

  handleCancel() {
    this.setState({ modalVisible: false })
  }

  closeDrawer() {
    const { onClose, form } = this.props

    form.resetFields()
    onClose()
  }

  render() {
    const {
      visible,
      form,
      order,
      tags,
      intl: { formatMessage },
    } = this.props
    const {
      diet,
      status,
      PAL,
      size,
      length,
      promoCode,
      invoice,
      ignoredMealTypes,
      mealsPerDay,
      kcal,
      prot,
      fat,
      carb,
      timestamp,
      kitchenDescription,
      deliveryDescription,
      email,
      phone,
      address,
      isAddDeliveryFee,
      sales,
      customMenu,
      saladOnDinner,
      customInvoiceName,
      acceptedTimestamp,
      pickupPoint,
      pickupPoints,
      deliveryRange,
      orderChanges,
      refund,
      isPaid,
      moneybackDescription,
      salesList,
      exeptions,
      checkingIsAvailable,
      isApprovalSent,
    } = this.state
    let viewportWidth = 1080
    if (typeof window.innerWidth !== 'undefined') {
      viewportWidth = window.innerWidth
    }

    const orderChangedData = () => (
      <div>
        {orderChanges.data.before.length !== orderChanges.data.after.length && (
          <p style={{ fontSize: '24px', textAlign: 'center' }}>
            <Divider>{formatMessage({ id: 'Orders.Days' })}</Divider>
            {`${orderChanges.data.before.length} → ${orderChanges.data.after.length}`}
          </p>
        )}
        {orderChanges.data.before.mealsPerDay !== orderChanges.data.after.mealsPerDay && (
          <p style={{ fontSize: '24px', textAlign: 'center' }}>
            <Divider>{formatMessage({ id: 'Orders.Meals' })}</Divider>
            {`${orderChanges.data.before.mealsPerDay} → ${orderChanges.data.after.mealsPerDay}`}
          </p>
        )}
        {orderChanges.data.before.params.energy !== orderChanges.data.after.params.energy && (
          <p style={{ fontSize: '24px', textAlign: 'center' }}>
            <Divider>{formatMessage({ id: 'Orders.kcal' })}</Divider>
            {`${orderChanges.data.before.params.energy} → ${orderChanges.data.after.params.energy}`}
          </p>
        )}
        {orderChanges.data.before.price !== orderChanges.data.after.price && (
          <p style={{ fontSize: '24px', textAlign: 'center' }}>
            <Divider>{formatMessage({ id: 'Orders.Price' })}</Divider>
            {`${orderChanges.data.before.price} Kč → ${orderChanges.data.after.price} Kč`}
          </p>
        )}
      </div>
    )

    return (
      <div>
        <Drawer
          title={formatMessage({ id: 'Orders.EditOrder' })}
          width={viewportWidth < 768 ? '100%' : 'auto'}
          onClose={this.closeDrawer}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" onSubmit={this.onSend}>
            <Row gutter={16}>
              <Col md={12} sm={24}>
                <Form.Item
                  name="status"
                  label={formatMessage({ id: 'Orders.Status' })}
                  rules={[
                    { required: true, message: formatMessage({ id: 'Orders.PleaseChooseStatus' }) },
                  ]}
                >
                  <Select
                    placeholder="Diet"
                    value={status}
                    disabled={status !== 'incomplete'}
                    // disabled
                    onChange={e => this.onChangeField(e, 'status')}
                  >
                    <Option key="new" value="new">
                      {formatMessage({ id: 'Orders.New' })}
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item
                  name="diet"
                  label={formatMessage({ id: 'Orders.Diet' })}
                  rules={[{ required: true, message: 'Please choose diet' }]}
                >
                  <Select
                    placeholder={formatMessage({ id: 'Orders.Diet' })}
                    value={diet}
                    onChange={e => this.onChangeField(e, 'diet')}
                  >
                    <Option key="loose" value="loose">
                      {formatMessage({ id: 'Orders.Loose' })}
                    </Option>
                    <Option key="gain" value="gain">
                      {formatMessage({ id: 'Orders.Gain' })}
                    </Option>
                    <Option key="keep" value="keep">
                      {formatMessage({ id: 'Orders.Keep' })}
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.Length' })}>
                  {form.getFieldDecorator('length', {
                    rules: [{ required: true, type: 'number' }],
                    initialValue: length,
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      min={order.status === 'accepted' ? order.minLength - 1 || 1 : 1}
                      max={365}
                      placeholder={formatMessage({ id: 'Orders.Length' })}
                      disabled={order.status === 'rejected' || order.status === 'canceled'}
                      onChange={e => this.onChangeField(e, 'length')}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item
                  name="size"
                  label={formatMessage({ id: 'Orders.Size' })}
                  rules={[
                    { required: true, message: formatMessage({ id: 'Orders.PleaseChooseSize' }) },
                  ]}
                >
                  <Select
                    placeholder={formatMessage({ id: 'Orders.Diet' })}
                    value={size}
                    onChange={e => this.onChangeField(e, 'size')}
                  >
                    <Option key="short" value="short">
                      {formatMessage({ id: 'Orders.5Days' })}
                    </Option>
                    <Option key="long" value="long">
                      {formatMessage({ id: 'Orders.6Days' })}
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.PAL' })}>
                  {form.getFieldDecorator('PAL', {
                    initialValue: PAL,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder={formatMessage({ id: 'Orders.PAL' })}
                      onChange={e => this.onChangeField(e, 'PAL')}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item
                  name="mealsPerDay"
                  label={formatMessage({ id: 'Orders.MealPerDay' })}
                  rules={[{ required: true, message: 'Please select meals per day' }]}
                >
                  <Select
                    placeholder={formatMessage({ id: 'Orders.MealPerDay' })}
                    value={mealsPerDay}
                    onChange={e => this.onChangeField(e, 'mealsPerDay')}
                  >
                    <Option key="2" value={2}>
                      2
                    </Option>
                    <Option key="3" value={3}>
                      3
                    </Option>
                    <Option key="5" value={5}>
                      5
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={8} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.Exceptions' })}>
                  <Select
                    placeholder={formatMessage({ id: 'Orders.Exception tag' })}
                    defaultValue={order.exeptions}
                    mode="multiple"
                    value={exeptions}
                    onChange={e => this.onChangeField(e, 'exeptions')}
                  >
                    {tags.map(tag => (
                      <Option
                        disabled={exeptions.length !== 0 && exeptions[0] !== tag.id}
                        key={tag.id}
                        value={tag.id}
                      >
                        {tag.title}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={8} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.FirstDeliveryDate' })}>
                  {form.getFieldDecorator('timestamp', {
                    rules: [{ required: true }],
                    initialValue: moment.unix(timestamp),
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      format="DD.MM.YYYY"
                      placeholder={formatMessage({ id: 'global.date' })}
                      disabledDate={currentDay => currentDay < moment() || currentDay.day() === 0}
                      disabled={
                        !isTimestampEditable(timestamp) &&
                        status !== 'new' &&
                        order.source !== 'web'
                      }
                      onChange={e => this.onChangeDate(e)}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col md={8} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.LastDeliveryDate' })}>
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD.MM.YYYY"
                    placeholder={formatMessage({ id: 'global.date' })}
                    disabled
                    value={
                      timestamp && length && size
                        ? moment.unix(
                            getLastDeliveryDate(
                              timestamp,
                              Number(length),
                              size,
                              order.pauses,
                              order.additionalDays,
                              order.removedDays,
                            ),
                          )
                        : 0
                    }
                  />
                </Form.Item>
              </Col>
              <Col md={8} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.DeliveryTime' })}>
                  {form.getFieldDecorator('deliveryTime', {
                    initialValue: deliveryRange,
                  })(
                    <Slider
                      range
                      max={22}
                      min={17}
                      tipFormatter={value => `${value}:00`}
                      defaultValue={deliveryRange}
                      onChange={e => this.onChangeField(e, 'deliveryRange')}
                    />,
                  )}
                  <span>
                    {formatMessage({ id: 'Orders.Time:SPACE' })} {deliveryRange[0]}:00-
                    {deliveryRange[1]}:00
                  </span>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.Promocode' })}>
                  {form.getFieldDecorator('promoCode', {
                    initialValue: promoCode,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder={formatMessage({ id: 'Orders.Promocode' })}
                      onChange={e => this.onChangeField(e, 'promoCode')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.Invoice' })}>
                  {form.getFieldDecorator('invoice', {
                    initialValue: invoice,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder={formatMessage({ id: 'Orders.Invoice' })}
                      onChange={e => this.onChangeField(e, 'invoice')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.DateOfAcceptance' })}>
                  {form.getFieldDecorator('acceptedTimestamp', {
                    initialValue: moment.unix(acceptedTimestamp),
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      format="DD.MM.YYYY"
                      placeholder={formatMessage({ id: 'global.date' })}
                      disabled={status === 'new' || status === 'canceled'}
                      onChange={e => this.onChangeAcceptedTimestamp(e)}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.CustomInvoiceName(s.r.o)' })}>
                  {form.getFieldDecorator('customInvoiceName', {
                    initialValue: customInvoiceName,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder={formatMessage({ id: 'Orders.CustomInvoiceName' })}
                      onChange={e => this.onChangeField(e, 'customInvoiceName')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.IgnoredMeals' })}>
                  <Select
                    placeholder={formatMessage({ id: 'Orders.SkippedMeals' })}
                    mode="tags"
                    disabled={mealsPerDay !== 5}
                    value={ignoredMealTypes}
                    onChange={e => this.onChangeField(e, 'ignoredMealTypes')}
                  >
                    <Option
                      key="Breakfast"
                      disabled={
                        ignoredMealTypes.length !== 0 && ignoredMealTypes[0] !== 'Breakfast'
                      }
                      value="Breakfast"
                    >
                      {formatMessage({ id: 'Orders.Breakfast' })}
                    </Option>
                    <Option
                      key="1. Lunch"
                      disabled={ignoredMealTypes.length !== 0 && ignoredMealTypes[0] !== '1. Lunch'}
                      value="1. Lunch"
                    >
                      {formatMessage({ id: 'Orders.1.Lunch' })}
                    </Option>
                    <Option
                      key="Dinner"
                      disabled={ignoredMealTypes.length !== 0 && ignoredMealTypes[0] !== 'Dinner'}
                      value="Dinner"
                    >
                      {formatMessage({ id: 'Orders.Dinner' })}
                    </Option>
                    <Option
                      key="2. Lunch"
                      disabled={ignoredMealTypes.length !== 0 && ignoredMealTypes[0] !== '2. Lunch'}
                      value="2. Lunch"
                    >
                      {formatMessage({ id: 'Orders.2.Lunch' })}
                    </Option>
                    <Option
                      key="Supper"
                      disabled={ignoredMealTypes.length !== 0 && ignoredMealTypes[0] !== 'Supper'}
                      value="Supper"
                    >
                      {formatMessage({ id: 'Orders.Supper' })}
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'global.email' })}>
                  {form.getFieldDecorator('email', {
                    rules: [
                      {
                        required: true,
                        type: 'email',
                        message: formatMessage({ id: 'Orders.PleaseEnterEmail!' }),
                      },
                    ],
                    initialValue: email,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder={formatMessage({ id: 'global.email' })}
                      onChange={e => this.onChangeField(e, 'email')}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'global.phone' })}>
                  {form.getFieldDecorator('phone', {
                    initialValue: phone,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder={formatMessage({ id: 'global.phone' })}
                      onChange={e => this.onChangeField(e, 'phone')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={16} sm={16}>
                <Form.Item label={formatMessage({ id: 'global.address' })}>
                  {form.getFieldDecorator('address', {
                    initialValue: address,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder={formatMessage({ id: 'global.address' })}
                      onChange={e => this.onChangeField(e, 'address')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col md={24} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.Pick-upPoint' })}>
                  <Select
                    style={{ width: '50%' }}
                    placeholder={formatMessage({ id: 'Orders.Point' })}
                    value={pickupPoint}
                    onChange={e => this.onChangeField(e, 'pickupPoint')}
                  >
                    <Option key={Math.random()} value="">
                      {formatMessage({ id: 'Orders.None' })}
                    </Option>
                    {pickupPoints.map(point => {
                      return (
                        <Option
                          key={Math.random()}
                          value={point.id}
                          disabled={
                            point.currentValue !== undefined
                              ? point.currentValue >= point.orderCapacity
                              : false
                          }
                        >
                          {`${point.name}`}{' '}
                          {`${point.currentValue !== undefined ? point.currentValue : '-'} / ${
                            point.orderCapacity
                          }`}
                        </Option>
                      )
                    })}
                  </Select>
                  <span>
                    <Button
                      loading={checkingIsAvailable}
                      style={{ marginLeft: '15px' }}
                      onClick={this.checkIsAvailable}
                      type="primary"
                    >
                      {formatMessage({ id: 'Orders.check' })}
                    </Button>
                  </span>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.KitchenComment' })}>
                  {form.getFieldDecorator('kitchenDescription', {
                    initialValue: kitchenDescription,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder={formatMessage({ id: 'Orders.KitchenComment' })}
                      onChange={e => this.onChangeField(e, 'kitchenDescription')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.DeliveryComment' })}>
                  {form.getFieldDecorator('deliveryDescription', {
                    initialValue: deliveryDescription,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder={formatMessage({ id: 'Orders.DeliveryComment' })}
                      onChange={e => this.onChangeField(e, 'deliveryDescription')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={6} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.kCal' })}>
                  {form.getFieldDecorator('kcal', {
                    initialValue: kcal,
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      min={500}
                      placeholder={formatMessage({ id: 'Orders.kCal' })}
                      onChange={e => this.onChangeField(e, 'kcal')}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col md={6} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.Prot' })}>
                  {form.getFieldDecorator('prot', {
                    initialValue: prot,
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      min={15}
                      placeholder={formatMessage({ id: 'Orders.Prot' })}
                      onChange={e => this.onChangeField(e, 'prot')}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col md={6} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.Fat' })}>
                  {form.getFieldDecorator('fat', {
                    initialValue: fat,
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      min={15}
                      placeholder={formatMessage({ id: 'Orders.Fat' })}
                      onChange={e => this.onChangeField(e, 'fat')}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col md={6} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.Carb' })}>
                  {form.getFieldDecorator('carb', {
                    initialValue: carb,
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      min={15}
                      placeholder={formatMessage({ id: 'Orders.Carb' })}
                      onChange={e => this.onChangeField(e, 'carb')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={6} sm={24}>
                <Form.Item name="addd">
                  <Checkbox
                    checked={isAddDeliveryFee}
                    onChange={e => this.onChangeField(e, 'isAddDeliveryFee')}
                    disabled={
                      order.onApproveDeliveryFee ||
                      (order.status !== 'new' && order.status !== 'fromWeb')
                    }
                  >
                    {formatMessage({ id: 'Orders.DeliveryFee' })}
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col md={6} sm={24}>
                <Form.Item name="addd2">
                  <Checkbox
                    checked={saladOnDinner}
                    onChange={e => this.onChangeField(e, 'saladOnDinner')}
                  >
                    {formatMessage({ id: 'Orders.SaladOnDinner' })}
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item name="sales" label={formatMessage({ id: 'Orders.Sales' })}>
                  <Select
                    placeholder={formatMessage({ id: 'Orders.Sales' })}
                    value={sales}
                    onChange={e => this.onChangeField(e, 'sales')}
                  >
                    {salesList &&
                      salesList.map(sal => (
                        <Option key={sal.id} value={sal.id}>
                          {sal.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <hr />
            <Authorize roles={['root']}>
              <Row gutter={16}>
                <Col md={24} sm={24}>
                  <Form.Item>
                    <Checkbox
                      checked={customMenu.isActive}
                      onChange={e => this.onChangeCustomMenu(e, 'isActive', 0)}
                    >
                      {formatMessage({ id: 'Orders.CustomMenuIsActive' })}
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </Authorize>
            <Row gutter={16}>
              <Col md={4} sm={24}>
                <Form.Item>
                  <Checkbox
                    checked={customMenu.meals[0]}
                    onChange={e => this.onChangeCustomMenu(e, 'meals', 0)}
                  >
                    {formatMessage({ id: 'Orders.Breakfast' })}
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col md={4} sm={24}>
                <Form.Item>
                  <Checkbox
                    checked={customMenu.meals[1]}
                    onChange={e => this.onChangeCustomMenu(e, 'meals', 1)}
                  >
                    {formatMessage({ id: 'Orders.1Snack' })}
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col md={4} sm={24}>
                <Form.Item>
                  <Checkbox
                    checked={customMenu.meals[2]}
                    onChange={e => this.onChangeCustomMenu(e, 'meals', 2)}
                  >
                    {formatMessage({ id: 'Orders.Lunch' })}
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col md={4} sm={24}>
                <Form.Item>
                  <Checkbox
                    checked={customMenu.meals[3]}
                    onChange={e => this.onChangeCustomMenu(e, 'meals', 3)}
                  >
                    {formatMessage({ id: 'Orders.2Snack' })}
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col md={4} sm={24}>
                <Form.Item>
                  <Checkbox
                    checked={customMenu.meals[4]}
                    disabled={customMenu.meals[10]}
                    onChange={e => this.onChangeCustomMenu(e, 'meals', 4)}
                  >
                    {formatMessage({ id: 'Orders.Dinner' })}
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col md={4} sm={24}>
                <Form.Item>
                  <Checkbox
                    checked={customMenu.meals[10]}
                    disabled={customMenu.meals[4]}
                    onChange={e => this.onChangeCustomMenu(e, 'meals', 10)}
                  >
                    {formatMessage({ id: 'Orders.Salad' })}
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              {[0, 1, 2, 3, 4, 10].map(col => (
                <Col key={col} md={4} sm={24}>
                  <Form.Item>
                    <Select
                      placeholder={formatMessage({ id: 'Orders.Cf' })}
                      disabled={!customMenu.meals[col]}
                      value={customMenu.cf[col]}
                      onChange={e => this.onChangeCustomMenu(e, 'cf', col)}
                    >
                      <Option key={Math.random()} value={0}>
                        {formatMessage({ id: 'Orders.Auto' })}
                      </Option>
                      <Option key={Math.random()} value={1}>
                        1
                      </Option>
                      <Option key={Math.random()} value={1.5}>
                        1.5
                      </Option>
                      {col !== 1 && col !== 3 && (
                        <Option key={Math.random()} value={2}>
                          2
                        </Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
              ))}
            </Row>
            <Row gutter={16}>
              {[0, 1, 2, 3, 4, 10].map(col => (
                <Col key={col} md={4} sm={24}>
                  <Form.Item>
                    <InputNumber
                      min={1}
                      max={100}
                      disabled={!customMenu.meals[col]}
                      placeholder="Count"
                      value={customMenu.count[col]}
                      onChange={e => this.onChangeCustomMenu(e, 'count', col)}
                    />
                  </Form.Item>
                </Col>
              ))}
            </Row>
            <div className="form-actions">
              <Button style={{ width: 150 }} type="primary" htmlType="submit" className="mr-3">
                {formatMessage({ id: 'global.save' })}
              </Button>
              <Button onClick={this.closeDrawer}>Cancel</Button>
            </div>
          </Form>
        </Drawer>
        <Modal
          title={formatMessage({ id: 'Orders.PriceWasChanged!' })}
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          okText={formatMessage({ id: 'Orders.SubmitForApproval' })}
          onCancel={this.handleCancel}
          okButtonProps={{
            disabled:
              (isPaid &&
                orderChanges.data &&
                orderChanges.data.before.price > orderChanges.data.after.price &&
                refund !== 'credit' &&
                refund !== 'moneyback') ||
              (refund === 'moneyback' && !moneybackDescription),
          }}
          loading={isApprovalSent}
        >
          {isPaid &&
          orderChanges.data &&
          orderChanges.data.before.price < orderChanges.data.after.price ? (
            <div>
              {orderChangedData()}
              <Divider>{formatMessage({ id: 'Orders.Description' })}</Divider>
              <p>
                The new price is <b>greater</b> than the old price. The existing invoice has been{' '}
                <b>paid</b>. An additional invoice will be issued for the amount of:{' '}
                {orderChanges.data.after.price - orderChanges.data.before.price} Kč
              </p>
            </div>
          ) : (
            ''
          )}

          {isPaid &&
          orderChanges.data &&
          orderChanges.data.before.price > orderChanges.data.after.price ? (
            <div>
              {orderChangedData()}
              <Divider>{formatMessage({ id: 'Orders.Description' })}</Divider>
              <p>
                The new price is less than the old price. The existing invoice already paid.
                <br />
                Тhe difference in price is{' '}
                <b>{orderChanges.data.before.price - orderChanges.data.after.price} Kč</b>.
                <br />
                <br />
                <center>
                  <b>Specify the method of refund</b>
                </center>
              </p>
              <center>
                <Radio.Group
                  key="refund"
                  value={refund}
                  onChange={this.handleChangeRefund}
                  size="default"
                >
                  <Radio.Button value="credit">Deposit to credit balance</Radio.Button>
                  <Radio.Button value="moneyback">Request a refund</Radio.Button>
                </Radio.Group>
                {refund === 'credit' ? (
                  <span>
                    <br />
                    <br />
                    <b style={{ fontSize: '14px' }}>
                      The difference in cost will be transferred to customer credit balance!
                    </b>
                  </span>
                ) : (
                  ''
                )}
                {refund === 'moneyback' ? (
                  <span>
                    <br />
                    <br />
                    <b>Please enter account number for refund</b>
                    <br />
                    <Input
                      style={{ width: '100%' }}
                      placeholder="account number"
                      onChange={e => this.onChangeField(e, 'moneybackDescription')}
                    />
                  </span>
                ) : (
                  ''
                )}
              </center>
            </div>
          ) : (
            ''
          )}

          {!this.state.isPaid && this.state.orderChanges.data && (
            <div>
              {orderChangedData()}
              <span>
                The new price is
                {this.state.orderChanges.data.before.price <
                this.state.orderChanges.data.after.price
                  ? ' more '
                  : ' less '}
                than the old price. The existing invoice has <b>NOT been paid yet</b>. The current
                invoice for the amount {this.state.orderChanges.data.before.price} Kč will be
                canceled. A new invoice will be created for the amount{' '}
                {this.state.orderChanges.data.after.price} Kč
              </span>
            </div>
          )}
        </Modal>
      </div>
    )
  }
}

export default EditOrderForm
