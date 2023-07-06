import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Button, Table, notification, Select, DatePicker, Row, Col, Spin } from 'antd'
import { Helmet } from 'react-helmet'
import StatisticCard from 'components/NutritionPRO/StatisticCard'
import ProductionBufferWidget from 'components/NutritionPRO/ProductionBuffer'
import Authorize from 'components/LayoutComponents/Authorize'
import ChartistGraph from 'react-chartist'
import ChartistTooltip from 'chartist-plugin-tooltips-updated'
import GeneratedMacro from './components/GeneratedMacro'
import OrderList from './components/OrderList'
import { getCompareData } from '../../../api/dashboard'
import GeneratedOrderList from './components/GeneratedOrderList'

moment.updateLocale('en', {
  week: { dow: 1 },
})

const { Option } = Select
const { RangePicker } = DatePicker

const supportCasesPieOptions = {
  donut: true,
  donutWidth: 35,
  showLabel: false,
  plugins: [
    ChartistTooltip({
      anchorToPoint: false,
      appendToBody: true,
      seriesName: false,
    }),
  ],
}

@injectIntl
class DashboardKitchen extends React.Component {
  state = {
    period: 0,
    dates: ['', ''],
    kcalError: true,
    cookingData: {
      firstDay: {
        timestamp: 0,
        kitchens: [
          {
            name: '',
            total: 0,
            reserve: 0,
            pickupPoint: 0,
            shouldBe: 0,
          },
          {
            name: '',
            total: 0,
            reserve: 0,
            pickupPoint: 0,
            shouldBe: 0,
          },
        ],
        shouldBe: [],
        generated: [],
        totalShouldBe: 0,
        totalGenerated: 0,
        shouldBeUsers: [],
        generatedUsers: [],
        usersShouldBe: 0,
        usersGenerated: 0,
        reserve: 0,
        pickupPoint: 0,
        errors: {
          missingOrders: [],
          extraOrders: [],
          missingMeals: [],
          extraMeals: [],
          meals: [],
          macro: {
            max5: {
              data: [],
              total: 0,
            },
            max10: {
              data: [],
              total: 0,
            },
            max15: {
              data: [],
              total: 0,
            },
            max20: {
              data: [],
              total: 0,
            },
            other: {
              data: [],
              total: 0,
            },
            total: 0,
          },
        },
      },
      secondDay: {
        timestamp: 0,
        kitchens: [
          {
            name: '',
            total: 0,
            reserve: 0,
            pickupPoint: 0,
            shouldBe: 0,
          },
          {
            name: '',
            total: 0,
            reserve: 0,
            pickupPoint: 0,
            shouldBe: 0,
          },
        ],
        shouldBe: [],
        generated: [],
        totalShouldBe: 0,
        totalGenerated: 0,
        shouldBeUsers: [],
        generatedUsers: [],
        usersShouldBe: 0,
        usersGenerated: 0,
        reserve: 0,
        pickupPoint: 0,
        errors: {
          missingOrders: [],
          extraOrders: [],
          missingMeals: [],
          extraMeals: [],
          meals: [],
          macro: {
            max5: {
              data: [],
              total: 0,
            },
            max10: {
              data: [],
              total: 0,
            },
            max15: {
              data: [],
              total: 0,
            },
            max20: {
              data: [],
              total: 0,
            },
            other: {
              data: [],
              total: 0,
            },
            total: 0,
          },
        },
      },
      totalCooking: 0,
    },
    macroVisible: false,
    loading: true,
  }

  constructor(props) {
    super(props)

    this.onCheck = this.onCheck.bind(this)
  }

  componentDidMount() {
    const { period, dates, kcalError } = this.state
    const {
      intl: { formatMessage },
    } = this.props
    getCompareData(period, dates, kcalError).then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        this.setState({
          cookingData: json,
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
      this.setState({
        loading: false,
      })
    })
  }

  onCheck() {
    const { period, dates, kcalError } = this.state
    const {
      intl: { formatMessage },
    } = this.props
    this.setState({
      loading: true,
    })
    getCompareData(period, dates, kcalError).then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        this.setState({
          cookingData: json,
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
      this.setState({
        loading: false,
      })
    })
  }

  onChangeField(e, field) {
    if (e !== null && e.target) {
      if (e.target.type === 'checkbox') {
        this.setState({
          [field]: e.target.checked,
        })
      } else {
        this.setState({
          [field]: e.target.value,
        })
      }
    } else {
      this.setState({
        [field]: e,
      })
    }
  }

  disabledDate = current => {
    const { dates } = this.state
    if (!dates[0] || dates.length === 0) {
      return false
    }
    const tooLate =
      moment(dates[0], 'DD-MM-YYYY') && current.diff(moment(dates[0], 'DD-MM-YYYY'), 'days') > 1
    const tooEarly =
      moment(dates[1], 'DD-MM-YYYY') && moment(dates[1], 'DD-MM-YYYY').diff(current, 'days') > 1
    return tooEarly || tooLate
  }

  showDrawerMacro = () => {
    this.setState({
      macroVisible: true,
    })
  }

  onCloseDrawerMacro = () => {
    this.setState({
      macroVisible: false,
    })
  }

  handleChangeCustomPeriod = async period => {
    const dates = [period[0].format('DD-MM-YYYY'), period[1].format('DD-MM-YYYY')]
    this.setState({ dates })
  }

  handleChangeCalendar = async value => {
    const value2 = value[1] ? value[1].format('DD-MM-YYYY') : ''
    this.setState({ dates: [value[0].format('DD-MM-YYYY'), value2] })
  }

  handleChangePeriod = async period => {
    this.setState({ period: period.key })
  }

  render() {
    const { cookingData, macroVisible, period, loading, kcalError } = this.state
    const {
      intl: { formatMessage },
    } = this.props
    const supportCasesTableColumns = [
      {
        title: formatMessage({ id: 'KitchenDashboard.Range' }),
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: formatMessage({ id: 'KitchenDashboard.Amount' }),
        key: 'amount',
        dataIndex: 'amount',
        render: amount => {
          return <span className="text-primary font-weight-bold">{amount}</span>
        },
      },
    ]

    const usersGenerated = [0, 0]
    if (cookingData.firstDay.reserve > 0) {
      usersGenerated[0] += 1
    }

    if (cookingData.firstDay.pickupPoint > 0) {
      usersGenerated[0] += 1
    }

    if (cookingData.secondDay.reserve > 0) {
      usersGenerated[1] += 1
    }

    if (cookingData.secondDay.pickupPoint > 0) {
      usersGenerated[1] += 1
    }

    return (
      <Authorize roles={['admin', 'root', 'salesDirector']} users={['Vitaly']} redirect to="/main">
        <Helmet title={formatMessage({ id: 'KitchenDashboard.DashboardKitchen' })} />
        <div className="row">
          <div className="col-xl-12">
            <div className="card card--fullHeight">
              <div className="card-body">
                <Select
                  labelInValue
                  defaultValue={{ key: '0' }}
                  style={{ marginBottom: '15px', marginRight: '10px' }}
                  onChange={this.handleChangePeriod}
                  loading={loading}
                >
                  <Option value="0">{formatMessage({ id: 'KitchenDashboard.FinalOrder' })}</Option>
                  <Option value="1">{formatMessage({ id: 'KitchenDashboard.Preorder' })}</Option>
                  <Option value="2">{formatMessage({ id: 'KitchenDashboard.CustomRange' })}</Option>
                </Select>
                {Number(period) === 2 && (
                  <span>
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
                      format="DD.MM.YYYY"
                      style={{ marginRight: '10px' }}
                      disabledDate={this.disabledDate}
                      onChange={this.handleChangeCustomPeriod}
                      onCalendarChange={this.handleChangeCalendar}
                    />
                  </span>
                )}
                <Button
                  onClick={this.onCheck}
                  type="primary"
                  size="default"
                  style={{ marginRight: '10px' }}
                  loading={loading}
                  disabled={loading}
                >
                  {formatMessage({ id: 'KitchenDashboard.View' })}
                </Button>
                <span style={{ marginLeft: '15px', fontSize: '18px' }}>
                  <strong>
                    {`${moment.unix(cookingData.firstDay.timestamp).format('DD.MM.YYYY')}
                 - 
                ${moment.unix(cookingData.secondDay.timestamp).format('DD.MM.YYYY')}`}
                  </strong>
                </span>
                <Button style={{ float: 'right' }} type="default" onClick={this.showDrawerMacro}>
                  {formatMessage({ id: 'KitchenDashboard.ShowMacro' })}
                </Button>
              </div>
            </div>
          </div>
        </div>
        {loading && (
          <center>
            <Spin size="large" />
          </center>
        )}
        {!loading && (
          <>
            <div className="row">
              <div className="col-xl-4 col-md-6">
                <StatisticCard
                  title={formatMessage({ id: 'KitchenDashboard.Summary' })}
                  type="summary"
                  generated={cookingData.firstDay.usersShouldBe}
                  shouldBeSecond={
                    cookingData.firstDay.totalShouldBe + cookingData.secondDay.totalShouldBe
                  }
                  generatedSecond={`${cookingData.firstDay.totalGenerated +
                    cookingData.secondDay.totalGenerated -
                    cookingData.firstDay.reserve -
                    cookingData.secondDay.reserve -
                    cookingData.firstDay.pickupPoint -
                    cookingData.secondDay.pickupPoint} (+${cookingData.firstDay.reserve +
                    cookingData.secondDay.reserve +
                    cookingData.firstDay.pickupPoint +
                    cookingData.secondDay.pickupPoint})`}
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <StatisticCard
                  title={formatMessage({ id: 'KitchenDashboard.ProductionStatus' })}
                  type="production"
                  generated={
                    cookingData.firstDay.reserve + cookingData.firstDay.pickupPoint > 0
                      ? `${cookingData.firstDay.totalGenerated -
                          cookingData.firstDay.reserve -
                          cookingData.firstDay.pickupPoint} (+${cookingData.firstDay.reserve +
                          cookingData.firstDay.pickupPoint})`
                      : cookingData.firstDay.totalGenerated
                  }
                  shouldBe={cookingData.firstDay.totalShouldBe}
                  date={cookingData.firstDay.timestamp}
                  generatedSecond={
                    cookingData.secondDay.reserve + cookingData.secondDay.pickupPoint > 0
                      ? `${cookingData.secondDay.totalGenerated -
                          cookingData.secondDay.reserve +
                          cookingData.secondDay.pickupPoint} (+${cookingData.secondDay.reserve +
                          cookingData.secondDay.pickupPoint})`
                      : cookingData.secondDay.totalGenerated
                  }
                  shouldBeSecond={cookingData.secondDay.totalShouldBe}
                  dateSecond={cookingData.secondDay.timestamp}
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <StatisticCard
                  title={formatMessage({ id: 'KitchenDashboard.Customers' })}
                  type="production"
                  generated={
                    cookingData.firstDay.reserve + cookingData.firstDay.pickupPoint > 0
                      ? `${cookingData.firstDay.usersGenerated - usersGenerated[0]} (+${
                          usersGenerated[0]
                        })`
                      : cookingData.firstDay.usersGenerated
                  }
                  shouldBe={cookingData.firstDay.usersShouldBe}
                  reserve={cookingData.firstDay.reserve}
                  reserveSecond={cookingData.secondDay.reserve}
                  date={cookingData.firstDay.timestamp}
                  generatedSecond={
                    cookingData.secondDay.reserve + cookingData.secondDay.pickupPoint > 0
                      ? `${cookingData.secondDay.usersGenerated - usersGenerated[1]} (+${
                          usersGenerated[1]
                        })`
                      : cookingData.secondDay.usersGenerated
                  }
                  shouldBeSecond={cookingData.secondDay.usersShouldBe}
                  dateSecond={cookingData.secondDay.timestamp}
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <div className="card card--fullHeight">
                  <div className="card-header">
                    <div className="utils__title utils__title--flat">
                      <strong className="text-uppercase font-size-16">
                        {formatMessage({ id: 'KitchenDashboard.KitchenStatus' })}
                      </strong>
                    </div>
                  </div>
                  <div className="card-body">
                    <Row gutter={16}>
                      <Col span={8}>
                        <strong>{formatMessage({ id: 'KitchenDashboard.Kitchen' })}</strong>
                      </Col>
                      <Col span={8}>
                        <strong>
                          {moment.unix(cookingData.firstDay.timestamp).format('DD.MM.YYYY')}
                        </strong>
                      </Col>
                      <Col span={8}>
                        <strong>
                          {moment.unix(cookingData.secondDay.timestamp).format('DD.MM.YYYY')}
                        </strong>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={8}>
                        {cookingData &&
                          cookingData.firstDay &&
                          cookingData.firstDay.kitchens.slice(0, -1).map(kitchen => (
                            <Row key={kitchen.name} gutter={16}>
                              <Col span={24}>
                                <strong>{kitchen.name}</strong>
                              </Col>
                            </Row>
                          ))}
                      </Col>
                      <Col span={8}>
                        {cookingData &&
                          cookingData.firstDay &&
                          cookingData.firstDay.kitchens.slice(0, -1).map(kitchen => (
                            <Row key={kitchen.name} gutter={16}>
                              <Col span={24}>
                                {kitchen.total - kitchen.reserve - kitchen.pickupPoint} (+
                                {kitchen.reserve + kitchen.pickupPoint}) / {kitchen.shouldBe}
                              </Col>
                            </Row>
                          ))}
                      </Col>
                      <Col span={8}>
                        {cookingData &&
                          cookingData.secondDay &&
                          cookingData.secondDay.kitchens.slice(0, -1).map(kitchen => (
                            <Row key={kitchen.name} gutter={16}>
                              <Col span={24}>
                                {kitchen.total - kitchen.reserve - kitchen.pickupPoint} (+
                                {kitchen.reserve + kitchen.pickupPoint}) / {kitchen.shouldBe}
                              </Col>
                            </Row>
                          ))}
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-md-6">
                <StatisticCard
                  title={formatMessage({ id: 'KitchenDashboard.ErrorCkal>20%' })}
                  type="error"
                  generated={cookingData.firstDay.errors.macro.other.total}
                  generatedSecond={cookingData.secondDay.errors.macro.other.total}
                  date={cookingData.firstDay.timestamp}
                  dateSecond={cookingData.secondDay.timestamp}
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <ProductionBufferWidget
                  title={formatMessage({ id: 'KitchenDashboard.Buffer' })}
                  timestamp={cookingData.firstDay.timestamp}
                  timestamp2={cookingData.secondDay.timestamp}
                />
              </div>
            </div>

            <div className="utils__title mb-3">
              <strong className="text-uppercase font-size-16">
                {formatMessage({ id: 'KitchenDashboard.Orders' })}
              </strong>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <OrderList
                  title="Missing orders"
                  data={cookingData.firstDay.errors.missingOrders}
                  regenButton
                />
              </div>
              <div className="col-lg-6">
                <GeneratedOrderList
                  title="Extra orders"
                  data={cookingData.firstDay.errors.extraOrders.concat(
                    cookingData.secondDay.errors.extraOrders,
                  )}
                />
              </div>
            </div>

            <div className="utils__title mb-3">
              <strong className="text-uppercase font-size-16">
                {formatMessage({ id: 'KitchenDashboard.Meals' })}
              </strong>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <OrderList
                  title="Missing meals"
                  data={cookingData.firstDay.errors.missingMeals}
                  regenButton
                />
              </div>
              <div className="col-lg-6">
                <OrderList
                  title={formatMessage({ id: 'KitchenDashboard.ExtraMeals' })}
                  data={cookingData.firstDay.errors.extraMeals.concat(
                    cookingData.secondDay.errors.extraMeals,
                  )}
                />
              </div>
            </div>

            {kcalError && (
              <div className="row">
                <div className="col-xl-6">
                  <div className="card card--fullHeight">
                    <div className="card-header">
                      <div className="utils__title utils__title--flat">
                        <strong className="text-uppercase font-size-16">
                          {formatMessage({ id: 'KitchenDashboard.ErrorInCaloriesSPACE' })}
                          {moment.unix(cookingData.firstDay.timestamp).format('DD.MM.YYYY')}
                        </strong>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-xl-6">
                          <div className="mb-3">
                            <Table
                              className="utils__scrollTable"
                              scroll={{ x: '100%' }}
                              rowKey={() => Math.random()}
                              dataSource={[
                                {
                                  key: '1',
                                  type: 'Below 5%',
                                  amount: cookingData.firstDay.errors.macro.max5.total,
                                },
                                {
                                  key: '2',
                                  type: 'From 5 to 10',
                                  amount: cookingData.firstDay.errors.macro.max10.total,
                                },
                                {
                                  key: '3',
                                  type: 'From 10 to 15',
                                  amount: cookingData.firstDay.errors.macro.max15.total,
                                },
                                {
                                  key: '4',
                                  type: 'From 15 to 20',
                                  amount: cookingData.firstDay.errors.macro.max20.total,
                                },
                                {
                                  key: '5',
                                  type: 'Above 20%',
                                  amount: cookingData.firstDay.errors.macro.other.total,
                                },
                              ]}
                              columns={supportCasesTableColumns}
                              pagination={false}
                            />
                          </div>
                        </div>
                        <div className="col-xl-6">
                          <div
                            className=" d-flex flex-column justify-content-center"
                            style={{ marginBottom: '5px' }}
                          >
                            <ChartistGraph
                              data={{
                                series: [
                                  {
                                    name: 'Below 5%',
                                    value: cookingData.firstDay.errors.macro.max5.total,
                                  },
                                  {
                                    name: 'From 5 to 10',
                                    value: cookingData.firstDay.errors.macro.max10.total,
                                  },
                                  {
                                    name: 'From 10 to 15',
                                    value: cookingData.firstDay.errors.macro.max15.total,
                                  },
                                  {
                                    name: 'From 15 to 20',
                                    value: cookingData.firstDay.errors.macro.max20.total,
                                  },
                                  {
                                    name: 'Above 20%',
                                    value: cookingData.firstDay.errors.macro.other.total,
                                  },
                                ],
                              }}
                              type="Pie"
                              options={supportCasesPieOptions}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="card card--fullHeight">
                    <div className="card-header">
                      <div className="utils__title utils__title--flat">
                        <strong className="text-uppercase font-size-16">
                          {formatMessage({ id: 'KitchenDashboard.ErrorInCaloriesSPACE' })}
                          {moment.unix(cookingData.secondDay.timestamp).format('DD.MM.YYYY')}
                        </strong>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-xl-6">
                          <div className="mb-3">
                            <Table
                              className="utils__scrollTable"
                              scroll={{ x: '100%' }}
                              rowKey={() => Math.random()}
                              dataSource={[
                                {
                                  key: '1',
                                  type: 'Below 5%',
                                  amount: cookingData.secondDay.errors.macro.max5.total,
                                },
                                {
                                  key: '2',
                                  type: 'From 5 to 10',
                                  amount: cookingData.secondDay.errors.macro.max10.total,
                                },
                                {
                                  key: '3',
                                  type: 'From 10 to 15',
                                  amount: cookingData.secondDay.errors.macro.max15.total,
                                },
                                {
                                  key: '4',
                                  type: 'From 15 to 20',
                                  amount: cookingData.secondDay.errors.macro.max20.total,
                                },
                                {
                                  key: '5',
                                  type: 'Above 20%',
                                  amount: cookingData.secondDay.errors.macro.other.total,
                                },
                              ]}
                              columns={supportCasesTableColumns}
                              pagination={false}
                            />
                          </div>
                        </div>
                        <div className="col-xl-6">
                          <div
                            className=" d-flex flex-column justify-content-center"
                            style={{ marginBottom: '5px' }}
                          >
                            <ChartistGraph
                              data={{
                                series: [
                                  {
                                    name: 'Below 5%',
                                    value: cookingData.secondDay.errors.macro.max5.total,
                                  },
                                  {
                                    name: 'From 5 to 10',
                                    value: cookingData.secondDay.errors.macro.max10.total,
                                  },
                                  {
                                    name: 'From 10 to 15',
                                    value: cookingData.secondDay.errors.macro.max15.total,
                                  },
                                  {
                                    name: 'From 15 to 20',
                                    value: cookingData.secondDay.errors.macro.max20.total,
                                  },
                                  {
                                    name: 'Above 20%',
                                    value: cookingData.secondDay.errors.macro.other.total,
                                  },
                                ],
                              }}
                              type="Pie"
                              options={supportCasesPieOptions}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <GeneratedMacro
          visible={macroVisible}
          onClose={this.onCloseDrawerMacro}
          data={cookingData}
        />
      </Authorize>
    )
  }
}

export default DashboardKitchen
