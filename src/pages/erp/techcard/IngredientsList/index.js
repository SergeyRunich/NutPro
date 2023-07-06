/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Empty, List, Select, InputNumber, Row, Col, Button } from 'antd'

const { Option } = Select

@injectIntl
class IngredientsList extends React.Component {
  state = {}

  render() {
    const {
      ingredients,
      allIngredients,
      onChangeIngredient,
      deleteIngredient,
      intl: { formatMessage },
    } = this.props

    return (
      <div>
        {ingredients.length !== 0 && (
          <div>
            <List
              bordered
              size="small"
              dataSource={ingredients}
              renderItem={(item, index) => (
                <List.Item>
                  <Row style={{ width: '100%' }} gutter={16}>
                    <Col md={16} sm={24}>
                      <Select
                        showSearch
                        value={ingredients[index].id}
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        placeholder={formatMessage({ id: 'Techcard.SelectIngredient' })}
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: '100%' }}
                        onChange={e => onChangeIngredient(e, 'id', index)}
                      >
                        {allIngredients.map(ing => (
                          <Option key={ing.id} value={ing.id}>
                            {ing.name}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col md={4} sm={24}>
                      <InputNumber
                        value={item.amount}
                        style={{ width: '100%' }}
                        onChange={e => onChangeIngredient(e, 'amount', index)}
                      />
                    </Col>
                    <Col md={4} sm={24}>
                      <Button type="danger" onClick={() => deleteIngredient(index)}>
                        {formatMessage({ id: 'global.remove' })}
                      </Button>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </div>
        )}
        {ingredients.length === 0 && <Empty description={false} />}
      </div>
    )
  }
}

export default IngredientsList
