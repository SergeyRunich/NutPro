import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Table } from 'antd'

@injectIntl
class ProductionBufferHistory extends React.Component {
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
        render: date => {
          return moment(date).format('DD.MM.YYYY')
        },
      },
      {
        title: formatMessage({ id: 'ProdBufferHistory.Action' }),
        dataIndex: 'action',
        key: 'action',
        render: action => {
          return action
        },
      },
      {
        title: formatMessage({ id: 'ProdBufferHistory.User' }),
        dataIndex: 'user',
        key: 'user',
        render: user => {
          return user
        },
      },
      {
        title: formatMessage({ id: 'ProdBufferHistory.MaxValue' }),
        dataIndex: 'maxValue',
        key: 'maxValue',
        render: maxValue => {
          return `Before: ${maxValue.before === -1 ? '-' : maxValue.before} | After: ${
            maxValue.after
          }`
        },
      },
    ]
    return (
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
    )
  }
}

export default ProductionBufferHistory
