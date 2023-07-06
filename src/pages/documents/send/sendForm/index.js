import React from 'react'
import { injectIntl } from 'react-intl'
import { Button, Select, Input, Row, Col, Typography, notification } from 'antd'
import moment from 'moment'

import ApplicationContact from '../../../application-contact'
import { sendDocuments } from '../../../../api/document'
import { getEmails } from '../../../../api/application-contact'

const { Option } = Select

const subjectList = [
  { key: 0, label: 'Objednavka XX-XX.XX.XX' },
  { key: 1, label: 'Objednavka XX-XX.XX.XX. Zmena: +X clovek' },
]

@injectIntl
class SendForm extends React.Component {
  state = {
    email: [],
    subject: 'Objednavka ',
    text: '',
    emailVisible: false,
    allEmails: [],
    sending: false,
  }

  constructor(props) {
    super(props)

    this.handleChangeEmail = this.handleChangeEmail.bind(this)
    this.handleChangeSubject = this.handleChangeSubject.bind(this)
    this.handleChangeText = this.handleChangeText.bind(this)
    this.sendEmail = this.sendEmail.bind(this)
    this.handleChangeSubjectType = this.handleChangeSubjectType.bind(this)
    this.showEmails = this.showEmails.bind(this)
  }

  componentWillMount() {
    getEmails().then(async answer => {
      const json = await answer.json()
      this.setState({
        allEmails: json.result,
      })
      const defEmails = []
      json.result.forEach(element => {
        if (element.defValue) defEmails.push(element.email)
      })
      this.setState({
        email: defEmails,
      })
    })
  }

  setEmails(pool) {
    const { allEmails } = this.state
    const { params } = this.props
    const { kitchen } = params

    const defEmails = []
    if (pool === 'default') {
      allEmails.forEach(element => {
        if (element.defValue) defEmails.push(element.email)
      })
    } else {
      allEmails.forEach(element => {
        if (element.kitchen.id === kitchen) defEmails.push(element.email)
      })
    }
    this.setState({
      email: defEmails,
    })
  }

  sendEmail = async () => {
    this.setState({
      sending: true,
    })
    const {
      params,
      intl: { formatMessage },
    } = this.props
    const { email, subject, text } = this.state
    const { period, startDate, endDate, kitchen, isSendNextWeek } = params
    await sendDocuments(
      'sendEmail',
      period,
      kitchen,
      [moment.unix(startDate).format('DD-MM-YYYY'), moment.unix(endDate).format('DD-MM-YYYY')],
      { email, subject, text, isSendNextWeek },
    ).then(res => {
      if (res.status === 200) {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'ExremeIngredientsList.EmailSuccessfullySent!' }),
        })
        this.setState({
          sending: false,
        })
      }
      if (res.status === 412) {
        notification.error({
          message: formatMessage({ id: 'ExremeIngredientsList.ErrorInNumberOfOrders' }),
          description: formatMessage({
            id: 'ExremeIngredientsList.AnErrorWasDetected.PleaseCheckNumberOfOrders',
          }),
        })
      }
    })
  }

  showEmails = status => {
    this.setState({
      emailVisible: status,
    })
    if (!status) {
      getEmails().then(async answer => {
        const json = await answer.json()
        this.setState({
          allEmails: json.result,
        })
      })
    }
  }

  handleChangeEmail(email) {
    this.setState({ email })
  }

  handleChangeSubject(subject) {
    this.setState({ subject: subject.target.value })
  }

  handleChangeSubjectType(subject) {
    const { params } = this.props
    const { startDate, endDate } = params

    if (subject === 0) {
      this.setState({
        subject: `Objednavka ${moment.unix(startDate).format('DD')}-${moment
          .unix(endDate)
          .format('DD.MM.YY')}`,
      })
    } else if (subject === 1) {
      this.setState({
        subject: `Objednavka ${moment.unix(startDate).format('DD')}-${moment
          .unix(endDate)
          .format('DD.MM.YY')} Zmena: +X clovek`,
      })
    }
  }

  handleChangeText(text) {
    this.setState({ text: text.target.value })
  }

  render() {
    const { email, subject, text, emailVisible, allEmails, sending } = this.state

    const {
      intl: { formatMessage },
    } = this.props

    return (
      <div>
        <Button
          type="default"
          style={{ marginRight: '15px' }}
          onClick={() => this.showEmails(true)}
        >
          {formatMessage({ id: 'SendForm.ManageEmails' })}
        </Button>
        <Button
          type="dashed"
          style={{ marginRight: '15px' }}
          onClick={() => this.setEmails('default')}
        >
          {formatMessage({ id: 'SendForm.DefaultEmails' })}
        </Button>
        <Button type="dashed" onClick={() => this.setEmails('kitchen')}>
          {formatMessage({ id: 'SendForm.EmailsByCurrentKitchen' })}
        </Button>
        <hr />
        <h4>{formatMessage({ id: 'SendForm.SendViaEmail' })}</h4>
        <Typography.Text strong style={{ display: 'block' }}>
          {formatMessage({ id: 'SendForm.E-mail' })}
        </Typography.Text>
        <Select
          value={email}
          style={{ width: '100%' }}
          onChange={this.handleChangeEmail}
          mode="tags"
        >
          {allEmails.map(k => (
            <Option key={k.id} value={k.email}>
              {k.email}
            </Option>
          ))}
        </Select>
        <Typography.Text strong style={{ display: 'block' }}>
          {formatMessage({ id: 'SendForm.Subject' })}
        </Typography.Text>
        <Row gutter={16}>
          <Col xl={16}>
            <Input
              value={subject}
              onChange={this.handleChangeSubject}
              style={{ marginBottom: '10px' }}
            />
          </Col>
          <Col xl={8}>
            <Select
              defaultValue="------"
              style={{ width: '100%' }}
              onChange={this.handleChangeSubjectType}
            >
              {subjectList.map(k => (
                <Option key={k.key} value={k.key}>
                  {k.label}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Typography.Text strong style={{ display: 'block' }}>
          {formatMessage({ id: 'SendForm.Text' })}
        </Typography.Text>
        <Input.TextArea
          rows={4}
          value={text}
          onChange={this.handleChangeText}
          style={{ marginBottom: '10px' }}
        />

        <Button loading={sending} type="primary" onClick={this.sendEmail}>
          {formatMessage({ id: 'SendForm.Send' })}
        </Button>
        <ApplicationContact visible={emailVisible} showEmails={this.showEmails} />
      </div>
    )
  }
}

export default SendForm
