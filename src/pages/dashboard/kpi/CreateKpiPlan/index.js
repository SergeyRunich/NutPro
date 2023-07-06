/* eslint-disable array-callback-return */
import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import {
  Modal,
  Form,
  Button,
  Col,
  Row,
  Input,
  notification,
  Select,
  DatePicker,
  InputNumber,
} from 'antd'
import { createKpiPlan, updateKpiPlan, getKpiMetric } from '../../../../api/kpiMetric'

import { getSystemUsers } from '../../../../api/user'

const { Option } = Select
const { MonthPicker } = DatePicker
const { TextArea } = Input

@injectIntl
@Form.create()
class CreateKpiPlan extends React.Component {
  state = {
    metric: '',
    users: [],
    user: '',
    metrics: [],
    goal: 0,
    result: 0,
    comment: '',
    month: moment()
      .utc()
      .add(1, 'months')
      .startOf('month')
      .toISOString(),
    isEdit: false,
    saved: false,
  }

  constructor(props) {
    super(props)

    this.onSend = this.onSend.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.onChangeMonth = this.onChangeMonth.bind(this)
  }

  componentDidMount() {
    getSystemUsers().then(async answer => {
      const json = await answer.json()
      this.setState({
        users: json.result,
        user: json.result[0].id,
      })
      getKpiMetric().then(async answerMetrics => {
        const jsonMetrics = await answerMetrics.json()
        const metricItem = jsonMetrics.result.find(s => s.user.id === json.result[0].id)
        this.setState({
          metrics: jsonMetrics.result,
          metric: metricItem !== undefined ? metricItem.id : '',
        })
      })
    })
  }

  onChangeField(e, field) {
    const { metrics } = this.state
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
      if (field === 'user') {
        const metricItem = metrics.find(s => s.user.id === e)
        if (metricItem) {
          this.setState({
            metric: metricItem.id,
          })
        }
      }
    }
  }

  onChangeMonth(date) {
    const month = date
      .utc()
      .startOf('month')
      .toISOString()
    this.setState({
      month,
    })
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
      const { metric, goal, result, comment, month } = this.state
      const onSendData = {
        metric,
        goal,
        result,
        comment,
        month,
      }
      if (forEdit.id) {
        const req = await updateKpiPlan(forEdit.id, onSendData)
        if (req.status === 205) {
          this.setState({
            saved: true,
          })
          setTimeout(() => {}, 300)
          update()
          notification.success({
            message: formatMessage({ id: 'CreateKpiPlan.Changed' }),
            description: formatMessage({ id: 'CreateKpiPlan.MetricSuccessfullyChanged' }),
          })

          this.closeDrawer()
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
            placement: 'topLeft',
          })
        }
      } else {
        const req = await createKpiPlan(onSendData)
        if (req.status === 201) {
          update()
          this.closeDrawer()
          notification.success({
            message: formatMessage({ id: 'CreateKpiPlan.Created' }),
            description: formatMessage({ id: 'CreateKpiPlan.MetricSuccessfullyCreated!' }),
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
    if (forEdit.id && forEdit.metric.id) {
      this.setState({
        user: forEdit.metric.user.id,
        metric: forEdit.metric.id,
        goal: forEdit.goal,
        result: forEdit.result,
        comment: forEdit.comment,
        month: forEdit.month,
        isEdit: true,
      })
    }
  }

  closeDrawer() {
    const { onClose, form } = this.props
    this.setState({
      goal: 0,
      result: 0,
      comment: '',
      month: moment()
        .utc()
        .add(1, 'months')
        .startOf('month')
        .toISOString(),
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
    const { metric, goal, result, comment, month, metrics, users, user, isEdit, saved } = this.state

    if (forEdit.id && !isEdit && !saved) {
      this.setEdit()
    }

    // let viewportWidth = 1080
    // if (typeof (window.innerWidth) !== 'undefined') {
    //   viewportWidth = window.innerWidth;
    // }
    return (
      <div>
        <Modal
          title={
            isEdit
              ? formatMessage({ id: 'CreateKpiPlan.EditPlan' })
              : formatMessage({ id: 'CreateKpiPlan.CreatePlan' })
          }
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
              <Col md={8} sm={24}>
                <Form.Item label={formatMessage({ id: 'CreateKpiPlan.Employee' })}>
                  <Select
                    placeholder={formatMessage({ id: 'CreateKpiPlan.Employee' })}
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
              <Col md={16} sm={24}>
                <Form.Item label={formatMessage({ id: 'CreateKpiPlan.Metric' })}>
                  <Select
                    placeholder={formatMessage({ id: 'CreateKpiPlan.Point' })}
                    value={metric}
                    onChange={e => this.onChangeField(e, 'metric')}
                  >
                    {metrics.map(item => {
                      if (item.user.id === user) {
                        return (
                          <Option key={Math.random()} value={item.id}>
                            {item.name}
                          </Option>
                        )
                      }
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={10} sm={24}>
                <Form.Item label={formatMessage({ id: 'CreateKpiPlan.Month' })}>
                  <MonthPicker
                    style={{ width: '100%' }}
                    onChange={this.onChangeMonth}
                    placeholder={formatMessage({ id: 'CreateKpiPlan.SelectMonth' })}
                    value={moment(month)}
                    format="MMMM YYYY"
                  />
                </Form.Item>
              </Col>
              <Col md={7} sm={24}>
                <Form.Item label={formatMessage({ id: 'CreateKpiPlan.Goal' })}>
                  {form.getFieldDecorator('goal', {
                    rules: [{ required: true }],
                    initialValue: goal,
                    setFealdsValue: goal,
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder={formatMessage({ id: 'CreateKpiPlan.Goal' })}
                      onChange={e => this.onChangeField(e, 'goal')}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col md={7} sm={24}>
                <Form.Item label={formatMessage({ id: 'CreateKpiPlan.Result' })}>
                  {form.getFieldDecorator('result', {
                    initialValue: result,
                    setFealdsValue: result,
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      disabled={!isEdit}
                      placeholder={formatMessage({ id: 'CreateKpiPlan.Result' })}
                      onChange={e => this.onChangeField(e, 'result')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Form.Item label={formatMessage({ id: 'CreateKpiPlan.Comment' })}>
                  {form.getFieldDecorator('comment', {
                    initialValue: comment,
                    setFealdsValue: comment,
                  })(
                    <TextArea
                      rows={3}
                      placeholder={formatMessage({ id: 'CreateKpiPlan.Comment' })}
                      onChange={e => this.onChangeField(e, 'comment')}
                    />,
                  )}
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

export default CreateKpiPlan
