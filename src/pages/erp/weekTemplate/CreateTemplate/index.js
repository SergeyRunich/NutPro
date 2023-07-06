/* eslint-disable no-underscore-dangle */
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Form, Col, Row, Input, notification, Drawer, Select, Button } from 'antd'

import { getTemplateMenu } from '../../../../api/erp/template'

const { Option } = Select

@injectIntl
@Form.create()
class CreateTemplateForm extends React.Component {
  state = {
    name: '',
    isEdit: false,
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    templates: [],
  }

  constructor(props) {
    super(props)

    this.onSend = this.onSend.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
  }

  componentDidMount() {
    getTemplateMenu().then(async answer => {
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          templates: json,
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
      const { name, monday, tuesday, wednesday, thursday, friday, saturday } = this.state

      const onSendData = {
        name,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
      }
      if (forEdit.id) {
        const req = await edit(forEdit.id, onSendData)
        if (req.status === 200) {
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'CreateTemplate.Saved' }),
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
            message: formatMessage({ id: 'CreateTemplate.Error!' }),
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
        monday: forEdit.monday.id,
        tuesday: forEdit.tuesday.id,
        wednesday: forEdit.wednesday.id,
        thursday: forEdit.thursday.id,
        friday: forEdit.friday.id,
        saturday: forEdit.saturday.id,
        isEdit: true,
      })
    }
  }

  closeDrawer() {
    const { onClose, form } = this.props
    onClose()
    this.setState({
      name: '',
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      isEdit: false,
    })

    form.resetFields()
  }

  render() {
    const { visible, form, forEdit } = this.props
    const {
      name,
      isEdit,
      templates,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    } = this.state
    if (forEdit.id && !isEdit) {
      this.setEdit()
    }

    return (
      <div>
        <Drawer
          title={
            isEdit ? (
              <FormattedMessage id="erp.title.editingWeekTemplate" />
            ) : (
              <FormattedMessage id="erp.title.createWeekTemplate" />
            )
          }
          width="100%"
          height="100%"
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
                      {form.getFieldDecorator('Name', {
                        rules: [{ required: true }],
                        initialValue: name,
                      })(<Input onChange={e => this.onChangeField(e, 'name')} />)}
                    </Form.Item>
                  </Col>
                  <Col md={24} sm={24}>
                    <Form.Item label={<FormattedMessage id="main.monday" />}>
                      {form.getFieldDecorator('Monday', {
                        rules: [{ required: true }],
                        initialValue: monday,
                      })(
                        <Select
                          showSearch
                          // value={monday || undefined}
                          defaultActiveFirstOption={false}
                          showArrow={false}
                          placeholder={<FormattedMessage id="erp.selectTemplate" />}
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          style={{ width: '100%' }}
                          // size="small"
                          onChange={e => this.onChangeField(e, 'monday')}
                        >
                          {templates.map(temp => (
                            <Option key={temp.id} value={temp.id}>
                              {temp.name}
                            </Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={24} sm={24}>
                    <Form.Item label={<FormattedMessage id="main.tuesday" />}>
                      {form.getFieldDecorator('Tuesday', {
                        rules: [{ required: true }],
                        initialValue: tuesday,
                      })(
                        <Select
                          showSearch
                          // value={tuesday || undefined}
                          defaultActiveFirstOption={false}
                          showArrow={false}
                          placeholder={<FormattedMessage id="erp.selectTemplate" />}
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          style={{ width: '100%' }}
                          // size="small"
                          onChange={e => this.onChangeField(e, 'tuesday')}
                        >
                          {templates.map(temp => (
                            <Option key={temp.id} value={temp.id}>
                              {temp.name}
                            </Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={24} sm={24}>
                    <Form.Item label={<FormattedMessage id="main.wednesday" />}>
                      {form.getFieldDecorator('Wednesday', {
                        rules: [{ required: true }],
                        initialValue: wednesday,
                      })(
                        <Select
                          showSearch
                          // value={wednesday || undefined}
                          defaultActiveFirstOption={false}
                          showArrow={false}
                          placeholder={<FormattedMessage id="erp.selectTemplate" />}
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          style={{ width: '100%' }}
                          // size="small"
                          onChange={e => this.onChangeField(e, 'wednesday')}
                        >
                          {templates.map(temp => (
                            <Option key={temp.id} value={temp.id}>
                              {temp.name}
                            </Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={24} sm={24}>
                    <Form.Item label={<FormattedMessage id="main.thursday" />}>
                      {form.getFieldDecorator('Thursday', {
                        rules: [{ required: true }],
                        initialValue: thursday,
                      })(
                        <Select
                          showSearch
                          // value={thursday || undefined}
                          defaultActiveFirstOption={false}
                          showArrow={false}
                          placeholder={<FormattedMessage id="erp.selectTemplate" />}
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          style={{ width: '100%' }}
                          // size="small"
                          onChange={e => this.onChangeField(e, 'thursday')}
                        >
                          {templates.map(temp => (
                            <Option key={temp.id} value={temp.id}>
                              {temp.name}
                            </Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={24} sm={24}>
                    <Form.Item label={<FormattedMessage id="main.friday" />}>
                      {form.getFieldDecorator('Friday', {
                        rules: [{ required: true }],
                        initialValue: friday,
                      })(
                        <Select
                          showSearch
                          // value={friday || undefined}
                          defaultActiveFirstOption={false}
                          showArrow={false}
                          placeholder={<FormattedMessage id="erp.selectTemplate" />}
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          style={{ width: '100%' }}
                          // size="small"
                          onChange={e => this.onChangeField(e, 'friday')}
                        >
                          {templates.map(temp => (
                            <Option key={temp.id} value={temp.id}>
                              {temp.name}
                            </Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={24} sm={24}>
                    <Form.Item label={<FormattedMessage id="main.saturday" />}>
                      {form.getFieldDecorator('Saturday', {
                        rules: [{ required: true }],
                        initialValue: saturday,
                      })(
                        <Select
                          showSearch
                          // value={saturday || undefined}
                          defaultActiveFirstOption={false}
                          showArrow={false}
                          placeholder={<FormattedMessage id="erp.selectTemplate" />}
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          style={{ width: '100%' }}
                          // size="small"
                          onChange={e => this.onChangeField(e, 'saturday')}
                        >
                          {templates.map(temp => (
                            <Option key={temp.id} value={temp.id}>
                              {temp.name}
                            </Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={4} sm={24}>
                    <Button size="large" htmlType="submit">
                      <FormattedMessage id="main.save" />
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
    )
  }
}
export default CreateTemplateForm
