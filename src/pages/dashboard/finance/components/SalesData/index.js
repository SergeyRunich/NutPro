import React from 'react'
import { useIntl } from 'react-intl'
import { Table, Tag, Statistic } from 'antd'

const SalesData = props => {
  const intl = useIntl()
  const titleDecode = {
    week: intl.formatMessage({ id: 'SalesData.1week' }),
    twoWeek: intl.formatMessage({ id: 'SalesData.2weeks' }),
    month: intl.formatMessage({ id: 'SalesData.1month' }),
    twoMonth: intl.formatMessage({ id: 'SalesData.2months' }),
    threeMonth: intl.formatMessage({ id: 'SalesData.3months' }),
    total: intl.formatMessage({ id: 'SalesData.MealsPerDay' }),
  }
  const columns = [
    {
      title: intl.formatMessage({ id: 'SalesData.Product' }),
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <span style={titleDecode[text] === 'meals per day' ? { fontWeight: 'bold' } : {}}>
          {`${titleDecode[text] === 'meals per day' ? record.mealsPerDay : ''} ${
            titleDecode[text]
          }`}
        </span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'SalesData.New' }),
      dataIndex: 'new',
      key: 'new',
      render: text => text,
    },
    {
      title: intl.formatMessage({ id: 'SalesData.Prolong' }),
      dataIndex: 'prolong',
      key: 'prolong',
      render: text => <span>{`${text}`}</span>,
    },
    {
      title: intl.formatMessage({ id: 'SalesData.Renew' }),
      dataIndex: 'renew',
      key: 'renew',
      render: text => <span>{`${text}`}</span>,
      sorter: (a, b) => a.factMeals - b.factMeals,
    },
    {
      title: intl.formatMessage({ id: 'SalesData.Total' }),
      dataIndex: 'total',
      key: 'total',
      render: text => <span>{`${text}`}</span>,
    },
    {
      title: intl.formatMessage({ id: 'SalesData.AveragePrice' }),
      dataIndex: 'average',
      key: 'average',
      render: text => {
        return <span>{text}</span>
      },
    },
    {
      title: intl.formatMessage({ id: 'SalesData.TotalPrice' }),
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: text => {
        if (text) {
          return (
            <Tag color="green" key="33434de3fe">
              {text}
            </Tag>
          )
        }
        return <span>{text}</span>
      },
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
  ]

  return (
    <div>
      {props.details.total && (
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
                      title={intl.formatMessage({ id: 'SalesData.OrdersTotal' })}
                      value={props.details.total.count}
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={intl.formatMessage({ id: 'SalesData.New' })}
                      value={props.details.total.new}
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={intl.formatMessage({ id: 'SalesData.Prolong' })}
                      value={props.details.total.prolong}
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={intl.formatMessage({ id: 'SalesData.Renew' })}
                      value={props.details.total.renew}
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={intl.formatMessage({ id: 'SalesData.TotalPrice' })}
                      value={props.details.total.totalPrice}
                      suffix="Kč"
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={intl.formatMessage({ id: 'SalesData.AveragePrice' })}
                      value={
                        props.details?.total > 0
                          ? Math.round(props.details.total.totalPrice / props.details.total.count)
                          : 0
                      }
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
        className="utils__scrollTable"
        tableLayout="auto"
        scroll={{ x: '100%' }}
        columns={columns}
        dataSource={props.data}
        pagination={{
          position: 'bottom',
          total: props.data.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '200'],
          hideOnSinglePage: props.data.length < 10,
        }}
        rowKey={() => Math.random().toString()}
      />
    </div>
  )
}

export default SalesData
