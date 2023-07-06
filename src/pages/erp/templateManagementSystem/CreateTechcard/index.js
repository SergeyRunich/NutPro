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

import IngredientsList from '../../techcard/IngredientsList'
import SubTechcardsList from '../../techcard/SubTechcardsList'

// import { getIngredientGroup } from 'api/erp/ingredientGroup'

import { getIngredient } from '../../../../api/erp/ingredient'
import { getTechcardTags } from '../../../../api/erp/techcard'

const { Option } = Select

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
    energy: 0,
    prot: 0,
    fat: 0,
    carb: 0,
    allIngredients: [],
    tags: [],
    allTags: [],
  }

  constructor(props) {
    super(props)

    this.onSend = this.onSend.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.deleteIngredient = this.deleteIngredient.bind(this)
    this.addIngredient = this.addIngredient.bind(this)
    this.onChangeIngredient = this.onChangeIngredient.bind(this)
    this.deleteSubTechcard = this.deleteSubTechcard.bind(this)
    this.addSubTechcard = this.addSubTechcard.bind(this)
    this.onChangeSubTechcard = this.onChangeSubTechcard.bind(this)
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

  async onSend(e) {
    e.preventDefault()
    try {
      const {
        form,
        create,
        edit,
        forEdit,
        update,
        showTechcard,
        intl: { formatMessage },
      } = this.props
      await form.validateFields()
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
      }
      if (forEdit.id) {
        const req = await edit(forEdit.id, onSendData)
        if (req.status === 200) {
          await update()
          this.closeDrawer()
          showTechcard(forEdit.id)
          notification.success({
            message: formatMessage({ id: 'TemplateManege.Saved' }),
            description: formatMessage({ id: 'TemplateManege.TechcardSuccessfullySaved' }),
          })
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
            placement: 'topLeft',
          })
        }
      } else {
        const req = await create(onSendData)
        if (req.status === 201) {
          await update()
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'TemplateManege.Created' }),
            description: formatMessage({ id: 'TemplateManege.TechcardSuccessfullyCreated' }),
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
        isEdit: true,
        tags: forEdit.tags.map(tag => tag.id),
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

  deleteSubTechcard(key) {
    const { subTechcards } = this.state
    subTechcards.splice(key, 1)

    this.setState({
      subTechcards,
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
                <Row gutter={16}>
                  <Col md={8} sm={24}>
                    <Form.Item name="unit" label={<FormattedMessage id="erp.unit" />}>
                      <Select value={unit} onChange={e => this.onChangeField(e, 'unit')}>
                        <Option key={0} value={0}>
                          {formatMessage({ id: 'TemplateManage.Kilogram' })}
                        </Option>
                        <Option key={1} value={1}>
                          {formatMessage({ id: 'TemplateManage.Pieces' })}
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={8} sm={24}>
                    <Form.Item label={formatMessage({ id: 'TemplateManage.Amount' })}>
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
                        {formatMessage({ id: 'TemplateManage.CustomNutritions' })}
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
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
    )
  }
}

export default CreateTechcardForm
