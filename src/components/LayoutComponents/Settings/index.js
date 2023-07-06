import React from 'react'
import { useIntl } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'
import { Switch } from 'antd'
import styles from './style.module.scss'

const Settings = () => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const {
    isLightTheme,
    isSettingsOpen,
    isMenuTop,
    isMenuCollapsed,
    isBorderless,
    isMenuShadow,
    isSquaredBorders,
    isFixedWidth,
  } = useSelector(state => state.settings)

  const changeSetting = (setting, value) => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting,
        value,
      },
    })
  }

  const closeSettings = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isSettingsOpen',
        value: false,
      },
    })
  }

  return (
    <div
      className={isSettingsOpen ? `${styles.settings} ${styles.settingsOpened}` : styles.settings}
    >
      <Scrollbars style={{ height: '100vh' }}>
        <div className={styles.container}>
          <div className={styles.title}>
            {intl.formatMessage({ id: 'settings.themeSettings' })}
            <button
              className={`${styles.close} fa fa-times`}
              onClick={closeSettings}
              type="button"
            />
          </div>
          <div className={styles.item}>
            <Switch
              checked={isMenuTop}
              onChange={value => {
                changeSetting('isMenuTop', value)
              }}
            />
            <span className={styles.itemLabel}>
              {intl.formatMessage({ id: 'settings.menuTopHorizontal' })}
            </span>
          </div>
          <div className={styles.item}>
            <Switch
              disabled={isMenuTop}
              checked={isMenuCollapsed && !isMenuTop}
              onChange={value => {
                changeSetting('isMenuCollapsed', value)
              }}
            />
            <span className={styles.itemLabel}>
              {intl.formatMessage({ id: 'settings.collapsedMenu' })}
            </span>
          </div>
          <div className={styles.item}>
            <Switch
              disabled={isMenuTop}
              checked={isMenuShadow && !isMenuTop}
              onChange={value => {
                changeSetting('isMenuShadow', value)
              }}
            />
            <span className={styles.itemLabel}>
              {intl.formatMessage({ id: 'settings.menuShadow' })}
            </span>
          </div>
          <div className={styles.item}>
            <Switch
              checked={isLightTheme}
              onChange={value => {
                changeSetting('isLightTheme', value)
              }}
            />
            <span className={styles.itemLabel}>
              {intl.formatMessage({ id: 'settings.lightTheme' })}
            </span>
          </div>
          <div className={styles.item}>
            <Switch
              checked={isBorderless}
              onChange={value => {
                changeSetting('isBorderless', value)
              }}
            />
            <span className={styles.itemLabel}>
              {intl.formatMessage({ id: 'settings.borderlessCards' })}
            </span>
          </div>
          <div className={styles.item}>
            <Switch
              checked={isSquaredBorders}
              onChange={value => {
                changeSetting('isSquaredBorders', value)
              }}
            />
            <span className={styles.itemLabel}>
              {intl.formatMessage({ id: 'settings.squaredBorders' })}
            </span>
          </div>
          <div className={styles.item}>
            <Switch
              checked={isFixedWidth}
              onChange={value => {
                changeSetting('isFixedWidth', value)
              }}
            />
            <span className={styles.itemLabel}>
              {intl.formatMessage({ id: 'settings.fixedWidth' })}
            </span>
          </div>
        </div>
      </Scrollbars>
    </div>
  )
}

export default Settings
