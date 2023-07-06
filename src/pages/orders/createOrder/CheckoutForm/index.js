/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Input, Checkbox, Select, Button } from 'antd'
import { checkAddress } from '../../../../api/deliveryTools'

const { Search } = Input
const { Option } = Select
const FormItem = Form.Item

@injectIntl
@Form.create()
class CheckoutForm extends React.Component {
  state = {
    // name: '',
    // email: '',
    // phone: '',
    // address: '',
    // kitchenDescription: '',
    // deliveryDescription: '',
    // isAddDeliveryFee: false,
    isLoadingSearch: false,
    urlAddress: '',
  }

  constructor(props) {
    super(props)

    this.addressQuery = this.addressQuery.bind(this)
  }

  // componentDidMount() {
  //   const { user } = this.props
  //   this.setState({
  //     name: user.name,
  //     email: user.email,
  //     phone: user.phone,
  //     address: user.address,
  //   })
  // }

  addressQuery() {
    const { user, update } = this.props
    this.setState({
      isLoadingSearch: true,
    })
    checkAddress(user.address).then(async res => {
      if (res.ok) {
        const json = await res.json()
        this.setState({
          // isAddDeliveryFee: !json.result.isPointInPolygon,
          urlAddress: json.result.address.url,
          isLoadingSearch: false,
        })
        update(!json.result.isPointInPolygon, 'isAddDeliveryFee')
        update(!json.result.isPointInPolygon, 'isGlobalDeliveryFee')
        update(true, 'isAddressChecked')
      } else {
        update('Invalid', 'isAddDeliveryFee')
        this.setState({
          isLoadingSearch: false,
        })
      }
    })
  }

  render() {
    const { urlAddress, isLoadingSearch } = this.state
    const {
      form,
      user,
      update,
      isGlobalDeliveryFee,
      pickupPoints,
      pickupPoint,
      intl: { formatMessage },
      checkIsAvailable,
      checkingIsAvailable,
      pickupPointChecked,
    } = this.props

    // const { name, email, phone, address, kitchenDescription, deliveryDescription } = this.state

    return (
      <Form>
        <h4 className="text-black mb-3">
          <strong>{formatMessage({ id: 'Orders.OrderDetails' })}</strong>
        </h4>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <FormItem label={formatMessage({ id: 'global.email' })}>
                {form.getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,
                      type: 'email',
                      message: formatMessage({ id: 'Orders.PleaseEnterEmail!' }),
                    },
                  ],
                  initialValue: user.email,
                })(
                  <Input
                    id="checkout-email"
                    placeholder={formatMessage({ id: 'global.email' })}
                    onChange={e => update(e, 'email')}
                  />,
                )}
              </FormItem>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <FormItem label={formatMessage({ id: 'Orders.PhoneNumber' })}>
                {form.getFieldDecorator('phoneNumber', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'Orders.PleaseInputPhoneNumber!' }),
                    },
                  ],
                  initialValue: user.phone,
                })(
                  <Input
                    id="checkout-phnum"
                    placeholder={formatMessage({ id: 'Orders.PhoneNumber' })}
                    onChange={e => update(e, 'phone')}
                  />,
                )}
              </FormItem>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <FormItem label={formatMessage({ id: 'global.name' })}>
                {form.getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'Orders.PleaseInputYourName!' }),
                    },
                  ],
                  initialValue: user.name,
                })(
                  <Input
                    id="checkout-name"
                    placeholder={formatMessage({ id: 'global.name' })}
                    onChange={e => update(e, 'name')}
                  />,
                )}
              </FormItem>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <div className="form-group">
              <FormItem label={formatMessage({ id: 'Orders.Pick-upPoint' })}>
                <Select
                  placeholder="Point"
                  value={pickupPoint}
                  loading={checkingIsAvailable}
                  disabled={!pickupPointChecked}
                  onChange={e => update(e, 'pickupPoint')}
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
                  onClick={() => checkIsAvailable()}
                  loading={checkingIsAvailable}
                  type="primary"
                >
                  {formatMessage({ id: 'Orders.check' })}
                </Button>
              </FormItem>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <FormItem label={formatMessage({ id: 'global.address' })}>
                <span>
                  <Search
                    value={user.address}
                    id="checkout-address"
                    placeholder={formatMessage({ id: 'global.address' })}
                    className="mb-3"
                    onChange={e => update(e, 'address')}
                    loading={isLoadingSearch}
                    enterButton={formatMessage({ id: 'Orders.CheckAddress' })}
                    onSearch={this.addressQuery}
                  />
                  {user.isAddressChecked && (
                    <span>
                      {isGlobalDeliveryFee && (
                        <span
                          style={{
                            color: isGlobalDeliveryFee ? '#fb434a' : '#46be8a',
                            marginRight: '10px',
                          }}
                        >
                          {isGlobalDeliveryFee
                            ? formatMessage({ id: 'Orders.TheAddressIsNotIncludedInDeliveryArea' })
                            : formatMessage({ id: 'Orders.TheAddressIsIncludedInDeliveryArea' })}
                          {user.isAddDeliveryFee === 'Invalid'
                            ? formatMessage({ id: 'Orders.InvalidAddress' })
                            : ''}
                        </span>
                      )}

                      {user.isAddDeliveryFee === 'Invalid' && (
                        <span style={{ color: '#fb434a', marginRight: '10px' }}>
                          {formatMessage({ id: 'Orders.InvalidAddress' })}
                        </span>
                      )}
                      <span>
                        {Boolean(urlAddress) && user.isAddDeliveryFee !== 'Invalid' && (
                          <a href={urlAddress} target="_blank">
                            {formatMessage({ id: 'Orders.OpenStreetMap' })}
                          </a>
                        )}
                      </span>
                    </span>
                  )}
                </span>
              </FormItem>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <FormItem label={formatMessage({ id: 'Orders.CheckingAddress' })}>
                <div>
                  <Checkbox
                    style={{ marginRight: '10px' }}
                    checked={user.isAddDeliveryFee}
                    onChange={e => update(e, 'isAddDeliveryFee')}
                  />{' '}
                  <small>{formatMessage({ id: 'Orders.Add50kc/day' })}</small>
                </div>
              </FormItem>
            </div>
          </div>
        </div>
        <div className="form-group">
          <FormItem label={formatMessage({ id: 'Orders.KitchenDescription' })}>
            <Input
              value={user.kitchenDescription}
              id="checkout-kitchen"
              placeholder={formatMessage({ id: 'Orders.Comment' })}
              onChange={e => update(e, 'kitchenDescription')}
            />
          </FormItem>
        </div>
        <div className="form-group">
          <FormItem label={formatMessage({ id: 'Orders.DeliveryDescription' })}>
            <Input
              value={user.deliveryDescription}
              id="checkout-delivery"
              placeholder={formatMessage({ id: 'Orders.DeliveryComment' })}
              onChange={e => update(e, 'deliveryDescription')}
            />
          </FormItem>
        </div>
      </Form>
    )
  }
}

export default CheckoutForm
