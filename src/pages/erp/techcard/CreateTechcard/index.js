/* eslint-disable no-underscore-dangle */
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import {
  Form,
  Col,
  Row,
  Input,
  Select,
  notification,
  InputNumber,
  Drawer,
  Checkbox,
  Divider,
  Button,
} from 'antd'

import IngredientsList from '../IngredientsList'
import SubTechcardsList from '../SubTechcardsList'
import DivisionList from '../DivisionList'

import { getIngredient } from '../../../../api/erp/ingredient'
import { getTechcardTags } from '../../../../api/erp/techcard'

const { Option } = Select

const boxesList = [
  { type: 'type1', title: 'Dvoudílná 40mm' },
  { type: 'type2', title: 'Dvoudílná 50mm' },
  { type: 'type3', title: 'Dvoudílná 60mm' },
  { type: 'type4', title: 'Jednodílná 40mm' },
  { type: 'type5', title: 'Jednodílná 50mm' },
  { type: 'type6', title: 'Jednodílná 60mm' },
  { type: 'type7', title: 'Polevková zatavovací malá' },
  { type: 'type8', title: 'Polevková zatavovací velká' },
  { type: 'type9', title: 'Uzavírací krabička malá' },
  { type: 'type10', title: 'Uzavírací krabička velká' },
]

@injectIntl
@Form.create()
class CreateTechcardForm extends React.Component {
  state = {
    title: '',
    marketingTitle: '',
    amount: 0,
    unit: 0,
    description: '',
    percent: 0,
    isEdit: false,
    customNutrients: false,
    isSubTechcard: false,
    ingredients: [],
    subTechcards: [],
    proportions: [],
    energy: 0,
    prot: 0,
    fat: 0,
    carb: 0,
    allIngredients: [],
    tags: [],
    boxes: {
      small: {
        type: '',
        title: '',
      },
      medium: {
        type: '',
        title: '',
      },
      big: {
        type: '',
        title: '',
      },
    },
    allTags: [],
    isTechCardSaved: false,
  }

  constructor(props) {
    super(props)

    this.onSend = this.onSend.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.deleteIngredient = this.deleteIngredient.bind(this)
    this.addIngredient = this.addIngredient.bind(this)
    this.onChangeIngredient = this.onChangeIngredient.bind(this)
    this.deleteSubTechcard = this.deleteSubTechcard.bind(this)
    this.deleteDivision = this.deleteDivision.bind(this)
    this.addSubTechcard = this.addSubTechcard.bind(this)
    this.addDivision = this.addDivision.bind(this)
    this.onChangeSubTechcard = this.onChangeSubTechcard.bind(this)
    this.onChangeDivision = this.onChangeDivision.bind(this)
  }

  componentDidMount() {
    getIngredient().then(async answer => {
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          allIngredients: json,
        })
      }
    })
    getTechcardTags().then(async answer => {
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          allTags: json,
        })
      }
    })
  }

  onChangeField(e, field) {
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

  onChangeIngredient(e, field, index) {
    const { ingredients } = this.state

    let value = e
    if (e.target) {
      if (e.target.type === 'checkbox') {
        value = e.target.checked
      } else {
        // eslint-disable-next-line prefer-destructuring
        value = e.target.value
      }
    }
    ingredients[index][field] = value
    this.setState({
      ingredients,
    })
  }

  onChangeSubTechcard(e, field, index) {
    const { subTechcards } = this.state

    let value = e
    if (e.target) {
      if (e.target.type === 'checkbox') {
        value = e.target.checked
      } else {
        // eslint-disable-next-line prefer-destructuring
        value = e.target.value
      }
    }
    subTechcards[index][field] = value
    this.setState({
      subTechcards,
    })
  }

  onChangeDivision(e, field, index) {
    const { proportions } = this.state

    let value = e
    if (e.target) {
      if (e.target.type === 'checkbox') {
        value = e.target.checked
      } else {
        // eslint-disable-next-line prefer-destructuring
        value = e.target.value
      }
    }
    proportions[index][field] = value
    this.setState({
      proportions,
    })
  }

  onChangeBox(e, type) {
    const { boxes } = this.state

    let value = e
    if (e.target) {
      if (e.target.type === 'checkbox') {
        value = e.target.checked
      } else {
        // eslint-disable-next-line prefer-destructuring
        value = e.target.value
      }
    }
    const title = boxesList.find(b => b.type === value)
    boxes[type].type = value
    boxes[type].title = title.title
    this.setState({
      boxes,
    })
  }

  async onSend(e) {
    const { isTechCardSaved } = this.state
    if (isTechCardSaved) {
      return
    }
    e.preventDefault()
    try {
      const { form, create, edit, forEdit, update } = this.props
      await form.validateFields()
      const {
        intl: { formatMessage },
      } = this.props
      const {
        title,
        amount,
        unit,
        description,
        percent,
        isSubTechcard,
        customNutrients,
        energy,
        prot,
        fat,
        carb,
        ingredients,
        subTechcards,
        tags,
        marketingTitle,
        boxes,
        proportions,
      } = this.state
      const onSendData = {
        title,
        marketingTitle,
        amount,
        unit,
        description,
        isSubTechcard,
        customNutrients,
        percent,
        nutrients: { energy, prot, fat, carb },
        ingredients: ingredients.map(ing => ing.id),
        ingredientsAmount: ingredients.map(ing => ing.amount),
        subTechcards: subTechcards.map(tc => tc.id),
        subTechcardsAmount: subTechcards.map(tc => tc.amount),
        tags,
        boxes,
        proportions,
      }
      if (forEdit.id) {
        this.setState({ isTechCardSaved: true })
        const req = await edit(forEdit.id, onSendData)
        if (req.status === 200) {
          update()
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'Techcard.Saved' }),
            description: formatMessage({ id: 'Techcard.TechcardSuccessfullySaved!' }),
          })
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
            placement: 'topLeft',
          })
        }
      } else {
        this.setState({ isTechCardSaved: true })
        const req = await create(onSendData)
        if (req.status === 201) {
          update()
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'Techcard.Created' }),
            description: formatMessage({ id: 'Techcard.TechcardSuccessfullyCreated!' }),
          })
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
            placement: 'topLeft',
          })
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  setEdit() {
    const { forEdit } = this.props
    if (forEdit) {
      this.setState({
        title: forEdit.title,
        marketingTitle: forEdit.marketingTitle,
        unit: forEdit.unit,
        amount: forEdit.amount,
        description: forEdit.description,
        percent: forEdit.percent,
        energy: forEdit.nutrients.energy,
        prot: forEdit.nutrients.prot,
        fat: forEdit.nutrients.fat,
        carb: forEdit.nutrients.carb,
        isSubTechcard: forEdit.isSubTechcard,
        ingredients: forEdit.ingredients.map((ing, i) => ({
          id: ing.id,
          amount: forEdit.ingredientsAmount[i],
        })),
        subTechcards: forEdit.subTechcards.map((tc, i) => ({
          id: tc._id,
          amount: forEdit.subTechcardsAmount[i],
        })),
        proportions:
          forEdit.proportions &&
          forEdit.proportions.map(tc => ({
            title: tc.title,
            amount: tc.amount,
            unit: tc.unit,
          })),
        isEdit: true,
        tags: forEdit.tags.map(tag => tag.id),
        boxes: {
          small: {
            type: forEdit.boxes.small.type,
            title: forEdit.boxes.small.title,
          },
          medium: {
            type: forEdit.boxes.medium.type,
            title: forEdit.boxes.medium.title,
          },
          big: {
            type: forEdit.boxes.big.type,
            title: forEdit.boxes.big.title,
          },
        },
      })
    }
  }

  addIngredient() {
    const { ingredients } = this.state

    ingredients.push({
      id: null,
      amount: 0,
    })

    this.setState({
      ingredients,
    })
  }

  deleteIngredient(key) {
    const { ingredients } = this.state
    ingredients.splice(key, 1)

    this.setState({
      ingredients,
    })
  }

  addSubTechcard() {
    const { subTechcards } = this.state

    subTechcards.push({
      id: null,
      amount: 0,
    })

    this.setState({
      subTechcards,
    })
  }

  addDivision() {
    const { proportions } = this.state

    proportions.push({
      id: null,
      amount: 0,
    })

    this.setState({
      proportions,
    })
  }

  deleteSubTechcard(key) {
    const { subTechcards } = this.state
    subTechcards.splice(key, 1)

    this.setState({
      subTechcards,
    })
  }

  deleteDivision(key) {
    const { proportions } = this.state
    proportions.splice(key, 1)

    this.setState({
      proportions,
    })
  }

  closeDrawer() {
    const { onClose, form } = this.props
    onClose()
    this.setState({
      title: '',
      marketingTitle: '',
      amount: 0,
      unit: 0,
      description: '',
      percent: 0,
      isEdit: false,
      isSubTechcard: false,
      customNutrients: false,
      ingredients: [],
      subTechcards: [],
      energy: 0,
      prot: 0,
      fat: 0,
      carb: 0,
      tags: [],
    })

    form.resetFields()
  }

  render() {
    const {
      visible,
      form,
      forEdit,
      data,
      intl: { formatMessage },
    } = this.props
    const {
      title,
      unit,
      description,
      percent,
      energy,
      prot,
      fat,
      carb,
      isEdit,
      amount,
      customNutrients,
      isSubTechcard,
      ingredients,
      subTechcards,
      allIngredients,
      tags,
      allTags,
      marketingTitle,
      boxes,
      proportions,
    } = this.state
    if (forEdit.id && !isEdit) {
      this.setEdit()
    }

    return (
      <div>
        <Drawer
          title={
            isEdit ? (
              <FormattedMessage id="erp.title.editingTechcard" />
            ) : (
              <FormattedMessage id="erp.title.createTechcard" />
            )
          }
          width="100%"
          onClose={this.closeDrawer}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" onSubmit={this.onSend}>
            <Row gutter={16}>
              <Col md={12} sm={24}>
                <Row gutter={16}>
                  <Col md={24} sm={24}>
                    <Form.Item label={<FormattedMessage id="erp.name" />}>
                      {form.getFieldDecorator('Title', {
                        rules: [{ required: true }],
                        initialValue: title,
                      })(<Input onChange={e => this.onChangeField(e, 'title')} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col md={24} sm={24}>
                    <Form.Item label={<FormattedMessage id="erp.marketingTitle" />}>
                      {form.getFieldDecorator('MerketingTitle', {
                        rules: [{ required: true }],
                        initialValue: marketingTitle,
                      })(<Input onChange={e => this.onChangeField(e, 'marketingTitle')} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col md={24} sm={24}>
                    <Form.Item label={<FormattedMessage id="erp.technologyСooking" />}>
                      {form.getFieldDecorator('Description', {
                        rules: [{ required: true }],
                        initialValue: description,
                      })(
                        <Input.TextArea
                          rows={5}
                          onChange={e => this.onChangeField(e, 'description')}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col md={24} sm={24}>
                    <Form.Item label="Tags">
                      <Select
                        placeholder="Tags"
                        mode="tags"
                        value={tags}
                        onChange={e => this.onChangeField(e, 'tags')}
                      >
                        {allTags.map(tag => (
                          <Option key={tag.id} value={tag.id}>
                            {tag.cz}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <h5>{formatMessage({ id: 'Techcard.Boxes' })}</h5>
                <Row gutter={16}>
                  <Col md={8} sm={24}>
                    <Form.Item label="Small">
                      <Select
                        placeholder="Small"
                        value={boxes.small.type}
                        onChange={e => this.onChangeBox(e, 'small')}
                      >
                        {boxesList.map(box => (
                          <Option key={box.title} value={box.type}>
                            {box.title}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={8} sm={24}>
                    <Form.Item label="Medium">
                      <Select
                        placeholder="Medium"
                        value={boxes.medium.type}
                        onChange={e => this.onChangeBox(e, 'medium')}
                      >
                        {boxesList.map(box => (
                          <Option key={box.title} value={box.type}>
                            {box.title}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={8} sm={24}>
                    <Form.Item label="Big">
                      <Select
                        placeholder="Big"
                        value={boxes.big.type}
                        onChange={e => this.onChangeBox(e, 'big')}
                      >
                        {boxesList.map(box => (
                          <Option key={box.title} value={box.type}>
                            {box.title}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col md={8} sm={24}>
                    <Form.Item name="unit" label={<FormattedMessage id="erp.unit" />}>
                      <Select value={unit} onChange={e => this.onChangeField(e, 'unit')}>
                        <Option key={0} value={0}>
                          {formatMessage({ id: 'Techcard.Kilogram' })}
                        </Option>
                        <Option key={1} value={1}>
                          {formatMessage({ id: 'Techcard.Kousky' })}
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={8} sm={24}>
                    <Form.Item label={formatMessage({ id: 'Techcard.Amount' })}>
                      {form.getFieldDecorator('Amount', {
                        rules: [{ required: true }],
                        initialValue: amount,
                      })(
                        <InputNumber
                          style={{ width: '100%' }}
                          onChange={e => this.onChangeField(e, 'amount')}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={8} sm={24}>
                    <Form.Item label="%">
                      {form.getFieldDecorator('Percent', {
                        rules: [{ required: true }],
                        initialValue: percent,
                      })(
                        <InputNumber
                          style={{ width: '100%' }}
                          onChange={e => this.onChangeField(e, 'percent')}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col md={12} sm={24}>
                    <Form.Item name="cstm">
                      <Checkbox
                        checked={customNutrients}
                        onChange={e => this.onChangeField(e, 'customNutrients')}
                      >
                        {formatMessage({ id: 'Techcard.CustomNutrients' })}
                      </Checkbox>
                    </Form.Item>
                  </Col>
                  <Col md={12} sm={24}>
                    <Form.Item name="smprdct">
                      <Checkbox
                        checked={isSubTechcard}
                        onChange={e => this.onChangeField(e, 'isSubTechcard')}
                      >
                        <FormattedMessage id="erp.semiproduct" />
                      </Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col md={6} sm={24}>
                    <Form.Item label="kCal">
                      {form.getFieldDecorator('kCal', {
                        rules: [{ required: true }],
                        initialValue: energy,
                      })(
                        <InputNumber
                          disabled={!customNutrients}
                          style={{ width: '100%' }}
                          onChange={e => this.onChangeField(e, 'energy')}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={6} sm={24}>
                    <Form.Item label={<FormattedMessage id="erp.prot" />}>
                      {form.getFieldDecorator('Prot', {
                        rules: [{ required: true }],
                        initialValue: prot,
                      })(
                        <InputNumber
                          disabled={!customNutrients}
                          style={{ width: '100%' }}
                          onChange={e => this.onChangeField(e, 'prot')}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={6} sm={24}>
                    <Form.Item label={<FormattedMessage id="erp.fat" />}>
                      {form.getFieldDecorator('Fat', {
                        rules: [{ required: true }],
                        initialValue: fat,
                      })(
                        <InputNumber
                          disabled={!customNutrients}
                          style={{ width: '100%' }}
                          onChange={e => this.onChangeField(e, 'fat')}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={6} sm={24}>
                    <Form.Item label={<FormattedMessage id="erp.carb" />}>
                      {form.getFieldDecorator('Carb', {
                        rules: [{ required: true }],
                        initialValue: carb,
                      })(
                        <InputNumber
                          disabled={!customNutrients}
                          style={{ width: '100%' }}
                          onChange={e => this.onChangeField(e, 'carb')}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Divider />
                <Row gutter={16}>
                  <Col md={12} sm={24}>
                    <Button size="large" htmlType="submit">
                      <FormattedMessage id="main.save" />
                    </Button>
                  </Col>
                </Row>
              </Col>

              <Col md={12} sm={24}>
                <Divider orientation="left">
                  <FormattedMessage id="erp.ingredients" />{' '}
                  <Button type="primary" size="small" onClick={this.addIngredient}>
                    <FormattedMessage id="main.add" />
                  </Button>
                </Divider>
                <IngredientsList
                  ingredients={ingredients}
                  allIngredients={allIngredients}
                  addIngredient={this.addIngredient}
                  deleteIngredient={this.deleteIngredient}
                  onChangeIngredient={this.onChangeIngredient}
                />
                <Divider orientation="left">
                  <FormattedMessage id="erp.semiproducts" />{' '}
                  <Button type="primary" size="small" onClick={this.addSubTechcard}>
                    <FormattedMessage id="main.add" />
                  </Button>
                </Divider>
                <SubTechcardsList
                  subTechcards={subTechcards}
                  allSubTechcards={data}
                  deleteSubTechcard={this.deleteSubTechcard}
                  onChangeSubTechcard={this.onChangeSubTechcard}
                />
                <Divider orientation="left">
                  <FormattedMessage id="erp.Division of dishes into proportions" />{' '}
                  <Button type="primary" size="small" onClick={this.addDivision}>
                    <FormattedMessage id="main.add" />
                  </Button>
                </Divider>
                <DivisionList
                  proportions={proportions}
                  deleteDivision={this.deleteDivision}
                  onChangeDivision={this.onChangeDivision}
                />
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
    )
  }
}

export default CreateTechcardForm
