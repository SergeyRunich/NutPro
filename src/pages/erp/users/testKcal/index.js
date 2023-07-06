/* eslint-disable no-nested-ternary */
import React from 'react'
import { injectIntl } from 'react-intl'
// import moment from 'moment'
import { Helmet } from 'react-helmet'
import { Link, withRouter } from 'react-router-dom'
import { Table, notification, Popover, Tag, Button } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { getUsersKcal, getUsersAdvancedTest } from '../../../../api/erp/users'

import AdvancedTest from '../AdvancedTest'

@injectIntl
@withRouter
class UsersKcal extends React.Component {
  state = {
    users: [],
    days: [],
    loading: true,
    loadingAdvanced: false,
    advancedDays: [],
    advancedData: [],
    advancedSummary: [],
    advancedTestVisible: false,
  }

  constructor(props) {
    super(props)

    this.update = this.update.bind(this)
    this.onCloseTest = this.onCloseTest.bind(this)
  }

  componentDidMount() {
    this.update()
  }

  onCloseTest() {
    this.setState({ advancedTestVisible: false })
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
    this.setState({
      loading: true,
    })
    getUsersKcal().then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        this.setState({
          users: json.result,
          days: json.days,
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

  async loadAdvancedTest() {
    const {
      intl: { formatMessage },
    } = this.props
    try {
      this.setState({ loadingAdvanced: true })
      const req = await getUsersAdvancedTest()
      if (req.status === 200) {
        const json = await req.json()
        this.setState({
          advancedData: json.result,
          advancedSummary: json.summary,
          advancedDays: json.days,
          loadingAdvanced: false,
          advancedTestVisible: true,
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
          placement: 'topLeft',
        })
        this.setState({ loadingAdvanced: false })
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const {
      users,
      loading,
      days,
      advancedData,
      advancedDays,
      advancedSummary,
      advancedTestVisible,
      loadingAdvanced,
    } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    const columns = [
      {
        title: formatMessage({ id: 'TestKcal.USER' }),
        dataIndex: 'user',
        key: 'user',
        // sorter: (a, b) => a.user.name.length - b.user.name.length,
        render: userCol => <Link to={`/users/${userCol.id}`}>{userCol.name}</Link>,
      },
      {
        title: formatMessage({ id: 'TestKcal.SOULDBE' }),
        dataIndex: 'shouldBe',
        key: 'shouldBe',
        // sorter: (a, b) => a.systemUser.length - b.systemUser.length,
        render: shouldBe => {
          const content = (
            <div>
              <p>
                <b>{formatMessage({ id: 'TestKcal.ValueInOrder:SPACE' })}</b>{' '}
                {Math.round(shouldBe.energy)} kCal
              </p>
              <p>
                <b>{formatMessage({ id: 'TestKcal.MealSkipped:SPACE' })}</b>{' '}
                {Math.round(shouldBe.kcal) - Math.round(shouldBe.energy)} kCal
              </p>
              <p>
                <b>{formatMessage({ id: 'TestKcal.ShouldBe:SPACE' })}</b>{' '}
                {Math.round(shouldBe.kcal)} kCal
              </p>
            </div>
          )
          return (
            <Popover content={content} title="Ditails">
              <div>
                <Tag color="blue">
                  {shouldBe.kcal} {formatMessage({ id: 'TestKcal.SPACE100%' })}
                </Tag>
              </div>
            </Popover>
          )
        },
      },
      // {
      //   title: 'ORDER',
      //   dataIndex: 'order',
      //   key: 'order',
      //   render: orderCol => <Link to={`/orders/${orderCol}`}>{orderCol}</Link>,
      // },
    ]

    days.forEach(day => {
      columns.push({
        title: day.date,
        dataIndex: day.index,
        key: day.date,
        // sorter: (a, b) => a.systemUser.length - b.systemUser.length,
        render: (i, record) => {
          if (i) {
            const donePercent = (
              (Math.round(i.kcal) / Math.round(record.shouldBe.kcal)) *
              100
            ).toFixed(1)
            const errorPercent = (
              100 -
              (Math.round(i.kcal) / Math.round(record.shouldBe.kcal)) * 100
            ).toFixed(1)
            const difference = Math.round(i.kcal) - Math.round(record.shouldBe.kcal)
            const color =
              Math.abs(errorPercent) <= 10
                ? 'green'
                : Math.abs(errorPercent) <= 20
                ? 'orange'
                : 'red'
            const content = (
              <div>
                <p>
                  <b>{formatMessage({ id: 'TestKcal.ShouldBe:SPACE' })}</b>{' '}
                  {Math.round(record.shouldBe.kcal)} kCal
                </p>
                <p>
                  <b>{formatMessage({ id: 'TestKcal.Generated:SPACE' })}</b> {Math.round(i.kcal)}{' '}
                  kCal
                </p>
                <p>
                  <b>{formatMessage({ id: 'TestKcal.Difference:SPACE' })}</b>{' '}
                  {difference > 0 ? '+' : ''}
                  {difference} kCal
                </p>
                <p>
                  <b>{formatMessage({ id: 'TestKcal.Error:SPACE' })}</b> {errorPercent}%
                </p>
                <p>
                  <b>{formatMessage({ id: 'TestKcal.ORDER:SPACE' })}</b>{' '}
                  <Link to={`/orders/${record.order}`}>{record.order}</Link>
                </p>
              </div>
            )
            return (
              <Popover content={content} title={formatMessage({ id: 'TestKcal.Details' })}>
                <div>
                  <Tag color={color}>
                    {Math.round(i.kcal)} ({donePercent}%)
                  </Tag>
                </div>
              </Popover>
            )
          }
          return <div>-</div>
        },
      })
    })

    return (
      <Authorize roles={['root', 'admin', 'sales', 'salesDirector']}>
        <Helmet title={formatMessage({ id: 'TestKcal.UserKcalTest' })} />
        <div className="utils__title utils__title--flat mb-3">
          <strong className="text-uppercase font-size-16">
            {formatMessage({ id: 'TestKcal.UserKcalTest' })}
          </strong>
        </div>
        <div className="card card--fullHeight">
          <div className="card-body">
            <Button
              style={{ marginBottom: '30px' }}
              onClick={async () => this.loadAdvancedTest()}
              loading={loadingAdvanced}
            >
              {formatMessage({ id: 'TestKcal.AdvancedTest' })}
            </Button>
            <div className="row">
              <div className="col-lg-12">
                <Table
                  // className="utils__scrollTable"
                  tableLayout="auto"
                  scroll={{ x: '100%' }}
                  columns={columns}
                  dataSource={users}
                  pagination={{
                    position: 'bottom',
                    total: users.length,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100', '200'],
                    hideOnSinglePage: users.length < 10,
                  }}
                  loading={loading}
                  rowKey={() => Math.random()}
                />
              </div>
            </div>
          </div>
        </div>
        <AdvancedTest
          visible={advancedTestVisible}
          data={advancedData}
          days={advancedDays}
          onClose={this.onCloseTest}
          summary={advancedSummary}
        />
      </Authorize>
    )
  }
}

export default UsersKcal
