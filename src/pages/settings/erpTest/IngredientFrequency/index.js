/* eslint-disable no-underscore-dangle */
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Form, Col, Row, notification, Button } from 'antd'

import FrequencyList from './FrequencyList'

@injectIntl
@Form.create()
class IngredientFrequency extends React.Component {
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
        ingredientFrequency: items.map(item => ({
          meal: item.meal,
          tag: item.tag,
          amount: item.amount,
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
          tag: item.tag,
          amount: item.amount,
        })),
      })
    }
  }

  addItem() {
    const { items } = this.state

    items.push({
      meal: null,
      tag: null,
      amount: 0,
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
    const { tags } = this.props

    return (
      <div>
        <Form layout="vertical" onSubmit={this.onSend}>
          <Row gutter={16}>
            <Col md={20} sm={24}>
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
              <FrequencyList
                items={items}
                deleteItem={this.deleteItem}
                onChangeItem={this.onChangeItem}
                tags={tags}
              />
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

export default IngredientFrequency
