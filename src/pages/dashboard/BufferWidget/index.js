import React, { useState, useEffect } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import moment from 'moment'
import { Button, Select, DatePicker, Row, Col, InputNumber, notification } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import ProductionBufferList from 'components/NutritionPRO/ProductionBufferList'
import ProductionBufferHistory from 'components/NutritionPRO/ProductionBufferHistory'
import { getAllKitchen } from '../../../api/kitchen'
import { getBufferList, getBuffer, postBuffer } from '../../../api/productionBuffer'

const { Option } = Select

moment.updateLocale('en', {
  week: { dow: 1 },
})

function BufferWidget() {
  const [kitchen, setKitchen] = useState('')
  const [kitchens, setKitchens] = useState([])
  const [date, setDate] = useState(moment().add(1, 'days'))
  const [bufferValue, setBufferValue] = useState(5)
  const [bufferList, setBufferList] = useState([])
  const [historyId, setHistoryId] = useState(0)
  const [newBufferInfo, setNewBufferInfo] = useState({
    status: false,
    currentValue: 0,
    maxValue: 0,
    currentBuffer: 0,
  })
  const [loadingBufferList, setLoadingBufferList] = useState(true)

  useEffect(() => {
    getAllKitchen().then(async req => {
      const res = await req.json()
      setKitchens(res)
      setKitchen(res[0].id)
    })
    getBufferList().then(async req => {
      const res = await req.json()
      setBufferList(res.result || [])
      setLoadingBufferList(false)
    })
  }, [])

  const handleChangeDate = async d => {
    setDate(d)
    setNewBufferInfo({
      status: false,
      currentValue: 0,
      maxValue: 0,
      currentBuffer: 0,
    })
  }

  const handleChangeBuffer = async e => {
    setBufferValue(e)
  }

  const loadHistory = async i => {
    setHistoryId(i)
  }

  const asignKitchen = async k => {
    setKitchen(k.key)
    setNewBufferInfo({
      status: false,
      currentValue: 0,
      maxValue: 0,
      currentBuffer: 0,
    })
  }

  const create = async () => {
    if (newBufferInfo.status) {
      const body = {
        date: date.format('DD-MM-YYYY'),
        kitchen,
        buffer: bufferValue,
      }
      await postBuffer(body).then(async req => {
        if (req.ok) {
          setNewBufferInfo({
            status: false,
            currentValue: 0,
            maxValue: 0,
            currentBuffer: 0,
          })
          getBufferList().then(async req2 => {
            const res = await req2.json()
            setBufferList(res.result || [])
            setLoadingBufferList(false)
          })
          notification.success({
            message: <FormattedMessage id="BufferWidget.Created" />,
            description: req.statusText,
          })
        } else {
          notification.error({
            message: <FormattedMessage id="global.error" />,
            description: req.statusText,
          })
        }
      })
    } else {
      notification.error({
        message: <FormattedMessage id="BufferWidget.ItIsNotPossibleToCreateABufferForThisDay" />,
        description: (
          <FormattedMessage id="BufferWidget.TheBufferIsAlreadyCreatedOrYouDidntCheckIt" />
        ),
      })
    }
  }

  const checkBuffer = async () => {
    await getBuffer(date.format('DD-MM-YYYY'), kitchen).then(async req => {
      if (req.ok) {
        const res = await req.json()
        setNewBufferInfo(res.result)
      } else {
        notification.error({
          message: <FormattedMessage id="global.error" />,
          description: req.statusText,
        })
      }
    })
  }

  return (
    <Authorize roles={['root', 'admin', 'salesDirector', 'sales']}>
      <Row gutter={16}>
        <Col span={10}>
          <div className="card card--fullHeight">
            <div className="card-header">
              <div className="utils__title">
                <strong>{<FormattedMessage id="BufferWidget.BuffersList" />}</strong>
              </div>
            </div>
            <div className="card-body">
              <ProductionBufferList
                data={bufferList}
                loadHistory={loadHistory}
                loading={loadingBufferList}
              />
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="card card--fullHeight">
            <div className="card-header">
              <div className="utils__title">
                <strong>{<FormattedMessage id="BufferWidget.History" />}</strong>
              </div>
            </div>
            <div className="card-body">
              <ProductionBufferHistory
                data={bufferList.length > 0 ? bufferList[historyId].history : []}
              />
            </div>
          </div>
        </Col>

        <Col span={6}>
          <div className="card card--fullHeight">
            <div className="card-header">
              <div className="utils__title">
                <strong>{<FormattedMessage id="BufferWidget.NewBuffer" />}</strong>
              </div>
            </div>
            <div className="card-body">
              <Row gutter={16}>
                <Col md={24} xl={12}>
                  <h4>{<FormattedMessage id="BufferWidget.Kitchen" />}</h4>
                  <div style={{ marginTop: '10px', marginBottom: '15px' }}>
                    <Select
                      labelInValue
                      style={{ width: '115px' }}
                      onChange={asignKitchen}
                      value={{ key: kitchen }}
                      placeholder={<FormattedMessage id="BufferWidget.Select" />}
                    >
                      {kitchens.map(k => (
                        <Option key={k.id} value={k.id}>
                          {k.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col md={24} xl={12}>
                  <h4>
                    <FormattedMessage id="global.date" />
                  </h4>
                  <div style={{ marginTop: '10px', marginBottom: '5px' }}>
                    <DatePicker
                      value={date}
                      format="DD.MM.YYYY"
                      onChange={handleChangeDate}
                      style={{ width: '100%' }}
                      disabledDate={currentDay =>
                        currentDay < moment() ||
                        (currentDay.day() !== 1 && currentDay.day() !== 3 && currentDay.day() !== 5)
                      }
                    />
                  </div>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col md={24} xl={12}>
                  <h4>
                    <FormattedMessage id="BufferWidget.Days" />
                  </h4>
                  <div style={{ marginTop: '10px', marginBottom: '5px' }}>
                    <InputNumber
                      value={bufferValue}
                      onChange={handleChangeBuffer}
                      min={0}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                <Col md={24} xl={12}>
                  <h4>
                    <FormattedMessage id="BufferWidget.Info" />
                  </h4>
                  <div style={{ marginTop: '10px', marginBottom: '5px' }}>
                    {newBufferInfo.currentValue === 0 && 'Check it!'}
                    {newBufferInfo.currentValue !== 0 &&
                      newBufferInfo.maxValue !== 0 &&
                      `Orders: ${newBufferInfo.currentValue}/${newBufferInfo.maxValue} | Buffer: ${newBufferInfo.currentBuffer}`}
                    {newBufferInfo.currentValue !== 0 &&
                      newBufferInfo.maxValue === 0 &&
                      `Orders: ${newBufferInfo.currentValue} | Buffer: none`}
                  </div>
                </Col>
              </Row>
              {!newBufferInfo.status && (
                <Button type="default" onClick={checkBuffer} style={{ width: '100%' }}>
                  <FormattedMessage id="BufferWidget.CHECKDATE" />
                </Button>
              )}
              {newBufferInfo.status && (
                <Button
                  type="primary"
                  onClick={create}
                  style={{ width: '100%' }}
                  disabled={newBufferInfo.maxValue !== 0}
                >
                  {newBufferInfo.maxValue === 0 ? (
                    <FormattedMessage id="BufferWidget.CREATEBUFFER" />
                  ) : (
                    <FormattedMessage id="BufferWidget.UPDATEBUFFER" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Authorize>
  )
}

export default injectIntl(BufferWidget)
