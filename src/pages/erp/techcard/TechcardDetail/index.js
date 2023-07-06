/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { saveAs } from 'file-saver'
import { injectIntl, FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Table, Row, Col, Empty, Tag, Button, Popconfirm, InputNumber } from 'antd'
import { connect } from 'react-redux'
import { downloadTechcard } from '../../../../api/erp/techcard'

@injectIntl
@withRouter
@connect(({ user }) => ({ user }))
class TechcardDetail extends React.Component {
  state = {
    cf: 1,
  }

  constructor(props) {
    super(props)

    this.downloadTC = this.downloadTC.bind(this)
    this.changeCF = this.changeCF.bind(this)
  }

  changeCF(e) {
    this.setState({ cf: e })
  }

  async downloadTC() {
    const { techcard } = this.props
    const { cf } = this.state
    const resp = await downloadTechcard(techcard.id, cf)
    const blob = await resp.blob()
    const filename = resp.headers.get('Filename')
    saveAs(blob, `${filename}`)
  }

  render() {
    const {
      techcard,
      edit,
      removeTechcard,
      user,
      intl: { formatMessage },
    } = this.props
    const { cf } = this.state

    const columnsIngredient = [
      {
        title: (
          <strong>
            <FormattedMessage id="erp.ingredient" />
          </strong>
        ),
        dataIndex: 'name',
        key: 'name',
        render: text => {
          return (
            <span>
              <strong>{` ${text}`}</strong>
            </span>
          )
        },
      },
      {
        title: (
          <strong>
            <FormattedMessage id="erp.unit" />
          </strong>
        ),
        dataIndex: 'unit',
        key: 'unit',
        render: text => <span>{`${text}`}</span>,
      },
      {
        title: <strong>%</strong>,
        dataIndex: 'percent',
        key: 'percent',
        render: text => <span>{`${text || '-'}`}</span>,
      },
      {
        title: (
          <strong>
            <FormattedMessage id="erp.brutto" />
          </strong>
        ),
        dataIndex: 'brutto',
        key: 'brutto',
        render: (text, record, i) => (
          <span>{`${techcard.ingredientsAmount[i] / ((100 - record.percent) / 100)}`}</span>
        ),
      },
      {
        title: (
          <strong>
            <FormattedMessage id="erp.netto" />
          </strong>
        ),
        dataIndex: 'ingredientsAmount',
        key: 'netto',
        render: (text, _, i) => <span>{`${techcard.ingredientsAmount[i]}`}</span>,
      },
    ]

    const columnsSubTechcard = [
      {
        title: (
          <strong>
            <FormattedMessage id="erp.semiproduct" />
          </strong>
        ),
        dataIndex: 'title',
        key: 'title',
        render: text => {
          return (
            <span>
              <strong>{` ${text}`}</strong>
            </span>
          )
        },
      },
      {
        title: (
          <strong>
            <FormattedMessage id="erp.unit" />
          </strong>
        ),
        dataIndex: 'unit',
        key: 'unit',
        render: text => <span>{`${text ? 'ks' : 'kilogram'}`}</span>,
      },
      {
        title: <strong>%</strong>,
        dataIndex: 'percent',
        key: 'percent',
        render: text => <span>{`${text || '-'}`}</span>,
      },
      {
        title: (
          <strong>
            <FormattedMessage id="erp.brutto" />
          </strong>
        ),
        dataIndex: 'brutto',
        key: 'brutto',
        render: (text, record, i) => (
          <span>{`${techcard.subTechcardsAmount[i] / ((100 - record.percent) / 100)}`}</span>
        ),
      },
      {
        title: (
          <strong>
            <FormattedMessage id="erp.netto" />
          </strong>
        ),
        dataIndex: 'subTechcardsAmount',
        key: 'netto',
        render: (text, _, i) => <span>{`${techcard.subTechcardsAmount[i]}`}</span>,
      },
    ]

    const columnsProportions = [
      {
        title: (
          <strong>
            <FormattedMessage id="erp.Title" />
          </strong>
        ),
        dataIndex: 'title',
        key: 'title',
        render: text => {
          return (
            <span>
              <strong>{` ${text}`}</strong>
            </span>
          )
        },
      },
      {
        title: (
          <strong>
            <FormattedMessage id="erp.Amount" />
          </strong>
        ),
        dataIndex: 'amount',
        key: 'amount',
        render: text => {
          return (
            <span>
              <strong>{` ${text}`}</strong>
            </span>
          )
        },
      },
      {
        title: (
          <strong>
            <FormattedMessage id="erp.Unit" />
          </strong>
        ),
        dataIndex: 'unit',
        key: 'unit',
        render: text => {
          return (
            <span>
              <strong>{` ${text}`}</strong>
            </span>
          )
        },
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

    const tableStyle = {
      border: '1px solid #e8e8e8',
      borderCollapse: 'collapse',
      borderRadius: '5px',
      padding: '0.5em',
      marginTop: '15px',
      display: 'inline-table',
    }

    return (
      <div>
        {techcard.id && (
          <Row gutter={16}>
            <Col sm={24} md={14}>
              <div style={{ paddingLeft: '10px' }}>
                <h4>
                  <FormattedMessage id="erp.ingredients" />
                </h4>
              </div>
              <Table
                columns={columnsIngredient}
                dataSource={techcard ? techcard.ingredients : []}
                pagination={false}
                rowKey={() => Math.random()}
                bordered
              />
              <div style={{ paddingLeft: '10px', marginTop: '10px' }}>
                <h4>
                  <FormattedMessage id="erp.semiproducts" />
                </h4>
              </div>
              <Table
                columns={columnsSubTechcard}
                dataSource={techcard ? techcard.subTechcards : []}
                pagination={false}
                rowKey={() => Math.random()}
                bordered
              />
              {techcard && techcard.proportions && (
                <>
                  <div style={{ paddingLeft: '10px', marginTop: '10px' }}>
                    <h4>
                      <FormattedMessage id="erp.Proportions" />
                    </h4>
                  </div>
                  <Table
                    columns={columnsProportions}
                    dataSource={techcard ? techcard.proportions : []}
                    pagination={false}
                    rowKey={() => Math.random()}
                    bordered
                  />
                </>
              )}
              <div style={{ float: 'right', fontSize: 18, marginTop: '10px' }}>
                <b>Total:</b> {techcard.amount * 1000} gram
              </div>
            </Col>
            <Col sm={24} md={10}>
              <center>
                <div style={{ marginTop: '10px' }}>
                  <h3>{techcard.title}</h3>
                </div>
                {user.name !== 'david' && (
                  <div style={{ marginTop: '10px' }}>
                    <Button
                      type="primary"
                      onClick={() => edit(techcard)}
                      style={{ margin: '0 5px 5px 0' }}
                    >
                      <FormattedMessage id="global.edit" />
                    </Button>
                    <Popconfirm
                      title={formatMessage({ id: 'Techcard.AreYouSureDeleteThisTechcard?' })}
                      onConfirm={async () => removeTechcard(techcard.id)}
                      okText={formatMessage({ id: 'global.yes' })}
                      cancelText={formatMessage({ id: 'global.no' })}
                    >
                      <Button type="danger">
                        <FormattedMessage id="global.delete" />
                      </Button>
                    </Popconfirm>
                  </div>
                )}

                <table style={tableStyle}>
                  <tbody>
                    <tr>
                      <th style={sharedStyle}>kCal</th>
                      <th style={sharedStyle}>
                        <FormattedMessage id="erp.prot" />
                      </th>
                      <th style={sharedStyle}>
                        <FormattedMessage id="erp.fat" />
                      </th>
                      <th style={sharedStyle}>
                        <FormattedMessage id="erp.carb" />
                      </th>
                      <th style={sharedStyle}>
                        <FormattedMessage id="erp.weightG" />
                      </th>
                    </tr>
                    <tr key="kbzhu">
                      <td style={sharedStyle}>{Math.round(techcard.nutrients.energy)}</td>
                      <td style={sharedStyle}>{Math.round(techcard.nutrients.prot)}</td>
                      <td style={sharedStyle}>{Math.round(techcard.nutrients.fat)}</td>
                      <td style={sharedStyle}>{Math.round(techcard.nutrients.carb)}</td>
                      <td style={sharedStyle}>{techcard.amount * 1000}</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ marginTop: '10px' }}>
                  {techcard.isSubTechcard && (
                    <Tag color="#87d068" key={Math.random()}>
                      <span style={{ fontSize: '14px' }}>
                        <FormattedMessage id="erp.semiproduct" />
                      </span>
                    </Tag>
                  )}
                  {techcard.tags.map(tag => (
                    <Tag color="blue" key={Math.random()}>
                      <span style={{ fontSize: '14px' }}>{tag.cz}</span>
                    </Tag>
                  ))}
                </div>
                <div style={{ marginTop: '10px' }}>
                  {techcard.tagsByIngredients.map(tag => (
                    <Tag color="orange" key={Math.random()}>
                      <span style={{ fontSize: '14px' }}>{tag}</span>
                    </Tag>
                  ))}
                </div>
              </center>
              <center>
                <div style={{ marginTop: '10px' }}>
                  <h4>
                    <FormattedMessage id="erp.technologyСooking" />
                  </h4>
                </div>
              </center>
              <div className="card" style={{ border: '1px solid #e8e8e8' }}>
                <div className="card-body">{techcard.description}</div>
              </div>
              <center>
                <div style={{ marginTop: '10px' }}>
                  <h4>{formatMessage({ id: 'Techcard.DownloadTechcard' })}</h4>
                </div>
              </center>
              <div className="card" style={{ border: '1px solid #e8e8e8' }}>
                <center>
                  <div className="card-body">
                    <InputNumber value={cf} onChange={this.changeCF} />{' '}
                    <Button onClick={this.downloadTC}>
                      {formatMessage({ id: 'Techcard.Download' })}
                    </Button>
                  </div>
                </center>
              </div>
            </Col>
          </Row>
        )}
        {!techcard.id && <Empty description={false} />}
      </div>
    )
  }
}

export default TechcardDetail
