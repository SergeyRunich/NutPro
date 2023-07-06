import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import moment from 'moment'
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  InputNumber,
  notification,
  Radio,
  Row,
  Select,
} from 'antd'

import { ALGORITHM_MC_ARDLE, DATE_TIME_FORMAT, SEX_MALE } from '../../../../helpers/constants'

const { Option } = Select

/**
 * todo: same calculator exists in MenuList, so this function should be exported
 *
 * @param sex 'Male'|'Female'
 * @param age int
 * @param weight int
 * @param height int
 * @param PBF
 * @param type
 * @returns {number}
 */
const calculateBMR = ({ sex, age, weight, height, PBF, type }) => {
  const mcArdle = 370 + 21.6 * (weight - weight * (PBF / 100) - 2.5)
  const hb =
    sex === SEX_MALE
      ? 66 + 13.7 * weight + 5 * height - 6.8 * age
      : 655 + 9.6 * weight + 1.8 * height - 4.7 * age
  const calcBMR = type === ALGORITHM_MC_ARDLE ? mcArdle : hb
  return Math.round(calcBMR)
}

const defaultState = {
  age: 0,
  weight: 0,
  height: 0,
  sex: SEX_MALE,
  BMR: null,
  BMI: 0,
  PBF: 0,
  VFA: 0,
  TBW: 0,
  muscle: 0,
}

const AddDatasetForm = ({ onClose, form, onCreate, update, userId, visible }) => {
  const { formatMessage } = useIntl()

  /**
   * todo: Consider using valtio to manage state of Object data type
   * https://github.com/pmndrs/valtio
   */
  const [state, setState] = useState({
    ...defaultState,
    type: ALGORITHM_MC_ARDLE,
    timestamp: moment().unix(),
  })

  const onChangeField = (e, field) => {
    if (e === null || !e.target) {
      setState(prev => {
        return { ...prev, [field]: e }
      })
      return
    }

    if (e.target.type === 'checkbox') {
      setState(prev => {
        return { ...prev, [field]: e.target.checked }
      })
      return
    }

    setState(prev => {
      return { ...prev, [field]: e.target.value }
    })
  }

  const onChangeDate = e => {
    if (e !== null) {
      setState(prev => {
        return { ...prev, timestamp: e.unix() }
      })
    }
  }

  const handleChangeType = async type => {
    setState(prev => {
      return { ...prev, type: type.target.value }
    })
  }

  const closeDrawer = () => {
    setState(prev => {
      return { ...prev, ...defaultState }
    })

    form.resetFields()
    onClose()
  }

  const onSend = async e => {
    e.preventDefault()
    try {
      await form.validateFields()

      const requestData = {
        ...state,
        VFA: state.VFA || 0,
        TBW: state.TBW || 0,
        muscle: state.muscle || 0,
        BMI: state.BMI || 0,
      }

      if (requestData.BMR < 800) {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: formatMessage({ id: 'Users.BMR is required!' }),
          placement: 'topLeft',
        })
        return
      }

      const req = await onCreate(userId, requestData)

      if (req.status === 202) {
        update()
        closeDrawer()
        notification.success({
          message: formatMessage({ id: 'Users.Created' }),
          description: formatMessage({ id: 'Users.Dataset successfully created!' }),
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

  let viewportWidth = 1080
  if (typeof window.innerWidth !== 'undefined') {
    viewportWidth = window.innerWidth
  }

  return (
    <div>
      <Drawer
        title={formatMessage({ id: 'Users.Create a new dataset' })}
        width={viewportWidth < 768 ? '100%' : 'auto'}
        onClose={closeDrawer}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <div style={{ marginRight: '20px', marginBottom: '20px', textAlign: 'center' }}>
          <Radio.Group key="calcType" value={state.type} onChange={handleChangeType}>
            <Radio.Button value="mcArdle">{formatMessage({ id: 'Users.McArdle' })}</Radio.Button>
            <Radio.Button value="harrisBenedict">
              {formatMessage({ id: 'Users.Harris–Benedict' })}
            </Radio.Button>
          </Radio.Group>
        </div>
        <Form layout="vertical" onSubmit={onSend}>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label={formatMessage({ id: 'global.date' })}>
                {form.getFieldDecorator('timestamp', {
                  rules: [{ required: true }],
                  initialValue: moment.unix(state.timestamp),
                })(
                  <DatePicker
                    style={{ width: '100%' }}
                    format={DATE_TIME_FORMAT}
                    showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
                    placeholder={formatMessage({ id: 'global.date' })}
                    onChange={e => onChangeDate(e)}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label={formatMessage({ id: 'Users.Age' })}>
                {form.getFieldDecorator('age', {
                  rules: [{ required: true }],
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder={formatMessage({ id: 'Users.Age' })}
                    onChange={e => onChangeField(e, 'age')}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item
                name="sex"
                label={formatMessage({ id: 'Users.Gender' })}
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'Users.Please choose gender' }),
                  },
                ]}
              >
                <Select
                  placeholder={formatMessage({ id: 'Users.Gender' })}
                  value={state.sex}
                  onChange={e => onChangeField(e, 'sex')}
                >
                  <Option key="Male" value="Male">
                    {formatMessage({ id: 'Users.Male' })}
                  </Option>
                  <Option key="Female" value="Female">
                    {formatMessage({ id: 'Users.Female' })}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label={formatMessage({ id: 'Users.Weight' })}>
                {form.getFieldDecorator('weight', {
                  rules: [{ required: true, type: 'number' }],
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder={formatMessage({ id: 'Users.Weight' })}
                    onChange={e => onChangeField(e, 'weight')}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label={formatMessage({ id: 'Users.Height' })}>
                {form.getFieldDecorator('height', {
                  rules: [{ required: true, type: 'number' }],
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder={formatMessage({ id: 'Users.Height' })}
                    onChange={e => onChangeField(e, 'height')}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label={formatMessage({ id: 'Users.BMR' })} required>
                <InputNumber
                  style={{ width: '100%' }}
                  value={state.BMR}
                  min={0}
                  placeholder={formatMessage({ id: 'Users.BMR' })}
                  onChange={e => onChangeField(e, 'BMR')}
                />
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label={formatMessage({ id: 'Users.PBF' })}>
                {form.getFieldDecorator('PBF', {
                  rules: [{ type: 'number' }],
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder={formatMessage({ id: 'Users.PBF' })}
                    onChange={e => onChangeField(e, 'PBF')}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label={formatMessage({ id: 'Users.VFA' })}>
                {form.getFieldDecorator('VFA', {
                  rules: [{ type: 'number' }],
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder={formatMessage({ id: 'Users.VFA' })}
                    onChange={e => onChangeField(e, 'VFA')}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label={formatMessage({ id: 'Users.Muscle' })}>
                {form.getFieldDecorator('muscle', {
                  rules: [{ type: 'number' }],
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder={formatMessage({ id: 'Users.muscle' })}
                    onChange={e => onChangeField(e, 'muscle')}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label={formatMessage({ id: 'Users.BMI' })}>
                {form.getFieldDecorator('BMI', {
                  rules: [{ type: 'number' }],
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder={formatMessage({ id: 'Users.BMI' })}
                    onChange={e => onChangeField(e, 'BMI')}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label={formatMessage({ id: 'Users.TBW' })}>
                {form.getFieldDecorator('TBW', {
                  rules: [{ type: 'number' }],
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder={formatMessage({ id: 'Users.TBW' })}
                    onChange={e => onChangeField(e, 'TBW')}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>

          <div className="form-actions">
            <Button style={{ width: 150 }} type="primary" htmlType="submit" className="mr-3">
              {formatMessage({ id: 'global.create' })}
            </Button>
            <Button
              style={{ width: 150, marginBottom: '10px' }}
              type="primary"
              onClick={() =>
                setState(prev => {
                  return { ...prev, BMR: calculateBMR(state) }
                })
              }
              className="mr-3"
            >
              {formatMessage({ id: 'Users.Calculate' })}
            </Button>
            <Button onClick={closeDrawer}>{formatMessage({ id: 'global.cancel' })}</Button>
          </div>
        </Form>
      </Drawer>
    </div>
  )
}

export default Form.create()(AddDatasetForm)
