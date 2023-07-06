import React from 'react'
import styles from './style.module.scss'

const ShortItemInfo = ({ value, label }) => {
  return (
    <div className={styles.item}>
      <div className={styles.description}>{label && <h2 className={styles.name}>{label}</h2>}</div>
      {value && (
        <div className={styles.actionData}>
          {value.toLocaleString('en', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }) || 0}
        </div>
      )}
    </div>
  )
}

export default ShortItemInfo
