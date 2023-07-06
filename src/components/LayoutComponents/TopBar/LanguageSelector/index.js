import React from 'react'
import { injectIntl } from 'react-intl'
import { Menu, Dropdown } from 'antd'
import { connect } from 'react-redux'
import styles from './style.module.scss'

@injectIntl
@connect(({ settings }) => ({ settings }))
class LanguageSelector extends React.Component {
  changeLang = ({ key }) => {
    const { dispatch } = this.props
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'locale',
        value: key,
      },
    })
  }

  render() {
    const {
      settings: { locale },
      intl: { formatMessage },
    } = this.props
    const language = locale.substr(0, 2)

    const langMenu = (
      <Menu className={styles.menu} selectedKeys={[locale]} onClick={this.changeLang}>
        <Menu.Item key="en-US">
          <span role="img" aria-label="English" className="mr-2">
            🇬🇧
          </span>
          {formatMessage({ id: 'topBar.english' })}
        </Menu.Item>
        <Menu.Item key="ru-RU">
          <span role="img" aria-label="Русский" className="mr-2">
            🇷🇺
          </span>
          {formatMessage({ id: 'topBar.russian' })}
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={langMenu} trigger={['click']}>
        <div className={styles.dropdown}>
          <strong className="text-uppercase">{language}</strong>
        </div>
      </Dropdown>
    )
  }
}

export default LanguageSelector
