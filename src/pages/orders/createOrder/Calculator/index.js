import React from 'react'
import { injectIntl } from 'react-intl'

import { Button, Select, Form, Row, Col, InputNumber, Radio, message } from 'antd'

const { Option } = Select

const PALS = [
  { value: 1, label: 'Základní metabolismus' },
  { value: 1.1, label: 'Minimum aktivity' },
  {
    value: 1.2,
    label: 'Velmi lehká - Většinu pracovní doby nebo čas ve škole trávíte v sedě, minimum chůzce',
  },
  {
    value: 1.3,
    label:
      'Lehká - Pracovní dobu nebo čas ve škole trávíte v sedě, část ve stoje, chodíte aspoň 30 minut denně',
  },
  {
    value: 1.4,
    label: 'Střední - Pracovní dobu trávíte aktivně ve stoje nebo za chůze, chodíte 60 minut denně',
  },
  { value: 1.5, label: 'Těžká - Těžká manuální práce' },
  { value: 1.6, label: 'Těžká 2 - Těžká manuální práce' },
]

@injectIntl
@Form.create()
class Calculator extends React.Component {
  state = {
    weight: 0,
    height: 0,
    age: 0,
    gender: 'Male',
    PAL: 1,
    type: 'mcArdle',
    PBF: 0,
    calcBMR: 0,
    total: 0,
    BMR: 0,
  }

  componentDidMount() {
    const { data } = this.props
    this.setState({
      weight: data.weight,
      height: data.height,
      age: data.age,
      gender: data.gender,
      PAL: data.PAL,
      PBF: data.PBF,
      BMR: data.BMR,
    })
  }

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

  handleChangeGender = async gender => {
    this.setState({ gender: gender.key })
  }

  handleChangeType = async type => {
    this.setState({ type: type.target.value })
  }

  calculate = async e => {
    const { form } = this.props
    e.preventDefault()
    await form.validateFields()
    const { gender, age, weight, height, PBF, PAL, type } = this.state
    const mcArdle = 370 + 21.6 * (weight - weight * (PBF / 100) - 2.5)
    // const hb = gender === 'Male' ? 66 + (13.7 * weight) + (5 * height) - (6.8 * age) : 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age)
    const hb = 10 * weight + 6.25 * height - 5 * age + (gender === 'Male' ? 5 : -161)
    const calcBMR = type === 'mcArdle' ? mcArdle : hb
    this.setState({ calcBMR: Math.round(calcBMR), total: Math.round(calcBMR * PAL) })
  }

  copy = () => {
    const { total } = this.state
    const { copy } = this.props
    copy(total)
    message.success('Copied!')
  }

  copyBMRtoWizard = () => {
    const { calcBMR } = this.state
    const { copyBMR } = this.props
    copyBMR(calcBMR)
    message.success('Copied!')
  }

  loadData = () => {
    const { data } = this.props
    this.setState({
      weight: data.weight,
      height: data.height,
      age: data.age,
      gender: data.gender,
      PAL: data.PAL,
      PBF: data.PBF,
      BMR: data.BMR,
    })
  }

  render() {
    const { weight, height, age, gender, PAL, type, PBF, calcBMR, BMR, total } = this.state
    const {
      form,
      intl: { formatMessage },
    } = this.props

    return (
      <div>
        <div style={{ marginRight: '20px', marginBottom: '20px', textAlign: 'center' }}>
          <Radio.Group key="calcType" value={type} onChange={this.handleChangeType}>
            <Radio.Button value="mcArdle">{formatMessage({ id: 'Orders.McArdle' })}</Radio.Button>
            <Radio.Button value="harrisBenedict">
              {formatMessage({ id: 'Orders.Harris-Benedict' })}
            </Radio.Button>
          </Radio.Group>
        </div>
        <Form layout="vertical" onSubmit={this.calculate}>
          {type === 'harrisBenedict' && (
            <Row gutter={16}>
              <Col md={12} sm={24}>
                <Form.Item
                  name="gender"
                  label={formatMessage({ id: 'Orders.Gender' })}
                  rules={[
                    {
                      required: type !== 'mcArdle',
                      message: formatMessage({ id: 'Orders.PleaseChooseGender' }),
                    },
                  ]}
                >
                  <Select
                    placeholder={formatMessage({ id: 'Orders.Gender' })}
                    value={gender}
                    onChange={e => this.onChangeField(e, 'gender')}
                  >
                    <Option key="Male" value="Male">
                      {formatMessage({ id: 'Orders.Male' })}
                    </Option>
                    <Option key="Female" value="Female">
                      {formatMessage({ id: 'Orders.Female' })}
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.Age' })}>
                  {form.getFieldDecorator('age', {
                    rules: [{ required: type !== 'mcArdle', type: 'number' }],
                    initialValue: age,
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      min={10}
                      placeholder={formatMessage({ id: 'Orders.Age' })}
                      onChange={e => this.onChangeField(e, 'age')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label={formatMessage({ id: 'Orders.Weight' })}>
                {form.getFieldDecorator('weight', {
                  rules: [{ required: true, type: 'number' }],
                  initialValue: weight,
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={20}
                    placeholder={formatMessage({ id: 'Orders.Weight' })}
                    onChange={e => this.onChangeField(e, 'weight')}
                  />,
                )}
              </Form.Item>
            </Col>
            {type === 'mcArdle' && (
              <Col md={12} sm={24}>
                <Form.Item label="PBF">
                  {form.getFieldDecorator('PBF', {
                    rules: [{ required: type === 'mcArdle', type: 'number' }],
                    initialValue: PBF,
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      min={5}
                      placeholder={formatMessage({ id: 'Orders.PBF' })}
                      onChange={e => this.onChangeField(e, 'PBF')}
                    />,
                  )}
                </Form.Item>
              </Col>
            )}
            {type === 'harrisBenedict' && (
              <Col md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'Orders.Height' })}>
                  {form.getFieldDecorator('height', {
                    rules: [{ required: type !== 'mcArdle', type: 'number' }],
                    initialValue: height,
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      min={100}
                      placeholder={formatMessage({ id: 'Orders.Height' })}
                      onChange={e => this.onChangeField(e, 'height')}
                    />,
                  )}
                </Form.Item>
              </Col>
            )}
          </Row>
          <Row gutter={16}>
            <Col md={24} sm={24}>
              <Form.Item
                name="PAL"
                label="PAL"
                rules={[
                  { required: true, message: formatMessage({ id: 'Orders.PleaseChoosePAL' }) },
                ]}
              >
                <Select placeholder="Diet" value={PAL} onChange={e => this.onChangeField(e, 'PAL')}>
                  {PALS.map(PALoption => (
                    <Option key={Math.random()} value={PALoption.value}>
                      {`${PALoption.value} ${PALoption.label}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <h4 className="text-black mb-3" style={{ textAlign: 'center' }}>
            <strong>
              {formatMessage({ id: 'Orders.BMRSPACE' })} {calcBMR} kCal
            </strong>
          </h4>
          <h4 className="text-black mb-3" style={{ textAlign: 'center' }}>
            <strong>
              {formatMessage({ id: 'Orders.TotalSPACE' })} {total} kCal
            </strong>
          </h4>
          {Boolean(BMR) && (
            <h4 className="text-black mb-3" style={{ textAlign: 'center' }}>
              <strong>
                {formatMessage({ id: 'Orders.BMRDataset:SPACE' })} {BMR} kCal
              </strong>
            </h4>
          )}
          <div className="form-actions">
            <Button
              style={{ width: 150, marginBottom: '10px' }}
              type="primary"
              htmlType="submit"
              className="mr-3"
            >
              {formatMessage({ id: 'Orders.Calculate' })}
            </Button>
            <Button
              style={{ width: 150, marginBottom: '10px' }}
              type="dashed"
              disabled={calcBMR === 0}
              className="mr-3"
              onClick={this.copy}
            >
              {formatMessage({ id: 'Orders.CoppyInOrder' })}
            </Button>
            <br />
            <Button
              style={{ width: 150, marginBottom: '10px' }}
              type="dashed"
              disabled={calcBMR === 0}
              className="mr-3"
              onClick={this.copyBMRtoWizard}
            >
              {formatMessage({ id: 'Orders.CoppyBMRInWizard' })}
            </Button>
            <Button
              style={{ width: 150, marginBottom: '10px' }}
              type="default"
              className="mr-3"
              onClick={this.loadData}
            >
              {formatMessage({ id: 'Orders.LoadFromLastDataset' })}
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default Calculator
