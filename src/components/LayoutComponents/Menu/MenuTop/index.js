import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import store from 'store'
import _ from 'lodash'
import styles from './style.module.scss'

const { SubMenu } = Menu

const MenuTop = () => {
  const menuData = useSelector(state => state.menu.menuTopData)
  const { isLightTheme, isSettingsOpen } = useSelector(state => state.settings)
  const [selectedKeys, setSelectedKeys] = useState([])

  const dispatch = useDispatch()
  const { pathname } = useLocation()

  const getSelectedKeys = useCallback(() => {
    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item)
        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key))
        }
        return flattenedItems
      }, [])
    const selectedItem = _.find(flattenItems(menuData, 'children'), ['url', pathname])
    if (selectedItem) {
      setSelectedKeys([selectedItem.key])
    }
  }, [menuData, pathname])

  const handleClick = e => {
    store.set('app.menu.selectedKeys', [e.key])
    if (e.key === 'settings') {
      dispatch({
        type: 'settings/CHANGE_SETTING',
        payload: {
          setting: 'isSettingsOpen',
          value: !isSettingsOpen,
        },
      })
      return
    }
    setSelectedKeys([e.key])
  }

  const generateMenuItems = () => {
    const generateItem = item => {
      const { key, title, url, icon, pro, disabled } = item
      if (item.divider) {
        return
      }
      if (item.url) {
        return (
          <Menu.Item key={`${key}-${title}`} disabled={disabled}>
            {item.target ? (
              <a href={url} target={item.target} rel="noopener noreferrer">
                {icon && <span className={`${icon} ${styles.icon}`} />}
                <span className={styles.title}>{title}</span>
                {pro && <span className="badge badge-primary ml-2">PRO</span>}
              </a>
            ) : (
              <Link to={url}>
                {icon && <span className={`${icon} ${styles.icon}`} />}
                <span className={styles.title}>{title}</span>
                {pro && <span className="badge badge-primary ml-2">PRO</span>}
              </Link>
            )}
          </Menu.Item>
        )
      }
      return (
        <Menu.Item key={key} disabled={disabled}>
          {icon && <span className={`${icon} ${styles.icon}`} />}
          <span className={styles.title}>{title}</span>
          {pro && <span className="badge badge-primary ml-2">PRO</span>}
        </Menu.Item>
      )
    }
    const generateSubmenu = items =>
      items.map(menuItem => {
        if (menuItem.children) {
          const subMenuTitle = (
            <span className={styles.menu} key={menuItem.key}>
              <span className={styles.title}>{menuItem.title}</span>
              {menuItem.icon && <span className={`${menuItem.icon} ${styles.icon}`} />}
            </span>
          )
          return (
            <SubMenu title={subMenuTitle} key={menuItem.key}>
              {generateSubmenu(menuItem.children)}
            </SubMenu>
          )
        }
        return generateItem(menuItem)
      })
    return menuData.map(menuItem => {
      if (menuItem.children) {
        const subMenuTitle = (
          <span className={styles.menu} key={menuItem.key}>
            <span className={styles.title}>{menuItem.title}</span>
            {menuItem.icon && <span className={`${menuItem.icon} ${styles.icon}`} />}
          </span>
        )
        return (
          <SubMenu title={subMenuTitle} key={menuItem.key}>
            {generateSubmenu(menuItem.children)}
          </SubMenu>
        )
      }
      return generateItem(menuItem)
    })
  }

  useEffect(() => {
    getSelectedKeys()
  }, [getSelectedKeys])

  return (
    <>
      <Menu
        theme={isLightTheme ? 'light' : 'dark'}
        onClick={handleClick}
        selectedKeys={selectedKeys}
        mode="horizontal"
      >
        <Menu.Item className={styles.logo} disabled>
          <div className={styles.logoContainer}>
            <img src="resources/images/logo.svg" alt="logo" />
          </div>
        </Menu.Item>
        {generateMenuItems()}
      </Menu>
    </>
  )
}

export default MenuTop
