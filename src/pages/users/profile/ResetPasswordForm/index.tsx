import React, { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import { Modal, Form, Input } from 'antd'

interface IResetPasswordForm {
  form: any // typings for Form component from antd 3.x are wrong (validateFields => void)
  visible: boolean
  onCreate: (values: any) => void
  onCancel: () => void
}

const ResetPasswordForm: FC<IResetPasswordForm> = ({ form, visible, onCreate, onCancel }) => {
  /**
   * If we use antd 4.x then we can just use this hook.
   * Otherwise we need to inject form instance imperatively by
   * Form.create()(ResetPasswordForm)
   */
  // const [form] = Form.useForm();

  const [newPassword, setNewPassword] = useState('')
  const { formatMessage } = useIntl()

  const onOk = () => {
    form
      .validateFields()
      .then((values: any) => {
        form.resetFields()
        onCreate(values)
        /**
         * Cleaning password before closing modal
         */
        setNewPassword('')
      })
      .catch((info: any) => {
        console.error('Validation failed:', info)
      })
  }

  return (
    /**
     * todo: How to set button loading state when using <Modal> ?
     */
    <Modal
      visible={visible}
      title={formatMessage({ id: 'Users.Create a new password' })}
      okText={formatMessage({ id: 'global.save' })}
      cancelText={formatMessage({ id: 'global.cancel' })}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form layout="vertical" name="form_in_modal">
        <Form.Item label={formatMessage({ id: 'Users.Password' })}>
          {form.getFieldDecorator('password', {
            rules: [{ required: true }],
            initialValue: newPassword,
          })(
            <Input
              type="password"
              placeholder={formatMessage({ id: 'Users.Please enter password' })}
              onChange={e => setNewPassword(e.target.value)}
            />,
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Form.create()(ResetPasswordForm)
