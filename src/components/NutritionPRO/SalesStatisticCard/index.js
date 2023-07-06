import React from 'react'
import { injectIntl } from 'react-intl'
import { Statistic, Row, Col, Divider, DatePicker, Skeleton } from 'antd'
import moment from 'moment'
import Authorize from 'components/LayoutComponents/Authorize'
import { RedoOutlined, UserAddOutlined, FileAddOutlined, UserOutlined } from '@ant-design/icons'
import StatsBySales from './StatsBySales'

const { RangePicker } = DatePicker

@injectIntl
class SalesStatisticCard extends React.Component {
  state = {
    start: moment()
      .startOf('month')
      .unix(),
    end: moment()
      .endOf('month')
      .unix(),
  }

  componentWillMount() {
    const { start, end } = this.state
    this.props.getSalesMainData(start, end)
    this.props.getSalesActiveOrders(start, end)
  }

  handleChangePeriod = period => {
    this.setState({ start: period[0].unix(), end: period[1].unix() })

    this.props.getSalesMainData(
      moment(period[0].unix() * 1000).format('DD-MM-YYYY'),
      moment(period[1].unix() * 1000).format('DD-MM-YYYY'),
    )
    this.props.getSalesActiveOrders(
      moment(period[0].unix() * 1000).format('DD-MM-YYYY'),
      moment(period[1].unix() * 1000).format('DD-MM-YYYY'),
    )
  }

  render() {
    const {
      data,
      activeOrders,
      intl: { formatMessage },
    } = this.props
    const { start, end } = this.state

    return (
      <div className="card">
        <div className="card-header">
          <div className="utils__title" style={{ marginBottom: '-20px' }}>
            <strong className="text-uppercase font-size-14">
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
                defaultValue={[moment(start * 1000), moment(end * 1000)]}
                format="DD.MM.YYYY"
                onChange={this.handleChangePeriod}
                style={{ marginRight: '10px', width: '75%' }}
              />
            </strong>
          </div>
        </div>
        {data && (
          <div className="card-body">
            <Authorize roles={['root', 'admin', 'sales', 'salesDirector', 'finance']}>
              <Row gutter={16} style={{ fontSize: '32px', marginBottom: '10px' }}>
                <Col span={24}>
                  <span>
                    {data?.result?.all} {formatMessage({ id: 'SalesStatCard.orders' })}
                  </span>
                </Col>
              </Row>
              <Divider>{formatMessage({ id: 'SalesStatCard.Orders' })}</Divider>
              <Row gutter={16}>
                <Col sm={12} md={5}>
                  <Statistic
                    title={formatMessage({ id: 'SalesStatCard.Trial' })}
                    value={data?.result?.status.trial.total}
                    prefix={<UserAddOutlined />}
                  />

                  <span style={{ fontSize: '18px' }}>
                    {data?.result?.all !== 0
                      ? `${((data?.result?.status.trial.total / data?.result?.all) * 100).toFixed(
                          0,
                        )}%`
                      : ''}
                  </span>
                </Col>
                <Col sm={12} md={5}>
                  <Statistic
                    title={formatMessage({ id: 'SalesStatCard.New' })}
                    value={data?.result?.status.new.total}
                    prefix={<UserAddOutlined />}
                  />

                  <span style={{ fontSize: '18px' }}>
                    {data?.result?.all !== 0
                      ? `${((data?.result?.status.new.total / data?.result?.all) * 100).toFixed(
                          0,
                        )}%`
                      : ''}
                  </span>
                </Col>
                <Col sm={12} md={5}>
                  <Statistic
                    title={formatMessage({ id: 'SalesStatCard.Prolong' })}
                    value={data?.result?.status.prolong.total}
                    prefix={<FileAddOutlined />}
                  />
                  <span style={{ fontSize: '18px' }}>
                    {data?.result?.all !== 0
                      ? `${((data?.result?.status.prolong.total / data?.result?.all) * 100).toFixed(
                          0,
                        )}%`
                      : ''}
                  </span>
                </Col>
                <Col sm={12} md={4}>
                  <Statistic
                    title={formatMessage({ id: 'SalesStatCard.Renewal' })}
                    value={data?.result?.status.renew.total}
                    prefix={<RedoOutlined />}
                  />
                  <span style={{ fontSize: '18px' }}>
                    {data?.result?.all !== 0
                      ? `${((data?.result?.status.renew.total / data?.result?.all) * 100).toFixed(
                          0,
                        )}%`
                      : ''}
                  </span>
                </Col>
                <Col sm={12} md={5}>
                  <Statistic
                    title={formatMessage({ id: 'SalesStatCard.RenewalRate' })}
                    value={data?.result?.renewalRate}
                    suffix="%"
                  />
                </Col>
              </Row>
              <Divider>{formatMessage({ id: 'SalesStatCard.Days' })}</Divider>
              <Row gutter={16}>
                <Col sm={8} md={6}>
                  <Statistic
                    title={formatMessage({ id: 'SalesStatCard.Trial(days)' })}
                    value={data?.result?.status.trial.days}
                    prefix={<UserOutlined />}
                  />
                </Col>
                <Col sm={8} md={6}>
                  <Statistic
                    title={formatMessage({ id: 'SalesStatCard.New(days)' })}
                    value={data?.result?.status.new.days}
                    prefix={<UserAddOutlined />}
                  />
                </Col>
                <Col sm={8} md={6}>
                  <Statistic
                    title={formatMessage({ id: 'SalesStatCard.Prolong(days)' })}
                    value={data?.result?.status.prolong.days}
                    prefix={<FileAddOutlined />}
                  />
                </Col>
                <Col sm={8} md={6}>
                  <Statistic
                    title={formatMessage({ id: 'SalesStatCard.Renewal(days)' })}
                    value={data?.result?.status.renew.days}
                    prefix={<RedoOutlined />}
                  />
                </Col>
              </Row>
              <Divider>{formatMessage({ id: 'SalesStatCard.Meals' })}</Divider>
              <Row gutter={16}>
                <Col sm={8} md={4}>
                  <Statistic
                    title={formatMessage({ id: 'SalesStatCard.2PerDay' })}
                    value={data?.result?.mealsPerDay.two.total}
                  />
                  <span style={{ fontSize: '18px' }}>
                    {data?.result?.all !== 0
                      ? `${(
                          (data?.result?.mealsPerDay.two.total / data?.result?.all) *
                          100
                        ).toFixed(0)}%`
                      : ''}
                  </span>
                </Col>
                <Col sm={8} md={4}>
                  <Statistic
                    title={formatMessage({ id: 'SalesStatCard.3PerDay' })}
                    value={data?.result?.mealsPerDay.three.total}
                  />
                  <span style={{ fontSize: '18px' }}>
                    {data?.result?.all !== 0
                      ? `${(
                          (data?.result?.mealsPerDay.three.total / data?.result?.all) *
                          100
                        ).toFixed(0)}%`
                      : ''}
                  </span>
                </Col>
                <Col sm={8} md={4}>
                  <Statistic
                    title={formatMessage({ id: 'SalesStatCard.5PerDay' })}
                    value={data?.result?.mealsPerDay.five.total}
                  />
                  <span style={{ fontSize: '18px' }}>
                    {data?.result?.all !== 0
                      ? `${(
                          (data?.result?.mealsPerDay.five.total / data?.result?.all) *
                          100
                        ).toFixed(0)}%`
                      : ''}
                  </span>
                </Col>
                <Col sm={8} md={4}>
                  <Statistic
                    title={formatMessage({ id: 'SalesStatCard.Other' })}
                    value={data?.result?.mealsPerDay.custom.total}
                  />
                  <span style={{ fontSize: '18px' }}>
                    {data?.result?.all !== 0
                      ? `${(
                          (data?.result?.mealsPerDay.custom.total / data?.result?.all) *
                          100
                        ).toFixed(0)}%`
                      : ''}
                  </span>
                </Col>
              </Row>
              <Authorize roles={['root', 'admin', 'salesDirector', 'finance']}>
                <StatsBySales data={data?.sales} />
              </Authorize>
            </Authorize>

            <Authorize roles={['root', 'admin', 'salesDirector', 'finance']}>
              <>
                <Divider>
                  <h3>{formatMessage({ id: 'SalesStatCard.ActiveCustumerBySales' })}</h3>
                </Divider>
                <Row gutter={16}>
                  {activeOrders?.result?.globalOrders.total &&
                    activeOrders?.result?.globalOrders.sales.map(s => (
                      <Col key={s.name} sm={12} md={6}>
                        <Statistic title={s.name} value={s.users} />
                      </Col>
                    ))}
                </Row>
                <Divider>
                  <h3>{formatMessage({ id: 'SalesStatCard.ActiveOrdersBySales' })}</h3>
                </Divider>
                <Row gutter={16}>
                  {activeOrders?.result?.globalOrders.total &&
                    activeOrders?.result?.globalOrders.sales.map(s => (
                      <Col key={s.name} sm={12} md={6}>
                        <Statistic title={s.name} value={s.orders} />
                      </Col>
                    ))}
                </Row>
              </>
            </Authorize>
          </div>
        )}
        {!data && (
          <div className="card-body">
            <Skeleton />
          </div>
        )}
      </div>
    )
  }
}

export default SalesStatisticCard
