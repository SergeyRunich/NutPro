/* eslint-disable no-unused-vars */
import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Table, Divider } from 'antd'

@injectIntl
class StatsBySales extends React.Component {
  render() {
    const {
      data,
      intl: { formatMessage },
    } = this.props
    const columns = [
      {
        title: formatMessage({ id: 'StatsBySales.Manager' }),
        dataIndex: 'name',
        key: 'name',
        render: text => {
          return <b>{text}</b>
        },
      },
      {
        title: formatMessage({ id: 'StatsBySales.Trial' }),
        dataIndex: ['data', 'status', 'trial', 'days'],
        key: 'trial',
        render: text => {
          return <span>{text}</span>
        },
      },
      {
        title: formatMessage({ id: 'StatsBySales.New' }),
        dataIndex: ['data', 'status', 'new', 'days'],
        key: 'new',
        render: text => {
          return <span>{text}</span>
        },
      },
      {
        title: formatMessage({ id: 'StatsBySales.Prolong' }),
        dataIndex: ['data', 'status', 'prolong', 'days'],
        key: 'prolong',
        render: text => {
          return <span>{text}</span>
        },
      },
      {
        title: formatMessage({ id: 'StatsBySales.Renew' }),
        dataIndex: ['data', 'status', 'renew', 'days'],
        key: 'renew',
        render: text => {
          return <span>{text}</span>
        },
      },
      {
        title: formatMessage({ id: 'StatsBySales.2Meals' }),
        dataIndex: ['data', 'mealsPerDay', 'two', 'days'],
        key: 'two',
        render: text => {
          return <span>{text}</span>
        },
      },
      {
        title: formatMessage({ id: 'StatsBySales.3Meals' }),
        dataIndex: ['data', 'mealsPerDay', 'three', 'days'],
        key: 'three',
        render: text => {
          return <span>{text}</span>
        },
      },
      {
        title: formatMessage({ id: 'StatsBySales.5Meals' }),
        dataIndex: ['data', 'mealsPerDay', 'five', 'days'],
        key: 'five',
        render: text => {
          return <span>{text}</span>
        },
      },
      {
        title: formatMessage({ id: 'StatsBySales.Custom' }),
        dataIndex: ['data', 'mealsPerDay', 'custom', 'days'],
        key: 'custom',
        render: text => {
          return <span>{text}</span>
        },
      },
      {
        title: formatMessage({ id: 'StatsBySales.Total' }),
        dataIndex: ['data', 'all'],
        key: 'all',
        render: text => {
          return <span>{text}</span>
        },
      },
      {
        title: formatMessage({ id: 'StatsBySales.RenewalRate' }),
        dataIndex: ['data', 'renewalRate'],
        key: 'renewalRate',
        render: text => {
          return <span>{text}</span>
        },
      },
    ]
    return (
      <>
        <Divider>{formatMessage({ id: 'StatsBySales.StatisticsBySales' })}</Divider>
        <Table
          tableLayout="auto"
          scroll={{ x: '100%' }}
          columns={columns}
          dataSource={data}
          onChange={this.handleTableChange}
          pagination={false}
          rowKey={() => Math.random()}
        />
      </>
    )
  }
}

export default StatsBySales
