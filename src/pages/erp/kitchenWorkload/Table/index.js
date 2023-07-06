/* eslint-disable no-undef */
import React from 'react'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Table, Button } from 'antd'

@injectIntl
@withRouter
class WorkLoadTable extends React.Component {
  render() {
    const {
      data,
      loading,
      deleteWorkloadEntry,
      editEntry,
      intl: { formatMessage },
    } = this.props

    const columns = [
      {
        title: formatMessage({ id: 'KitchenWorkload.Cooking date' }),
        align: 'center',
        dataIndex: 'cookingDate',
        key: 'cookingDate',
        render: record => {
          return <span>{moment(record).format('DD.MM.YYYY')}</span>
        },
      },
      {
        title: formatMessage({ id: 'KitchenWorkload.Kitchen' }),
        align: 'center',
        dataIndex: 'kitchen',
        key: 'kitchen',
        render: record => {
          return <span>{record.kitchen}</span>
        },
      },
      {
        title: formatMessage({ id: 'KitchenWorkload.Minimum' }),
        align: 'center',
        dataIndex: 'minimum',
        key: 'minimum',
        render: text => <span>{text}</span>,
      },
      {
        title: formatMessage({ id: 'KitchenWorkload.Maximum' }),
        align: 'center',
        dataIndex: 'maximum',
        key: 'maximum',
        render: text => <span>{text}</span>,
      },
      {
        title: formatMessage({ id: 'KitchenWorkload.Salad' }),
        align: 'center',
        dataIndex: 'salad',
        key: 'salad',
        render: text => <span>{text ? 'yes' : 'No'}</span>,
      },
      {
        title: formatMessage({ id: 'KitchenWorkload.Created date' }),
        align: 'center',
        dataIndex: 'created',
        key: 'created',
        render: record => {
          return <span>{moment(record).format('DD.MM.YYYY')}</span>
        },
      },
      {
        title: formatMessage({ id: 'global.edit' }),
        align: 'center',
        dataIndex: 'id',
        key: 'actionEdit',
        render: (text, record) => (
          <span>
            <Button
              disabled={moment(record.cookingDate).isBefore(record.created)}
              type="primary"
              onClick={() => editEntry(record)}
            >
              {formatMessage({ id: 'global.edit' })}
            </Button>
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'KitchenWorkload.Delete' }),
        align: 'center',
        dataIndex: 'id',
        key: 'actionDelete',
        render: (text, record) => (
          <span>
            <Button
              disabled={moment(record.cookingDate).isBefore(record.created)}
              type="primary"
              onClick={() => deleteWorkloadEntry(record.id)}
            >
              {formatMessage({ id: 'KitchenWorkload.Delete' })}
            </Button>
          </span>
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
          dataSource={data}
          size="small"
          rowKey={() => Math.random()}
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

export default WorkLoadTable
