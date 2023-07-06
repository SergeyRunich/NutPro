/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Empty, Select, InputNumber, Row, Col, Button } from 'antd'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const { Option } = Select

@injectIntl
class DishList extends React.Component {
  state = {}

  render() {
    const {
      dishes,
      techcards,
      onChangeDish,
      deleteDish,
      getItemStyle,
      getListStyle,
      onDragEnd,
      intl: { formatMessage },
    } = this.props

    return (
      <div>
        {dishes.length !== 0 && (
          <div>
            <Row style={{ width: '100%' }} gutter={16}>
              <Col md={12} sm={24}>
                <strong style={{ marginLeft: '20px' }}>
                  {formatMessage({ id: 'DishList.Dish' })}
                </strong>
              </Col>
              <Col md={4} sm={24}>
                <strong style={{ marginLeft: '20px' }}>
                  {formatMessage({ id: 'DishList.Cf' })}
                </strong>
              </Col>
              <Col md={4} sm={24}>
                <strong style={{ marginLeft: '20px' }}>
                  {formatMessage({ id: 'DishList.Count' })}
                </strong>
              </Col>
              <Col md={4} sm={24}>
                <strong style={{ marginLeft: '20px' }}>
                  {formatMessage({ id: 'DishList.Action' })}
                </strong>
              </Col>
            </Row>
            <DragDropContext onDragEnd={onDragEnd}>
              <Row gutter={16}>
                <Col md={24} sm={24}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        {dishes.map((item, index) => (
                          <Draggable key={item.key} draggableId={item.key} index={index}>
                            {(provided_, snapshot_) => (
                              <div
                                ref={provided_.innerRef}
                                {...provided_.draggableProps}
                                {...provided_.dragHandleProps}
                                style={getItemStyle(
                                  snapshot_.isDragging,
                                  provided_.draggableProps.style,
                                )}
                              >
                                <Row style={{ width: '100%' }} gutter={16}>
                                  <Col md={12} sm={24}>
                                    <Select
                                      showSearch
                                      value={dishes[index].techcard || undefined}
                                      defaultActiveFirstOption={false}
                                      showArrow={false}
                                      placeholder={formatMessage({
                                        id: 'DishList.SelectTechcard...',
                                      })}
                                      filterOption={(input, option) =>
                                        option.props.children
                                          .toLowerCase()
                                          .indexOf(input.toLowerCase()) >= 0
                                      }
                                      style={{ width: '100%' }}
                                      // size="small"
                                      onChange={e => onChangeDish(e, 'techcard', index)}
                                    >
                                      {techcards.map(tc => (
                                        <Option key={tc.id} value={tc.id}>
                                          {tc.title}
                                        </Option>
                                      ))}
                                    </Select>
                                  </Col>
                                  <Col md={4} sm={24}>
                                    <InputNumber
                                      placeholder={formatMessage({ id: 'DishList.Coeff' })}
                                      value={item.amount}
                                      style={{ width: '100%' }}
                                      onChange={e => onChangeDish(e, 'amount', index)}
                                    />
                                  </Col>
                                  <Col md={4} sm={24}>
                                    <InputNumber
                                      placeholder={formatMessage({ id: 'DishList.Count' })}
                                      value={item.count}
                                      style={{ width: '100%' }}
                                      onChange={e => onChangeDish(e, 'count', index)}
                                    />
                                  </Col>
                                  <Col md={4} sm={24}>
                                    <Button type="danger" onClick={() => deleteDish(index)}>
                                      {formatMessage({ id: 'global.remove' })}
                                    </Button>
                                  </Col>
                                </Row>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Col>
              </Row>
            </DragDropContext>
          </div>
        )}
        {dishes.length === 0 && <Empty description={false} />}
      </div>
    )
  }
}

export default DishList
