import React from 'react'
import { injectIntl } from 'react-intl'
import { Col, Row, Select, InputNumber, Checkbox } from 'antd'

const { Option } = Select

@injectIntl
class CustomMenu extends React.Component {
  render() {
    const {
      customMenu,
      onChangeCustomMenu,
      intl: { formatMessage },
    } = this.props

    return (
      <div>
        {customMenu.isActive && (
          <>
            <Row gutter={16} className="mt-3">
              <Col md={4} sm={24}>
                <strong>{formatMessage({ id: 'Orders.Meal' })}</strong>
              </Col>
              <Col md={4} sm={24}>
                <Checkbox
                  checked={customMenu.meals[0]}
                  onChange={e => onChangeCustomMenu(e, 'meals', 0)}
                >
                  {formatMessage({ id: 'Orders.Breakfast' })}
                </Checkbox>
              </Col>
              <Col md={4} sm={24}>
                <Checkbox
                  checked={customMenu.meals[1]}
                  onChange={e => onChangeCustomMenu(e, 'meals', 1)}
                >
                  {formatMessage({ id: 'Orders.1Snack' })}
                </Checkbox>
              </Col>
              <Col md={4} sm={24}>
                <Checkbox
                  checked={customMenu.meals[2]}
                  onChange={e => onChangeCustomMenu(e, 'meals', 2)}
                >
                  {formatMessage({ id: 'Orders.Lunch' })}
                </Checkbox>
              </Col>
              <Col md={4} sm={24}>
                <Checkbox
                  checked={customMenu.meals[3]}
                  onChange={e => onChangeCustomMenu(e, 'meals', 3)}
                >
                  {formatMessage({ id: 'Orders.2Snack' })}
                </Checkbox>
              </Col>
              <Col md={4} sm={24}>
                <Checkbox
                  checked={customMenu.meals[4]}
                  onChange={e => onChangeCustomMenu(e, 'meals', 4)}
                >
                  {formatMessage({ id: 'Orders.Dinner' })}
                </Checkbox>
              </Col>
            </Row>
            <Row gutter={16} className="mt-3">
              <Col md={4} sm={24}>
                <strong>{formatMessage({ id: 'Orders.Size' })}</strong>
              </Col>
              {[0, 1, 2, 3, 4].map(col => (
                <Col key={col} md={4} sm={24}>
                  <Select
                    placeholder={formatMessage({ id: 'Orders.Cf' })}
                    disabled={!customMenu.meals[col]}
                    value={customMenu.cf[col]}
                    onChange={e => onChangeCustomMenu(e, 'cf', col)}
                  >
                    <Option key="c0" value={0}>
                      {formatMessage({ id: 'Orders.Auto(algo)' })}
                    </Option>
                    <Option key="c1" value={1}>
                      1
                    </Option>
                    <Option key="c2" value={1.5}>
                      1.5
                    </Option>
                    <Option key="c3" value={2}>
                      2
                    </Option>
                  </Select>
                </Col>
              ))}
            </Row>
            <Row gutter={16} className="mt-3">
              <Col md={4} sm={24}>
                <strong>{formatMessage({ id: 'Orders.Number' })}</strong>
              </Col>
              {[0, 1, 2, 3, 4].map(col => (
                <Col key={col} md={4} sm={24}>
                  <InputNumber
                    min={1}
                    max={100}
                    disabled={!customMenu.meals[col]}
                    placeholder={formatMessage({ id: 'Orders.Count' })}
                    value={customMenu.count[col]}
                    onChange={e => onChangeCustomMenu(e, 'count', col)}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
    )
  }
}

export default CustomMenu
