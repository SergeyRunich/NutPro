/* eslint-disable react/sort-comp */
import React from 'react'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  notification,
  Button,
  Form,
  Col,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  message,
} from 'antd'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
// eslint-disable-next-line no-unused-vars
import WorkLoadTable from './Table'
import {
  getKitchenWorkload,
  createKitchenLimit,
  removeKitchenWorkload,
  updateKitchenLimit,
} from '../../../api/erp/kitchenWorkload'
import { getAllKitchen } from '../../../api/kitchen'

moment.updateLocale('en', {
  week: { dow: 1 },
})

const { Option } = Select

@injectIntl
@connect(({ user }) => ({ user }))
class kitchenWorkload extends React.Component {
  state = {
    loading: false,
    tableData: [],
    typeOfsetting: 'none',
    kitchens: [],
    kitchen: 'Choose kitchen',
    cookingDate: '',
    min: 0,
    max: 0,
    salad: false,
    kitchenId: '',
  }

  constructor(props) {
    super(props)

    this.show = this.show.bind(this)
    this.handleRenderAddLimit = this.handleRenderAddLimit.bind(this)
    this.onChangeKitchen = this.onChangeKitchen.bind(this)
    this.onChangeCalendar = this.onChangeCalendar.bind(this)
    this.onChangeMin = this.onChangeMin.bind(this)
    this.onChangeMax = this.onChangeMax.bind(this)
    this.handleToggleSwitch = this.handleToggleSwitch.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.deleteWorkloadEntry = this.deleteWorkloadEntry.bind(this)
    this.handleRenderUpdateLimit = this.handleRenderUpdateLimit.bind(this)
  }

  componentDidMount() {
    this.show()
  }

  onChangeKitchen(e) {
    try {
      this.setState({
        kitchen: e,
      })
    } catch (error) {
      console.log(error)
    }
  }

  onChangeCalendar(date) {
    this.setState({
      cookingDate: date,
    })
  }

  onChangeMin(min) {
    this.setState({
      min,
    })
  }

  onChangeMax(max) {
    this.setState({
      max,
    })
  }

  handleToggleSwitch(salad) {
    this.setState({ salad })
  }

  handleRenderAddLimit() {
    this.setState({ typeOfsetting: 'create' })
  }

  handleRenderUpdateLimit(record) {
    this.setState({
      typeOfsetting: 'update',
      kitchenId: record.id,
      min: record.minimum,
      max: record.maximum,
      salad: record.salad,
    })
    console.log(record)
  }

  handleCancel() {
    this.setState({
      typeOfsetting: 'none',
      kitchen: 'All',
      cookingDate: '',
      min: 0,
      max: 0,
      salad: false,
    })
  }

  show() {
    this.setState({
      loading: true,
    })
    getKitchenWorkload().then(async req => {
      if (req.status === 401) {
        const { dispatch } = this.props
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            authorized: false,
          },
        })
        return
      }
      if (req.status === 200) {
        const res = await req.json()
        this.setState({
          tableData: res.result,
          loading: false,
        })
      } else {
        notification.error({
          message: req.status,
          description: req.statusText,
        })
        this.setState({
          loading: false,
        })
      }
    })

    getAllKitchen().then(async answer => {
      const json = await answer.json()
      this.setState({
        kitchens: json,
      })
    })
  }

  deleteWorkloadEntry = async id => {
    const {
      intl: { formatMessage },
    } = this.props
    const req = await removeKitchenWorkload(id)
    if (req.status === 204) {
      message.success(formatMessage({ id: 'KitchenWorkload.Deleted!' }))
      this.show()
    } else {
      message.error(formatMessage({ id: 'KitchenWorkload.Error: ' }), req.statusText)
    }
  }

  async handleSave() {
    try {
      const { salad, cookingDate, max, min, kitchen } = this.state
      const {
        intl: { formatMessage },
      } = this.props
      const onSendData = {
        cookingDate: moment(cookingDate).format('DD-MM-YYYY'),
        minimum: min,
        maximum: max,
        salad,
        kitchenId: kitchen,
      }
      const req = await createKitchenLimit(onSendData)
      if (req.status === 201) {
        this.show()
        this.setState({
          typeOfsetting: 'none',
          kitchen: 'All',
          cookingDate: '',
          min: 0,
          max: 0,
          salad: false,
        })
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'KitchenWorkload.Data added successfully!' }),
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
          placement: 'topLeft',
        })
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  async handleUpdate() {
    try {
      const { salad, max, min, kitchenId } = this.state
      const {
        intl: { formatMessage },
      } = this.props
      const onSendData = {
        minimum: min,
        maximum: max,
        salad,
      }
      const req = await updateKitchenLimit(kitchenId, onSendData)
      if (req.status === 200) {
        this.show()
        this.setState({
          typeOfsetting: 'none',
        })
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'KitchenWorkload.Data updated successfully!' }),
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
          placement: 'topLeft',
        })
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { loading, tableData, typeOfsetting, kitchens, kitchen, min, max, salad } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    const dDay =
      moment().endOf('day') > moment().add(1, 'days')
        ? moment().endOf('day')
        : moment().add(1, 'days')

    return (
      <Authorize roles={['finance', 'root', 'salesDirector']} redirect to="/main">
        <Helmet title={formatMessage({ id: 'KitchenWorkload.KITCHENS WORKLOAD' })} />
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  className="utils__title"
                >
                  <strong>{formatMessage({ id: 'KitchenWorkload.KITCHENS WORKLOAD' })}</strong>
                  {typeOfsetting === 'none' && (
                    <Button
                      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      type="primary"
                      onClick={this.handleRenderAddLimit}
                    >
                      {formatMessage({ id: 'global.create' })}
                    </Button>
                  )}
                </div>
              </div>

              <div className="card-body">
                {typeOfsetting !== 'none' && (
                  <div>
                    <Form layout="horizontal" onSubmit={this.onSend}>
                      {typeOfsetting !== 'update' && (
                        <Col xl={4} md={24}>
                          <Form.Item label={formatMessage({ id: 'KitchenWorkload.Cooking date' })}>
                            <DatePicker
                              format="DD.MM.YYYY"
                              disabledDate={currentDay =>
                                (currentDay && currentDay < dDay) ||
                                (currentDay.day() !== 2 &&
                                  currentDay.day() !== 4 &&
                                  currentDay.day() !== 0)
                              }
                              inline
                              onChange={this.onChangeCalendar}
                              showWeekNumbers
                            />
                          </Form.Item>
                        </Col>
                      )}
                      {typeOfsetting !== 'update' && (
                        <Col xl={4} md={24}>
                          <Form.Item label={formatMessage({ id: 'KitchenWorkload.Kitchen' })}>
                            <Select
                              value={kitchen}
                              style={{ width: '115px', marginRight: '10px' }}
                              onChange={this.onChangeKitchen}
                            >
                              {kitchens &&
                                kitchens.map(k => (
                                  <Option key={k.id} value={k.id}>
                                    {k.name}
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      )}

                      <Col xl={3} md={24}>
                        <Form.Item label={formatMessage({ id: 'KitchenWorkload.Min' })}>
                          <InputNumber min={0} value={min} onChange={this.onChangeMin} />
                        </Form.Item>
                      </Col>

                      <Col xl={3} md={24}>
                        <Form.Item label={formatMessage({ id: 'KitchenWorkload.Max' })}>
                          <InputNumber min={0} value={max} onChange={this.onChangeMax} />
                        </Form.Item>
                      </Col>

                      <Col xl={3} md={24}>
                        <Form.Item label={formatMessage({ id: 'KitchenWorkload.Salad' })}>
                          <Switch
                            checked={salad}
                            onChange={this.handleToggleSwitch}
                            title="salad"
                          />
                        </Form.Item>
                      </Col>
                    </Form>
                    <div style={{ position: 'absolute', right: '20px', bottom: '20px' }}>
                      {typeOfsetting === 'create' && (
                        <Button
                          style={{
                            marginRight: '10px',
                          }}
                          disabled={
                            this.state.kitchen === 'Choose kitchen' || this.state.cookingDate === ''
                          }
                          type="primary"
                          onClick={this.handleSave}
                        >
                          {formatMessage({ id: 'global.save' })}
                        </Button>
                      )}

                      {typeOfsetting === 'update' && (
                        <Button
                          style={{
                            marginRight: '10px',
                          }}
                          type="primary"
                          onClick={this.handleUpdate}
                        >
                          {formatMessage({ id: 'KitchenWorkload.Update' })}
                        </Button>
                      )}

                      <Button
                        style={{
                          marginLeft: '10px',
                        }}
                        type="primary"
                        onClick={this.handleCancel}
                      >
                        {formatMessage({ id: 'global.cancel' })}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <WorkLoadTable
                  data={tableData}
                  deleteWorkloadEntry={this.deleteWorkloadEntry}
                  editEntry={this.handleRenderUpdateLimit}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default kitchenWorkload
