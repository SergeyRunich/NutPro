import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Table, Button } from 'antd'

@injectIntl
class ProductionBufferList extends React.Component {
  render() {
    const {
      loading,
      data,
      loadHistory,
      intl: { formatMessage },
    } = this.props
    const columns = [
      {
        title: formatMessage({ id: 'global.date' }),
        dataIndex: 'timestamp',
        key: 'code',
        render: timestamp => {
          return moment.unix(timestamp).format('DD.MM.YYYY')
        },
      },
      {
        title: formatMessage({ id: 'ProductBufferList.Kitchen' }),
        dataIndex: 'kitchen',
        key: 'kitchen',
        render: kitchen => {
          return kitchen.name
        },
      },
      {
        title: formatMessage({ id: 'ProductBufferList.Initial' }),
        dataIndex: 'initialValue',
        key: 'initialValue',
        render: initialValue => {
          return initialValue
        },
      },
      {
        title: formatMessage({ id: 'ProductBufferList.Buffer' }),
        dataIndex: 'buffer',
        key: 'buffer',
        render: buffer => {
          return buffer
        },
      },
      {
        title: formatMessage({ id: 'ProductBufferList.Goal' }),
        dataIndex: 'maxValue',
        key: 'maxValue',
        render: maxValue => {
          return maxValue
        },
      },
      {
        title: '---',
        dataIndex: 'id',
        key: 'id',
        render: (id, record, i) => {
          return (
            <Button onClick={() => loadHistory(i)}>
              {formatMessage({ id: 'ProductBufferList.History' })}
            </Button>
          )
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
        loading={loading}
        rowKey={() => Math.random()}
      />
    )
  }
}

export default ProductionBufferList
