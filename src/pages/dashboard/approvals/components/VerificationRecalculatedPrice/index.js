import React, { useState, useEffect, useCallback } from 'react'
import { useIntl } from 'react-intl'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Table, notification, Button, Modal, Divider } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { getOrdersReqForApproval, rejectOrApprovePrice } from '../../../../../api/order'

const VerificationRecalculatedPrice = () => {
  const [loading, setLoading] = useState(false)
  const [reqPriceApprovalOrders, setReqPriceApprovalOrders] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [currentTableRow, setCurrentTableRow] = useState({})
  const [isPriceApproved, setIsPriceApproved] = useState(false)
  const [isPriceRejected, setIsPriceRejected] = useState(false)

  const { formatMessage } = useIntl()

  const handleCancel = () => setModalVisible(false)

  const handleApprove = () => {
    setIsPriceApproved(true)
    const { id } = currentTableRow
    rejectOrApprovePrice({ id, status: 'approved' })
      .then(async answer => {
        if (answer.status === 202) {
          notification.success({
            message: formatMessage({ id: 'ApprovalsVerifRecalcPrice.Done' }),
            description: formatMessage({
              id: 'ApprovalsVerifRecalcPrice.NewPriceSuccessfullyApproved!',
            }),
          })
          setModalVisible(false)
          update()
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: answer.statusText,
          })
        }
      })
      .finally(() => setIsPriceApproved(false))
  }

  const handleReject = () => {
    setIsPriceRejected(true)
    const { id } = currentTableRow
    rejectOrApprovePrice({ id, status: 'rejected' })
      .then(async answer => {
        if (answer.status === 202) {
          notification.success({
            message: formatMessage({ id: 'ApprovalsVerifRecalcPrice.Done' }),
            description: formatMessage({
              id: 'ApprovalsVerifRecalcPrice.NewPriceSuccessfullyRejected!',
            }),
          })
          setModalVisible(false)
          update()
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: answer.statusText,
          })
        }
      })
      .finally(() => setIsPriceRejected(false))
  }

  const update = useCallback(() => {
    setLoading(true)
    getOrdersReqForApproval()
      .then(async req => {
        if (req.status === 200) {
          const json = await req.json()
          setReqPriceApprovalOrders(json.result)
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
          })
        }
      })
      .finally(() => setLoading(false))
  }, [formatMessage])

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
      title: formatMessage({ id: 'ApprovalsVerifRecalcPrice.CreatedDate' }),
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
      title: formatMessage({ id: 'ApprovalsVerifRecalcPrice.OldPrice' }),
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => {
        return <span>{record.before.price} Kč</span>
      },
      sorter: (a, b) => a.before.price - b.before.price,
    },
    {
      title: formatMessage({ id: 'ApprovalsVerifRecalcPrice.NewPrice' }),
      dataIndex: 'price',
      key: 'newPrice',
      render: (text, record) => {
        return <span>{record.after.price} Kč</span>
      },
      sorter: (a, b) => a.after.price - b.after.price,
    },
    {
      title: formatMessage({ id: 'ApprovalsVerifRecalcPrice.PriceDifference' }),
      dataIndex: 'price',
      key: Math.random(),
      render: (text, record) => {
        return <span>{record.after.price - record.before.price} Kč</span>
      },
    },
    {
      title: formatMessage({ id: 'ApprovalsVerifRecalcPrice.Action' }),
      dataIndex: 'id',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button
            onClick={() => {
              setModalVisible(true)
              setCurrentTableRow(record)
            }}
          >
            {formatMessage({ id: 'ApprovalsVerifRecalcPrice.View' })}
          </Button>
        </div>
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
          {formatMessage({ id: 'ApprovalsVerifRecalcPrice.Reload' })}
        </Button>
      </Divider>
      <div className="row">
        <div className="col-xl-12">
          <Table
            tableLayout="auto"
            scroll={{ x: '100%' }}
            columns={columns}
            dataSource={reqPriceApprovalOrders}
            pagination={{
              position: 'bottom',
              total: reqPriceApprovalOrders.length,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100', '200'],
              hideOnSinglePage: reqPriceApprovalOrders.length < 10,
            }}
            loading={loading}
            rowKey={() => Math.random().toString()}
          />
        </div>
      </div>
      <Modal
        title="Order changes"
        visible={modalVisible}
        onCancel={handleCancel}
        footer={[
          <Button
            disabled={isPriceRejected}
            loading={isPriceApproved}
            key="approve"
            type="primary"
            onClick={handleApprove}
          >
            {formatMessage({ id: 'ApprovalsVerifRecalcPrice.Approve' })}
          </Button>,
          <Button
            disabled={isPriceApproved}
            loading={isPriceRejected}
            key="reject"
            type="danger"
            onClick={handleReject}
          >
            {formatMessage({ id: 'global.reject' })}
          </Button>,
          <Button key="cancel" onClick={handleCancel}>
            {formatMessage({ id: 'global.cancel' })}
          </Button>,
        ]}
      >
        {currentTableRow && currentTableRow.before && currentTableRow.after && (
          <div>
            {currentTableRow.before.length !== currentTableRow.after.length && (
              <p style={{ fontSize: '24px', textAlign: 'center' }}>
                <Divider>{formatMessage({ id: 'ApprovalsVerifRecalcPrice.Days' })}</Divider>
                {`${currentTableRow.before.length} → ${currentTableRow.after.length}`}
              </p>
            )}
            {currentTableRow.before.mealsPerDay !== currentTableRow.after.mealsPerDay && (
              <p style={{ fontSize: '24px', textAlign: 'center' }}>
                <Divider>{formatMessage({ id: 'ApprovalsVerifRecalcPrice.Meals' })}</Divider>
                {`${currentTableRow.before.mealsPerDay} → ${currentTableRow.after.mealsPerDay}`}
              </p>
            )}
            {currentTableRow.before.params.energy !== currentTableRow.after.params.energy && (
              <p style={{ fontSize: '24px', textAlign: 'center' }}>
                <Divider>{formatMessage({ id: 'ApprovalsVerifRecalcPrice.kcal' })}</Divider>
                {`${currentTableRow.before.params.energy} → ${currentTableRow.after.params.energy}`}
              </p>
            )}
            {currentTableRow.before.price !== currentTableRow.after.price && (
              <p style={{ fontSize: '24px', textAlign: 'center' }}>
                <Divider>{formatMessage({ id: 'ApprovalsVerifRecalcPrice.Price' })}</Divider>
                {`${currentTableRow.before.price} Kč → ${currentTableRow.after.price} Kč`}
              </p>
            )}
            <h3>{currentTableRow.action}</h3>
          </div>
        )}
      </Modal>
    </Authorize>
  )
}

export default VerificationRecalculatedPrice
