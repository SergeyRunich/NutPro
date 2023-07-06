import React from 'react'
import { injectIntl } from 'react-intl'
import { Modal, Form, Input } from 'antd'

// const ResetPasswordForm = ({ visible, onCreate, onCancel }) => {
@injectIntl
@Form.create()
class ResetPasswordForm extends React.Component {
  state = {
    newPassword: '',
  }

  onChangePassword(e) {
    this.setState({
      newPassword: e.target.value,
    })
  }

  render() {
    const {
      form,
      visible,
      onCreate,
      onCancel,
      intl: { formatMessage },
    } = this.props
    const { newPassword } = this.state

    return (
      <Modal
        visible={visible}
        title={formatMessage({ id: 'Orders.CreateANewPassword' })}
        okText={formatMessage({ id: 'global.save' })}
        cancelText={formatMessage({ id: 'global.cancel' })}
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then(values => {
              form.resetFields()
              onCreate(values)
            })
            .catch(info => {
              console.log('Validate Failed:', info)
            })
        }}
      >
        <Form
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: 'public',
          }}
        >
          <Form.Item label={formatMessage({ id: 'Orders.Password' })}>
            {form.getFieldDecorator('password', {
              rules: [{ required: true }],
              setFealdsValue: newPassword,
            })(
              <Input
                type="password"
                placeholder={formatMessage({ id: 'Orders.PleaseEnterPassword' })}
                onChange={e => this.onChangePassword(e)}
              />,
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default ResetPasswordForm
