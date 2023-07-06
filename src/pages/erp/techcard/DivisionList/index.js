/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Empty, List, Input, Select, InputNumber, Row, Col, Button } from 'antd'

const { Option } = Select

@injectIntl
class DivisionList extends React.Component {
  state = {}

  render() {
    const {
      proportions,
      onChangeDivision,
      deleteDivision,
      intl: { formatMessage },
    } = this.props

    return (
      <>
        {proportions.length && (
          <div>
            <List
              bordered
              size="small"
              dataSource={proportions}
              renderItem={(item, index) => (
                <List.Item>
                  <Row style={{ width: '100%' }} gutter={16}>
                    <Col md={12} sm={24}>
                      <Input
                        placeholder={formatMessage({ id: 'Techcard.Title' })}
                        value={proportions[index].title}
                        style={{ width: '100%' }}
                        onChange={e => onChangeDivision(e, 'title', index)}
                      />
                    </Col>
                    <Col md={4} sm={24}>
                      <InputNumber
                        value={proportions[index].amount}
                        style={{ width: '100%' }}
                        onChange={e => onChangeDivision(e, 'amount', index)}
                      />
                    </Col>
                    <Col md={4} sm={24}>
                      <Select
                        value={proportions[index].unit}
                        placeholder={formatMessage({ id: 'Techcard.SelectUnit' })}
                        style={{ width: '100%' }}
                        onChange={e => onChangeDivision(e, 'unit', index)}
                      >
                        <Option key="g" value="g">
                          {formatMessage({ id: 'Techcard.g' })}
                        </Option>
                        <Option key="kg" value="kg">
                          {formatMessage({ id: 'Techcard.Kg' })}
                        </Option>
                        <Option key="ml" value="ml">
                          {formatMessage({ id: 'Techcard.Ml' })}
                        </Option>
                        <Option key="l" value="l">
                          {formatMessage({ id: 'Techcard.l' })}
                        </Option>
                      </Select>
                    </Col>
                    <Col md={4} sm={24}>
                      <Button type="danger" onClick={() => deleteDivision(index)}>
                        {formatMessage({ id: 'global.remove' })}
                      </Button>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </div>
        )}
        {!proportions.length && <Empty description={false} />}
      </>
    )
  }
}

export default DivisionList
