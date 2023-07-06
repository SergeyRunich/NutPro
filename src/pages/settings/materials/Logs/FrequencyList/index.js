/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Empty, List, Select, InputNumber, Row, Col, Button } from 'antd'

const { Option } = Select

@injectIntl
class DayMeals extends React.Component {
  state = {}

  render() {
    const {
      items,
      onChangeItem,
      deleteItem,
      tags,
      intl: { formatMessage },
    } = this.props

    return (
      <div>
        {items.length !== 0 && (
          <div>
            <List
              bordered
              size={formatMessage({ id: 'Materials.small' })}
              dataSource={items}
              renderItem={(item, index) => (
                <List.Item>
                  <Row style={{ width: '100%' }} gutter={16}>
                    <Col md={8} sm={18}>
                      <Select
                        value={items[index].meal}
                        placeholder="Meal..."
                        style={{ width: '100%' }}
                        onChange={e => onChangeItem(e, 'meal', index)}
                      >
                        <Option key={0} value={0}>
                          {formatMessage({ id: 'Materials.Breakfast' })}
                        </Option>
                        <Option key={1} value={1}>
                          {formatMessage({ id: 'Materials.Snack 1' })}
                        </Option>
                        <Option key={2} value={2}>
                          {formatMessage({ id: 'Materials.Lunch' })}
                        </Option>
                        <Option key={3} value={3}>
                          {formatMessage({ id: 'Materials.Snack 2' })}
                        </Option>
                        <Option key={4} value={4}>
                          {formatMessage({ id: 'Materials.Dinner' })}
                        </Option>
                      </Select>
                    </Col>
                    <Col md={8} sm={18}>
                      <Select
                        value={items[index].tag}
                        placeholder={formatMessage({ id: 'Materials.Tag...' })}
                        style={{ width: '100%' }}
                        onChange={e => onChangeItem(e, 'tag', index)}
                      >
                        {tags.map(tag => (
                          <Option key={tag.id} value={tag.id}>
                            {tag.cz}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col md={4} sm={10}>
                      <InputNumber
                        value={item.amount}
                        style={{ width: '100%' }}
                        onChange={e => onChangeItem(e, 'amount', index)}
                      />
                    </Col>
                    <Col md={4} sm={3}>
                      <Button type="danger" onClick={() => deleteItem(index)}>
                        {formatMessage({ id: 'global.remove' })}
                      </Button>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </div>
        )}
        {items.length === 0 && <Empty description={false} />}
      </div>
    )
  }
}

export default DayMeals
