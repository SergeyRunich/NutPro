/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { Button, notification, Spin, Table } from 'antd'
import { useQuery } from 'react-query'
import { getUserOrders } from '../../../../api/order'
import { getQueryName } from '../../../../helpers/components'
import { DATE_FORMAT, DATE_TIME_FORMAT } from '../../../../helpers/constants'

const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100', '200']

const UserOrderList = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { formatMessage } = useIntl()
  const orders = useQuery(
    getQueryName(UserOrderList, 'orders'),
    async () => {
      const req = await getUserOrders(userId)
      return req.json()
    },
    {
      retry: false,
      cacheTime: 0,
      onError: e =>
        notification.error({
          message: `Failed to obtain orders list: ${e.message}`,
        }),
    },
  )

  const columns = [
    {
      title: formatMessage({ id: 'Users.Created date' }),
      dataIndex: 'id',
      key: 'createdDate',
      render: text => (
        <span>{`${moment.unix(parseInt(text.substring(0, 8), 16)).format(DATE_TIME_FORMAT)}`}</span>
      ),
      sorter: (a, b) => parseInt(a.id.substring(0, 8), 16) - parseInt(b.id.substring(0, 8), 16),
    },
    {
      title: formatMessage({ id: 'Users.Start' }),
      dataIndex: 'timestamp',
      key: 'startDate',
      render: text => {
        return <span>{moment.unix(text).format(DATE_FORMAT)}</span>
      },
      sorter: (a, b) => a.timestamp - b.timestamp,
    },
    {
      title: formatMessage({ id: 'Users.Diet' }),
      dataIndex: 'diet',
      key: 'diet',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.diet.length - b.diet.length,
    },
    {
      title: formatMessage({ id: 'Users.Meals' }),
      dataIndex: 'mealsPerDay',
      key: 'mealsPerDay',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.mealsPerDay - b.mealsPerDay,
    },
    {
      title: formatMessage({ id: 'Users.Price' }),
      dataIndex: 'price',
      key: 'price',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: formatMessage({ id: 'Users.Status' }),
      dataIndex: 'status',
      key: 'status',
      render: text => (
        <span
          className={
            text === 'accepted'
              ? 'font-size-12 badge badge-success'
              : text === 'rejected'
              ? 'font-size-12 badge badge-danger'
              : 'font-size-12 badge badge-primary'
          }
        >
          {text === 'Active' ? (
            <a className="text-white" href={`/#/orders/${text.id}`}>
              {text.status}
            </a>
          ) : (
            text
          )}
        </span>
      ),
    },
    {
      title: formatMessage({ id: 'Users.Action' }),
      dataIndex: 'id',
      key: 'action',
      render: text => (
        <span>
          <Button>
            <Link to={`/orders/${text}`}>{formatMessage({ id: 'Users.View' })}</Link>
          </Button>
        </span>
      ),
    },
  ]

  useEffect(() => {
    setIsLoading(true)
    orders.refetch().finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  if (!orders.isFetched || !orders.data) {
    return (
      <center>
        <Spin spinning />
      </center>
    )
  }

  return (
    <div>
      <Table
        className="utils__scrollTable"
        tableLayout="auto"
        scroll={{ x: '100%' }}
        columns={columns}
        dataSource={orders.data}
        pagination={{
          position: 'bottom',
          total: orders.data.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          hideOnSinglePage: orders.data.length < 10,
        }}
        loading={isLoading}
        rowKey={() => Math.random().toString()}
      />
    </div>
  )
}

export default UserOrderList
