/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import lodash from 'lodash'
import { Empty, Select, InputNumber, Row, Col, Button, Checkbox, Input, Tooltip } from 'antd'
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
      onChangeAlways,
      onDragEnd,
      always,
      isB2B,
      kcalSettings,
      intl: { formatMessage },
    } = this.props

    return (
      <div>
        {dishes.length !== 0 && (
          <div>
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
                        {dishes.map((item, index) => {
                          const kcal = Math.round(item.basicKcal * item.amount)
                          const meal = item.meal === 10 ? 4 : item.meal
                          const settings = lodash.find(kcalSettings, { meal })
                          return (
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
                                    <Col md={8} sm={24}>
                                      <Select
                                        showSearch
                                        value={dishes[index].techcard || undefined}
                                        defaultActiveFirstOption={false}
                                        showArrow={false}
                                        placeholder="Select techcard..."
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
                                    <Col md={2} sm={24}>
                                      <InputNumber
                                        placeholder={formatMessage({ id: 'DishList.Coeff' })}
                                        value={item.amount}
                                        style={{ width: '100%' }}
                                        onChange={e => onChangeDish(e, 'amount', index)}
                                      />
                                    </Col>
                                    <Col md={2} sm={24}>
                                      <Tooltip
                                        title={`${settings.min.kcal}kcal - ${settings.max.kcal}kcal`}
                                      >
                                        <Input
                                          placeholder="kcal"
                                          value={`${kcal} kcal`}
                                          style={{
                                            width: '100%',
                                            background: `${
                                              kcal < settings.min.kcal || kcal > settings.max.kcal
                                                ? '#eb4949'
                                                : '#FFF'
                                            }`,
                                            color: '#000',
                                          }}
                                          contentEditable={false}
                                        />
                                      </Tooltip>
                                    </Col>
                                    <Col md={4} sm={24}>
                                      <Select
                                        value={item.meal}
                                        placeholder="Meal"
                                        style={{ width: '100%' }}
                                        // size="small"
                                        onChange={e => onChangeDish(e, 'meal', index)}
                                      >
                                        <Option key={0} value={0}>
                                          {formatMessage({ id: 'DishList.Breakfast' })}
                                        </Option>
                                        <Option key={1} value={1}>
                                          {formatMessage({ id: 'DishList.1Snack' })}
                                        </Option>
                                        <Option key={2} value={2}>
                                          {formatMessage({ id: 'DishList.Lunch' })}
                                        </Option>
                                        <Option key={3} value={3}>
                                          {formatMessage({ id: 'DishList.2Snack' })}
                                        </Option>
                                        <Option key={4} value={4}>
                                          {formatMessage({ id: 'DishList.Dinner' })}
                                        </Option>
                                        <Option key={5} value={5}>
                                          {formatMessage({ id: 'DishList.2Dinner' })}
                                        </Option>
                                        <Option key={10} value={10}>
                                          {formatMessage({ id: 'DishList.Salad' })}
                                        </Option>
                                      </Select>
                                    </Col>
                                    <Col md={4} sm={24}>
                                      {item.meal < 10 && (
                                        <InputNumber
                                          placeholder={formatMessage({ id: 'DishList.Group' })}
                                          value={item.group}
                                          style={{ width: '100%' }}
                                          onChange={e => onChangeDish(e, 'group', index)}
                                        />
                                      )}
                                      {item.meal >= 10 && (
                                        <Select
                                          value={item.group}
                                          placeholder={formatMessage({ id: 'DishList.Meal' })}
                                          style={{ width: '100%' }}
                                          // size="small"
                                          onChange={e => onChangeDish(e, 'group', index)}
                                        >
                                          <Option key={0} value={0}>
                                            {formatMessage({ id: 'DishList.Breakfast' })}
                                          </Option>
                                          <Option key={1} value={1}>
                                            {formatMessage({ id: 'DishList.1Snack' })}
                                          </Option>
                                          <Option key={2} value={2}>
                                            {formatMessage({ id: 'DishList.Lunch' })}
                                          </Option>
                                          <Option key={3} value={3}>
                                            {formatMessage({ id: 'DishList.2Snack' })}
                                          </Option>
                                          <Option key={4} value={4}>
                                            {formatMessage({ id: 'DishList.Dinner' })}
                                          </Option>
                                        </Select>
                                      )}
                                    </Col>
                                    {!isB2B && (
                                      <Col md={2} sm={24}>
                                        <Checkbox
                                          disabled={
                                            always.length >= 2 && always.indexOf(item.group) === -1
                                          }
                                          value={always.indexOf(item.group) !== -1}
                                          checked={always.indexOf(item.group) !== -1}
                                          onChange={e => onChangeAlways(e, item.group, index)}
                                        >
                                          {formatMessage({ id: 'DishList.Always' })}
                                        </Checkbox>
                                      </Col>
                                    )}
                                    <Col md={2} sm={24}>
                                      <Button type="danger" onClick={() => deleteDish(index)}>
                                        {formatMessage({ id: 'global.remove' })}
                                      </Button>
                                    </Col>
                                  </Row>
                                </div>
                              )}
                            </Draggable>
                          )
                        })}
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
