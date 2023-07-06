/* eslint-disable no-unused-vars */
import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Statistic, Row, Col, Select, Table } from 'antd'
import { UserOutlined, RedoOutlined, UserAddOutlined, FileAddOutlined } from '@ant-design/icons'

const { Option } = Select

@injectIntl
class SalesDataByManager extends React.Component {
  state = {
    ranges: this.props.defaultRange || 'month',
  }

  handleChangeRange = async ranges => {
    this.setState({ ranges: ranges.key })
  }

  render() {
    const {
      defaultRange,
      data,
      intl: { formatMessage },
    } = this.props
    const { ranges } = this.state
    const columns = [
      {
        title: formatMessage({ id: 'SalesDataByManager.Manager' }),
        dataIndex: 'name',
        key: 'username',
        render: text => {
          return <b>{text}</b>
        },
      },
      {
        title: formatMessage({ id: 'SalesDataByManager.Trial' }),
        dataIndex: 'status',
        key: 'trial',
        render: status => {
          return <span>{status.trial}</span>
        },
      },
      {
        title: formatMessage({ id: 'SalesDataByManager.New' }),
        dataIndex: 'status',
        key: 'new',
        render: status => {
          return <span>{status.new}</span>
        },
      },
      {
        title: formatMessage({ id: 'SalesDataByManager.Prolong' }),
        dataIndex: 'status',
        key: 'prolong',
        render: status => {
          return <span>{status.prolong}</span>
        },
      },
      {
        title: formatMessage({ id: 'SalesDataByManager.Renewal' }),
        dataIndex: 'status',
        key: 'renew',
        render: status => {
          return <span>{status.renew}</span>
        },
      },
      {
        title: formatMessage({ id: 'SalesDataByManager.2Meals' }),
        dataIndex: 'mealsPerDay',
        key: '2mpd',
        render: mealsPeerDay => {
          return <span>{mealsPeerDay['2']}</span>
        },
      },
      {
        title: formatMessage({ id: 'SalesDataByManager.3Meals' }),
        dataIndex: 'mealsPerDay',
        key: '3mpd',
        render: mealsPeerDay => {
          return <span>{mealsPeerDay['3']}</span>
        },
      },
      {
        title: formatMessage({ id: 'SalesDataByManager.5Meals' }),
        dataIndex: 'mealsPerDay',
        key: '5mpd',
        render: mealsPeerDay => {
          return <span>{mealsPeerDay['5']}</span>
        },
      },
      {
        title: formatMessage({ id: 'SalesDataByManager.Total' }),
        dataIndex: 'total',
        key: 'total',
        render: tt => {
          return <span>{tt}</span>
        },
      },
      {
        title: formatMessage({ id: 'SalesDataByManager.Total%' }),
        dataIndex: 'total',
        key: 'total-pers',
        render: tt => {
          return <span>{tt ? ((tt / data[ranges].all) * 100).toFixed(1) : '0'}</span>
        },
      },
    ]
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
                <Option value="today">{formatMessage({ id: 'SalesDataByManager.Today' })}</Option>
                <Option value="week">
                  {formatMessage({ id: 'SalesDataByManager.CurrentWeek' })}
                </Option>
                <Option value="lastWeek">
                  {formatMessage({ id: 'SalesDataByManager.LastWeek' })}
                </Option>
                <Option value="month">
                  {formatMessage({ id: 'SalesDataByManager.CurrentMonth' })}
                </Option>
                <Option value="lastMonth">
                  {formatMessage({ id: 'SalesDataByManager.LastMonth' })}
                </Option>
              </Select>
            </strong>
          </div>
        </div>
        <div className="card-body">
          <Table
            tableLayout="auto"
            scroll={{ x: '100%' }}
            columns={columns}
            dataSource={data[ranges].sales}
            onChange={this.handleTableChange}
            pagination={false}
            loading={this.state.loading}
            rowKey={() => Math.random()}
          />
        </div>
      </div>
    )
  }
}

export default SalesDataByManager
