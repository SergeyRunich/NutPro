import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Tabs } from 'antd'
import styles from './style.module.scss'

const { TabPane } = Tabs

@injectIntl
class DayCard extends React.Component {
  state = {}

  render() {
    const {
      day,
      intl: { formatMessage },
    } = this.props
    const sharedStyle = {
      border: '1px solid #e8e8e8',
      borderCollapse: 'collapse',
      borderRadius: '10px',
      padding: '0.5em',
      textAlign: 'center',
      textSize: '10px',
    }

    const tableStyle = {
      border: '1px solid #e8e8e8',
      borderCollapse: 'collapse',
      borderRadius: '5px',
      padding: '0.5em',
      marginTop: '15px',
      display: 'inline-table',
    }

    const meals = [
      formatMessage({ id: 'DayCard.Breakfast' }),
      formatMessage({ id: 'DayCard.1Snack' }),
      formatMessage({ id: 'DayCard.Lunch' }),
      formatMessage({ id: 'DayCard.2Snack' }),
      formatMessage({ id: 'DayCard.Dinner' }),
    ]

    return (
      <div className={styles.productCard}>
        <h4>{moment.unix(day.timestamp).format('DD.MM.YYYY (ddd)')}</h4>
        <div className={styles.img}>
          <Tabs defaultActiveKey="1" size="small">
            {['kcal', 'prot', 'fat', 'carb'].map(macro => (
              <TabPane tab={macro} key={macro} style={{ marginLeft: '8px' }}>
                <h5>{macro}</h5>
                <table style={tableStyle}>
                  <tbody>
                    <tr>
                      <th style={sharedStyle}>{formatMessage({ id: 'DayCard.Meal' })}</th>
                      <th style={sharedStyle}>{formatMessage({ id: 'DayCard.Min' })}</th>
                      <th style={sharedStyle}>{formatMessage({ id: 'DayCard.Max' })}</th>
                    </tr>
                    {[0, 1, 2, 3, 4].map(meal => (
                      <tr key={meal}>
                        <td style={sharedStyle}>{meals[meal]}</td>
                        <td style={sharedStyle}>
                          {day.min[macro][meal] !== 10000 && day.min[macro][meal] !== 0
                            ? day.min[macro][meal]
                            : '-'}
                        </td>
                        <td style={sharedStyle}>
                          {day.max[macro][meal] !== 0 ? day.max[macro][meal] : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <br />
                <br />
                <h4>
                  {day.minDay[macro]} - {day.maxDay[macro]}
                  <br />
                  {macro === 'kcal' && <span>{formatMessage({ id: 'DayCard.(cKal)' })}</span>}
                  {macro !== 'kcal' && <span>{formatMessage({ id: 'DayCard.(g)' })}</span>}
                </h4>
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
    )
  }
}

export default DayCard
