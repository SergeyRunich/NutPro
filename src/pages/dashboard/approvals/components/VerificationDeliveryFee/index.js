import React, { useState, useCallback, useEffect } from 'react'
import { useIntl } from 'react-intl'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Table, notification, Dropdown, Menu, Divider, Button } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { getVerificationDeliveryFeeOrders, approveDeliveryFee } from '../../../../../api/dashboard'

function VerificationDeliveryFeeOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const { formatMessage } = useIntl()

  const update = useCallback(() => {
    setLoading(true)
    getVerificationDeliveryFeeOrders().then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        setOrders(json)
        setLoading(false)
      } else {
        setLoading(false)
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    })
  }, [formatMessage])

  useEffect(() => {
    update()
  }, [update])

  const approve = async id => {
    const req = await approveDeliveryFee(id)
    if (req.status === 200) {
      update()
      notification.success({
        message: formatMessage({ id: 'global.success' }),
        description: formatMessage({ id: 'ApprovalsVerifDelivFee.OrderSuccessfullyApproved' }),
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
        {formatMessage({ id: 'ApprovalsVerifDelivFee.Approve' })}
      </Menu.Item>
    </Menu>
  )

  const columns = [
    {
      title: formatMessage({ id: 'ApprovalsVerifDelivFee.ID' }),
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
      title: formatMessage({ id: 'ApprovalsVerifDelivFee.CreatedDate' }),
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
      title: formatMessage({ id: 'ApprovalsVerifDelivFee.Start' }),
      dataIndex: 'timestamp',
      key: 'startDate',
      render: text => {
        return <span>{moment.unix(text).format('DD.MM.YYYY')}</span>
      },
      sorter: (a, b) => a.timestamp - b.timestamp,
    },
    {
      title: formatMessage({ id: 'ApprovalsVerifDelivFee.Diet' }),
      dataIndex: 'diet',
      key: 'diet',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.diet.length - b.diet.length,
    },
    {
      title: formatMessage({ id: 'ApprovalsVerifDelivFee.Meals' }),
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
      title: formatMessage({ id: 'ApprovalsVerifDelivFee.Price' }),
      dataIndex: 'price',
      key: 'price',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: formatMessage({ id: 'ApprovalsVerifDelivFee.Action' }),
      dataIndex: 'id',
      key: 'action',
      render: id => (
        <span>
          <Dropdown.Button overlay={menu(id)}>
            <Link to={`/orders/${id}`}>{formatMessage({ id: 'ApprovalsVerifDelivFee.View' })}</Link>
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

export default VerificationDeliveryFeeOrders
