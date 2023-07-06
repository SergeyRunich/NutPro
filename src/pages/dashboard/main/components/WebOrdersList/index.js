import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Link, withRouter } from 'react-router-dom'
import { Modal, Table } from 'antd'

@injectIntl
@withRouter
class WebOrdersList extends React.Component {
  render() {
    const {
      visible,
      onCancel,
      list,
      type,
      intl: { formatMessage },
    } = this.props

    const columns = [
      {
        title: formatMessage({ id: 'global.name' }),
        dataIndex: 'user',
        key: 'name',
        render: (_, record) => {
          return (
            <Link to={`/orders/${record.id}`}>
              <span className="mr-1">{record.user.name}</span>
            </Link>
          )
        },
      },
      {
        title: formatMessage({ id: 'WebOrdersList.Created' }),
        dataIndex: 'id',
        key: 'createdDate',
        render: text => (
          <span>
            {`${moment.unix(parseInt(text.substring(0, 8), 16)).format('DD.MM.YYYY HH:mm')}`}
          </span>
        ),
        // sorter: (a, b) => a.id - b.id,
      },
      {
        title: formatMessage({ id: 'global.email' }),
        dataIndex: 'email',
        key: 'email',
        render: text => <span>{`${text || '-'}`}</span>,
        // sorter: (a, b) => a.email - b.email,
      },
    ]

    return (
      <Modal
        visible={visible}
        title={
          type
            ? formatMessage({ id: 'WebOrdersList.UnpaidOrders' })
            : formatMessage({ id: 'WebOrdersList.WebOrders' })
        }
        okText="OK"
        cancelText="Close"
        onCancel={onCancel}
        onOk={onCancel}
      >
        <Table
          className="utils__scrollTable"
          tableLayout="auto"
          scroll={{ x: '100%' }}
          columns={columns}
          dataSource={list}
          pagination={{
            position: 'bottom',
            total: list.length,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100', '200'],
            hideOnSinglePage: list.length < 10,
          }}
          rowKey={() => Math.random()}
        />
      </Modal>
    )
  }
}

export default WebOrdersList
