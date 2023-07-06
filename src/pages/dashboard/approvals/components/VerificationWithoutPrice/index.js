import React, { useState, useCallback, useEffect } from 'react'
import { useIntl } from 'react-intl'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Table, notification, Dropdown, Menu, Divider, Button } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { getWithoutInvoice, approveWithoutInvoice } from '../../../../../api/dashboard'

const VerificationOrders = () => {
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const { formatMessage } = useIntl()

  const update = useCallback(() => {
    setLoading(true)
    getWithoutInvoice()
      .then(async req => {
        if (req.status === 200) {
          const json = await req.json()
          setOrders(json)
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
          })
        }
      })
      .finally(() => setLoading(false))
  }, [formatMessage])

  const reject = async id => {
    const req = await approveWithoutInvoice(id, 'reject')
    if (req.status === 200) {
      update()
      notification.info({
        message: formatMessage({ id: 'ApprovalsVerifWithoutPrice.Rejected' }),
        description: formatMessage({
          id: 'ApprovalsVerifWithoutPrice.RequestSuccessfullyRejected',
        }),
      })
    } else {
      notification.error({
        message: formatMessage({ id: 'global.error' }),
        description: req.statusText,
      })
    }
  }

  const approve = async id => {
    const req = await approveWithoutInvoice(id, 'approve')
    if (req.status === 200) {
      update()
      notification.success({
        message: formatMessage({ id: 'global.success' }),
        description: formatMessage({ id: 'ApprovalsVerifWithoutPrice.Approved' }),
      })
    } else {
      notification.error({
        message: formatMessage({ id: 'global.error' }),
        description: req.statusText,
      })
    }
  }

  const menu = id => (
    <Menu style={{ padding: '0px' }}>
      <Menu.Item
        key="accept"
        onClick={() => approve(id)}
        style={{ backgroundColor: 'LimeGreen', color: 'AliceBlue', fontWeight: 'bolder' }}
      >
        {formatMessage({ id: 'ApprovalsVerifWithoutPrice.Approve' })}
      </Menu.Item>
      <Menu.Item
        key="reject"
        onClick={() => reject(id)}
        style={{ backgroundColor: 'LightCoral', color: 'AliceBlue', fontWeight: 'bolder' }}
      >
        {formatMessage({ id: 'global.reject' })}
      </Menu.Item>
    </Menu>
  )

  const columns = [
    {
      title: formatMessage({ id: 'ApprovalsVerifWithoutPrice.ID' }),
      dataIndex: 'user',
      key: 'id',
      render: (text, record) => <Link to={`/users/${record.user.id}`}>{`${text.inBodyId}`}</Link>,
    },
    {
      title: formatMessage({ id: 'global.name' }),
      dataIndex: 'user',
      key: 'user',
      render: (user, record) => <Link to={`/orders/${record.id}`}>{user.name}</Link>,
    },
    {
      title: formatMessage({ id: 'ApprovalsVerifWithoutPrice.CreatedDate' }),
      dataIndex: 'id',
      key: 'createdDate',
      render: text => (
        <span>
          {`${moment.unix(parseInt(text.substring(0, 8), 16)).format('DD.MM.YYYY HH:mm')}`}
        </span>
      ),
      sorter: (a, b) => parseInt(a.id.substring(0, 8), 16) - parseInt(b.id.substring(0, 8), 16),
    },
    {
      title: formatMessage({ id: 'ApprovalsVerifWithoutPrice.Start' }),
      dataIndex: 'timestamp',
      key: 'startDate',
      render: text => {
        return <span>{moment.unix(text).format('DD.MM.YYYY')}</span>
      },
      sorter: (a, b) => a.timestamp - b.timestamp,
    },
    {
      title: formatMessage({ id: 'ApprovalsVerifWithoutPrice.Diet' }),
      dataIndex: 'diet',
      key: 'diet',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.diet.length - b.diet.length,
    },
    {
      title: formatMessage({ id: 'ApprovalsVerifWithoutPrice.Meals' }),
      dataIndex: 'mealsPerDay',
      key: 'mealsPerDay',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.mealsPerDay - b.mealsPerDay,
    },
    {
      title: formatMessage({ id: 'ApprovalsVerifWithoutPrice.Price' }),
      dataIndex: 'price',
      key: 'price',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: formatMessage({ id: 'ApprovalsVerifWithoutPrice.Action' }),
      dataIndex: 'id',
      key: 'action',
      render: id => (
        <span>
          <Dropdown.Button overlay={menu(id)}>
            <Link to={`/orders/${id}`}>View</Link>
          </Dropdown.Button>
        </span>
      ),
    },
  ]

  useEffect(() => {
    update()
  }, [update])

  return (
    <Authorize roles={['root', 'salesDirector']} users={['Jitka']}>
      <Divider>
        <Button onClick={update}>
          {formatMessage({ id: 'ApprovalsVerifWithoutPrice.Reload' })}
        </Button>
      </Divider>

      <div className="row">
        <div className="col-xl-12">
          <Table
            tableLayout="auto"
            scroll={{ x: '100%' }}
            columns={columns}
            dataSource={orders}
            pagination={{
              position: 'bottom',
              total: orders.length,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100', '200'],
              hideOnSinglePage: orders.length < 10,
            }}
            loading={loading}
            rowKey={() => Math.random()}
          />
        </div>
      </div>
    </Authorize>
  )
}

export default VerificationOrders
