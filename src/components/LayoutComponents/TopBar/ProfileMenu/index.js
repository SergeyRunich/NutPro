import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import { connect } from 'react-redux'
import { Menu, Dropdown, Avatar } from 'antd'
import { FormattedMessage } from 'react-intl'
import styles from './style.module.scss'
import PasswordTool from '../../../NutritionPRO/PasswordTool'

@withRouter
@connect(({ user }) => ({ user }))
class ProfileMenu extends React.Component {
  state = {
    count: 7,
    visible: false,
  }

  logout = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'user/LOGOUT',
    })
  }

  addCount = () => {
    let { count } = this.state
    count += 1
    this.setState({
      count,
    })
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = () => {
    this.setState({
      visible: false,
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  render() {
    const { user } = this.props
    const { visible } = this.state
    const menu = (
      <Menu selectable={false}>
        <Menu.Item>
          <strong>
            <FormattedMessage id="topBar.profileMenu.hello" />, {user.name || 'Anonymous'}
          </strong>
          <div>
            <strong>
              <FormattedMessage id="topBar.profileMenu.role" />:{' '}
            </strong>
            {user.role}
          </div>
        </Menu.Item>
        <Menu.Divider />

        <Menu.Item>
          <Authorize roles={['root']}>
            <Link to="/settings/userManagement">
              <i className={`${styles.menuIcon} icmn-user`} />
              <FormattedMessage id="topBar.userManagement" />
            </Link>
          </Authorize>
        </Menu.Item>

        <Menu.Item>
          <Authorize roles={['root']}>
            <Link to="/settings/kitchenUser">
              <i className={`${styles.menuIcon} icmn-user`} />
              <FormattedMessage id="topBar.kitchenUsers" />
            </Link>
          </Authorize>
        </Menu.Item>

        <Menu.Item>
          <Link to="#" onClick={this.showModal}>
            <i className={`${styles.menuIcon} icmn-key`} />
            <FormattedMessage id="topBar.resetPassword" />
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <Link to="#" onClick={this.logout}>
            <i className={`${styles.menuIcon} icmn-exit`} />
            <FormattedMessage id="topBar.profileMenu.logout" />
          </Link>
        </Menu.Item>
      </Menu>
    )
    return (
      <>
        <Dropdown overlay={menu} trigger={['click']}>
          <div className={styles.dropdown}>
            <Avatar className={styles.avatar} shape="square" size="large" icon="user" />
          </div>
        </Dropdown>
        <PasswordTool visible={visible} handleOk={this.handleOk} handleCancel={this.handleCancel} />
      </>
    )
  }
}

export default ProfileMenu
