/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Table, Row, Col, Empty, Tag, Drawer } from 'antd'
import { connect } from 'react-redux'

@withRouter
@connect(({ user }) => ({ user }))
class TechcardDetail extends React.Component {
  state = {}

  render() {
    const { techcard, visible, onClose } = this.props

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
      <Drawer
        title={`Techcard: ${techcard.title}`}
        width="100%"
        height="100%"
        onClose={() => onClose()}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
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
                  bordered
                  rowKey={() => Math.random()}
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
                  bordered
                  rowKey={() => Math.random()}
                />
                <div style={{ float: 'right', fontSize: 18, marginTop: '10px' }}>
                  <b>
                    <FormattedMessage id="erp.Total:" />
                  </b>{' '}
                  {techcard.amount * 1000} gram
                </div>
              </Col>
              <Col sm={24} md={10}>
                <center>
                  <div style={{ marginTop: '10px' }}>
                    <h3>{techcard.title}</h3>
                  </div>

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
                      </tr>
                      <tr key="kbzhu">
                        <td style={sharedStyle}>{Math.round(techcard.nutrients.energy)}</td>
                        <td style={sharedStyle}>{Math.round(techcard.nutrients.prot)}</td>
                        <td style={sharedStyle}>{Math.round(techcard.nutrients.fat)}</td>
                        <td style={sharedStyle}>{Math.round(techcard.nutrients.carb)}</td>
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
              </Col>
            </Row>
          )}
          {!techcard.id && <Empty description={false} />}
        </div>
      </Drawer>
    )
  }
}

export default TechcardDetail
