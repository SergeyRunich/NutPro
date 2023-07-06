import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Form, Col, Row, Input, Select, notification, Modal, Switch } from 'antd'

const { Option } = Select

@injectIntl
@Form.create()
class CreateTagForm extends React.Component {
  state = {
    title: '',
    groups: [],
    isEdit: false,
    ingredients: [],
    active: true,
  }

  constructor(props) {
    super(props)

    this.onSend = this.onSend.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
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
      const { title, groups, ingredients, active } = this.state
      const onSendData = {
        title,
        groups,
        ingredients,
        active,
      }

      if (forEdit.id) {
        const { showOnlyActive } = this.props
        const req = await edit(forEdit.id, onSendData)
        if (req.status === 200) {
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'IngrTag.Saved' }),
            description: formatMessage({ id: 'IngrTag.IngredienttagSuccessfullySaved!' }),
          })
          await update(showOnlyActive)
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
            placement: 'topLeft',
          })
        }
      } else {
        const req = await create(onSendData)
        const { showOnlyActive } = this.props
        if (req.status === 201) {
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'IngrTag.Created' }),
            description: formatMessage({ id: 'IngrTag.IngredienttagSuccessfullyCreated!' }),
          })
          update(showOnlyActive)
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
    const currentGroups = []
    const currentIngredients = []
    forEdit.groups.map(group => {
      currentGroups.push(group.id)
      return currentGroups
    })
    forEdit.ingredients.map(ingredient => {
      currentIngredients.push(ingredient.id)
      return currentIngredients
    })

    if (forEdit) {
      this.setState({
        title: forEdit.title,
        groups: currentGroups,
        isEdit: true,
        ingredients: currentIngredients,
        active: true,
      })
    }
  }

  closeDrawer() {
    const { onClose, form } = this.props
    onClose()
    form.resetFields()
    this.setState({
      isEdit: false,
      title: '',
      groups: [],
      ingredients: [],
      active: true,
    })
  }

  render() {
    const { visible, form, forEdit, ingredientList, groupList } = this.props
    const { title, groups, isEdit, ingredients, active } = this.state

    if (forEdit.id && !isEdit) {
      this.setEdit()
    }

    return (
      <div>
        <Modal
          title={
            forEdit.id ? (
              <FormattedMessage id="IngrTag.editingIngredienttag" />
            ) : (
              <FormattedMessage id="IngrTag.creatingIngredienttag" />
            )
          }
          visible={visible}
          onOk={this.onSend}
          okText={<FormattedMessage id="main.save" />}
          onCancel={this.closeDrawer}
        >
          <Form layout="vertical" onSubmit={this.onSend}>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label={<FormattedMessage id="IngrTag.Title" />}>
                  {form.getFieldDecorator('Title', {
                    rules: [{ required: true }],
                    initialValue: title,
                  })(<Input onChange={e => this.onChangeField(e, 'title')} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item name="groups" label={<FormattedMessage id="IngrTag.Groups" />}>
                  <Select
                    placeholder="Groups"
                    mode="multiple"
                    value={groups}
                    onChange={e => this.onChangeField(e, 'groups')}
                  >
                    {groupList.map(group => (
                      <Option key={group.id} value={group.id}>
                        {group.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item name="ingredients" label={<FormattedMessage id="IngrTag.Ingredients" />}>
                  <Select
                    placeholder="Ingredients"
                    mode="multiple"
                    value={ingredients}
                    onChange={e => this.onChangeField(e, 'ingredients')}
                  >
                    {ingredientList.map(ingredient => (
                      <Option key={ingredient.id} value={ingredient.id}>
                        {ingredient.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {forEdit.id && (
                  <Form.Item name="ingredients" label={<FormattedMessage id="IngrTag.Active" />}>
                    <Switch checked={active} onChange={e => this.onChangeField(e, 'active')} />
                  </Form.Item>
                )}
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default CreateTagForm
