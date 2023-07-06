/* eslint-disable array-callback-return */
/* eslint-disable prefer-destructuring */
import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'

import { Select, Radio, message, List, Statistic, Row, Col } from 'antd'

const { Option } = Select

const mealCodes = ['Breakfast', 'Snack 1', 'Lunch', 'Snack 2', 'Dinner', 'Dinner 2']

@injectIntl
class MenuList extends React.Component {
  state = {
    currentDay: moment
      .utc()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .add(2, 'days')
      .unix(),
    currentWeek: 0,
    weekLabel: [{ key: '', value: '' }],
  }

  componentDidMount() {
    // const { data } = this.props

    const weekLabel = []
    let startOfWeek = moment.utc().startOf('isoWeek')
    let endOfWeek = moment.utc().endOf('isoWeek')
    weekLabel.push({
      key: startOfWeek.unix(),
      value: `${startOfWeek.format('DD MMM')} - ${endOfWeek.format('DD MMM')}`,
    })

    startOfWeek = moment
      .utc()
      .add(1, 'week')
      .startOf('isoWeek')
    endOfWeek = moment
      .utc()
      .add(1, 'week')
      .endOf('isoWeek')
    weekLabel.push({
      key: startOfWeek.unix(),
      value: `${startOfWeek.format('DD MMM')} - ${endOfWeek.format('DD MMM')}`,
    })
    this.setState({
      weekLabel,
      currentWeek: moment
        .utc()
        .startOf('isoWeek')
        .unix(),
    })
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

  handleChangeWeek = async week => {
    this.setState({ currentWeek: Number(week) })
  }

  handleChangeDay = async day => {
    this.setState({ currentDay: Number(day.target.value) })
  }

  calculate = async e => {
    const { form } = this.props
    e.preventDefault()
    await form.validateFields()
    const { gender, age, weight, height, PBF, PAL, type } = this.state
    const mcArdle = 370 + 21.6 * (weight - weight * (PBF / 100) - 2.5)
    const hb =
      gender === 'Male'
        ? 66 + 13.7 * weight + 5 * height - 6.8 * age
        : 655 + 9.6 * weight + 1.8 * height - 4.7 * age
    const calcBMR = type === 'mcArdle' ? mcArdle * PAL : hb * PAL
    this.setState({ calcBMR: Math.round(calcBMR) })
  }

  copy = () => {
    const { calcBMR } = this.state
    const {
      copy,
      intl: { formatMessage },
    } = this.props
    if (copy(calcBMR)) {
      message.success(formatMessage({ id: 'Orders.Copied' }))
    }
  }

  findDay = (days, timestamp) => {
    let current = {}
    if (days) {
      days.map(day => {
        if (day.timestamp === timestamp) current = day
      })
    }
    return current
  }

  render() {
    const { weekLabel, currentWeek, currentDay } = this.state
    const {
      customParams,
      data,
      intl: { formatMessage },
    } = this.props

    const day = this.findDay(data, currentDay)

    return (
      <Row>
        <Col sm={24} lg={8}>
          <div style={{ marginRight: '20px', marginBottom: '20px', textAlign: 'center' }}>
            <Select
              placeholder={formatMessage({ id: 'Orders.Week' })}
              value={currentWeek}
              onChange={this.handleChangeWeek}
              style={{ marginBottom: '20px' }}
            >
              {weekLabel.map(week => (
                <Option key={week.key} value={week.key}>
                  {week.value}
                </Option>
              ))}
            </Select>
            <br />
            <Radio.Group
              key="weekDays"
              value={currentDay}
              onChange={this.handleChangeDay}
              style={{ marginBottom: '20px' }}
            >
              <Radio.Button value={currentWeek}>{formatMessage({ id: 'Orders.Mon' })}</Radio.Button>
              <Radio.Button
                value={moment
                  .unix(currentWeek)
                  .add(1, 'days')
                  .unix()}
              >
                {formatMessage({ id: 'Orders.Tue' })}
              </Radio.Button>
              <Radio.Button
                value={moment
                  .unix(currentWeek)
                  .add(2, 'days')
                  .unix()}
              >
                {formatMessage({ id: 'Orders.Wed' })}
              </Radio.Button>
              <Radio.Button
                value={moment
                  .unix(currentWeek)
                  .add(3, 'days')
                  .unix()}
              >
                {formatMessage({ id: 'Orders.Thu' })}
              </Radio.Button>
              <Radio.Button
                value={moment
                  .unix(currentWeek)
                  .add(4, 'days')
                  .unix()}
              >
                {formatMessage({ id: 'Orders.Fri' })}
              </Radio.Button>
              <Radio.Button
                value={moment
                  .unix(currentWeek)
                  .add(5, 'days')
                  .unix()}
              >
                {formatMessage({ id: 'Orders.Sat' })}
              </Radio.Button>
            </Radio.Group>
            <h3>
              {moment.weekdays(moment.unix(currentDay).isoWeekday())}{' '}
              {moment.unix(currentDay).format('DD-MM-YYYY')}
            </h3>
            <h4>{formatMessage({ id: 'Orders.ShouldBe' })}</h4>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Statistic
                style={{}}
                title={formatMessage({ id: 'Orders.kCal' })}
                value={customParams.kcal}
              />
              <Statistic
                style={{ marginLeft: '7px' }}
                title={formatMessage({ id: 'Orders.Protein' })}
                value={customParams.prot}
              />
              <Statistic
                style={{ marginLeft: '7px' }}
                title={formatMessage({ id: 'Orders.Fat' })}
                value={customParams.fat}
              />
              <Statistic
                style={{ marginLeft: '7px' }}
                title={formatMessage({ id: 'Orders.Carbo' })}
                value={customParams.carb}
              />
            </div>
            <h4>{formatMessage({ id: 'Orders.Generated' })}</h4>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Statistic
                title={formatMessage({ id: 'Orders.kCal' })}
                value={day.nutrients ? day.nutrients.kcal : ''}
              />
              <Statistic
                style={{ marginLeft: '7px' }}
                title={formatMessage({ id: 'Orders.Protein' })}
                value={day.nutrients ? day.nutrients.prot : ''}
              />
              <Statistic
                style={{ marginLeft: '7px' }}
                title={formatMessage({ id: 'Orders.Fat' })}
                value={day.nutrients ? day.nutrients.fat : ''}
              />
              <Statistic
                style={{ marginLeft: '7px' }}
                title={formatMessage({ id: 'Orders.Carbo' })}
                value={day.nutrients ? day.nutrients.carb : ''}
              />
            </div>
          </div>
        </Col>
        <Col sm={24} lg={16}>
          <List
            size="small"
            dataSource={day.dishes}
            renderItem={item => (
              <div className="card" style={{ border: '1px solid' }}>
                <div className="card-body">
                  <div style={{ float: 'left' }}>
                    <h4>{mealCodes[item.meal]}</h4>
                    {item.title}
                  </div>
                  <div style={{ alignContent: 'center', float: 'right' }}>
                    <Statistic
                      style={{ float: 'left' }}
                      title={formatMessage({ id: 'Orders.Energy' })}
                      value={item.nutrients.kcal}
                      suffix="kCal"
                    />
                    <Statistic
                      style={{ float: 'left', marginLeft: '30px' }}
                      title={formatMessage({ id: 'Orders.Protein' })}
                      value={item.nutrients.prot}
                      suffix="g"
                    />
                    <Statistic
                      style={{ float: 'left', marginLeft: '30px' }}
                      title={formatMessage({ id: 'Orders.Fat' })}
                      value={item.nutrients.fat}
                      suffix="g"
                    />
                    <Statistic
                      style={{ float: 'left', marginLeft: '30px' }}
                      title={formatMessage({ id: 'Orders.Carbo' })}
                      value={item.nutrients.carb}
                      suffix="g"
                    />
                    <Statistic
                      style={{ float: 'left', marginLeft: '30px' }}
                      title={formatMessage({ id: 'Orders.Weight' })}
                      value={(item.amount * item.cf).toFixed(2) * 1000}
                      suffix="g"
                    />
                  </div>
                </div>
              </div>
            )}
          />
        </Col>
      </Row>
    )
  }
}

export default MenuList
