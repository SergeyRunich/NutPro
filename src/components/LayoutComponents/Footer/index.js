import React from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import styles from './style.module.scss'

const year = moment().format('YYYY')

const Footer = () => (
  <div className={styles.footer}>
    <div className={styles.inner}>
      <div className="row">
        <div className="col-sm-6" />
        <div className="col-sm-6">
          <div style={{ textAlign: 'right' }} className={styles.copyright}>
            <p>
              &copy; {year}{' '}
              <a href="https://nutritionpro.cz/" target="_blank" rel="noopener noreferrer">
                NutritionPRO
              </a>{' '}
              <FormattedMessage id="footer.coopyright" />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default Footer
