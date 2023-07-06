import React from 'react'
import { injectIntl } from 'react-intl'
import { Drawer, Form, Button, Col, Row, Input, Select, notification } from 'antd'

import { getAllKitchen } from '../../../../api/kitchen'

const { Option } = Select

@injectIntl
@Form.create()
class CreateUserForm extends React.Component {
  state = {
    username: '',
    role: '',
    password: '',
    kitchen: '',
    kitchens: [{ id: '', name: '-' }],
  }

  constructor(props) {
    super(props)

    this.onSend = this.onSend.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
  }

  componentDidMount() {
    getAllKitchen().then(async req => {
      if (req.status !== 401) {
        const kitchens = await req.json()
        this.setState({
          kitchens,
          kitchen: kitchens[0].id,
        })
      }
    })
  }

  onChangeField(e, field) {
    if (e.target) {
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
        intl: { formatMessage },
      } = this.props
      await form.validateFields()
      const { username, role, password, kitchen } = this.state
      const onSendData = {
        username,
        role,
        password,
        kitchen,
      }
      const req = await create(onSendData)
      if (req.status === 200) {
        this.closeDrawer()
        notification.success({
          message: formatMessage({ id: 'KitchenUser.Created' }),
          description: formatMessage({ id: 'KitchenUser.User successfully created!' }),
        })
        update()
      } else if (req.status === 409) {
        notification.error({
          message: formatMessage({ id: 'KitchenUser.Error name' }),
          description: formatMessage({ id: 'KitchenUser.User with current name already exist!' }),
          placement: 'topLeft',
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

  closeDrawer() {
    const { onClose, form } = this.props
    const { kitchens } = this.state
    this.setState({
      username: '',
      role: '',
      password: '',
      kitchen: kitchens[0].id,
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
    const { username, role, password, kitchen, kitchens } = this.state
    let viewportWidth = 1080
    if (typeof window.innerWidth !== 'undefined') {
      viewportWidth = window.innerWidth
    }
    return (
      <div>
        <Drawer
          title={formatMessage({ id: 'KitchenUser.Create a new kitchen account' })}
          width={viewportWidth < 768 ? '100%' : 'auto'}
          onClose={this.closeDrawer}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" onSubmit={this.onSend}>
            <Row gutter={16}>
              <Col md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'KitchenUser.Username' })}>
                  {form.getFieldDecorator('Username', {
                    rules: [{ required: true }],
                    setFealdsValue: username,
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'KitchenUser.Please enter user name' })}
                      onChange={e => this.onChangeField(e, 'username')}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item
                  name="role"
                  label={formatMessage({ id: 'KitchenUser.Role' })}
                  rules={[{ required: true }]}
                >
                  <Select value={role} onChange={e => this.onChangeField(e, 'role')}>
                    <Option key="cheef" value="cheef">
                      {formatMessage({ id: 'KitchenUser.cheef' })}
                    </Option>
                    <Option key="cook" value="cook">
                      {formatMessage({ id: 'KitchenUser.cook' })}
                    </Option>
                    <Option key="admin" value="admin">
                      {formatMessage({ id: 'KitchenUser.admin' })}
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'KitchenUser.Password' })}>
                  {form.getFieldDecorator('password', {
                    rules: [{ required: true }],
                    setFealdsValue: password,
                  })(
                    <Input
                      type="password"
                      placeholder={formatMessage({ id: 'KitchenUser.Please enter password' })}
                      onChange={e => this.onChangeField(e, 'password')}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item
                  name="kitchen"
                  label={formatMessage({ id: 'KitchenUser.Kitchen' })}
                  rules={[
                    {
                      required: true,
                      message: formatMessage({ id: 'KitchenUser.Please choose the kitchen' }),
                    },
                  ]}
                >
                  <Select
                    placeholder={formatMessage({ id: 'KitchenUser.Please choose the kitchen' })}
                    value={kitchen}
                    onChange={e => this.onChangeField(e, 'kitchen')}
                    style={{ width: '115px' }}
                  >
                    {kitchens.map(k => (
                      <Option key={k.id} value={k.id}>
                        {k.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <div className="form-actions">
              <Button style={{ width: 150 }} type="primary" htmlType="submit" className="mr-3">
                {formatMessage({ id: 'global.create' })}
              </Button>
              <Button onClick={this.closeDrawer}>Cancel</Button>
            </div>
          </Form>
        </Drawer>
      </div>
    )
  }
}

export default CreateUserForm
