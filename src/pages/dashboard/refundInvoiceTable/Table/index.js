import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import { Table, notification, Tag, Dropdown, Menu } from 'antd'

import { changeRefundStatus } from '../../../../api/dashboard'

@injectIntl
@withRouter
class TableOfInvoices extends React.Component {
  constructor(props) {
    super(props)
    this.change = this.change.bind(this)
  }

  async change(bodys) {
    const {
      intl: { formatMessage },
    } = this.props
    const req = await changeRefundStatus(bodys)
    if (req.ok) {
      notification.success({
        message: formatMessage({ id: 'global.success' }),
      })
      await this.props.show()
    } else {
      notification.error({
        placement: 'topLeft',
        message: formatMessage({ id: 'global.error' }),
        description: req.statusText,
      })
    }
  }

  render() {
    const {
      data,
      loading,
      intl: { formatMessage },
    } = this.props

    const actionMenu = (id, status, newStatus, publicUrl) => (
      <Menu style={{ padding: '0px' }}>
        {status !== 'closed' && (
          <Menu.Item key="cdfd" onClick={() => this.change({ id, status: newStatus })}>
            {formatMessage({ id: 'TableOfInvoices.MarkAsSPACE' })} {newStatus}
          </Menu.Item>
        )}
        <Menu.Item key={Math.random()}>
          <a href={publicUrl} rel="noopener noreferrer" target="_blank">
            {formatMessage({ id: 'TableOfInvoices.OpenInvoice' })}
          </a>
        </Menu.Item>
      </Menu>
    )

    const columns = [
      {
        title: formatMessage({ id: 'global.date' }),
        dataIndex: 'date',
        key: 'date',
        render: text => <span>{`${moment(text).format('DD.MM.YYYY HH:mm')}`}</span>,
      },
      {
        title: formatMessage({ id: 'TableOfInvoices.Number' }),
        dataIndex: 'number',
        key: 'number',
        render: number => number,
      },
      {
        title: formatMessage({ id: 'global.name' }),
        dataIndex: 'order',
        key: 'order',
        render: order => {
          return (
            <a href={`/admin/#/orders/${order.id}`} rel="noopener noreferrer" target="_blank">
              {order.name}
            </a>
          )
        },
      },
      {
        title: formatMessage({ id: 'TableOfInvoices.RefundAmount' }),
        dataIndex: 'refund_amount',
        key: 'refund_amount',
        render: refundAmount => <span>{`${refundAmount} Kč`}</span>,
        sorter: (a, b) => a.refund_amount - b.refund_amount,
      },
      {
        title: formatMessage({ id: 'TableOfInvoices.Status' }),
        dataIndex: 'status',
        key: 'status',
        filters: [
          {
            text: formatMessage({ id: 'TableOfInvoices.Waiting' }),
            value: 'waiting',
          },
          {
            text: formatMessage({ id: 'TableOfInvoices.Refunded' }),
            value: 'refunded',
          },
          {
            text: formatMessage({ id: 'TableOfInvoices.Closed' }),
            value: 'closed',
          },
        ],
        onFilter: (value, record) => record.status.indexOf(value) === 0,
        render: status => {
          const colors = {
            waiting: 'blue',
            refunded: 'orange',
            closed: 'green',
          }
          return <Tag color={colors[status]}>{status}</Tag>
        },
      },
      {
        title: '',
        dataIndex: 'url',
        key: 'url',
        render: (url, record) => {
          const newStatus = record.status === 'waiting' ? 'refunded' : 'closed'
          return (
            <Dropdown.Button
              overlay={actionMenu(record.id, record.status, newStatus, record.pdf)}
              style={{ float: 'right' }}
              type="primary"
            >
              <a href={url} rel="noopener noreferrer" target="_blank">
                {formatMessage({ id: 'TableOfInvoices.OpenInFakturoid' })}
              </a>
            </Dropdown.Button>
          )
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
          rowKey={() => Math.random()}
          // size="small"
          pagination={{
            position: 'bottom',
            total: data.length,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100', '200'],
            hideOnSinglePage: data.length < 10,
          }}
          loading={loading}
        />
      </div>
    )
  }
}

export default TableOfInvoices
