import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { Table, notification, Dropdown, Menu, Divider, Button } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { getCustomOrders, approveCustomOrder } from '../../../../../api/dashboard'
import { changeOrderStatus } from '../../../../../api/order'

function VerificationOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const { formatMessage } = useIntl()

  useEffect(() => {
    update()
  }, [])

  const update = () => {
    setLoading(true)

    getCustomOrders().then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        setOrders(json)
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

  const onChangeStatusOrder = async (id, newStatus) => {
    const req = await changeOrderStatus(newStatus, id)
    if (req.status === 202) {
      update()
      if (newStatus === 'rejected') {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'ApprovalsCustomMenu.OrderSuccessfullyRejected' }),
        })
      } else {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'ApprovalsCustomMenu.OrderSuccessfullyChanged!' }),
        })
      }
    } else {
      notification.error({
        message: formatMessage({ id: 'global.error' }),
        description: req.statusText,
      })
    }
  }

  const approve = async id => {
    const req = await approveCustomOrder(id)
    if (req.status === 200) {
      update()
      notification.success({
        message: formatMessage({ id: 'global.success' }),
        description: formatMessage({ id: 'ApprovalsCustomMenu.OrderSuccessfullyApproved!' }),
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
        {formatMessage({ id: 'ApprovalsCustomMenu.Approve' })}
      </Menu.Item>
      <Menu.Item
        key="reject"
        onClick={() => onChangeStatusOrder(id, 'rejected')}
        style={{ backgroundColor: 'LightCoral', color: 'AliceBlue', fontWeight: 'bolder' }}
      >
        {formatMessage({ id: 'global.reject' })}
      </Menu.Item>
    </Menu>
  )

  const columns = [
    {
      title: formatMessage({ id: 'ApprovalsCustomMenu.ID' }),
      dataIndex: 'user',
      key: 'id',
      render: (text, record) => <Link to={`/users/${record.user.id}`}>{`${text.inBodyId}`}</Link>,
      sorter: (a, b) => a.user.inBodyId - b.user.inBodyId,
    },
    {
      title: formatMessage({ id: 'global.name' }),
      dataIndex: 'user',
      key: 'name',
      sorter: (a, b) => a.user.name.length - b.user.name.length,
      render: (text, record) => <Link to={`/users/${record.user.id}`}>{text.name}</Link>,
    },
    {
      title: formatMessage({ id: 'ApprovalsCustomMenu.CreatedDate' }),
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
      title: formatMessage({ id: 'ApprovalsCustomMenu.Start' }),
      dataIndex: 'timestamp',
      key: 'startDate',
      render: text => {
        return <span>{moment.unix(text).format('DD.MM.YYYY')}</span>
      },
      sorter: (a, b) => a.timestamp - b.timestamp,
    },
    {
      title: formatMessage({ id: 'ApprovalsCustomMenu.Diet' }),
      dataIndex: 'diet',
      key: 'diet',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.diet.length - b.diet.length,
    },
    {
      title: formatMessage({ id: 'ApprovalsCustomMenu.Meals' }),
      dataIndex: 'mealsPerDay',
      key: 'mealsPerDay',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.mealsPerDay - b.mealsPerDay,
    },
    {
      title: formatMessage({ id: 'global.email' }),
      dataIndex: 'email',
      key: 'email',
      render: text => <a href={`mailto:${text}`} target="blank">{`${text || '-'}`}</a>,
    },
    {
      title: formatMessage({ id: 'global.phone' }),
      dataIndex: 'phone',
      key: 'phone',
      render: text => <span>{`${text || '-'}`}</span>,
    },
    {
      title: formatMessage({ id: 'ApprovalsCustomMenu.Price' }),
      dataIndex: 'price',
      key: 'price',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: formatMessage({ id: 'ApprovalsCustomMenu.Action' }),
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

  return (
    <Authorize roles={['root', 'salesDirector']} users={['Jitka']}>
      <Divider>
        <Button onClick={update}>{formatMessage({ id: 'ApprovalsCustomMenu.Reload' })}</Button>
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
            rowKey={() => Math.random().toString()}
          />
        </div>
      </div>
    </Authorize>
  )
}

export default VerificationOrders
