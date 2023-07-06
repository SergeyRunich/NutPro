import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Redirect, withRouter } from 'react-router-dom'
import { Button, notification, Row, Col, Statistic } from 'antd'
import { Helmet } from 'react-helmet'

import Customer from './Customer'
import DeliveryInfo from './DeliveryInfo'
import B2BOrder from './Order'
import B2BPreview from './B2BPreview'

import { postB2BOrder, getInfoB2BOrder } from '../../../api/order'
import { getUser } from '../../../api/customer'

moment.updateLocale('en', {
  week: { dow: 1 },
})

@injectIntl
@withRouter
class QuickOrder extends React.Component {
  state = {
    name: '',
    email: '',
    phone: '',
    address: '',
    userId: '',
    orderId: '',
    customPrice: 0,
    deliveryTime: [17, 22],
    deliveryDescription: '',
    isAddDeliveryFee: false,
    isAddressChecked: false,
    sendEmail: true,
    previewVisible: false,
    orders: [
      {
        dishes: [
          {
            dishCode: '',
            count: 1,
          },
        ],
        timestamp: moment()
          .add(1, 'weeks')
          .startOf('week')
          .format('DD.MM.YYYY'),
      },
      {
        dishes: [
          {
            dishCode: '',
            count: 1,
          },
        ],
        timestamp: moment()
          .add(1, 'weeks')
          .startOf('week')
          .add(1, 'days')
          .format('DD.MM.YYYY'),
      },
      {
        dishes: [
          {
            dishCode: '',
            count: 1,
          },
        ],
        timestamp: moment()
          .add(1, 'weeks')
          .startOf('week')
          .add(2, 'days')
          .format('DD.MM.YYYY'),
      },
      {
        dishes: [
          {
            dishCode: '',
            count: 1,
          },
        ],
        timestamp: moment()
          .add(1, 'weeks')
          .startOf('week')
          .add(3, 'days')
          .format('DD.MM.YYYY'),
      },
      {
        dishes: [
          {
            dishCode: '',
            count: 1,
          },
        ],
        timestamp: moment()
          .add(1, 'weeks')
          .startOf('week')
          .add(4, 'days')
          .format('DD.MM.YYYY'),
      },
      {
        dishes: [
          {
            dishCode: '',
            count: 1,
          },
        ],
        timestamp: moment()
          .add(1, 'weeks')
          .startOf('week')
          .add(5, 'days')
          .format('DD.MM.YYYY'),
      },
    ],
    paymentAddress: '',
    isCompany: '',
    zip: '',
    regNumber: '',
    vatNumber: '',
    ordersInfo: [],
  }

  constructor(props) {
    super(props)
    this.onChangeField = this.onChangeField.bind(this)
    this.onChangeDeliveryTime = this.onChangeDeliveryTime.bind(this)
    this.onChangeB2BMenu = this.onChangeB2BMenu.bind(this)
    this.onChangeCustomPrice = this.onChangeCustomPrice.bind(this)
    this.addDish = this.addDish.bind(this)
    this.addOrder = this.addOrder.bind(this)
    this.removeOrder = this.removeOrder.bind(this)
    this.removeDish = this.removeDish.bind(this)
    this.getPreview = this.getPreview.bind(this)
    this.onClosePreview = this.onClosePreview.bind(this)
  }

  componentDidMount() {
    const { props } = this
    getUser(props.match.params.id).then(async user => {
      const json = await user.json()
      this.setState({
        userId: json.id,
        name: json.name,
        email: json.email,
        phone: json.phone,
        address: json.address,
        paymentAddress: json.paymentData.address,
        isCompany: json.paymentData.isCompany,
        zip: json.paymentData.zip,
        regNumber: json.paymentData.regNumber,
        vatNumber: json.paymentData.vatNumber,
      })
    })
  }

  onChangeB2BMenu(e, orderIndex = 0, field, index = 0, param) {
    const { orders } = this.state

    if (field === 'timestamp') {
      orders[orderIndex][field] = e.format('DD.MM.YYYY')
    } else if (e !== null && e.target) {
      if (e.target.type === 'checkbox') {
        orders[orderIndex][field][index][param] = e.target.checked
      } else {
        orders[orderIndex][field][index][param] = e.target.value
      }
    } else {
      orders[orderIndex][field][index][param] = e
    }

    this.setState({
      orders,
    })
  }

  onChangeField(e, field) {
    if (e !== null) {
      let v = e
      if (e.target) {
        if (e.target.type === 'checkbox') {
          v = e.target.checked
        } else {
          v = e.target.value
        }
      }
      this.setState({
        [field]: v,
      })
    }
  }

  // onChangeDate(e) {
  //   if (e !== null) {
  //     this.setState({
  //       timestamp: e.format('DD.MM.YYYY'),
  //     })
  //   }
  // }

  onChangeCustomPrice(e) {
    if (e !== null) {
      this.setState({
        customPrice: e,
      })
    }
  }

  onChangeDeliveryTime(deliveryTime) {
    this.setState({
      deliveryTime,
    })
  }

  async onSend() {
    const {
      intl: { formatMessage },
    } = this.props
    try {
      const {
        userId,
        address,
        deliveryDescription,
        sendEmail,
        customPrice,
        deliveryTime,
        orders,
      } = this.state
      const onSendData = {
        userId,
        address,
        sendEmail,
        orders,
        customPrice,
        deliveryDescription,
        deliveryTime,
      }
      if (!address || !orders || !customPrice) {
        notification.error({
          message: formatMessage({ id: 'Orders.Requiredfieldscannotbeempty' }),
          description: formatMessage({ id: 'Orders.Fillinallrequiredfields!' }),
          placement: 'topRight',
        })
        return
      }
      const req = await postB2BOrder(onSendData)
      if (req.ok) {
        const json = await req.json()
        notification.success({
          message: formatMessage({ id: 'Orders.Created' }),
          description: formatMessage({ id: 'Orders.B2BOrdersuccessfullycreated!' }),
        })
        this.setState({
          orderId: json.orderId,
        })
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
  }

  async getPreview() {
    const {
      intl: { formatMessage },
    } = this.props
    try {
      const { orders } = this.state

      const req = await getInfoB2BOrder({ orders })
      const json = await req.json()
      if (req.status === 200) {
        this.setState({
          ordersInfo: json.result,
        })
        this.showPreview()
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
  }

  showPreview = () => {
    this.setState({
      previewVisible: true,
    })
  }

  onClosePreview = () => {
    this.setState({
      previewVisible: false,
    })
  }

  addOrder() {
    const { orders } = this.state
    orders.push({
      dishes: [
        {
          dishCode: '',
          count: 1,
        },
      ],
      timestamp: moment()
        .add(2 + orders.length, 'days')
        .format('DD.MM.YYYY'),
    })
    this.setState({
      orders,
    })
  }

  removeOrder(orderIndex) {
    const { orders } = this.state
    orders.splice(orderIndex, 1)
    this.setState({
      orders,
    })
  }

  addDish(orderIndex) {
    const { orders } = this.state
    orders[orderIndex].dishes.push({
      dishCode: '',
      count: 1,
    })
    this.setState({
      orders,
    })
  }

  removeDish(orderIndex, dishIndex) {
    const { orders } = this.state
    orders[orderIndex].dishes.splice(dishIndex, 1)
    this.setState({
      orders,
    })
  }

  render() {
    const {
      name,
      phone,
      email,
      orderId,
      deliveryDescription,
      deliveryTime,
      address,
      // sendEmail,
      orders,
      customPrice,
      paymentAddress,
      isCompany,
      regNumber,
      vatNumber,
      zip,
      isAddDeliveryFee,
      isAddressChecked,
      previewVisible,
      ordersInfo,
    } = this.state
    const {
      intl: { formatMessage },
    } = this.props
    return (
      <div>
        {orderId !== '' && <Redirect to={`/orders/${orderId}`} />}
        <Helmet title="B2B order" />
        <div>
          <div className="row">
            <div className="col-md-6 col-xs-12">
              <div className="card card--fullHeight">
                <div className="card-body" style={{ padding: '10px 20px' }}>
                  <Customer
                    data={{
                      name,
                      phone,
                      email,
                      paymentAddress,
                      isCompany,
                      regNumber,
                      vatNumber,
                      zip,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xs-12">
              <div className="card">
                <div className="card-body" style={{ padding: '10px 20px' }}>
                  <DeliveryInfo
                    deliveryTime={deliveryTime}
                    onChangeField={this.onChangeField}
                    onChangeDeliveryTime={this.onChangeDeliveryTime}
                    address={address}
                    deliveryDescription={deliveryDescription}
                    isAddDeliveryFee={isAddDeliveryFee}
                    isAddressChecked={isAddressChecked}
                    customPrice={customPrice}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-xs-12">
              <div className="card card--fullHeight">
                <div className="card-body" style={{ padding: '10px 20px' }}>
                  <Button
                    type="primary"
                    onClick={this.addOrder}
                    disabled={orders.length >= 6}
                    style={{ marginRight: '15px' }}
                  >
                    {formatMessage({ id: 'Orders.AddDay' })}
                  </Button>
                  <Button type="primary" onClick={() => this.getPreview()}>
                    {formatMessage({ id: 'Orders.Preview' })}
                  </Button>
                  <hr />
                  <div className="row">
                    {orders.map((order, index) => (
                      <div
                        key={Math.random()}
                        className={`col-md-2 col-xs-12 pb-3 border border-gray border-left-0 ${
                          index < 6 ? 'border-top-0' : ''
                        } border-bottom-0 ${(index + 1) % 6 === 0 ? 'border-right-0' : ''}`}
                      >
                        <B2BOrder
                          order={order}
                          index={index}
                          addDish={this.addDish}
                          length={orders.length}
                          onChangeB2BMenu={this.onChangeB2BMenu}
                          removeOrder={this.removeOrder}
                          removeDish={this.removeDish}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-xs-12">
              <div className="card" style={{ border: '1px solid' }}>
                <div className="card-body">
                  <Row gutter={16}>
                    <Col sm={6}>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.DeliveryAddress' })}</strong>
                        <br />
                        {address}
                      </p>
                    </Col>
                    <Col sm={4}>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.DeliveryTime' })}</strong>
                        <br />
                        {deliveryTime[0]}:00-{deliveryTime[1]}:00
                      </p>
                    </Col>
                    <Col sm={8}>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.DeliveryComment' })}</strong>
                        <br />
                        {deliveryDescription || '-'}
                      </p>
                    </Col>
                  </Row>
                  <hr />
                  <Row gutter={16}>
                    <Col sm={24} lg={3}>
                      <Statistic
                        title={formatMessage({ id: 'Orders.Days' })}
                        value={orders.length}
                      />
                    </Col>
                    <Col sm={24} lg={4}>
                      <Statistic
                        title={formatMessage({ id: 'Orders.FirstDay' })}
                        value={orders[0].timestamp}
                      />
                    </Col>
                    <Col sm={24} lg={4}>
                      <Statistic
                        title={formatMessage({ id: 'Orders.LastDay' })}
                        value={orders[orders.length - 1].timestamp}
                      />
                    </Col>
                    <Col sm={24} lg={4}>
                      <Statistic
                        title={formatMessage({ id: 'Orders.Price' })}
                        value={customPrice}
                        suffix="Kč"
                      />
                    </Col>
                    <Col sm={24} lg={9}>
                      <Button
                        style={{ float: 'right', marginLeft: 10, marginTop: '10px' }}
                        type="primary"
                        size="large"
                        onClick={async () => this.onSend()}
                      >
                        {formatMessage({ id: 'global.create' })}
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>
        <B2BPreview visible={previewVisible} orders={ordersInfo} onClose={this.onClosePreview} />
      </div>
    )
  }
}

export default QuickOrder
