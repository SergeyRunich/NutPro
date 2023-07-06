import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Statistic, Row, Col } from 'antd'
import { UserOutlined, ExceptionOutlined, CarOutlined, GroupOutlined } from '@ant-design/icons'

@injectIntl
class StatisticCard extends React.Component {
  render() {
    const {
      title,
      type,
      generated,
      shouldBe,
      date,
      generatedSecond,
      shouldBeSecond,
      dateSecond,
      intl: { formatMessage },
    } = this.props
    return (
      <div className="card card--fullHeight">
        <div className="card-header">
          <div className="utils__title utils__title--flat">
            <strong className="text-uppercase font-size-16">{title}</strong>
          </div>
        </div>
        <div className="card-body">
          <Row gutter={16}>
            <Col span={12}>
              {type === 'production' && (
                <Statistic
                  title={moment.unix(date).format('DD.MM.YYYY')}
                  value={generated}
                  suffix={`/ ${shouldBe}`}
                  prefix={<UserOutlined />}
                />
              )}
              {type === 'error' && (
                <Statistic
                  title={moment.unix(date).format('DD.MM.YYYY')}
                  value={generated}
                  prefix={<ExceptionOutlined />}
                />
              )}
              {type === 'summary' && (
                <Statistic title="Delivery" value={generated} prefix={<CarOutlined />} />
              )}
            </Col>
            <Col span={12}>
              {type === 'production' && (
                <Statistic
                  title={moment.unix(dateSecond).format('DD.MM.YYYY')}
                  value={generatedSecond}
                  suffix={`/ ${shouldBeSecond}`}
                  prefix={<UserOutlined />}
                />
              )}
              {type === 'error' && (
                <Statistic
                  title={moment.unix(dateSecond).format('DD.MM.YYYY')}
                  value={generatedSecond}
                  prefix={<ExceptionOutlined />}
                />
              )}
              {type === 'summary' && (
                <Statistic
                  title={formatMessage({ id: 'StatisticCard.TotalSets' })}
                  value={generatedSecond}
                  suffix={`/ ${shouldBeSecond}`}
                  prefix={<GroupOutlined />}
                />
              )}
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default StatisticCard
