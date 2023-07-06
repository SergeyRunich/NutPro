import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Table, Tag, Result, Button, Popconfirm, notification, Divider } from 'antd'
import { removeRegeneratedDay } from '../../../../../api/dashboard'
import { removeAllOrders } from '../../../../../api/order'

const GeneratedOrderList = ({ title, data }) => {
  const [removed, setRemoved] = useState([])
  const [isRemoveAllLoading, setIsRemoveAllLoading] = useState(false)
  const [isRemovedAll, setIsRemovedAll] = useState(false)

  const intl = useIntl()
  const { formatMessage } = intl

  const remove = async (id, i) => {
    try {
      const res = await removeRegeneratedDay(id)
      if (res.status === 200) {
        setRemoved([...removed, i])
      } else {
        notification.error({
          message: `Error code: ${res.status}`,
        })
      }
    } catch (e) {
      notification.error({
        message: formatMessage({ id: 'global.error' }),
        description: 'Failed to remove order',
      })
    }
  }

  const removeAll = async ids => {
    try {
      setIsRemoveAllLoading(true)
      const res = await removeAllOrders(ids)
      if (res.status === 200) {
        setIsRemovedAll(true)
        setIsRemoveAllLoading(false)
        setRemoved([])
      } else {
        notification.error({
          message: `Error code: ${res.status}`,
        })
      }
    } catch (e) {
      notification.error({
        message: formatMessage({ id: 'global.error' }),
        description: 'Failed to remove all orders',
      })
    } finally {
      setIsRemoveAllLoading(false)
    }
  }

  const removeArray = { dayId: data.map(o => o.id) }

  const columns = [
    {
      title: formatMessage({ id: 'global.name' }),
      dataIndex: 'user',
      key: 'name',
      render: (user, record) => <Link to={`/orders/${record.order.id}`}>{` ${user.name}`}</Link>,
    },
    {
      title: formatMessage({ id: 'KitchenGeneratedOrderList.Kitchen' }),
      dataIndex: 'kitchen',
      key: 'kitchen',
      render: kitchen => <span>{`${kitchen}`}</span>,
    },
    {
      title: formatMessage({ id: 'global.date' }),
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: timestamp => <span>{moment.unix(timestamp).format('DD.MM (ddd)')}</span>,
    },
    {
      title: formatMessage({ id: 'KitchenGeneratedOrderList.Meals' }),
      dataIndex: 'order',
      key: 'meals',
      render: order => <span>{`${order.mealsPerDay}`}</span>,
      sorter: (a, b) => a.mealsPerDay - b.mealsPerDay,
    },
    {
      title: formatMessage({ id: 'KitchenGeneratedOrderList.Week' }),
      dataIndex: 'order',
      key: 'size',
      render: order => <span>{`${order.size}`}</span>,
    },
    {
      title: formatMessage({ id: 'KitchenGeneratedOrderList.Skip#' }),
      dataIndex: 'order',
      key: 'ignoredMealTypes',
      render: order => <span>{`${order.ignoredMealTypes.length || '-'}`}</span>,
    },
    {
      title: formatMessage({ id: 'KitchenGeneratedOrderList.Tags' }),
      dataIndex: 'tags',
      key: 'tags',
      render: tags => {
        return tags.map(tag => (
          <Tag color="cyan" key={Math.random()}>
            {tag}
          </Tag>
        ))
      },
    },
    {
      title: '---',
      dataIndex: 'id',
      key: 'remove',
      render: (id, _, i) => (
        <>
          {removed.indexOf(i) === -1 && (
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => remove(id, i)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger">{formatMessage({ id: 'global.remove' })}</Button>
            </Popconfirm>
          )}
          {removed.indexOf(i) !== -1 && (
            <Tag color="green">{formatMessage({ id: 'KitchenGeneratedOrderList.Removed' })}</Tag>
          )}
        </>
      ),
    },
  ]
  return (
    <div className="card card--fullHeight">
      <div className="card-header">
        <div className="utils__title utils__title--flat">
          <strong className="text-uppercase font-size-16">{title || ''}</strong>
        </div>
      </div>
      <div className="card-body">
        {!isRemovedAll && data.length !== 0 && (
          <Divider>
            <Button
              type="danger"
              loading={isRemoveAllLoading}
              onClick={() => removeAll(removeArray)}
            >
              {formatMessage({ id: 'KitchenGeneratedOrderList.RemoveAll' })}
            </Button>
          </Divider>
        )}
        {data.length !== 0 && !isRemovedAll && (
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
            rowKey={() => Math.random().toString()}
          />
        )}
        {isRemovedAll && (
          <Result
            status="success"
            title={formatMessage({ id: 'KitchenGeneratedOrderList.SuccessfullyRemoved!' })}
          />
        )}
        {data.length === 0 && (
          <Result
            status="success"
            title={formatMessage({ id: 'KitchenGeneratedOrderList.SuccessfullyChecked!' })}
          />
        )}
      </div>
    </div>
  )
}

export default GeneratedOrderList
