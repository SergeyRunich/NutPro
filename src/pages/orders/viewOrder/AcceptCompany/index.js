/* eslint-disable array-callback-return */
import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Modal, Button, Popconfirm, Row, Col, Input, Typography, Statistic, Alert } from 'antd'

moment.updateLocale('en', {
  week: { dow: 1 },
})

@injectIntl
class AcceptCompanyModal extends React.Component {
  state = {
    description: 'Catering',
    unit: 'ks',
  }

  constructor(props) {
    super(props)

    this.closeDrawer = this.closeDrawer.bind(this)
    this.clear = this.clear.bind(this)
  }

  onChangeField(e, field) {
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

  clear() {
    this.setState({
      description: '',
      unit: '',
    })
  }

  closeDrawer() {
    const { onClose } = this.props
    this.clear()
    onClose()
  }

  render() {
    const {
      visible,
      order,
      accept,
      intl: { formatMessage },
    } = this.props
    const { description, unit } = this.state

    return (
      <div>
        <Modal
          visible={visible}
          title={`'Accept order for company' ${order.user ? order.user.name : '-'}`}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
          footer={false}
          width="720px"
          onCancel={this.closeDrawer}
        >
          <Row gutter={16}>
            <Col sm={24} lg={12}>
              <div className="card" style={{ margin: '10px' }}>
                <div className="card-body" style={{ padding: '7px' }}>
                  <Typography.Title level={4} style={{ textAlign: 'center' }}>
                    {formatMessage({ id: 'Orders.InvoiceInformation' })}
                  </Typography.Title>
                  <b>{formatMessage({ id: 'Orders.Name:' })}</b>{' '}
                  {order.user ? order.user.paymentData.companyName : '-'} <br />
                  <b>{formatMessage({ id: 'Orders.PaymentAddress:' })}</b>{' '}
                  {order.user ? order.user.paymentData.address : '-'} <br />
                  <b>{formatMessage({ id: 'Orders.ZIP:' })}</b>{' '}
                  {order.user ? order.user.paymentData.zip : '-'} <br />
                  <b>{formatMessage({ id: 'Orders.IČO:' })}</b>{' '}
                  {order.user ? order.user.paymentData.regNumber : '-'} <br />
                  <b>{formatMessage({ id: 'Orders.DIČ:' })}</b>{' '}
                  {order.user ? order.user.paymentData.vatNumber : '-'} <br />
                  <p
                    style={{
                      textAlign: 'center',
                      borderTop: '2px dotted',
                      borderBottom: '2px dotted',
                      padding: '7px',
                    }}
                  >
                    <span style={{ marginRight: '15px' }}>1</span>
                    <span style={{ marginRight: '15px' }}>{unit}</span>
                    <span>{description}</span>
                  </p>
                  <div style={{ textAlign: 'center' }}>
                    {order.isAddDeliveryFee && (
                      <Row gutter={16} style={{ marginBottom: '15px' }}>
                        <Col sm={24} lg={12}>
                          <Statistic
                            title={formatMessage({ id: 'Orders.OrderPrice' })}
                            suffix="Kč"
                            value={order.price}
                          />
                        </Col>
                        <Col sm={24} lg={12}>
                          <Statistic
                            title={formatMessage({ id: 'Orders.DeliveryFee' })}
                            suffix="Kč"
                            value={order.isAddDeliveryFee ? order.length * 50 : 0}
                          />
                        </Col>
                      </Row>
                    )}

                    <Statistic
                      title={formatMessage({ id: 'Orders.TotalWithVAT' })}
                      suffix="Kč"
                      value={order.price + (order.isAddDeliveryFee ? order.length * 50 : 0)}
                    />
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={24} lg={12}>
              <small>{formatMessage({ id: 'Orders.Unit' })}</small>
              <Input value={unit} onChange={e => this.onChangeField(e, 'unit')} />
              <small>{formatMessage({ id: 'Orders.CustomDescription' })}</small>
              <Input value={description} onChange={e => this.onChangeField(e, 'description')} />
              <Alert
                message={formatMessage({ id: 'Orders.BillingInfo' })}
                description={formatMessage({
                  id:
                    'Orders.The invoice will be issued to the name and address specified in this window. If the customers name is specified, and not the companys name, it must be changed.',
                })}
                type="info"
                showIcon
                style={{ marginTop: '20px' }}
              />
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Popconfirm
                  title={formatMessage({ id: 'Orders.AcceptOrderForCompany?' })}
                  onConfirm={() => accept(unit, description)}
                  okText={formatMessage({ id: 'global.accept' })}
                  disabled={false}
                  cancelText={formatMessage({ id: 'global.cancel' })}
                >
                  <Button
                    style={{ width: 150 }}
                    size="large"
                    type="primary"
                    disabled={false}
                    className="mr-3"
                  >
                    {formatMessage({ id: 'Orders.AcceptOrder' })}
                  </Button>
                </Popconfirm>
                <Button onClick={this.closeDrawer} size="large" type="default">
                  {formatMessage({ id: 'global.cancel' })}
                </Button>
              </div>
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}

export default AcceptCompanyModal
