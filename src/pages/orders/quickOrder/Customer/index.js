import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import {
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  Button,
  Checkbox,
  Tooltip,
  DatePicker,
  Switch,
} from 'antd'

@injectIntl
@Form.create()
class CustomerFields extends React.Component {
  constructor(props) {
    super(props)

    this.update = this.update.bind(this)
  }

  update() {
    const { form } = this.props
    const { name, email, paymentAddress, birthday } = this.props.data

    form.setFieldsValue({
      name,
      email,
      billing: paymentAddress,
      birthday,
    })
  }

  render() {
    const {
      form,
      onChangeField,
      onCheckUser,
      checkUser,
      isPhoneChecked,
      language,
      onChangeLanguage,
      intl: { formatMessage },
    } = this.props

    const {
      name,
      inBodyId,
      phone,
      email,
      isCompany,
      companyName,
      zip,
      regNumber,
      vatNumber,
      birthday,
    } = this.props.data

    return (
      <div>
        <Form layout="horizontal" onSubmit={this.onSend}>
          <Row gutter={16}>
            <Col xl={6} md={24}>
              <Form.Item label="Name">
                {form.getFieldDecorator('name', {
                  rules: [{ required: true }],
                  initialValue: name,
                })(
                  <Input
                    placeholder={formatMessage({ id: 'Orders.PleaseEnterUserName' })}
                    onChange={e => onChangeField(e, 'name')}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col xl={3} md={24}>
              <Form.Item label={formatMessage({ id: 'global.phone' })}>
                {form.getFieldDecorator('phone', {
                  rules: [{ required: true }],
                  initialValue: phone,
                })(
                  <Input
                    placeholder={formatMessage({ id: 'Orders.PleaseEnterPhone' })}
                    onChange={e => onChangeField(e, 'phone')}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={24}>
              <Form.Item label={formatMessage({ id: 'global.email' })}>
                {form.getFieldDecorator('email', {
                  rules: [{ type: 'email', required: true }],
                  initialValue: email,
                })(
                  <Input
                    placeholder={formatMessage({ id: 'Orders.PleaseEnterEmail' })}
                    onChange={e => onChangeField(e, 'email')}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col xl={3} md={24}>
              <Form.Item
                label={formatMessage({ id: 'Orders.InBodyId' })}
                rules={[{ required: true }]}
              >
                <Input
                  placeholder={formatMessage({ id: 'Orders.PleaseEnterInBodyId' })}
                  value={inBodyId}
                  onChange={e => onChangeField(e, 'inBodyId')}
                />
              </Form.Item>
            </Col>
            <Col xl={3} md={24}>
              <Form.Item label="Customer">
                <Button
                  loading={isPhoneChecked}
                  onClick={() => onCheckUser(this.update)}
                  type="primary"
                >
                  {formatMessage({ id: 'Orders.CheckPhone' })}
                </Button>
                <br />
                {checkUser && (
                  <small>{formatMessage({ id: 'Orders.CustomerAlreadyExist!' })}</small>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xl={5} md={24}>
              <Form.Item label={formatMessage({ id: 'Orders.DateOfBirth' })}>
                {form.getFieldDecorator('birthday', {
                  rules: [{ required: false }],
                })(
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD.MM.YYYY"
                    placeholder={formatMessage({ id: 'global.date' })}
                    value={birthday ? moment(birthday) : ''}
                    onChange={e => onChangeField(e.toISOString(), 'birthday')}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col xl={10} md={24}>
              <Form.Item label={formatMessage({ id: 'Orders.BillingAddress' })}>
                {form.getFieldDecorator('billing', {
                  rules: [{ required: true }],
                })(
                  <Input
                    placeholder={formatMessage({ id: 'Orders.PleaseEnterBillingAddress' })}
                    onChange={e => onChangeField(e, 'paymentAddress')}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col xl={2} md={24}>
              <Form.Item label={formatMessage({ id: 'Orders.Company' })}>
                <Checkbox checked={isCompany} onChange={e => onChangeField(e, 'isCompany')} />
                <Tooltip
                  title={formatMessage({
                    id:
                      'Orders.IČO, DIČ, ZIP code required for company! Billing address field without ZIP code!',
                  })}
                >
                  <i className="icmn-question" style={{ marginLeft: '5px' }} />
                </Tooltip>
              </Form.Item>
            </Col>
          </Row>
          {isCompany && (
            <Row gutter={16}>
              <Col xl={6} md={24}>
                <Form.Item label={formatMessage({ id: 'Orders.CompanyName' })}>
                  <Input value={companyName} onChange={e => onChangeField(e, 'companyName')} />
                </Form.Item>
              </Col>
              <Col xl={3} md={24}>
                <Form.Item label={formatMessage({ id: 'Orders.IČO' })}>
                  <InputNumber
                    className="w-100"
                    min={0}
                    value={regNumber}
                    onChange={e => onChangeField(e, 'regNumber')}
                  />
                </Form.Item>
              </Col>
              <Col xl={3} md={24}>
                <Form.Item label={formatMessage({ id: 'Orders.DIČ' })}>
                  <Input value={vatNumber} onChange={e => onChangeField(e, 'vatNumber')} />
                </Form.Item>
              </Col>
              <Col xl={3} md={24}>
                <Form.Item label={formatMessage({ id: 'Orders.ZipCode' })}>
                  <InputNumber
                    className="w-100"
                    min={0}
                    value={zip}
                    onChange={e => onChangeField(e, 'zip')}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row gutter={16}>
            <Col xl={5} md={24}>
              <span style={{ float: 'left', marginRight: 10 }}>
                {formatMessage({ id: 'Orders.CommunicationsInEnglish:SPACE' })}
                <Switch checked={language === 'English'} onChange={e => onChangeLanguage(e)} />
              </span>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

export default CustomerFields
