import React from 'react'
import { injectIntl } from 'react-intl'
import { Table, Tag, Row, Col, Statistic } from 'antd'

@injectIntl
class SalesData extends React.Component {
  render() {
    const {
      data,
      details,
      intl: { formatMessage },
    } = this.props

    const titleDecode = {
      week: formatMessage({ id: 'SalesData.1week' }),
      twoWeek: formatMessage({ id: 'SalesData.2weeks' }),
      month: formatMessage({ id: 'SalesData.1month' }),
      twoMonth: formatMessage({ id: 'SalesData.2months' }),
      threeMonth: formatMessage({ id: 'SalesData.3months' }),
      total: formatMessage({ id: 'SalesData.mealsPerDay' }),
    }
    const columns = [
      {
        title: formatMessage({ id: 'SalesData.Product' }),
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <span style={titleDecode[text] === 'meals per day' ? { fontWeight: 'bold' } : {}}>
            {`${
              titleDecode[text] === formatMessage({ id: 'SalesData.mealsPerDay' })
                ? record.mealsPerDay
                : ''
            } ${titleDecode[text]}`}
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'SalesData.New' }),
        dataIndex: 'new',
        key: 'new',
        render: text => text,
      },
      {
        title: formatMessage({ id: 'SalesData.Prolong' }),
        dataIndex: 'prolong',
        key: 'prolong',
        render: text => <span>{`${text}`}</span>,
      },
      {
        title: formatMessage({ id: 'SalesData.Renew' }),
        dataIndex: 'renew',
        key: 'renew',
        render: text => <span>{`${text}`}</span>,
        sorter: (a, b) => a.factMeals - b.factMeals,
      },
      {
        title: formatMessage({ id: 'SalesData.Total' }),
        dataIndex: 'total',
        key: 'total',
        render: text => <span>{`${text}`}</span>,
      },
      {
        title: formatMessage({ id: 'SalesData.AveragePrice' }),
        dataIndex: 'average',
        key: 'average',
        render: text => {
          return <span>{text}</span>
        },
      },
      {
        title: formatMessage({ id: 'SalesData.TotalPrice' }),
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
        {details.total && (
          <Row>
            <Col sm={24} lg={4}>
              <Statistic
                title={formatMessage({ id: 'SalesData.Orders(total)' })}
                value={details.total.count}
              />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic title={formatMessage({ id: 'SalesData.New' })} value={details.total.new} />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic
                title={formatMessage({ id: 'SalesData.Prolong' })}
                value={details.total.prolong}
              />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic
                title={formatMessage({ id: 'SalesData.Renew' })}
                value={details.total.renew}
              />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic
                title={formatMessage({ id: 'SalesData.TotalPrice' })}
                value={details.total.totalPrice}
                suffix="Kč"
              />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic
                title={formatMessage({ id: 'SalesData.AveragePrice' })}
                value={Math.round(details.total.totalPrice / details.total.count)}
                suffix="Kč"
              />
            </Col>
          </Row>
        )}
        <Table
          className="utils__scrollTable"
          tableLayout="auto"
          scroll={{ x: '100%' }}
          columns={columns}
          dataSource={data}
          pagination={{
            position: 'bottom',
            total: data.length,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100', '200'],
            hideOnSinglePage: data.length < 10,
          }}
          rowKey={() => Math.random()}
        />
      </div>
    )
  }
}

export default SalesData
