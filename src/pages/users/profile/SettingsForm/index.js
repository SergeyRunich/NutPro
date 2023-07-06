import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Form, Input, InputNumber, Button, Checkbox, DatePicker } from 'antd'
import moment from 'moment'

const FormItem = Form.Item

const SettingsForm = ({ data, form, onSend }) => {
  const { formatMessage } = useIntl()
  const [isSaveProcessing, setIsSaveProcessing] = useState(false)

  const initialState = {
    address: data.address,
    birthday: data.birthday,
    companyName: data.paymentData.companyName,
    email: data.email,
    inBodyId: data.inBodyId,
    isCompany: data.paymentData.isCompany,
    name: data.name,
    paymentAddress: data.paymentData.address,
    phone: data.phone,
    regNumber: data.paymentData.regNumber,
    vatNumber: data.paymentData.vatNumber,
    zip: data.paymentData.zip,
  }

  /**
   * todo: Consider using valtio to manage state of Object data type
   * https://github.com/pmndrs/valtio
   */
  const [state, setState] = useState(initialState)

  const onChangeDate = e => {
    if (e === null) {
      return
    }

    setState(prev => ({ ...prev, birthday: e.utc().toISOString() }))
  }

  const onChangeField = (e, field) => {
    if (!e || !e.target || typeof e.target !== 'object') {
      setState(prev => ({ ...prev, [field]: e }))
      return
    }

    if (e.target.type === 'checkbox') {
      setState(prev => ({ ...prev, [field]: e.target.checked }))
    } else {
      setState(prev => ({ ...prev, [field]: e.target.value }))
    }

    if (e.persist) {
      e.persist()
    }
  }

  const resetForm = () => {
    form.setFieldsValue(initialState)
    setState(initialState)
  }

  const onEdit = async e => {
    e.preventDefault()
    setIsSaveProcessing(true)
    try {
      await form.validateFields()

      const onSendData = {
        address: state.address,
        birthday: state.birthday,
        email: state.email,
        inBodyId: state.inBodyId,
        name: state.name,
        phone: state.phone,
        paymentData: {
          address: state.paymentAddress,
          companyName: state.companyName,
          isCompany: state.isCompany,
          regNumber: state.regNumber,
          vatNumber: state.vatNumber,
          zip: state.zip,
        },
      }

      await onSend(onSendData)
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
    setIsSaveProcessing(false)
  }

  useEffect(() => {
    const paymentData = {
      companyName: data.paymentData.companyName,
      isCompany: data.paymentData.isCompany,
      paymentAddress: data.paymentData.address,
      regNumber: data.paymentData.regNumber,
      vatNumber: data.paymentData.vatNumber,
      zip: data.paymentData.zip,
    }
    setState({ ...data, ...paymentData })
  }, [data])

  return (
    <Form name="settings" onSubmit={e => onEdit(e)} className="login-form">
      <h5 className="text-black mt-4">
        <strong>{formatMessage({ id: 'Users.Personal Information' })}</strong>
      </h5>
      <div className="row">
        <div className="col-lg-6">
          <FormItem name="name" label={formatMessage({ id: 'global.name' })}>
            {form.getFieldDecorator('name', {
              rules: [{ required: true }],
              initialValue: state.name,
            })(
              <Input
                placeholder={formatMessage({ id: 'global.name' })}
                onChange={e => onChangeField(e, 'name')}
              />,
            )}
          </FormItem>
        </div>
        <div className="col-lg-6">
          <FormItem label={formatMessage({ id: 'Users.InBodyId' })}>
            {form.getFieldDecorator('inBodyId', {
              rules: [{ required: true }],
              initialValue: state.inBodyId,
            })(
              <Input
                placeholder={formatMessage({ id: 'Users.InBodyId' })}
                onChange={e => onChangeField(e, 'inBodyId')}
              />,
            )}
          </FormItem>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <FormItem label={formatMessage({ id: 'global.phone' })}>
            {form.getFieldDecorator('phone', {
              rules: [{ required: false }],
              initialValue: state.phone,
            })(
              <Input
                placeholder={formatMessage({ id: 'global.phone' })}
                onChange={e => onChangeField(e, 'phone')}
              />,
            )}
          </FormItem>
        </div>
        <div className="col-lg-6">
          <FormItem label={formatMessage({ id: 'global.email' })}>
            {form.getFieldDecorator('email', {
              rules: [{ type: 'email' }, { required: false }],
              initialValue: state.email,
            })(
              <Input
                placeholder={formatMessage({ id: 'global.email' })}
                onChange={e => onChangeField(e, 'email')}
              />,
            )}
          </FormItem>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <FormItem label={formatMessage({ id: 'global.address' })}>
            {form.getFieldDecorator('address', {
              rules: [{ required: false }],
              initialValue: state.address,
            })(
              <Input
                placeholder={formatMessage({ id: 'global.address' })}
                onChange={e => onChangeField(e, 'address')}
              />,
            )}
          </FormItem>
        </div>
        <div className="col-lg-6">
          <FormItem label={formatMessage({ id: 'Users.Billing address' })}>
            {form.getFieldDecorator('paymentAddress', {
              rules: [{ required: false }],
              initialValue: state.paymentAddress,
            })(
              <Input
                placeholder={formatMessage({ id: 'Users.Billing address' })}
                onChange={e => onChangeField(e, 'paymentAddress')}
              />,
            )}
          </FormItem>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <FormItem label={formatMessage({ id: 'Users.Date of birth' })}>
            <DatePicker
              style={{ width: '100%', marginTop: 10 }}
              format="DD.MM.YYYY"
              placeholder={formatMessage({ id: 'global.date' })}
              value={state.birthday ? moment(state.birthday) : ''}
              onChange={e => onChangeDate(e)}
            />
          </FormItem>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <Checkbox
            placeholder={formatMessage({ id: 'Users.Company?' })}
            checked={state.isCompany}
            onChange={e => onChangeField(e, 'isCompany')}
          />{' '}
          {formatMessage({ id: 'Users.This is company' })}
        </div>
      </div>
      {state.isCompany && (
        <div className="row">
          <div className="col-lg-4">
            <FormItem label={formatMessage({ id: 'Users.Company name' })}>
              {form.getFieldDecorator('companyName', {
                rules: [{ required: state.isCompany }],
                initialValue: state.companyName,
              })(
                <Input
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'Users.Company name' })}
                  onChange={e => onChangeField(e, 'companyName')}
                />,
              )}
            </FormItem>
          </div>
          <div className="col-lg-2">
            <FormItem label={formatMessage({ id: 'Users.ZIP' })}>
              {form.getFieldDecorator('zip', {
                rules: [{ required: state.isCompany }],
                initialValue: state.zip,
              })(
                <InputNumber
                  min={0}
                  placeholder={formatMessage({ id: 'Users.ZIP' })}
                  onChange={e => onChangeField(e, 'zip')}
                />,
              )}
            </FormItem>
          </div>
          <div className="col-lg-3">
            <FormItem label={formatMessage({ id: 'Users.IČO' })}>
              {form.getFieldDecorator('IČO', {
                rules: [{ required: state.isCompany }],
                initialValue: state.regNumber,
              })(
                <InputNumber
                  placeholder={formatMessage({ id: 'Users.IČO' })}
                  min={0}
                  style={{ width: '100%' }}
                  onChange={e => onChangeField(e, 'regNumber')}
                />,
              )}
            </FormItem>
          </div>
          <div className="col-lg-3">
            <FormItem label={formatMessage({ id: 'Users.DIČ' })}>
              {form.getFieldDecorator('DIČ', {
                rules: [{ required: state.isCompany }],
                initialValue: state.vatNumber,
              })(
                <Input
                  placeholder={formatMessage({ id: 'Users.DIČ' })}
                  onChange={e => onChangeField(e, 'vatNumber')}
                />,
              )}
            </FormItem>
          </div>
        </div>
      )}
      <div className="form-actions">
        <Button
          loading={isSaveProcessing}
          style={{ width: 150 }}
          type="primary"
          htmlType="submit"
          className="mr-3"
        >
          {formatMessage({ id: 'global.save' })}
        </Button>
        <Button disabled={isSaveProcessing} onClick={resetForm}>
          {formatMessage({ id: 'global.reset' })}
        </Button>
      </div>
    </Form>
  )
}

export default Form.create()(SettingsForm)
