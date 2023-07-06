import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Row, Col, Empty, Button, Popconfirm, Statistic, notification } from 'antd'

import {
  startMainWeekTest,
  startTagWeekTest,
  startUserWeekTest,
  loadLastWeekTest,
} from '../../../../api/erp/testSettings'

import MainTest from '../MainTest'
import TagTest from '../TagTest'

@injectIntl
@connect(({ user }) => ({ user }))
class TemplateDetail extends React.Component {
  state = {
    loading: false,
    mainTestVisible: false,
    tagTestVisible: false,
    data: [],
    summary: [],
    tagTestData: [],
  }

  constructor(props) {
    super(props)

    this.onCloseTest = this.onCloseTest.bind(this)
  }

  onCloseTest() {
    this.setState({ mainTestVisible: false, tagTestVisible: false })
  }

  async startTest(templateId, mealsPerDay = 5, oneMealOneDish = false) {
    const {
      intl: { formatMessage },
    } = this.props
    try {
      this.setState({ loading: true })
      const onSendData = {
        weekTemplate: templateId,
        mealsPerDay,
        oneMealOneDish,
      }
      const req = await startMainWeekTest(onSendData)
      if (req.status === 200) {
        const json = await req.json()
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'TemplateDetail.TestFinished!' }),
        })
        this.setState({ data: json.result, loading: false, mainTestVisible: true })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
          placement: 'topLeft',
        })
        this.setState({ loading: false })
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  async startUserTest(templateId, oneMealOneDish = false) {
    const {
      intl: { formatMessage },
    } = this.props
    try {
      this.setState({ loading: true })
      const onSendData = {
        weekTemplate: templateId,
        oneMealOneDish,
      }
      startUserWeekTest(onSendData)
      notification.success({
        message: formatMessage({ id: 'global.success' }),
        description: formatMessage({ id: 'TemplateDetail.TestRunning...' }),
      })
      this.setState({ loading: false })
      // if (req.status === 200) {
      //   const json = await req.json()

      //   this.setState({ data: json.result, summary: json.summary, loading: false, mainTestVisible: true })
      // } else {
      //   notification.error({
      //     message: 'Error',
      //     description: req.statusText,
      //     placement: 'topLeft',
      //   })
      //   this.setState({ loading: false })
      // }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  async loadUserTest(templateId) {
    const {
      intl: { formatMessage },
    } = this.props
    try {
      this.setState({ loading: true })
      const req = await loadLastWeekTest(templateId)
      if (req.status === 200) {
        const json = await req.json()
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'TemplateDetail.LoadFinished!' }),
        })
        this.setState({
          data: json.result,
          summary: json.summary,
          loading: false,
          mainTestVisible: true,
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
          placement: 'topLeft',
        })
        this.setState({ loading: false })
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  async startTagTest(templateId) {
    const {
      intl: { formatMessage },
    } = this.props
    try {
      this.setState({ loading: true })
      const onSendData = {
        weekTemplate: templateId,
      }
      const req = await startTagWeekTest(onSendData)
      if (req.status === 200) {
        const json = await req.json()
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'TemplateDetail.TestFinished!' }),
        })
        this.setState({ tagTestData: json, loading: false, tagTestVisible: true })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
          placement: 'topLeft',
        })
        this.setState({ loading: false })
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  render() {
    const {
      template,
      edit,
      removeTemplate,
      user,
      intl: { formatMessage },
    } = this.props
    const { loading, mainTestVisible, data, tagTestData, tagTestVisible, summary } = this.state

    // const meals = ['Завтрак', '1 Перекус', 'Обед', '2 Перекус', 'Ужин']

    return (
      <div>
        {template.id && (
          <Row gutter={16}>
            <Col sm={24} md={14}>
              <div style={{ paddingBottom: '10px' }}>
                <Statistic
                  title={<FormattedMessage id="main.monday" />}
                  value={template.monday.name}
                />
              </div>
              <div style={{ paddingBottom: '10px' }}>
                <Statistic
                  title={<FormattedMessage id="main.tuesday" />}
                  value={template.tuesday.name}
                />
              </div>
              <div style={{ paddingBottom: '10px' }}>
                <Statistic
                  title={<FormattedMessage id="main.wednesday" />}
                  value={template.wednesday.name}
                />
              </div>
              <div style={{ paddingBottom: '10px' }}>
                <Statistic
                  title={<FormattedMessage id="main.thursday" />}
                  value={template.thursday.name}
                />
              </div>
              <div style={{ paddingBottom: '10px' }}>
                <Statistic
                  title={<FormattedMessage id="main.friday" />}
                  value={template.friday.name}
                />
              </div>
              <div style={{ paddingBottom: '10px' }}>
                <Statistic
                  title={<FormattedMessage id="main.saturday" />}
                  value={template.saturday.name}
                />
              </div>
            </Col>
            <Col sm={24} md={10}>
              <center>
                <div style={{ marginTop: '10px' }}>
                  <h3>{template.name}</h3>
                </div>
                {user.name !== 'david' && (
                  <div style={{ marginTop: '10px' }}>
                    <Button
                      type="primary"
                      onClick={() => edit(template)}
                      style={{ margin: '0 5px 5px 0' }}
                    >
                      <FormattedMessage id="global.edit" />
                    </Button>
                    <Popconfirm
                      title={formatMessage({ id: 'TemplateDetail.AreYouSureDeleteThisTemplate?' })}
                      onConfirm={async () => removeTemplate(template.id)}
                      okText={formatMessage({ id: 'global.yes' })}
                      cancelText={formatMessage({ id: 'global.no' })}
                    >
                      <Button type="danger">
                        <FormattedMessage id="global.delete" />
                      </Button>
                    </Popconfirm>
                  </div>
                )}

                <div style={{ marginTop: '10px' }}>
                  <Button
                    loading={loading}
                    type="primary"
                    onClick={async () => {
                      await this.startTest(template.id, 5, false)
                    }}
                    style={{ margin: '0 5px 5px 0' }}
                  >
                    {formatMessage({ id: 'TemplateDetail.kCalTest(5Meals)' })}
                  </Button>
                  <Button
                    loading={loading}
                    type="primary"
                    onClick={async () => {
                      await this.startTest(template.id, 3, false)
                    }}
                    style={{ margin: '0 5px 5px 0' }}
                  >
                    {formatMessage({ id: 'TemplateDetail.kCalTest(3Meals)' })}
                  </Button>
                  <Button
                    loading={loading}
                    type="primary"
                    onClick={async () => {
                      await this.startTest(template.id, 2, false)
                    }}
                    style={{ margin: '0 5px 5px 0' }}
                  >
                    {formatMessage({ id: 'TemplateDetail.kCalTest(2Meals)' })}
                  </Button>
                  <Button
                    loading={loading}
                    type="primary"
                    onClick={async () => {
                      await this.startTagTest(template.id)
                    }}
                    style={{ margin: '0 5px 5px 0' }}
                  >
                    {formatMessage({ id: 'TemplateDetail.TagTest' })}
                  </Button>
                  <br />
                  <Button
                    loading={loading}
                    type="primary"
                    onClick={() => {
                      this.startUserTest(template.id)
                    }}
                    style={{ margin: '0 5px 5px 0' }}
                  >
                    {formatMessage({ id: 'TemplateDetail.STARTREALTEST' })}
                  </Button>
                  <Button
                    loading={loading}
                    type="primary"
                    onClick={() => {
                      this.loadUserTest(template.id)
                    }}
                    style={{ margin: '0 5px 5px 0' }}
                  >
                    {formatMessage({ id: 'TemplateDetail.LOADLASTREALTEST' })}
                  </Button>
                </div>
              </center>
            </Col>
          </Row>
        )}
        {!template.id && <Empty description={false} />}
        <MainTest
          visible={mainTestVisible}
          data={data}
          onClose={this.onCloseTest}
          summary={summary}
        />
        <TagTest visible={tagTestVisible} data={tagTestData} onClose={this.onCloseTest} />
      </div>
    )
  }
}

export default TemplateDetail
