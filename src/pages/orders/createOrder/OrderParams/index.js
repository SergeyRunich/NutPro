import React from 'react'
import { injectIntl } from 'react-intl'

import {
  Input,
  Radio,
  Slider,
  DatePicker,
  Switch,
  InputNumber,
  Button,
  Tag,
  Form,
  // Select,
} from 'antd'
import moment from 'moment'

// const { Option } = Select

moment.updateLocale('en', {
  week: { dow: 1 },
})

const deliveryFeePricePerDay = 50

@injectIntl
class OrderParams extends React.Component {
  state = {}

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

  render() {
    const {
      timestamp,
      length,
      size,
      update,
      onChangeStartDate,
      deliveryTime,
      onChangeDeliveryTime,
      // onChangeKitchen,
      // prefferedKitchen,
      // selectedKitchen,
      // allKitchens,
      originalPrice,
      priceWithPromo,
      promo,
      onChangePromo,
      customLength,
      onChangeCustomLength,
      // isProlong,
      customPrice,
      isCustomPrice,
      onChangeIsCustomPrice,
      onChangeParams,
      deliveryFee,
      lastOrder,
      checkBuffer,
      bufferInfo,
      creditBalance,
      useCredit,
      useCreditChecked,
      onChangeUseCredit,
      totalPrice,
      bufferNotChecked,
      intl: { formatMessage },
    } = this.props
    const dDay =
      moment().endOf('day') > moment().add(1, 'days')
        ? moment().endOf('day')
        : moment().add(1, 'days')

    return (
      <div>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h4 className="text-black mb-3">
            <strong>{formatMessage({ id: 'Orders.ChooseDeliveryTime' })}</strong>
          </h4>
          <Slider
            range
            max={22}
            min={17}
            tipFormatter={value => `${value}:00`}
            defaultValue={deliveryTime}
            onChange={onChangeDeliveryTime}
          />
          <span>
            {formatMessage({ id: 'Orders.Time:SPACE' })} {deliveryTime[0]}:00-{deliveryTime[1]}:00
          </span>
        </div>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h4 className="text-black mb-3">
            <strong>{formatMessage({ id: 'Orders.ChooseDeliveryDate' })}</strong>
          </h4>
          <DatePicker
            style={{ marginTop: '15px' }}
            format="DD-MM-YYYY"
            defaultValue={moment(timestamp, 'DD-MM-YYYY')}
            disabledDate={currentDay =>
              (currentDay && currentDay < dDay) ||
              (currentDay.day() !== 1 && currentDay.day() !== 3 && currentDay.day() !== 5) ||
              currentDay < moment.unix(lastOrder.endTimestamp)
            }
            onChange={(_, b) => onChangeStartDate(b)}
          />
          {/* <Select
            style={{ marginLeft: 15, minWidth: 100 }}
            labelInValue
            disabled={prefferedKitchen !== ''}
            onChange={e => onChangeKitchen(e)}
            value={{ key: prefferedKitchen !== '' ? prefferedKitchen : selectedKitchen }}
            placeholder={formatMessage({ id: 'Orders.Select' })}
          >
            {allKitchens.map(k => (
              <Option key={k.id} value={k.id}>
                {k.name}
              </Option>
            ))}
          </Select> */}
          <Button
            type="default"
            size="default"
            onClick={() => checkBuffer()}
            style={{ margin: '15px' }}
            loading={bufferNotChecked}
          >
            {formatMessage({ id: 'Orders.CheckBuffer' })}
          </Button>
          <p>
            {formatMessage({ id: 'Orders.Orders:SPACE' })} {bufferInfo.currentValue}/
            {bufferInfo.maxValue || '∞'}
            <br />
            {formatMessage({ id: 'Orders.Availability:SPACE' })}
            <Tag color={bufferInfo.status ? 'green' : 'red'}>
              {bufferInfo.status
                ? formatMessage({ id: 'global.yes' })
                : formatMessage({ id: 'global.no' })}
            </Tag>
          </p>
        </div>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <span>
            {formatMessage({ id: 'Orders.CustomLengthSPACE' })}{' '}
            <Switch checked={customLength} onChange={onChangeCustomLength} />
          </span>
        </div>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          {size === 'short' && !customLength && (
            <Radio.Group name="length" size="large" value={length} onChange={update}>
              <Radio.Button value={2}>2{formatMessage({ id: 'Orders.SPACEDays' })}</Radio.Button>
              <Radio.Button value={10}>10{formatMessage({ id: 'Orders.SPACEDays' })}</Radio.Button>
              <Radio.Button value={20}>20{formatMessage({ id: 'Orders.SPACEDays' })}</Radio.Button>
              <Radio.Button value={40}>40{formatMessage({ id: 'Orders.SPACEDays' })}</Radio.Button>
              <Radio.Button value={60}>60{formatMessage({ id: 'Orders.SPACEDays' })}</Radio.Button>
            </Radio.Group>
          )}
          {size === 'long' && !customLength && (
            <Radio.Group name="length" size="large" value={length} onChange={update}>
              <Radio.Button value={2}>2{formatMessage({ id: 'Orders.SPACEDays' })}</Radio.Button>
              <Radio.Button value={12}>12{formatMessage({ id: 'Orders.SPACEDays' })}</Radio.Button>
              <Radio.Button value={24}>24{formatMessage({ id: 'Orders.SPACEDays' })}</Radio.Button>
              <Radio.Button value={48}>48{formatMessage({ id: 'Orders.SPACEDays' })}</Radio.Button>
              <Radio.Button value={72}>72{formatMessage({ id: 'Orders.SPACEDays' })}</Radio.Button>
            </Radio.Group>
          )}
        </div>
        {Boolean(customLength) && (
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <InputNumber min={2} value={length} name="customLength" onChange={update} />
          </div>
        )}
        <div
          style={{
            marginRight: '20px',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          <Form.Item name="usecredit" label={formatMessage({ id: 'Orders.UseCreditBalance' })}>
            <Switch
              style={{ margin: '0 5px' }}
              checked={useCreditChecked}
              onChange={onChangeUseCredit}
              disabled={!creditBalance || creditBalance === 0}
            />
          </Form.Item>
        </div>
        <div
          style={{
            marginRight: '20px',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          <Form.Item
            name="payfrombalance"
            label={formatMessage({ id: 'Orders.PayFromCreditBalance' })}
          >
            <InputNumber
              min={0}
              max={Math.min(creditBalance, totalPrice)}
              disabled={!useCreditChecked}
              value={useCredit}
              onChange={e => onChangeParams(e, 'useCredit')}
            />
          </Form.Item>
        </div>
        {length > 5 && (
          <div style={{ marginRight: '20px', marginBottom: '20px', textAlign: 'center' }}>
            <h4 className="text-black mb-3">
              <strong>{formatMessage({ id: 'Orders.Promocode' })}</strong>
            </h4>
            <Input
              size="large"
              style={priceWithPromo !== -1 ? { borderColor: 'green' } : {}}
              value={promo}
              onChange={e => onChangePromo(e)}
            />
          </div>
        )}
        <div style={{ marginRight: '20px', marginBottom: '20px', textAlign: 'center' }}>
          <h4 className="text-black mb-3">
            <strong>{formatMessage({ id: 'Orders.OrderPrice' })}</strong>
          </h4>
          {priceWithPromo === -1 && (
            <h2 className="text-black mb-3">
              <strong>{originalPrice}</strong>
              <br />
              <small>
                {formatMessage({ id: 'Orders.Delivery:SPACE' })}
                {Math.round(
                  deliveryFee.length *
                    deliveryFeePricePerDay *
                    Number(deliveryFee.isAddDeliveryFee),
                )}{' '}
                Kč
              </small>
            </h2>
          )}
          {priceWithPromo !== -1 && (
            <h2 className="text-black mb-3">
              <strong>
                <strike>{Math.round(originalPrice)}</strike> {priceWithPromo}
                <br />
                <small>
                  {formatMessage({ id: 'Orders.Delivery:SPACE' })}
                  {Math.round(
                    deliveryFee.length *
                      deliveryFeePricePerDay *
                      Number(deliveryFee.isAddDeliveryFee),
                  )}{' '}
                  Kč
                </small>
              </strong>
            </h2>
          )}
        </div>
        <div style={{ marginRight: '20px', marginBottom: '20px', textAlign: 'center' }}>
          <h4 className="text-black mb-3">
            <strong>{formatMessage({ id: 'Orders.OriginalPrice' })}</strong>
          </h4>
          {priceWithPromo === -1 && (
            <h2 className="text-black mb-3">
              <strong>
                {originalPrice +
                  deliveryFee.length *
                    deliveryFeePricePerDay *
                    Number(deliveryFee.isAddDeliveryFee)}
              </strong>
            </h2>
          )}
          {priceWithPromo !== -1 && (
            <h2 className="text-black mb-3">
              <strong>
                <strike>
                  {originalPrice +
                    deliveryFee.length *
                      deliveryFeePricePerDay *
                      Number(deliveryFee.isAddDeliveryFee)}
                </strike>{' '}
                {priceWithPromo +
                  deliveryFee.length *
                    deliveryFeePricePerDay *
                    Number(deliveryFee.isAddDeliveryFee)}
              </strong>
            </h2>
          )}
        </div>
        <div style={{ marginRight: '20px', marginBottom: '20px', textAlign: 'center' }}>
          <h4 className="text-black mb-3">
            <strong>{formatMessage({ id: 'Orders.TotalPrice' })}</strong>
          </h4>
          {priceWithPromo === -1 && (
            <h2 className="text-black mb-3">
              <strong>
                {originalPrice +
                  deliveryFee.length *
                    deliveryFeePricePerDay *
                    Number(deliveryFee.isAddDeliveryFee) -
                  useCredit}
              </strong>
            </h2>
          )}
          {priceWithPromo !== -1 && (
            <h2 className="text-black mb-3">
              <strong>
                <strike>
                  {originalPrice +
                    deliveryFee.length *
                      deliveryFeePricePerDay *
                      Number(deliveryFee.isAddDeliveryFee) -
                    useCredit}
                </strike>{' '}
                {priceWithPromo +
                  deliveryFee.length *
                    deliveryFeePricePerDay *
                    Number(deliveryFee.isAddDeliveryFee) -
                  useCredit}
              </strong>
            </h2>
          )}
        </div>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <span>
            {formatMessage({ id: 'Orders.CustomPrice:SPACE' })}{' '}
            <Switch checked={isCustomPrice} onChange={onChangeIsCustomPrice} />
          </span>
        </div>
        {Boolean(isCustomPrice) && (
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <InputNumber
              min={0}
              value={customPrice}
              name="customPrice"
              onChange={e => onChangeParams(e, 'customPrice')}
            />
          </div>
        )}
      </div>
    )
  }
}

export default OrderParams
