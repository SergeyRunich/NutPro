/* eslint-disable no-underscore-dangle */
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Form, Col, Row, notification, Button } from 'antd'

import DayMeals from './DayMeals'

@injectIntl
@Form.create()
class DayKcalSettings extends React.Component {
  state = {
    items: [],
  }

  constructor(props) {
    super(props)

    this.onSend = this.onSend.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.addItem = this.addItem.bind(this)
    this.onChangeItem = this.onChangeItem.bind(this)
  }

  componentDidMount() {
    this.setData()
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

  onChangeItem(e, field, index) {
    const { items } = this.state

    let value = e
    if (e.target) {
      if (e.target.type === 'checkbox') {
        value = e.target.checked
      } else {
        // eslint-disable-next-line prefer-destructuring
        value = e.target.value
      }
    }
    items[index][field] = value
    this.setState({
      items,
    })
  }

  async onSend(e) {
    const {
      intl: { formatMessage },
    } = this.props
    e.preventDefault()
    try {
      const { form, post } = this.props
      await form.validateFields()
      const { items } = this.state
      const onSendData = {
        dayKcal: items.map(item => ({
          meal: item.meal,
          optional: item.optional,
          min: {
            kcal: item.min,
          },
          max: {
            kcal: item.max,
          },
        })),
      }
      const req = await post(onSendData)
      if (req.status === 201) {
        notification.success({
          message: formatMessage({ id: 'Setts.Succes' }),
          description: formatMessage({ id: 'Setts.Data updated!' }),
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

  setData() {
    const { data } = this.props
    if (data) {
      this.setState({
        items: data.map(item => ({
          meal: item.meal,
          optional: item.optional,
          min: item.min.kcal,
          max: item.max.kcal,
        })),
      })
    }
  }

  addItem() {
    const { items } = this.state

    items.push({
      meal: null,
      optional: false,
      min: 0,
      max: 0,
    })

    this.setState({
      items,
    })
  }

  deleteItem(key) {
    const { items } = this.state
    items.splice(key, 1)

    this.setState({
      items,
    })
  }

  render() {
    const { items } = this.state

    return (
      <div>
        <Form layout="vertical" onSubmit={this.onSend}>
          <Row gutter={16}>
            <Col md={18} sm={24}>
              <Button
                type="dashed"
                onClick={this.addItem}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              >
                <FormattedMessage id="main.add" />
              </Button>
              <Button type="primary" htmlType="submit" style={{ marginBottom: '10px' }}>
                <FormattedMessage id="main.save" />
              </Button>
              <DayMeals
                items={items}
                deleteItem={this.deleteItem}
                onChangeItem={this.onChangeItem}
              />
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

export default DayKcalSettings
