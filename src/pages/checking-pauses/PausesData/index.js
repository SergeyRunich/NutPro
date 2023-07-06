import React from 'react'
import { Link } from 'react-router-dom'
import { Table, Button, Tag } from 'antd'
import moment from 'moment'

class PausesData extends React.Component {
  render() {
    const { data } = this.props
    const columns = [
      {
        title: 'Name',
        dataIndex: 'user',
        key: 'name',
        render: text => <span>{`${text.name}`}</span>,
      },
      {
        title: 'Start date',
        dataIndex: 'timestamp',
        key: 'startDate',
        render: text => <span>{moment.unix(text).format('DD.MM.YYYY')}</span>,
      },
      {
        title: 'Length',
        dataIndex: 'length',
        key: 'length',
        render: text => <span>{`${text}`}</span>,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: text => <span>{`${text}`}</span>,
      },
      {
        title: 'Number of pauses',
        dataIndex: 'numberPauses',
        key: 'numberPauses',
        render: text => {
          return <span>{text}</span>
        },
      },
      {
        title: 'Sales',
        dataIndex: 'sales',
        key: 'sales',
        render: text => <span>{`${text}`}</span>,
      },
      {
        title: 'Automatic pause',
        dataIndex: 'hasPause',
        key: 'hasPause',
        render: (text, record) => {
          if (record.verified) {
            return (
              <span>
                <Tag color="green">Verified</Tag>
              </span>
            )
          }
          return (
            <span>
              <Tag color={text ? 'red' : 'green'}>{text ? 'No' : 'Yes'}</Tag>
            </span>
          )
        },
      },
      {
        title: 'Verified',
        dataIndex: 'verified',
        key: 'verified',
        render: text => (
          <span>
            <Tag color={text ? 'green' : 'red'}>{text ? 'Verified' : 'No'}</Tag>
          </span>
        ),
      },
      {
        title: 'Action',
        dataIndex: 'id',
        key: 'action',
        render: id => (
          <span>
            <span>
              <Button>
                <Link target="_blank" to={`/orders/${id}`}>
                  View Order
                </Link>
              </Button>
            </span>
          </span>
        ),
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
          total: data && data.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '200'],
          hideOnSinglePage: data && data.length < 10,
        }}
        rowKey={() => Math.random()}
      />
    )
  }
}

export default PausesData
