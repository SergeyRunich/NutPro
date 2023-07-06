import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { useIntl } from 'react-intl'
import { Button, Select, DatePicker, Tabs, Spin, Checkbox, notification } from 'antd'
import { Helmet } from 'react-helmet'
import { saveAs } from 'file-saver'
import Authorize from 'components/LayoutComponents/Authorize'
import SalesData from './components/SalesData'
import KitchenCost from './components/KitchenCost'
import DeliveryLog from './components/DeliveryLog'
import CustomersCostByDay from './components/CustomersCostByDay'
import MarginByPeriod from './components/MarginByPeriod'
import MarginByMonth from './components/MarginByMonth'
import KitchenInvoice from './components/KitchenInvoice'
import Margin from './components/Margin'
import {
  getCustomersData,
  getKitchenData,
  getOrdersByDayData,
  getMarginByPeriodData,
  getMarginByMonth,
  getKitchenInvoice,
  getCustomerCost,
  getMargin,
} from '../../../api/dashboard'
import { getAllKitchen } from '../../../api/kitchen'
// import { getInvoicesByStatus } from '../../../api/order'
import { getDeliveryLog, getDeliveryFeeXlsx } from '../../../api/deliveryTools'
import CustomerCost from './components/CustomerCost'

const { TabPane } = Tabs
const { RangePicker } = DatePicker

const { Option } = Select

moment.updateLocale('en', {
  week: { dow: 1 },
})

const DashboardFinance = () => {
  const [start, setStart] = useState(moment().unix())
  const [end, setEnd] = useState(
    moment()
      .add(7, 'days')
      .unix(),
  )
  const [salesList, setSalesList] = useState([])
  const [customersDetails, setCustomersDetails] = useState({})
  const [kitchenData, setKitchenData] = useState([])
  const [customerByDayData, setCustomerByDayData] = useState([])
  // const [invoicesData, setInvoicesData] = useState([])
  const [marginData, setMarginData] = useState([])
  const [marginDataB2B, setMarginDataB2B] = useState([])
  const [marginByMonthData, setMarginByMonthData] = useState({})
  const [deliveryData, setDeliveryData] = useState({})
  const [kitchen, setKitchen] = useState('')
  const [kitchens, setKitchens] = useState([{ id: '', name: '-' }])
  const [tab, setTab] = useState(1)
  const [loading, setLoading] = useState(false)
  const [invoiceStatus, setInvoiceStatus] = useState('overdue')
  const [isB2B, setIsB2B] = useState(false)
  const [downloadingDoc, setDownloadingDoc] = useState(false)
  const [kitchenFinance, setKitchenFinance] = useState([])
  const [kitchenStats, setKitchenStats] = useState([])
  const [customerCost, setCustomerCost] = useState([])
  const [customerCostStats, setCustomerCostStats] = useState([])
  const [marginStats, setMarginStats] = useState([])

  const intl = useIntl()

  useEffect(() => {
    getAllKitchen().then(async req => {
      if (req.status !== 401) {
        const res = await req.json()
        setKitchens(res)
        setKitchen(res[0].id)
      }
    })
  }, [])

  const handleChangeKitchen = async k => {
    setKitchen(k.key)
  }

  const handleChangeB2B = async e => {
    setIsB2B(e.target.checked)
    setTab(e.target.checked ? 8 : 1)
  }

  const handleInvoiceStatus = async status => {
    setInvoiceStatus(status.key)
  }

  const handleChangePeriod = async period => {
    setStart(period[0].unix())
    setEnd(period[1].unix())
  }

  const changeTab = async t => {
    setTab(t)
  }

  const saveDeliveryFee = () => {
    setDownloadingDoc(true)
    getDeliveryFeeXlsx(
      moment.unix(start).format('DD-MM-YYYY'),
      moment.unix(end).format('DD-MM-YYYY'),
    )
      .then(async resp => {
        const blob = await resp.blob()
        const filename = resp.headers.get('Filename')
        saveAs(blob, `${filename}`)
        setDownloadingDoc(false)
      })
      .catch(error => {
        notification.warning({
          message: error.code,
          description: error.message,
        })
        setDownloadingDoc(false)
      })
  }

  const show = () => {
    if (Number(tab) === 0 || Number(tab) === 1) {
      setLoading(true)
      getCustomersData(
        moment.unix(start).format('DD-MM-YYYY'),
        moment.unix(end).format('DD-MM-YYYY'),
      ).then(async req => {
        if (req.status === 200) {
          const customersData = await req.json()
          setSalesList(customersData.salesList)
          setCustomersDetails(customersData.details)
          setLoading(false)
        }
      })
    } else if (Number(tab) === 2) {
      setLoading(true)
      getKitchenData(
        kitchen,
        moment.unix(start).format('DD-MM-YYYY'),
        moment.unix(end).format('DD-MM-YYYY'),
      ).then(async req => {
        if (req.status === 200) {
          const res = await req.json()
          setKitchenData(res)
          setLoading(false)
        }
      })
    } else if (Number(tab) === 4) {
      setLoading(true)
      getDeliveryLog(
        moment.unix(start).format('DD-MM-YYYY'),
        moment.unix(end).format('DD-MM-YYYY'),
      ).then(async req => {
        if (req.status === 200) {
          const res = await req.json()
          setDeliveryData(res)
          setLoading(false)
        }
      })
    } else if (Number(tab) === 5) {
      setLoading(true)
      getOrdersByDayData(
        kitchen,
        moment.unix(start).format('DD-MM-YYYY'),
        moment.unix(end).format('DD-MM-YYYY'),
      ).then(async req => {
        if (req.status === 200) {
          const res = await req.json()
          setCustomerByDayData(res)
          setLoading(false)
        }
      })
    } else if (Number(tab) === 6) {
      setLoading(true)
      getMarginByPeriodData(
        kitchen,
        moment.unix(start).format('DD-MM-YYYY'),
        moment.unix(end).format('DD-MM-YYYY'),
      ).then(async req => {
        if (req.status === 200) {
          const res = await req.json()
          setMarginData(res)
          setLoading(false)
        }
      })
    } else if (Number(tab) === 7) {
      setLoading(true)
      getMarginByMonth(kitchen).then(async req => {
        if (req.status === 200) {
          const res = await req.json()
          setMarginByMonthData(res)
          setLoading(false)
        }
      })
    } else if (Number(tab) === 8) {
      setLoading(true)
      getMarginByPeriodData(
        kitchen,
        moment.unix(start).format('DD-MM-YYYY'),
        moment.unix(end).format('DD-MM-YYYY'),
        { filter: true, status: true },
      ).then(async req => {
        if (req.status === 200) {
          const res = await req.json()
          setMarginDataB2B(res)
          setLoading(false)
        }
      })
    } else if (Number(tab) === 9) {
      setLoading(true)
      getKitchenInvoice(
        kitchen,
        moment.unix(start).format('DD-MM-YYYY'),
        moment.unix(end).format('DD-MM-YYYY'),
      ).then(async req => {
        if (req.status === 200) {
          const res = await req.json()
          setKitchenFinance(res.result)
          setKitchenStats(res.result.pop())
          setLoading(false)
        }
      })
    } else if (Number(tab) === 10) {
      setLoading(true)
      getCustomerCost(
        kitchen,
        moment.unix(start).format('DD-MM-YYYY'),
        moment.unix(end).format('DD-MM-YYYY'),
      ).then(async req => {
        if (req.status === 200) {
          const res = await req.json()
          setCustomerCost(res.result)
          setCustomerCostStats(res.result.pop())
          setLoading(false)
        }
      })
    } else if (Number(tab) === 11) {
      setLoading(true)
      getMargin(
        kitchen,
        moment.unix(start).format('DD-MM-YYYY'),
        moment.unix(end).format('DD-MM-YYYY'),
      ).then(async req => {
        if (req.status === 200) {
          const res = await req.json()
          setMarginStats(res.result)
          setLoading(false)
        }
      })
    }
    // else if (Number(tab) === 3) {
    //   setLoading(true)
    //   getInvoicesByStatus(invoiceStatus).then(async req => {
    //     if (req.status === 200) {
    //       const res = await req.json()
    //       setInvoicesData(res)
    //       setLoading(false)
    //     }
    //   })
    // }
  }

  return (
    <Authorize roles={['root', 'finance', 'salesDirector']} users={['David']} redirect to="/main">
      <Helmet title="Dashboard Financial" />
      <div className="row">
        <div className="col-xl-12">
          <div className="card card--fullHeight">
            <div className="card-body">
              {Number(tab) !== 3 &&
                Number(tab) !== 7 &&
                Number(tab) !== 9 &&
                Number(tab) !== 10 &&
                Number(tab) !== 11 && (
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
                    onChange={handleChangePeriod}
                    style={{ marginBottom: '10px', marginRight: '15px' }}
                  />
                )}
              {(Number(tab) === 9 || Number(tab) === 10 || Number(tab) === 11) && (
                <>
                  <RangePicker
                    format="DD.MM.YYYY"
                    disabledDate={currentDay =>
                      currentDay.day() !== 2 && currentDay.day() !== 4 && currentDay.day() !== 0
                    }
                    onChange={handleChangePeriod}
                    style={{ marginBottom: '10px', marginRight: '15px' }}
                  />
                  <Select
                    labelInValue
                    value={{ key: kitchen }}
                    style={{ marginRight: '15px', width: 120 }}
                    onChange={handleChangeKitchen}
                  >
                    <Option key="null" value="null">
                      {intl.formatMessage({ id: 'DashboardFinance.All' })}
                    </Option>
                    {kitchens.map(k => (
                      <Option key={k.id} value={k.id}>
                        {k.name}
                      </Option>
                    ))}
                  </Select>
                </>
              )}

              {(Number(tab) === 2 ||
                Number(tab) === 5 ||
                Number(tab) === 6 ||
                Number(tab) === 8 ||
                Number(tab) === 7) && (
                <Select
                  labelInValue
                  value={{ key: kitchen }}
                  style={{ marginRight: '15px', width: 120 }}
                  onChange={handleChangeKitchen}
                >
                  <Option key="all" value="All">
                    {intl.formatMessage({ id: 'DashboardFinance.All' })}
                  </Option>
                  {kitchens.map(k => (
                    <Option key={k.id} value={k.id}>
                      {k.name}
                    </Option>
                  ))}
                </Select>
              )}
              {Number(tab) === 3 && (
                <Select
                  labelInValue
                  value={{ key: invoiceStatus }}
                  style={{ marginRight: '15px' }}
                  onChange={handleInvoiceStatus}
                >
                  <Option key="overdue" value="overdue">
                    {intl.formatMessage({ id: 'DashboardFinance.overdue' })}
                  </Option>
                  <Option key="open" value="open">
                    {intl.formatMessage({ id: 'DashboardFinance.open' })}
                  </Option>
                  <Option key="sent" value="sent">
                    {intl.formatMessage({ id: 'DashboardFinance.sent' })}
                  </Option>
                  <Option key="cancelled" value="cancelled">
                    {intl.formatMessage({ id: 'DashboardFinance.cancelled' })}
                  </Option>
                  <Option key="paid" value="paid">
                    {intl.formatMessage({ id: 'DashboardFinance.paid' })}
                  </Option>
                </Select>
              )}
              <Checkbox checked={isB2B} onChange={handleChangeB2B} style={{ marginRight: '15px' }}>
                {intl.formatMessage({ id: 'DashboardFinance.B2B' })}
              </Checkbox>
              <Button type="primary" style={{ marginRight: '15px' }} onClick={show}>
                {intl.formatMessage({ id: 'global.show' })}
              </Button>
              {Number(tab) === 4 && (
                <Button type="dashed" onClick={saveDeliveryFee} loading={downloadingDoc}>
                  {intl.formatMessage({ id: 'DashboardFinance.ExportDeliveryFee' })}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-12">
          <div className="card card--fullHeight">
            <div className="card-body">
              <Tabs onChange={changeTab} type="card">
                {!isB2B && (
                  <TabPane tab={intl.formatMessage({ id: 'DashboardFinance.SalesData' })} key={0}>
                    <Spin spinning={loading}>
                      <SalesData data={salesList} details={customersDetails} />
                    </Spin>
                  </TabPane>
                )}
                {!isB2B && (
                  <TabPane tab="Kitchens (deprecated)" key={2}>
                    <Spin spinning={loading}>
                      <KitchenCost data={kitchenData} />
                    </Spin>
                  </TabPane>
                )}
                {!isB2B && (
                  <TabPane
                    tab={intl.formatMessage({ id: 'DashboardFinance.KitchenInvoice' })}
                    key={9}
                  >
                    <Spin spinning={loading}>
                      <KitchenInvoice data={kitchenFinance} stats={kitchenStats} />
                    </Spin>
                  </TabPane>
                )}
                {/* {!isB2B && (
                  <TabPane tab={intl.formatMessage({ id: 'DashboardFinance.Invoices' })} key={3}>
                    <Spin spinning={loading}>
                      <Invoices data={invoicesData} />
                    </Spin>
                  </TabPane>
                )} */}
                {!isB2B && (
                  <TabPane tab={intl.formatMessage({ id: 'DashboardFinance.Deliveries' })} key={4}>
                    <Spin spinning={loading}>
                      <DeliveryLog data={deliveryData} show={show} />
                    </Spin>
                  </TabPane>
                )}
                {!isB2B && (
                  <TabPane tab="Customers cost (deprecated)" key={5}>
                    <Spin spinning={loading}>
                      <CustomersCostByDay data={customerByDayData} show={show} />
                    </Spin>
                  </TabPane>
                )}
                {!isB2B && (
                  <TabPane
                    tab={intl.formatMessage({ id: 'DashboardFinance.CustomersCost' })}
                    key={10}
                  >
                    <Spin spinning={loading}>
                      <CustomerCost data={customerCost} stats={customerCostStats} />
                    </Spin>
                  </TabPane>
                )}
                {!isB2B && (
                  <TabPane
                    tab={intl.formatMessage({ id: 'DashboardFinance.AllMarginByPeriod' })}
                    key={11}
                  >
                    <Spin spinning={loading}>
                      <Margin data={marginStats} />
                    </Spin>
                  </TabPane>
                )}
                {!isB2B && (
                  <TabPane tab="Margin (deprecated)" key={6}>
                    <Spin spinning={loading}>
                      <MarginByPeriod data={marginData} show={show} />
                    </Spin>
                  </TabPane>
                )}
                {!isB2B && (
                  <TabPane
                    tab={intl.formatMessage({ id: 'DashboardFinance.Margin6Months' })}
                    key={7}
                  >
                    <Spin spinning={loading}>
                      <MarginByMonth data={marginByMonthData} show={show} />
                    </Spin>
                  </TabPane>
                )}
                {isB2B && (
                  <TabPane
                    tab={intl.formatMessage({ id: 'DashboardFinance.B2BMarginByPeriod' })}
                    key={8}
                  >
                    <Spin spinning={loading}>
                      <MarginByPeriod data={marginDataB2B} show={show} />
                    </Spin>
                  </TabPane>
                )}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Authorize>
  )
}

export default DashboardFinance
