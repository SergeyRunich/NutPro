import React, { useState, useEffect, useCallback } from 'react'
import { useIntl } from 'react-intl'
import moment from 'moment'
import { Button, Select, DatePicker, Modal, Row, Col, Progress } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { getAllKitchen } from '../../../../../api/kitchen'

const { Option } = Select
const { RangePicker } = DatePicker

function RegenerationWidget({ startErpRegeneration, regenerationData, visible, onCancel }) {
  const [period, setPeriod] = useState(0)
  const [kitchen, setKitchen] = useState('all')
  const [kitchens, setKitchens] = useState([])
  const [startDate, setStartDate] = useState(0)
  const [endDate, setEndDate] = useState(0)
  const [onRegen, setOnRegen] = useState(false)

  const intl = useIntl()
  const { formatMessage } = intl

  moment.updateLocale('en', {
    week: { dow: 1 },
  })
  const getTransformedTimestamp = date => {
    return moment(date)
      .utc()
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0)
      .unix()
  }

  const getPeriodDates = useCallback(periodCode => {
    const weekDay = moment().isoWeekday()
    const dates = { 1: 0, 2: 0 } // first & second days selected period
    if (Number(periodCode) === 0) {
      if ([2, 5, 7].indexOf(weekDay) !== -1) {
        dates[1] = getTransformedTimestamp(moment().add(3, 'days'))
        dates[2] = getTransformedTimestamp(moment().add(4, 'days'))
      } else if ([1, 3, 6].indexOf(weekDay) !== -1) {
        dates[1] = getTransformedTimestamp(moment().add(2, 'days'))
        dates[2] = getTransformedTimestamp(moment().add(3, 'days'))
      } else if ([4].indexOf(weekDay) !== -1) {
        dates[1] = getTransformedTimestamp(moment().add(4, 'days'))
        dates[2] = getTransformedTimestamp(moment().add(5, 'days'))
      } else {
        console.log('Error period 0')
      }
    } else if (Number(periodCode) === 1) {
      if ([5, 6, 7].indexOf(weekDay) !== -1) {
        dates[1] = getTransformedTimestamp(moment().add(3 - [5, 6, 7].indexOf(weekDay), 'days'))
        dates[2] = getTransformedTimestamp(moment().add(4 - [5, 6, 7].indexOf(weekDay), 'days'))
      } else if ([1, 2].indexOf(weekDay) !== -1) {
        dates[1] = getTransformedTimestamp(moment().add(2 - [1, 2].indexOf(weekDay), 'days'))
        dates[2] = getTransformedTimestamp(moment().add(3 - [1, 2].indexOf(weekDay), 'days'))
      } else if ([3, 4].indexOf(weekDay) !== -1) {
        dates[1] = getTransformedTimestamp(moment().add(2 - [3, 4].indexOf(weekDay), 'days'))
        dates[2] = getTransformedTimestamp(moment().add(3 - [3, 4].indexOf(weekDay), 'days'))
      } else {
        console.log('Error period 1')
      }
    } else if (Number(periodCode) === 2) {
      if ([5, 6, 7].indexOf(weekDay) !== -1) {
        dates[1] = getTransformedTimestamp(moment().add(5 - [5, 6, 7].indexOf(weekDay), 'days'))
        dates[2] = getTransformedTimestamp(moment().add(6 - [5, 6, 7].indexOf(weekDay), 'days'))
      } else if ([1, 2].indexOf(weekDay) !== -1) {
        dates[1] = getTransformedTimestamp(moment().add(4 - [1, 2].indexOf(weekDay), 'days'))
        dates[2] = getTransformedTimestamp(moment().add(5 - [1, 2].indexOf(weekDay), 'days'))
      } else if ([3, 4].indexOf(weekDay) !== -1) {
        dates[1] = getTransformedTimestamp(moment().add(5 - [3, 4].indexOf(weekDay), 'days'))
        dates[2] = getTransformedTimestamp(moment().add(6 - [3, 4].indexOf(weekDay), 'days'))
      } else {
        console.log('Error period 2')
      }
    } else {
      console.log('Error: Invalid period number (code)')
    }

    return dates
  }, [])

  const handleChangePeriod = useCallback(
    newPeriod => {
      setPeriod(newPeriod.key)
      if (newPeriod.key !== 3) {
        const dates = getPeriodDates(newPeriod.key)
        setStartDate(dates[1])
        setEndDate(dates[2])
      }
    },
    [getPeriodDates],
  )

  useEffect(() => {
    handleChangePeriod({ key: 0 })
    getAllKitchen().then(async req => {
      const res = await req.json()
      setKitchens(res)
    })
  }, [handleChangePeriod])

  const handleChangeCustomPeriod = async current => {
    const dates = [current[0].unix(), current[1].unix()]
    setStartDate(dates[0])
    setEndDate(dates[1])
  }

  const asignKitchen = async current => {
    setKitchen(current.key)
  }

  const startRegen = async () => {
    const req = await startErpRegeneration(kitchen, period, { start: startDate, end: endDate })
    if (req.status === 200) {
      setOnRegen(true)
      checkRegen()
    }
  }

  const checkRegen = () => {
    setInterval(() => {
      if (!regenerationData.status) {
        setOnRegen(false)
      }
    }, 30000)
  }

  return (
    <Authorize roles={['root', 'admin']} users={['Vitaly']}>
      <Modal
        visible={visible}
        title={formatMessage({ id: 'RegenerationWidget.ERPRegeneration' })}
        okText={formatMessage({ id: 'RegenerationWidget.OK' })}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        cancelText={formatMessage({ id: 'RegenerationWidget.Close' })}
        onCancel={onCancel}
        onOk={onCancel}
      >
        {regenerationData.status && (
          <div className="col-xl-12">
            <h4>{formatMessage({ id: 'RegenerationWidget.REGENERATIONINPROGRESS' })}</h4>
            <Progress percent={regenerationData.progress.percent} />
            <center>
              <p>
                {regenerationData.progress.current} / {regenerationData.progress.total}
              </p>
            </center>
            <center>
              <p>
                {formatMessage({ id: 'RegenerationWidget.StartTime' })}{' '}
                {moment.unix(regenerationData.timestamp).format('DD.MM.YYYY HH:mm')} (
                {moment.unix(regenerationData.timestamp).fromNow()})
              </p>
            </center>

            <hr />
          </div>
        )}
        {!regenerationData.status && (
          <div className="col-xl-12">
            <center>
              <p>
                {formatMessage({ id: 'RegenerationWidget.LastRegenerationSPACE' })}{' '}
                {moment.unix(regenerationData.timestamp).fromNow()}
              </p>
            </center>
            <hr />
          </div>
        )}
        <Row gutter={16}>
          <Col span={12}>
            <h4>{formatMessage({ id: 'RegenerationWidget.Kitchen' })}</h4>
            <div style={{ marginTop: '15px', marginBottom: '15px' }}>
              <Select
                labelInValue
                style={{ width: '100%' }}
                onChange={asignKitchen}
                value={{ key: kitchen }}
                placeholder={formatMessage({ id: 'RegenerationWidget.Select' })}
              >
                <Option key="all" value="all">
                  {formatMessage({ id: 'RegenerationWidget.All' })}
                </Option>
                {kitchens.map(k => (
                  <Option key={k.id} value={k.id}>
                    {k.name}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <h4>{formatMessage({ id: 'RegenerationWidget.Range' })}</h4>
            <div style={{ marginTop: '15px' }}>
              <Select
                labelInValue
                defaultValue={{ key: 0 }}
                style={{ width: '100%' }}
                onChange={handleChangePeriod}
              >
                <Option value={0}>{formatMessage({ id: 'RegenerationWidget.Default' })}</Option>
                <Option value={1}>{formatMessage({ id: 'RegenerationWidget.FinalOrder' })}</Option>
                <Option value={2}>{formatMessage({ id: 'RegenerationWidget.Preorder' })}</Option>
                <Option value={3}>{formatMessage({ id: 'RegenerationWidget.CustomRange' })}</Option>
              </Select>
            </div>
            {period === 3 && (
              <div style={{ marginTop: '15px', marginBottom: '5px' }}>
                <RangePicker
                  ranges={{
                    'Previous Month': [
                      moment()
                        .subtract(1, 'month')
                        .startOf('month'),
                      moment()
                        .subtract(1, 'month')
                        .endOf('month'),
                    ],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                  }}
                  defaultValue={[moment.unix(startDate), moment.unix(endDate)]}
                  format="DD.MM.YYYY"
                  onChange={handleChangeCustomPeriod}
                />
              </div>
            )}
          </Col>
        </Row>
        <p style={{ fontSize: '16px' }}>
          <center>
            {moment.unix(startDate).format('DD.MM.YYYY')} -{' '}
            {period === 0 ? '∞' : moment.unix(endDate).format('DD.MM.YYYY')}
          </center>
        </p>

        <Button
          disabled={regenerationData.status || onRegen || startDate - moment().unix() <= 84600}
          type="primary"
          onClick={startRegen}
          style={{ width: '100%' }}
        >
          {formatMessage({ id: 'RegenerationWidget.StartERPRegeneration' })}
        </Button>
      </Modal>
    </Authorize>
  )
}

export default RegenerationWidget
