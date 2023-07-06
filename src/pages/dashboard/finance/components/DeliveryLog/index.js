/* eslint-disable no-restricted-globals */
import React, { useState } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import moment from 'moment'
import { Table, Statistic, Row, Col, Button, Modal, InputNumber, notification } from 'antd'
import { putDeliveryLog } from 'api/deliveryTools'

function DeliveryLog({ data, show }) {
  const [editVisible, setEditVisible] = useState(false)
  const [editableItem, setEditableItem] = useState({
    id: '',
    date: '',
    customers: 0,
    smallCouriers: 0,
    bigCouriers: 0,
    smallRate: 0,
    bigRate: 0,
    additionalCost: 0,
  })

  const onChangeField = (e, field) => {
    editableItem[field] = e
    setEditableItem(editableItem)
  }

  const onSend = async () => {
    try {
      const onSendData = {
        customers: editableItem.customers,
        smallCouriers: editableItem.smallCouriers,
        bigCouriers: editableItem.bigCouriers,
        smallRate: editableItem.smallRate,
        bigRate: editableItem.bigRate,
        additionalCost: editableItem.additionalCost,
      }
      if (
        isNaN(editableItem.customers) ||
        isNaN(editableItem.smallCouriers) ||
        isNaN(editableItem.smallRate) ||
        isNaN(editableItem.bigCouriers) ||
        isNaN(editableItem.bigRate) ||
        isNaN(editableItem.additionalCost)
      ) {
        notification.error({
          message: <FormattedMessage id="DeliveryLog.RequiredFieldsCannotBeEmpty" />,
          description: <FormattedMessage id="DeliveryLog.FillInAllRequiredFields!" />,
          placement: 'topRight',
        })
        return
      }

      const req = await putDeliveryLog(editableItem.id, onSendData)
      if (req.ok) {
        await show()
        setEditVisible(false)
        setEditableItem({})
        notification.success({
          message: <FormattedMessage id="DeliveryLog.Saved" />,
          description: <FormattedMessage id="DeliveryLog.RecordsSuccessfullySaved" />,
        })
      } else if (req.status === 409) {
        notification.error({
          message: <FormattedMessage id="DeliveryLog.UnprocessableEntity" />,
          description: <FormattedMessage id="DeliveryLog.IncorrectData" />,
          placement: 'topLeft',
        })
      } else {
        notification.error({
          message: <FormattedMessage id="global.error" />,
          description: req.statusText,
          placement: 'topLeft',
        })
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  const showModal = (id, record) => {
    setEditVisible(true)
    setEditableItem(record)
  }

  const handleOk = () => {
    onSend()
  }

  const handleCancel = () => {
    setEditVisible(false)
    setEditableItem({})
  }

  const columns = [
    {
      title: <FormattedMessage id="global.date" />,
      dataIndex: 'date',
      key: 'date',
      render: date => <span>{`${moment(date).format('DD.MM.YYYY')}`}</span>,
      sorter: (a, b) => a.date - b.date,
    },
    {
      title: <FormattedMessage id="DeliveryLog.Customers" />,
      dataIndex: 'customers',
      key: 'customers',
      render: customers => {
        return customers
      },
      sorter: (a, b) => a.customers - b.customers,
    },
    {
      title: <FormattedMessage id="DeliveryLog.SmallCouriers" />,
      dataIndex: 'smallCouriers',
      key: 'smallCouriers',
      render: smallCouriers => {
        return smallCouriers
      },
      sorter: (a, b) => a.smallCouriers - b.smallCouriers,
    },
    {
      title: <FormattedMessage id="DeliveryLog.BigCouriers" />,
      dataIndex: 'bigCouriers',
      key: 'bigCouriers',
      render: bigCouriers => {
        return bigCouriers
      },
      sorter: (a, b) => a.bigCouriers - b.bigCouriers,
    },
    {
      title: <FormattedMessage id="DeliveryLog.SmallRate" />,
      dataIndex: 'smallRate',
      key: 'smallRate',
      render: smallRate => <span>{`${smallRate} Kč`}</span>,
      sorter: (a, b) => a.smallRate - b.smallRate,
    },
    {
      title: <FormattedMessage id="DeliveryLog.BigRate" />,
      dataIndex: 'bigRate',
      key: 'bigRate',
      render: bigRate => <span>{`${bigRate} Kč`}</span>,
      sorter: (a, b) => a.bigRate - b.bigRate,
    },
    {
      title: <FormattedMessage id="DeliveryLog.ExtraPayment(a)" />,
      dataIndex: 'extraPayment',
      key: 'extraPayment',
      render: extraPayment => {
        return <span>{`${extraPayment} Kč`}</span>
      },
      sorter: (a, b) => a.extraPayment - b.extraPayment,
    },
    {
      title: <FormattedMessage id="DeliveryLog.AdditionalCost(m)" />,
      dataIndex: 'additionalCost',
      key: 'additionalCost',
      render: additionalCost => {
        return <span>{`${additionalCost} Kč`}</span>
      },
      sorter: (a, b) => a.additionalCost - b.additionalCost,
    },
    {
      title: <FormattedMessage id="DeliveryLog.TotalCost" />,
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: totalCost => {
        return <span>{`${totalCost} Kč`}</span>
      },
      sorter: (a, b) => a.totalCost - b.totalCost,
    },
    {
      title: '---',
      dataIndex: 'id',
      key: 'actions',
      render: (id, record) => {
        return <Button onClick={() => showModal(id, record)}>Edit</Button>
      },
    },
  ]

  return (
    <div>
      {data.result && (
        <div className="row">
          <div className="col-lg-12">
            <div className="card card--fullHeight">
              <div className="card-body">
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={<FormattedMessage id="DeliveryLog.Deliveries" />}
                      value={data.result.length || 0}
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={<FormattedMessage id="DeliveryLog.Min.Price" />}
                      value={data.summary.minPrice || 0}
                      suffix="Kč"
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={<FormattedMessage id="DeliveryLog.Max.Price" />}
                      value={data.summary.maxPrice || 0}
                      suffix="Kč"
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={<FormattedMessage id="DeliveryLog.Avg.Price" />}
                      value={data.summary.avgPrice || 0}
                      suffix="Kč"
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={<FormattedMessage id="DeliveryLog.TotalPrice" />}
                      value={data.summary.totalPrice || 0}
                      suffix="Kč"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Table
        tableLayout="auto"
        scroll={{ x: '100%' }}
        columns={columns}
        dataSource={data.result}
        pagination={{
          position: 'bottom',
          total: data && data.result ? data.result.length : 0,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '200'],
          hideOnSinglePage: data && data.result && data.result.length < 10,
        }}
        rowKey={() => Math.random()}
      />
      <Modal
        title={<FormattedMessage id="DeliveryLog.BasicModal" />}
        visible={editVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row span={16}>
          <Col span={12}>
            <small>{<FormattedMessage id="DeliveryLog.Customers" />}</small>
            <InputNumber
              min={0}
              value={editableItem.customers}
              onChange={e => onChangeField(e, 'customers')}
              style={{ width: '85%' }}
            />
          </Col>
          <Col span={12}>
            <small>{<FormattedMessage id="DeliveryLog.AditionalCost" />}</small>
            <InputNumber
              min={0}
              value={editableItem.additionalCost}
              onChange={e => onChangeField(e, 'additionalCost')}
              style={{ width: '85%' }}
            />
          </Col>
        </Row>
        <Row span={16}>
          <Col span={12}>
            <small>{<FormattedMessage id="DeliveryLog.SmallCouriers" />}</small>
            <InputNumber
              min={0}
              value={editableItem.smallCouriers}
              onChange={e => onChangeField(e, 'smallCouriers')}
              style={{ width: '85%' }}
            />
          </Col>
          <Col span={12}>
            <small>{<FormattedMessage id="DeliveryLog.SmallRate" />}</small>
            <InputNumber
              min={0}
              value={editableItem.smallRate}
              onChange={e => onChangeField(e, 'smallRate')}
              style={{ width: '85%' }}
            />
          </Col>
          <Col span={12}>
            <small>{<FormattedMessage id="DeliveryLog.BigCouriers" />}</small>
            <InputNumber
              min={0}
              value={editableItem.bigCouriers}
              onChange={e => onChangeField(e, 'bigCouriers')}
              style={{ width: '85%' }}
            />
          </Col>
          <Col span={12}>
            <small>{<FormattedMessage id="DeliveryLog.BigRate" />}</small>
            <InputNumber
              min={0}
              value={editableItem.bigRate}
              onChange={e => onChangeField(e, 'bigRate')}
              style={{ width: '85%' }}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  )
}

export default injectIntl(DeliveryLog)
