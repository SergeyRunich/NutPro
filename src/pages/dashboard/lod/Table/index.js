import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Table, Button, Tooltip } from 'antd'

function TableOfOrders(props) {
  const columns = [
    {
      title: <FormattedMessage id="TableOfOrders.DateAccepted" />,
      dataIndex: 'date',
      key: 'accept_date',
      render: (_, record) => {
        return moment(record.accept_date).format('DD.MM.YYYY')
      },
    },

    {
      title: <FormattedMessage id="TableOfOrders.DueDate" />,
      dataIndex: 'date',
      key: 'due_date',
      render: (_, record) => {
        return moment(record.due_date).format('DD.MM.YYYY')
      },
    },

    {
      title: <FormattedMessage id="TableOfOrders.Invoice" />,
      dataIndex: 'invoice',
      key: 'invoice',
      render: invoice => {
        if (invoice.number) {
          return (
            <a href={invoice.public_url} target="blank">
              {invoice.number}
            </a>
          )
        }
        return 'none'
      },
    },
    {
      title: <FormattedMessage id="global.name" />,
      dataIndex: 'name',
      key: 'name',
      render: text => <span>{`${text}`}</span>,
    },
    {
      title: <FormattedMessage id="TableOfOrders.Amount" />,
      dataIndex: 'amount',
      key: 'amount',
      render: text => (
        <center>
          <span>{`${text}`}Kč</span>
        </center>
      ),
    },
    {
      title: <FormattedMessage id="TableOfOrders.N1" />,
      dataIndex: 'notifications',
      key: 'notification1',
      render: (text, record) => {
        return (
          <center>
            {record.notifications[0] !== null ? (
              <Tooltip title={moment(record.notifications[0]).format('DD.MM.YYYY')}>
                <center>
                  <FormattedMessage id="TableOfOrders.Sent" />
                </center>
              </Tooltip>
            ) : (
              <FormattedMessage id="TableOfOrders.NotSent" />
            )}
          </center>
        )
      },
    },
    {
      title: <FormattedMessage id="TableOfOrders.N2" />,
      dataIndex: 'notifications',
      key: 'notification2',
      render: (text, record) => {
        return (
          <center>
            {record.notifications[1] !== null ? (
              <Tooltip title={moment(record.notifications[1]).format('DD.MM.YYYY')}>
                <center>
                  <FormattedMessage id="TableOfOrders.Sent" />
                </center>
              </Tooltip>
            ) : (
              <FormattedMessage id="TableOfOrders.NotSent" />
            )}
          </center>
        )
      },
    },
    {
      title: <FormattedMessage id="TableOfOrders.N3" />,
      dataIndex: 'notifications',
      key: 'notification3',
      render: (text, record) => {
        return (
          <center>
            {record.notifications[2] !== null ? (
              <Tooltip title={moment(record.notifications[2]).format('DD.MM.YYYY')}>
                <center>
                  <FormattedMessage id="TableOfOrders.Sent" />
                </center>
              </Tooltip>
            ) : (
              <FormattedMessage id="TableOfOrders.NotSent" />
            )}
          </center>
        )
      },
    },
    {
      title: <FormattedMessage id="TableOfOrders.N4" />,
      dataIndex: 'notifications',
      key: 'notification4',
      render: (text, record) => {
        return (
          <center>
            {record.notifications[3] !== null ? (
              <Tooltip title={moment(record.notifications[3]).format('DD.MM.YYYY')}>
                <center>
                  <FormattedMessage id="TableOfOrders.Sent" />
                </center>
              </Tooltip>
            ) : (
              <FormattedMessage id="TableOfOrders.NotSent" />
            )}
          </center>
        )
      },
    },
    {
      title: <FormattedMessage id="TableOfOrders.SendToDebtCollector" />,
      dataIndex: 'send_to_collector',
      key: 'send_to_collector',
      render: (text, record) => {
        return (
          <center>
            {record.send_to_collector ? (
              <FormattedMessage id="TableOfOrders.Send" />
            ) : (
              <FormattedMessage id="TableOfOrders.DontSend" />
            )}
          </center>
        )
      },
    },
    {
      title: <FormattedMessage id="TableOfOrders.OrderStatus" />,
      dataIndex: 'order_status',
      key: 'order_status',
      render: text => (
        <center>
          <span>{`${text}`}</span>
        </center>
      ),
    },
    {
      title: <FormattedMessage id="TableOfOrders.NotificationStatus" />,
      dataIndex: 'notification_status',
      key: 'notification_status',
      render: text => (
        <center>
          <span>{`${text}`}</span>
        </center>
      ),
    },
    {
      title: <FormattedMessage id="TableOfOrders.AllowNotifications" />,
      dataIndex: 'id',
      key: 'actionAllowNotification',
      render: (text, record) => (
        <center>
          <Button type="primary" onClick={() => props.onSendLodNotification(record.id)}>
            {record.notification_status !== ('In progress' || 'All send') ? (
              <FormattedMessage id="TableOfOrders.Send" />
            ) : (
              <FormattedMessage id="TableOfOrders.DontSend" />
            )}
          </Button>
        </center>
      ),
    },
    {
      title: <FormattedMessage id="TableOfOrders.AllowSendToCollector" />,
      dataIndex: 'id',
      key: 'actionAllowSend',
      render: (text, record) => (
        <center>
          <Button type="primary" onClick={() => props.onSendLodCollector(record.id)}>
            {!record.send_to_collector ? `Send` : `Don't send`}
          </Button>
        </center>
      ),
    },
  ]

  return (
    <div>
      <Table
        className="utils__scrollTable"
        tableLayout="auto"
        scroll={{ x: '100%' }}
        columns={columns}
        dataSource={props.data}
        size="small"
        rowKey={() => Math.random()}
        pagination={{
          position: 'bottom',
          total: props.data.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '200'],
          hideOnSinglePage: props.data.length < 10,
        }}
        loading={props.loading}
      />
    </div>
  )
}

export default withRouter(injectIntl(TableOfOrders))
