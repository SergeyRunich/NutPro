import React from 'react'
import lodash from 'lodash'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Redirect, withRouter } from 'react-router-dom'
import {
  Steps,
  Button,
  Icon,
  Radio,
  Select,
  Switch,
  Divider,
  Statistic,
  notification,
  Tag,
} from 'antd'
import { Helmet } from 'react-helmet'
import Calendar from '../../../components/NutritionPRO/Calendar'
import WrappedCartCheckoutForm from './CheckoutForm/index'
import Calculator from './Calculator'
import CustomParamsForm from './CustomParamsForm'
import Wizard from './Wizard'
import OrderParams from './OrderParams'
import MenuList from './MenuList'
import styles from './style.module.scss'
import { getUser, getUserKitchenByDate } from '../../../api/customer'
import { getIngredientTags } from '../../../api/erp/ingredientTags'
import {
  calculateOrder,
  calculatePriceWithPromo,
  postOrder,
  getOrder,
  getOrderPrice,
} from '../../../api/order'
import { getPickupPoints, getPickupPointByDate } from '../../../api/pickupPoint'
import { getOrderDays, getLastDeliveryDate } from '../../../services/order'
import { getBuffer } from '../../../api/productionBuffer'
import { getAllKitchen } from '../../../api/kitchen'

import { PAL, looseCoef, MACRO } from './data'

moment.updateLocale('en', {
  week: { dow: 1 },
})

const { Step } = Steps
const { Option } = Select

const lengthMonth = {
  2: 2,
  10: 12,
  12: 10,
  20: 24,
  24: 20,
  40: 48,
  48: 40,
  60: 72,
  72: 60,
}

@injectIntl
@withRouter
class CreateOrder extends React.Component {
  state = {
    diet: 'loose',
    method: 'wizard',
    mealsPerDay: 5,
    kitchen: '',
    size: 'short',
    salad: false,
    exeptions: [],
    tags: [],
    selectedKitchen: '',
    prefferedKitchen: '',
    allKitchens: [{ id: '', name: '-' }],
    length: 20,
    deliveryTime: [17, 22],
    promo: '',
    current: 0,
    user: {
      id: '',
      name: '',
      inBodyId: 0,
      email: '',
      phone: '',
      address: '',
      kitchenDescription: '',
      deliveryDescription: '',
      isAddressChecked: false,
      isAddDeliveryFee: false,
      lastDataset: {
        age: '',
        weight: '',
        height: '',
        sex: 'Male',
        PBF: '',
        BMR: '',
      },
    },
    isGlobalDeliveryFee: false,
    timestamp: moment()
      .add(2, 'days')
      .format('DD-MM-YYYY'),
    customParams: {
      kcal: 1700,
      prot: 100,
      fat: 100,
      carb: 100,
    },
    pricePerDay: 0,
    originalPrice: 0,
    priceWithPromo: -1,
    menu: [],
    loading: false,
    isNotCreated: false,
    orderDays: [],
    orderId: '',
    customLength: false,
    lastOrder: {},
    wizard: {
      trainingTime: 'beforeBreakfast',
      speed: 'middle',
      activitiesWork: '0',
      activitiesFree: '0',
      BMR: 1700,
      gender: 'Female',
    },
    calculatorVisible: true,
    sendEmail: false,
    isOffer: false,
    isCustomPrice: false,
    customPrice: 0,
    bufferInfo: {
      timestamp: 0,
      kitchen: '',
      status: false,
      currentValue: 0,
      maxValue: 0,
      currentBuffer: 0,
    },
    pickupPoint: '',
    pickupPoints: [],
    creditBalance: 0,
    useCredit: 0,
    useCreditChecked: false,
    totalPrice: 0,
    bufferNotChecked: false,
    pickupPointChecked: false,
    checkingIsAvailable: false,
  }

  constructor(props) {
    super(props)
    this.onChangeparams = this.onChangeparams.bind(this)
    this.onChangeMethod = this.onChangeMethod.bind(this)
    this.onChangeMeals = this.onChangeMeals.bind(this)
    this.onChangeCustom = this.onChangeCustom.bind(this)
    this.copyCalcData = this.copyCalcData.bind(this)
    this.onChangeSalad = this.onChangeSalad.bind(this)
    this.onChangeOrderParams = this.onChangeOrderParams.bind(this)
    this.onChangeOrderLength = this.onChangeOrderLength.bind(this)
    this.onChangeStartDate = this.onChangeStartDate.bind(this)
    this.getStartDate = this.getStartDate.bind(this)
    this.onChangeDeliveryTime = this.onChangeDeliveryTime.bind(this)
    this.onChangePromo = this.onChangePromo.bind(this)
    this.createOrder = this.createOrder.bind(this)
    this.onChangeCustomLength = this.onChangeCustomLength.bind(this)
    this.updateWizard = this.updateWizard.bind(this)
    this.copyBMR = this.copyBMR.bind(this)
    this.showCalculator = this.showCalculator.bind(this)
    this.onChangeSendEmail = this.onChangeSendEmail.bind(this)
    this.onChangeIsOffer = this.onChangeIsOffer.bind(this)
    this.onChangeParams = this.onChangeParams.bind(this)
    this.onChangeIsCustomPrice = this.onChangeIsCustomPrice.bind(this)
    this.onChangeUseCredit = this.onChangeUseCredit.bind(this)
    this.onChangeKitchen = this.onChangeKitchen.bind(this)
    this.onChangeTags = this.onChangeTags.bind(this)
    this.checkIsAvailable = this.checkIsAvailable.bind(this)
  }

  componentDidMount() {
    const { props } = this
    this.getStartDate()
    getUser(props.match.params.id).then(async user => {
      const json = await user.json()
      this.setState(state => ({
        user: {
          name: json.name,
          inBodyId: json.inBodyId,
          email: json.email,
          phone: json.phone,
          address: json.address,
          lastDataset:
            json?.lastDataSet?.status === 'Available'
              ? json.lastDataSet.data
              : state.user.lastDataset,
          id: json.id,
          isAddDeliveryFee: false,
        },
        wizard: {
          trainingTime: 'none',
          speed: 'middle',
          activitiesWork: '0',
          activitiesFree: '0',
          BMR: json?.lastDataSet?.status === 'Available' ? json.lastDataSet.data.BMR : 1700,
        },
        calculatorVisible: !(json?.lastDataSet?.status === 'Available'),
        creditBalance: json.creditBalance,
      }))
    })
    setTimeout(() => {
      const searchParams = new URLSearchParams(props.location.search)
      const { user } = this.state
      if (searchParams.get('preset')) {
        const kcal = Number(searchParams.get('kcal'))
        const mealsPerDay = Number(searchParams.get('mealsPerDay'))
        const size = searchParams.get('size')
        const length = Number(searchParams.get('length'))
        const customLength = Number(searchParams.get('customLength'))
        user.deliveryDescription = searchParams.get('deliveryDescription')
        const deliveryTime = String(searchParams.get('deliveryTime')).split(',')
        const diet = searchParams.get('diet')
        const promo = searchParams.get('promocode')

        this.onChangeCustom(kcal, 'kcal', 'macro')
        this.setState({
          length,
          size,
          mealsPerDay,
          salad: mealsPerDay !== 2,
          method: 'custom',
          customLength,
          deliveryTime,
          user,
          diet,
          promo,
        })
      }
    }, 1200)
    if (props.match.params.prolong) {
      getOrder(props.match.params.prolong).then(async order => {
        setTimeout(async () => {
          const { user } = this.state
          const json = await order.json()
          if (order.status === 200) {
            user.address = json.result.user.address
            user.email = json.result.user.email
            user.phone = json.result.user.phone
            user.isAddressChecked = false
            this.setState({
              lastOrder: json.result,
              length: json.result.length,
              size: json.result.size,
              deliveryTime: json.result.deliveryRange,
              mealsPerDay: json.result.mealsPerDay,
              diet: json.result.diet,
              customParams: json.result.nutrients,
              salad: json.result.saladOnDinner,
              pickupPoint: json.result.pickupPoint.id,
              user,
            })
            this.getStartDate(
              getLastDeliveryDate(
                json.result.timestamp,
                json.result.length,
                json.result.size,
                json.result.pauses,
              ),
            )
          }
        }, 1000)
      })
    }
    getPickupPoints().then(async req => {
      if (req.status !== 401) {
        const pickupPoints = await req.json()
        this.setState({
          pickupPoints: pickupPoints.result,
        })
      }
    })

    getAllKitchen().then(async req => {
      if (req.status !== 401) {
        const kitchens = await req.json()
        this.setState({
          allKitchens: kitchens,
          selectedKitchen: kitchens[0].id,
        })
      }
    })

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
        const json = await answer.json()
        this.setState({
          tags: json.result,
        })
      }
    })
  }

  onChangeparams(e) {
    const { method } = this.state
    this.setState({
      [e.target.name]: e.target.value,
    })
    if (method === 'wizard') {
      setTimeout(() => this.updateWizard(), 1000)
    }
  }

  onChangeMethod(e) {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onChangeSalad(checked) {
    this.setState({
      salad: checked,
    })
  }

  onChangeCustomLength(checked) {
    this.setState({
      customLength: checked,
    })
  }

  onChangeIsCustomPrice(checked) {
    this.setState({
      isCustomPrice: checked,
    })
  }

  onChangeSendEmail(checked) {
    this.setState(state => ({
      sendEmail: checked,
      isOffer: checked ? false : state.isOffer,
    }))
  }

  onChangeIsOffer(checked) {
    this.setState(state => ({
      isOffer: checked,
      sendEmail: checked ? false : state.sendEmail,
    }))
  }

  onChangeMeals(e) {
    this.setState({
      mealsPerDay: e,
    })
  }

  onChangeCustom(value, name, type) {
    const { customParams } = this.state

    customParams[name] = value
    if (name === 'kcal' && type !== 'kcal') {
      customParams.prot = Math.round((customParams.kcal * 0.3) / 4)
      customParams.fat = Math.round((customParams.kcal * 0.3) / 9)
      customParams.carb = Math.round((customParams.kcal * 0.4) / 4)
    } else if (name !== 'kcal' && type === 'kcal') {
      customParams.kcal = Math.round(
        4 * customParams.prot + 9 * customParams.fat + 4 * customParams.carb,
      )
    }
    this.setState({
      customParams,
    })
  }

  onChangeOrderParams(e, field) {
    const { user } = this.state

    if (field === 'pickupPoint') {
      this.setState({
        pickupPoint: e,
      })
    }

    if (field === 'isGlobalDeliveryFee') {
      this.setState({
        isGlobalDeliveryFee: e,
      })
    }
    if (field === 'address') {
      user.isAddressChecked = false
      this.setState({
        user,
      })
    }
    if (e !== null && e.target) {
      if (e.target.type === 'checkbox') {
        user[field] = e.target.checked
        this.setState({
          user,
        })
      } else {
        user[field] = e.target.value
        this.setState({
          user,
        })
      }
    } else {
      user[field] = e
      this.setState({
        user,
      })
    }
  }

  onChangeKitchen(e) {
    if (e !== null) {
      this.setState({
        selectedKitchen: e.key,
      })
    }
  }

  onChangeUseCredit() {
    const { creditBalance, originalPrice, length, user } = this.state
    const deliveryFeePricePerDay = 50
    const totalPrice =
      originalPrice + length * deliveryFeePricePerDay * Number(user.isAddDeliveryFee)
    const useCredit = !this.state.useCreditChecked ? Math.min(Number(creditBalance), totalPrice) : 0
    this.setState(state => ({ useCreditChecked: !state.useCreditChecked, useCredit, totalPrice }))
  }

  onChangeParams(e, field) {
    let v = e
    if (e !== null && e.target) {
      if (e.target.type === 'checkbox') {
        v = e.target.checked
      } else {
        v = e.target.value
      }
    }
    this.setState({
      [field]: v,
    })
  }

  onChangeTags(e, field) {
    if (e.target) {
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

  onChangeOrderLength(e) {
    const { length, mealsPerDay, customParams, promo } = this.state
    let ln = e
    if (e !== null && e.target) {
      ln = e.target.value
    }
    getOrderPrice({ length: ln, customParams, mealsPerDay }).then(async calc => {
      const json = await calc.json()
      this.setState({
        pricePerDay: Number(json.price),
        originalPrice: Number(json.orderPrice),
      })
      setTimeout(() => {
        const { pricePerDay } = this.state
        if (e !== null && e.target) {
          if (e.target.name === 'length') {
            this.setState(state => ({
              length: e.target.value,
              originalPrice: state.pricePerDay * e.target.value,
            }))
            if (e.target.value === 5) {
              this.setState({
                priceWithPromo: -1,
              })
            } else {
              this.priceWithPromo(pricePerDay * e.target.value, promo)
            }
          } else if (e.target.name === 'size') {
            this.setState({
              size: e.target.value,
              length: lengthMonth[length],
              originalPrice: pricePerDay * lengthMonth[length],
            })
            this.priceWithPromo(pricePerDay * lengthMonth[length], promo)
          }
        } else {
          this.setState(state => ({
            length: e,
            originalPrice: state.pricePerDay * e,
          }))
          if (e === 5) {
            this.setState({
              priceWithPromo: -1,
            })
          } else {
            this.priceWithPromo(pricePerDay * e, promo)
          }
        }
      }, 1000)
    })
  }

  onChangeStartDate(dateString) {
    this.setState({
      timestamp: dateString,
    })
    setTimeout(() => {
      this.checkBuffer()
    }, 300)
  }

  onChangeDeliveryTime(deliveryTime) {
    this.setState({
      deliveryTime,
    })
  }

  onChangePromo(promo) {
    const { originalPrice } = this.state
    this.setState({
      promo: promo.target.value,
    })
    this.priceWithPromo(originalPrice, promo.target.value)
  }

  getStartDate(lastDay = false) {
    if (lastDay) {
      if (moment.utc().unix() < lastDay) {
        if ([2, 5, 7].indexOf(moment.unix(lastDay).isoWeekday()) !== -1) {
          this.setState({
            timestamp: moment
              .unix(lastDay)
              .add(3, 'days')
              .format('DD-MM-YYYY'),
          })
        } else if ([1, 4].indexOf(moment.unix(lastDay).isoWeekday()) !== -1) {
          this.setState({
            timestamp: moment
              .unix(lastDay)
              .add(4, 'days')
              .format('DD-MM-YYYY'),
          })
        } else if ([3, 6].indexOf(moment.unix(lastDay).isoWeekday()) !== -1) {
          this.setState({
            timestamp: moment
              .unix(lastDay)
              .add(2, 'days')
              .format('DD-MM-YYYY'),
          })
        }
      }
      return
    }
    if ([2, 5, 7].indexOf(moment.utc().isoWeekday()) !== -1) {
      this.setState({
        timestamp: moment
          .utc()
          .add(3, 'days')
          .format('DD-MM-YYYY'),
      })
    } else if ([1, 4].indexOf(moment.utc().isoWeekday()) !== -1) {
      this.setState({
        timestamp: moment
          .utc()
          .add(4, 'days')
          .format('DD-MM-YYYY'),
      })
    } else if ([3, 6].indexOf(moment.utc().isoWeekday()) !== -1) {
      this.setState({
        timestamp: moment
          .utc()
          .add(2, 'days')
          .format('DD-MM-YYYY'),
      })
    }
  }

  checkBuffer = async () => {
    this.setState({
      bufferNotChecked: true,
    })
    const { timestamp, user, prefferedKitchen } = this.state
    getUserKitchenByDate(user.id, timestamp).then(async req => {
      if (req.status !== 401) {
        const kitchen = await req.json()
        this.setState({
          kitchen: kitchen.result.id,
          bufferNotChecked: false,
        })
        await getBuffer(
          timestamp,
          prefferedKitchen !== '' ? prefferedKitchen : kitchen.result.id,
        ).then(async req2 => {
          if (req2.ok) {
            const bufferInfo = await req2.json()
            this.setState({
              bufferInfo: bufferInfo.result,
              bufferNotChecked: false,
            })
          } else {
            notification.error({
              message: 'Error',
              description: req2.statusText,
            })
            this.setState({
              bufferNotChecked: false,
            })
          }
        })
      }
    })
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

  showCalculator() {
    this.setState(state => ({
      calculatorVisible: !state.calculatorVisible,
    }))
  }

  priceWithPromo(originalPrice, promoCode) {
    calculatePriceWithPromo({ originalPrice, promoCode }).then(async promo => {
      const json = await promo.json()
      if (promo.status === 200) {
        this.setState({
          priceWithPromo: json.price,
        })
      } else {
        this.setState({
          priceWithPromo: -1,
        })
      }
    })
  }

  copyCalcData(kcal) {
    const { customParams } = this.state
    customParams.kcal = kcal
    this.onChangeCustom(kcal, 'kcal', 'macro')
  }

  copyBMR(kcal) {
    const { wizard } = this.state
    wizard.BMR = kcal
    this.setState({
      wizard,
    })

    setTimeout(() => this.updateWizard(), 1000)
  }

  updateWizard(e, name) {
    const { diet, wizard, customParams } = this.state
    if (e) {
      wizard[name] = e.target.value
    }
    const looseCf = diet === 'loose' ? looseCoef[wizard.speed] : 1
    const gainCf = diet === 'gain' ? 1.08 : 1
    customParams.kcal = Math.round(
      wizard.BMR * PAL[wizard.activitiesWork + wizard.activitiesFree] * looseCf * gainCf,
    )
    customParams.prot = Math.round(
      (customParams.kcal * MACRO[diet][PAL[wizard.activitiesWork + wizard.activitiesFree]].prot) /
        4,
    )
    customParams.fat = Math.round(
      (customParams.kcal * MACRO[diet][PAL[wizard.activitiesWork + wizard.activitiesFree]].fat) / 9,
    )
    customParams.carb = Math.round(
      (customParams.kcal * MACRO[diet][PAL[wizard.activitiesWork + wizard.activitiesFree]].carb) /
        4,
    )
    this.setState({
      wizard,
      customParams,
    })
  }

  next() {
    let { current } = this.state
    const { mealsPerDay, customParams, size, salad, user, lastOrder, length, promo } = this.state
    current += 1
    if (current === 1) {
      this.setState({
        loading: true,
      })
      const data = {
        PAL: 1.2,
        length,
        size,
        mealsPerDay,
        oneDishOnMeal: !salad,
        customParams,
      }
      calculateOrder(data).then(async calc => {
        const json = await calc.json()
        this.setState(state => ({
          pricePerDay: Number(json.price),
          originalPrice: state.length * Number(json.price),
          menu: json.days,
          loading: false,
          current,
        }))
        if (promo) {
          this.priceWithPromo(length * Number(json.price), promo)
          if (lastOrder.id) {
            const newUser = user
            user.deliveryDescription = lastOrder.deliveryDescription
            user.kitchenDescription = lastOrder.kitchenDescription
            this.setState({
              user: newUser,
            })
          }
        }
      })
    } else if (current === 3) {
      if (!user.address || user.address === '' || user.email === '' || user.phone === '') {
        notification.error({
          message: 'Error',
          description: 'Please input required fields!',
        })
      } else {
        const { timestamp } = this.state
        const date = moment.utc(timestamp, 'DD-MM-YYYY').unix()
        const orderDays = getOrderDays(date, length, size)
        this.setState({
          orderDays,
          current,
        })
      }
    } else {
      this.setState({
        current,
      })
    }
  }

  prev() {
    let { current } = this.state
    current -= 1
    this.setState({
      current,
    })
  }

  async createOrder() {
    const {
      user,
      diet,
      size,
      length,
      mealsPerDay,
      customParams,
      deliveryTime,
      promo,
      timestamp,
      salad,
      exeptions,
      method,
      sendEmail,
      isOffer,
      lastOrder,
      isCustomPrice,
      customPrice,
      kitchen,
      isGlobalDeliveryFee,
      pickupPoint,
      useCredit,
    } = this.state
    const {
      intl: { formatMessage },
    } = this.props
    const { props } = this

    if (!user.phone || !user.email) {
      return
    }

    const isCustomDesc = Boolean(lastOrder.id)

    const data = {
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      PAL: '1_2',
      diet,
      length,
      kitchenDescription: user.kitchenDescription,
      deliveryDescription: isCustomDesc
        ? user.deliveryDescription || ''
        : `${user.deliveryDescription || ''} Preferovaný čas doručení: ${deliveryTime[0]}.00-${
            deliveryTime[1]
          }.00`,
      size,
      deliveryTime: props.match.params.prolong ? lastOrder.deliveryTime : deliveryTime,
      deliveryRange: deliveryTime,
      mealsPerDay,
      speed: 'slow',
      trainingTime: 'none',
      userId: user.id,
      oneDishOnMeal: true,
      saladOnDinner: salad,
      exeptions,
      type: method,
      isOffer,
      sendEmail,
      isAddDeliveryFee: user.isAddDeliveryFee,
      customPrice: isCustomPrice ? customPrice : false,
      kitchen,
      pickupPoint,
      onApproveDeliveryFee: isGlobalDeliveryFee && !user.isAddDeliveryFee,
      useCredit,
    }

    if (promo && length > 5) {
      data.promoCode = promo
    }
    data.wizardSteps = ''

    data.timestamp = moment.utc(timestamp, 'DD-MM-YYYY').unix()
    data.customParams = {
      energy: customParams.kcal,
      prot: customParams.prot,
      fat: customParams.fat,
      carbo: customParams.carb,
    }
    this.setState({
      isNotCreated: true,
    })
    const orderSent = await postOrder(data)
    if (orderSent.status === 202) {
      const json = await orderSent.json()
      notification.success({
        message: formatMessage({ id: 'global.success' }),
        description: formatMessage({ id: 'Orders.OrderSuccessfullyCreated' }),
      })
      this.setState({
        orderId: json.orderId,
        isNotCreated: false,
      })
    } else {
      notification.error({
        message: formatMessage({ id: 'global.error' }),
        description: orderSent.statusText,
      })
      this.setState({
        isNotCreated: false,
      })
    }
  }

  render() {
    const {
      current,
      diet,
      method,
      customParams,
      mealsPerDay,
      user,
      menu,
      loading,
      isNotCreated,
      pricePerDay,
      size,
      salad,
      exeptions,
      tags,
      length,
      timestamp,
      deliveryTime,
      originalPrice,
      promo,
      priceWithPromo,
      orderDays,
      orderId,
      customLength,
      wizard,
      calculatorVisible,
      sendEmail,
      isOffer,
      lastOrder,
      isCustomPrice,
      customPrice,
      bufferInfo,
      kitchen,
      isGlobalDeliveryFee,
      pickupPoints,
      pickupPoint,
      creditBalance,
      useCreditChecked,
      useCredit,
      totalPrice,
      bufferNotChecked,
      allKitchens,
      prefferedKitchen,
      selectedKitchen,
      pickupPointChecked,
      checkingIsAvailable,
    } = this.state

    const {
      intl: { formatMessage },
    } = this.props

    const highlightedDays = orderDays.map(orderDay =>
      moment.unix(Number(orderDay)).format('DD-MM-YYYY'),
    )

    const steps = [
      {
        title: formatMessage({ id: 'Orders.Diet&Macronutrients' }),
        icon: <Icon type="calculator" style={{ fontSize: 40 }} />,
        content: (
          <div className="row">
            <div className={`col-md-${calculatorVisible ? 8 : 12} col-xs-12`}>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ marginRight: '10px', marginBottom: '10px', display: 'inline-block' }}>
                  <Radio.Group onChange={this.onChangeMethod} name="method" value={method}>
                    <Radio.Button value="wizard">
                      {formatMessage({ id: 'Orders.Wizard' })}
                    </Radio.Button>
                    <Radio.Button value="custom">
                      {formatMessage({ id: 'Orders.Custom' })}
                    </Radio.Button>
                  </Radio.Group>
                </div>
                <div style={{ marginRight: '10px', marginBottom: '10px', display: 'inline-block' }}>
                  <Radio.Group key="diet" name="diet" onChange={this.onChangeparams} value={diet}>
                    <Radio.Button value="loose">
                      {formatMessage({ id: 'Orders.Loose' })}
                    </Radio.Button>
                    <Radio.Button value="keep">{formatMessage({ id: 'Orders.Keep' })}</Radio.Button>
                    <Radio.Button value="gain">{formatMessage({ id: 'Orders.Gain' })}</Radio.Button>
                  </Radio.Group>
                </div>
                <div style={{ marginRight: '10px', marginBottom: '10px', display: 'inline-block' }}>
                  <Radio.Group key="size" name="size" onChange={this.onChangeparams} value={size}>
                    <Radio.Button value="short">
                      {formatMessage({ id: 'Orders.Short' })}
                    </Radio.Button>
                    <Radio.Button value="long">{formatMessage({ id: 'Orders.Long' })}</Radio.Button>
                  </Radio.Group>
                </div>
                <Select
                  placeholder={formatMessage({ id: 'Orders.MealsPerDay' })}
                  name="mealsPerDay"
                  value={mealsPerDay}
                  onChange={this.onChangeMeals}
                  style={{ marginRight: '10px', marginBottom: '10px' }}
                >
                  <Option key="2" value={2}>
                    {formatMessage({ id: 'Orders.HomeOffice' })}
                  </Option>
                  <Option key="3" value={3}>
                    {formatMessage({ id: 'Orders.3Meals' })}
                  </Option>
                  <Option key="5" value={5}>
                    {formatMessage({ id: 'Orders.5Meals' })}
                  </Option>
                </Select>

                <Select
                  placeholder={formatMessage({ id: 'Orders.Exception tag' })}
                  mode="multiple"
                  value={exeptions}
                  onChange={e => this.onChangeTags(e, 'exeptions')}
                  size="default"
                  style={{ marginBottom: '10px', minWidth: '127px' }}
                >
                  {tags.map(tag => (
                    <Option
                      disabled={exeptions.length !== 0 && exeptions[0] !== tag.id}
                      key={tag.id}
                      value={tag.id}
                    >
                      {tag.title}
                    </Option>
                  ))}
                </Select>

                <span style={{ marginLeft: '10px' }}>
                  {formatMessage({ id: 'Orders.SaladSPACE' })}
                  <Switch
                    style={{ marginLeft: '10px' }}
                    checked={salad}
                    onChange={this.onChangeSalad}
                  />
                </span>
                {!calculatorVisible && (
                  <span style={{ float: 'right' }}>
                    <Button type="primary" className="mr-3" onClick={this.showCalculator}>
                      {calculatorVisible
                        ? formatMessage({ id: 'Orders.HideCalculator' })
                        : formatMessage({ id: 'Orders.ShowCalculator' })}
                    </Button>
                  </span>
                )}
              </div>
              <div className="card" style={{ border: '1px solid' }}>
                <div className="card-body">
                  {method === 'custom' && (
                    <div>
                      <CustomParamsForm
                        customParams={customParams}
                        onChange={this.onChangeCustom}
                      />
                    </div>
                  )}
                  {method === 'wizard' && (
                    <div style={{ marginBottom: '5px', textAlign: 'center' }}>
                      {user.lastDataset.weight ? (
                        <Tag color="green">
                          {formatMessage({ id: 'Orders.MeasurementsAreAvailable' })}
                        </Tag>
                      ) : (
                        <Tag color="red">
                          {formatMessage({ id: 'Orders.MeasurementsAreMissing' })}
                          <br />
                          {formatMessage({
                            id: 'Orders.UsetheCalculatorAndCopyTheBMROrChooseCustom',
                          })}
                        </Tag>
                      )}
                    </div>
                  )}
                  {method === 'wizard' && (
                    <Wizard
                      diet={diet}
                      wizard={wizard}
                      update={this.updateWizard}
                      customParams={customParams}
                    />
                  )}
                </div>
              </div>
            </div>
            {calculatorVisible && (
              <div className="col-md-4 col-xs-12">
                <div className="card" style={{ border: '1px solid' }}>
                  <div className="card-body">
                    <div>
                      <div style={{ textAlign: 'center', marginBottom: '5px' }}>
                        <Button type="primary" className="mr-3" onClick={this.showCalculator}>
                          {calculatorVisible
                            ? formatMessage({ id: 'Orders.HideCalculator' })
                            : formatMessage({ id: 'Orders.ShowCalculator' })}
                        </Button>
                      </div>
                      <Calculator
                        data={{
                          weight: user.lastDataset.weight,
                          height: user.lastDataset.height,
                          age: user.lastDataset.age,
                          gender: user.lastDataset.sex,
                          PBF: user.lastDataset.PBF,
                          BMR: user.lastDataset.BMR,
                          PAL: 1,
                        }}
                        copy={this.copyCalcData}
                        copyBMR={this.copyBMR}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ),
      },
      {
        title: 'Menu',
        icon: <Icon type="menu" style={{ fontSize: 40 }} />,
        content: (
          <div>
            <MenuList customParams={customParams} data={menu} />
          </div>
        ),
      },
      {
        title: 'Order parameters',
        icon: <Icon type="setting" style={{ fontSize: 40 }} />,
        content: (
          <div className="row">
            <div className="col-md-7 col-sm-12">
              <WrappedCartCheckoutForm
                user={user}
                isGlobalDeliveryFee={isGlobalDeliveryFee}
                pickupPoints={pickupPoints}
                pickupPoint={pickupPoint}
                update={this.onChangeOrderParams}
                checkIsAvailable={this.checkIsAvailable}
                checkingIsAvailable={checkingIsAvailable}
                pickupPointChecked={pickupPointChecked}
              />
            </div>
            <div className="col-md-5 col-sm-12">
              <OrderParams
                update={this.onChangeOrderLength}
                size={size}
                length={length}
                timestamp={timestamp}
                deliveryTime={deliveryTime}
                onChangeDeliveryTime={this.onChangeDeliveryTime}
                onChangeStartDate={this.onChangeStartDate}
                onChangeKitchen={this.onChangeKitchen}
                allKitchens={allKitchens}
                prefferedKitchen={prefferedKitchen}
                selectedKitchen={selectedKitchen}
                promo={promo}
                originalPrice={originalPrice}
                priceWithPromo={priceWithPromo}
                onChangePromo={this.onChangePromo}
                customLength={customLength}
                onChangeCustomLength={this.onChangeCustomLength}
                isProlong={Boolean(lastOrder.id)}
                onChangeIsCustomPrice={this.onChangeIsCustomPrice}
                onChangeParams={this.onChangeParams}
                isCustomPrice={isCustomPrice}
                customPrice={customPrice}
                lastOrder={lastOrder}
                deliveryFee={{ isAddDeliveryFee: user.isAddDeliveryFee, length }}
                kitchen={kitchen}
                bufferInfo={bufferInfo}
                checkBuffer={this.checkBuffer}
                creditBalance={creditBalance}
                useCreditChecked={useCreditChecked}
                onChangeUseCredit={this.onChangeUseCredit}
                useCredit={useCredit}
                totalPrice={totalPrice}
                bufferNotChecked={bufferNotChecked}
              />
            </div>
          </div>
        ),
      },
      {
        title: 'Confirmation',
        icon: <Icon type="carry-out" style={{ fontSize: 40 }} />,
        content: (
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <div className="card" style={{ border: '1px solid' }}>
                <div className="card-body">
                  <Divider>Customer</Divider>
                  <strong>{formatMessage({ id: 'Orders.Name:SPACE' })}</strong>
                  {user.name} <br />
                  <strong>{formatMessage({ id: 'Orders.InBodyID:SPACE' })}</strong>
                  {user.inBodyId}
                  <br />
                  <strong>{formatMessage({ id: 'Orders.Phone:SPACE' })}</strong>
                  {user.phone}
                  <br />
                  <strong>{formatMessage({ id: 'Orders.Email:SPACE' })}</strong>
                  {user.email}
                  <Divider>{formatMessage({ id: 'Orders.Order' })}</Divider>
                  <strong>{formatMessage({ id: 'Orders.Diet:SPACE' })}</strong>
                  {diet}
                  <br />
                  <strong>{formatMessage({ id: 'Orders.OtherLength:SPACE' })}</strong>
                  {length}
                  <br />
                  <strong>{formatMessage({ id: 'Orders.WeekSize:SPACE' })}</strong>
                  {size}
                  <br />
                  <strong>{formatMessage({ id: 'Orders.MealsPerDay:SPACE' })}</strong>
                  {mealsPerDay}
                  <br />
                  <strong>{formatMessage({ id: 'Orders.Salad:SPACE' })}</strong>
                  {salad ? formatMessage({ id: 'global.yes' }) : formatMessage({ id: 'global.no' })}
                  <br />
                  <strong>{formatMessage({ id: 'Orders.KitchenComment:SPACE' })}</strong>
                  {user.kitchenDescription}
                  <Divider>{formatMessage({ id: 'Orders.Delivery' })}</Divider>
                  <strong>{formatMessage({ id: 'Orders.FirstDeliveryDate:SPACE' })}</strong>
                  {timestamp}
                  <br />
                  <strong>{formatMessage({ id: 'Orders.Address:SPACE' })}</strong>
                  {user.address}
                  <br />
                  <strong>{formatMessage({ id: 'Orders.DeliveryComment:SPACE' })}</strong>
                  {user.deliveryDescription}
                  <br />
                  <strong>{formatMessage({ id: 'Orders.DeliveryTime:SPACE' })}</strong>
                  {deliveryTime[0]}:00 - {deliveryTime[1]}:00
                  <br />
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="card" style={{ border: '1px solid' }}>
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Statistic style={{}} title="kCal" value={customParams.kcal} />
                    <Statistic
                      style={{ marginLeft: '15px' }}
                      title={formatMessage({ id: 'Orders.Protein' })}
                      value={customParams.prot}
                    />
                    <Statistic
                      style={{ marginLeft: '15px' }}
                      title={formatMessage({ id: 'Orders.Fat' })}
                      value={customParams.fat}
                    />
                    <Statistic
                      style={{ marginLeft: '15px' }}
                      title={formatMessage({ id: 'Orders.Carbo' })}
                      value={customParams.carb}
                    />
                  </div>
                </div>
              </div>
              <div className="card" style={{ border: '1px solid' }}>
                <div className="card-body">
                  <Divider>{formatMessage({ id: 'Orders.Price' })}</Divider>
                  <strong>{formatMessage({ id: 'Orders.Promocode:SPACE' })}</strong>
                  {promo !== '' ? promo : '-'}
                  <br />
                  <strong>{formatMessage({ id: 'Orders.PriceWithPromocode:SPACE' })}</strong>
                  {priceWithPromo !== -1 ? `${priceWithPromo} Kč` : '-'}
                  <br />
                  <strong>{formatMessage({ id: 'Orders.Discount:SPACE' })}</strong>
                  {priceWithPromo !== -1 ? `${originalPrice - priceWithPromo} Kč` : '-'}
                  <br />
                  <strong>{formatMessage({ id: 'Orders.Delivery:SPACE' })}</strong>
                  {user.isAddDeliveryFee ? `${50 * length} Kč` : '-'}
                  <br />
                  <strong>{formatMessage({ id: 'Orders.UsedCreditBalance:SPACE' })}</strong>
                  {useCredit ? `${useCredit} Kč` : '-'}
                  <br />
                  <strong>{formatMessage({ id: 'Orders.PricePerDay:SPACE' })}</strong>
                  {pricePerDay} Kč
                  <br />
                  <strong>{formatMessage({ id: 'Orders.OriginalPrice:SPACE' })}</strong>
                  {originalPrice} Kč
                  <br />
                  <strong>{formatMessage({ id: 'Orders.TotalPrice:SPACE' })}</strong>
                  {priceWithPromo !== -1
                    ? `${priceWithPromo + (user.isAddDeliveryFee ? 50 * length : 0) - useCredit} Kč`
                    : `${originalPrice + (user.isAddDeliveryFee ? 50 * length : 0) - useCredit} Kč`}
                  <br />
                  <strong>{formatMessage({ id: 'Orders.CustomPrice:SPACE' })}</strong>
                  {isCustomPrice ? `${customPrice - useCredit} Kč` : `-`}
                  <br />
                  <Divider>{formatMessage({ id: 'Orders.TotalPrice' })}</Divider>
                  {isCustomPrice && (
                    <h3 style={{ textAlign: 'center' }}>{customPrice - useCredit} Kč</h3>
                  )}
                  {!isCustomPrice && (
                    <h3 style={{ textAlign: 'center' }}>
                      {priceWithPromo !== -1
                        ? priceWithPromo + (user.isAddDeliveryFee ? 50 * length : 0) - useCredit
                        : originalPrice +
                          (user.isAddDeliveryFee ? 50 * length : 0) -
                          useCredit}{' '}
                      Kč
                    </h3>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="card" style={{ border: '1px solid' }}>
                <div className="card-body">
                  <Calendar highlightedDays={highlightedDays} />
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ]

    return (
      <div>
        {orderId !== '' && <Redirect to={`/orders/${orderId}`} />}
        <Helmet title="Create order" />
        <div className="card">
          <div className="card-body">
            <div className="cart">
              <Steps current={current}>
                {steps.map(item => (
                  <Step key={item.title} title={item.title} icon={item.icon} />
                ))}
              </Steps>
              <div className={styles.stepsContent}>{steps[current].content}</div>
              <div className={`${styles.stepsAction} text-center`}>
                {current > 0 && (
                  <Button style={{ marginRight: 8 }} onClick={() => this.prev()}>
                    {formatMessage({ id: 'Orders.Previous' })}
                  </Button>
                )}
                {current < steps.length - 1 && (
                  <Button
                    type="primary"
                    disabled={
                      current === steps.length - 2 &&
                      ((!user.isAddressChecked && !pickupPoint) ||
                        !bufferInfo.status ||
                        (!pickupPointChecked && pickupPoint !== ''))
                    }
                    loading={loading}
                    onClick={() => this.next()}
                  >
                    {isGlobalDeliveryFee && !user.isAddDeliveryFee
                      ? formatMessage({ id: 'Orders.NextWithApproval' })
                      : formatMessage({ id: 'Orders.Next' })}
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <span>
                    {formatMessage({ id: 'Orders.SendEmailSPACE' })}
                    <Switch checked={sendEmail} onChange={this.onChangeSendEmail} />
                  </span>
                )}
                {current === steps.length - 1 && (
                  <span>
                    {formatMessage({ id: 'Orders.OfferSPACE' })}
                    <Switch checked={isOffer} onChange={this.onChangeIsOffer} />
                  </span>
                )}
                {current === steps.length - 1 && (
                  <Button
                    style={{ marginLeft: 8 }}
                    type="primary"
                    onClick={this.createOrder}
                    loading={isNotCreated}
                  >
                    {formatMessage({ id: 'Orders.CreateOrder' })}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CreateOrder
