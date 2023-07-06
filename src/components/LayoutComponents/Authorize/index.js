import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Redirect } from 'react-router-dom'
import { notification } from 'antd'

@injectIntl
@connect(({ user }) => ({ user }))
class Authorize extends React.Component {
  render() {
    const {
      user: { role, name },
    } = this.props // current user role
    const {
      children,
      redirect = false,
      to = '/404',
      roles = [],
      users = [],
      denied = [],
      intl: { formatMessage },
    } = this.props
    const authorized = (roles.includes(role) || users.includes(name)) && !denied.includes(name)
    const AuthorizedChildren = () => {
      // if user not equal needed role and if component is a page - make redirect to needed route
      if (!authorized && redirect) {
        notification.error({
          message: formatMessage({ id: 'authorize.unauthorizedAccess' }),
          description: formatMessage({ id: 'authorize.noRights' }),
        })
        return <Redirect to={to} />
      }
      // if user not authorized return null to component
      if (!authorized) {
        return null
      }
      // if access is successful render children
      return <span>{children}</span>
    }
    return AuthorizedChildren()
  }
}

export default Authorize
