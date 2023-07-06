import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { connect } from 'react-redux'
import { Row, Col, InputNumber, DatePicker, Button } from 'antd'

@injectIntl
@connect(({ user }) => ({ user }))
class B2BOrder extends React.Component {
  render() {
    const { onChangeB2BMenu, addDish, removeOrder, removeDish } = this.props
    const {
      order,
      index,
      length,
      intl: { formatMessage },
    } = this.props

    return (
      <div>
        <Row gutter={16}>
          <Col xl={24} md={24}>
            <center>
              <h5>{moment(order.timestamp, 'DD.MM.YYYY').format('dddd')}</h5>
              <DatePicker
                style={{ width: '100%', marginTop: 10 }}
                format="DD.MM.YYYY"
                placeholder={formatMessage({ id: 'global.date' })}
                value={moment(order.timestamp, 'DD.MM.YYYY')}
                onChange={e => onChangeB2BMenu(e, index, 'timestamp')}
              />
              <hr />
            </center>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col md={10} sm={24}>
            <center>
              <h5>{formatMessage({ id: 'Orders.Code' })}</h5>
            </center>
            {order.dishes.map((dish, dishIndex) => (
              <InputNumber
                max={20}
                min={1}
                size="small"
                defaultValue={dish.dishCode}
                onChange={e => onChangeB2BMenu(e, index, 'dishes', dishIndex, 'dishCode')}
                style={{ width: '100%', marginTop: '5px' }}
                key={Math.random()}
              />
            ))}
          </Col>
          <Col md={10} sm={24}>
            <center>
              <h5>{formatMessage({ id: 'Orders.Count' })}</h5>
            </center>
            {order.dishes.map((dish, dishIndex) => (
              <InputNumber
                max={20}
                min={1}
                size="small"
                defaultValue={dish.count}
                onChange={e => onChangeB2BMenu(e, index, 'dishes', dishIndex, 'count')}
                style={{ width: '100%', marginTop: '5px' }}
                key={Math.random()}
              />
            ))}
          </Col>
          <Col md={4} sm={24}>
            <center>
              <h5>{formatMessage({ id: 'Orders.x' })}</h5>
            </center>
            {order.dishes.map((dish, dishIndex) => (
              <Button
                type="danger"
                size="small"
                onClick={() => removeDish(index, dishIndex)}
                style={{ width: '100%', marginTop: '5px' }}
                key={Math.random()}
                disabled={dishIndex === 0 && order.dishes.length === 1}
              >
                {formatMessage({ id: 'Orders.x' })}
              </Button>
            ))}
          </Col>
        </Row>
        <hr />
        <Row gutter={16}>
          <Col md={24} sm={24}>
            <Button
              type="primary"
              size="small"
              onClick={() => addDish(index)}
              style={{ width: '100%' }}
            >
              {formatMessage({ id: 'Orders.AddDish' })}
            </Button>
          </Col>
          <Col md={24} sm={24} className="mt-3">
            <Button
              type="danger"
              size="small"
              onClick={() => removeOrder(index)}
              style={{ width: '100%' }}
              disabled={index === 0 && length === 1}
            >
              {formatMessage({ id: 'Orders.RemoveDay' })}
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default B2BOrder
