import React from 'react'
import { injectIntl } from 'react-intl'
import {
  Modal,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  Checkbox,
  notification,
  InputNumber,
} from 'antd'

const { Option } = Select

@injectIntl
@Form.create()
class CreatePromoForm extends React.Component {
  state = {
    name: '',
    phone: '',
    email: '',
    mealsPerDay: 5,
    amount: 0,
    days: 20,
    isInvoice: true,
    loading: false,
  }

  constructor(props) {
    super(props)

    this.onSend = this.onSend.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
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

  async onSend(e) {
    const {
      intl: { formatMessage },
    } = this.props
    e.preventDefault()
    this.setState({
      loading: true,
    })
    try {
      const { form, create, update } = this.props
      await form.validateFields()
      const { name, phone, email, mealsPerDay, days, amount, isInvoice } = this.state
      const onSendData = {
        name,
        phone,
        email,
        mealsPerDay,
        days,
        amount,
        isInvoice,
      }
      const req = await create(onSendData)
      if (req.status === 201) {
        this.closeDrawer()
        notification.success({
          message: formatMessage({ id: 'Vaucher.Created' }),
          description: formatMessage({ id: 'Vaucher.Voucher successfully created!' }),
        })
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
  }

  closeDrawer() {
    const { onClose, form } = this.props
    this.setState({
      name: '',
      phone: '',
      email: '',
      mealsPerDay: 5,
      days: 20,
      isInvoice: true,
      loading: false,
    })

    form.resetFields()
    onClose()
  }

  render() {
    const {
      visible,
      form,
      intl: { formatMessage },
    } = this.props
    const { name, phone, email, mealsPerDay, days, isInvoice, loading } = this.state
    // const price = {
    //   2: {
    //     10: 2500,
    //     20: 4500,
    //   },
    //   3: {
    //     10: 3500,
    //     20: 6000,
    //   },
    //   5: {
    //     10: 4500,
    //     20: 8000,
    //   },
    // }
    // let viewportWidth = 1080
    // if (typeof (window.innerWidth) !== 'undefined') {
    //   viewportWidth = window.innerWidth;
    // }
    return (
      <div>
        <Modal
          title="Create a new voucher"
          // width={viewportWidth < 768 ? '100%' : 'auto'}
          onCancel={this.closeDrawer}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
          footer=""
        >
          <Form layout="vertical" onSubmit={this.onSend}>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label={formatMessage({ id: 'global.name' })}>
                  {form.getFieldDecorator('Name', {
                    rules: [{ required: true }],
                    setFealdsValue: name,
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'Vaucher.Name of buyer' })}
                      onChange={e => this.onChangeField(e, 'name')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label="Phone">
                  {form.getFieldDecorator('Phone', {
                    rules: [{ required: true }],
                    setFealdsValue: phone,
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'Vaucher.Phone of buyer' })}
                      onChange={e => this.onChangeField(e, 'phone')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label={formatMessage({ id: 'global.email' })}>
                  {form.getFieldDecorator('Email', {
                    rules: [{ required: true }],
                    setFealdsValue: email,
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'Vaucher.Email of buyer' })}
                      onChange={e => this.onChangeField(e, 'email')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={12} sm={12}>
                <Form.Item
                  name="mealsPerDay"
                  label={formatMessage({ id: 'Vaucher.Meals' })}
                  rules={[
                    {
                      required: true,
                      message: formatMessage({ id: 'Vaucher.Please choose the meals number' }),
                    },
                  ]}
                >
                  <Select
                    placeholder={formatMessage({ id: 'Vaucher.Please choose the meals number' })}
                    value={mealsPerDay}
                    onChange={e => this.onChangeField(e, 'mealsPerDay')}
                  >
                    <Option key="5" value={5}>
                      {formatMessage({ id: 'Vaucher.5 meals' })}
                    </Option>
                    <Option key="3" value={3}>
                      {formatMessage({ id: 'Vaucher.3 meals' })}
                    </Option>
                    <Option key="2" value={2}>
                      {formatMessage({ id: 'Vaucher.3 meals' })}
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} sm={12}>
                <Form.Item
                  name="days"
                  label={formatMessage({ id: 'Vaucher.Days' })}
                  rules={[
                    {
                      required: true,
                      message: formatMessage({ id: 'Vaucher.Please choose the days number' }),
                    },
                  ]}
                >
                  <Select
                    placeholder={formatMessage({ id: 'Vaucher.Please choose the days number' })}
                    value={days}
                    onChange={e => this.onChangeField(e, 'days')}
                  >
                    <Option key="10" value={10}>
                      {formatMessage({ id: 'Vaucher.10 days' })}
                    </Option>
                    <Option key="20" value={20}>
                      {formatMessage({ id: 'Vaucher.20 days' })}
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label={formatMessage({ id: 'Vaucher.Amount' })}>
                  <InputNumber
                    style={{ width: '100%' }}
                    size="large"
                    placeholder={formatMessage({ id: 'Vaucher.Amount' })}
                    onChange={e => this.onChangeField(e, 'amount')}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item name="isInvoice">
                  <Checkbox checked={isInvoice} onChange={e => this.onChangeField(e, 'isInvoice')}>
                    {formatMessage({ id: 'Vaucher.Create & Send invoice' })}
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <div className="form-actions">
              <Button
                loading={loading}
                style={{ width: 150 }}
                type="primary"
                htmlType="submit"
                className="mr-3"
              >
                {formatMessage({ id: 'global.create' })}
              </Button>
              <Button onClick={this.closeDrawer}>{formatMessage({ id: 'global.cancel' })}</Button>
            </div>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default CreatePromoForm
