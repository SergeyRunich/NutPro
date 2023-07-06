import React from 'react'
import { injectIntl } from 'react-intl'
import { Modal, Form, Button, Col, Row, Input, notification, Select, Checkbox } from 'antd'

@injectIntl
@Form.create()
class CreateEmailForm extends React.Component {
  state = {
    email: '',
    kitchen: '',
    defValue: false,
    isEdit: false,
  }

  constructor(props) {
    super(props)

    this.onSend = this.onSend.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
  }

  onChangeField(e, field) {
    if (field === 'kitchen') {
      this.setState({
        [field]: e.key,
      })
    } else if (e !== null && e.target) {
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
        change,
        forEdit,
        intl: { formatMessage },
      } = this.props
      await form.validateFields()
      const { email, kitchen, defValue } = this.state
      const onSendData = {
        email,
        kitchen,
        defValue,
      }
      if (forEdit.id) {
        const req = await change(forEdit.id, onSendData)
        if (req.status === 205) {
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'CreateEmailForm.Changed' }),
            description: formatMessage({ id: 'CreateEmailForm.SuccessfullyChanged' }),
          })
          await update()
        } else {
          notification.error({
            message: 'Error',
            description: req.statusText,
            placement: 'topLeft',
          })
        }
      } else {
        const req = await create(onSendData)
        if (req.status === 201) {
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'CreateEmailForm.Created' }),
            description: formatMessage({ id: 'CreateEmailForm.SuccessfullyCreated' }),
          })
          update()
        } else {
          notification.error({
            message: formatMessage({ id: 'CreateEmailForm.Error' }),
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
    if (forEdit.email && forEdit.id) {
      this.setState({
        isEdit: true,
        email: forEdit.email,
        kitchen: forEdit.kitchen.id,
        defValue: forEdit.defValue,
      })
    }
  }

  closeDrawer() {
    const { onClose, form } = this.props
    onClose()
    this.setState({
      email: '',
      kitchen: '',
      defValue: false,
      isEdit: false,
    })
    form.resetFields()
  }

  render() {
    const {
      visible,
      form,
      forEdit,
      kitchens,
      intl: { formatMessage },
    } = this.props
    const { email, kitchen, defValue, isEdit } = this.state

    if (forEdit.id && !isEdit) {
      this.setEdit()
    }

    return (
      <div>
        <Modal
          title={
            isEdit
              ? formatMessage({ id: 'CreateEmailForm.EditEmail' })
              : formatMessage({ id: 'CreateEmailForm.CreateEmail' })
          }
          width="350px"
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
                <Form.Item label={formatMessage({ id: 'global.email' })}>
                  {form.getFieldDecorator('Email', {
                    rules: [{ required: true, type: 'email' }],
                    initialValue: email,
                    setFealdsValue: email,
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'global.email' })}
                      onChange={e => this.onChangeField(e, 'email')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label={formatMessage({ id: 'CreateEmailForm.Kitchen' })}>
                  <Select
                    labelInValue
                    style={{ width: '115px' }}
                    onChange={e => this.onChangeField(e, 'kitchen')}
                    value={{ key: kitchen }}
                    placeholder={formatMessage({ id: 'CreateEmailForm.Select' })}
                  >
                    <Select.Option key="" value="">
                      ---
                    </Select.Option>
                    {kitchens.map(k => (
                      <Select.Option key={k.id} value={k.id}>
                        {k.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label={formatMessage({ id: 'CreateEmailForm.Default' })}>
                  <Checkbox checked={defValue} onChange={e => this.onChangeField(e, 'defValue')} />
                </Form.Item>
              </Col>
            </Row>
            <div className="form-actions">
              <Button style={{ width: 150 }} type="primary" htmlType="submit" className="mr-3">
                {isEdit
                  ? formatMessage({ id: 'global.edit' })
                  : formatMessage({ id: 'global.create' })}
              </Button>
              <Button onClick={this.closeDrawer}>{formatMessage({ id: 'global.cancel' })}</Button>
            </div>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default CreateEmailForm
