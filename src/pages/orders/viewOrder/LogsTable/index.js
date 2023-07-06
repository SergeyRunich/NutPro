/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Table } from 'antd'
import moment from 'moment'

@injectIntl
class LogsTable extends React.Component {
  render() {
    const {
      data,
      intl: { formatMessage },
    } = this.props
    const columns = [
      {
        title: formatMessage({ id: 'global.date' }),
        dataIndex: 'date',
        key: 'date',
        render: record => {
          return <span>{moment(record).format('DD-MM-YYYY')}</span>
        },
      },
      {
        title: formatMessage({ id: 'Orders.Employee' }),
        dataIndex: 'systemUser',
        key: 'systemUser',
        render: record => {
          return <span>{record}</span>
        },
      },
      {
        title: formatMessage({ id: 'Orders.Action' }),
        dataIndex: 'action',
        key: 'action',
        render: record => {
          return <span style={{ color: 'rgb(8, 135, 201)' }}>{record}</span>
        },
      },
      {
        title: formatMessage({ id: 'Orders.Changes' }),
        dataIndex: 'changes',
        key: 'changes',
        render: record => {
          return <span>{record.length}</span>
        },
      },
    ]
    return (
      <div>
        <Table
          className="utils__scrollTable"
          tableLayout="auto"
          scroll={{ x: '100%' }}
          columns={columns}
          dataSource={data}
          pagination={{
            position: 'bottom',
            total: data.length,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100', '200'],
            hideOnSinglePage: data.length < 10,
          }}
          rowKey={() => Math.random()}
        />
      </div>
    )
  }
}

export default LogsTable
