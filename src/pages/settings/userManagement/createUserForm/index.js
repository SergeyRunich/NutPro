import React from 'react'
import { injectIntl } from 'react-intl'
import { Drawer, Form, Button, Col, Row, Input, Select, notification, Switch } from 'antd'
import { editUser } from 'api/user'

const { Option } = Select

@injectIntl
@Form.create()
class CreateUserForm extends React.Component {
  state = {
    username: '',
    role: 'sales',
    password: '',
    email: '',
    isActive: true,
    isNextLogout: false,
    branches: [],
  }

  constructor(props) {
    super(props)

    this.onSend = this.onSend.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
  }

  componentDidUpdate(prevProps) {
    const { editForm, currentUser, form } = this.props
    if (editForm && prevProps.editForm !== editForm) {
      form.setFieldsValue({
        username: currentUser.username,
        role: currentUser.role,
        email: currentUser.email,
        isActive: currentUser.isActive,
        isNextLogout: currentUser.isNextLogout,
        branches: currentUser.branches,
      })
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        username: currentUser.username,
        role: currentUser.role,
        email: currentUser.email,
        isActive: currentUser.isActive,
        isNextLogout: currentUser.isNextLogout,
        branches: currentUser.branches,
      })
    }
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
      const { username, role, password, email, isActive, isNextLogout, branches } = this.state
      const onSendData = {
        username,
        password,
        role,
        email,
        isActive,
        isNextLogout,
        branches,
      }
      const req = await create(onSendData)
      if (req.status === 201) {
        this.closeDrawer()
        notification.success({
          message: formatMessage({ id: 'User.Created' }),
          description: formatMessage({ id: 'User.User successfully created!' }),
        })
        update()
      } else if (req.status === 409) {
        notification.error({
          message: formatMessage({ id: 'User.Error name' }),
          description: formatMessage({ id: 'User.User with current name already exist!' }),
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

  handleSave = () => {
    const {
      intl: { formatMessage },
      currentUser,
      update,
    } = this.props
    const { username, role, email, isActive, isNextLogout, branches } = this.state
    const onSendData = {
      username,
      role,
      email,
      isActive,
      isNextLogout,
      branches,
    }
    editUser(currentUser.id, onSendData).then(async answer => {
      if (answer.status === 200) {
        this.closeDrawer()
        notification.success({
          message: formatMessage({ id: 'User.Saved' }),
          description: formatMessage({ id: 'User.User info successfully updated!' }),
        })
        update()
      }
    })
  }

  closeDrawer() {
    const { onClose, form } = this.props
    this.setState({
      username: '',
      role: '',
      password: '',
      email: '',
      isActive: false,
      isNextLogout: false,
      branches: [],
    })

    form.resetFields()
    onClose()
  }

  render() {
    const {
      visible,
      form,
      editForm,
      intl: { formatMessage },
      branchesList,
    } = this.props
    const { username, role, password, email, branches } = this.state
    let viewportWidth = 1080
    if (typeof window.innerWidth !== 'undefined') {
      viewportWidth = window.innerWidth
    }
    return (
      <div>
        <Drawer
          title={
            editForm
              ? formatMessage({ id: 'User.Edit user account' })
              : formatMessage({ id: 'User.Create a new user account' })
          }
          width={viewportWidth < 768 ? '100%' : 'auto'}
          onClose={this.closeDrawer}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" onSubmit={this.onSend}>
            <Row gutter={16}>
              <Col md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'User.Username' })}>
                  {form.getFieldDecorator('Username', {
                    rules: [{ required: true }],
                    initialValue: username,
                  })(
                    <Input
                      placeholder={
                        !editForm ? formatMessage({ id: 'User.Please enter user name' }) : ''
                      }
                      onChange={e => this.onChangeField(e, 'username')}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item
                  name="role"
                  label={formatMessage({ id: 'User.Role' })}
                  rules={[{ required: true }]}
                >
                  <Select value={role} onChange={e => this.onChangeField(e, 'role')}>
                    <Option key="sales" value="sales">
                      {formatMessage({ id: 'User.sales' })}
                    </Option>
                    <Option key="trainer" value="trainer">
                      {formatMessage({ id: 'User.trainer' })}
                    </Option>
                    <Option key="admin" value="admin">
                      {formatMessage({ id: 'User.admin' })}
                    </Option>
                    <Option key="root" value="root">
                      {formatMessage({ id: 'User.root' })}
                    </Option>
                    <Option key="finanve" value="finance">
                      {formatMessage({ id: 'User.finance' })}
                    </Option>
                    <Option key="salesDirector" value="salesDirector">
                      {formatMessage({ id: 'User.salesDirector' })}
                    </Option>
                    <Option key="readonlySearch" value="readonlySearch">
                      {formatMessage({ id: 'User.readonlySearch' })}
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={12} sm={24}>
                {!editForm && (
                  <Form.Item label={formatMessage({ id: 'User.Password' })}>
                    {form.getFieldDecorator('password', {
                      rules: [{ required: true }],
                      initialValue: password,
                    })(
                      <Input
                        type="password"
                        placeholder={formatMessage({ id: 'User.Please enter password' })}
                        onChange={e => this.onChangeField(e, 'password')}
                      />,
                    )}
                  </Form.Item>
                )}
                {editForm && (
                  <Form.Item label={formatMessage({ id: 'User.Branches' })}>
                    {form.getFieldDecorator('branches', {
                      // rules: [{ required: true }],
                      initialValue: branches,
                    })(
                      <Select
                        mode="multiple"
                        type="branches"
                        placeholder={formatMessage({ id: 'User.Please chose branches' })}
                        onChange={e => this.onChangeField(e, 'branches')}
                      >
                        {branchesList.map(branch => (
                          <Option key={branch.id} value={branch.id}>
                            {branch.name}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                )}
              </Col>

              <Col md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'global.email' })}>
                  {form.getFieldDecorator('Email', {
                    rules: [{ required: true }],
                    initialValue: email,
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'User.Please enter email' })}
                      onChange={e => this.onChangeField(e, 'email')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={12} sm={24}>
                {!editForm && (
                  <Form.Item label={formatMessage({ id: 'User.Branches' })}>
                    {form.getFieldDecorator('branches', {
                      // rules: [{ required: true }],
                      initialValue: branches,
                    })(
                      <Select
                        mode="multiple"
                        type="branches"
                        placeholder={formatMessage({ id: 'User.Please chose branches' })}
                        onChange={e => this.onChangeField(e, 'branches')}
                      >
                        {branchesList.map(branch => (
                          <Option key={branch.id} value={branch.id}>
                            {branch.name}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                )}
              </Col>
            </Row>
            {editForm && (
              <Row>
                <Col md={12} sm={24}>
                  <div style={{ minWidth: '145px' }}>
                    <span>
                      Is Active
                      <Switch
                        style={{ marginLeft: '15px' }}
                        onChange={e => this.onChangeField(e, 'isActive')}
                      />
                    </span>
                  </div>
                </Col>
                <Col md={12} sm={24}>
                  <div style={{ minWidth: '145px' }}>
                    <span>
                      Is Next Logout
                      <Switch
                        style={{ marginLeft: '15px' }}
                        onChange={e => this.onChangeField(e, 'IsNextLogout')}
                      />
                    </span>
                  </div>
                </Col>
              </Row>
            )}
            <div className="form-actions">
              {!editForm && (
                <Button style={{ width: 150 }} type="primary" htmlType="submit" className="mr-3">
                  {formatMessage({ id: 'global.create' })}
                </Button>
              )}
              {editForm && (
                <Button
                  style={{ width: 150 }}
                  type="primary"
                  onClick={() => this.handleSave()}
                  className="mr-3"
                >
                  {formatMessage({ id: 'global.save' })}
                </Button>
              )}
              <Button onClick={this.closeDrawer}>{formatMessage({ id: 'global.cancel' })}</Button>
            </div>
          </Form>
        </Drawer>
      </div>
    )
  }
}

export default CreateUserForm
