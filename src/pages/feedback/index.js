import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import {
  Button,
  notification,
  Select,
  DatePicker,
  Row,
  Col,
  List,
  Card,
  Rate,
  Divider,
  Statistic,
} from 'antd'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { getFeedback, getFeedbackDay, getFeedbackPeriod } from '../../api/feedback'
import { getAllKitchen } from '../../api/kitchen'

moment.updateLocale('en', {
  week: { dow: 1 },
})

const { Option } = Select
const { RangePicker } = DatePicker

@injectIntl
class FeedbackList extends React.Component {
  state = {
    period: 0,
    dates: ['', ''],
    feedbacks: [],
    loading: true,
    kitchens: [],
    kitchen: 'all',
    statistics: {},
  }

  constructor(props) {
    super(props)

    this.onCheck = this.onCheck.bind(this)
    this.onChangeKitchen = this.onChangeKitchen.bind(this)
  }

  componentDidMount() {
    getAllKitchen().then(async answer => {
      const json = await answer.json()
      this.setState({
        kitchens: json,
      })
    })
    getFeedback().then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        this.setState({
          feedbacks: json.result,
          loading: false,
          statistics: json.statistics,
        })
      } else {
        notification.error({
          message: 'Error',
          description: req.statusText,
        })
      }
    })
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

  onCheck() {
    const {
      intl: { formatMessage },
    } = this.props
    const { period, dates, kitchen } = this.state
    this.setState({
      loading: true,
    })
    if (Number(period) === 1) {
      getFeedbackDay(dates[0], kitchen).then(async req => {
        if (req.status === 200) {
          const json = await req.json()
          this.setState({
            feedbacks: json.result,
            loading: false,
            statistics: json.statistics,
          })
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
          })
        }
      })
    } else if (Number(period) === 2) {
      getFeedbackPeriod(dates[0], dates[1], kitchen).then(async req => {
        if (req.status === 200) {
          const json = await req.json()
          this.setState({
            feedbacks: json.result,
            loading: false,
            statistics: json.statistics,
          })
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
          })
        }
      })
    } else {
      getFeedback(kitchen).then(async req => {
        if (req.status === 200) {
          const json = await req.json()
          this.setState({
            feedbacks: json.result,
            loading: false,
            statistics: json.statistics,
          })
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
          })
        }
      })
    }
  }

  handleChangeCustomPeriod = async period => {
    const dates = [period[0].format('DD-MM-YYYY'), period[1].format('DD-MM-YYYY')]
    this.setState({ dates })
  }

  handleChangeCustomDay = async day => {
    const dates = [day.format('DD-MM-YYYY'), day.format('DD-MM-YYYY')]
    this.setState({ dates })
  }

  handleChangeCalendar = async value => {
    const value2 = value[1] ? value[1].format('DD-MM-YYYY') : ''
    this.setState({ dates: [value[0].format('DD-MM-YYYY'), value2] })
  }

  handleChangePeriod = async period => {
    this.setState({ period: period.key })
  }

  render() {
    const { feedbacks, period, loading, kitchens, kitchen, statistics } = this.state
    const {
      intl: { formatMessage },
    } = this.props
    return (
      <Authorize
        roles={['admin', 'root', 'production', 'finance', 'salesDirector']}
        redirect
        to="/main"
      >
        <Helmet title={formatMessage({ id: 'Feedback.Feedbacks' })} />
        <div className="row">
          <div className="col-xl-12">
            <div className="utils__title mb-3">
              <strong className="text-uppercase font-size-16">
                {formatMessage({ id: 'Feedback.Feedbacks' })}
              </strong>
            </div>
          </div>
        </div>
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
                      title={formatMessage({ id: 'Feedback.Total' })}
                      value={statistics.total}
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={formatMessage({ id: 'Feedback.DeliveryScoreAvg' })}
                      value={statistics.avgDeliveryScore}
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={formatMessage({ id: 'Feedback.FoodScoreAvg' })}
                      value={statistics.avgFoodScore}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card card--fullHeight">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12">
                    <Select
                      labelInValue
                      defaultValue={{ key: '0' }}
                      style={{ marginRight: '10px', width: 150 }}
                      onChange={this.handleChangePeriod}
                    >
                      <Option value="0">{formatMessage({ id: 'Feedback.AllTime' })}</Option>
                      <Option value="1">{formatMessage({ id: 'Feedback.SelectedDay' })}</Option>
                      <Option value="2">{formatMessage({ id: 'Feedback.SelectedRange' })}</Option>
                    </Select>
                    {Number(period) === 1 && (
                      <span>
                        <DatePicker
                          format="DD.MM.YYYY"
                          style={{ marginRight: '10px' }}
                          onChange={this.handleChangeCustomDay}
                          onCalendarChange={this.handleChangeCalendar}
                        />
                      </span>
                    )}
                    {Number(period) === 2 && (
                      <span>
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
                          // defaultValue={[moment(dates[0], 'DD-MM-YYYY'), moment(dates[1], 'DD-MM-YYYY')]}
                          format="DD.MM.YYYY"
                          style={{ marginRight: '10px' }}
                          onChange={this.handleChangeCustomPeriod}
                          onCalendarChange={this.handleChangeCalendar}
                        />
                      </span>
                    )}
                    <Select
                      value={kitchen}
                      style={{ width: '115px', marginRight: '10px' }}
                      onChange={this.onChangeKitchen}
                    >
                      <Option value="all">{formatMessage({ id: 'Feedback.All' })}</Option>
                      {kitchens.map(k => (
                        <Option key={k.id} value={k.id}>
                          {k.name}
                        </Option>
                      ))}
                    </Select>
                    <Button
                      onClick={this.onCheck}
                      type="primary"
                      size="default"
                      style={{ marginRight: '10px' }}
                    >
                      {formatMessage({ id: 'Feedback.View' })}
                    </Button>
                    <Divider />
                  </div>
                </div>
                <List
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 2,
                    lg: 2,
                    xl: 3,
                    xxl: 4,
                  }}
                  pagination={{
                    pageSize: 12,
                  }}
                  itemLayout="vertical"
                  dataSource={feedbacks}
                  loading={loading}
                  renderItem={item => (
                    <List.Item style={{ minHeight: '350px' }}>
                      <Card
                        style={{ minHeight: '300px' }}
                        hoverable
                        size="small"
                        title={<b>{item.user.name}</b>}
                        extra={<i>{moment(item.date).format('DD.MM.YYYY HH:mm')}</i>}
                      >
                        <Row>
                          <Col md={24} lg={12}>
                            <span>
                              <small>{formatMessage({ id: 'Feedback.DeliveryScore' })}</small>
                              <br />
                              <Rate
                                value={Number(item.deliveryScore)}
                                style={{ color: '#2fa037' }}
                                allowHalf
                                disabled
                              />
                            </span>
                          </Col>
                          <Col md={24} lg={12}>
                            <span>
                              <small>{formatMessage({ id: 'Feedback.FoodScore' })}</small>
                              <br />
                              <Rate
                                value={Number(item.foodScore)}
                                style={{ color: '#2fa037' }}
                                allowHalf
                                disabled
                              />
                            </span>
                          </Col>
                        </Row>
                        <hr />
                        {item.text}
                      </Card>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default FeedbackList
