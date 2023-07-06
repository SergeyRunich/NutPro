/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Table } from 'antd'

@injectIntl
class InvoicesTable extends React.Component {
  render() {
    const {
      data,
      intl: { formatMessage },
    } = this.props
    console.log(data)
    const columns = [
      // {
      //   title: 'Record ID',
      //   dataIndex: 'id',
      //   key: 'id',
      //   render: record => {
      //     return <span>{record}</span>
      //   },
      // },
      {
        title: formatMessage({ id: 'Orders.IDinFakturoid' }),
        dataIndex: 'invoiceId',
        key: 'invoiceId',
        render: record => {
          return <span>{record}</span>
        },
      },
      {
        title: formatMessage({ id: 'Orders.URL' }),
        dataIndex: 'invoice',
        key: 'invoice',
        render: record => {
          return (
            <a href={record} rel="noopener noreferrer" target="_blank">
              Open invoice
            </a>
          )
        },
      },
      {
        title: formatMessage({ id: 'Orders.InvoiceNumber' }),
        dataIndex: 'number',
        key: 'number',
        render: record => {
          return <span>{record}</span>
        },
      },
      {
        title: formatMessage({ id: 'Orders.Correction' }),
        dataIndex: 'isCorrection',
        key: 'isCorrection',
        render: record => {
          return <span>{record ? 'Yes' : 'No'}</span>
        },
      },
      // {
      //   title: 'Refounded',
      //   dataIndex: 'isRefund',
      //   key: 'isRefund',
      //   render: record => {
      //     return <span>{record ? 'Yes' : 'No'}</span>
      //   },
      // },
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

export default InvoicesTable
