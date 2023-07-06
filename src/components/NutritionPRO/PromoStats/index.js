import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Link, NavLink } from 'react-router-dom'
import { Statistic, Row, Col, Table, Modal, DatePicker, Skeleton } from 'antd'

const { RangePicker } = DatePicker

@injectIntl
class PromoStats extends React.Component {
  state = {
    usesByCustomerVisible: false,
    selectedRecord: undefined,
    start: moment()
      .startOf('month')
      .unix(),
    end: moment()
      .endOf('month')
      .unix(),
  }

  componentWillMount() {
    const { start, end } = this.state
    this.props.getPromoStats(start, end)
  }

  handleChangePeriod = async period => {
    this.setState({ start: period[0].unix(), end: period[1].unix() })
    this.props.getPromoStats(
      moment(period[0].unix() * 1000).format('DD-MM-YYYY'),
      moment(period[1].unix() * 1000).format('DD-MM-YYYY'),
    )
  }

  showModal = record => {
    this.setState({
      selectedRecord: record,
      usesByCustomerVisible: true,
    })
  }

  handleOk = () => {
    this.setState({
      usesByCustomerVisible: false,
    })
  }

  handleCancel = () => {
    this.setState({
      usesByCustomerVisible: false,
    })
  }

  render() {
    const {
      data,
      intl: { formatMessage },
      promoStatsLoading,
    } = this.props

    const { usesByCustomerVisible, selectedRecord, start, end } = this.state
    const columns = [
      {
        title: formatMessage({ id: 'PromoStats.Code' }),
        dataIndex: 'code',
        key: 'code',
        render: (text, record) => {
          return (
            <NavLink
              onClick={e => {
                this.showModal(record)
                e.preventDefault()
              }}
              to="#"
            >
              <b>{text}</b>
            </NavLink>
          )
        },
      },
      {
        title: formatMessage({ id: 'PromoStats.Owner' }),
        dataIndex: 'owner',
        key: 'owner',
        render: text => {
          return text
        },
      },
      {
        title: formatMessage({ id: 'PromoStats.Amount' }),
        dataIndex: 'amount',
        key: 'amount',
        render: (amount, record) => {
          return (
            <span>
              {amount}
              {record.type === 'fixedAmount' ? 'Kč' : '%'}
            </span>
          )
        },
      },
      {
        title: formatMessage({ id: 'PromoStats.Users' }),
        dataIndex: 'totalUses',
        key: 'uses',
        render: uses => {
          return <span>{uses}</span>
        },
      },
      {
        title: formatMessage({ id: 'PromoStats.Discount' }),
        dataIndex: 'totalDiscount',
        key: 'totalDiscount',
        render: totalDiscount => {
          return <span>{totalDiscount}</span>
        },
      },
    ]
    return (
      <div className="card">
        <div className="card-header">
          <div className="utils__title" style={{ marginBottom: '-20px' }}>
            <strong className="text-uppercase font-size-14">
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
                style={{ marginRight: '10px', width: '75%' }}
              />
            </strong>
          </div>
        </div>
        {data && !promoStatsLoading && (
          <div style={{ marginTop: '20px' }} className="card-body">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="Total" value={data.total} />
              </Col>
              <Col span={8}>
                <Statistic title="Total uses" value={data.totalUses} />
              </Col>
              <Col span={8}>
                <Statistic title="Total discount" value={data.totalDiscount} />
              </Col>
            </Row>
            <Table
              tableLayout="auto"
              scroll={{ x: '100%' }}
              columns={columns}
              dataSource={data.codes}
              pagination={{
                position: 'bottom',
                total: data.total,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100', '200'],
                hideOnSinglePage: data.length < 10,
              }}
              loading={this.state.loading}
              rowKey={() => Math.random()}
            />
            <Modal
              title="Orders with promocode"
              visible={usesByCustomerVisible}
              onOk={this.handleOk}
              cancelButtonProps={{ hidden: true }}
              onCancel={this.handleCancel}
            >
              {data &&
                data.length !== 0 &&
                selectedRecord !== undefined &&
                selectedRecord.usesByOrder.map(order => {
                  return (
                    <p key={order.id}>
                      <Link to={`/orders/${order.id}`} target="_blank" rel="noopener noreferrer">
                        {order.name}
                      </Link>{' '}
                      - {order.discount} Kč
                    </p>
                  )
                })}
            </Modal>
          </div>
        )}
        {!data ||
          (promoStatsLoading && (
            <div className="card-body">
              <Skeleton />
            </div>
          ))}
      </div>
    )
  }
}

export default PromoStats
