import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import Authorize from 'components/LayoutComponents/Authorize'
import { Tabs, DatePicker, Select } from 'antd'
import { Helmet } from 'react-helmet'

import KpiMetricTable from './KpiMetricTable'
import KpiPlanTable from './KpiPlanTable'
import Customers from './Customers'

const { TabPane } = Tabs
const { Option } = Select
const { MonthPicker, RangePicker } = DatePicker

@injectIntl
class KpiDashboard extends React.Component {
  state = {
    tab: 1,
    dateSelector: 'Month',
    dateSelectorVariants: ['Month', 'Range', 'Day'],
    range: [
      moment()
        .utc()
        .startOf('month')
        .toISOString(),
      moment()
        .utc()
        .endOf('month')
        .toISOString(),
    ],
  }

  onChangeField(e, field) {
    if (e !== null && e.target) {
      if (e.target.type === 'checkbox') {
        this.setState({
          [field]: e.target.checked,
        })
      } else {
        this.setState({
          [field]: e.target.value,
        })
      }
    } else {
      this.setState({
        [field]: e,
      })
    }
  }

  onChangeDate(date, type) {
    if (type === 'Month') {
      this.setState({
        range: [
          date
            .utc()
            .startOf('month')
            .toISOString(),
          date
            .utc()
            .endOf('month')
            .toISOString(),
        ],
      })
    } else if (type === 'Range') {
      this.setState({
        range: [
          date[0]
            .utc()
            .startOf('month')
            .toISOString(),
          date[1]
            .utc()
            .endOf('month')
            .toISOString(),
        ],
      })
    } else {
      this.setState({
        range: [date.utc().toISOString(), date.utc().toISOString()],
      })
    }
  }

  changeTab = async tab => {
    this.setState({
      tab,
    })
  }

  render() {
    const { tab, dateSelector, dateSelectorVariants, range } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    return (
      <Authorize roles={['root', 'finance']} denied={['Yana', 'Ksenia']} redirect to="/main">
        <Helmet title={formatMessage({ id: 'KPIDashboard.KPIDashboard' })} />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>{formatMessage({ id: 'KPIDashboard.KPIDashboard' })}</strong>
            </div>
          </div>
          <div className="card-body">
            <div>
              <Select
                placeholder="Point"
                value={dateSelector}
                onChange={e => this.onChangeField(e, 'dateSelector')}
                style={{ width: '100px', marginRight: '15px' }}
              >
                {dateSelectorVariants.map(item => (
                  <Option key={Math.random()} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>

              {dateSelector === 'Month' && (
                <MonthPicker
                  onChange={e => this.onChangeDate(e, 'Month')}
                  placeholder="Select month"
                  value={moment.utc(range[0])}
                  format="MMMM YYYY"
                />
              )}
              {dateSelector === 'Range' && (
                <RangePicker
                  ranges={{
                    'Previous Month': [
                      moment()
                        .subtract(1, 'month')
                        .startOf('month'),
                      moment()
                        .subtract(1, 'month')
                        .endOf('month'),
                    ],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                  }}
                  onChange={e => this.onChangeDate(e, 'Range')}
                  placeholder="Select range"
                  value={[moment.utc(range[0]), moment.utc(range[1])]}
                  format="DD.MM.YYYY"
                />
              )}
              {dateSelector === 'Day' && (
                <DatePicker
                  onChange={e => this.onChangeDate(e, 'Day')}
                  placeholder="Select day"
                  value={moment.utc(range[0])}
                  format="DD.MM.YYYY"
                />
              )}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <Tabs onChange={this.changeTab} type="card">
              <TabPane tab={formatMessage({ id: 'KPIDashboard.KPISelectedDates' })} key={1}>
                {Number(tab) === 1 && (
                  <KpiPlanTable isAction={false} start={range[0]} end={range[1]} />
                )}
              </TabPane>
              <TabPane tab={formatMessage({ id: 'KPIDashboard.Customers' })} key={2}>
                <Customers start={moment(range[0])} end={moment(range[1])} />
              </TabPane>
              <TabPane tab={formatMessage({ id: 'KPIDashboard.Plans' })} key={3}>
                {Number(tab) === 3 && <KpiPlanTable isAction />}
              </TabPane>
              <TabPane tab={formatMessage({ id: 'KPIDashboard.Metrics' })} key={4}>
                {Number(tab) === 4 && <KpiMetricTable />}
              </TabPane>
            </Tabs>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default KpiDashboard
