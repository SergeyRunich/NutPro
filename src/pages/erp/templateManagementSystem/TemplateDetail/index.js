import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Table, Row, Col, Empty, Tag, Button, notification, Checkbox, Drawer } from 'antd'

import { startMainDayTest } from '../../../../api/erp/testSettings'
import { getTechcard } from '../../../../api/erp/techcard'
import TechcardDetail from '../TechcardDetail'

@injectIntl
@connect(({ user }) => ({ user }))
class TemplateDetail extends React.Component {
  state = {
    testData: [],
    testVisible: false,
    selectedTechcard: '',
    techcardVisible: false,
    range: {
      min: 0,
      max: 0,
    },
  }

  componentWillReceiveProps() {
    this.setState({
      testData: [],
      testVisible: false,
    })
  }

  showTechcard = id => {
    getTechcard(id).then(async answer => {
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          selectedTechcard: json,
          techcardVisible: true,
        })
      }
    })
  }

  onCloseTechcard = () => {
    this.setState({
      techcardVisible: false,
      selectedTechcard: '',
    })
  }

  async startTest(templateId) {
    const {
      intl: { formatMessage },
    } = this.props
    try {
      const onSendData = {
        dayTemplate: templateId,
      }
      const req = await startMainDayTest(onSendData)
      if (req.status === 200) {
        const json = await req.json()
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'TemplateDetail.TestFinished' }),
        })
        this.setState({ testData: json.dishes, range: json.range, testVisible: true })
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

  render() {
    const {
      template,
      edit,
      user,
      visible,
      onClose,
      intl: { formatMessage },
    } = this.props
    const { testVisible, testData, range, selectedTechcard, techcardVisible } = this.state

    const meals = ['Breakfast', '1 Snack', 'Lunch', '2 Snack', 'Dinner']

    const columns = [
      {
        title: <strong>#</strong>,
        // dataIndex: 'id',
        key: 'dfdfdfdf',
        render: (text, record, index) => {
          return (
            <span>
              <strong>{` ${index + 1}`}</strong>
            </span>
          )
        },
      },
      {
        title: (
          <strong>
            <FormattedMessage id="erp.dish" />
          </strong>
        ),
        dataIndex: 'techcard',
        key: 'name',
        render: (text, record) => {
          return (
            <span>
              <strong>
                <Button type="link" onClick={() => this.showTechcard(record.techcard.id)}>
                  {` ${text.title}`}
                </Button>
              </strong>
            </span>
          )
        },
      },
      {
        title: (
          <strong>
            <FormattedMessage id="erp.coefficient" />
          </strong>
        ),
        dataIndex: 'amount',
        key: 'amount',
        render: text => <span>{`${text}`}</span>,
        sorter: (a, b) => a.amount - b.amount,
      },

      {
        title: (
          <strong>
            <FormattedMessage id="erp.weightG" />
          </strong>
        ),
        dataIndex: 'amount',
        key: 'amountfdfdf',
        render: (text, record) => {
          const weight = Math.floor(text * record.techcard.amount * 100) * 10
          return <span>{`${weight}`}</span>
        },
      },
      {
        title: <strong>kCal</strong>,
        dataIndex: 'kcal',
        key: 'kcal',
        render: text => {
          return <span>{`${text}`}</span>
        },
      },
      {
        title: <strong>P</strong>,
        dataIndex: 'prot',
        key: 'prot',
        render: text => {
          return <span>{`${text}`}</span>
        },
      },
      {
        title: <strong>F</strong>,
        dataIndex: 'fat',
        key: 'fat',
        render: text => {
          return <span>{`${text}`}</span>
        },
      },
      {
        title: <strong>C</strong>,
        dataIndex: 'carb',
        key: 'carb',
        render: text => {
          return <span>{`${text}`}</span>
        },
      },
      {
        title: (
          <strong>
            <FormattedMessage id="erp.meal" />
          </strong>
        ),
        dataIndex: 'meal',
        key: 'meal',
        render: text => <span>{`${meals[text]}`}</span>,
        sorter: (a, b) => a.meal - b.meal,
      },
      {
        title: (
          <strong>
            <FormattedMessage id="erp.group" />
          </strong>
        ),
        dataIndex: 'group',
        key: 'group',
        render: text => <span>{`${text}`}</span>,
        sorter: (a, b) => a.group - b.group,
      },
    ]

    const sharedStyle = {
      border: '1px solid #e8e8e8',
      borderCollapse: 'collapse',
      borderRadius: '10px',
      padding: '0.5em',
      textAlign: 'center',
      textSize: '10px',
    }

    const sharedStyleRed = {
      border: '1px solid #e8e8e8',
      borderCollapse: 'collapse',
      padding: '0.5em',
      textAlign: 'center',
      textSize: '10px',
      backgroundColor: 'red',
    }

    const sharedStyleGreen = {
      border: '1px solid #e8e8e8',
      borderCollapse: 'collapse',
      padding: '0.5em',
      textAlign: 'center',
      textSize: '10px',
      backgroundColor: 'green',
    }

    const tableStyle = {
      border: '1px solid #e8e8e8',
      borderCollapse: 'collapse',
      borderRadius: '5px',
      padding: '0.5em',
      marginTop: '15px',
      display: 'inline-table',
    }

    return (
      <Drawer
        title={`Day template: ${template.name}`}
        width="100%"
        height="100%"
        onClose={() => onClose()}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <div>
          {template.id && (
            <Row gutter={16}>
              <Col sm={24} md={14}>
                <div style={{ paddingLeft: '10px' }}>
                  <h4>
                    <FormattedMessage id="erp.positions" />
                  </h4>
                </div>
                <Table
                  columns={columns}
                  dataSource={template ? template.dishes : []}
                  pagination={false}
                  rowKey={Math.random()}
                  bordered
                />
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
                    </div>
                  )}

                  <div style={{ marginTop: '10px' }}>
                    <Tag color="#87d068" key={Math.random()}>
                      <span style={{ fontSize: '14px' }}>{template.class}</span>
                    </Tag>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <Button
                      type="primary"
                      onClick={() => this.startTest(template.id)}
                      style={{ margin: '0 5px 5px 0' }}
                    >
                      {formatMessage({ id: 'TemplateDetail.kCalTest' })}
                    </Button>
                    <br />
                    {testVisible && (
                      <table style={tableStyle}>
                        <tbody>
                          <tr>
                            <th style={sharedStyle}>
                              <FormattedMessage id="erp.meal" />
                            </th>
                            <th style={sharedStyle}>
                              {formatMessage({ id: 'TemplateDetail.Option' })}
                            </th>
                            <th style={sharedStyle}>
                              {formatMessage({ id: 'TemplateDetail.Min' })}
                            </th>
                            <th style={sharedStyle}>
                              {formatMessage({ id: 'TemplateDetail.Max' })}
                            </th>
                          </tr>
                          {testData.map(item => (
                            <tr key={Math.random()}>
                              <td style={sharedStyle}>{meals[item.meal]}</td>
                              <td style={sharedStyle}>
                                <Checkbox checked={item.optional} disabled />
                              </td>
                              <td
                                style={
                                  item.min.total >= item.min.shouldBe && item.min.total !== 10000
                                    ? sharedStyleGreen
                                    : sharedStyleRed
                                }
                              >
                                {item.min.total !== 10000 ? item.min.total : '-'}
                              </td>
                              <td
                                style={
                                  item.max.total <= item.max.shouldBe && item.max.total !== 0
                                    ? sharedStyleGreen
                                    : sharedStyleRed
                                }
                              >
                                {item.max.total !== 0 ? item.max.total : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {testVisible && (
                      <p style={{ fontSize: '30px' }}>
                        <br /> {formatMessage({ id: 'TemplateDetail.kCalRange' })}
                        <br /> {range.min} - {range.max}{' '}
                      </p>
                    )}
                  </div>
                </center>
              </Col>
            </Row>
          )}
          {!template.id && <Empty description={false} />}
          <TechcardDetail
            visible={techcardVisible}
            techcard={selectedTechcard}
            onClose={this.onCloseTechcard}
            edit={edit}
          />
        </div>
      </Drawer>
    )
  }
}

export default TemplateDetail
