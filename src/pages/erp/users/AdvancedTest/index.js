/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Link, withRouter } from 'react-router-dom'
import { Drawer, Table, Tag } from 'antd'

@injectIntl
@withRouter
class AdvancedTest extends React.Component {
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
      days,
      intl: { formatMessage },
    } = this.props
    // const { data } = this.state

    const columnsSummary = [
      {
        title: formatMessage({ id: 'AdvancedTest.kCalError' }),
        dataIndex: 'error',
        key: 'kcal',
        render: text => <span>{`${text}`}</span>,
      },
      {
        title: days ? days[0] : '-',
        dataIndex: 'day1',
        key: 'day1',
        render: day => `${day.count} (${day.total})`,
      },
      {
        title: days ? days[1] : '-',
        dataIndex: 'day2',
        key: 'day2',
        render: day => `${day.count} (${day.total})`,
      },
      {
        title: days ? days[2] : '-',
        dataIndex: 'day3',
        key: 'day3',
        render: day => `${day.count} (${day.total})`,
      },
      {
        title: days ? days[3] : '-',
        dataIndex: 'day4',
        key: 'day4',
        render: day => `${day.count} (${day.total})`,
      },
      {
        title: days ? days[4] : '-',
        dataIndex: 'day5',
        key: 'day5',
        render: day => `${day.count} (${day.total})`,
      },
      {
        title: days ? days[5] : '-',
        dataIndex: 'day6',
        key: 'day6',
        render: day => `${day.count} (${day.total})`,
      },
    ]

    const columns = [
      {
        title: formatMessage({ id: 'AdvancedTest.kCal' }),
        dataIndex: 'kcal',
        key: 'kcal',
        render: text => <span>{`${text}`}</span>,
        sorter: (a, b) => a.kcal - b.kcal,
      },
    ]

    for (let i = 0; i < 6; i += 1) {
      columns.push({
        title: days ? days[i] : '-',
        dataIndex: 'days',
        key: `day${i}`,
        render: daysValue => {
          if (daysValue[i].kcal === 0) return '-'
          const color =
            Math.abs(daysValue[i].error) <= 10
              ? 'green'
              : Math.abs(daysValue[i].error) <= 20
              ? 'orange'
              : 'red'
          return (
            <Tag color={color}>
              {Math.round(daysValue[i].kcal)} ({daysValue[i].error > 0 ? '+' : ''}
              {Math.round(daysValue[i].error)}%)
            </Tag>
          )
        },
        sorter: (a, b) => Math.abs(a.days[i].error) - Math.abs(b.days[i].error),
      })
    }

    columns.push({
      title: formatMessage({ id: 'AdvancedTest.MAXJump' }),
      dataIndex: 'maxJump',
      key: 'maxJump',
      render: text => {
        const color = Math.abs(text) <= 100 ? 'green' : Math.abs(text) <= 50 ? 'orange' : 'red'
        return <Tag color={color}>{Math.round(text)}</Tag>
      },
      sorter: (a, b) => a.maxJump - b.maxJump,
    })

    if (data.length && data[0].order) {
      columns.unshift({
        title: formatMessage({ id: 'AdvancedTest.Order' }),
        dataIndex: 'order',
        key: 'order',
        render: order => (
          <Link to={`/orders/${order.id}`} target="_blank">
            {order.name}
          </Link>
        ),
      })

      columns.push({
        title: formatMessage({ id: 'AdvancedTest.MealsPerDay' }),
        dataIndex: 'order',
        key: 'mealsPerdAy',
        render: order => order.mealsPerDay,
        sorter: (a, b) => a.order.mealsPerDay - b.order.mealsPerDay,
      })
    }
    return (
      <div>
        <Drawer
          title={formatMessage({ id: 'AdvancedTest.kCalAdvancedTest' })}
          width="100%"
          onClose={this.closeDrawer}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          {Boolean(data.length) && Boolean(data[0].order) && (
            <div>
              <h4>{formatMessage({ id: 'AdvancedTest.SummaryStats' })}</h4>
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
              <h4>{formatMessage({ id: 'AdvancedTest.ResultsByProductionData' })}</h4>
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

export default AdvancedTest
