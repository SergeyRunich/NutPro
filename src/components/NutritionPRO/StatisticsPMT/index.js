import React from 'react'
import { Statistic } from 'antd'
import styles from './style.module.scss'

class ShortItemInfo extends React.Component {
  render() {
    const { value, label, digits, suffix, i } = this.props

    const val =
      i <= 1
        ? value?.toLocaleString('cs-CZ', {
            style: 'currency',
            currency: 'CZK',
            minimumFractionDigits: 0,
          })
        : `${value?.toFixed(digits || 0)} ${suffix}` || ''

    return (
      <Statistic
        style={{ textAlign: 'center' }}
        title={label && <h2 className={styles.name}>{label}</h2>}
        value={val}
      />
    )
  }
}

export default ShortItemInfo
