/* eslint-disable no-underscore-dangle */
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Form, Col, Row, Input, Select, notification, Modal, InputNumber, Checkbox } from 'antd'

const { Option } = Select

@injectIntl
@Form.create()
class CreateIngredientForm extends React.Component {
  state = {
    name: '',
    group: '',
    unit: 'kilogram',
    brutto: 0,
    percent: 0,
    isEdit: false,
    energy: 0,
    prot: 0,
    fat: 0,
    carb: 0,
    tags: [],
    testEnabled: false,
    min: 0,
    max: 0,
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
      const {
        name,
        group,
        unit,
        brutto,
        percent,
        energy,
        prot,
        fat,
        carb,
        tags,
        testEnabled,
        min,
        max,
      } = this.state
      const onSendData = {
        name,
        group,
        unit,
        brutto,
        percent,
        nutrients: { energy, prot, fat, carb },
        tags,
        testEnabled,
        min,
        max,
      }
      if (forEdit.id) {
        const req = await edit(forEdit.id, onSendData)
        if (req.status === 202) {
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'CreateIngrForm.Saved' }),
            description: formatMessage({ id: 'CreateIngrForm.IngredientSuccessfullySaved!' }),
          })
          await update()
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
            message: formatMessage({ id: 'CreateIngrForm.Created' }),
            description: formatMessage({ id: 'CreateIngrForm.IngredientSuccessfullyCreated!' }),
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
        group: forEdit.group.id,
        unit: forEdit.unit,
        brutto: forEdit.brutto,
        percent: forEdit.percent,
        energy: forEdit.nutrients.energy,
        prot: forEdit.nutrients.prot,
        fat: forEdit.nutrients.fat,
        carb: forEdit.nutrients.carb,
        isEdit: true,
        tags: forEdit.tags,
        testEnabled: forEdit.testEnabled,
        min: forEdit.min,
        max: forEdit.max,
      })
    }
  }

  closeDrawer() {
    const { onClose, form } = this.props
    form.resetFields()
    this.setState({
      isEdit: false,
      name: '',
      group: '',
      unit: 'kilogram',
      brutto: 0,
      percent: 0,
      energy: 0,
      prot: 0,
      fat: 0,
      carb: 0,
      tags: [],
      testEnabled: false,
      min: 0,
      max: 0,
    })
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
    const {
      name,
      group,
      unit,
      brutto,
      percent,
      energy,
      prot,
      fat,
      carb,
      isEdit,
      tags,
      testEnabled,
      min,
      max,
    } = this.state

    if (forEdit.id && !isEdit) {
      this.setEdit()
    }

    return (
      <div>
        <Modal
          title={
            forEdit.id ? (
              <FormattedMessage id="erp.title.editingIngredient" />
            ) : (
              <FormattedMessage id="erp.title.createIngredient" />
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
                <Form.Item label={<FormattedMessage id="erp.name" />}>
                  {form.getFieldDecorator('Name', {
                    rules: [{ required: true }],
                    initialValue: name,
                  })(<Input onChange={e => this.onChangeField(e, 'name')} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={8} sm={24}>
                <Form.Item label={<FormattedMessage id="erp.brutto" />}>
                  {form.getFieldDecorator('Brutto', {
                    rules: [{ required: true }],
                    initialValue: brutto,
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      onChange={e => this.onChangeField(e, 'brutto')}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col md={8} sm={24}>
                <Form.Item name="unit" label={<FormattedMessage id="erp.unit" />}>
                  <Select value={unit} onChange={e => this.onChangeField(e, 'unit')}>
                    <Option key="kilogram" value="kilogram">
                      {formatMessage({ id: 'CreateIngrForm.Kilogram' })}
                    </Option>
                    <Option key="l" value="l">
                      l
                    </Option>
                    <Option key="kousky" value="kousky">
                      {formatMessage({ id: 'CreateIngrForm.Kousky' })}
                    </Option>
                  </Select>
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
              <Col md={6} sm={24}>
                <Form.Item label="kCal">
                  {form.getFieldDecorator('kCal', {
                    rules: [{ required: true }],
                    initialValue: energy,
                  })(<InputNumber onChange={e => this.onChangeField(e, 'energy')} />)}
                </Form.Item>
              </Col>
              <Col md={6} sm={24}>
                <Form.Item label={<FormattedMessage id="erp.prot" />}>
                  {form.getFieldDecorator('Prot', {
                    rules: [{ required: true }],
                    initialValue: prot,
                  })(<InputNumber onChange={e => this.onChangeField(e, 'prot')} />)}
                </Form.Item>
              </Col>
              <Col md={6} sm={24}>
                <Form.Item label={<FormattedMessage id="erp.fat" />}>
                  {form.getFieldDecorator('Fat', {
                    rules: [{ required: true }],
                    initialValue: fat,
                  })(<InputNumber onChange={e => this.onChangeField(e, 'fat')} />)}
                </Form.Item>
              </Col>
              <Col md={6} sm={24}>
                <Form.Item label={<FormattedMessage id="erp.carb" />}>
                  {form.getFieldDecorator('Carb', {
                    rules: [{ required: true }],
                    initialValue: carb,
                  })(<InputNumber onChange={e => this.onChangeField(e, 'carb')} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item name="group" label={<FormattedMessage id="erp.group" />}>
                  <Select value={group} onChange={e => this.onChangeField(e, 'group')}>
                    {groups.map(k => (
                      <Option key={k.id} value={k.id}>
                        {k.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item name="Tags" label="Tags">
                  <Select
                    placeholder="Tags"
                    mode="tags"
                    value={tags}
                    onChange={e => this.onChangeField(e, 'tags')}
                  >
                    {[
                      '1',
                      '2',
                      '3',
                      '4',
                      '5',
                      '6',
                      '7',
                      '8',
                      '9',
                      '10',
                      '11',
                      '12',
                      '13',
                      '14',
                    ].map(tag => (
                      <Option key={tag} value={tag}>
                        {tag}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'CreateIngrForm.TestInIngredients' })}>
                  <Checkbox
                    checked={testEnabled}
                    onChange={e => this.onChangeField(e, 'testEnabled')}
                  />
                  {formatMessage({ id: 'CreateIngrForm.SPASEWillBeDisplayedInTests' })}
                </Form.Item>
              </Col>
              <Col md={6} sm={24}>
                <Form.Item label="Min (g)">
                  <InputNumber value={min} onChange={e => this.onChangeField(e, 'min')} />
                </Form.Item>
              </Col>
              <Col md={6} sm={24}>
                <Form.Item label="Max (g)">
                  <InputNumber value={max} onChange={e => this.onChangeField(e, 'max')} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default CreateIngredientForm
