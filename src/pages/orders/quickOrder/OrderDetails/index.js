import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import {
  Form,
  Col,
  Row,
  Select,
  InputNumber,
  Radio,
  Switch,
  Input,
  Button,
  DatePicker,
  Divider,
} from 'antd'

import { getLastDeliveryDate } from '../../../../services/order'

const { Option } = Select

@injectIntl
@Form.create()
class OrderDetails extends React.Component {
  render() {
    const {
      length,
      size,
      customLength,
      onChangeCustomLength,
      onChangeField,
      promocode,
      pricePerDay,
      originalPrice,
      priceWithPromo,
      calculatePrice,
      timestamp,
      kitchen,
      kitchens,
      prefferedKitchen,
      onChangeKitchen,
      onChangeDate,
      customMenu,
      customPrice,
      onChangeCustomPrice,
      bufferInfo,
      checkBuffer,
      useCreditChecked,
      onChangeUseCredit,
      useCredit,
      creditBalance,
      isPriceCalculated,
      intl: { formatMessage },
    } = this.props

    const totalPrice = customMenu.isActive ? customPrice : priceWithPromo || originalPrice
    const dDay =
      moment().endOf('day') > moment().add(1, 'days')
        ? moment().endOf('day')
        : moment().add(1, 'days')

    return (
      <div>
        <Form layout="horizontal" onSubmit={this.onSend}>
          <Row gutter={16}>
            <Col xl={3} md={24}>
              <Form.Item
                name="size"
                label={formatMessage({ id: 'Orders.WeekSize' })}
                rules={[{ required: true }]}
              >
                <Select
                  placeholder={formatMessage({ id: 'Orders.WeekSize' })}
                  value={size}
                  onChange={e => onChangeField(e, 'size')}
                >
                  <Option key="short" value="short">
                    {formatMessage({ id: 'Orders.ShortWeek' })}
                  </Option>
                  <Option key="long" value="long">
                    {formatMessage({ id: 'Orders.LongWeek' })}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={9} md={24}>
              <Form.Item name="size" label="Days" rules={[{ required: true }]}>
                <div style={{ textAlign: 'center' }}>
                  {formatMessage({ id: 'Orders.CustomSPACE' })}
                  <Switch
                    style={{ margin: '0 5px' }}
                    checked={customLength}
                    onChange={onChangeCustomLength}
                  />
                  {customLength && (
                    <InputNumber
                      min={1}
                      value={length}
                      name="customLength"
                      onChange={e => onChangeField(e, 'length')}
                    />
                  )}
                  {size === 'short' && !customLength && (
                    <Radio.Group
                      name="length"
                      size="small"
                      value={length}
                      onChange={e => onChangeField(e, 'length')}
                    >
                      <Radio.Button value={2}>
                        2{formatMessage({ id: 'Orders.SPACEDays' })}
                      </Radio.Button>
                      <Radio.Button value={10}>
                        10{formatMessage({ id: 'Orders.SPACEDays' })}
                      </Radio.Button>
                      <Radio.Button value={20}>
                        20{formatMessage({ id: 'Orders.SPACEDays' })}
                      </Radio.Button>
                      <Radio.Button value={40}>
                        40{formatMessage({ id: 'Orders.SPACEDays' })}
                      </Radio.Button>
                      <Radio.Button value={60}>
                        60{formatMessage({ id: 'Orders.SPACEDays' })}
                      </Radio.Button>
                    </Radio.Group>
                  )}
                  {size === 'long' && !customLength && (
                    <Radio.Group
                      name="length"
                      size="small"
                      value={length}
                      onChange={e => onChangeField(e, 'length')}
                    >
                      <Radio.Button value={2}>
                        2{formatMessage({ id: 'Orders.SPACEDays' })}
                      </Radio.Button>
                      <Radio.Button value={12}>
                        12{formatMessage({ id: 'Orders.SPACEDays' })}
                      </Radio.Button>
                      <Radio.Button value={24}>
                        24{formatMessage({ id: 'Orders.SPACEDays' })}
                      </Radio.Button>
                      <Radio.Button value={48}>
                        48{formatMessage({ id: 'Orders.SPACEDays' })}
                      </Radio.Button>
                      <Radio.Button value={72}>
                        72{formatMessage({ id: 'Orders.SPACEDays' })}
                      </Radio.Button>
                    </Radio.Group>
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col xl={6} md={24}>
              <Form.Item name="promo" label={formatMessage({ id: 'Orders.Promocode' })}>
                <Input
                  value={promocode}
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'Orders.Promocode' })}
                  onChange={e => onChangeField(e, 'promocode')}
                />
              </Form.Item>
            </Col>
            {creditBalance > 0 && (
              <Col xl={3} md={24}>
                <Form.Item
                  name="usecredit"
                  label={formatMessage({ id: 'Orders.UseCreditBalance' })}
                >
                  <Switch
                    style={{ margin: '0 5px' }}
                    checked={useCreditChecked}
                    onChange={onChangeUseCredit}
                    disabled={totalPrice === 0}
                  />
                </Form.Item>
              </Col>
            )}
            {creditBalance > 0 && (
              <Col xl={3} md={24}>
                <Form.Item
                  name="payfrombalance"
                  label={formatMessage({ id: 'Orders.PayFromBalance' })}
                >
                  <InputNumber
                    min={0}
                    max={Math.min(creditBalance, totalPrice)}
                    disabled={!useCreditChecked}
                    value={useCredit}
                    onChange={e => onChangeField(e, 'useCredit')}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
          <Divider />
          <Row gutter={24}>
            <Col xl={3} md={24}>
              <small>{formatMessage({ id: 'Orders.PricePerDay' })}</small>
              <br />
              <span style={{ fontSize: 18, fontWeight: 600 }}>
                {customMenu.isActive ? Math.round(customPrice / length) : pricePerDay} Kč
              </span>
            </Col>
            <Col xl={3} md={24}>
              <small>{formatMessage({ id: 'Orders.OriginalPrice' })}</small>
              <br />
              <span style={{ fontSize: 18, fontWeight: 600 }}>{totalPrice} Kč</span>
            </Col>
            <Col xl={3} md={24}>
              <small>{formatMessage({ id: 'Orders.TotalPrice' })}</small>
              <br />
              <span style={{ fontSize: 18, fontWeight: 600 }}>
                {useCreditChecked ? totalPrice - useCredit : totalPrice} Kč
              </span>
            </Col>
            <Col xl={3} md={24}>
              {customMenu.isActive && (
                <>
                  <small>{formatMessage({ id: 'Orders.CustomPrice' })}</small>
                  <br />
                  <InputNumber
                    min={0}
                    disabled={!customMenu.isActive}
                    placeholder={formatMessage({ id: 'Orders.CustomPrice' })}
                    value={customPrice}
                    onChange={e => onChangeCustomPrice(e)}
                  />
                </>
              )}
              {!customMenu.isActive && (
                <Button
                  type="primary"
                  size="default"
                  onClick={() => calculatePrice()}
                  loading={isPriceCalculated}
                  style={{ margin: '10px 10px 10px 0' }}
                >
                  {formatMessage({ id: 'Orders.CalculatePrice' })}
                </Button>
              )}
            </Col>
            <Col xl={3} md={24}>
              <DatePicker
                style={{ width: '100%', marginTop: 10 }}
                format="DD.MM.YYYY"
                placeholder={formatMessage({ id: 'global.date' })}
                disabledDate={currentDay =>
                  (currentDay && currentDay < dDay) ||
                  (currentDay.day() !== 1 && currentDay.day() !== 3 && currentDay.day() !== 5)
                }
                value={moment(timestamp, 'DD-MM-YYYY')}
                onChange={e => onChangeDate(e)}
              />
            </Col>
            <Col xl={3} md={24}>
              <Select
                style={{ width: '115px', marginTop: 10 }}
                labelInValue
                disabled={prefferedKitchen !== ''}
                onChange={e => onChangeKitchen(e)}
                value={{ key: prefferedKitchen !== '' ? prefferedKitchen : kitchen }}
                placeholder={formatMessage({ id: 'Orders.Select' })}
              >
                {kitchens.map(k => (
                  <Option key={k.id} value={k.id}>
                    {k.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xl={3} md={24}>
              <Button
                type="primary"
                size="default"
                onClick={() => checkBuffer()}
                style={{ margin: '10px 10px 10px 0' }}
              >
                {formatMessage({ id: 'Orders.CheckBuffer' })}
              </Button>
            </Col>
            <Col xl={3} md={24}>
              <DatePicker
                style={{ width: '100%', marginTop: 10 }}
                format="DD.MM.YYYY"
                placeholder={formatMessage({ id: 'global.date' })}
                disabled
                value={
                  timestamp && length && size
                    ? moment.unix(
                        getLastDeliveryDate(
                          moment(timestamp, 'DD-MM-YYYY').unix(),
                          Number(length),
                          size,
                        ),
                      )
                    : 0
                }
              />
            </Col>
            <Col xl={3} md={24}>
              {formatMessage({ id: 'Orders.CurrentOrders:SPACE' })} {bufferInfo.currentValue}
              <br />
              {formatMessage({ id: 'Orders.Limit:SPACE' })} {bufferInfo.maxValue || '-'}
              <br />
              {formatMessage({ id: 'Orders.IsAllow:SPACE' })}{' '}
              {bufferInfo.status
                ? formatMessage({ id: 'global.yes' })
                : formatMessage({ id: 'global.no' })}
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

export default OrderDetails
