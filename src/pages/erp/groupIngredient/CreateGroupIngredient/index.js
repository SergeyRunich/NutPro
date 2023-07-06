/* eslint-disable no-underscore-dangle */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Col, Row, Input, Select, notification, Modal } from 'antd'

const { Option } = Select

@injectIntl
@Form.create()
class CreateGroupForm extends React.Component {
  state = {
    name: '',
    mainGroup: '',
    isEdit: false,
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
    const {
      intl: { formatMessage },
    } = this.props
    e.preventDefault()
    try {
      const { form, create, edit, forEdit, update } = this.props
      await form.validateFields()
      const { name, mainGroup } = this.state
      const onSendData = {
        name,
        mainGroup,
      }
      if (forEdit.id) {
        const req = await edit(forEdit.id, onSendData)
        if (req.status === 202) {
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'CreateGroupIng.Edited' }),
            description: formatMessage({ id: 'CreateGroupIng.GroupSuccessfullyEdited' }),
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
            message: formatMessage({ id: 'CreateGroupIng.Created' }),
            description: formatMessage({ id: 'CreateGroupIng.GroupSuccessfullyCreated!' }),
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
        mainGroup: forEdit.mainGroup ? forEdit.mainGroup._id : undefined,
        isEdit: true,
      })
    }
  }

  closeDrawer() {
    const { onClose, form } = this.props
    this.setState({
      name: '',
      mainGroup: '',
      isEdit: false,
    })

    form.resetFields()
    onClose()
  }

  render() {
    const {
      visible,
      form,
      groups,
      forEdit,
      intl: { formatMessage },
    } = this.props
    const { name, mainGroup, isEdit } = this.state

    if (forEdit.id && !isEdit) {
      this.setEdit()
    }

    return (
      <div>
        <Modal
          title={formatMessage({ id: 'CreateGroupIng.CREATENEWGROUP' })}
          visible={visible}
          onOk={this.onSend}
          okText="Create"
          onCancel={this.closeDrawer}
        >
          <Form layout="vertical" onSubmit={this.onSend}>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label="Name">
                  {form.getFieldDecorator('Name', {
                    rules: [{ required: true }],
                    initialValue: name,
                  })(<Input onChange={e => this.onChangeField(e, 'name')} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item
                  name="maingroup"
                  label={formatMessage({ id: 'CreateGroupIng.MainGroup' })}
                >
                  <Select value={mainGroup} onChange={e => this.onChangeField(e, 'mainGroup')}>
                    {groups.map(k => (
                      <Option key={k.id} value={k.id}>
                        {k.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default CreateGroupForm
