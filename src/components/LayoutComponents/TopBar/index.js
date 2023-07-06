import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { injectIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LiveSearch from './LiveSearch'
import Authorize from '../Authorize'
import ProfileMenu from './ProfileMenu'
import LanguageSelector from './LanguageSelector'
import styles from './style.module.scss'

@injectIntl
@connect(({ user }) => ({ user }))
class TopBar extends React.Component {
  render() {
    const {
      user: { role, name },
      intl: { formatMessage },
    } = this.props // current user role

    return (
      <div className={styles.topbar}>
        <div style={{ display: 'flex', alignItems: 'center' }} className="mr-auto">
          <div>
            {['root', 'admin', 'sales', 'salesDirector', 'finance', 'readonlySearch'].includes(
              role,
            ) &&
              name !== 'Vitaly' &&
              name !== 'Ksenia' && <LiveSearch />}
          </div>
          <Authorize roles={['root', 'sales', 'salesDirector']}>
            <div>
              <Link to="/orders/create/">
                <div className="h-20 d-flex flex-column justify-content-center">
                  <Button type="regular">{formatMessage({ id: 'Main.QuickOrder' })}</Button>
                </div>
              </Link>
            </div>
          </Authorize>
        </div>
        {(['root', 'salesDirector'].includes(role) || name === 'Jitka') && (
          <Link to="/dashboard/approvals">
            <Button style={{ marginRight: '30px' }} type="primary">
              {formatMessage({ id: 'topBar.approvals' })}
            </Button>
          </Link>
        )}
        <div className="mr-4">
          <LanguageSelector />
        </div>
        <ProfileMenu />
      </div>
    )
  }
}

export default TopBar
