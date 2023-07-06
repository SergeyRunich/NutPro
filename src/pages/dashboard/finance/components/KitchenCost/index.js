import React from 'react'
import { useIntl } from 'react-intl'
import moment from 'moment'
import { Table, Tag, Statistic, Popover } from 'antd'

function KitchenCost({ data }) {
  const intl = useIntl()
  const { formatMessage } = intl
  const columns = [
    {
      title: formatMessage({ id: 'global.date' }),
      dataIndex: 'timestamp',
      key: 'date',
      render: text => <span>{`${moment.unix(text).format('DD.MM.YYYY')}`}</span>,
      sorter: (a, b) => a.timestamp - b.timestamp,
    },
    {
      title: formatMessage({ id: 'KitchenCost.5ch' }),
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
      title: formatMessage({ id: 'KitchenCost.3ch' }),
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
      title: formatMessage({ id: 'KitchenCost.HO' }),
      dataIndex: 'twoPerDay',
      key: 'HO',
      render: text => <span>{`${text}`}</span>,
      sorter: (a, b) => a.twoPerDay - b.twoPerDay,
    },
    {
      title: formatMessage({ id: 'KitchenCost.Other' }),
      dataIndex: 'otherPerDay',
      key: 'otherPerDay',
      render: text => <span>{`${text}`}</span>,
      sorter: (a, b) => a.otherPerDay - b.otherPerDay,
    },
    {
      title: formatMessage({ id: 'KitchenCost.ExtraObed/vecere' }),
      dataIndex: 'extraMain',
      key: 'extraMain',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.length - b.length,
    },
    {
      title: formatMessage({ id: 'KitchenCost.ExtraSvacin' }),
      dataIndex: 'extraOption',
      key: 'extraOption',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.length - b.length,
    },
    {
      title: formatMessage({ id: 'KitchenCost.VynechaniObed/vecere' }),
      dataIndex: 'exceptMain',
      key: 'exceptMain',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.length - b.length,
    },
    {
      title: formatMessage({ id: 'KitchenCost.VynechaniSvacin' }),
      dataIndex: 'exceptOption',
      key: 'exceptOption',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.length - b.length,
    },
    {
      title: formatMessage({ id: 'KitchenCost.CelkemKlientu' }),
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
      title: formatMessage({ id: 'KitchenCost.CelkemZaDen' }),
      dataIndex: 'totalPrice',
      key: 'totalPrice',
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
      {data.totalPrice && (
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
                      title={formatMessage({ id: 'KitchenCost.Days' })}
                      value={data.result.length}
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={formatMessage({ id: 'KitchenCost.TotalSets' })}
                      value={data.totalCustomers}
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={formatMessage({ id: 'KitchenCost.TotalDishes' })}
                      value={data.totalDishes}
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={formatMessage({ id: 'KitchenCost.AverageCustomersPerDay' })}
                      value={(data.totalCustomers / data.result.length).toFixed(2)}
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={formatMessage({ id: 'KitchenCost.TotalPrice' })}
                      value={data.totalPrice}
                      suffix="Kč"
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={formatMessage({ id: 'KitchenCost.AveragePricePerDay' })}
                      value={Math.round(data.totalPrice / data.result.length)}
                      suffix="Kč"
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={formatMessage({ id: 'KitchenCost.AverageCostForCustomerPerDay' })}
                      value={(
                        data.totalPrice /
                        data.result.length /
                        (data.totalCustomers / data.result.length)
                      ).toFixed(2)}
                      suffix="Kč"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        rowKey={() => Math.random().toString()}
      />
    </div>
  )
}

export default KitchenCost
