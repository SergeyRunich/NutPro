/* eslint-disable no-underscore-dangle */
import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Form, Col, Row, Input, notification, Drawer, Divider, Button, DatePicker } from 'antd'

import DishList from './DishList'

import { getTechcard } from '../../../api/erp/techcard'
import { createEvent, editEvent } from '../../../api/order'
// import { getAllKitchen } from '../../../api/kitchen'

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

moment.updateLocale('en', {
  week: { dow: 1 },
})

const getListStyle = () => ({
  // background: isDraggingOver ? 'lightblue' : '',
  padding: grid,
  borderRadius: '5px',
})

@injectIntl
@Form.create()
class CreateEventForm extends React.Component {
  state = {
    description: '',
    isEdit: false,
    // kitchen: '',
    // kitchens: [{ id: '' }],
    timestamp: moment().unix(),
    dishes: [
      {
        techcard: null,
        amount: 1,
        count: 1,
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
    // getAllKitchen().then(async req => {
    //   const kitchens = await req.json()
    //   this.setState({
    //     kitchens,
    //     kitchen: kitchens[0].id,
    //   })
    // })
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

  onChangeDate(e) {
    if (e !== null) {
      this.setState({
        timestamp: e.utc().unix(),
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

  async onSend(e) {
    e.preventDefault()
    try {
      const {
        form,
        forEdit,
        update,
        intl: { formatMessage },
      } = this.props
      await form.validateFields()
      const { description, timestamp, dishes } = this.state
      const onSendData = {
        description,
        timestamp,
        dishes,
      }
      if (forEdit.id) {
        const req = await editEvent(forEdit.id, onSendData)
        if (req.ok) {
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'CreateEventForm.Saved' }),
            description: formatMessage({ id: 'CreateEventForm.EventSuccessfullySaved!' }),
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
        const req = await createEvent(onSendData)
        if (req.ok) {
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'CreateEventForm.Created' }),
            description: formatMessage({ id: 'CreateEventForm.EventSuccessfullyCreated!' }),
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
        description: forEdit.kitchenDescription,
        timestamp: forEdit.timestamp,
        dishes: forEdit.eventMenu.data.map(dish => ({
          techcard: dish.techcard,
          amount: dish.amount,
          count: dish.count,
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
      count: 1,
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
      description: '',
      timestamp: moment.utc(),
      dishes: [
        {
          techcard: '',
          amount: 1,
          count: 1,
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
    const { description, isEdit, techcards, dishes, timestamp } = this.state
    if (forEdit.id && !isEdit) {
      this.setEdit()
    }
    return (
      <div>
        <Drawer
          title={
            isEdit
              ? formatMessage({ id: 'CreateEventForm.EDITEVENT' })
              : formatMessage({ id: 'CreateEventForm.CREATENEWEVENT' })
          }
          width="50%"
          height="100%"
          onClose={this.closeDrawer}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" onSubmit={this.onSend}>
            <Row gutter={16}>
              <Col md={16} sm={24}>
                <Form.Item label="Description">
                  {form.getFieldDecorator('Description', {
                    rules: [{ required: true }],
                    initialValue: description,
                  })(<Input onChange={e => this.onChangeField(e, 'description')} />)}
                </Form.Item>
              </Col>
              <Col md={4} sm={24}>
                <Form.Item label="Date">
                  <DatePicker
                    format="DD.MM.YYYY"
                    placeholder="Date"
                    value={moment.unix(timestamp)}
                    onChange={e => this.onChangeDate(e)}
                  />
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
                  {formatMessage({ id: 'CreateEventForm.Positions' })}{' '}
                  <Button type="primary" size="small" onClick={this.addDish}>
                    {formatMessage({ id: 'CreateEventForm.Add' })}
                  </Button>
                </Divider>
                <DishList
                  techcards={techcards}
                  addDish={this.addDish}
                  deleteDish={this.deleteDish}
                  onChangeDish={this.onChangeDish}
                  onDragEnd={this.onDragEnd}
                  getItemStyle={getItemStyle}
                  getListStyle={getListStyle}
                  dishes={dishes}
                />
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
    )
  }
}

export default CreateEventForm
