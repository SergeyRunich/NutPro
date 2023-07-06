/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Link, withRouter } from 'react-router-dom'
import { Drawer, Table, Tag } from 'antd'

@injectIntl
@withRouter
class GeneratedMacro extends React.Component {
  // state = {
  //   data: [],
  // };

  constructor(props) {
    super(props)

    this.closeDrawer = this.closeDrawer.bind(this)
  }

  // componentWillReceiveProps() {
  //   const { data } = this.props
  //    this.setState({
  //      data,
  //    })
  // }

  closeDrawer() {
    const { onClose } = this.props
    onClose()
  }

  render() {
    const {
      visible,
      data,
      summary,
      intl: { formatMessage },
    } = this.props
    // const { data } = this.state

    const columnsSummary = [
      {
        title: formatMessage({ id: 'MainTest.cKalError' }),
        dataIndex: 'error',
        key: 'kcal',
        render: text => <span>{`${text}`}</span>,
      },
      {
        title: formatMessage({ id: 'MainTest.Monday' }),
        dataIndex: 'day1',
        key: 'day1',
        render: day => `${day.count} (${day.total})`,
      },
      {
        title: formatMessage({ id: 'MainTest.Tuesday' }),
        dataIndex: 'day2',
        key: 'day2',
        render: day => `${day.count} (${day.total})`,
      },
      {
        title: formatMessage({ id: 'MainTest.Wednesday' }),
        dataIndex: 'day3',
        key: 'day3',
        render: day => `${day.count} (${day.total})`,
      },
      {
        title: formatMessage({ id: 'MainTest.Thursday' }),
        dataIndex: 'day4',
        key: 'day4',
        render: day => `${day.count} (${day.total})`,
      },
      {
        title: formatMessage({ id: 'MainTest.Friday' }),
        dataIndex: 'day5',
        key: 'day5',
        render: day => `${day.count} (${day.total})`,
      },
      {
        title: formatMessage({ id: 'MainTest.Saturday' }),
        dataIndex: 'day6',
        key: 'day6',
        render: day => `${day.count} (${day.total})`,
      },
    ]

    const columns = [
      {
        title: formatMessage({ id: 'MainTest.kCal' }),
        dataIndex: 'kcal',
        key: 'kcal',
        render: text => <span>{`${text}`}</span>,
        sorter: (a, b) => a.kcal - b.kcal,
      },
      {
        title: formatMessage({ id: 'MainTest.Monday' }),
        dataIndex: 'day1',
        key: 'day1',
        render: text => {
          const color =
            Math.abs(text.error) <= 10 ? 'green' : Math.abs(text.error) <= 20 ? 'orange' : 'red'
          return (
            <Tag color={color}>
              {Math.round(text.kcal)} ({text.error > 0 ? '+' : ''}
              {Math.round(text.error)}%)
            </Tag>
          )
        },
        sorter: (a, b) => Math.abs(a.day1.error) - Math.abs(b.day1.error),
      },
      {
        title: formatMessage({ id: 'MainTest.Tuesday' }),
        dataIndex: 'day2',
        key: 'day2',
        render: text => {
          const color =
            Math.abs(text.error) <= 10 ? 'green' : Math.abs(text.error) <= 20 ? 'orange' : 'red'
          return (
            <Tag color={color}>
              {Math.round(text.kcal)} ({text.error > 0 ? '+' : ''}
              {Math.round(text.error)}%)
            </Tag>
          )
        },
        sorter: (a, b) => Math.abs(a.day2.error) - Math.abs(b.day2.error),
      },
      {
        title: formatMessage({ id: 'MainTest.Wednesday' }),
        dataIndex: 'day3',
        key: 'day3',
        render: text => {
          const color =
            Math.abs(text.error) <= 10 ? 'green' : Math.abs(text.error) <= 20 ? 'orange' : 'red'
          return (
            <Tag color={color}>
              {Math.round(text.kcal)} ({text.error > 0 ? '+' : ''}
              {Math.round(text.error)}%)
            </Tag>
          )
        },
        sorter: (a, b) => Math.abs(a.day3.error) - Math.abs(b.day3.error),
      },
      {
        title: formatMessage({ id: 'MainTest.Thursday' }),
        dataIndex: 'day4',
        key: 'day4',
        render: text => {
          const color =
            Math.abs(text.error) <= 10 ? 'green' : Math.abs(text.error) <= 20 ? 'orange' : 'red'
          return (
            <Tag color={color}>
              {Math.round(text.kcal)} ({text.error > 0 ? '+' : ''}
              {Math.round(text.error)}%)
            </Tag>
          )
        },
        sorter: (a, b) => Math.abs(a.day4.error) - Math.abs(b.day4.error),
      },
      {
        title: formatMessage({ id: 'MainTest.Friday' }),
        dataIndex: 'day5',
        key: 'day5',
        render: text => {
          const color =
            Math.abs(text.error) <= 10 ? 'green' : Math.abs(text.error) <= 20 ? 'orange' : 'red'
          return (
            <Tag color={color}>
              {Math.round(text.kcal)} ({text.error > 0 ? '+' : ''}
              {Math.round(text.error)}%)
            </Tag>
          )
        },
        sorter: (a, b) => Math.abs(a.day5.error) - Math.abs(b.day5.error),
      },
      {
        title: formatMessage({ id: 'MainTest.Saturday' }),
        dataIndex: 'day6',
        key: 'day6',
        render: text => {
          const color =
            Math.abs(text.error) <= 10 ? 'green' : Math.abs(text.error) <= 20 ? 'orange' : 'red'
          return (
            <Tag color={color}>
              {Math.round(text.kcal)} ({text.error > 0 ? '+' : ''}
              {Math.round(text.error)}%)
            </Tag>
          )
        },
        sorter: (a, b) => Math.abs(a.day6.error) - Math.abs(b.day6.error),
      },
      {
        title: formatMessage({ id: 'MainTest.MAXJump' }),
        dataIndex: 'maxJump',
        key: 'maxJump',
        render: text => {
          const color = Math.abs(text) <= 100 ? 'green' : Math.abs(text) <= 50 ? 'orange' : 'red'
          return <Tag color={color}>{Math.round(text)}</Tag>
        },
        sorter: (a, b) => a.maxJump - b.maxJump,
      },
    ]

    if (data.length && data[0].order) {
      columns.unshift({
        title: formatMessage({ id: 'MainTest.Order' }),
        dataIndex: 'order',
        key: 'order',
        render: order => (
          <Link to={`/orders/${order.id}`} target="_blank">
            {order.name}
          </Link>
        ),
      })

      columns.push({
        title: formatMessage({ id: 'MainTest.MealsPerDay' }),
        dataIndex: 'order',
        key: 'mealsPerdAy',
        render: order => order.mealsPerDay,
        sorter: (a, b) => a.order.mealsPerDay - b.order.mealsPerDay,
      })
    }
    return (
      <div>
        <Drawer
          title={formatMessage({ id: 'MainTest.cKalWeekTest' })}
          width="100%"
          onClose={this.closeDrawer}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          {Boolean(data.length) && Boolean(data[0].order) && (
            <div>
              <h4>{formatMessage({ id: 'MainTest.SummaryStats' })}</h4>
              <Table
                className="utils__scrollTable"
                tableLayout="auto"
                scroll={{ x: '100%' }}
                columns={columnsSummary}
                dataSource={summary}
                pagination={false}
                rowKey={() => Math.random()}
              />
              <br />
              <h4>{formatMessage({ id: 'MainTest.ResultsByRealOrders' })}</h4>
            </div>
          )}

          <Table
            className="utils__scrollTable"
            tableLayout="auto"
            scroll={{ x: '100%' }}
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey={() => Math.random()}
          />
        </Drawer>
      </div>
    )
  }
}

export default GeneratedMacro
