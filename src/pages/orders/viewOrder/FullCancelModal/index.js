import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import moment from 'moment'
import { Modal, Input, Radio, notification } from 'antd'

import { cancelOrder } from '../../../../api/order'

moment.updateLocale('en', {
  week: { dow: 1 },
})

const CancelModal = ({ visible, isPaid, order, update, onClose }) => {
  const [refund, setRefund] = useState('none')
  const [moneyBackDescription, setMoneyBackDescription] = useState('')
  const { formatMessage } = useIntl()

  const cancel = async () => {
    try {
      const req = await cancelOrder(order.id, {
        refund,
        moneyBackDescription,
      })
      if (req.status === 202) {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'Orders.RequestSuccessfullySent!' }),
        })
        clear()
        update()
        closeDrawer()
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    } catch (errorInfo) {
      notification.error({
        message: formatMessage({ id: 'global.error' }),
        description: errorInfo,
        placement: 'topLeft',
      })
    }
  }

  const clear = () => {
    setRefund('')
    setMoneyBackDescription('')
  }

  const closeDrawer = () => {
    clear()
    onClose()
  }

  const action = ['fromWeb', 'new', 'incomplete'].includes(order.status) ? 'cancel' : 'approval'

  return (
    <div>
      <Modal
        visible={visible}
        title={formatMessage({ id: 'Orders.CompleteCancellationOfTheOrder' })}
        onOk={() => cancel()}
        okText={
          action === 'cancel'
            ? formatMessage({ id: 'Orders.Ok' })
            : formatMessage({ id: 'Orders.SubmitForApproval' })
        }
        okButtonProps={{
          disabled:
            (isPaid && refund !== 'credit' && refund !== 'moneyback') ||
            (refund === 'moneyback' && !moneyBackDescription),
        }}
        width="350px"
        onCancel={closeDrawer}
      >
        {isPaid && action === 'approval' && (
          <div>
            <h3>{formatMessage({ id: 'Orders.InvoicePaid' })}</h3>
            <p>
              {' '}
              {formatMessage({
                id:
                  'Orders.The order has not started yet. Invoice already paid. A refund will be made.',
              })}
            </p>
            <br />
            <p>
              <center>
                <b>{formatMessage({ id: 'Orders.Specify the method of refund.' })}</b>
              </center>
            </p>
            <center>
              <Radio.Group key="refund" value={refund} onChange={e => setRefund(e)} size="small">
                <Radio.Button value="credit">
                  {formatMessage({ id: 'Orders.Deposit to credit balance' })}
                </Radio.Button>
                <Radio.Button value="moneyback">
                  {formatMessage({ id: 'Orders.Request a refund' })}
                </Radio.Button>
              </Radio.Group>
              {refund === 'credit' ? (
                <span>
                  <br />
                  <br />
                  <b style={{ fontSize: '14px' }}>
                    {formatMessage({
                      id: 'Orders.Amount will be transferred to customer credit balance!',
                    })}
                  </b>
                </span>
              ) : (
                ''
              )}
              {refund === 'moneyback' ? (
                <span>
                  <br />
                  <br />
                  <b>{formatMessage({ id: 'Orders.Please enter account number for refund' })}</b>
                  <br />
                  <Input
                    style={{ width: '100%' }}
                    placeholder="Account number"
                    value={moneyBackDescription}
                    onChange={e => setMoneyBackDescription(e.target.value)}
                  />
                </span>
              ) : (
                ''
              )}
            </center>
          </div>
        )}

        {!isPaid && action === 'approval' && (
          <div>
            <span>
              <h3>{formatMessage({ id: 'Orders.InvoiceUnpaid' })}</h3>
              <p>
                {formatMessage({
                  id:
                    'Orders.The order has not started yet. Invoice has not been paid. The current invoice will be cancelled.',
                })}
              </p>
            </span>
          </div>
        )}
        {action === 'cancel' && (
          <div>
            <span>
              <h3>{formatMessage({ id: 'Orders.NotAccepted' })}</h3>
              <p>
                {formatMessage({
                  id:
                    'Orders.The order is not accepted. The order will be marked as cancelled without approval.',
                })}
              </p>
            </span>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default CancelModal
