import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { DatePicker, Select, Timeline, Row, Col, Button } from 'antd'
import locale from 'antd/es/date-picker/locale/cs_CZ'

import { getAllKitchen } from '../../../../api/kitchen'

const { Option } = Select

const dateFormat = 'DD.MM.YYYY'

@injectIntl
class ChangeKitchenForm extends React.Component {
  state = {
    startDate: '',
    kitchen: { key: '' },
    kitchens: [],
  }

  componentWillMount() {
    const { current } = this.props
    getAllKitchen().then(async req => {
      const kitchens = await req.json()
      this.setState({
        kitchens,
      })
    })
    this.setState({
      kitchen: { key: current.id },
    })
  }

  onChangeStartDate(date, dateString) {
    this.setState({
      startDate: dateString,
    })
  }

  onChangeKitchen = kitchen => {
    this.setState({
      kitchen: { key: kitchen.key },
    })
  }

  render() {
    const { startDate, kitchen, kitchens } = this.state
    const {
      current,
      kitchenHistory,
      push,
      onDeleteLast,
      intl: { formatMessage },
    } = this.props

    const dDay =
      moment().endOf('day') > moment.unix(current.start)
        ? moment().endOf('day')
        : moment.unix(current.start)

    return (
      <Row gutter={5}>
        <Col md={12} sm={24}>
          <div style={{ padding: '5px' }}>
            <Timeline mode="left">
              {kitchenHistory.map((historyRecord, i) => (
                <Timeline.Item
                  key={Math.random()}
                  color={i === kitchenHistory.length - 1 ? 'green' : 'blue'}
                >
                  {`[${moment.unix(historyRecord.start).format('DD.MM.YYYY')}] ${
                    historyRecord.kitchen.name
                  }`}
                </Timeline.Item>
              ))}
            </Timeline>
          </div>
        </Col>
        <Col md={12} sm={24}>
          <div>
            <div>
              <b>{formatMessage({ id: 'Orders.CurrentKitchen:' })}</b>
              {` ${current.name}`}
            </div>
            <div>
              <b>{formatMessage({ id: 'Orders.Form:' })}</b>
              {` ${moment.unix(current.start).format('DD.MM.YYYY')}`}
            </div>
            <div>
              <b>{formatMessage({ id: 'Orders.LastChange:' })}</b>
              {` ${moment.unix(current.timestamp).format('DD.MM.YYYY')}`}
            </div>
            {current.start > moment().unix() && (
              <div>
                <Button type="danger" onClick={() => onDeleteLast()}>
                  {formatMessage({ id: 'Orders.DeleteLast' })}
                </Button>
              </div>
            )}
          </div>
          <hr />

          <h5>{formatMessage({ id: 'Orders.SetNewKitchen:' })}</h5>
          <Select
            labelInValue
            defaultValue={{ key: current.id }}
            style={{ width: '115px', marginTop: '0px', marginRight: '20px' }}
            onChange={this.onChangeKitchen}
            value={kitchen}
          >
            {kitchens.map(k => (
              <Option key={k.id} value={k.id}>
                {k.name}
              </Option>
            ))}
          </Select>
          <DatePicker
            style={{ marginTop: '15px' }}
            format={dateFormat}
            disabledDate={currentDay =>
              (currentDay && currentDay < dDay) ||
              (currentDay.day() !== 1 && currentDay.day() !== 3 && currentDay.day() !== 5)
            }
            onChange={(a, b) => this.onChangeStartDate(a, b)}
            locale={locale}
          />
          <div>
            <Button
              type="primary"
              style={{ marginTop: '10px' }}
              onClick={() => push({ kitchenId: kitchen.key, startDate })}
            >
              {formatMessage({ id: 'global.save' })}
            </Button>
          </div>
        </Col>
      </Row>
    )
  }
}

export default ChangeKitchenForm
