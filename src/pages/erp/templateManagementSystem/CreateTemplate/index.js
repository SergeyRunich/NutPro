/* eslint-disable no-underscore-dangle */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Col, Row, Input, notification, Drawer, Divider, Button } from 'antd'

import DishList from '../DishList'

import { getTechcard } from '../../../../api/erp/techcard'

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
    dishes: [
      {
        techcard: null,
        amount: 1,
        meal: 0,
        group: 0,
        key: Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, '')
          .substr(0, 5),
      },
    ],
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
    const { dishes } = this.state

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
    e.preventDefault()
    try {
      const {
        form,
        create,
        edit,
        forEdit,
        update,
        intl: { formatMessage },
      } = this.props
      await form.validateFields()
      const { name, always, dishes } = this.state
      if (always.length < 2) {
        always.push(always[0])
      }
      const onSendData = {
        name,
        always,
        dishes,
      }
      if (forEdit.id) {
        const req = await edit(forEdit.id, onSendData)
        if (req.status === 200) {
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'CreateTemplateForm.Saved' }),
            description: formatMessage({ id: 'CreateTemplateForm.TemplateSuccessfullySaved' }),
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
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'CreateTemplateForm.Created' }),
            description: formatMessage({ id: 'CreateTemplateForm.TemplateSuccessfullyCreated' }),
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
        dishes:
          forEdit &&
          forEdit.dishes &&
          forEdit.dishes.map(dish => ({
            techcard: dish.techcard.id,
            amount: dish.amount,
            meal: dish.meal,
            group: dish.group,
            key: Math.random()
              .toString(36)
              .replace(/[^a-z]+/g, '')
              .substr(0, 5),
          })),
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
    const { name, isEdit, techcards, dishes, always } = this.state
    if (forEdit.id && !isEdit) {
      this.setEdit()
    }

    return (
      <div>
        <Drawer
          title={
            isEdit
              ? formatMessage({ id: 'CreateTemplateForm.EDITTEMPLATE' })
              : formatMessage({ id: 'CreateTemplateForm.CREATENEWTEMPLATE' })
          }
          width="100%"
          height="100%"
          onClose={this.closeDrawer}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" onSubmit={this.onSend}>
            <Row gutter={16}>
              <Col md={16} sm={24}>
                <Form.Item label="Name">
                  {form.getFieldDecorator('Name', {
                    rules: [{ required: true }],
                    initialValue: name,
                  })(<Input onChange={e => this.onChangeField(e, 'name')} />)}
                </Form.Item>
              </Col>
              <Col md={4} sm={24}>
                <Form.Item label="Always portions">
                  {form.getFieldDecorator('always', {
                    rules: [{ required: true }],
                    initialValue: always,
                  })(<Input disabled onChange={e => this.onChangeField(e, 'always')} />)}
                </Form.Item>
              </Col>
              <Col md={4} sm={24}>
                <Button size="large" htmlType="submit">
                  {formatMessage({ id: 'global.save' })}
                </Button>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Divider orientation="left">
                  Positions{' '}
                  <Button type="primary" size="small" onClick={this.addDish}>
                    {formatMessage({ id: 'CreateTemplateForm.Add' })}
                  </Button>
                </Divider>
                <DishList
                  techcards={techcards}
                  addDish={this.addDish}
                  deleteDish={this.deleteDish}
                  onChangeDish={this.onChangeDish}
                  onChangeAlways={this.onChangeAlways}
                  onDragEnd={this.onDragEnd}
                  getItemStyle={getItemStyle}
                  getListStyle={getListStyle}
                  dishes={dishes}
                  always={always}
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
