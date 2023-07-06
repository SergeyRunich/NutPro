import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Link, NavLink } from 'react-router-dom'
import { Button, Table, notification, Popconfirm } from 'antd'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { useDispatch } from 'react-redux'
import KitchenWidget from './components/KitchenWidget'
import NumberOfOrders from './components/NumberOfOrders'
import WebOrdersList from './components/WebOrdersList'
import { getMainData } from '../../../api/dashboard'
import { syncBitrixCompare, syncBitrixAll } from '../../../api/customer'
import { getWebOrders, getUnpaidOrders } from '../../../api/order'

function DashboardMain() {
  const [totalUsers, setTotalUsers] = useState(0)
  const [activeUsers, setActiveUsers] = useState({
    waiting: 0,
    active: 0,
    pause: 0,
    b2b: 0,
    total: 0,
  })
  const [, setWithoutDataset] = useState(0)
  const [webOrdersListVisible, setWebOrdersListVisible] = useState(false)
  const [webOrdersList, setWebOrdersList] = useState([])
  const [fromWeb, setFromWeb] = useState([])
  const [waitingForPayment, setWaitingForPayment] = useState([])
  const [overdueWeb, setOverdueWeb] = useState([])
  const [overdueWebInvoice, setOverdueWebInvoice] = useState([])
  const [canceledWebOrders, setCanceledWebOrders] = useState([])
  const [unpaidOrders, setUnpaidOrders] = useState([])
  const [activeUnpaidOrders, setActiveUnpaidOrders] = useState([])

  const dispatch = useDispatch()
  const intl = useIntl()

  useEffect(() => {
    const getMainDataAndOrders = async () => {
      getMainData().then(async req => {
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
          const json = await req.json()
          setTotalUsers(json.totalUsers)
          setActiveUsers(json.activeUsers)
          setWithoutDataset(json.withoutDataset)
        } else {
          notification.error({
            message: intl.formatMessage({ id: 'global.error' }),
            description: req.statusText,
          })
        }
      })
      getUnpaidOrders().then(async req => {
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
          const json = await req.json()
          setUnpaidOrders(json)
        } else {
          notification.error({
            message: intl.formatMessage({ id: 'global.error' }),
            description: req.statusText,
          })
        }
      })
      getUnpaidOrders('active').then(async req => {
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
          const json = await req.json()
          setActiveUnpaidOrders(json)
        } else {
          notification.error({
            message: intl.formatMessage({ id: 'global.error' }),
            description: req.statusText,
          })
        }
      })
      getWebOrders('active', 'fromWeb').then(async req => {
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
          const json = await req.json()
          setFromWeb(json)
        } else {
          notification.error({
            message: intl.formatMessage({ id: 'global.error' }),
            description: req.statusText,
          })
        }
      })
      getWebOrders('active', 'waitingPayment').then(async req => {
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
          const json = await req.json()
          setWaitingForPayment(json)
        } else {
          notification.error({
            message: intl.formatMessage({ id: 'global.error' }),
            description: req.statusText,
          })
        }
      })
      getWebOrders('overdue', 'fromWeb').then(async req => {
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
          const json = await req.json()
          setOverdueWeb(json)
        } else {
          notification.error({
            message: intl.formatMessage({ id: 'global.error' }),
            description: req.statusText,
          })
        }
      })
      getWebOrders('overdue', 'waitingPayment').then(async req => {
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
          const json = await req.json()
          setOverdueWebInvoice(json)
        } else {
          notification.error({
            message: intl.formatMessage({ id: 'global.error' }),
            description: req.statusText,
          })
        }
      })
      getWebOrders('canceled', 'canceled').then(async req => {
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
          const json = await req.json()
          setCanceledWebOrders(json)
        } else {
          notification.error({
            message: intl.formatMessage({ id: 'global.error' }),
            description: req.statusText,
          })
        }
      })
    }

    getMainDataAndOrders()
  }, [dispatch, intl])

  const changeWebOrdersList = (visible, list) => {
    setWebOrdersListVisible(visible)
    setWebOrdersList(visible ? list : [])
  }

  const supportCasesTableColumns = [
    {
      title: intl.formatMessage({ id: 'Main.Type' }),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: intl.formatMessage({ id: 'Main.Amount' }),
      key: 'amount',
      dataIndex: 'amount',
      align: 'center',
      render: (amount, record) => {
        if ((record.key === '6' || record.key === '7') && amount > 0) {
          return (
            <NavLink
              className="text-danger font-weight-bold"
              to="#"
              onClick={e => {
                changeWebOrdersList(true, record.list)
                e.preventDefault()
              }}
            >
              {amount}
            </NavLink>
          )
        }
        return <span className="text-primary font-weight-bold">{amount}</span>
      },
    },
  ]

  const supportCasesTableColumnsWebOrders = [
    {
      title: intl.formatMessage({ id: 'Main.WebOrders' }),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: intl.formatMessage({ id: 'Main.Amount' }),
      key: 'amount',
      dataIndex: 'amount',
      align: 'center',
      render: (amount, record) => {
        if ((record.key === '3' || record.key === '4') && amount > 0) {
          return (
            <NavLink
              className="text-danger font-weight-bold"
              to="#"
              onClick={e => {
                changeWebOrdersList(true, record.list)
                e.preventDefault()
              }}
            >
              {amount}
            </NavLink>
          )
        }
        return (
          <NavLink
            className="text-primary font-weight-bold"
            to="#"
            onClick={e => {
              changeWebOrdersList(true, record.list)
              e.preventDefault()
            }}
          >
            {amount}
          </NavLink>
        )
      },
    },
  ]

  const startBitrixCompare = async () => {
    const req = await syncBitrixCompare()
    if (req.status === 200) {
      notification.success({
        message: 'Success',
        description: 'Bitrix compare completed successfully',
      })
    } else {
      notification.error({
        message: intl.formatMessage({ id: 'global.error' }),
        description: req.statusText,
      })
    }
  }

  const startBitrixSync = async () => {
    const req = await syncBitrixAll()
    if (req.status === 200) {
      notification.success({
        message: intl.formatMessage({ id: 'global.success' }),
        description: intl.formatMessage({ id: 'Main.BitrixSync.SuccessfullyStarted!' }),
      })
    } else {
      notification.error({
        message: intl.formatMessage({ id: 'global.error' }),
        description: req.statusText,
      })
    }
  }

  return (
    <Authorize
      roles={['root', 'admin', 'sales', 'finance', 'salesDirector', 'readonlySearch']}
      denied={['Ksenia', 'Daniel', 'Vitaly']}
      redirect
      to="/dashboard/stf"
    >
      <Helmet title={intl.formatMessage({ id: 'Main.DashboardMine' })} />
      <div className="row">
        <div className="col-lg-9">
          <Authorize
            roles={['root', 'admin', 'sales', 'finance', 'salesDirector']}
            denied={['Dany', 'Yan']}
          >
            <div className="card card--fullHeight">
              <div className="card-header">
                <div className="utils__title utils__title--flat">
                  <strong className="text-uppercase font-size-16">
                    {intl.formatMessage({ id: 'Main.Customers&Orders' })}
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
                            type: 'Active customers',
                            amount: activeUsers.total,
                          },
                          {
                            key: '2',
                            type: 'Waiting',
                            amount: activeUsers.waiting,
                          },
                          {
                            key: '3',
                            type: 'Active',
                            amount: activeUsers.active,
                          },
                          {
                            key: '4',
                            type: 'Pause',
                            amount: activeUsers.pause,
                          },
                          {
                            key: '5',
                            type: 'B2B',
                            amount: activeUsers.b2b,
                          },
                          {
                            key: '6',
                            type: 'Active Unpaid',
                            amount: activeUnpaidOrders.length,
                            list: activeUnpaidOrders,
                          },
                          {
                            key: '7',
                            type: 'Total Unpaid',
                            amount: unpaidOrders.length,
                            list: unpaidOrders,
                          },
                          {
                            key: '8',
                            type: 'Total customers',
                            amount: totalUsers,
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
                      <Table
                        className="utils__scrollTable"
                        scroll={{ x: '100%' }}
                        rowKey={() => Math.random()}
                        dataSource={[
                          {
                            key: '1',
                            type: 'New',
                            amount: fromWeb.length,
                            list: fromWeb,
                          },
                          {
                            key: '2',
                            type: 'Waiting for payment',
                            amount: waitingForPayment.length,
                            list: waitingForPayment,
                          },
                          {
                            key: '3',
                            type: 'Acceptance is overdue',
                            amount: overdueWeb.length,
                            list: overdueWeb,
                          },
                          {
                            key: '4',
                            type: 'Payment is overdue',
                            amount: overdueWebInvoice.length,
                            list: overdueWebInvoice,
                          },
                          {
                            key: '5',
                            type: 'Canceled',
                            amount: canceledWebOrders.length,
                            list: canceledWebOrders,
                          },
                        ]}
                        columns={supportCasesTableColumnsWebOrders}
                        pagination={false}
                      />
                    </div>
                    <div
                      className=" d-flex flex-column justify-content-center"
                      style={{ marginBottom: '5px' }}
                    >
                      <Popconfirm
                        title="Are you sure?"
                        onConfirm={startBitrixCompare}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="default">
                          {intl.formatMessage({ id: 'Main.BitrixCompareID' })}
                        </Button>
                      </Popconfirm>
                    </div>
                    <div
                      className="h-20 d-flex flex-column justify-content-center"
                      style={{ marginBottom: '5px' }}
                    >
                      <Popconfirm
                        title={intl.formatMessage({ id: 'Main.AreYouSure?' })}
                        onConfirm={startBitrixSync}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="default">
                          {intl.formatMessage({ id: 'Main.BitrixSync' })}
                        </Button>
                      </Popconfirm>
                    </div>
                    <Link to="/logs/order/">
                      <div
                        className="h-20 d-flex flex-column justify-content-center"
                        style={{ marginBottom: '5px' }}
                      >
                        <Button type="dashed">
                          {intl.formatMessage({ id: 'Main.OrdersLog' })}
                        </Button>
                      </div>
                    </Link>
                    <Link to="/dashboard/ranges/macro">
                      <div
                        className="h-20 d-flex flex-column justify-content-center"
                        style={{ marginBottom: '5px' }}
                      >
                        <Button type="dashed">
                          {intl.formatMessage({ id: 'Main.MacroRanges' })}
                        </Button>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Authorize>
        </div>
        <WebOrdersList
          visible={webOrdersListVisible}
          onCancel={() => setWebOrdersListVisible(false)}
          list={webOrdersList}
        />
        <div className="col-lg-3">
          <Authorize roles={['root', 'admin', 'sales', 'finance', 'salesDirector']}>
            <div className="card">
              <div className="card-header">
                <div className="utils__title utils__title--flat">
                  <strong className="text-uppercase font-size-16">
                    {intl.formatMessage({ id: 'Main.WeekMenu' })}
                  </strong>
                </div>
              </div>
              <div className="card-body">
                <KitchenWidget />
              </div>
            </div>
          </Authorize>
          <Authorize roles={['root', 'admin', 'sales', 'salesDirector']}>
            <div className="card">
              <div className="card-body">
                <div className="h-15 d-flex flex-column justify-content-center">
                  <Link target="_blank" to="/dashboard/production-buffer">
                    <Button style={{ width: '100%' }} type="primary">
                      {intl.formatMessage({ id: 'KitchenWidget.ProductionBuffer' })}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Authorize>
        </div>
      </div>
      <Authorize
        roles={['root', 'admin', 'sales', 'finance', 'salesDirector']}
        denied={['Dany', 'Yan']}
      >
        <div className="card card--fullHeight">
          <div className="card-header">
            <div className="utils__title utils__title--flat">
              <strong className="text-uppercase font-size-16">
                {intl.formatMessage({ id: 'Main.NumberOfOrders' })}
              </strong>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-12">
                <NumberOfOrders />
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    </Authorize>
  )
}

export default DashboardMain
