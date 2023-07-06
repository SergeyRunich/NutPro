import React from 'react'
import { injectIntl } from 'react-intl'
import { Modal, Form, Button, Col, Row, Input, InputNumber, notification } from 'antd'

@injectIntl
@Form.create()
class CreatePointForm extends React.Component {
  state = {
    name: '',
    address: '',
    orderCapacity: 0,
    isActive: true,
    isEdit: false,
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
        change,
        forEdit,
        intl: { formatMessage },
      } = this.props
      await form.validateFields()
      const { name, address, isActive, orderCapacity } = this.state
      const onSendData = {
        name,
        address,
        isActive,
        orderCapacity,
      }
      if (forEdit.id) {
        const req = await change(forEdit.id, onSendData)
        if (req.status === 200) {
          this.closeDrawer()
          this.setState({
            name: '',
            address: '',
            orderCapacity: 0,
            isActive: true,
            isEdit: false,
          })
          notification.success({
            message: formatMessage({ id: 'PickUpPoint.Changed' }),
            description: formatMessage({ id: 'PickUpPoint.Pick-up point successfully changed!' }),
          })
          update()
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
          this.setState({
            name: '',
            address: '',
            orderCapacity: 0,
            isActive: true,
            isEdit: false,
          })
          notification.success({
            message: formatMessage({ id: 'PickUpPoint.Created' }),
            description: formatMessage({ id: 'PickUpPoint.Pick-up point successfully created!' }),
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
    if (forEdit.id) {
      this.setState({
        name: forEdit.name,
        address: forEdit.address,
        isActive: forEdit.isActive,
        orderCapacity: forEdit.orderCapacity,
        isEdit: true,
      })
    }
  }

  closeDrawer() {
    const { onClose, form } = this.props
    this.setState({
      name: '',
      address: '',
      orderCapacity: 0,
      isActive: true,
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
    const { name, address, isEdit, orderCapacity } = this.state

    if (forEdit.id && !isEdit) {
      this.setEdit()
    }
    console.log(name, address, isEdit, orderCapacity)
    // let viewportWidth = 1080
    // if (typeof (window.innerWidth) !== 'undefined') {
    //   viewportWidth = window.innerWidth;
    // }
    return (
      <div>
        <Modal
          title={
            isEdit
              ? formatMessage({ id: 'PickUpPoint.Edit Pick-up point' })
              : formatMessage({ id: 'PickUpPoint.Create a new Pick-up point' })
          }
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
                    initialValue: name,
                    setFealdsValue: name,
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'global.name' })}
                      onChange={e => this.onChangeField(e, 'name')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label={formatMessage({ id: 'global.address' })}>
                  {form.getFieldDecorator('Address', {
                    rules: [{ required: true }],
                    initialValue: address,
                    setFealdsValue: address,
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'global.address' })}
                      onChange={e => this.onChangeField(e, 'address')}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col md={24} sm={24}>
                <Form.Item label={formatMessage({ id: 'PickUpPoint.orderCapacity' })}>
                  {form.getFieldDecorator('Order Capacity', {
                    rules: [{ required: true }],
                    initialValue: orderCapacity,
                    setFealdsValue: 'Order Capacity',
                  })(
                    <InputNumber
                      min={0}
                      value={orderCapacity}
                      onChange={e => this.onChangeField(e, 'orderCapacity')}
                    />,
                  )}
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

export default CreatePointForm
