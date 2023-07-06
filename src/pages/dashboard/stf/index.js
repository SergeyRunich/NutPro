import React, { useState, useEffect, useCallback } from 'react'
import { useIntl } from 'react-intl'
import moment from 'moment'
import {
  DatePicker,
  Button,
  Select,
  Checkbox,
  InputNumber,
  notification,
  Divider,
  Row,
  Col,
} from 'antd'
import StatisticSTF from 'components/NutritionPRO/StatisticsSTF'
import Authorize from 'components/LayoutComponents/Authorize'
import { useDispatch } from 'react-redux'
import TableOfOrders from './Table'
import styles from './style.module.scss'
import { getStfByPeriod } from '../../../api/dashboard'
import { getSalesList } from '../../../api/order'

const { RangePicker } = DatePicker
const { Option } = Select

moment.updateLocale('en', {
  week: { dow: 1 },
})

const SalesTargetFulfilment = () => {
  const intl = useIntl()
  const [start, setStart] = useState(
    moment()
      .startOf('month')
      .unix(),
  )
  const [end, setEnd] = useState(
    moment()
      .endOf('month')
      .unix(),
  )
  const [statuses, setStatuses] = useState(['accepted'])
  const [mealPlans, setMealPlans] = useState(['2', '3', '5'])
  const [types, setTypes] = useState(['new', 'prolong', 'return'])
  const [isInvoiced, setIsInvoiced] = useState(1)
  const [sales, setSales] = useState('all')
  const [without2days, setWithout2days] = useState(true)
  const [mainDishPrice, setMainDishPrice] = useState(83)
  const [snackDishPrice, setSnackDishPrice] = useState(47)
  const [deliveryCost, setDeliveryCost] = useState(40)
  const [isLoading, setIsLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [statistics, setStatistics] = useState([])
  const [salesList, setSalesList] = useState([])
  const [logisticCenterCost, setLogisticCenterCost] = useState(13)
  const [source, setSource] = useState('all')

  const dispatch = useDispatch()

  const fetchSalesList = useCallback(async () => {
    const req = await getSalesList()
    if (req.status !== 401) {
      const json = await req.json()
      setSalesList(json.result)
    }
  }, [])

  const onChangeSales = e => {
    setSales(e)
  }

  const onChangeStatuses = e => {
    setStatuses(e)
  }

  const onChangeSource = e => {
    setSource(e)
  }

  const onChangeMealPlans = e => {
    setMealPlans(e)
  }

  const onChangeTypes = e => {
    setTypes(e)
  }

  const onChangeSnackDishPrice = e => {
    setSnackDishPrice(e)
  }

  const onChangeDeliveryCost = e => {
    setDeliveryCost(e)
  }

  const onChangeLogisticCenterCost = e => {
    setLogisticCenterCost(e)
  }

  const onChangeMainDishPrice = e => {
    setMainDishPrice(e)
  }

  const onChangeInvoiced = e => {
    setIsInvoiced(e)
  }

  const handleChangePeriod = async period => {
    setStart(period[0].unix())
    setEnd(period[1].unix())
  }

  const handleChangeWithout2days = e => {
    setWithout2days(e.target.checked)
  }

  const show = async () => {
    setIsLoading(true)
    const body = {
      statuses,
      mealPlans,
      isInvoiced,
      sales,
      without2days,
      mainDishPrice,
      snackDishPrice,
      deliveryCost,
      logisticCenterCost,
      types,
      source,
    }
    const req = await getStfByPeriod(
      moment.unix(Number(start)).format('DD-MM-YYYY'),
      moment.unix(Number(end)).format('DD-MM-YYYY'),
      body,
    )
    if (req.status === 401) {
      dispatch({
        type: 'user/SET_STATE',
        payload: {
          authorized: false,
        },
      })
      return
    }
    if (req.status === 200) {
      const stf = await req.json()
      setTableData(stf.result)
      setStatistics(stf.statistics)
      setIsLoading(false)
    } else {
      setIsLoading(false)
      notification.error({
        message: req.status,
        description: req.statusText,
      })
    }
  }

  useEffect(() => {
    document.title = 'Sales Target Fulfilment'
    const fetchData = async () => {
      setIsLoading(true)
      const req = await getStfByPeriod(
        moment()
          .startOf('month')
          .format('DD-MM-YYYY'),
        moment()
          .endOf('month')
          .format('DD-MM-YYYY'),
        {
          statuses: ['accepted'],
          mealPlans: ['2', '3', '5'],
          isInvoiced: 1,
          sales: 'all',
          without2days: true,
          mainDishPrice: 83,
          snackDishPrice: 47,
          deliveryCost: 40,
          logisticCenterCost: 13,
          source: 'all',
          types: ['new', 'prolong', 'return'],
        },
      )
      if (req.status === 401) {
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            authorized: false,
          },
        })
        return
      }
      if (req.status === 200) {
        const stf = await req.json()
        setTableData(stf.result)
        setStatistics(stf.statistics)
        setIsLoading(false)
      } else {
        setIsLoading(false)
        notification.error({
          message: req.status,
          description: req.statusText,
        })
      }
    }
    fetchData().finally(() => setIsLoading(false))
    fetchSalesList().catch(e => {
      notification.error({
        message: e.status,
        description: e.statusText,
      })
    })
  }, [dispatch, fetchSalesList])

  return (
    <Authorize roles={['finance', 'root', 'salesDirector']} redirect to="/404">
      <div className="row">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <div className="utils__title text-center">
                <strong>{intl.formatMessage({ id: 'STF.SalesTargetFulfilment' })}</strong>
              </div>
            </div>
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
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
              />

              <Button
                style={{ marginTop: '20px', width: '30%' }}
                type="primary"
                onClick={show}
                size="large"
              >
                {intl.formatMessage({ id: 'global.show' })}
              </Button>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card card--fullHeight">
            <div className="card-body">
              <Row>
                <Col span={4}>
                  <small>{intl.formatMessage({ id: 'STF.Invoice' })}</small>
                  <br />
                  <Select
                    value={isInvoiced}
                    style={{ width: 120 }}
                    onChange={onChangeInvoiced}
                    size="small"
                  >
                    <Option value={-1}>{intl.formatMessage({ id: 'STF.All' })}</Option>
                    <Option value={2}>
                      {intl.formatMessage({ id: 'STF.Invoiced&customPrice' })}
                    </Option>
                    <Option value={1}>{intl.formatMessage({ id: 'STF.Invoiced' })}</Option>
                    <Option value={0}>{intl.formatMessage({ id: 'STF.NoneInvoiced' })}</Option>
                  </Select>
                </Col>
                <Col span={4}>
                  <small>{intl.formatMessage({ id: 'STF.Sales' })}</small>
                  <br />
                  <Select
                    value={sales}
                    style={{ width: 120 }}
                    onChange={onChangeSales}
                    size="small"
                  >
                    <Option value="all">{intl.formatMessage({ id: 'STF.All' })}</Option>
                    {salesList &&
                      salesList.map(sale => (
                        <Option key={sale.id} value={sale.id}>
                          {sale.name}
                        </Option>
                      ))}
                  </Select>
                </Col>
                <Col span={4}>
                  <small>Statuses</small>
                  <br />
                  <Select
                    placeholder={intl.formatMessage({ id: 'STF.statuses' })}
                    dropdownStyle={{ minWidth: '100px' }}
                    mode="tags"
                    value={statuses}
                    onChange={onChangeStatuses}
                    size="small"
                  >
                    {['accepted', 'canceled', 'waitingPayment'].map(tag => (
                      <Option key={tag} value={tag}>
                        {tag}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={10}>
                  <small>{intl.formatMessage({ id: 'STF.Program' })}</small>
                  <br />
                  <Select
                    placeholder={intl.formatMessage({ id: 'STF.Meals' })}
                    dropdownStyle={{ minWidth: '100px' }}
                    mode="tags"
                    value={mealPlans}
                    onChange={onChangeMealPlans}
                    size="small"
                  >
                    {['2', '3', '5'].map(tag => (
                      <Option key={tag} value={tag}>
                        {`${tag} meals`}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={2}>
                  <small>{intl.formatMessage({ id: 'STF.WithoutTrial' })}</small>
                  <br />
                  <Checkbox checked={without2days} onClick={handleChangeWithout2days}>
                    {without2days ? 'Yes' : 'No'}
                  </Checkbox>
                </Col>
              </Row>
              <Divider />
              <Row>
                <Col span={8}>
                  <small>{intl.formatMessage({ id: 'STF.Type' })}</small>
                  <br />
                  <Select
                    placeholder={intl.formatMessage({ id: 'STF.Meals' })}
                    dropdownStyle={{ minWidth: '100px' }}
                    mode="tags"
                    value={types}
                    onChange={onChangeTypes}
                    size="small"
                    style={{ zIndex: '1' }}
                  >
                    {['new', 'prolong', 'return', 'trial'].map(tag => (
                      <Option key={tag} value={tag}>
                        {tag}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Authorize roles={['root', 'salesDirector']}>
                  <Col span={3}>
                    <small>{intl.formatMessage({ id: 'STF.Snack' })}</small>
                    <br />
                    <InputNumber
                      size="small"
                      value={snackDishPrice}
                      onChange={onChangeSnackDishPrice}
                    />
                  </Col>
                  <Col span={3}>
                    <small>{intl.formatMessage({ id: 'STF.Delivery' })}</small>
                    <br />
                    <InputNumber
                      size="small"
                      value={deliveryCost}
                      onChange={onChangeDeliveryCost}
                    />
                  </Col>
                  <Col span={3}>
                    <small>{intl.formatMessage({ id: 'STF.Main meal' })}</small>
                    <br />
                    <InputNumber
                      size="small"
                      value={mainDishPrice}
                      onChange={onChangeMainDishPrice}
                    />
                  </Col>
                  <Col span={4}>
                    <small>{intl.formatMessage({ id: 'STF.Logistic Center Cost' })}</small>
                    <br />
                    <InputNumber
                      size="small"
                      value={logisticCenterCost}
                      onChange={onChangeLogisticCenterCost}
                    />
                  </Col>
                </Authorize>
                <Col span={3}>
                  <small>{intl.formatMessage({ id: 'STF.Source' })}</small>
                  <br />
                  <Select
                    size="small"
                    style={{ width: '100%' }}
                    value={source}
                    onChange={onChangeSource}
                  >
                    <Option value="all">{intl.formatMessage({ id: 'STF.All' })}</Option>
                    <Option value="web">Web</Option>
                    <Option value="admin">Admin</Option>
                  </Select>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-10">
          <div className="card">
            <div className="card-body">
              <TableOfOrders data={tableData} loading={isLoading} />
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <>
            <div className={styles.list}>
              <div className="utils__title utils__title--flat">
                <strong>{intl.formatMessage({ id: 'STF.Statistics' })}</strong>
              </div>
              {statistics.map((item, i) => {
                if (i > 2) return
                return (
                  <div className={styles.listItem} key={item.label}>
                    <span className={styles.listCurrency}>
                      <span>{item.label}</span>
                    </span>
                    <span className={styles.listPercents}>
                      {i <= 1 &&
                        item.value.toLocaleString('cs-CZ', {
                          style: 'currency',
                          currency: 'CZK',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        })}
                      {i > 1 && `${item.value.toFixed(item.digits)}${item.suffix}`}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="card mb-3">
              <div className="card-header">
                <div className="utils__title utils__title--flat">
                  <strong className="text-uppercase font-size-16">
                    {intl.formatMessage({ id: 'STF.FinanceStats' })}
                  </strong>
                </div>
              </div>
              <div className="card-body">
                {statistics.slice(0, statistics.length - 12).map((item, i) => {
                  if (i <= 2) return
                  const actionData = (
                    <span style={{ color: item.actionDataColor }}>{item.actionData}</span>
                  )
                  return (
                    <StatisticSTF
                      key={item.label}
                      label={item.label}
                      value={item.value}
                      actionData={actionData}
                    />
                  )
                })}
              </div>
            </div>
            <div className="card mb-3">
              <div className="card-header">
                <div className="utils__title utils__title--flat">
                  <strong className="text-uppercase font-size-16">
                    {intl.formatMessage({ id: 'STF.ProductStats' })}
                  </strong>
                  <br />
                  <small className="text-lowercase font-size-12 text-muted">
                    * sold client-days
                  </small>
                </div>
              </div>
              <div className="card-body">
                {statistics.slice(-12).map(item => (
                  <StatisticSTF
                    key={`${item.label}-${Math.random()}`}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </div>
            </div>
          </>
        </div>
      </div>
    </Authorize>
  )
}

export default SalesTargetFulfilment
