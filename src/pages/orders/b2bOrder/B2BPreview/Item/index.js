import React from 'react'
import { injectIntl } from 'react-intl'
import { Table } from 'antd'

@injectIntl
class MenuItem extends React.Component {
  render() {
    const {
      order,
      intl: { formatMessage },
    } = this.props
    const columns = [
      {
        title: formatMessage({ id: 'Orders.Dish' }),
        dataIndex: 'title',
        key: 'title',
        render: text => <span>{`${text}`}</span>,
      },
      {
        title: formatMessage({ id: 'Orders.Weight' }),
        dataIndex: 'weight',
        key: 'weight',
        render: text => <span>{`${text}`}</span>,
      },
      {
        title: formatMessage({ id: 'Orders.Count' }),
        dataIndex: 'count',
        key: 'count',
        render: text => <span>{`${text}`}</span>,
      },
    ]
    return (
      <div>
        <h3>{order.date}</h3>
        <Table
          className="utils__scrollTable"
          tableLayout="auto"
          scroll={{ x: '100%' }}
          columns={columns}
          dataSource={order.dishes}
          pagination={{
            position: 'bottom',
            total: order.dishes.length,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100', '200'],
            hideOnSinglePage: order.dishes.length < 10,
          }}
          rowKey={() => Math.random()}
        />
      </div>
    )
  }
}

export default MenuItem
