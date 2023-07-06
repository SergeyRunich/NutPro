import React from 'react'
import { injectIntl } from 'react-intl'
import { Layout } from 'antd'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import styles from './style.module.scss'

@injectIntl
@withRouter
class LoginLayout extends React.PureComponent {
  render() {
    const {
      children,
      intl: { formatMessage },
    } = this.props

    const year = moment().format('YYYY')

    return (
      <Layout>
        <Layout.Content>
          <div className={`${styles.layout}`}>
            <div className={styles.content}>{children}</div>
            <div className={`${styles.footer} text-center`}>
              <p>
                &copy; {year}{' '}
                <a href="https://nutritionpro.cz/" target="_blank" rel="noopener noreferrer">
                  NutritionPRO
                </a>{' '}
                {formatMessage({ id: 'LoginLayout.Allrightsreserved.' })}
              </p>
            </div>
          </div>
        </Layout.Content>
      </Layout>
    )
  }
}

export default LoginLayout
