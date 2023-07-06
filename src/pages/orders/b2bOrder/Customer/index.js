import React from 'react'
import { injectIntl } from 'react-intl'
import { Row, Col, Form, Alert } from 'antd'

@injectIntl
@Form.create()
class CustomerFields extends React.Component {
  render() {
    const {
      intl: { formatMessage },
    } = this.props
    const { name, paymentAddress, phone, email, regNumber, vatNumber, zip } = this.props.data

    return (
      <div>
        <h3>
          {formatMessage({ id: 'Orders.NewB2BOrderForCompany' })} <i>{name}</i>
        </h3>
        <hr />
        <Row gutter={16}>
          <Col xl={12} md={24}>
            <strong>{formatMessage({ id: 'Orders.Phone:SPACE' })}</strong>
            {phone}
            <br />
            <strong>{formatMessage({ id: 'Orders.Email:SPACE' })}</strong>
            {email}
            <br />
            <strong>{formatMessage({ id: 'Orders.BillingAddress:SPACE' })}</strong>
            {paymentAddress}
          </Col>
          <Col xl={12} md={24}>
            <strong>{formatMessage({ id: 'Orders.IČO:SPACE' })}</strong>
            {regNumber}
            <br />
            <strong>{formatMessage({ id: 'Orders.DIČ:SPACE' })}</strong>
            {vatNumber}
            <br />
            <strong>{formatMessage({ id: 'Orders.ZIPCode:SPACE' })}</strong>
            {zip}
          </Col>
        </Row>
        <br />
        <Alert
          message={formatMessage({ id: 'Orders.BillingInfo' })}
          description={formatMessage({ id: 'Orders.info' })}
          type="info"
          showIcon
        />
      </div>
    )
  }
}

export default CustomerFields
