import React, { useState } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import moment from 'moment'
import { Spin, notification, Row, Col, Statistic, Button, Divider } from 'antd'
import { getNumberOfOrders } from '../../../../../api/dashboard'

function NumberOfOrders({ intl }) {
  const [days, setDays] = useState([])
  const [pastDays, setPastDays] = useState([])
  const [loading, setLoading] = useState(false)
  const [pastLoaded, setPastLoaded] = useState(false)
  const [loadByKitchens, setLoadByKitchens] = useState(false)
  const [loadByKitchensPast, setLoadByKitchensPast] = useState(false)
  const [NumberOfOrdersLoaded, setNumberOfOrdersLoaded] = useState(false)

  const update = () => {
    const { formatMessage } = intl
    setLoading(true)
    getNumberOfOrders('').then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        setDays(json.result.future)
        setLoading(false)
        setNumberOfOrdersLoaded(true)
      } else {
        setLoading(false)
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    })
  }

  const loadPast = () => {
    const { formatMessage } = intl
    setLoading(true)
    getNumberOfOrders('past').then(async req => {
      if (req.status === 200) {
        const json = await req.json()

        setPastDays(json.result.past)
        setLoading(false)
        setPastLoaded(true)
      } else {
        setLoading(false)
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    })
  }

  const loadByKitchen = (time = 'future') => {
    if (time === 'past') {
      setLoadByKitchensPast(true)
    } else {
      setLoadByKitchens(true)
    }
  }

  return (
    <div className="row">
      <div className="col-xl-12">
        <center>
          <Divider style={{ marginBottom: '30px' }}>
            <Button loading={loading} onClick={update}>
              {!NumberOfOrdersLoaded ? (
                <FormattedMessage id="NumberOfOrders.Load" />
              ) : (
                <FormattedMessage id="NumberOfOrders.Refresh" />
              )}
            </Button>
          </Divider>
        </center>
        {NumberOfOrdersLoaded && (
          <Spin spinning={loading}>
            {!pastLoaded && (
              <center>
                <Button onClick={loadPast}>
                  <FormattedMessage id="NumberOfOrders.LoadPastDays" />
                </Button>
              </center>
            )}
            {pastLoaded && (
              <Divider>
                <FormattedMessage id="NumberOfOrders.AllKitchens" />
              </Divider>
            )}
            <Row gutter={16}>
              {pastLoaded &&
                // eslint-disable-next-line array-callback-return
                pastDays.map(day => {
                  if (moment(day.isoDate).isoWeekday() !== 7) {
                    return (
                      <Col key={Math.random()} md={2} sm={12}>
                        <Statistic
                          key={day.key}
                          title={moment(day.isoDate).format('DD.MM.YY')}
                          value={day.users}
                          valueStyle={{ color: 'grey' }}
                        />
                      </Col>
                    )
                  }
                })}
            </Row>
            {pastLoaded && !loadByKitchensPast && (
              <center>
                <Button onClick={() => loadByKitchen('past')}>
                  <FormattedMessage id="NumberOfOrders.LoadByKitchen" />
                </Button>
              </center>
            )}
            {loadByKitchensPast && (
              <>
                <Divider>{pastDays.length > 0 ? pastDays[0].kitchens[0].name : ''}</Divider>
                <Row gutter={16}>
                  {// eslint-disable-next-line array-callback-return
                  pastDays.map(day => {
                    if (moment(day.isoDate).isoWeekday() !== 7) {
                      return (
                        <Col key={Math.random()} md={2} sm={12}>
                          <Statistic
                            key={Math.random()}
                            title={moment(day.isoDate).format('DD.MM.YY')}
                            value={day.kitchens ? day.kitchens[0].total : 0}
                          />
                        </Col>
                      )
                    }
                  })}
                </Row>
                <Divider>{pastDays.length > 0 ? pastDays[0].kitchens[1].name : ''}</Divider>
                <Row gutter={16}>
                  {// eslint-disable-next-line array-callback-return
                  pastDays.map(day => {
                    if (moment(day.isoDate).isoWeekday() !== 7) {
                      return (
                        <Col key={Math.random()} md={2} sm={12}>
                          <Statistic
                            key={Math.random()}
                            title={moment(day.isoDate).format('DD.MM.YY')}
                            value={day.kitchens ? day.kitchens[1].total : 0}
                          />
                        </Col>
                      )
                    }
                  })}
                </Row>
              </>
            )}
            <Divider>
              <FormattedMessage id="NumberOfOrders.AllKitchens" />
            </Divider>
            <Row gutter={16}>
              {// eslint-disable-next-line array-callback-return
              days.map(day => {
                if (moment(day.isoDate).isoWeekday() !== 7) {
                  return (
                    <Col key={Math.random()} md={2} sm={12}>
                      <Statistic
                        key={day.key}
                        title={moment(day.isoDate).format('DD.MM.YY')}
                        value={day.users}
                      />
                    </Col>
                  )
                }
              })}
            </Row>
            {!loadByKitchens && (
              <center>
                <Button onClick={loadByKitchen}>
                  <FormattedMessage id="NumberOfOrders.LoadByKitchen" />
                </Button>
              </center>
            )}
            {loadByKitchens && (
              <>
                <Divider>{days.length > 0 ? days[0].kitchens[0].name : ''}</Divider>
                <Row gutter={16}>
                  {// eslint-disable-next-line array-callback-return
                  days.map(day => {
                    if (moment(day.isoDate).isoWeekday() !== 7) {
                      return (
                        <Col key={Math.random()} md={2} sm={12}>
                          <Statistic
                            key={Math.random()}
                            title={moment(day.isoDate).format('DD.MM.YY')}
                            value={day.kitchens ? day.kitchens[0].total : 0}
                          />
                        </Col>
                      )
                    }
                  })}
                </Row>
                <Divider>{days.length > 0 ? days[0].kitchens[1].name : ''}</Divider>
                <Row gutter={16}>
                  {// eslint-disable-next-line array-callback-return
                  days.map(day => {
                    if (moment(day.isoDate).isoWeekday() !== 7) {
                      return (
                        <Col key={Math.random()} md={2} sm={12}>
                          <Statistic
                            key={Math.random()}
                            title={moment(day.isoDate).format('DD.MM.YY')}
                            value={day.kitchens ? day.kitchens[1].total : 0}
                          />
                        </Col>
                      )
                    }
                  })}
                </Row>
                {days[0].kitchens.length > 2 && (
                  <>
                    <Divider>{days.length > 0 ? days[0].kitchens[2].name : ''}</Divider>
                    <Row gutter={16}>
                      {// eslint-disable-next-line array-callback-return
                      days.map(day => {
                        if (moment(day.isoDate).isoWeekday() !== 7) {
                          return (
                            <Col key={Math.random()} md={2} sm={12}>
                              <Statistic
                                key={Math.random()}
                                title={moment(day.isoDate).format('DD.MM.YY')}
                                value={day.kitchens ? day.kitchens[2].total : 0}
                              />
                            </Col>
                          )
                        }
                      })}
                    </Row>
                  </>
                )}
                {days[0].kitchens.length > 3 && (
                  <>
                    <Divider>{days.length > 0 ? days[0].kitchens[3].name : ''}</Divider>
                    <Row gutter={16}>
                      {// eslint-disable-next-line array-callback-return
                      days.map(day => {
                        if (moment(day.isoDate).isoWeekday() !== 7) {
                          return (
                            <Col key={Math.random()} md={2} sm={12}>
                              <Statistic
                                key={Math.random()}
                                title={moment(day.isoDate).format('DD.MM.YY')}
                                value={day.kitchens ? day.kitchens[3].total : 0}
                              />
                            </Col>
                          )
                        }
                      })}
                    </Row>
                  </>
                )}
                {days[0].kitchens.length > 4 && (
                  <>
                    <Divider>{days.length > 0 ? days[0].kitchens[4].name : ''}</Divider>
                    <Row gutter={16}>
                      {// eslint-disable-next-line array-callback-return
                      days.map(day => {
                        if (moment(day.isoDate).isoWeekday() !== 7) {
                          return (
                            <Col key={Math.random()} md={2} sm={12}>
                              <Statistic
                                key={Math.random()}
                                title={moment(day.isoDate).format('DD.MM.YY')}
                                value={day.kitchens ? day.kitchens[4].total : 0}
                              />
                            </Col>
                          )
                        }
                      })}
                    </Row>
                  </>
                )}
              </>
            )}
          </Spin>
        )}
      </div>
    </div>
  )
}

export default injectIntl(NumberOfOrders)
