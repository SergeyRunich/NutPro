/* eslint-disable no-nested-ternary */
import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import { Link, withRouter } from 'react-router-dom'
import { Button, Table, notification, Popover, Select, Row, Col } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { getOrderLog } from '../../../api/orderLog'

const { Option } = Select

@injectIntl
@withRouter
class OrderLog extends React.Component {
  state = {
    logs: [],
    loading: true,
    systemUser: '',
    user: '',
    order: '',
    action: '',
    limit: 500,
  }

  constructor(props) {
    super(props)

    this.update = this.update.bind(this)
  }

  componentDidMount() {
    this.update()
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

  update() {
    const {
      intl: { formatMessage },
    } = this.props
    const { systemUser, user, order, action, limit } = this.state
    this.setState({
      loading: true,
    })
    getOrderLog({ limit, systemUser, user, order, action }).then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        this.setState({
          logs: json.result,
          loading: false,
        })
      } else {
        this.setState({
          loading: false,
        })
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    })
  }

  searchByOrder(order) {
    const {
      intl: { formatMessage },
    } = this.props
    const { systemUser, user, action, limit } = this.state
    this.setState({
      loading: true,
      order,
    })
    getOrderLog({ limit, systemUser, user, order, action }).then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        this.setState({
          logs: json.result,
          loading: false,
        })
      } else {
        this.setState({
          loading: false,
        })
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    })
  }

  searchByUser(user) {
    const {
      intl: { formatMessage },
    } = this.props
    const { systemUser, order, action, limit } = this.state
    this.setState({
      loading: true,
      user,
    })
    getOrderLog({ limit, systemUser, user, order, action }).then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        this.setState({
          logs: json.result,
          loading: false,
        })
      } else {
        this.setState({
          loading: false,
        })
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    })
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { logs, loading, systemUser, user, order, action, limit } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    const transformField = {
      ignoredMealTypes: formatMessage({ id: 'OrderLog.SkippedMeals' }),
      kcal: formatMessage({ id: 'OrderLog.kcal' }),
      mealsPerDay: formatMessage({ id: 'OrderLog.Meals' }),
      deliveryDescription: formatMessage({ id: 'OrderLog.DeliveryComment' }),
      kitchenDescription: formatMessage({ id: 'OrderLog.KitchenComment' }),
      size: formatMessage({ id: 'OrderLog.WeekSize' }),
      timestamp: formatMessage({ id: 'OrderLog.FirstDeliveryDate' }),
    }

    const positive = [
      formatMessage({ id: 'global.create' }),
      formatMessage({ id: 'global.accept' }),
      formatMessage({ id: 'OrderLog.ADDPAUSE' }),
      formatMessage({ id: 'OrderLog.APPROVALCUSTOMPRICE' }),
      formatMessage({ id: 'OrderLog.APPROVALRECALCULATEDPRICE' }),
    ]

    const neutral = [
      formatMessage({ id: 'global.edit' }),
      formatMessage({ id: 'OrderLog.RESENDINVOICE' }),
      formatMessage({ id: 'OrderLog.REQUESTRECALCULATEDPRICE' }),
      formatMessage({ id: 'OrderLog.REGENERATE' }),
    ]

    const columns = [
      {
        title: formatMessage({ id: 'global.date' }),
        dataIndex: 'date',
        key: 'date',
        render: dateCol => moment(dateCol).format('DD.MM.YYYY HH:mm'),
      },
      {
        title: formatMessage({ id: 'OrderLog.SYSTEMUSER' }),
        dataIndex: 'systemUser',
        key: 'systemUser',
        render: systemUserCol => systemUserCol,
      },
      {
        title: formatMessage({ id: 'OrderLog.ACTION' }),
        dataIndex: 'action',
        key: 'action',
        render: actionCol => (
          <span
            style={{
              fontWeight: '26px',
              color: positive.includes(actionCol)
                ? '#46be8a'
                : neutral.includes(actionCol)
                ? '#0887c9'
                : '#fb434a',
            }}
          >
            {actionCol}
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'OrderLog.USER' }),
        dataIndex: 'user',
        key: 'user',
        render: userCol => <Link to={`/users/${userCol.id}`}>{userCol.name}</Link>,
      },
      {
        title: formatMessage({ id: 'OrderLog.ORDER' }),
        dataIndex: 'order',
        key: 'order',
        render: orderCol => <Link to={`/orders/${orderCol}`}>{orderCol}</Link>,
      },
      {
        title: formatMessage({ id: 'OrderLog.CHANGES' }),
        dataIndex: 'changes',
        key: 'changes',
        render: changes => {
          if (changes.length) {
            const content = (
              <div>
                {changes.map(change => (
                  <p key={Math.random()}>
                    <b>
                      {transformField[change.field] || (
                        <span style={{ textTransform: 'capitalize' }}>{change.field}</span>
                      )}
                    </b>
                    : {change.before || 'None'} <i className="fa fa-long-arrow-right" />{' '}
                    {change.after || 'None'}
                  </p>
                ))}
              </div>
            )
            return (
              <Popover content={content} title={formatMessage({ id: 'OrderLog.ChangesInOrder' })}>
                <div style={{ width: '400px' }}>
                  {changes.map(change => (
                    <span key={Math.random()} style={{ textTransform: 'capitalize' }}>
                      {transformField[change.field] || change.field},{' '}
                    </span>
                  ))}
                </div>
              </Popover>
            )
          }
          return <span>-</span>
        },
      },
      {
        title: formatMessage({ id: 'OrderLog.ADVANCEDSEARCH' }),
        dataIndex: 'id',
        key: 'id',
        render: (_, record) => (
          <span>
            <Button
              type="default"
              style={{ marginRight: '10px' }}
              onClick={() => this.searchByOrder(record.order)}
            >
              {formatMessage({ id: 'OrderLog.BYORDER' })}
            </Button>
            <Button type="default" onClick={() => this.searchByUser(record.user.id)}>
              {formatMessage({ id: 'OrderLog.BYUSER' })}
            </Button>
          </span>
        ),
      },
    ]

    return (
      <Authorize roles={['root', 'admin', 'sales', 'salesDirector']}>
        <Helmet title={formatMessage({ id: 'OrderLog.OrdersLog' })} />
        <div className="row">
          <div className="col-lg-12">
            <div className="card card--fullHeight">
              <div className="card-header">
                <div className="utils__title utils__title--flat">
                  <strong className="text-uppercase font-size-16">
                    {formatMessage({ id: 'OrderLog.Filter' })}
                  </strong>
                </div>
              </div>
              <div className="card-body">
                <Row gutter={16}>
                  <Col sm={24} md={5}>
                    <small>{formatMessage({ id: 'OrderLog.Action' })}</small>
                    <br />
                    <Select
                      placeholder={formatMessage({ id: 'OrderLog.RecordLimit' })}
                      value={action}
                      style={{ width: '100%' }}
                      onChange={e => this.onChangeField(e, 'action')}
                    >
                      <Option key="" value="">
                        {formatMessage({ id: 'OrderLog.None' })}
                      </Option>
                      <Option key="CREATE" value="CREATE">
                        {formatMessage({ id: 'global.create' })}
                      </Option>
                      <Option key="EDIT" value="EDIT">
                        {formatMessage({ id: 'global.edit' })}
                      </Option>
                      <Option key="ACCEPT" value="ACCEPT">
                        {formatMessage({ id: 'global.accept' })}
                      </Option>
                      <Option key="REJECT" value="REJECT">
                        {formatMessage({ id: 'global.reject' })}
                      </Option>
                      <Option key="ADD PAUSE" value="ADD PAUSE">
                        {formatMessage({ id: 'OrderLog.ADDPAUSE' })}
                      </Option>
                      <Option key="REMOVE PAUSE" value="REMOVE PAUSE">
                        {formatMessage({ id: 'OrderLog.REMOVEPAUSE' })}
                      </Option>
                      <Option key="REGENERATE" value="REGENERATE">
                        {formatMessage({ id: 'OrderLog.REGENERATE' })}
                      </Option>
                      <Option key="RESEND INVOICE" value="RESEND INVOICE">
                        {formatMessage({ id: 'OrderLog.RESENDINVOICE' })}
                      </Option>
                      <Option key="APPROVAL CUSTOM PRICE" value="APPROVAL CUSTOM PRICE">
                        {formatMessage({ id: 'OrderLog.APPROVALCUSTOMPRICE' })}
                      </Option>
                      <Option key="APPROVAL RECALCULATED PRICE" value="APPROVAL RECALCULATED PRICE">
                        {formatMessage({ id: 'OrderLog.APPROVALRECALCULATEDPRICE' })}
                      </Option>
                      <Option key="REJECT RECALCULATED PRICE" value="REJECT RECALCULATED PRICE">
                        {formatMessage({ id: 'OrderLog.REJECTRECALCULATEDPRICE' })}
                      </Option>
                      <Option key="REQUEST RECALCULATED PRICE" value="REQUEST RECALCULATED PRICE">
                        {formatMessage({ id: 'OrderLog.REQUESTRECALCULATEDPRICE' })}
                      </Option>
                    </Select>
                  </Col>
                  <Col sm={24} md={4}>
                    <small>{formatMessage({ id: 'OrderLog.SystemUser' })}</small>
                    <br />
                    <Select
                      placeholder={formatMessage({ id: 'OrderLog.SystemUser' })}
                      value={systemUser}
                      style={{ width: '100%' }}
                      onChange={e => this.onChangeField(e, 'systemUser')}
                    >
                      <Option key="" value="">
                        {formatMessage({ id: 'OrderLog.None' })}
                      </Option>
                      <Option key="david" value="david">
                        {formatMessage({ id: 'OrderLog.david' })}
                      </Option>
                      <Option key="Denisa" value="Denisa">
                        {formatMessage({ id: 'OrderLog.Denisa' })}
                      </Option>
                      <Option key="Adela" value="Adela">
                        {formatMessage({ id: 'OrderLog.Adela' })}
                      </Option>
                      <Option key="justSales" value="justSales">
                        {formatMessage({ id: 'OrderLog.justSales' })}
                      </Option>
                      <Option key="Dany" value="Dany">
                        {formatMessage({ id: 'OrderLog.Dany' })}
                      </Option>
                    </Select>
                  </Col>
                  <Col sm={24} md={4}>
                    <small>{formatMessage({ id: 'OrderLog.NumberOfRecords' })}</small>
                    <br />
                    <Select
                      placeholder={formatMessage({ id: 'OrderLog.Limit' })}
                      value={limit}
                      style={{ width: '100%' }}
                      onChange={e => this.onChangeField(e, 'limit')}
                    >
                      <Option key={500} value={500}>
                        {formatMessage({ id: 'OrderLog.Last500' })}
                      </Option>
                      <Option key={1000} value={1000}>
                        {formatMessage({ id: 'OrderLog.Last1000' })}
                      </Option>
                      <Option key="" value="">
                        {formatMessage({ id: 'OrderLog.All' })}
                      </Option>
                    </Select>
                  </Col>
                  {Boolean(order) && (
                    <Col sm={24} md={5}>
                      <small> {formatMessage({ id: 'OrderLog.SearchByOrder' })}</small>
                      <br />
                      {order}
                      <Button
                        type="danger"
                        style={{ marginLeft: '10px' }}
                        onClick={() => this.searchByOrder('')}
                      >
                        {formatMessage({ id: 'OrderLog.CLEAR' })}
                      </Button>
                    </Col>
                  )}
                  {Boolean(user) && (
                    <Col sm={24} md={5}>
                      <small>{formatMessage({ id: 'OrderLog.SearchByUser' })}</small>
                      <br />
                      {user}
                      <Button
                        type="danger"
                        style={{ marginLeft: '10px' }}
                        onClick={() => this.searchByUser('')}
                      >
                        {formatMessage({ id: 'OrderLog.CLEAR' })}
                      </Button>
                    </Col>
                  )}
                </Row>
              </div>
            </div>
          </div>
        </div>
        <div className="utils__title utils__title--flat mb-3">
          <strong className="text-uppercase font-size-16">
            {formatMessage({ id: 'OrderLog.OrderLog' })}
          </strong>
          <Button className="ml-3" type="primary" onClick={this.update}>
            {formatMessage({ id: 'OrderLog.Refresh' })}
          </Button>
        </div>
        <div className="card card--fullHeight">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-12">
                <Table
                  tableLayout="auto"
                  scroll={{ x: '100%' }}
                  columns={columns}
                  dataSource={logs}
                  pagination={{
                    position: 'bottom',
                    total: logs.length,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100', '200'],
                    hideOnSinglePage: logs.length < 10,
                  }}
                  loading={loading}
                  rowKey={() => Math.random()}
                />
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default OrderLog
