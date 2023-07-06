import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import moment from 'moment'
import { Table, Tag, Statistic, Popover } from 'antd'

function MarginByPeriod({ data }) {
  const columns = [
    {
      title: <FormattedMessage id="global.date" />,
      dataIndex: 'timestamp',
      key: 'date',
      render: text => <span>{`${moment.unix(text).format('DD.MM.YYYY')}`}</span>,
      sorter: (a, b) => a.timestamp - b.timestamp,
    },
    {
      title: <FormattedMessage id="KitchenByPeriod.5ch" />,
      dataIndex: 'fivePerDay',
      key: '5chodovych',
      render: text => {
        const content = (
          <div>
            <p>0-1400: {text.kcal[0]}</p>
            <p>1400-1600: {text.kcal[1]}</p>
            <p>1600-1800: {text.kcal[2]}</p>
            <p>1800-2400: {text.kcal[3]}</p>
            <p>2400-3000: {text.kcal[4]}</p>
            <p>{`>3000: ${text.kcal[5]}`}</p>
          </div>
        )
        return (
          <Popover content={content} title="Details">
            <a>{text.total}</a>
          </Popover>
        )
      },
      sorter: (a, b) => a.fivePerDay.total - b.fivePerDay.total,
    },
    {
      title: <FormattedMessage id="KitchenByPeriod.3ch" />,
      dataIndex: 'threePerDay',
      key: '3chodovych',
      render: text => {
        const content = (
          <div>
            <p>0-1400: {text.kcal[0]}</p>
            <p>1400-1600: {text.kcal[1]}</p>
            <p>1600-1800: {text.kcal[2]}</p>
            <p>1800-2400: {text.kcal[3]}</p>
            <p>2400-3000: {text.kcal[4]}</p>
            <p>{`>3000: ${text.kcal[5]}`}</p>
          </div>
        )
        return (
          <Popover content={content} title="Details">
            <a>{text.total}</a>
          </Popover>
        )
      },
      sorter: (a, b) => a.threePerDay.total - b.threePerDay.total,
    },
    {
      title: <FormattedMessage id="KitchenByPeriod.HO" />,
      dataIndex: 'twoPerDay',
      key: 'HO',
      render: text => <span>{`${text}`}</span>,
      sorter: (a, b) => a.twoPerDay - b.twoPerDay,
    },
    {
      title: <FormattedMessage id="KitchenByPeriod.Other" />,
      dataIndex: 'otherPerDay',
      key: 'otherPerDay',
      render: text => <span>{`${text}`}</span>,
      sorter: (a, b) => a.otherPerDay - b.otherPerDay,
    },
    {
      title: <FormattedMessage id="KitchenByPeriod.ExtraObed/vecere" />,
      dataIndex: 'extraMain',
      key: 'extraMain',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.length - b.length,
    },
    {
      title: <FormattedMessage id="KitchenByPeriod.ExtraSvacin" />,
      dataIndex: 'extraOption',
      key: 'extraOption',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.length - b.length,
    },
    {
      title: <FormattedMessage id="KitchenByPeriod.VynechaniObed/vecere" />,
      dataIndex: 'exeptMain',
      key: 'exeptMain',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.length - b.length,
    },
    {
      title: <FormattedMessage id="KitchenByPeriod.VynechaniSvacin" />,
      dataIndex: 'exeptOption',
      key: 'exeptOption',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.length - b.length,
    },
    {
      title: <FormattedMessage id="KitchenByPeriod.CelkemKlientu" />,
      dataIndex: 'totalCustomers',
      key: 'totalCustomers',
      render: text => {
        return (
          <Tag color="geekblue" key="dfdfddffdfe">
            {text}
          </Tag>
        )
      },
      sorter: (a, b) => a.pricePerDay - b.pricePerDay,
    },
    {
      title: <FormattedMessage id="KitchenByPeriod.FoodCostZaDen" />,
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: text => {
        return (
          <Tag color="blue" key="33434de3fe">
            {text}
          </Tag>
        )
      },
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: <FormattedMessage id="KitchenByPeriod.CustomerCostZaDen" />,
      dataIndex: 'customerCost',
      key: 'customerCost',
      render: text => {
        return (
          <Tag color="green" key="33434de3fe">
            {text}
          </Tag>
        )
      },
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
  ]

  return (
    <div>
      {data.foodCost && (
        <>
          <div className="row">
            <div className="col-lg-12">
              <div className="card card--fullHeight">
                <div className="card-body">
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <Statistic
                        style={{ textAlign: 'center' }}
                        title={<FormattedMessage id="KitchenByPeriod.Days" />}
                        value={data.result.length}
                      />
                    </div>
                    <div>
                      <Statistic
                        style={{ textAlign: 'center' }}
                        title={<FormattedMessage id="KitchenByPeriod.TotalSets" />}
                        value={data.sets}
                      />
                    </div>
                    <div>
                      <Statistic
                        style={{ textAlign: 'center' }}
                        title={<FormattedMessage id="KitchenByPeriod.Avg.CustomersPerDay" />}
                        value={(data.sets / data.result.length).toFixed(2)}
                      />
                    </div>
                    <div>
                      <Statistic
                        style={{ textAlign: 'center' }}
                        title={<FormattedMessage id="KitchenByPeriod.TotalFoodCost" />}
                        value={data.foodCost.basic}
                        suffix="Kč"
                      />
                    </div>
                    <div>
                      <Statistic
                        style={{ textAlign: 'center' }}
                        title={<FormattedMessage id="KitchenByPeriod.Avg.f/cPerDay" />}
                        value={Math.round(data.foodCost.basic / data.result.length)}
                        suffix="Kč"
                      />
                    </div>
                    <div>
                      <Statistic
                        style={{ textAlign: 'center' }}
                        title={<FormattedMessage id="KitchenByPeriod.Avg.f/cForCustomerPerDay" />}
                        value={(
                          data.foodCost.basic /
                          data.result.length /
                          (data.sets / data.result.length)
                        ).toFixed(2)}
                        suffix="Kč"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-lg-12">
              <div className="card card--fullHeight">
                <div className="card-body">
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <Statistic
                        style={{ textAlign: 'center' }}
                        title={<FormattedMessage id="KitchenByPeriod.TotalRevenue" />}
                        value={data.customerCost.total}
                        suffix="Kč"
                      />
                    </div>
                    <div>
                      <Statistic
                        style={{ textAlign: 'center' }}
                        title={<FormattedMessage id="KitchenByPeriod.RevenueInvoiced" />}
                        value={data.customerCost.invoiced}
                        suffix="Kč"
                      />
                    </div>

                    <div>
                      <Statistic
                        style={{ textAlign: 'center' }}
                        title={<FormattedMessage id="KitchenByPeriod.RevenuePaid" />}
                        value={data.customerCost.paid}
                        suffix="Kč"
                      />
                    </div>
                    <div>
                      <Statistic
                        style={{ textAlign: 'center' }}
                        title={<FormattedMessage id="KitchenByPeriod.F/cWithTax" />}
                        value={data.foodCost.withTax}
                        suffix="Kč"
                      />
                    </div>
                    <div>
                      <Statistic
                        style={{ textAlign: 'center' }}
                        title={<FormattedMessage id="KitchenByPeriod.DeliveryCost" />}
                        value={data.deliveryCost}
                        suffix="Kč"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-lg-12">
              <div className="card card--fullHeight">
                <div className="card-body">
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <Statistic
                        style={{ textAlign: 'center' }}
                        title={<FormattedMessage id="KitchenByPeriod.NetRevenueInvoiced" />}
                        value={data.revenue.invoiced}
                        suffix="Kč"
                      />
                    </div>
                    <div>
                      <Statistic
                        style={{ textAlign: 'center' }}
                        title={<FormattedMessage id="KitchenByPeriod.MarginInvoiced" />}
                        value={data.margin.invoiced}
                        suffix="%"
                      />
                    </div>
                    <div>
                      <Statistic
                        style={{ textAlign: 'center' }}
                        title={<FormattedMessage id="KitchenByPeriod.NetRevenuePaid" />}
                        value={data.revenue.paid}
                        suffix="Kč"
                      />
                    </div>
                    <div>
                      <Statistic
                        style={{ textAlign: 'center' }}
                        title={<FormattedMessage id="KitchenByPeriod.MarginPaid" />}
                        value={data.margin.paid}
                        suffix="%"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <Table
        tableLayout="auto"
        scroll={{ x: '100%' }}
        columns={columns}
        dataSource={data.result}
        pagination={{
          position: 'bottom',
          total: data && data.result ? data.result.length : 0,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '200'],
          hideOnSinglePage: data && data.result && data.result.length < 10,
        }}
        rowKey={() => Math.random()}
      />
    </div>
  )
}

export default injectIntl(MarginByPeriod)
