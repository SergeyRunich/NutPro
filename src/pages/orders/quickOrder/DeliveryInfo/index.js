/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React from 'react'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { Row, Col, Form, Input, Slider, Select, Button } from 'antd'
import { checkAddress } from '../../../../api/deliveryTools'

const { Search } = Input
const { Option } = Select

@injectIntl
@Form.create()
@connect(({ user }) => ({ user }))
class DeliveryInfo extends React.Component {
  state = {
    isLoadingSearch: false,
    urlAddress: '',
  }

  constructor(props) {
    super(props)

    this.addressQuery = this.addressQuery.bind(this)
  }

  addressQuery() {
    const { onChangeField, address } = this.props
    this.setState({
      isLoadingSearch: true,
    })
    checkAddress(address).then(async res => {
      if (res.ok) {
        const json = await res.json()
        this.setState({
          // isAddDeliveryFee: !json.result.isPointInPolygon,
          urlAddress: json.result.address.url,
          isLoadingSearch: false,
        })
        onChangeField(!json.result.isPointInPolygon, 'isAddDeliveryFee')
        onChangeField(!json.result.isPointInPolygon, 'isGlobalDeliveryFee')
        onChangeField(true, 'isAddressChecked')
      } else {
        onChangeField('Invalid', 'isAddDeliveryFee')
        this.setState({
          isLoadingSearch: false,
        })
      }
    })
  }

  render() {
    const {
      onChangeField,
      onChangeDeliveryTime,
      intl: { formatMessage },
    } = this.props
    const {
      address,
      deliveryDescription,
      deliveryTime,
      isAddDeliveryFee,
      isAddressChecked,
      pickupPoint,
      pickupPoints,
      checkIsAvailable,
      checkingIsAvailable,
      pickupPointChecked,
    } = this.props
    const { isLoadingSearch, urlAddress } = this.state
    return (
      <div>
        <Form layout="horizontal" onSubmit={this.onSend}>
          <Row gutter={16}>
            <Col xl={5} md={24}>
              <Form.Item label={formatMessage({ id: 'Orders.Pick-upPoint' })}>
                <Select
                  placeholder={formatMessage({ id: 'Orders.Point' })}
                  value={pickupPoint}
                  loading={checkingIsAvailable}
                  onChange={e => onChangeField(e, 'pickupPoint')}
                  disabled={!pickupPointChecked}
                >
                  <Option key="null" value="">
                    {formatMessage({ id: 'Orders.None' })}
                  </Option>
                  {pickupPoints.map(point => {
                    return (
                      <Option
                        key={Math.random()}
                        value={point.id}
                        disabled={
                          point.currentValue !== undefined
                            ? point.currentValue >= point.orderCapacity
                            : false
                        }
                      >
                        {`${point.name}`}{' '}
                        {`${point.currentValue !== undefined ? point.currentValue : '-'} / ${
                          point.orderCapacity
                        }`}
                      </Option>
                    )
                  })}
                </Select>
                <Button
                  loading={checkingIsAvailable}
                  onClick={() => checkIsAvailable()}
                  type="primary"
                >
                  {formatMessage({ id: 'Orders.check' })}
                </Button>
              </Form.Item>
            </Col>
            <Col xl={7} md={24}>
              <Form.Item label={formatMessage({ id: 'global.address' })}>
                <Search
                  value={address}
                  id="checkout-address"
                  placeholder={formatMessage({ id: 'global.address' })}
                  // className="mb-3"
                  disabled={pickupPoint !== ''}
                  onChange={e => onChangeField(e, 'address')}
                  loading={isLoadingSearch}
                  enterButton="Check address"
                  onSearch={this.addressQuery}
                />
                {isAddressChecked && (
                  <span>
                    {isAddDeliveryFee !== 'Invalid' && (
                      <span
                        style={{
                          color: isAddDeliveryFee ? '#fb434a' : '#46be8a',
                          marginRight: '10px',
                          fontSize: '10px',
                        }}
                      >
                        {isAddDeliveryFee
                          ? formatMessage({
                              id: 'Orders.The address is not included in the delivery area',
                            })
                          : formatMessage({
                              id: 'Orders.The address is included in the delivery area',
                            })}
                        {isAddDeliveryFee === 'Invalid'
                          ? formatMessage({ id: 'Orders.InvalidAddress!' })
                          : ''}
                      </span>
                    )}

                    {isAddDeliveryFee === 'Invalid' && (
                      <span style={{ color: '#fb434a', marginRight: '10px', fontSize: '10px' }}>
                        {formatMessage({ id: 'Orders.InvalidAddress' })}
                      </span>
                    )}
                    <span>
                      {Boolean(urlAddress) && isAddDeliveryFee !== 'Invalid' && (
                        // eslint-disable-next-line react/jsx-no-target-blank
                        <a href={urlAddress} target="_blank">
                          {formatMessage({ id: 'Orders.OpenStreetMap' })}
                        </a>
                      )}
                    </span>
                  </span>
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={24}>
              <Form.Item label={formatMessage({ id: 'Orders.DeliveryTime' })}>
                <Slider
                  range
                  max={22}
                  min={17}
                  tipFormatter={value => `${value}:00`}
                  defaultValue={deliveryTime}
                  onChange={onChangeDeliveryTime}
                />
                <span>
                  {formatMessage({ id: 'Orders.Time:SPACE' })}
                  {deliveryTime[0]}:00-{deliveryTime[1]}:00
                </span>
              </Form.Item>
            </Col>
            <Col xl={6} md={24}>
              <Form.Item label={formatMessage({ id: 'Orders.DeliveryComment' })}>
                <Input
                  value={deliveryDescription}
                  rows={4}
                  placeholder={formatMessage({ id: 'Orders.PleaseEnterComment' })}
                  onChange={e => onChangeField(e, 'deliveryDescription')}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

export default DeliveryInfo
