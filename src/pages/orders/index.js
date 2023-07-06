/* eslint-disable no-restricted-syntax */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Link, withRouter } from 'react-router-dom'
import moment from 'moment'
import Authorize from 'components/LayoutComponents/Authorize'
import {
  Table,
  Icon,
  Input,
  Button,
  Radio,
  Dropdown,
  Menu,
  notification,
  Select,
  Checkbox,
} from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import {
  getAllOrders,
  regenerateOrder,
  sendInvoiceEmail,
  changeOrderStatus,
  getSalesList,
} from '../../api/order'
import { getAllKitchen } from '../../api/kitchen'

const { Option } = Select

@injectIntl
@withRouter
@connect(({ user }) => ({ user }))
class Orders extends React.Component {
  state = {
    tableData: [],
    data: [],
    filterDropdownVisible: false,
    searchText: '',
    filtered: false,
    loading: true,
    stage: 'active',
    status: 'all',
    sales: 'all',
    kitchen: 'all',
    kitchens: [],
    filter: 'all',
    type: 'normal',
    isOnlyVIP: false,
    isOnlyUnpaid: false,
    isOnlyWithoutInvoice: false,
    salesList: [],
  }

  constructor(props) {
    super(props)

    this.onChangeStage = this.onChangeStage.bind(this)
    this.onChangeStatus = this.onChangeStatus.bind(this)
    this.onChangeSales = this.onChangeSales.bind(this)
    this.onChangeFilter = this.onChangeFilter.bind(this)
    this.onChangeType = this.onChangeType.bind(this)
    this.onChangeKitchen = this.onChangeKitchen.bind(this)
  }

  componentWillMount() {
    const { stage, status } = this.state
    getAllOrders(stage, status).then(async answer => {
      const json = await answer.json()
      this.setState({
        tableData: json,
        data: json,
        loading: false,
      })
    })

    getAllKitchen().then(async answer => {
      const json = await answer.json()
      this.setState({
        kitchens: json,
      })
    })
    getSalesList().then(async req => {
      if (req.status !== 401) {
        const salesList = await req.json()
        this.setState({
          salesList: salesList.result,
        })
      }
    })
  }

  onInputChange = e => {
    this.setState({ searchText: e.target.value })
  }

  onSearch = () => {
    const { searchText, tableData } = this.state
    const reg = new RegExp(searchText, 'gi')
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      data: tableData
        .map(record => {
          const match = record.user.name.match(reg)
          if (!match) {
            return null
          }
          return {
            ...record,
            name: (
              <span key={Math.random()}>
                {record.user.name.split(reg).map((text, i) =>
                  i > 0
                    ? [
                        // eslint-disable-next-line react/jsx-indent
                        <span key={Math.random()} className="highlight">
                          {match[0]}
                        </span>,
                        text,
                      ]
                    : text,
                )}
              </span>
            ),
          }
        })
        .filter(record => !!record),
    })
    if (searchText === '') {
      this.setState({
        filtered: false,
      })
    }
  }

  onChangeStage(e) {
    const { status, sales, filter } = this.state
    try {
      this.setState(state => ({
        stage: e.target.value,
        filter: e.target.value === 'all' ? 'all' : state.filter,
      }))
      this.update(e.target.value, status, sales, e.target.value === 'all' ? 'all' : filter)
    } catch (error) {
      console.log(error)
    }
  }

  onChangeFilter(e) {
    const { status, stage, sales, type } = this.state
    try {
      this.setState({
        filter: e.target.value,
      })
      this.update(stage, status, sales, e.target.value, type)
    } catch (error) {
      console.log(error)
    }
  }

  onChangeStatus(e) {
    const { stage, sales, filter, type } = this.state
    try {
      this.setState({
        status: e,
      })
      this.update(stage, e, sales, filter, type)
    } catch (error) {
      console.log(error)
    }
  }

  onChangeSales(e) {
    const { stage, status, filter, type } = this.state
    try {
      this.setState({
        sales: e,
      })
      this.update(stage, status, e, filter, type)
    } catch (error) {
      console.log(error)
    }
  }

  onChangeKitchen(e) {
    try {
      this.setState({
        kitchen: e,
      })
    } catch (error) {
      console.log(error)
    }
  }

  onChangeType(e) {
    const { stage, status, sales, filter } = this.state
    try {
      this.setState({
        type: e.target.value,
      })
      this.update(stage, status, sales, filter, e.target.value)
    } catch (error) {
      console.log(error)
    }
  }

  vipCheckbox = e => {
    this.setState({
      isOnlyVIP: e.target.checked,
    })
  }

  unpaidCheckbox = e => {
    this.setState({
      isOnlyUnpaid: e.target.checked,
    })
  }

  withoutInvoiceCheckbox = e => {
    this.setState({
      isOnlyWithoutInvoice: e.target.checked,
    })
  }

  refSearchInput = node => {
    this.searchInput = node
  }

  update(stage = 'active', status = 'all', sales = 'all', filter = 'all', type = 'normal') {
    this.setState({
      loading: true,
    })
    getAllOrders(stage, status, sales, filter, type)
      .then(async answer => {
        const json = await answer.json()
        this.setState({
          tableData: json,
          data: json,
          loading: false,
        })
      })
      .finally(() => {
        this.setState({
          loading: false,
        })
      })
  }

  render() {
    const {
      data,
      searchText,
      filterDropdownVisible,
      filtered,
      stage,
      status,
      sales,
      filter,
      type,
      isOnlyVIP,
      isOnlyUnpaid,
      isOnlyWithoutInvoice,
      kitchen,
      kitchens,
      salesList,
    } = this.state

    const {
      intl: { formatMessage },
    } = this.props

    const onSendInvoiceEmail = async id => {
      const req = await sendInvoiceEmail(id)
      if (req.status === 204) {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'Orders.InvoiceSuccessfullySend!' }),
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    }

    const onRegenerateOrder = async id => {
      const req = await regenerateOrder(id)
      if (req.status === 202) {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'Orders.RegenerationSuccessfullyStarted!' }),
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    }

    const onChangeStatusOrder = async (id, newStatus) => {
      const req = await changeOrderStatus(newStatus, id)
      if (req.status === 202) {
        this.update(stage, status)
        if (newStatus === 'accepted') {
          notification.success({
            message: formatMessage({ id: 'global.success' }),
            description: formatMessage({ id: 'Orders.OrderSuccessfullyAccepted!' }),
          })
        } else if (newStatus === 'rejected') {
          notification.success({
            message: formatMessage({ id: 'global.success' }),
            description: formatMessage({ id: 'Orders.OrderSuccessfullyRejected!' }),
          })
        } else {
          notification.success({
            message: formatMessage({ id: 'global.success' }),
            description: formatMessage({ id: 'Orders.OrderStatusSuccessfullyChanged!' }),
          })
        }
      } else {
        notification.error({
          message: formatMessage({ id: 'Orders.Error!' }),
          description: req.statusText,
        })
      }
    }

    const menu = (statusOrder, id) => (
      <Menu style={{ padding: '0px' }}>
        {statusOrder === 'new' && (
          <Menu.Item
            key="accept"
            onClick={() => onChangeStatusOrder(id, 'accepted')}
            style={{ backgroundColor: 'LimeGreen', color: 'AliceBlue', fontWeight: 'bolder' }}
          >
            {formatMessage({ id: 'global.accept' })}
          </Menu.Item>
        )}
        {statusOrder === 'new' && (
          <Menu.Item
            key="reject"
            onClick={() => onChangeStatusOrder(id, 'rejected')}
            style={{ backgroundColor: 'LightCoral', color: 'AliceBlue', fontWeight: 'bolder' }}
          >
            {formatMessage({ id: 'global.reject' })}
          </Menu.Item>
        )}
        {statusOrder === 'accepted' && (
          <Menu.Item key="regenerate" onClick={() => onRegenerateOrder(id)}>
            {formatMessage({ id: 'Orders.Regenerate' })}
          </Menu.Item>
        )}
        {statusOrder === 'accepted' && (
          <Menu.Item key="sendInvoiceEmail" onClick={() => onSendInvoiceEmail(id)}>
            {formatMessage({ id: 'Orders.ResendInvoiceEmail' })}
          </Menu.Item>
        )}
      </Menu>
    )

    const badgeColor = {
      accepted: 'success',
      rejected: 'danger',
      new: 'primary',
      waitingPayment: 'info',
      fromWeb: 'info',
      incomplete: 'warning',
    }

    const columns = [
      {
        title: formatMessage({ id: 'Orders.ID' }),
        dataIndex: 'user',
        key: 'id',
        render: (text, record) => <Link to={`/users/${record.user.id}`}>{`${text.inBodyId}`}</Link>,
        sorter: (a, b) => a.user.inBodyId - b.user.inBodyId,
      },
      {
        title: formatMessage({ id: 'global.name' }),
        dataIndex: 'user',
        key: 'name',
        sorter: (a, b) => a.user.name.length - b.user.name.length,
        render: (text, record) => (
          <>
            <Authorize roles={['root', 'sales', 'salesDirector']}>
              <Link to={`/users/${record.user.id}`}>{text.name}</Link>
            </Authorize>
            <Authorize roles={['admin', 'finance']}>{text.name}</Authorize>
          </>
        ),
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder={formatMessage({ id: 'Orders.SearchName' })}
              value={searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch}>
              {formatMessage({ id: 'Orders.Search' })}
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterDropdownVisible: visible,
            },
            () => this.searchInput && this.searchInput.focus(),
          )
        },
      },
      {
        title: formatMessage({ id: 'Orders.CreatedDate' }),
        dataIndex: 'id',
        key: 'createdDate',
        render: text => (
          <span>
            {`${moment.unix(parseInt(text.substring(0, 8), 16)).format('DD.MM.YYYY HH:mm')}`}
          </span>
        ),
        sorter: (a, b) => parseInt(a.id.substring(0, 8), 16) - parseInt(b.id.substring(0, 8), 16),
      },
      {
        title: formatMessage({ id: 'Orders.Start' }),
        dataIndex: 'timestamp',
        key: 'startDate',
        render: text => {
          return <span>{moment.unix(text).format('DD.MM.YYYY')}</span>
        },
        sorter: (a, b) => a.timestamp - b.timestamp,
      },
      {
        title: formatMessage({ id: 'Orders.Diet' }),
        dataIndex: 'diet',
        key: 'diet',
        render: text => {
          return <span>{text}</span>
        },
        sorter: (a, b) => a.diet.length - b.diet.length,
      },
      {
        title: formatMessage({ id: 'Orders.Meals' }),
        dataIndex: 'mealsPerDay',
        key: 'mealsPerDay',
        render: text => {
          return <span>{text}</span>
        },
        sorter: (a, b) => a.mealsPerDay - b.mealsPerDay,
      },
      {
        title: formatMessage({ id: 'Orders.Price' }),
        dataIndex: 'price',
        key: 'price',
        render: text => {
          return <span>{text}</span>
        },
        sorter: (a, b) => a.price - b.price,
      },
      {
        title: formatMessage({ id: 'Orders.Invoice' }),
        dataIndex: 'isInvoicePaid',
        key: 'isInvoicePaid',
        render: (text, record) => (
          <span
            className={`font-size-12 badge badge-${
              text
                ? badgeColor.accepted
                : record.status !== 'accepted' || !record.invoice
                ? 'default'
                : badgeColor.rejected
            }`}
          >
            {text ? (
              <a className="text-white" href={record.invoice}>
                {formatMessage({ id: 'Orders.Paid' })}
              </a>
            ) : (
              <span>
                {(record.status !== 'accepted' && record.status !== 'waitingPayment') ||
                !record.invoice
                  ? formatMessage({ id: 'Orders.None' })
                  : formatMessage({ id: 'Orders.Unpaid' })}
              </span>
            )}
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'global.email' }),
        dataIndex: 'email',
        key: 'email',
        render: text => <a href={`mailto:${text}`} target="blank">{`${text || '-'}`}</a>,
      },
      {
        title: formatMessage({ id: 'global.phone' }),
        dataIndex: 'phone',
        key: 'phone',
        render: text => <span>{`${text || '-'}`}</span>,
      },
      {
        title: formatMessage({ id: 'Orders.Status' }),
        dataIndex: 'status',
        key: 'status',
        render: text => (
          <span className={`font-size-12 badge badge-${badgeColor[text]}`}>
            {text === 'Active' ? (
              <a className="text-white" href={`/#/orders/${text.id}`}>
                {text.status}
              </a>
            ) : (
              text
            )}
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'Orders.Action' }),
        dataIndex: 'id',
        key: 'action',
        render: (text, record) => (
          <span>
            <Authorize roles={['root', 'sales', 'salesDirector']}>
              <Dropdown.Button overlay={menu(record.status, text)}>
                <Link to={`/orders/${text}`}>{formatMessage({ id: 'Orders.View' })}</Link>
              </Dropdown.Button>
            </Authorize>
            <Authorize roles={['admin', 'finance']}>
              <Button>
                <Link to={`/orders/${text}`}>{formatMessage({ id: 'Orders.View' })}</Link>
              </Button>
            </Authorize>
          </span>
        ),
      },
    ]

    let finalData = data
    if (isOnlyVIP) {
      finalData = []
      for (const record of data) {
        if (record.user.tag === 'VIP') finalData.push(record)
      }
    }
    if (isOnlyUnpaid) {
      const preFinalData = []
      for (const record of finalData) {
        if (
          record.isInvoicePaid === false &&
          record.status === 'accepted' &&
          record.invoice !== '' &&
          record.invoice !== null
        )
          preFinalData.push(record)
      }
      finalData = preFinalData
    }

    if (isOnlyWithoutInvoice) {
      const preFinalData = []
      for (const record of finalData) {
        if (record.invoice === '' || record.invoice === null) preFinalData.push(record)
      }
      finalData = preFinalData
    }

    if (kitchen !== 'all') {
      const preFinalData = []
      for (const record of finalData) {
        if (record.kitchen && record.kitchen.last.name === kitchen) preFinalData.push(record)
      }
      finalData = preFinalData
    }

    return (
      <Authorize
        roles={['root', 'admin', 'sales', 'salesDirector', 'finance']}
        denied={['Dany', 'Vitaly']}
        redirect
        to="/main"
      >
        <Helmet title="Orders" />
        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4>{formatMessage({ id: 'Orders.Stage' })}</h4>
                <Radio.Group value={stage} onChange={this.onChangeStage}>
                  <Radio.Button value="active">
                    {formatMessage({ id: 'Orders.Active' })}
                  </Radio.Button>
                  <Radio.Button value="all">{formatMessage({ id: 'Orders.All' })}</Radio.Button>
                </Radio.Group>
              </div>

              <div>
                <h4>{formatMessage({ id: 'Orders.FilterOfActiveOrders' })}</h4>
                <Radio.Group
                  value={filter}
                  onChange={this.onChangeFilter}
                  disabled={stage !== 'active'}
                >
                  <Radio.Button value="all">{formatMessage({ id: 'Orders.All' })}</Radio.Button>
                  <Radio.Button value="active">
                    {formatMessage({ id: 'Orders.Active' })}
                  </Radio.Button>
                  <Radio.Button value="waiting">
                    {formatMessage({ id: 'Orders.Waiting' })}
                  </Radio.Button>
                  <Radio.Button value="pause">{formatMessage({ id: 'Orders.Pause' })}</Radio.Button>
                </Radio.Group>
              </div>

              <div>
                <h4>Status</h4>
                <Select value={status} onChange={this.onChangeStatus} style={{ width: '150px' }}>
                  <Option value="all">{formatMessage({ id: 'Orders.All' })}</Option>
                  <Option value="accepted">{formatMessage({ id: 'Orders.Accepted' })}</Option>
                  <Option value="new">{formatMessage({ id: 'Orders.New' })}</Option>
                  <Option value="rejected">{formatMessage({ id: 'Orders.Rejected' })}</Option>
                  <Option value="fromWeb">{formatMessage({ id: 'Orders.FromWeb' })}</Option>
                  <Option value="waitingPayment">
                    {formatMessage({ id: 'Orders.FromWeb(WaitingForPayment)' })}
                  </Option>
                  <Option value="incomplete">{formatMessage({ id: 'Orders.Incomplete' })}</Option>
                </Select>
              </div>

              <div>
                <h4>{formatMessage({ id: 'Orders.Sales' })}</h4>
                <Select value={sales} style={{ width: 120 }} onChange={this.onChangeSales}>
                  <Option value="all">{formatMessage({ id: 'Orders.All' })}</Option>
                  {salesList &&
                    salesList.map(sal => (
                      <Option key={sal.id} value={sal.id}>
                        {sal.name}
                      </Option>
                    ))}
                </Select>
              </div>

              <div>
                <h4>{formatMessage({ id: 'Orders.Kitchen' })}</h4>
                <Select value={kitchen} style={{ width: '115px' }} onChange={this.onChangeKitchen}>
                  <Option value="all">{formatMessage({ id: 'Orders.All' })}</Option>
                  {kitchens.map(k => (
                    <Option key={k.name + Math.random()} value={k.name}>
                      {k.name}
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <h4>{formatMessage({ id: 'Orders.Type' })}</h4>
                <Radio.Group value={type} onChange={this.onChangeType}>
                  <Radio.Button value="normal">
                    {formatMessage({ id: 'Orders.Normal' })}
                  </Radio.Button>
                  <Radio.Button value="b2b">{formatMessage({ id: 'Orders.B2B' })}</Radio.Button>
                </Radio.Group>
              </div>
            </div>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ marginRight: '20px' }}>
                <Checkbox checked={isOnlyVIP} onClick={e => this.vipCheckbox(e)}>
                  {formatMessage({ id: 'Orders.OnlyVip' })}
                </Checkbox>
              </div>

              <div style={{ marginRight: '20px' }}>
                <Checkbox checked={isOnlyUnpaid} onClick={e => this.unpaidCheckbox(e)}>
                  {formatMessage({ id: 'Orders.OnlyUnpaid' })}
                </Checkbox>
              </div>

              <div style={{ marginRight: '20px' }}>
                <Checkbox
                  checked={isOnlyWithoutInvoice}
                  onClick={e => this.withoutInvoiceCheckbox(e)}
                >
                  {formatMessage({ id: 'Orders.OnlyWithoutInvoice' })}
                </Checkbox>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>{formatMessage({ id: 'Orders.Orders' })}</strong>
            </div>
          </div>
          <div className="card-body">
            <Table
              tableLayout="auto"
              scroll={{ x: '100%' }}
              columns={columns}
              dataSource={finalData}
              pagination={{
                position: 'bottom',
                total: finalData.length,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100', '200'],
                hideOnSinglePage: finalData.length < 10,
              }}
              loading={this.state.loading}
              rowKey={() => Math.random()}
            />
          </div>
        </div>
      </Authorize>
    )
  }
}

export default Orders
