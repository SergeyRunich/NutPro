import React from 'react'
import { injectIntl } from 'react-intl'
import { Statistic, Row, Col, Select } from 'antd'

const { Option } = Select

@injectIntl
class SalesStatisticCardB2B extends React.Component {
  state = {
    range: this.props.defaultRange || 'today',
  }

  handleChangeRange = async range => {
    this.setState({ range: range.key })
  }

  render() {
    const {
      defaultRange,
      data,
      intl: { formatMessage },
    } = this.props
    const { range } = this.state
    return (
      <div className="card">
        <div className="card-header">
          <div className="utils__title" style={{ marginBottom: '-20px' }}>
            <strong className="text-uppercase font-size-14">
              <Select
                labelInValue
                defaultValue={{ key: defaultRange }}
                style={{ marginBottom: '15px', width: 180, marginRight: '10px' }}
                onChange={this.handleChangeRange}
              >
                <Option value="today">{formatMessage({ id: 'SalesStatsCardB2B.Today' })}</Option>
                <Option value="week">
                  {formatMessage({ id: 'SalesStatsCardB2B.CurrentWeek' })}
                </Option>
                <Option value="lastWeek">
                  {formatMessage({ id: 'SalesStatsCardB2B.LastWeek' })}
                </Option>
                <Option value="month">
                  {formatMessage({ id: 'SalesStatsCardB2B.CurrentMonth' })}
                </Option>
                <Option value="lastMonth">
                  {formatMessage({ id: 'SalesStatsCardB2B.LastMonth' })}
                </Option>
              </Select>
              {formatMessage({ id: 'SalesStatsCardB2B.B2B' })}
            </strong>
          </div>
        </div>
        <div className="card-body">
          <Row gutter={16}>
            <Col sm={8} md={4}>
              <Statistic
                title={formatMessage({ id: 'SalesStatsCardB2B.Days' })}
                value={data[range].stats.days}
              />
            </Col>
            <Col sm={8} md={4}>
              <Statistic
                title={formatMessage({ id: 'SalesStatsCardB2B.Companies' })}
                value={data[range].stats.companies}
              />
            </Col>
            <Col sm={8} md={4}>
              <Statistic
                title={formatMessage({ id: 'SalesStatsCardB2B.TotalPrice' })}
                value={data[range].stats.price.total}
              />
            </Col>

            <Col sm={8} md={4}>
              <Statistic
                title={formatMessage({ id: 'SalesStatsCardB2B.Avgpricep/d' })}
                value={data[range].stats.price.avg}
              />
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default SalesStatisticCardB2B
