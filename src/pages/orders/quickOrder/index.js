import React from 'react'
import lodash from 'lodash'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Redirect, withRouter } from 'react-router-dom'
import { Button, notification, Row, Col, Switch, Checkbox } from 'antd'
import { Helmet } from 'react-helmet'

import Customer from './Customer'
import MenuSettings from './MenuSettings'
import CustomMenu from './CustomMenu'
import OrderDetails from './OrderDetails'
import DeliveryInfo from './DeliveryInfo'

import {
  getOrderPrice,
  calculatePriceWithPromo,
  createQuickOrder,
  checkUserInQuickOrder,
} from '../../../api/order'
import { getIngredientTags } from '../../../api/erp/ingredientTags'
import { getAllKitchen } from '../../../api/kitchen'
import { getPickupPoints, getPickupPointByDate } from '../../../api/pickupPoint'
import { getBuffer } from '../../../api/productionBuffer'
import { getUser } from '../../../api/customer'

moment.updateLocale('en', {
  week: { dow: 1 },
})

const lengthMonth = {
  2: 2,
  10: 12,
  12: 24,
  20: 24,
  24: 20,
  40: 48,
  48: 40,
  60: 72,
  72: 60,
}

@injectIntl
@withRouter
class QuickOrder extends React.Component {
  state = {
    name: '',
    inBodyId: '',
    phone: '',
    email: '',
    kitchen: '',
    prefferedKitchen: '',
    language: 'Czech',
    address: '',
    kitchens: [{ id: '', name: '-' }],
    birthday: null,
    dataset: {
      age: 0,
      weight: 0,
      height: 0,
      sex: 'Male',
      BMR: 1700,
      BMI: 0,
      PBF: 0,
      VFA: 0,
      TBW: 0,
      muscle: 0,
      type: 'harrisBenedict',
      timestamp: moment().unix(),
    },

    intActive: 1,

    mealsPerDay: 5,
    size: 'short',
    length: 20,
    kcal: 1700,
    pricePerDay: 0,
    originalPrice: 0,
    orderId: '',
    customLength: false,
    promocode: '',
    priceWithPromo: 0,
    skipMeal: 0,
    PAL: 1,
    diet: 'keep',
    customPrice: 0,
    deliveryTime: [17, 22],
    deliveryDescription: '',
    ignoredMealTypes: [],
    timestamp: moment()
      .add(2, 'days')
      .format('DD-MM-YYYY'),
    sendEmail: true,
    isAddressChecked: false,
    isAddDeliveryFee: false,
    isGlobalDeliveryFee: false,
    checkUser: false,
    customMenu: {
      meals: [false, false, false, false, false],
      cf: [0, 0, 0, 0, 0],
      count: [1, 1, 1, 1, 1],
      isActive: false,
    },
    paymentAddress: '',
    isCompany: false,
    companyName: '',
    zip: '',
    regNumber: '',
    vatNumber: '',
    bufferInfo: {
      timestamp: 0,
      kitchen: '',
      status: false,
      currentValue: 0,
      maxValue: 0,
      currentBuffer: 0,
    },
    saladOnDinner: false,
    pickupPoint: '',
    pickupPoints: [],
    useCredit: 0,
    useCreditChecked: false,
    creditBalance: 0,
    creditBalanceHistory: {},
    existingUserId: undefined,
    saving: false,
    sending: false,
    isPhoneChecked: false,
    isPriceCalculated: false,
    exceptions: [],
    tags: [],
    pickupPointChecked: false,
    checkingIsAvailable: false,
  }

  constructor(props) {
    super(props)
    this.onChangeCustomLength = this.onChangeCustomLength.bind(this)
    this.onChangeField = this.onChangeField.bind(this)
    this.onChangeFieldDataset = this.onChangeFieldDataset.bind(this)
    this.onChangeUseCredit = this.onChangeUseCredit.bind(this)
    this.onChangePAL = this.onChangePAL.bind(this)
    this.onChangeDeliveryTime = this.onChangeDeliveryTime.bind(this)
    this.calculatePrice = this.calculatePrice.bind(this)
    this.onChangeDate = this.onChangeDate.bind(this)
    this.check = this.check.bind(this)
    this.onChangeCustomMenu = this.onChangeCustomMenu.bind(this)
    this.onChangeCustomPrice = this.onChangeCustomPrice.bind(this)
    this.onChangeLanguage = this.onChangeLanguage.bind(this)
    this.copyBillingInDeliveryAddress = this.copyBillingInDeliveryAddress.bind(this)
    this.onChangeKitchen = this.onChangeKitchen.bind(this)
    this.checkIsAvailable = this.checkIsAvailable.bind(this)
  }

  componentDidMount() {
    getIngredientTags(true).then(async answer => {
      if (answer.status === 401) {
        const { dispatch } = this.props
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            authorized: false,
          },
        })
        return
      }
      if (answer.status === 200) {
        // eslint-disable-next-line no-unused-vars
        const json = await answer.json()
        this.setState({
          tags: json.result,
        })
      }
    })

    getAllKitchen().then(async req => {
      if (req.status !== 401) {
        const kitchens = await req.json()
        this.setState({
          kitchens,
          kitchen: kitchens[0].id,
        })
        this.checkBuffer()
      }
    })

    getPickupPoints().then(async req => {
      if (req.status !== 401) {
        const pickupPoints = await req.json()
        this.setState({
          pickupPoints: pickupPoints.result,
        })
      }
    })
  }

  onChangeCustomMenu(e, field, index = 0) {
    const { customMenu } = this.state
    let { customPrice } = this.state
    if (field === 'isActive') {
      customMenu[field] = e.target.checked
      customPrice = 0
    } else if (e !== null && e.target) {
      if (e.target.type === 'checkbox') {
        customMenu[field][index] = e.target.checked
      } else {
        customMenu[field][index] = e.target.value
      }
    } else {
      customMenu[field][index] = e
    }

    this.setState({
      customMenu,
      customPrice,
    })
  }

  onChangeUseCredit() {
    const { creditBalance, customMenu, customPrice, priceWithPromo, originalPrice } = this.state
    const totalPrice = customMenu.isActive ? customPrice : priceWithPromo || originalPrice
    const useCredit = !this.state.useCreditChecked ? Math.min(Number(creditBalance), totalPrice) : 0
    this.setState(state => ({ useCreditChecked: !state.useCreditChecked, useCredit }))
  }

  onChangeField(e, field) {
    // eslint-disable-next-line no-unused-vars
    const { length, intActive, dataset, PAL, customMenu, timestamp } = this.state
    if (field === 'length' && !e) e = 1
    if (field === 'address') {
      this.setState({
        isAddressChecked: false,
      })
    }
    let { customPrice } = this.state
    if (field === 'mealsPerDay') {
      if (e === 99) {
        customMenu.isActive = true
      } else {
        customMenu.isActive = false
        customPrice = 0
      }
      this.setState({
        customMenu,
        ignoredMealTypes: [],
        customPrice,
      })
    }
    if (e !== null) {
      let v = e
      if (e.target) {
        if (e.target.type === 'checkbox') {
          v = e.target.checked
        } else {
          v = e.target.value
        }
      }
      if (field === 'size') {
        this.setState({
          length: lengthMonth[length],
        })
      }
      if (field === 'phone') {
        let phone = v.replace(/\s/g, '')
        if (phone.length > 9) phone = phone.substr(-9, 9)
        this.setState({
          inBodyId: phone,
        })
      }
      if (field === 'diet') {
        if (v === 'loose') {
          const intenAr = [0.75, 0.8, 0.87]
          this.setState({
            kcal: Math.round(dataset.BMR * PAL * intenAr[intActive]),
          })
        } else if (v === 'gain') {
          this.setState({
            kcal: Math.round(dataset.BMR * PAL * 1.08),
          })
        } else {
          this.setState({
            kcal: Math.round(dataset.BMR * PAL),
          })
        }
      }
      if (field === 'intActive') {
        const intenAr = [0.75, 0.8, 0.87]
        this.setState({
          kcal: Math.round(Math.round(dataset.BMR * PAL) * intenAr[v]),
        })
      }
      if (field === 'saladOnDinner') {
        this.setState({
          [field]: v,
        })
        // getPrefKitchen(moment.utc(timestamp, 'DD-MM-YYYY').unix(), v)
      }
      this.setState({
        [field]: v,
      })
    }
  }

  onChangeDate(e) {
    // const { saladOnDinner } = this.state
    this.setState({
      bufferInfo: {
        timestamp: 0,
        kitchen: '',
        status: false,
        currentValue: 0,
        maxValue: 0,
        currentBuffer: 0,
      },
    })
    if (e !== null) {
      this.setState({
        timestamp: e.format('DD-MM-YYYY'),
      })
      // getPrefKitchen(moment.utc(e).unix(), saladOnDinner)
      setTimeout(() => {
        this.checkBuffer()
      }, 300)
    }
  }

  onChangeKitchen(e) {
    if (e !== null) {
      this.setState({
        kitchen: e.key,
      })
    }
  }

  onChangeCustomPrice(e) {
    if (e !== null) {
      this.setState({
        customPrice: e,
      })
    }
  }

  onChangeLanguage(e) {
    const tag = e ? 'English' : 'Czech'
    this.setState({
      language: tag,
    })
  }

  onChangePAL(e, field) {
    let { kcal } = this.state
    const { dataset, diet, intActive } = this.state
    let v = e
    if (e.target) {
      if (e.target.type === 'checkbox') {
        v = e.target.checked
      } else {
        v = e.target.value
      }
    }

    if (diet === 'loose') {
      const intenAr = [0.75, 0.8, 0.87]
      kcal = Math.round(dataset.BMR * v * intenAr[intActive])
    } else if (diet === 'gain') {
      kcal = Math.round(dataset.BMR * v * 1.08)
    } else {
      kcal = Math.round(dataset.BMR * v)
    }

    this.setState({
      [field]: v,
      kcal,
    })
  }

  onChangeDeliveryTime(deliveryTime) {
    this.setState({
      deliveryTime,
    })
  }

  onChangeFieldDataset(e, field) {
    const { dataset } = this.state
    if (e !== null && e.target) {
      if (e.target.type === 'checkbox') {
        dataset[field] = e.target.checked
        this.setState({
          dataset,
        })
      } else {
        dataset[field] = e.target.value
        this.setState({
          dataset,
        })
      }
    } else {
      dataset[field] = e
      this.setState({
        dataset,
      })
    }
  }

  onChangeCustomLength(checked) {
    this.setState({
      customLength: checked,
    })
  }

  async onSend(incomlete = false) {
    const {
      intl: { formatMessage },
    } = this.props
    const {
      name,
      inBodyId,
      phone,
      email,
      kitchen,
      // prefferedKitchen,
      address,
      dataset,
      mealsPerDay,
      size,
      length,
      kcal,
      customLength,
      promocode,
      diet,
      deliveryDescription,
      ignoredMealTypes,
      timestamp,
      sendEmail,
      customPrice,
      deliveryTime,
      isAddDeliveryFee,
      customMenu,
      paymentAddress,
      isCompany,
      regNumber,
      vatNumber,
      zip,
      language,
      saladOnDinner,
      pickupPoint,
      isGlobalDeliveryFee,
      companyName,
      useCredit,
      birthday,
      exceptions,
    } = this.state

    const checkIscustomMenuSelected =
      !customMenu.isActive ||
      (customMenu.isActive &&
        (customMenu.meals[0] ||
          customMenu.meals[1] ||
          customMenu.meals[2] ||
          customMenu.meals[3] ||
          customMenu.meals[4]))

    if (checkIscustomMenuSelected) {
      if (!incomlete) {
        this.setState({
          sending: true,
        })
      } else {
        this.setState({
          saving: true,
        })
      }
      try {
        const onSendData = {
          name,
          inBodyId,
          phone,
          email,
          // kitchen: prefferedKitchen === '' ? kitchen : prefferedKitchen,
          kitchen,
          address,
          sendEmail,
          incomlete,
          isAddDeliveryFee,
          customMenu,
          customPrice,
          language,
          birthday,
          paymentData: {
            address: paymentAddress,
            isCompany,
            companyName,
            regNumber,
            vatNumber,
            zip,
          },
          ...dataset,
          order: {
            diet,
            mealsPerDay,
            size,
            length,
            kcal,
            customLength,
            promocode,
            deliveryDescription,
            deliveryTime,
            ignoredMealTypes,
            saladOnDinner,
            exeptions: exceptions,
            timestamp: moment.utc(timestamp, 'DD-MM-YYYY').unix(),
          },
          pickupPoint,
          onApproveDeliveryFee: isGlobalDeliveryFee && !isAddDeliveryFee,
          useCredit,
        }
        if (
          (!name || !inBodyId || !phone || !email || !kcal || (!address && !pickupPoint)) &&
          !incomlete
        ) {
          notification.error({
            message: formatMessage({ id: 'Orders.RequiredFieldsCanNotBeEmpty' }),
            description: formatMessage({ id: 'Orders.FillInAllRequiredFields!' }),
            placement: 'topRight',
          })
          this.setState({
            sending: false,
          })
          return
        }

        if (isCompany && (!regNumber || !vatNumber || !zip)) {
          notification.error({
            message: formatMessage({ id: 'Orders.RequiredFieldsForCompanyIsEmpty' }),
            description: formatMessage({ id: 'Orders.FillInAllRequiredFields!' }),
            placement: 'topRight',
          })
          this.setState({
            sending: false,
            saving: false,
          })
          return
        }

        if (customMenu.isActive && customMenu.meals.indexOf(true) === -1) {
          notification.error({
            message: formatMessage({ id: 'Orders.CustomMenu' }),
            description: formatMessage({ id: 'Orders.NoMealIsSelected!' }),
            placement: 'topRight',
          })
          this.setState({
            sending: false,
            saving: false,
          })
          return
        }

        if (customMenu.isActive && customPrice === 0) {
          notification.error({
            message: formatMessage({ id: 'Orders.CustomPrice!' }),
            description: formatMessage({ id: 'Orders.WhenCustomMenu,CustomPriceIsRequired!' }),
            placement: 'topRight',
          })
          this.setState({
            sending: false,
            saving: false,
          })
          return
        }

        if ((!name || !phone) && incomlete) {
          notification.error({
            message: formatMessage({ id: 'Orders.RequiredFieldsCanNotBeEmpty' }),
            description: formatMessage({ id: 'Orders.FillInAllRequiredFields!' }),
            placement: 'topRight',
          })
          this.setState({
            saving: false,
          })
          return
        }
        const req = await createQuickOrder(onSendData)
        if (req.ok) {
          const json = await req.json()
          notification.success({
            message: formatMessage({ id: 'Orders.Created' }),
            description: formatMessage({ id: 'Orders.OrderSuccessfullyCreated!' }),
          })
          this.setState({
            orderId: json.orderId,
            sending: false,
            saving: false,
          })
        } else if (req.status === 409) {
          notification.error({
            message: formatMessage({ id: 'Orders.ErrorInBodyId' }),
            description: formatMessage({ id: 'Orders.UserWithCurrentInBodyIdAlreadyExists!' }),
            placement: 'topLeft',
          })
          this.setState({
            sending: false,
            saving: false,
          })
        } else if (req.status === 402) {
          notification.error({
            message: formatMessage({ id: 'Orders.InvalidPromocode' }),
            description: formatMessage({ id: 'Orders.InvalidPromocode!' }),
            placement: 'topLeft',
          })
          this.setState({
            sending: false,
            saving: false,
          })
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
            placement: 'topLeft',
          })
        }
        this.setState({
          sending: false,
          saving: false,
        })
      } catch (errorInfo) {
        console.log('Failed:', errorInfo)
      }
    } else {
      notification.error({
        message: formatMessage({ id: 'Orders.CustomMenu' }),
        description: formatMessage({
          id: 'Orders.WhenCustomMenu,need at last one custom meal selected!',
        }),
        placement: 'topRight',
      })
    }
  }

  checkBuffer = async () => {
    const {
      intl: { formatMessage },
    } = this.props
    const { kitchen, prefferedKitchen, timestamp } = this.state
    await getBuffer(timestamp, prefferedKitchen !== '' ? prefferedKitchen : kitchen).then(
      async req => {
        if (req.ok) {
          const bufferInfo = await req.json()
          this.setState({
            bufferInfo: bufferInfo.result,
          })
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
          })
        }
      },
    )
  }

  checkIsAvailable = async () => {
    this.setState({
      checkingIsAvailable: true,
    })
    const { timestamp, length, pickupPoints } = this.state
    const start = moment(timestamp, 'DD-MM-YYYY').format('YYYY-MM-DD')
    const end = moment(start, 'YYYY-MM-DD')
      .add(length - 1, 'days')
      .format('YYYY-MM-DD')

    pickupPoints.forEach(async pp => {
      await getPickupPointByDate(pp.id, start, end).then(async req => {
        if (req.status === 200) {
          const json = await req.json()
          const loadArray = json.result.map(r => r.orders.length)
          pp.currentValue = lodash.max(loadArray)
          this.setState({
            pickupPoints,
          })
        }
      })
    })

    this.setState({
      pickupPointChecked: true,
      checkingIsAvailable: false,
    })
  }

  calculatePrice() {
    this.setState({
      isPriceCalculated: true,
    })
    const { length, mealsPerDay, kcal, skipMeal, promocode, ignoredMealTypes } = this.state
    if (!length) return
    getOrderPrice({
      length,
      customParams: { kcal },
      mealsPerDay,
      skippedMeals: ignoredMealTypes,
    }).then(async calc => {
      const json = await calc.json()
      const price = Number(json.price) - (Number(json.price) / 100) * skipMeal
      const totalPrice = price * length

      this.setState({
        pricePerDay: price,
        originalPrice: totalPrice,
        isPriceCalculated: false,
      })
      calculatePriceWithPromo({
        originalPrice: totalPrice,
        promoCode: promocode,
        skippedMeals: ignoredMealTypes,
      }).then(async promo => {
        const json2 = await promo.json()
        if (promo.status === 200) {
          this.setState({
            priceWithPromo: json2.price,
            isPriceCalculated: false,
          })
        } else {
          this.setState({
            priceWithPromo: totalPrice,
            isPriceCalculated: false,
          })
        }
      })
    })
  }

  check(update) {
    const {
      intl: { formatMessage },
    } = this.props
    this.setState({
      isPhoneChecked: true,
    })
    const { inBodyId } = this.state
    if (inBodyId.length !== 9) {
      this.setState({
        isPhoneChecked: false,
      })
      return notification.error({
        message: formatMessage({ id: 'Orders.ErrorInBodyId' }),
        description: formatMessage({ id: 'Orders.PhoneNumberIncorrect!' }),
        placement: 'topLeft',
      })
    }
    checkUserInQuickOrder({
      inBodyId,
    }).then(async c => {
      const json = await c.json()
      this.setState({
        checkUser: json.status,
      })
      if (json.status) {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'Orders.CustomerExist!' }),
          placement: 'topRight',
        })
        this.setState({
          name: json.user.name,
          email: json.user.email,
          address: json.user.address,
          isCompany: json.user.paymentData.isCompany,
          companyName: json.user.paymentData.companyName,
          zip: json.user.paymentData.zip,
          regNumber: json.user.paymentData.regNumber,
          vatNumber: json.user.paymentData.vatNumber,
          paymentAddress: json.user.paymentData.address || json.user.address,
          existingUserId: json.user.id,
          isPhoneChecked: false,
        })
        update()
        if (this.state.existingUserId) {
          getUser(this.state.existingUserId).then(async user => {
            const data = await user.json()
            this.setState({
              creditBalance: data.creditBalance,
              creditBalanceHistory: data.creditBalanceHistory,
            })
          })
        }
      } else {
        notification.warning({
          message: formatMessage({ id: 'Orders.TheCustomerDoesNotExist!' }),
          description: formatMessage({ id: 'Orders.TheCustomerIsNotInTheSystem!' }),
          placement: 'topRight',
        })
        this.setState({
          isPhoneChecked: false,
        })
      }
    })
  }

  copyBillingInDeliveryAddress() {
    this.setState(state => ({
      address: state.paymentAddress,
    }))
  }

  render() {
    const {
      name,
      inBodyId,
      phone,
      email,
      kitchen,
      prefferedKitchen,
      kitchens,
      kcal,
      mealsPerDay,
      pricePerDay,
      length,
      originalPrice,
      orderId,
      customLength,
      dataset,
      size,
      PAL,
      promocode,
      priceWithPromo,
      deliveryDescription,
      deliveryTime,
      diet,
      ignoredMealTypes,
      address,
      timestamp,
      sendEmail,
      intActive,
      isAddDeliveryFee,
      isAddressChecked,
      checkUser,
      customMenu,
      customPrice,
      paymentAddress,
      isCompany,
      regNumber,
      vatNumber,
      zip,
      bufferInfo,
      saladOnDinner,
      pickupPoint,
      pickupPoints,
      isGlobalDeliveryFee,
      companyName,
      creditBalance,
      creditBalanceHistory,
      useCreditChecked,
      useCredit,
      sending,
      saving,
      isPhoneChecked,
      isPriceCalculated,
      tags,
      exceptions,
      pickupPointChecked,
      checkingIsAvailable,
      language,
    } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    return (
      <div>
        {orderId !== '' && <Redirect to={`/orders/${orderId}`} />}
        <Helmet title={formatMessage({ id: 'Orders.QuickOrder' })} />
        <div>
          <div className="row">
            <div className="col-md-12 col-xs-12">
              <div className="card">
                <div className="card-body" style={{ padding: '10px 20px' }}>
                  <Customer
                    data={{
                      name,
                      inBodyId,
                      phone,
                      email,
                      paymentAddress,
                      isCompany,
                      companyName,
                      regNumber,
                      vatNumber,
                      zip,
                      creditBalance,
                      creditBalanceHistory,
                    }}
                    onChangeField={this.onChangeField}
                    checkUser={checkUser}
                    onCheckUser={this.check}
                    copyAddress={this.copyBillingInDeliveryAddress}
                    isPhoneChecked={isPhoneChecked}
                    onChangeLanguage={this.onChangeLanguage}
                    language={language}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-xs-12">
              <div className="card">
                <div className="card-body" style={{ padding: '10px 20px' }}>
                  <MenuSettings
                    {...dataset}
                    onChangeFieldDataset={this.onChangeFieldDataset}
                    onChangeField={this.onChangeField}
                    PAL={PAL}
                    onChangePAL={this.onChangePAL}
                    ignoredMealTypes={ignoredMealTypes}
                    diet={diet}
                    mealsPerDay={mealsPerDay}
                    kcal={kcal}
                    intActive={intActive}
                    saladOnDinner={saladOnDinner}
                    tags={tags}
                    exceptions={exceptions}
                  />
                </div>
              </div>
            </div>
          </div>

          {customMenu.isActive && (
            <div className="row">
              <div className="col-md-12 col-xs-12">
                <div className="card">
                  <div className="card-body" style={{ padding: '10px 20px' }}>
                    <CustomMenu
                      onChangeCustomMenu={this.onChangeCustomMenu}
                      customMenu={customMenu}
                      customPrice={customPrice}
                      onChangeCustomPrice={this.onChangeCustomPrice}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-md-12 col-xs-12">
              <div className="card">
                <div className="card-body" style={{ padding: '10px 20px' }}>
                  <OrderDetails
                    length={length}
                    customLength={customLength}
                    size={size}
                    kitchen={kitchen}
                    kitchens={kitchens}
                    prefferedKitchen={prefferedKitchen}
                    onChangeKitchen={this.onChangeKitchen}
                    onChangeOrderLength={this.onChangeOrderLength}
                    onChangeField={this.onChangeField}
                    onChangeCustomLength={this.onChangeCustomLength}
                    promocode={promocode}
                    pricePerDay={pricePerDay}
                    originalPrice={originalPrice}
                    priceWithPromo={priceWithPromo}
                    calculatePrice={this.calculatePrice}
                    timestamp={timestamp}
                    bufferInfo={bufferInfo}
                    checkBuffer={this.checkBuffer}
                    onChangeDate={this.onChangeDate}
                    customMenu={customMenu}
                    customPrice={customPrice}
                    onChangeCustomPrice={this.onChangeCustomPrice}
                    creditBalance={creditBalance}
                    useCreditChecked={useCreditChecked}
                    onChangeUseCredit={this.onChangeUseCredit}
                    useCredit={useCredit}
                    isPriceCalculated={isPriceCalculated}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-xs-12">
              <div className="card">
                <div className="card-body" style={{ padding: '10px 20px' }}>
                  <DeliveryInfo
                    deliveryTime={deliveryTime}
                    onChangeField={this.onChangeField}
                    onChangeDeliveryTime={this.onChangeDeliveryTime}
                    address={address}
                    pickupPoint={pickupPoint}
                    pickupPoints={pickupPoints}
                    deliveryDescription={deliveryDescription}
                    isAddDeliveryFee={isAddDeliveryFee}
                    isAddressChecked={isAddressChecked}
                    checkIsAvailable={this.checkIsAvailable}
                    checkingIsAvailable={checkingIsAvailable}
                    pickupPointChecked={pickupPointChecked}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-xs-12">
              <div className="card" style={{ border: '1px solid' }}>
                <div className="card-body">
                  <Row gutter={16}>
                    <Col sm={5}>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.Name:SPACE' })}</strong>
                        {name}
                      </p>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.Phone:SPACE' })}</strong>
                        {phone}
                      </p>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.Email:SPACE' })}</strong>
                        {email}
                      </p>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.InBodyId:SPACE' })}</strong>
                        {inBodyId}
                      </p>
                    </Col>
                    <Col sm={4}>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.Gender:SPACE' })}</strong>
                        {dataset.sex}
                      </p>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.Age:SPACE' })}</strong>
                        {dataset.age}
                      </p>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.WeightPerDay:SPACE' })}</strong>
                        {dataset.weight}
                      </p>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.Height:SPACE' })}</strong>
                        {dataset.height}
                      </p>
                    </Col>
                    <Col sm={4}>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.Diet:SPACE' })}</strong>
                        {diet}
                      </p>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.Days:SPACE' })}</strong>
                        {length}
                      </p>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.MealsPerDay:SPACE' })}</strong>
                        {mealsPerDay}
                      </p>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.SkippedMeals:SPACE' })}</strong>
                        {ignoredMealTypes}
                      </p>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.kCal:SPACE' })}</strong>
                        {kcal}
                      </p>
                    </Col>
                    <Col sm={6}>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.Start:SPACE' })}</strong>
                        {timestamp}
                      </p>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.DeliveryAddress:SPACE' })}</strong>
                        <br />
                        {address}
                      </p>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.DeliveryComment:SPACE' })}</strong>
                        {deliveryDescription}
                      </p>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.Billing:SPACE' })}</strong>
                        <br />
                        {`${paymentAddress} ${zip}`}
                        <br />
                        {isCompany ? formatMessage({ id: 'Orders.IČO:SPACE' }) + regNumber : ''}
                        <br />
                        {isCompany ? formatMessage({ id: 'Orders.DIČ:SPACE' }) + vatNumber : ''}
                      </p>
                    </Col>
                    <Col sm={4}>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.PricePerDay:SPACE' })}</strong>
                        {customPrice ? Math.round(customPrice / length) : pricePerDay} Kč
                      </p>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.OriginalPrice:SPACE' })}</strong>
                        {customPrice || originalPrice} Kč
                      </p>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.Discount:SPACE' })}</strong>
                        {customPrice ? '-' : originalPrice - priceWithPromo} Kč
                      </p>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.DeliveryFee:SPACE' })}</strong>
                        {isAddDeliveryFee ? length * 50 : 0} Kč
                        <br />
                        <Checkbox
                          style={{ marginRight: '10px' }}
                          checked={isAddDeliveryFee}
                          onChange={e => this.onChangeField(e, 'isAddDeliveryFee')}
                        />{' '}
                        <small>{formatMessage({ id: 'Orders.Add50ck/day' })}</small>
                      </p>
                      <p>
                        <strong>{formatMessage({ id: 'Orders.TotalPrice' })}</strong>
                        {customPrice !== 0 && customPrice}
                        {customPrice === 0 &&
                          `${(priceWithPromo || originalPrice) +
                            (isAddDeliveryFee ? length * 50 : 0) -
                            (useCreditChecked ? useCredit : 0)}
                        Kč`}
                      </p>
                    </Col>
                  </Row>
                  <div className="form-actions">
                    <span style={{ float: 'left', marginRight: 10 }}>
                      {formatMessage({ id: 'Orders.SendEmail:SPACE' })}
                      <Switch
                        checked={sendEmail}
                        onChange={e => this.onChangeField(e, 'sendEmail')}
                      />
                    </span>

                    <Button
                      style={{ float: 'right', marginLeft: 10 }}
                      type="primary"
                      size="large"
                      onClick={async () => this.onSend()}
                      disabled={
                        !bufferInfo.status ||
                        (!isAddressChecked && !pickupPoint) ||
                        (!pickupPointChecked && pickupPoint !== '')
                      }
                      loading={sending}
                    >
                      {isGlobalDeliveryFee && !isAddDeliveryFee
                        ? formatMessage({ id: 'Orders.SendToApprove' })
                        : formatMessage({ id: 'global.create' })}
                    </Button>
                    <Button
                      style={{ float: 'right' }}
                      type="default"
                      size="large"
                      onClick={async () => this.onSend(true)}
                      disabled={!bufferInfo.status}
                      loading={saving}
                    >
                      {formatMessage({ id: 'global.save' })}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default QuickOrder
