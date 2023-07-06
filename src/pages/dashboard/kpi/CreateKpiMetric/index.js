import React from 'react'
import { injectIntl } from 'react-intl'
import { Modal, Form, Button, Col, Row, Input, notification, Select } from 'antd'
import { createKpiMetric, updateKpiMetric, getKpiSource } from '../../../../api/kpiMetric'

import { getSystemUsers } from '../../../../api/user'

const { Option } = Select

@injectIntl
@Form.create()
class CreateKpiMetricForm extends React.Component {
  state = {
    name: '',
    user: '',
    users: [],
    sources: [],
    source: 'manual',
    sourceData: 'all',
    isEdit: false,
    saved: false,
  }

  constructor(props) {
    super(props)

    this.onSend = this.onSend.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
  }

  componentDidMount() {
    getSystemUsers().then(async answer => {
      const json = await answer.json()
      this.setState({
        users: json.result,
        user: json.result[0].id,
      })
    })
    getKpiSource().then(async answer => {
      const json = await answer.json()
      this.setState({
        sources: json.result,
      })
    })
  }

  onChangeField(e, field) {
    const { sources } = this.state
    if (e !== null && e.target) {
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
      if (field === 'source') {
        const sourceItem = sources.find(s => s.tag === e)
        if (sourceItem) {
          this.setState({
            name: sourceItem.name,
          })
        }
      }
    }
  }

  async onSend(e) {
    e.preventDefault()
    try {
      const {
        form,
        update,
        forEdit,
        intl: { formatMessage },
      } = this.props
      await form.validateFields()
      const { name, user, source, sourceData } = this.state
      const onSendData = {
        name,
        user,
        source,
        sourceData,
      }
      if (forEdit.id) {
        const req = await updateKpiMetric(forEdit.id, onSendData)
        if (req.status === 205) {
          update()
          this.setState({
            saved: true,
          })
          setTimeout(() => {}, 300)
          notification.success({
            message: formatMessage({ id: 'CreateKpiMetric.Changed' }),
            description: formatMessage({ id: 'CreateKpiMetric.MetricSuccessfullyChanged' }),
          })
          this.setState({
            isEdit: false,
          })
          setTimeout(() => {}, 300)
          this.closeDrawer()
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
            placement: 'topLeft',
          })
        }
      } else {
        const req = await createKpiMetric(onSendData)
        if (req.status === 201) {
          update()
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'CreateKpiMetric.Created' }),
            description: formatMessage({ id: 'CreateKpiMetric.MetricSuccessfullyCreated' }),
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
    if (forEdit.name && forEdit.user.id && forEdit.id) {
      this.setState({
        name: forEdit.name,
        user: forEdit.user.id,
        source: forEdit.source,
        sourceData: forEdit.sourceData,
        isEdit: true,
      })
    }
  }

  closeDrawer() {
    const { onClose, form } = this.props
    this.setState({
      name: '',
      source: 'manual',
      sourceData: 'all',
      isEdit: false,
    })

    form.resetFields()
    onClose()
    this.setState({
      saved: false,
    })
  }

  render() {
    const {
      visible,
      form,
      forEdit,
      intl: { formatMessage },
    } = this.props
    const { name, user, users, source, sources, sourceData, isEdit, saved } = this.state

    if (forEdit.id && !isEdit && !saved) {
      this.setEdit()
    }

    const sourceItem = sources.find(s => s.tag === source)
    return (
      <div>
        <Modal
          title={`${
            isEdit ? formatMessage({ id: 'global.edit' }) : formatMessage({ id: 'global.create' })
          } metric`}
          // width={viewportWidth < 768 ? '100%' : 'auto'}
          onCancel={this.closeDrawer}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
          footer=""
        >
          <Form layout="vertical" onSubmit={this.onSend}>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label={formatMessage({ id: 'CreateKpiMetric.SourceOfMetric' })}>
                  <Select
                    placeholder={formatMessage({ id: 'CreateKpiMetric.Point' })}
                    value={source}
                    onChange={e => this.onChangeField(e, 'source')}
                  >
                    {sources.map(item => (
                      <Option key={Math.random()} value={item.tag}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label={formatMessage({ id: 'global.name' })}>
                  {form.getFieldDecorator('Name', {
                    rules: [{ required: true }],
                    initialValue: name,
                    setFealdsValue: name,
                  })(<Input placeholder="Name" onChange={e => this.onChangeField(e, 'name')} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'CreateKpiMetric.Employee' })}>
                  <Select
                    placeholder={formatMessage({ id: 'CreateKpiMetric.Employee' })}
                    value={user}
                    onChange={e => this.onChangeField(e, 'user')}
                  >
                    {users.map(item => (
                      <Option key={Math.random()} value={item.id}>
                        {item.username}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'CreateKpiMetric.Data' })}>
                  <Select
                    placeholder={formatMessage({ id: 'CreateKpiMetric.Data' })}
                    value={sourceData}
                    onChange={e => this.onChangeField(e, 'sourceData')}
                  >
                    {sourceItem !== undefined &&
                      sourceItem.enum.map(item => (
                        <Option key={Math.random()} value={item}>
                          {item}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <div className="form-actions">
              <Button style={{ width: 150 }} type="primary" htmlType="submit" className="mr-3">
                {isEdit
                  ? formatMessage({ id: 'global.edit' })
                  : formatMessage({ id: 'global.create' })}
              </Button>
              <Button onClick={this.closeDrawer}>{formatMessage({ id: 'global.cancel' })}</Button>
            </div>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default CreateKpiMetricForm
