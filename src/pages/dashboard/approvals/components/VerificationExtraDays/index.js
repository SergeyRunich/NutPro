import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import moment from 'moment'
import { withRouter, Link } from 'react-router-dom'
import { Table, notification, Button, Divider } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { getExtraDayRequests, updateExtraDayRequest } from '../../../../../api/extraDays'

function VerificationOrders() {
  const [loading, setLoading] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const [isRejected, setIsRejected] = useState(false)
  const [extraDays, setExtraDays] = useState([])

  const intl = useIntl()
  const { formatMessage } = intl

  useEffect(() => {
    update()
  }, [])

  const handleApprove = async id => {
    try {
      setIsApproved(true)
      const req = await updateExtraDayRequest({ id, status: 'approved' })
      if (req.status === 202) {
        notification.success({
          message: formatMessage({ id: 'ApprovalsExtraDays.Done' }),
          description: formatMessage({ id: 'ApprovalsExtraDays.ExtraDaysSuccessfullyApproved' }),
        })
        update()
      }
    } catch (e) {
      notification.error({
        message: formatMessage({ id: 'global.error' }),
        description: e.statusText,
      })
    } finally {
      setIsApproved(false)
    }
  }

  const handleReject = id => {
    updateExtraDayRequest({ id, status: 'rejected' }).then(async answer => {
      setIsRejected(true)
      if (answer.status === 202) {
        notification.success({
          message: formatMessage({ id: 'ApprovalsExtraDays.Done' }),
          description: formatMessage({ id: 'ApprovalsExtraDays.ExtraDaysSuccessfullyRejected' }),
        })
        setIsRejected(false)
        update()
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: answer.statusText,
        })
      }
    })
  }

  const update = () => {
    setLoading(true)

    getExtraDayRequests().then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        setExtraDays(json.result)
        setLoading(false)
      } else {
        setLoading(false)
        notification.error({
          message: 'Error',
          description: req.statusText,
        })
      }
    })
  }

  const columns = [
    {
      title: formatMessage({ id: 'global.name' }),
      dataIndex: 'user',
      key: 'name',
      sorter: (a, b) => a.order.name.length - b.order.name.length,
      render: (_, record) => (
        <Link target="_blank" to={`/orders/${record.order.id}`}>{`${record.order.name}`}</Link>
      ),
    },
    {
      title: formatMessage({ id: 'global.date' }),
      dataIndex: 'date',
      key: 'date',
      render: text => <span>{`${moment(text).format('DD.MM.YYYY HH:mm')}`}</span>,
      sorter: (a, b) => parseInt(a.id.substring(0, 8), 16) - parseInt(b.id.substring(0, 8), 16),
    },
    {
      title: formatMessage({ id: 'ApprovalsExtraDays.Days' }),
      dataIndex: 'length',
      key: 'length',
      render: (text, record) => {
        return <span>{record.order.length}</span>
      },
      sorter: (a, b) => a.length - b.length,
    },
    {
      title: formatMessage({ id: 'ApprovalsExtraDays.Price' }),
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => {
        return <span>{record.order.price} Kč</span>
      },
      sorter: (a, b) => a.order.price - b.order.price,
    },
    {
      title: formatMessage({ id: 'ApprovalsExtraDays.ExtraDays' }),
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => {
        return <span>{record.amount}</span>
      },
    },
    {
      title: formatMessage({ id: 'ApprovalsExtraDays.Approve' }),
      dataIndex: 'id',
      key: 'actionApprove',
      render: (text, record) => (
        <span>
          <Button
            disabled={isRejected}
            loading={isApproved}
            key="approve"
            type="primary"
            onClick={() => {
              handleApprove(record.id)
            }}
          >
            {formatMessage({ id: 'ApprovalsExtraDays.Approve' })}
          </Button>
        </span>
      ),
    },
    {
      title: formatMessage({ id: 'global.reject' }),
      dataIndex: 'id',
      key: 'actionReject',
      render: (text, record) => (
        <span>
          <Button
            disabled={isApproved}
            loading={isRejected}
            key="reject"
            type="danger"
            onClick={() => {
              handleReject(record.id)
            }}
          >
            {formatMessage({ id: 'global.reject' })}
          </Button>
        </span>
      ),
    },
  ]

  return (
    <Authorize roles={['root', 'salesDirector']} users={['Jitka']}>
      <Divider>
        <Button onClick={update}>{formatMessage({ id: 'ApprovalsExtraDays.Reload' })}</Button>
      </Divider>
      <div className="row">
        <div className="col-xl-12">
          <Table
            tableLayout="auto"
            scroll={{ x: '100%' }}
            columns={columns}
            dataSource={extraDays}
            pagination={{
              position: 'bottom',
              total: extraDays.length,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100', '200'],
              hideOnSinglePage: extraDays.length < 10,
            }}
            loading={loading}
            rowKey={() => Math.random().toString()}
          />
        </div>
      </div>
    </Authorize>
  )
}

export default withRouter(VerificationOrders)
