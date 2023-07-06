/* eslint-disable no-underscore-dangle */
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Col, Row, Divider, Empty } from 'antd'

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
  borderRadius: '10px',
  padding: '0.5em',
  textAlign: 'center',
  textSize: '10px',
  color: 'red',
}

const tableStyle = {
  border: '1px solid #e8e8e8',
  borderCollapse: 'collapse',
  borderRadius: '5px',
  padding: '0.5em',
  marginTop: '15px',
  display: 'inline-table',
}

const boxesList = [
  { type: 'type1', title: 'Dvoudílná 40mm' },
  { type: 'type2', title: 'Dvoudílná 50mm' },
  { type: 'type3', title: 'Dvoudílná 60mm' },
  { type: 'type4', title: 'Jednodílná 40mm' },
  { type: 'type5', title: 'Jednodílná 50mm' },
  { type: 'type6', title: 'Jednodílná 60mm' },
  { type: 'type7', title: 'Polevková zatavovací malá' },
  { type: 'type8', title: 'Polevková zatavovací velká' },
  { type: 'type9', title: 'Uzavírací krabička malá' },
  { type: 'type10', title: 'Uzavírací krabička velká' },
]

const meals = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner']

function getStyle(errors = [], material = '', { weekday = '', meal = '', type = '' }) {
  for (let i = 0; i < errors.length; i += 1) {
    if (material === errors[i].material) {
      if (material === 'stickers' && weekday === errors[i].weekday && meal === errors[i].meal) {
        return sharedStyleRed
      }
      if (material === 'boxes' && type === errors[i].type) {
        return sharedStyleRed
      }
      if (material === 'packages' && type === errors[i].type) {
        return sharedStyleRed
      }
      if (material === 'menu') {
        return sharedStyleRed
      }
    }
  }
  return sharedStyle
}

@injectIntl
class MaterialStats extends React.Component {
  state = {}

  render() {
    const {
      stickers,
      boxes,
      packages,
      menu,
      errors,
      intl: { formatMessage },
    } = this.props
    return (
      <div>
        {!stickers && !boxes && !packages && !menu && <Empty />}
        <Row gutter={16}>
          {stickers && (
            <Col md={10} sm={24}>
              <Divider orientation="center">{formatMessage({ id: 'Materials.Stickers' })}</Divider>
              <center>
                <table style={tableStyle}>
                  <tbody>
                    <tr>
                      <th style={sharedStyle}>-/-</th>
                      <th style={sharedStyle}>
                        <FormattedMessage id="main.monday" />
                      </th>
                      <th style={sharedStyle}>
                        <FormattedMessage id="main.tuesday" />
                      </th>
                      <th style={sharedStyle}>
                        <FormattedMessage id="main.wednesday" />
                      </th>
                      <th style={sharedStyle}>
                        <FormattedMessage id="main.thursday" />
                      </th>
                      <th style={sharedStyle}>
                        <FormattedMessage id="main.friday" />
                      </th>
                      <th style={sharedStyle}>
                        <FormattedMessage id="main.saturday" />
                      </th>
                    </tr>

                    {meals.map(meal => (
                      <tr key={Math.random()}>
                        <th style={sharedStyle}>{meal}</th>
                        <td
                          style={getStyle(errors, formatMessage({ id: 'Materials.stickers' }), {
                            weekday: formatMessage({ id: 'Materials.monday' }),
                            meal,
                          })}
                        >
                          {stickers.monday[meal]}
                        </td>
                        <td
                          style={getStyle(errors, formatMessage({ id: 'Materials.stickers' }), {
                            weekday: formatMessage({ id: 'Materials.tuesday' }),
                            meal,
                          })}
                        >
                          {stickers.tuesday[meal]}
                        </td>
                        <td
                          style={getStyle(errors, formatMessage({ id: 'Materials.stickers' }), {
                            weekday: formatMessage({ id: 'Materials.wednesday' }),
                            meal,
                          })}
                        >
                          {stickers.wednesday[meal]}
                        </td>
                        <td
                          style={getStyle(errors, formatMessage({ id: 'Materials.stickers' }), {
                            weekday: formatMessage({ id: 'Materials.thursday' }),
                            meal,
                          })}
                        >
                          {stickers.thursday[meal]}
                        </td>
                        <td
                          style={getStyle(errors, formatMessage({ id: 'Materials.stickers' }), {
                            weekday: formatMessage({ id: 'Materials.friday' }),
                            meal,
                          })}
                        >
                          {stickers.friday[meal]}
                        </td>
                        <td
                          style={getStyle(errors, formatMessage({ id: 'Materials.stickers' }), {
                            weekday: formatMessage({ id: 'Materials.saturday' }),
                            meal,
                          })}
                        >
                          {stickers.saturday[meal]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </center>
            </Col>
          )}

          {boxes && (
            <Col md={6} sm={24}>
              <Divider orientation="center">{formatMessage({ id: 'Materials.Boxes' })}</Divider>
              <center>
                <table style={tableStyle}>
                  <tbody>
                    <tr>
                      <th style={sharedStyle}>{formatMessage({ id: 'Materials.Box' })}</th>
                      <th style={sharedStyle}>{formatMessage({ id: 'Materials.Value' })}</th>
                    </tr>

                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(index => (
                      <tr key={index}>
                        <th style={sharedStyle}>{boxesList[index].title}</th>
                        <td style={getStyle(errors, 'boxes', { type: `type${index + 1}` })}>
                          {boxes[`type${index + 1}`]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </center>
            </Col>
          )}

          {packages && (
            <Col md={6} sm={24}>
              <Divider orientation="center">
                {formatMessage({ id: 'Materials.Menu / Packages' })}
              </Divider>
              <center>
                <table style={tableStyle}>
                  <tbody>
                    <tr>
                      <th style={sharedStyle}>{formatMessage({ id: 'Materials.Menu' })}</th>
                      <th style={sharedStyle}>
                        {formatMessage({ id: 'Materials.Package Small' })}
                      </th>
                      <th style={sharedStyle}>{formatMessage({ id: 'Materials.Package Big' })}</th>
                    </tr>

                    <tr key={Math.random()}>
                      <td style={getStyle(errors, 'menu', {})}>{menu}</td>
                      <td style={getStyle(errors, 'packages', { type: 'type1' })}>
                        {packages.type1}
                      </td>
                      <td style={getStyle(errors, 'packages', { type: 'type2' })}>
                        {packages.type2}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </center>
            </Col>
          )}
        </Row>
      </div>
    )
  }
}

export default MaterialStats
