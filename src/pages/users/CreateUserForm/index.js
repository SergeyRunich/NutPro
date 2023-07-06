/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import moment from 'moment'
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
  DatePicker,
  Spin,
} from 'antd'

import { useQuery } from 'react-query'
import { getAllKitchen } from '../../../api/kitchen'
import { getQueryName } from '../../../helpers/components'

const { Option } = Select

const defaultState = {
  name: '',
  inBodyId: '',
  phone: '',
  email: '',
  password: '',
  kitchen: '',
  comment: '',
  demoOrder: false,
  address: '',
  paymentAddress: '',
  isCompany: false,
  zip: null,
  regNumber: null,
  vatNumber: '',
  birthday: null,
}

const generatePassword = () => {
  return Math.random()
    .toString(36)
    .slice(-8)
}

const CreateUserForm = ({ visible, form, create, update, onClose }) => {
  const { formatMessage } = useIntl()
  const [isAccountCreating, setIsAccountCreating] = useState(false)
  const [state, setState] = useState({
    ...defaultState,
    password: generatePassword(),
  })

  const kitchens = useQuery(
    getQueryName(CreateUserForm, 'kitchens'),
    async () => {
      const req = await getAllKitchen()
      return req.json()
    },
    {
      retry: false,
      cacheTime: 0,
      onError: e =>
        notification.error({
          message: `Failed to obtain kitchens list: ${e.message}`,
        }),
    },
  )

  useEffect(() => {
    if (!kitchens.data || state.kitchen) {
      return
    }
    setState(prev => ({ ...prev, kitchen: kitchens.data[0].id }))
  }, [kitchens.data, state.kitchen])

  const onChangeField = (e, field) => {
    if (e === null) {
      return
    }

    let value = e

    if (e.target) {
      if (e.target.type === 'checkbox') {
        value = e.target.checked
      } else {
        value = e.target.value
      }
    }

    const statePatch = {
      [field]: value,
    }

    if (field === 'phone') {
      let phone = value.replace(/\s/g, '')
      if (phone.length > 9) {
        phone = phone.substr(-9, 9)
      }
      statePatch.inBodyId = phone
    }

    setState(prev => ({ ...prev, ...statePatch }))
  }

  const closeDrawer = () => {
    setState({
      ...defaultState,
      kitchen: kitchens.data[0].id,
      password: generatePassword(),
    })

    form.resetFields()
    onClose()
  }

  const onSend = async e => {
    e.preventDefault()
    setIsAccountCreating(true)
    try {
      await form.validateFields()

      const requestData = {
        address: state.address,
        birthday: state.birthday,
        comment: state.comment,
        demoOrder: state.demoOrder,
        email: state.email,
        inBodyId: state.inBodyId,
        kitchen: state.kitchen,
        name: state.name,
        password: state.password,
        phone: state.phone,
        paymentData: {
          address: state.paymentAddress,
          isCompany: state.isCompany,
          regNumber: state.regNumber,
          vatNumber: state.vatNumber,
          zip: state.zip,
        },
      }

      const req = await create(requestData)
      if (req.status === 202) {
        closeDrawer()
        notification.success({
          message: formatMessage({ id: 'Users.Created' }),
          description: formatMessage({ id: 'Users.User successfully created!' }),
        })
        update()
      } else if (req.status === 409) {
        notification.error({
          message: formatMessage({ id: 'Users.Error InBodyId' }),
          description: formatMessage({ id: 'Users.User with current InBodyId already exist!' }),
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
      console.error('Failed:', errorInfo)
    }
    setIsAccountCreating(false)
  }

  if (!kitchens.isFetched || !kitchens.data || !state.kitchen) {
    return (
      <center>
        <Spin spinning />
      </center>
    )
  }

  let viewportWidth = 1080
  if (typeof window.innerWidth !== 'undefined') {
    viewportWidth = window.innerWidth
  }

  return (
    <div>
      <Drawer
        title={formatMessage({ id: 'Users.Create a new account' })}
        width={viewportWidth < 768 ? '100%' : 'auto'}
        onClose={closeDrawer}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" onSubmit={onSend}>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="Name">
                {form.getFieldDecorator('name', {
                  rules: [{ required: true }],
                  initialValue: state.name,
                })(
                  <Input
                    placeholder={formatMessage({ id: 'Users.Please enter user name' })}
                    onChange={e => onChangeField(e, 'name')}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item
                label={formatMessage({ id: 'Users.InBodyId' })}
                rules={[{ required: true }]}
              >
                <Input
                  placeholder={formatMessage({ id: 'Users.Please enter inBodyId' })}
                  value={state.inBodyId}
                  onChange={e => onChangeField(e, 'inBodyId')}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label={formatMessage({ id: 'global.phone' })}>
                {form.getFieldDecorator('phone', {
                  rules: [{ required: true }],
                  initialValue: state.phone,
                })(
                  <Input
                    placeholder={formatMessage({ id: 'Users.Please enter phone' })}
                    onChange={e => onChangeField(e, 'phone')}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label={formatMessage({ id: 'global.email' })}>
                {form.getFieldDecorator('email', {
                  rules: [{ type: 'email' }],
                  initialValue: state.email,
                })(
                  <Input
                    placeholder={formatMessage({ id: 'Users.Please enter email' })}
                    onChange={e => onChangeField(e, 'email')}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item
                label={formatMessage({ id: 'Users.Password' })}
                rules={[{ required: true }]}
              >
                <Input
                  // type="password"
                  disabled
                  placeholder={formatMessage({ id: 'Users.Please enter password' })}
                  value={state.password}
                  onChange={e => onChangeField(e, 'password')}
                />
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item
                name="kitchen"
                label="Kitchen"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'Users.Please choose the kitchen' }),
                  },
                ]}
              >
                <Select
                  style={{ width: '115px' }}
                  placeholder={formatMessage({ id: 'Users.Please choose the kitchen' })}
                  value={state.kitchen}
                  onChange={e => onChangeField(e, 'kitchen')}
                >
                  {kitchens.data.map(k => (
                    <Option key={k.id} value={k.id}>
                      {k.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label={formatMessage({ id: 'Users.Date of birth' })}>
                {form.getFieldDecorator('birthday', {
                  rules: [{ required: false }],
                  initialValue: state.birthday ? moment(state.birthday) : null,
                })(
                  <DatePicker
                    style={{ width: '100%', marginTop: 10 }}
                    format="DD.MM.YYYY"
                    placeholder={formatMessage({ id: 'global.date' })}
                    onChange={e => onChangeField(e.toISOString(), 'birthday')}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={24} sm={24}>
              <Form.Item label={formatMessage({ id: 'global.address' })}>
                {form.getFieldDecorator('address', {
                  rules: [{ required: true }],
                  initialValue: state.address,
                })(
                  <Input
                    placeholder={formatMessage({ id: 'Users.Please enter address' })}
                    onChange={e => onChangeField(e, 'address')}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={24} sm={24}>
              <Form.Item label={formatMessage({ id: 'Users.Billing address' })}>
                {form.getFieldDecorator('paymentAddress', {
                  rules: [{ required: true }],
                  initialValue: state.paymentAddress,
                })(
                  <Input
                    placeholder={formatMessage({ id: 'Users.Please enter address' })}
                    onChange={e => onChangeField(e, 'paymentAddress')}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label={formatMessage({ id: 'Users.Is company' })}>
                <Checkbox checked={state.isCompany} onChange={e => onChangeField(e, 'isCompany')} />
              </Form.Item>
            </Col>
            {state.isCompany && (
              <Col md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'Users.ZIP code' })}>
                  {form.getFieldDecorator('zip', {
                    initialValue: state.zip,
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'Users.Please enter zip' })}
                      onChange={e => onChangeField(e, 'zip')}
                    />,
                  )}
                </Form.Item>
              </Col>
            )}
          </Row>
          {state.isCompany && (
            <Row gutter={16}>
              <Col md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'Users.IČO' })}>
                  {form.getFieldDecorator('regNumber', {
                    initialValue: state.regNumber,
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'Users.Please enter IČO' })}
                      onChange={e => onChangeField(e, 'regNumber')}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'Users.DIČ' })}>
                  {form.getFieldDecorator('vatNumber', {
                    initialValue: state.vatNumber,
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'Users.Please enter DIČ' })}
                      onChange={e => onChangeField(e, 'vatNumber')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}

          <div className="form-actions">
            <Button
              style={{ width: 150 }}
              type="primary"
              htmlType="submit"
              className="mr-3"
              loading={isAccountCreating}
            >
              {formatMessage({ id: 'global.create' })}
            </Button>
            <Button onClick={closeDrawer}>{formatMessage({ id: 'global.cancel' })}</Button>
          </div>
        </Form>
      </Drawer>
    </div>
  )
}

export default Form.create()(CreateUserForm)
