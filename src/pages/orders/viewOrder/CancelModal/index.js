import React, { useState } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import {
  Modal,
  Button,
  Radio,
  Popconfirm,
  Row,
  Col,
  notification,
  Statistic,
  Typography,
  Switch,
  DatePicker,
  InputNumber,
} from 'antd'

import { shorteringOrder } from '../../../../api/order'
import { getOrderDays } from '../../../../services/order'
import Calendar from '../../../../components/NutritionPRO/Calendar'

moment.updateLocale('en', {
  week: { dow: 1 },
})

const CancelModal = ({ order, update, visible, onClose }) => {
  const [lastDay, setLastDay] = useState('')
  const [newLength, setNewLength] = useState(0)
  const [type, setType] = useState('LastDay')
  const [isSendEmail, setIsSendEmail] = useState(false)

  const handleChangeDate = async date => {
    if (date) {
      const n = date.clone()
      const computedNewLength =
        order.orderDays.findIndex(
          d =>
            d ===
            n
              .utc()
              .startOf('day')
              .unix(),
        ) + 1
      setLastDay(date.format('DD-MM-YYYY'))
      setNewLength(computedNewLength)
    } else {
      setLastDay('')
      setNewLength(0)
    }
  }

  const disabledDate = current => {
    const c = current.clone()

    const tooEarly =
      c
        .utc()
        .startOf('day')
        .unix() <= order.timestamp
    const noneOrderDays = !order.orderDays.includes(
      c
        .utc()
        .startOf('day')
        .unix(),
    )
    const today = current <= moment()
    const blocked =
      current.day() !== 2 && current.day() !== 4 && current.day() !== 5 && current.day() !== 6

    return tooEarly || blocked || today || noneOrderDays
  }

  const shortening = async () => {
    try {
      const req = await shorteringOrder(order.id, {
        newLength,
        isSendEmail,
      })
      if (req.status === 202) {
        notification.success({
          message: 'Success',
          description: 'Order was successfully shorted!',
        })
        clear()
        update()
        closeDrawer()
      } else {
        notification.error({
          message: 'Error',
          description: req.statusText,
        })
      }
    } catch (errorInfo) {
      notification.error({
        message: 'Error',
        description: errorInfo,
        placement: 'topLeft',
      })
    }
  }

  const clear = () => {
    setLastDay(null)
    setNewLength(null)
  }

  const closeDrawer = () => {
    clear()
    onClose()
  }

  const preOrderDays = getOrderDays(
    order.timestamp,
    newLength,
    order.size,
    order.pauses,
    order.additionalDays,
    order.removedDays,
  )
  const newActiveDays = preOrderDays.map(day => moment.unix(day).format('DD-MM-YYYY'))

  return (
    <div>
      <Modal
        visible={visible}
        title={`Length editing | User: ${order.user ? order.user.name : '-'}, Order: ${order.id}`}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        width="720px"
        onCancel={closeDrawer}
      >
        <Row gutter={16}>
          <Col sm={24} lg={10}>
            <Typography.Title level={4} style={{ textAlign: 'center' }}>
              <FormattedMessage id="Orders.CurrentDays" />
            </Typography.Title>
            <div className="card card--fullHeight">
              <div className="card-body">
                <Statistic
                  title="Last day"
                  value={moment
                    .unix(order.orderDays[order.orderDays.length - 1])
                    .format('DD-MM-YYYY')}
                />
                <Statistic title="Current length" value={order.length} suffix="days" />
              </div>
            </div>
          </Col>
          <Col sm={24} lg={14}>
            <Typography.Title level={4} style={{ textAlign: 'center' }}>
              <FormattedMessage id="Orders.Change" />
            </Typography.Title>
            <div className="card card--fullHeight">
              <div className="card-body">
                <Row gutter={16}>
                  <Col sm={24} lg={12}>
                    <Radio.Group value={type} onChange={e => setType(e)}>
                      <Radio.Button value="lastDay">
                        <FormattedMessage id="Orders.LastDay" />
                      </Radio.Button>
                      <Radio.Button value="length">
                        <FormattedMessage id="Orders.Length" />
                      </Radio.Button>
                    </Radio.Group>
                  </Col>
                  <Col sm={24} lg={12}>
                    {type === 'lastDay' && (
                      <DatePicker
                        format="DD-MM-YYYY"
                        disabledDate={disabledDate}
                        onChange={handleChangeDate}
                      />
                    )}
                    {type === 'length' && (
                      <InputNumber
                        value={newLength}
                        onChange={e => setNewLength(e.target.value)}
                        min={moment.unix(order.timestamp).diff(
                          moment()
                            .utc()
                            .startOf('day'),
                          'days',
                        )}
                      />
                    )}
                  </Col>
                </Row>
                <br />

                <Statistic
                  title="Last day"
                  value={
                    lastDay || newActiveDays.length > 0
                      ? newActiveDays[newActiveDays.length - 1].format('DD-MM-YYYY')
                      : '---'
                  }
                />
                <Statistic title="New length" value={newLength || '---'} suffix="days" />
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col sm={24} lg={12}>
            <Typography.Title level={3} style={{ textAlign: 'center' }}>
              <FormattedMessage id="Orders.CurrentOrder" />
            </Typography.Title>
            <Calendar />
          </Col>
          <Col sm={24} lg={12}>
            <Typography.Title level={3} style={{ textAlign: 'center' }}>
              <FormattedMessage id="Orders.OrderAfterChange" />
            </Typography.Title>
            <Calendar highlightedDays={newActiveDays} />
          </Col>
        </Row>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            {newLength && lastDay && (
              <p>
                <b>
                  <FormattedMessage id="Orders.ATTENTION:" />
                </b>{' '}
                <FormattedMessage id="Orders.TheOrderLengthWillBeChangedFrom" /> {order.length}{' '}
                <FormattedMessage id="Orders.DaysTo" /> {newLength}{' '}
                <FormattedMessage id="Orders.days" /> <FormattedMessage id="Orders.The" />{' '}
                <b>
                  <FormattedMessage id="Orders.INVOICE" />
                </b>{' '}
                <FormattedMessage id="Orders.willAlsoBe" />{' '}
                <b>
                  <FormattedMessage id="Orders.CHANGED" />
                </b>
                !!!
              </p>
            )}
            <small>
              <FormattedMessage id="Orders.NotifyCustomer" />
            </small>{' '}
            <Switch
              checked={isSendEmail}
              onChange={e => setIsSendEmail(e.target.checked)}
              style={{ marginRight: '10px' }}
            />
            <Popconfirm
              title={<FormattedMessage id="Orders.EditLength?" />}
              onConfirm={shortening}
              okText={<FormattedMessage id="Orders.Change" />}
              disabled={!newLength && !lastDay}
              cancelText={<FormattedMessage id="global.cancel" />}
            >
              <Button
                style={{ width: 150 }}
                size="large"
                type="primary"
                disabled={!newLength && !lastDay}
                className="mr-3"
              >
                <FormattedMessage id="Orders.ChangeLength" />
              </Button>
            </Popconfirm>
            <Button onClick={closeDrawer} size="large" type="default">
              <FormattedMessage id="Orders.Exit" />
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default injectIntl(CancelModal)
