/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Button, Select, DatePicker, Checkbox, notification } from 'antd'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { connect } from 'react-redux'
import SendForm from './sendForm'
import ExremeIngredientsList from './ExremeIngredientsList'
import CompareIngredientList from './CompareIngredientList'
import { getDocument } from '../../../services/document'
import { getAllKitchen } from '../../../api/kitchen'
import {
  sendMenu,
  sendWatchdog,
  getAllowStatus,
  turnAllowStatus,
  getAllowHistory,
  getExtremeIngredients,
  postKitchenApplicationLog,
  getKitchenApplicationLog,
} from '../../../api/document'

import 'moment/locale/ru'

moment.updateLocale('en', {
  week: { dow: 1 },
})

const { Option } = Select
const { RangePicker } = DatePicker

const dateFormat = 'DD.MM.YYYY'

const getTransformedTimestamp = date => {
  return moment(date)
    .utc()
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0)
    .unix()
}

const getPeriodDates = periodCode => {
  const weekDay = moment().isoWeekday()
  const dates = { 1: 0, 2: 0 } // first & second days selected period
  if (Number(periodCode) === 0) {
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
      console.log('Error period 0')
    }
  } else if (Number(periodCode) === 1) {
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
      console.log('Error period 1')
    }
  } else {
    console.log('Error: Invalid period number (code)')
  }

  return dates
}

@injectIntl
@connect(({ document }) => ({ document }))
class GridCard extends React.Component {
  state = {
    startDate: 0,
    endDate: 0,
    period: 0,
    kitchen: '',
    kitchens: [{ id: '' }],
    allow: false,
    allowHistory: [],
    events: false,
    extremeIngredientsVisible: false,
    testLoading: false,
    downloadLoading: {
      ingredient: false,
      production: false,
      techcards: false,
      subTechcards: false,
      delivery: false,
    },
    sendMenuLoading: false,
    sendingWatchdogloading: false,
    data: [],
    applicationStatus: false,
    checkApplicationLoading: false,
    saveApplicationLoading: false,
    compareIngredientsVisible: false,
    compareData: false,
    diffPercent: 0.03,
    isSendNextWeek: false,
  }

  componentDidMount() {
    this.handleChange({ key: 0 }).then(() => {
      getAllKitchen().then(async req => {
        const kitchens = await req.json()
        this.setState({
          kitchens,
          kitchen: kitchens[0].id,
        })
        const { startDate } = this.state
        getAllowStatus(kitchens[0].id, startDate).then(async reqAllow => {
          const allowStatus = await reqAllow.json()
          if (reqAllow.status === 200) {
            this.setState({
              allow: allowStatus.result.allow,
            })
          }
        })
        getAllowHistory(kitchens[0].id).then(async reqAllow => {
          const allowHistory = await reqAllow.json()
          if (reqAllow.status === 200) {
            this.setState({
              allowHistory: allowHistory.result,
            })
          }
        })
      })
    })
  }

  handleChange = async period => {
    await this.setPeriod(period).then(() => {
      if (this.state.period !== 2) {
        const dates = getPeriodDates(period.key)
        this.setState({ startDate: dates[1], endDate: dates[2] })
      }
    })
  }

  turnEvents = async e => {
    this.setState({ events: e.target.checked })
  }

  sendNextWeek = async e => {
    this.setState({ isSendNextWeek: e.target.checked })
  }

  handleChangeCustomPeriod = async period => {
    // const dates = [
    //   getTransformedTimestamp(period[0]),
    //   getTransformedTimestamp(period[1])
    // ]
    const dates = [period[0].unix(), period[1].unix()]
    this.setState({ startDate: dates[0], endDate: dates[1], applicationStatus: false })

    setTimeout(() => {
      const { kitchen, startDate } = this.state
      getAllowStatus(kitchen, startDate).then(async req2 => {
        const settings = await req2.json()
        if (req2.status === 200) {
          this.setState({
            allow: settings.result.allow,
          })
        }
      })
    }, 300)
  }

  setPeriod = async period => {
    this.setState({ period: Number(period.key), applicationStatus: false })
    setTimeout(() => {
      const { kitchen, startDate } = this.state
      if (kitchen) {
        getAllowStatus(kitchen, startDate).then(async req2 => {
          const settings = await req2.json()
          if (req2.status === 200) {
            this.setState({
              allow: settings.result.allow,
            })
          }
        })
      }
    }, 300)
  }

  setKitchen = async kitchen => {
    this.setState({ kitchen: kitchen.key, applicationStatus: false })
    setTimeout(() => {
      const { kitchen: kitchenState, startDate } = this.state
      getAllowStatus(kitchenState, startDate).then(async req2 => {
        const settings = await req2.json()
        if (req2.status === 200) {
          this.setState({
            allow: settings.result.allow,
          })
        }
      })
      getAllowHistory(kitchenState).then(async reqAllow => {
        const allowHistory = await reqAllow.json()
        if (reqAllow.status === 200) {
          this.setState({
            allowHistory: allowHistory.result,
          })
        }
      })
    }, 300)
  }

  saveDocument = async (doc, prop) => {
    const { period, startDate, endDate, kitchen, events } = this.state
    const kitchens = prop === 'all' ? 'all' : kitchen
    const start = moment.unix(startDate).format('DD-MM-YYYY')
    const end = moment.unix(endDate).format('DD-MM-YYYY')
    const event = events
    this.setState(prevState => {
      return {
        downloadLoading: {
          ...prevState.downloadLoading,
          [doc]: true,
        },
      }
    })
    const req = await getDocument(doc, period, kitchens, [start, end], event)
    this.setState(prevState => {
      return {
        downloadLoading: {
          ...prevState.downloadLoading,
          [doc]: false,
        },
      }
    })
  }

  sendMenu = async () => {
    this.setState({ sendMenuLoading: true })
    const { startDate, kitchen } = this.state
    const req = await sendMenu(
      moment
        .unix(startDate)
        .utc()
        .unix(),
      kitchen,
    )
    if (req.status) {
      // const blob = await req.blob()
      // const filename = req.headers.get('Filename')
      // saveAs(blob, `${filename}`)
      const json = await req.json()
      window.open(json.download, '_blank')
      this.setState({ sendMenuLoading: false })
    }
  }

  turnAllow = async () => {
    const { startDate, kitchen } = this.state
    const req = await turnAllowStatus(kitchen, startDate)
    if (req.ok) {
      // const blob = await req.blob()
      // const filename = req.headers.get('Filename')
      // saveAs(blob, `${filename}`)
      getAllowStatus(kitchen, startDate).then(async req2 => {
        const settings = await req2.json()
        if (req2.status === 200) {
          this.setState({
            allow: settings.result.allow,
          })
        }
      })

      getAllowHistory(kitchen).then(async reqAllow => {
        const allowHistory = await reqAllow.json()
        if (reqAllow.status === 200) {
          this.setState({
            allowHistory: allowHistory.result,
          })
        }
      })
    }
  }

  saveApplication = async () => {
    const {
      intl: { formatMessage },
    } = this.props
    this.setState({
      saveApplicationLoading: true,
    })
    const { period, startDate, endDate, kitchen } = this.state
    const dates = [
      moment.unix(startDate).format('DD-MM-YYYY'),
      moment.unix(endDate).format('DD-MM-YYYY'),
    ]
    const req = await postKitchenApplicationLog(period, kitchen, dates)
    if (req.ok) {
      const json = await req.json()
      this.setState({
        applicationStatus: json.result,
      })
      notification.success({
        message: formatMessage({ id: 'SendForm.Saved' }),
      })
    } else {
      notification.error({
        message: `${req.status} - ${req.statusText}`,
      })
    }
    this.setState({
      saveApplicationLoading: false,
    })
  }

  getApplication = async () => {
    this.setState({
      checkApplicationLoading: true,
    })
    const { period, startDate, endDate, kitchen, diffPercent } = this.state
    const dates = [
      moment.unix(startDate).format('DD-MM-YYYY'),
      moment.unix(endDate).format('DD-MM-YYYY'),
    ]
    const req = await getKitchenApplicationLog(period, kitchen, dates, diffPercent)
    if (req.ok) {
      const json = await req.json()
      this.setState({
        applicationStatus: json.result,
        compareData: json.compareData,
      })
    } else {
      notification.error({
        message: `${req.status} - ${req.statusText}`,
      })
    }
    this.setState({
      checkApplicationLoading: false,
    })
  }

  sendWatchdog = async () => {
    this.setState({
      sendingWatchdogloading: true,
    })
    const { startDate, endDate } = this.state
    const req = await sendWatchdog(
      moment.unix(startDate).format('DD-MM-YYYY'),
      moment.unix(endDate).format('DD-MM-YYYY'),
    )
    this.setState({
      sendingWatchdogloading: false,
    })
  }

  showDrawerExtremeIngredients = () => {
    const { period, startDate, endDate, kitchen } = this.state
    const dates = [
      moment.unix(startDate).format('DD-MM-YYYY'),
      moment.unix(endDate).format('DD-MM-YYYY'),
    ]
    this.setState({
      testLoading: true,
    })
    getExtremeIngredients(period, kitchen, dates).then(async req => {
      if (req.ok) {
        const json = await req.json()
        this.setState({
          data: json.result,
        })
        setTimeout(() => {}, 200)
        this.setState({
          extremeIngredientsVisible: true,
        })
      } else {
        notification.warning({
          message: `${req.status} - ${req.statusText}`,
        })
      }
      this.setState({
        testLoading: false,
      })
    })
  }

  onCloseDrawerExtremeIngredients = () => {
    this.setState({
      extremeIngredientsVisible: false,
    })
  }

  drawerCompareIngredients = status => {
    if (status) {
      this.getApplication().then(() => {
        this.setState({
          compareIngredientsVisible: status,
        })
      })
    } else {
      this.setState({
        compareIngredientsVisible: status,
      })
    }
  }

  render() {
    const {
      kitchens,
      kitchen,
      period,
      startDate,
      endDate,
      allow,
      allowHistory,
      events,
      extremeIngredientsVisible,
      data,
      testLoading,
      downloadLoading,
      sendMenuLoading,
      sendingWatchdogloading,
      applicationStatus,
      checkApplicationLoading,
      saveApplicationLoading,
      compareIngredientsVisible,
      compareData,
      isSendNextWeek,
    } = this.state

    const {
      intl: { formatMessage },
    } = this.props

    return (
      <Authorize
        roles={['root', 'admin', 'finance']}
        denied={['Yana', 'Ksenia']}
        redirect
        to="/main"
      >
        <Helmet title="Documents" />
        <div className="row">
          <div className="col-xl-4">
            <div className="card">
              <div className="card-body">
                <h4>{formatMessage({ id: 'SendForm.Kitchen' })}</h4>
                <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                  <Select
                    labelInValue
                    style={{ width: '115px' }}
                    onChange={this.setKitchen}
                    value={{ key: kitchen }}
                    placeholder="Select"
                  >
                    {kitchens.map(k => (
                      <Option key={k.id} value={k.id}>
                        {k.name}
                      </Option>
                    ))}
                  </Select>
                </div>
                <h4>{formatMessage({ id: 'SendForm.Range' })}</h4>
                <div style={{ marginTop: '15px' }}>
                  <Select
                    labelInValue
                    defaultValue={{ key: '0' }}
                    style={{ width: 250 }}
                    onChange={this.handleChange}
                  >
                    <Option value="0">{formatMessage({ id: 'SendForm.FinalOrder' })}</Option>
                    <Option value="1">{formatMessage({ id: 'SendForm.Preorder' })}</Option>
                    <Option value="2">{formatMessage({ id: 'SendForm.CustomRange' })}</Option>
                  </Select>
                </div>
                {this.state.period === 2 && (
                  <div style={{ marginTop: '15px' }}>
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
                      defaultValue={[
                        moment(this.state.startDate * 1000),
                        moment(this.state.endDate * 1000),
                      ]}
                      format={dateFormat}
                      onChange={this.handleChangeCustomPeriod}
                    />
                  </div>
                )}
                <br />
                <Checkbox checked={events} onChange={e => this.turnEvents(e)}>
                  Events
                </Checkbox>
                <Checkbox checked={isSendNextWeek} onChange={e => this.sendNextWeek(e)}>
                  Send next week menu
                </Checkbox>
                <div style={{ marginTop: '15px' }}>
                  <h4>{formatMessage({ id: 'SendForm.SelectedRates' })}</h4>
                  <span>
                    {`${moment(this.state.startDate * 1000).format('DD/MM/YYYY')} -
                    ${moment(this.state.endDate * 1000).format('DD/MM/YYYY')}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="card">
              <div className="card-body">
                <div style={{ marginTop: '15px', marginBottom: '15px', textAlign: 'center' }}>
                  <Button
                    onClick={() => this.turnAllow()}
                    type={allow ? 'danger' : 'primary'}
                    icon="done"
                    size="large"
                    style={{ marginRight: '10px', marginTop: '10px' }}
                  >
                    {!allow
                      ? formatMessage({ id: 'SendForm.OpenAccessToTheKitchen' })
                      : formatMessage({ id: 'SendForm.CloseAccessToTheKitchen' })}
                  </Button>
                </div>
                <div style={{ marginTop: '5px', marginBottom: '15px', textAlign: 'center' }}>
                  {allow && (
                    <p style={{ color: '#46be8a', fontSize: '16px' }}>
                      {formatMessage({ id: 'SendForm.AccessToTheDownloadIsOpen!' })}
                    </p>
                  )}
                  {!allow && (
                    <p style={{ color: '#fb434a', fontSize: '16px' }}>
                      {formatMessage({ id: 'SendForm.AccessToTheDownloadIsClosed!' })}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div style={{ marginTop: '15px', marginBottom: '15px', textAlign: 'center' }}>
                  {!applicationStatus && (
                    <Button
                      onClick={() => this.getApplication()}
                      type="default"
                      size="large"
                      style={{ marginRight: '10px', marginTop: '10px' }}
                      loading={checkApplicationLoading}
                    >
                      {formatMessage({ id: 'SendForm.CheckApplication' })}
                    </Button>
                  )}
                  {applicationStatus && applicationStatus.initialApplication.status && (
                    <Button
                      onClick={() => this.drawerCompareIngredients(true)}
                      type="primary"
                      // size="large"
                      style={{ marginRight: '10px', marginTop: '10px' }}
                      loading={saveApplicationLoading}
                    >
                      {formatMessage({ id: 'SendForm.ComparisonOfIngredients' })}
                    </Button>
                  )}
                  {applicationStatus && !applicationStatus.isCompleted && (
                    <Button
                      onClick={() => this.saveApplication()}
                      type="primary"
                      // size="large"
                      style={{ marginRight: '10px', marginTop: '10px' }}
                      loading={saveApplicationLoading}
                    >
                      {!applicationStatus.initialApplication.status
                        ? formatMessage({ id: 'SendForm.1.SaveInitialApplication' })
                        : formatMessage({ id: 'SendForm.2.SaveFinalApplication' })}
                    </Button>
                  )}
                </div>
                <div style={{ marginTop: '5px', marginBottom: '15px', textAlign: 'center' }}>
                  {applicationStatus && (
                    <p style={{ fontSize: '16px' }}>
                      {formatMessage({ id: 'SendForm.cooking:SPACE' })}{' '}
                      {moment(applicationStatus.cookingDate).format('DD.MM.YYYY')}
                    </p>
                  )}
                  {applicationStatus && applicationStatus.initialApplication.status && (
                    <p style={{ color: '#46be8a', fontSize: '16px' }}>
                      {formatMessage({ id: 'SendForm.InitialApplications:SPACE' })}
                      {moment(applicationStatus.initialApplication.date).format('DD.MM.YYYY HH:mm')}
                    </p>
                  )}
                  {applicationStatus && !applicationStatus.initialApplication.status && (
                    <p style={{ color: '#fb434a', fontSize: '16px' }}>
                      {formatMessage({ id: 'SendForm.InitialApplications:None' })}
                    </p>
                  )}
                  {applicationStatus && applicationStatus.finalApplication.status && (
                    <p style={{ color: '#46be8a', fontSize: '16px' }}>
                      {formatMessage({ id: 'SendForm.FinalApplications:SPACE' })}
                      {moment(applicationStatus.finalApplication.date).format('DD.MM.YYYY HH:mm')}
                    </p>
                  )}
                  {applicationStatus && !applicationStatus.finalApplication.status && (
                    <p style={{ color: '#fb434a', fontSize: '16px' }}>
                      {formatMessage({ id: 'SendForm.FinalApplications:None' })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="card">
              <div className="card-body">
                <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                  <h4>{formatMessage({ id: 'SendForm.History' })}</h4>
                </div>
                <div style={{ marginTop: '5px', marginBottom: '15px', textAlign: 'center' }}>
                  {allowHistory.map(record => (
                    <p style={{ fontSize: '16px' }} key={Math.random()}>
                      [{moment(record.date).format('DD.MM.YY HH:mm')}]{' '}
                      {moment.unix(record.timestamp).format('DD.MM.YY')} -{' '}
                      {moment
                        .unix(record.timestamp)
                        .add(1, 'days')
                        .format('DD.MM.YY')}{' '}
                      |{' '}
                      {record.allow ? (
                        <span style={{ color: '#46be8a' }}>
                          {formatMessage({ id: 'SendForm.Open' })}
                        </span>
                      ) : (
                        <span style={{ color: '#fb434a' }}>
                          {formatMessage({ id: 'SendForm.Closed' })}
                        </span>
                      )}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-6">
            <div className="card">
              <div className="card-body">
                <h4>{formatMessage({ id: 'SendForm.Download' })}</h4>
                <div style={{ marginTop: '5px', marginBottom: '15px' }}>
                  <Button
                    onClick={() => this.saveDocument('ingredient')}
                    type="primary"
                    icon="download"
                    size="default"
                    loading={downloadLoading.ingredient}
                    style={{ marginRight: '10px', marginTop: '10px' }}
                  >
                    {formatMessage({ id: 'SendForm.Ingredients' })}
                  </Button>
                  <Button
                    onClick={() => this.saveDocument('production')}
                    type="primary"
                    icon="download"
                    size="default"
                    loading={downloadLoading.production}
                    style={{ marginRight: '10px', marginTop: '10px' }}
                  >
                    {formatMessage({ id: 'SendForm.Application' })}
                  </Button>
                  <Button
                    onClick={() => this.saveDocument('techcards')}
                    type="primary"
                    icon="download"
                    size="default"
                    loading={downloadLoading.techcards}
                    style={{ marginRight: '10px', marginTop: '10px' }}
                  >
                    {formatMessage({ id: 'SendForm.Techcards(dishes)' })}
                  </Button>
                  <Button
                    onClick={() => this.saveDocument('subTechcards')}
                    type="primary"
                    icon="download"
                    size="default"
                    loading={downloadLoading.subTechcards}
                    style={{ marginRight: '10px', marginTop: '10px' }}
                  >
                    {formatMessage({ id: 'SendForm.Techcards(semis)' })}
                  </Button>
                  <Button
                    onClick={() => this.saveDocument('delivery')}
                    type="primary"
                    icon="download"
                    size="default"
                    loading={downloadLoading.delivery}
                    style={{ marginRight: '10px', marginTop: '10px' }}
                  >
                    {formatMessage({ id: 'SendForm.DeliveryList' })}
                  </Button>
                  <Button
                    onClick={this.sendMenu}
                    type="primary"
                    icon="download"
                    size="default"
                    loading={sendMenuLoading}
                    style={{ marginRight: '10px', marginTop: '10px' }}
                  >
                    {formatMessage({ id: 'SendForm.Menu' })}
                  </Button>
                  <Button
                    onClick={this.sendWatchdog}
                    type="primary"
                    icon="download"
                    size="default"
                    loading={sendingWatchdogloading}
                    style={{ marginRight: '10px', marginTop: '10px' }}
                  >
                    {formatMessage({ id: 'SendForm.Errors' })}
                  </Button>
                </div>
                <h4>{formatMessage({ id: 'SendForm.Test' })}</h4>
                <div style={{ marginTop: '5px', marginBottom: '15px' }}>
                  <Button
                    onClick={() => this.showDrawerExtremeIngredients()}
                    type="primary"
                    size="default"
                    loading={testLoading}
                    style={{ marginRight: '10px', marginTop: '10px' }}
                  >
                    {formatMessage({ id: 'SendForm.ExtremIngredients' })}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="card">
              <div className="card-body">
                <SendForm params={{ period, startDate, endDate, kitchen, isSendNextWeek }} />
              </div>
            </div>
          </div>
        </div>
        <ExremeIngredientsList
          data={data}
          visible={extremeIngredientsVisible}
          onClose={this.onCloseDrawerExtremeIngredients}
        />
        <CompareIngredientList
          initialIngredients={
            applicationStatus ? applicationStatus.initialApplication.ingredients : []
          }
          finalIngredients={applicationStatus ? applicationStatus.finalApplication.ingredients : []}
          visible={compareIngredientsVisible}
          compareData={compareData}
          onClose={() => this.drawerCompareIngredients(false)}
        />
      </Authorize>
    )
  }
}

export default GridCard
