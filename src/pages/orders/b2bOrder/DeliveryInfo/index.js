/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React from 'react'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { Row, Col, Form, Input, Slider, InputNumber } from 'antd'
import { checkAddress } from '../../../../api/deliveryTools'

const { Search } = Input

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
      customPrice,
    } = this.props
    const { isLoadingSearch, urlAddress } = this.state
    return (
      <div>
        <Form layout="horizontal" onSubmit={this.onSend}>
          <Row gutter={16}>
            <Col xl={4} md={24}>
              <Form.Item label={formatMessage({ id: 'Orders.Price' })}>
                <InputNumber
                  value={customPrice}
                  min={0}
                  // formatter={value => `${value}Kč`}
                  // parser={value => value.replace('Kč', '')}
                  placeholder={formatMessage({ id: 'Orders.PleaseEnterPrice' })}
                  onChange={e => onChangeField(e, 'customPrice')}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col xl={20} md={24}>
              <Form.Item label={formatMessage({ id: 'Orders.DeliveryCount' })}>
                <Input
                  value={deliveryDescription}
                  rows={4}
                  placeholder={formatMessage({ id: 'Orders.PleaseEnterComment' })}
                  onChange={e => onChangeField(e, 'deliveryDescription')}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col xl={12} md={24}>
              <Form.Item label={formatMessage({ id: 'global.address' })}>
                <span>
                  <Search
                    value={address}
                    id="checkout-address"
                    placeholder={formatMessage({ id: 'global.address' })}
                    className="mb-3"
                    onChange={e => onChangeField(e, 'address')}
                    loading={isLoadingSearch}
                    enterButton={formatMessage({ id: 'Orders.CheckButton' })}
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
                            ? formatMessage({ id: 'Orders.TheAddressIsNotIncludedInDeliveryArea' })
                            : formatMessage({ id: 'Orders.TheAddressIsIncludedInDeliveryArea' })}
                          {isAddDeliveryFee === 'Invalid'
                            ? formatMessage({ id: 'Orders.InvalidAddress' })
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
                </span>
              </Form.Item>
            </Col>
            <Col xl={12} md={24}>
              <Form.Item label={formatMessage({ id: 'Orders.DeliveryTime' })}>
                <Slider
                  range
                  max={22}
                  min={17}
                  tipFormatter={value => `${value}:00`}
                  defaultValue={deliveryTime}
                  onChange={onChangeDeliveryTime}
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
