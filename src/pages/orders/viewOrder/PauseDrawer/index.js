import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import moment from 'moment'

import { Drawer, Button, Row, Col, notification, Statistic, Typography, Switch } from 'antd'
import PauseList from './PauseList'
import EditPauseForm from './EditPause'
import Calendar from '../../../../components/NutritionPRO/Calendar'

import { addPause, deletePause, updatePause } from '../../../../api/order'

moment.updateLocale('en', {
  week: { dow: 1 },
})

const PauseDrawer = ({ visible, orderDays, order, update, onClose }) => {
  const [startPause, setStartPause] = useState(null)
  const [endPause, setEndPause] = useState(null)
  const [isSendEmail, setIsSendEmail] = useState(false)
  const [step, setStep] = useState(1)
  const [isEditFormVisible, setIsEditFormVisible] = useState(false)
  const [editData, setEditData] = useState({
    id: '',
    currentEndTimestamp: 0,
    isLast: false,
  })

  const { formatMessage } = useIntl()

  let pauseDays = null
  if (startPause !== null && endPause !== null) {
    pauseDays = Math.abs(moment(startPause).diff(endPause, 'days'))
  }

  const onDisableDate = currentDay => {
    if (startPause && endPause) {
      return currentDay && currentDay !== startPause && currentDay !== endPause
    }
    return (
      (currentDay && currentDay < moment().add(1, 'days')) ||
      (currentDay.day() !== 1 && currentDay.day() !== 3 && currentDay.day() !== 5)
    )
  }

  const onAddPause = async () => {
    try {
      const req = await addPause({
        id: order.id,
        start: startPause.unix(),
        end: endPause.unix(),
        isSendEmail,
      })
      if (req.status === 202) {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'Orders.PauseSuccessfullyCreated!' }),
        })
        clear()
        update()
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

  const onUpdatePause = async (id, newEndTimestamp) => {
    if (id) {
      try {
        const req = await updatePause({
          id,
          end: newEndTimestamp,
        })
        if (req.status === 202) {
          notification.success({
            message: formatMessage({ id: 'global.success' }),
            description: formatMessage({ id: 'Orders.PauseSuccessfullyUpdated!' }),
          })
          clear()
          update()
          editFormVisible({})
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
  }

  const onDeletePause = async pauseId => {
    try {
      const req = await deletePause(pauseId)
      if (req.status === 204) {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'Orders.PauseSuccessfullyRemoved!' }),
        })
        update()
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

  const editFormVisible = data => {
    if (visible) {
      const isLast =
        order.pauses.length === 1 ||
        order.pauses.findIndex(d => d.id === data.id) === order.pauses.length - 1
      setEditData({
        id: data.id,
        end: data.end,
        isLast,
      })
      setIsEditFormVisible(true)
    } else {
      setEditData({
        id: '',
        end: 0,
        isLast: false,
      })
      setIsEditFormVisible(false)
    }
  }

  const onSelectChange = date => {
    if (step === 1) {
      setStartPause(date.utc().startOf('day'))
      setEndPause(null)
      setStep(2)
    } else {
      if (date <= startPause - 2) {
        return
      }
      setEndPause(date.utc().startOf('day'))
      setStep(1)
    }
  }

  const clear = () => {
    setStartPause(null)
    setEndPause(null)
    setStep(1)
  }

  const closeDrawer = () => {
    clear()
    onClose()
  }

  console.log(startPause, endPause)

  return (
    <div>
      <Drawer
        title={`Pauses | User: ${order.user ? order.user.name : '-'}, Order: ${order.id}`}
        width="100%"
        onClose={closeDrawer}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Row gutter={16}>
          <Col xl={12}>
            <Typography.Title level={3} style={{ textAlign: 'center' }}>
              {formatMessage({ id: 'Orders.CurrentPauses' })}
            </Typography.Title>
            <Row gutter={16} className="mb-4">
              <Col sm={24} lg={14}>
                <Calendar highlightedDays={orderDays} />
              </Col>
              <Col sm={24} lg={10}>
                <div className="card">
                  <div className="card-body">
                    <Statistic
                      title={formatMessage({ id: 'Orders.FirstDeliveryDate' })}
                      value={moment.unix(order.orderDays[0]).format('ddd DD.MM.YYYY')}
                    />
                    <Statistic
                      title={formatMessage({ id: 'Orders.LastDeliveryDate' })}
                      value={moment.unix(order.orderDays.slice(-1)[0]).format('ddd DD.MM.YYYY')}
                    />
                    <Statistic
                      title={formatMessage({ id: 'Orders.Size' })}
                      value={order.size === 'short' ? '5 days a week' : '6 days a week'}
                    />
                    <Statistic
                      title={formatMessage({ id: 'Orders.Length' })}
                      value={order.length}
                      suffix="days"
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Typography.Title level={4} style={{ textAlign: 'center' }}>
              {formatMessage({ id: 'Orders.PausesList' })}
            </Typography.Title>
            <PauseList pauses={order.pauses} onDelete={onDeletePause} editMode={editFormVisible} />
          </Col>
          <Col xl={12}>
            <Typography.Title level={3} style={{ textAlign: 'center' }}>
              {formatMessage({ id: 'Orders.SetPause' })}
            </Typography.Title>
            <Row gutter={16} className="mb-4">
              <Col sm={24} lg={14}>
                <Calendar
                  onSelectChange={onSelectChange}
                  onDisableDate={onDisableDate}
                  startPause={startPause}
                  endPause={endPause}
                  isActive
                />
              </Col>
              <Col sm={24} lg={10}>
                <div className="card">
                  <div className="card-body">
                    <Statistic
                      title={formatMessage({ id: 'Orders.StartPause' })}
                      value={startPause ? startPause.format('ddd DD.MM.YYYY') : '---'}
                    />
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <Statistic
                      title={formatMessage({ id: 'Orders.EndPause' })}
                      value={endPause ? endPause.format('ddd DD.MM.YYYY') : '---'}
                    />
                    <span className="mb-1">
                      <small className="text-muted">{`Pause days: ${pauseDays || '---'}`}</small>
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <small>{formatMessage({ id: 'Orders.NotifyCustomer' })}</small>{' '}
                <Switch
                  checked={isSendEmail}
                  onChange={e => setIsSendEmail(e)}
                  style={{ marginRight: '10px' }}
                />
                <Button
                  style={{ width: 150 }}
                  size="large"
                  onClick={onAddPause}
                  type="primary"
                  disabled={!endPause || !startPause || startPause === endPause}
                  className="mr-3"
                >
                  {formatMessage({ id: 'Orders.SetPause' })}
                </Button>
                <Button
                  style={{ width: 150 }}
                  size="large"
                  onClick={clear}
                  type="default"
                  className="mr-3"
                >
                  {formatMessage({ id: 'Orders.Clear' })}
                </Button>
                <Button onClick={closeDrawer} size="large" type="default">
                  {formatMessage({ id: 'Orders.Exit' })}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        <EditPauseForm
          visible={isEditFormVisible}
          editData={editData}
          onCancel={() => setIsEditFormVisible(false)}
          onSave={onUpdatePause}
        />
      </Drawer>
    </div>
  )
}

export default PauseDrawer
