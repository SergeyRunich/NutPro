/* eslint-disable react/no-unused-state */
import React from 'react'
import moment from 'moment'
import { injectIntl } from 'react-intl'
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  Checkbox,
  notification,
  InputNumber,
  DatePicker,
} from 'antd'

const { Option } = Select
const dateFormat = 'DD.MM.YYYY'

@injectIntl
@Form.create()
class CreatePromoForm extends React.Component {
  state = {
    code: '',
    type: 'fixedAmount',
    amount: '',
    deactivateAfterApply: false,
    expirationDate: null,
    maxActivations: 0,
    access: '',
    isEdit: false,
    active: true,
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
    e.preventDefault()
    try {
      const {
        form,
        create,
        update,
        forEdit,
        edit,
        intl: { formatMessage },
      } = this.props
      await form.validateFields()
      const {
        code,
        type,
        amount,
        expirationDate,
        maxActivations,
        access,
        active,
        deactivateAfterApply,
      } = this.state
      const onSendData = {
        code,
        type,
        amount,
        deactivateAfterApply,
        expirationDate: expirationDate ? expirationDate.toISOString() : '',
        maxActivations,
        access,
        active,
      }
      if (forEdit.id) {
        const req = await edit(forEdit.id, onSendData)
        if (req.status === 201) {
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'Promo.Saved' }),
            description: formatMessage({ id: 'Promo.PromoCodeSuccessfullySaved!' }),
          })
          await update()
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
            placement: 'topLeft',
          })
        }
      } else {
        const req = await create(onSendData)
        if (req.status === 201) {
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'Promo.Created' }),
            description: formatMessage({ id: 'Promo.Promocode successfully created!' }),
          })
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
    }
  }

  setEdit() {
    const { forEdit } = this.props
    if (forEdit) {
      this.setState({
        isEdit: true,
        code: forEdit.code,
        type: forEdit.type,
        amount: forEdit.amount,
        deactivateAfterApply: forEdit.deactivateAfterApply,
        expirationDate:
          forEdit.expirationDate !== '-'
            ? moment.utc(forEdit.expirationDate, 'DD.MM.YYYY')
            : undefined,
        maxActivations: forEdit.maxActivations,
        access: forEdit.access,
        active: forEdit.active,
      })
    }
  }

  closeDrawer() {
    const { onClose, form } = this.props
    this.setState({
      code: '',
      type: 'fixedAmount',
      amount: '',
      deactivateAfterApply: false,
      expirationDate: undefined,
      maxActivations: 0,
      access: '',
      active: true,
      isEdit: false,
    })

    form.resetFields()
    onClose()
  }

  render() {
    const {
      visible,
      form,
      forEdit,
      intl: { formatMessage },
    } = this.props
    const {
      code,
      type,
      amount,
      // eslint-disable-next-line no-unused-vars
      expirationDate,
      deactivateAfterApply,
      maxActivations,
      access,
      active,
      isEdit,
    } = this.state
    let viewportWidth = 1080
    if (typeof window.innerWidth !== 'undefined') {
      viewportWidth = window.innerWidth
    }

    if (forEdit.id && !isEdit) {
      this.setEdit()
    }

    return (
      <div>
        <Drawer
          title={
            forEdit.id
              ? formatMessage({ id: 'Promo.Edit a promocode' })
              : formatMessage({ id: 'Promo.Create a new promocode' })
          }
          width={viewportWidth < 768 ? '100%' : 'auto'}
          onClose={this.closeDrawer}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" onSubmit={this.onSend}>
            {!forEdit.id && (
              <>
                <Row gutter={16}>
                  <Col md={24} sm={24}>
                    <Form.Item label="Code">
                      {form.getFieldDecorator('Code', {
                        rules: [{ required: true }],
                        setFealdsValue: code,
                      })(
                        <Input
                          placeholder="Please enter code"
                          onChange={e => this.onChangeField(e, 'code')}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col md={24} sm={24}>
                    <Form.Item
                      name="type"
                      label="Type"
                      rules={[
                        {
                          required: true,
                          message: formatMessage({ id: 'Promo.Please choose the type' }),
                        },
                      ]}
                    >
                      <Select
                        placeholder="Please choose the type"
                        value={type}
                        onChange={e => this.onChangeField(e, 'type')}
                      >
                        <Option key="fixedAmount" value="fixedAmount">
                          {formatMessage({ id: 'Promo.Fixed amount' })}
                        </Option>
                        <Option key="percentage" value="percentage">
                          {formatMessage({ id: 'Promo.Percentage' })}
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col md={24} sm={24}>
                    <Form.Item label="Amount">
                      {form.getFieldDecorator('Amount', {
                        rules: [{ required: true }],
                        setFealdsValue: amount,
                      })(
                        <InputNumber
                          style={{ width: '100%' }}
                          size="large"
                          placeholder={formatMessage({ id: 'Promo.Amount' })}
                          onChange={e => this.onChangeField(e, 'amount')}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item style={{ marginBottom: '0px' }} label="Maximum activations">
                  {form.getFieldDecorator('Maximum activations', {
                    rules: [{ required: false }],
                    initialValue: maxActivations,
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      size="large"
                      min={0}
                      placeholder={formatMessage({ id: 'Promo.maxActivations' })}
                      onChange={e => this.onChangeField(e, 'maxActivations')}
                    />,
                  )}
                </Form.Item>
                <span style={{ display: 'block', marginBottom: '25px' }}>
                  {formatMessage({ id: 'Promo.Value of 0 is an unlimited activations' })}
                </span>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label="Access">
                  {form.getFieldDecorator('Access', {
                    rules: [{ required: true }],
                    initialValue: access,
                  })(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Access"
                      value={access}
                      onChange={e => this.onChangeField(e, 'access')}
                    >
                      {['sales', 'all', 'customers'].map(tag => (
                        <Option key={tag} value={tag}>
                          {tag}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label="Expiration date">
                  {form.getFieldDecorator('Expiration date', {
                    rules: [{ required: false }],
                    initialValue: expirationDate,
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      format={dateFormat}
                      disabledDate={currentDay =>
                        currentDay && currentDay < moment.utc().add(-1, 'days')
                      }
                      onChange={e => this.onChangeField(e, 'expirationDate')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            {!forEdit.id && (
              <Row gutter={16}>
                <Col md={24} sm={24}>
                  <Form.Item name="deactivateAfterApply">
                    <Checkbox
                      checked={deactivateAfterApply}
                      onChange={e => this.onChangeField(e, 'deactivateAfterApply')}
                    >
                      {formatMessage({ id: 'Promo.Deactivate after apply' })}
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            )}
            {forEdit.id && (
              <Row gutter={16}>
                <Col md={24} sm={24}>
                  <Form.Item name="active">
                    <Checkbox checked={active} onChange={e => this.onChangeField(e, 'active')}>
                      {formatMessage({ id: 'Promo.Active' })}
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            )}
            <div className="form-actions">
              <Button style={{ width: 150 }} type="primary" htmlType="submit" className="mr-3">
                {forEdit.id
                  ? formatMessage({ id: 'global.save' })
                  : formatMessage({ id: 'global.create' })}
              </Button>
              <Button onClick={this.closeDrawer}>{formatMessage({ id: 'global.cancel' })}</Button>
            </div>
          </Form>
        </Drawer>
      </div>
    )
  }
}

export default CreatePromoForm
