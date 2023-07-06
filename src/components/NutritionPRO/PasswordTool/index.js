import React from 'react'
import { injectIntl } from 'react-intl'
import { Modal, Input, notification } from 'antd'
import { changePassword } from '../../../api/user'
// import { UserOutlined, ExceptionOutlined, CarOutlined, GroupOutlined } from '@ant-design/icons'

@injectIntl
class PasswordTool extends React.Component {
  state = {
    currentPassword: '',
    newPassword: '',
    newPasswordRep: '',
  }

  onChangePassword(e, name) {
    let value = e
    if (e.target) {
      // eslint-disable-next-line prefer-destructuring
      value = e.target.value
    }
    this.setState({
      [name]: value,
    })
  }

  handleOk = () => {
    const {
      handleOk,
      intl: { formatMessage },
    } = this.props
    const { newPassword, newPasswordRep, currentPassword } = this.state
    if (!newPassword) {
      notification.error({
        message: formatMessage({ id: 'global.error' }),
        description: formatMessage({ id: 'PasswordTool.PasswordEmpty' }),
      })
      return
    }
    if (newPassword === newPasswordRep) {
      changePassword({ newPassword, currentPassword }).then(async answer => {
        if (answer.status === 205) {
          notification.success({
            message: formatMessage({ id: 'PasswordTool.Done' }),
            description: formatMessage({ id: 'PasswordTool.PassReseted' }),
          })
          this.setState({
            currentPassword: '',
            newPassword: '',
            newPasswordRep: '',
          })
          handleOk()
        } else if (answer.status === 403) {
          notification.error({
            message: formatMessage({ id: 'PasswordTool.Incorrect' }),
            description: formatMessage({ id: 'PasswordTool.CurrentPassIncorrect' }),
          })
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: answer.statusText,
          })
        }
      })
    } else {
      notification.error({
        message: formatMessage({ id: 'global.error' }),
        description: formatMessage({ id: 'PasswordTool.PassDontMatch' }),
      })
    }
  }

  handleCancel = () => {
    const { handleCancel } = this.props
    handleCancel()
  }

  render() {
    const {
      visible,
      intl: { formatMessage },
    } = this.props
    const { newPassword, newPasswordRep, currentPassword } = this.state
    return (
      <div>
        <Modal
          title="Reset Password Tool"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>{formatMessage({ id: 'PasswordTool.CurrentPassword' })}</p>
          <Input
            value={currentPassword}
            type="password"
            onChange={e => this.onChangePassword(e, 'currentPassword')}
          />
          <br />
          <br />
          <p>{formatMessage({ id: 'PasswordTool.NewPassword' })}</p>
          <Input
            value={newPassword}
            type="password"
            onChange={e => this.onChangePassword(e, 'newPassword')}
          />
          <br />
          <br />
          <p>{formatMessage({ id: 'PasswordTool.NewPasswordRepeat' })}</p>
          <Input
            value={newPasswordRep}
            type="password"
            onChange={e => this.onChangePassword(e, 'newPasswordRep')}
          />
        </Modal>
      </div>
    )
  }
}

export default PasswordTool
