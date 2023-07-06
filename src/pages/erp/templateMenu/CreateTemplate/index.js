/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import React from 'react'
import { injectIntl } from 'react-intl'
import lodash from 'lodash'
import { Form, Col, Row, Input, notification, Drawer, Divider, Button, Checkbox } from 'antd'

import DishList from '../DishList'

import { getTechcard } from '../../../../api/erp/techcard'
import { getDayKcal } from '../../../../api/erp/testSettings'

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid,
  margin: `0 0 ${grid}px 0`,
  // border: isDragging ? 'none' : '1px solid #e8e8e8',
  borderRadius: '5px',
  // change background colour if dragging
  background: isDragging ? 'lightgreen' : '',

  // styles we need to apply on draggables
  ...draggableStyle,
})

const getMenuRegulationsStatus = (kcalSettings = [], dishes = []) => {
  if (kcalSettings.length === 0) return true
  for (const dish of dishes) {
    const kcal = Math.round(dish.basicKcal * dish.amount)
    const meal = dish.meal === 10 ? 4 : dish.meal
    const settings = lodash.find(kcalSettings, { meal })
    if (kcal < settings.min.kcal || kcal > settings.max.kcal) return false
  }
  return true
}

const getListStyle = () => ({
  // background: isDraggingOver ? 'lightblue' : '',
  padding: grid,
  borderRadius: '5px',
})

@injectIntl
@Form.create()
class CreateTemplateForm extends React.Component {
  state = {
    name: '',
    always: [],
    isEdit: false,
    techcards: [],
    dishes: [
      {
        techcard: null,
        amount: 1,
        meal: 0,
        basicKcal: 0,
        group: 0,
        key: Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, '')
          .substr(0, 5),
      },
    ],
    kcalSettings: [],
    isB2B: false,
  }

  constructor(props) {
    super(props)

    this.onSend = this.onSend.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.deleteDish = this.deleteDish.bind(this)
    this.addDish = this.addDish.bind(this)
    this.onChangeDish = this.onChangeDish.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.onChangeAlways = this.onChangeAlways.bind(this)
  }

  componentDidMount() {
    getTechcard().then(async answer => {
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          techcards: json,
        })
      }
    })
    getDayKcal().then(async answer => {
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          kcalSettings: json.result,
        })
      }
    })
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const { dishes: itemsFromState } = this.state
    const dishes = reorder(itemsFromState, result.source.index, result.destination.index)

    this.setState({
      dishes,
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

  onChangeDish(e, field, index) {
    const { dishes, techcards } = this.state

    let value = e
    if (e.target) {
      if (e.target.type === 'checkbox') {
        value = e.target.checked
      } else {
        // eslint-disable-next-line prefer-destructuring
        value = e.target.value
      }
    }
    dishes[index][field] = value
    if (field === 'techcard') {
      const tc = lodash.find(techcards, { id: value })
      dishes[index].basicKcal = tc.nutrients.energy
    }
    this.setState({
      dishes,
    })
  }

  onChangeAlways(e, group) {
    const { always } = this.state

    let value = e
    if (e.target) {
      if (e.target.type === 'checkbox') {
        value = e.target.checked
      } else {
        // eslint-disable-next-line prefer-destructuring
        value = e.target.value
      }
    }
    const groupIndex = always.indexOf(group)
    if (value) {
      always.push(group)
    } else if (!value && groupIndex !== -1) {
      always.splice(groupIndex, 1)
    }

    this.setState({
      always,
    })
  }

  async onSend(e) {
    const {
      intl: { formatMessage },
    } = this.props
    e.preventDefault()
    try {
      const { form, create, edit, forEdit, update } = this.props
      await form.validateFields()
      const { name, always, dishes, isB2B, kcalSettings } = this.state
      if (!isB2B && always.length < 2) {
        always.push(always[0])
      }
      if (!getMenuRegulationsStatus(kcalSettings, dishes)) {
        notification.warning({
          message: formatMessage({ id: 'CreateTemplate.MenuRegulations' }),
          description: formatMessage({ id: 'CreateTemplate.kCalIsNotIncludedInkCalRange' }),
          placement: 'topRight',
        })
        // return
      }
      const onSendData = {
        name,
        always,
        dishes,
        isB2B,
      }
      if (forEdit.id) {
        const req = await edit(forEdit.id, onSendData)
        if (req.status === 200) {
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'global.success' }),
            description: formatMessage({ id: 'CreateTemplate.TemplateSuccessfullySaved!' }),
          })
          update()
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
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'CreateTemplate.Created' }),
            description: formatMessage({ id: 'CreateTemplate.TemplateSuccessfullyCreated!' }),
          })
          update()
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
        name: forEdit.name,
        always: forEdit.always,
        dishes: forEdit.dishes.map(dish => ({
          techcard: dish.techcard.id,
          amount: dish.amount,
          meal: dish.meal,
          basicKcal: Math.round(dish.kcal / dish.amount),
          group: dish.group,
          key: Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '')
            .substr(0, 5),
        })),
        isB2B: forEdit.isB2B,
        isEdit: true,
      })
    }
  }

  addDish() {
    const { dishes } = this.state

    dishes.push({
      techcard: '',
      amount: 1,
      meal: 0,
      basicKcal: 0,
      group: 0,
      key: Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 5),
    })

    this.setState({
      dishes,
    })
  }

  deleteDish(key) {
    const { dishes } = this.state
    dishes.splice(key, 1)

    this.setState({
      dishes,
    })
  }

  closeDrawer() {
    const { onClose, form } = this.props
    onClose()
    this.setState({
      name: '',
      always: [],
      dishes: [
        {
          techcard: '',
          amount: 1,
          meal: 0,
          group: 0,
          key: Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '')
            .substr(0, 5),
        },
      ],
      isB2B: false,
      isEdit: false,
    })

    form.resetFields()
  }

  render() {
    const {
      visible,
      form,
      forEdit,
      intl: { formatMessage },
    } = this.props
    const { name, isEdit, techcards, dishes, always, isB2B, kcalSettings } = this.state
    if (forEdit.id && !isEdit) {
      this.setEdit()
    }

    return (
      <div>
        <Drawer
          title={
            isEdit
              ? formatMessage({ id: 'CreateTemplate.EDITTEMPLATE' })
              : formatMessage({ id: 'CreateTemplate.CREATENEWTEMPLATE' })
          }
          width="100%"
          height="100%"
          onClose={this.closeDrawer}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" onSubmit={this.onSend}>
            <Row gutter={16}>
              <Col md={15} sm={24}>
                <Form.Item label={formatMessage({ id: 'global.name' })}>
                  {form.getFieldDecorator('Name', {
                    rules: [{ required: true }],
                    initialValue: name,
                  })(<Input onChange={e => this.onChangeField(e, 'name')} />)}
                </Form.Item>
              </Col>
              <Col md={isB2B ? 5 : 2} sm={24}>
                <Form.Item label={formatMessage({ id: 'CreateTemplate.B2BTemplate' })}>
                  <Checkbox onChange={e => this.onChangeField(e, 'isB2B')} /> {isB2B ? 'Yes' : 'No'}
                </Form.Item>
              </Col>
              {!isB2B && (
                <Col md={3} sm={24}>
                  <Form.Item label={formatMessage({ id: 'CreateTemplate.AlwaysPortions' })}>
                    {form.getFieldDecorator('always', {
                      // rules: [{ required: true }],
                      initialValue: always,
                    })(<Input disabled onChange={e => this.onChangeField(e, 'always')} />)}
                  </Form.Item>
                </Col>
              )}

              <Col md={4} sm={24} style={{ marginTop: '16px', alignContent: 'right' }}>
                <Button
                  size="large"
                  htmlType="submit"
                  type="primary"
                  // disabled={!getMenuRegulationsStatus(kcalSettings, dishes)}
                >
                  {formatMessage({ id: 'global.save' })}
                </Button>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Divider orientation="left">
                  {formatMessage({ id: 'CreateTemplate.PositionsSPACE' })}
                  <Button type="primary" size="small" onClick={this.addDish}>
                    {formatMessage({ id: 'CreateTemplate.Add' })}
                  </Button>
                </Divider>
                <DishList
                  techcards={techcards}
                  kcalSettings={kcalSettings}
                  addDish={this.addDish}
                  deleteDish={this.deleteDish}
                  onChangeDish={this.onChangeDish}
                  onChangeAlways={this.onChangeAlways}
                  onDragEnd={this.onDragEnd}
                  getItemStyle={getItemStyle}
                  getListStyle={getListStyle}
                  dishes={dishes}
                  always={always}
                  isB2B={isB2B}
                />
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
    )
  }
}

export default CreateTemplateForm
