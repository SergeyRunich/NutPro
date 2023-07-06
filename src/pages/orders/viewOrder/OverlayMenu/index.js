import React, { useState } from 'react'
import moment from 'moment'
import { notification, Menu, Modal, Divider, Table, Button } from 'antd'
import {
  sendApprovalWithoutInvoice,
  getCalculatedSplitPaymentData,
  acceptOrderWithSplitedInvoice,
} from '../../../../api/order'

const OverlayMenu = ({ id, update }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [paymentsData, setPaymentsData] = useState([])
  const [isPaymentsCalculated, setIsPaymentsCalculated] = useState(false)

  const reqForApprovalWithoutInvoice = async () => {
    sendApprovalWithoutInvoice(id)
      .then(async req => {
        if (req.status === 200) {
          update()
          notification.success({
            message: 'Success',
            description: 'The approval request was sent successfully!',
          })
        }
      })
      .catch(() => {
        notification.error({
          message: 'Error',
          description: 'The approval request was not sent!',
        })
      })
  }

  const reqForApprovalToSplitInvoice = () => {
    setIsPaymentsCalculated(false)
    acceptOrderWithSplitedInvoice(id)
      .then(async req => {
        if (req.status === 202) {
          setIsPaymentsCalculated(true)
          update()
          setIsModalOpen(false)
          notification.success({
            message: 'Success',
          })
        }
      })
      .catch(() => {
        notification.error({
          message: 'Error',
        })
      })
  }

  const calculatePayments = () => {
    getCalculatedSplitPaymentData(id)
      .then(async req => {
        if (req.status === 200) {
          const { result } = await req.json()
          setPaymentsData(result)
          setIsPaymentsCalculated(true)
          notification.success({
            message: 'Success',
          })
        }
      })
      .catch(() => {
        notification.error({
          message: 'Error',
        })
      })
  }

  const onCancelHandler = () => {
    setIsPaymentsCalculated(false)
    setPaymentsData([])
    setIsModalOpen(false)
  }

  const columns = [
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Days',
      dataIndex: 'days',
      key: 'days',
      render: days => <span>{days}</span>,
    },
    {
      title: 'Due',
      dataIndex: 'due',
      key: 'due',
      render: due => (
        <span>
          {due} days (
          {moment()
            .add(due, 'days')
            .format('DD.MM.YYYY')}
          )
        </span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: amount => <span>{amount} Kč</span>,
    },
  ]

  return (
    <>
      <Menu style={{ padding: '0px' }}>
        <Menu.Item key="without_invoice" onClick={reqForApprovalWithoutInvoice}>
          Without creating an invoice
        </Menu.Item>
        <Menu.Item key="split_payments" onClick={() => setIsModalOpen(true)}>
          Split invoice
        </Menu.Item>
      </Menu>
      <Modal
        visible={isModalOpen}
        title="Select duration"
        okText="Accept"
        onOk={reqForApprovalToSplitInvoice}
        onCancel={onCancelHandler}
        okButtonProps={{ disabled: !isPaymentsCalculated }}
      >
        <Button type="primary" onClick={calculatePayments}>
          Calculate payments
        </Button>
        <Divider />
        <Table
          tableLayout="auto"
          size="small"
          columns={columns}
          dataSource={paymentsData}
          rowKey={() => Math.random()}
        />
      </Modal>
    </>
  )
}

export default OverlayMenu
