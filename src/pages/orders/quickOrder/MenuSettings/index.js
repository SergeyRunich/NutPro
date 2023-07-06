import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Button, Col, Row, Select, InputNumber, Radio, Checkbox } from 'antd'

const { Option } = Select

const PALS = [
  { value: 1, label: 'BMR' },
  { value: 1.1, label: '-' },
  { value: 1.2, label: 'without' },
  { value: 1.3, label: 'light' },
  { value: 1.4, label: 'sports' },
  { value: 1.5, label: 'intensive' },
]

@injectIntl
@Form.create()
class MenuSettings extends React.Component {
  onChangeDate(e) {
    const { onChangeField } = this.props

    if (e !== null) {
      onChangeField(e.unix(), 'timestamp')
    }
  }

  handleChangeType = async type => {
    const { onChangeField } = this.props
    onChangeField(type, 'type')
  }

  calculate = async () => {
    const { sex, age, weight, height, PBF, type, onChangeFieldDataset } = this.props
    const mcArdle = 370 + 21.6 * (weight - weight * (PBF / 100) - 2.5)
    // const hb = sex === 'Male' ? 66 + (13.7 * weight) + (5 * height) - (6.8 * age) : 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age)
    const hb = 10 * weight + 6.25 * height - 5 * age + (sex === 'Male' ? 5 : -161)

    const calcBMR = type === 'mcArdle' ? mcArdle : hb
    onChangeFieldDataset(Math.round(calcBMR), 'BMR')
  }

  render() {
    const {
      onChangePAL,
      form,
      onChangeField,
      onChangeFieldDataset,
      age,
      weight,
      height,
      sex,
      BMR,
      PAL,
      diet,
      kcal,
      intActive,
      mealsPerDay,
      ignoredMealTypes,
      saladOnDinner,
      intl: { formatMessage },
      tags,
      exceptions,
    } = this.props

    return (
      <div>
        <Form layout="horizontal" onSubmit={this.onSend}>
          <Row gutter={16}>
            <Col xl={3} md={24}>
              <Form.Item
                name="sex"
                label={formatMessage({ id: 'Orders.Gender' })}
                rules={[{ message: formatMessage({ id: 'Orders.PleaseChooseGender' }) }]}
              >
                <Select
                  placeholder={formatMessage({ id: 'Orders.Gender' })}
                  value={sex}
                  onChange={e => onChangeFieldDataset(e, 'sex')}
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
            <Col xl={3} md={24}>
              <Form.Item label={formatMessage({ id: 'Orders.Age' })}>
                {form.getFieldDecorator('age', {
                  initialValue: age,
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder={formatMessage({ id: 'Orders.Age' })}
                    onChange={e => onChangeFieldDataset(e, 'age')}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col xl={3} md={24}>
              <Form.Item label={formatMessage({ id: 'Orders.Weight' })}>
                {form.getFieldDecorator('weight', {
                  rules: [{ type: 'number' }],
                  initialValue: weight,
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder={formatMessage({ id: 'Orders.Weight' })}
                    onChange={e => onChangeFieldDataset(e, 'weight')}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col xl={3} md={24}>
              <Form.Item label={formatMessage({ id: 'Orders.Height' })}>
                {form.getFieldDecorator('height', {
                  rules: [{ type: 'number' }],
                  initialValue: height,
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder={formatMessage({ id: 'Orders.Height' })}
                    onChange={e => onChangeFieldDataset(e, 'height')}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col xl={5} md={24}>
              <Form.Item label={formatMessage({ id: 'Orders.BMR' })}>
                <InputNumber
                  disabled
                  style={{ width: '45%' }}
                  value={BMR}
                  min={0}
                  placeholder={formatMessage({ id: 'Orders.BMR' })}
                  onChange={e => onChangeFieldDataset(e, 'BMR')}
                />
                <Button
                  style={{ width: '45%', marginLeft: 5 }}
                  type="primary"
                  onClick={this.calculate}
                  className="mr-3"
                >
                  {formatMessage({ id: 'Orders.Calculate' })}
                </Button>
              </Form.Item>
            </Col>
            <Col xl={3} md={24}>
              <Form.Item
                name="PAL"
                label={formatMessage({ id: 'Orders.PAL' })}
                rules={[{ message: formatMessage({ id: 'Orders.PleaseChoosePal' }) }]}
              >
                <Select
                  placeholder={formatMessage({ id: 'Orders.PAL' })}
                  value={PAL}
                  onChange={e => onChangePAL(e, 'PAL')}
                >
                  {PALS.map(PALoption => (
                    <Option key={Math.random()} value={PALoption.value}>
                      {`${PALoption.value} ${PALoption.label}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xl={4} md={24}>
              <Form.Item label={formatMessage({ id: 'Orders.Diet' })}>
                <div style={{ textAlign: 'center', display: 'inline-block' }}>
                  <Radio.Group
                    key="diet"
                    name="diet"
                    onChange={e => onChangeField(e, 'diet')}
                    value={diet}
                  >
                    <Radio.Button value="loose">
                      {formatMessage({ id: 'Orders.Loose' })}
                    </Radio.Button>
                    <Radio.Button value="keep">{formatMessage({ id: 'Orders.Keep' })}</Radio.Button>
                    <Radio.Button value="gain">{formatMessage({ id: 'Orders.Gain' })}</Radio.Button>
                  </Radio.Group>
                </div>
              </Form.Item>
            </Col>
            <Col xl={4} md={24}>
              <Form.Item label={formatMessage({ id: 'Orders.LooseSpeed' })}>
                <div style={{ textAlign: 'center', display: 'inline-block' }}>
                  <Radio.Group
                    key="intActive"
                    name="intActive"
                    onChange={e => onChangeField(e, 'intActive')}
                    value={intActive}
                    disabled={diet !== 'loose'}
                  >
                    <Radio.Button value={2}>{formatMessage({ id: 'Orders.Mild' })}</Radio.Button>
                    <Radio.Button value={1}>{formatMessage({ id: 'Orders.Medium' })}</Radio.Button>
                    <Radio.Button value={0}>{formatMessage({ id: 'Orders.Fast' })}</Radio.Button>
                  </Radio.Group>
                </div>
              </Form.Item>
            </Col>
            <Col xl={3} md={24}>
              <Form.Item label="kCal">
                <InputNumber
                  value={kcal}
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="kCal"
                  onChange={e => onChangeField(e, 'kcal')}
                />
              </Form.Item>
            </Col>
            <Col xl={3} md={24}>
              <Form.Item
                name="mealsPerDay"
                label={formatMessage({ id: 'Orders.MealsPerDay' })}
                rules={[{ required: true }]}
              >
                <Select
                  placeholder={formatMessage({ id: 'Orders.MealsPerDay' })}
                  value={mealsPerDay}
                  onChange={e => onChangeField(e, 'mealsPerDay')}
                >
                  <Option key={99} value={99}>
                    {formatMessage({ id: 'Orders.Custom' })}
                  </Option>
                  <Option key={2} value={2}>
                    {formatMessage({ id: 'Orders.2Meals' })}
                  </Option>
                  <Option key={3} value={3}>
                    {formatMessage({ id: 'Orders.3Meals' })}
                  </Option>
                  <Option key={5} value={5}>
                    {formatMessage({ id: 'Orders.5Meals' })}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={3} md={24}>
              <Form.Item label={formatMessage({ id: 'Orders.SkippedMeals' })}>
                <Select
                  placeholder={formatMessage({ id: 'Orders.SkippedMeals' })}
                  mode="tags"
                  disabled={mealsPerDay !== 5}
                  value={ignoredMealTypes}
                  onChange={e => onChangeField(e, 'ignoredMealTypes')}
                >
                  <Option
                    key="Breakfast"
                    disabled={ignoredMealTypes.length !== 0 && ignoredMealTypes[0] !== 'Breakfast'}
                    value="Breakfast"
                  >
                    {formatMessage({ id: 'Orders.Breakfast' })}
                  </Option>
                  <Option
                    key="1. Lunch"
                    disabled={ignoredMealTypes.length !== 0 && ignoredMealTypes[0] !== '1. Lunch'}
                    value="1. Lunch"
                  >
                    {formatMessage({ id: 'Orders.1.Lunch' })}
                  </Option>
                  <Option
                    key="Dinner"
                    disabled={ignoredMealTypes.length !== 0 && ignoredMealTypes[0] !== 'Dinner'}
                    value="Dinner"
                  >
                    {formatMessage({ id: 'Orders.Dinner' })}
                  </Option>
                  <Option
                    key="2. Lunch"
                    disabled={ignoredMealTypes.length !== 0 && ignoredMealTypes[0] !== '2. Lunch'}
                    value="2. Lunch"
                  >
                    {formatMessage({ id: 'Orders.2.Lunch' })}
                  </Option>
                  <Option
                    key="Supper"
                    disabled={ignoredMealTypes.length !== 0 && ignoredMealTypes[0] !== 'Supper'}
                    value="Supper"
                  >
                    {formatMessage({ id: 'Orders.Supper' })}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={3} md={24}>
              <Form.Item label={formatMessage({ id: 'Orders.Exceptions' })}>
                <Select
                  placeholder={formatMessage({ id: 'Orders.Exception tag' })}
                  mode="multiple"
                  value={exceptions}
                  onChange={e => onChangeField(e, 'exceptions')}
                >
                  {tags.map(tag => (
                    <Option
                      disabled={exceptions.length !== 0 && exceptions[0] !== tag.id}
                      key={tag.id}
                      value={tag.id}
                    >
                      {tag.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={3} md={24}>
              <Form.Item label={formatMessage({ id: 'Orders.SaladOnDinner' })}>
                <Checkbox
                  checked={saladOnDinner}
                  onChange={e => {
                    onChangeField(e, 'saladOnDinner')
                  }}
                >
                  {saladOnDinner
                    ? formatMessage({ id: 'Orders.Salad' })
                    : formatMessage({ id: 'Orders.Dinner' })}
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

export default MenuSettings
