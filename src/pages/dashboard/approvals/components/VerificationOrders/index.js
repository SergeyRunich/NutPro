import React, { useState, useEffect } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import moment from 'moment'
import { Link, withRouter } from 'react-router-dom'
import { Table, notification, Dropdown, Menu, Divider, Button } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { getVerificationOrders, approveOrder } from '../../../../../api/dashboard'
import { changeOrderStatus } from '../../../../../api/order'

function VerificationOrders() {
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    update()
  }, [])

  const update = () => {
    setLoading(true)
    getVerificationOrders().then(async req => {
      if (req.status === 200) {
        const json = await req.json()

        setOrders(json)
        setLoading(false)
      } else {
        setLoading(false)
        notification.error({
          message: <FormattedMessage id="global.error" />,
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
          message: <FormattedMessage id="global.success" />,
          description: <FormattedMessage id="ApprovalsVerifOrders.OrderSuccessfullyRejected" />,
        })
      } else {
        notification.success({
          message: <FormattedMessage id="global.success" />,
          description: (
            <FormattedMessage id="ApprovalsVerifOrders.OrderStatusSuccessfullyChanged!" />
          ),
        })
      }
    } else {
      notification.error({
        message: <FormattedMessage id="global.error" />,
        description: req.statusText,
      })
    }
  }

  const approve = async id => {
    const req = await approveOrder(id)
    if (req.status === 200) {
      update()
      notification.success({
        message: <FormattedMessage id="global.success" />,
        description: <FormattedMessage id="ApprovalsVerifOrders.OrderSuccessfullyApproved" />,
      })
    } else {
      notification.error({
        message: <FormattedMessage id="global.error" />,
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
        Approve
      </Menu.Item>
      <Menu.Item
        key="reject"
        onClick={() => onChangeStatusOrder(id, 'rejected')}
        style={{ backgroundColor: 'LightCoral', color: 'AliceBlue', fontWeight: 'bolder' }}
      >
        Reject
      </Menu.Item>
    </Menu>
  )

  const columns = [
    {
      title: <FormattedMessage id="ApprovalsVerifOrders.ID" />,
      dataIndex: 'user',
      key: 'id',
      render: (text, record) => <Link to={`/users/${record.user.id}`}>{`${text.inBodyId}`}</Link>,
      sorter: (a, b) => a.user.inBodyId - b.user.inBodyId,
    },
    {
      title: <FormattedMessage id="global.name" />,
      dataIndex: 'user',
      key: 'name',
      sorter: (a, b) => a.user.name.length - b.user.name.length,
      render: (text, record) => <Link to={`/users/${record.user.id}`}>{text.name}</Link>,
    },
    {
      title: <FormattedMessage id="ApprovalsVerifOrders.CreatedDate" />,
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
      title: <FormattedMessage id="ApprovalsVerifOrders.Start" />,
      dataIndex: 'timestamp',
      key: 'startDate',
      render: text => {
        return <span>{moment.unix(text).format('DD.MM.YYYY')}</span>
      },
      sorter: (a, b) => a.timestamp - b.timestamp,
    },
    {
      title: <FormattedMessage id="ApprovalsVerifOrders.Diet" />,
      dataIndex: 'diet',
      key: 'diet',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.diet.length - b.diet.length,
    },
    {
      title: <FormattedMessage id="ApprovalsVerifOrders.Meals" />,
      dataIndex: 'mealsPerDay',
      key: 'mealsPerDay',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.mealsPerDay - b.mealsPerDay,
    },
    {
      title: <FormattedMessage id="global.email" />,
      dataIndex: 'email',
      key: 'email',
      render: text => <a href={`mailto:${text}`} target="blank">{`${text || '-'}`}</a>,
      // sorter: (a, b) => a.email - b.email,
    },
    {
      title: <FormattedMessage id="global.phone" />,
      dataIndex: 'phone',
      key: 'phone',
      render: text => <span>{`${text || '-'}`}</span>,
      // sorter: (a, b) => a.phone - b.address,
    },
    {
      title: <FormattedMessage id="ApprovalsVerifOrders.Price" />,
      dataIndex: 'price',
      key: 'price',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: <FormattedMessage id="ApprovalsVerifOrders.CustomPrice" />,
      dataIndex: 'customPrice',
      key: 'customPrice',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: <FormattedMessage id="ApprovalsVerifOrders.Action" />,
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
        <Button onClick={update}>
          <FormattedMessage id="ApprovalsVerifOrders.Reload" />
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

export default withRouter(injectIntl(VerificationOrders))
