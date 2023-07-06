import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { saveAs } from 'file-saver'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row, Spin, DatePicker, Button, Skeleton } from 'antd'
import { Helmet } from 'react-helmet'
import SalesStatisticCard from 'components/NutritionPRO/SalesStatisticCard'
import SalesStatisticCardB2B from 'components/NutritionPRO/SalesStatisticCardB2B'
// import StackedBar from 'components/NutritionPRO/StackedBar'
import SalesDataByManager from 'components/NutritionPRO/SalesDataByManager'
import PromoStats from 'components/NutritionPRO/PromoStats'
// import DonutChartMealsPerDay from 'components/NutritionPRO/DonutChartMealsPerDay'
// import DonutChartSalesData from 'components/NutritionPRO/DonutChartSalesData'
import GlobalChartZoom from 'components/NutritionPRO/GlobalChartZoom'
import SalesData from './SalesData'
import SoldWeeksTable from './SoldWeeksTable'
import {
  getSalesDashboardMainData,
  getSalesDashboardActiveOrders,
  getSalesDashboardGlobalData,
  getSalesDataByManager,
  getPromoStats,
  getCustomersData,
  getStfData,
  getSalesDashboardB2B,
  getSalesWeeksData,
} from '../../../api/dashboard'

const { RangePicker } = DatePicker

moment.updateLocale('en', {
  week: { dow: 1 },
})

@injectIntl
@withRouter
@connect(({ user }) => ({ user }))
class DashboardSales extends React.Component {
  state = {
    mainData: false,
    activeOrders: {},
    b2bData: false,
    // chartData: {
    //   lastMonth: null,
    // },
    chartLoading: false,
    byManager: false,
    promoStats: {},
    promoStatsLoading: true,
    salesList: [],
    customersDetails: [],
    globalData: [],
    loading: true,
    soldWeeksLoading: false,
    globalLoading: false,
    stfLoading: false,
    start: moment().unix(),
    end: moment()
      .add(7, 'days')
      .unix(),
    soldWeeksData: {},
  }

  constructor(props) {
    super(props)

    this.showSalesData = this.showSalesData.bind(this)
    this.showSalesWeeksData = this.showSalesWeeksData.bind(this)
    this.saveSTF = this.saveSTF.bind(this)
  }

  componentWillMount() {
    getSalesDashboardB2B().then(async answer => {
      if (answer.status === 401) {
        const { dispatch } = this.props
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            authorized: false,
          },
        })
        return
      }
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          b2bData: json,
          loading: false,
        })
      }
    })
    getSalesDataByManager().then(async answer => {
      if (answer.status === 401) {
        const { dispatch } = this.props
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            authorized: false,
          },
        })
        return
      }
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          byManager: json,
          loading: false,
        })
      }
    })
  }

  getSalesMainData = (start, end) => {
    this.setState({ mainData: false })
    getSalesDashboardMainData(start, end).then(async answer => {
      if (answer.status === 401) {
        const { dispatch } = this.props
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            authorized: false,
          },
        })
        return
      }
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          mainData: json,
          loading: false,
        })
      }
    })
  }

  getPromoStatsData = (start, end) => {
    this.setState({
      promoStatsLoading: true,
    })
    getPromoStats(start, end).then(async answer => {
      if (answer.status === 401) {
        const { dispatch } = this.props
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            authorized: false,
          },
        })
        return
      }
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          promoStats: json.result.promo,
          promoStatsLoading: false,
        })
      }
    })
  }

  getSalesActiveOrders = (start, end) => {
    getSalesDashboardActiveOrders(start, end).then(async answer => {
      if (answer.status === 401) {
        const { dispatch } = this.props
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            authorized: false,
          },
        })
        return
      }
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          activeOrders: json,
          loading: false,
        })
      }
    })
  }

  loadGlobalChart = () => {
    this.setState({ chartLoading: true })
    getSalesDashboardGlobalData().then(async answer => {
      if (answer.status === 401) {
        const { dispatch } = this.props
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            authorized: false,
          },
        })
        return
      }
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          globalData: json.months,
          chartLoading: false,
        })
      }
    })
  }

  handleChangePeriod = async period => {
    this.setState({ start: period[0].unix(), end: period[1].unix() })
  }

  showSalesData() {
    const { start, end } = this.state
    this.setState({
      globalLoading: true,
    })
    getCustomersData(
      moment.unix(start).format('DD-MM-YYYY'),
      moment.unix(end).format('DD-MM-YYYY'),
    ).then(async req => {
      if (req.status === 200) {
        const customersData = await req.json()
        this.setState({
          salesList: customersData.salesList,
          customersDetails: customersData.details,
          globalLoading: false,
        })
      }
    })
  }

  showSalesWeeksData() {
    const { start, end } = this.state
    this.setState({
      soldWeeksLoading: true,
    })
    getSalesWeeksData(
      moment.unix(start).format('DD-MM-YYYY'),
      moment.unix(end).format('DD-MM-YYYY'),
    ).then(async req => {
      if (req.status === 200) {
        const SalesWeeksData = await req.json()
        this.setState({
          soldWeeksData: SalesWeeksData,
          soldWeeksLoading: false,
        })
      }
    })
  }

  saveSTF() {
    const { start, end } = this.state
    this.setState({
      stfLoading: true,
    })
    getStfData(moment.unix(start).format('DD-MM-YYYY'), moment.unix(end).format('DD-MM-YYYY')).then(
      async req => {
        if (req.status === 200) {
          const blob = await req.blob()
          const filename = req.headers.get('Filename')
          saveAs(blob, `${filename}`)
          this.setState({
            stfLoading: false,
          })
        }
      },
    )
  }

  render() {
    const {
      loading,
      mainData,
      activeOrders,
      globalData,
      byManager,
      promoStats,
      promoStatsLoading,
      salesList,
      customersDetails,
      start,
      end,
      globalLoading,
      stfLoading,
      soldWeeksLoading,
      b2bData,
      soldWeeksData,
      chartLoading,
    } = this.state

    const {
      intl: { formatMessage },
    } = this.props

    return (
      <Authorize
        roles={['root', 'admin', 'sales', 'salesDirector', 'finance']}
        denied={['Dany', 'Yana', 'Ksenia']}
        redirect
        to="/main"
      >
        <div>
          <Helmet title="Dashboard Sales" />
          <Spin spinning={loading && mainData === {}}>
            {!loading && mainData !== {} && (
              <div>
                <div className="row">
                  <div className="col-lg-6 col-xl-6">
                    <div className="utils__title mb-3">
                      <Authorize roles={['sales']}>
                        <strong className="text-uppercase font-size-16">
                          {formatMessage({ id: 'DashboardSales.MyStatistics' })}
                        </strong>
                      </Authorize>
                      <Authorize roles={['root', 'admin', 'salesDirector']}>
                        <strong className="text-uppercase font-size-16">
                          {formatMessage({ id: 'DashboardSales.AllSales' })}
                        </strong>
                      </Authorize>
                    </div>

                    <SalesStatisticCard
                      getSalesMainData={this.getSalesMainData}
                      getSalesActiveOrders={this.getSalesActiveOrders}
                      defaultRange="month"
                      data={mainData}
                      activeOrders={activeOrders}
                      isSales
                    />

                    {!mainData && (
                      <div className="card" style={{ padding: '15px' }}>
                        <Skeleton />
                      </div>
                    )}
                  </div>
                  <div className="col-lg-6 col-xl-6">
                    <div className="utils__title mb-3">
                      <strong className="text-uppercase font-size-16">
                        {formatMessage({ id: 'DashboardSales.ActiveDiscounts' })}
                      </strong>
                    </div>

                    <PromoStats
                      getPromoStats={this.getPromoStatsData}
                      data={promoStats}
                      promoStatsLoading={promoStatsLoading}
                    />

                    {b2bData && <SalesStatisticCardB2B defaultRange="month" data={b2bData} />}
                    {!b2bData && (
                      <div className="card" style={{ padding: '15px' }}>
                        <Skeleton />
                      </div>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-6 col-xl-6">
                    <Authorize roles={['root', 'admin']}>
                      <div className="utils__title mb-3">
                        <strong className="text-uppercase font-size-16">
                          {formatMessage({ id: 'DashboardSales.StatisticsBySales' })}
                        </strong>
                      </div>
                      {byManager && <SalesDataByManager defaultRange="month" data={byManager} />}
                      {!byManager && (
                        <div className="card" style={{ padding: '15px' }}>
                          <Skeleton />
                        </div>
                      )}
                    </Authorize>
                  </div>
                  <div className="col-lg-6 col-xl-6">
                    <Authorize roles={['root', 'admin']}>
                      <div className="utils__title mb-3">
                        <strong className="text-uppercase font-size-16">
                          {formatMessage({ id: 'DashboardSales.GlobalChart' })}
                        </strong>
                      </div>
                      <GlobalChartZoom
                        loadGlobalChart={this.loadGlobalChart}
                        chartLoading={chartLoading}
                        defaultType="all"
                        months={globalData}
                      />
                    </Authorize>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 col-xl-12">
                    <div className="utils__title mb-3">
                      <Authorize roles={['sales']}>
                        <strong className="text-uppercase font-size-16">
                          {formatMessage({ id: 'DashboardSales.MySoldWeeks' })}
                        </strong>
                      </Authorize>
                      <Authorize roles={['root', 'admin', 'salesDirector']}>
                        <strong className="text-uppercase font-size-16">
                          {formatMessage({ id: 'DashboardSales.AllSoldWeeks' })}
                        </strong>
                      </Authorize>
                    </div>
                    <div className="card">
                      <div className="card-body">
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
                          defaultValue={[moment(start * 1000), moment(end * 1000)]}
                          format="DD.MM.YYYY"
                          onChange={this.handleChangePeriod}
                          style={{ marginBottom: '30px', marginRight: '15px' }}
                        />
                        <Button
                          style={{ marginBottom: '30px', marginRight: '15px' }}
                          type="primary"
                          onClick={this.showSalesWeeksData}
                        >
                          {formatMessage({ id: 'global.show' })}
                        </Button>
                        <Spin spinning={soldWeeksLoading}>
                          <Row gutter={16}>
                            <SoldWeeksTable data={soldWeeksData} />
                          </Row>
                        </Spin>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="utils__title mb-3">
                  <strong className="text-uppercase font-size-16">
                    {formatMessage({ id: 'DashboardSales.GlobalSalesData' })}
                  </strong>
                </div>
                <div className="row">
                  <div className="col-lg-12 col-xl-12">
                    <div className="card">
                      <div className="card-body">
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
                          defaultValue={[moment(start * 1000), moment(end * 1000)]}
                          format="DD.MM.YYYY"
                          onChange={this.handleChangePeriod}
                          style={{ marginBottom: '30px', marginRight: '15px' }}
                        />
                        <Button
                          style={{ marginBottom: '30px', marginRight: '15px' }}
                          type="primary"
                          onClick={this.showSalesData}
                        >
                          {formatMessage({ id: 'global.show' })}
                        </Button>
                        {salesList !== [] && (
                          <Spin spinning={globalLoading}>
                            <SalesData data={salesList} details={customersDetails} />
                          </Spin>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="utils__title mb-3">
                  <strong className="text-uppercase font-size-16">
                    {formatMessage({ id: 'DashboardSales.SalesTargetFulfillmentData' })}
                  </strong>
                </div>
                <div className="row">
                  <div className="col-lg-12 col-xl-12">
                    <div className="card">
                      <div className="card-body">
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
                          defaultValue={[moment(start * 1000), moment(end * 1000)]}
                          format="DD.MM.YYYY"
                          onChange={this.handleChangePeriod}
                          style={{ marginRight: '15px' }}
                        />
                        <Button
                          style={{ marginRight: '15px' }}
                          type="primary"
                          onClick={this.saveSTF}
                          loading={stfLoading}
                        >
                          {formatMessage({ id: 'DashboardSales.Download' })}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Spin>
        </div>
      </Authorize>
    )
  }
}

export default DashboardSales
