import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Icon, Button, Select, Row, Col } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'

import { getTechcard, editTechcard } from '../../../../api/erp/techcard'
import { editTemplateMenu, getTemplateMenu, markDayAsCompleted } from '../../../../api/erp/template'
import { changeTemplateByWeekday, markAsCompleted } from '../../../../api/erp/weekTemplate'
import TechcardDetail from '../TechcardDetail'
import TemplateDetail from '../TemplateDetail'
import EditTemplateForm from '../CreateTemplate'
import CreateTechcardForm from '../CreateTechcard'

const { Option } = Select

const weekLabels = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

@injectIntl
@connect(({ user }) => ({ user }))
class Week extends React.Component {
  state = {
    selectedTechcard: '',
    selectedDay: -1,
    techcardVisible: false,
    templateVisible: false,
    editTemplateFormVisible: false,
    createTechcardFormVisible: false,
    forEdit: {},
    isEditMode: [false, false, false, false, false, false],
    dayTemplates: [],
    newDayId: '',
    techcards: [],
  }

  componentDidMount() {
    getTemplateMenu().then(async answer => {
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          dayTemplates: json,
        })
      }
    })
    getTechcard().then(async answer => {
      if (answer.status === 401) {
        const { dispatch } = this.props
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            authorized: false,
          },
        })
        return
      }
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          techcards: json,
          // loading: false,
        })
      }
    })
  }

  onChangeField(e, field) {
    if (e.target) {
      if (e.target.type === 'checkbox') {
        this.setState({
          [field]: e.target.checked,
        })
      } else {
        this.setState({
          [field]: e.target.value,
        })
      }
    } else {
      this.setState({
        [field]: e,
      })
    }
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

  showTemplate = day => {
    this.setState({
      selectedDay: day,
      templateVisible: true,
    })
  }

  onCloseTemplate = () => {
    this.setState({
      templateVisible: false,
      selectedDay: -1,
    })
  }

  editTemplateModal = forEdit => {
    this.setState({
      forEdit,
      editTemplateFormVisible: true,
    })
  }

  onCloseEditTemplateForm = () => {
    this.setState({
      editTemplateFormVisible: false,
      forEdit: {},
    })
    this.weekUpdate()
  }

  editTechcardModal = forEdit => {
    this.setState({
      forEdit,
      createTechcardFormVisible: true,
    })
  }

  onCloseCreateTechcardForm = () => {
    this.setState({
      createTechcardFormVisible: false,
      forEdit: {},
    })
  }

  onEdit = async dayNumber => {
    const { isEditMode, newDayId } = this.state
    const { week, update } = this.props

    isEditMode[dayNumber] = !isEditMode[dayNumber]
    if (!isEditMode[dayNumber]) {
      const req = await changeTemplateByWeekday({
        weekId: week.id,
        weekday: weekLabels[dayNumber],
        dayId: newDayId,
      })
      if (req.ok) {
        await update(week.id)
      }
    }
    this.setState({
      isEditMode,
    })
  }

  weekUpdate = async () => {
    const { week, update } = this.props
    await update(week.id)
  }

  markWeekAsCompleted = async () => {
    const { week } = this.props
    const req = await markAsCompleted(week.id)
    if (req.ok) {
      await this.weekUpdate()
    }
  }

  markDayAsCompleted = async id => {
    const req = await markDayAsCompleted(id)
    if (req.ok) {
      await this.weekUpdate()
    }
  }

  render() {
    const {
      week,
      settings,
      intl: { formatMessage },
    } = this.props
    const {
      selectedTechcard,
      selectedDay,
      techcardVisible,
      templateVisible,
      editTemplateFormVisible,
      createTechcardFormVisible,
      forEdit,
      isEditMode,
      dayTemplates,
      techcards,
    } = this.state

    const meals = ['Breakfast', '1 Snack', 'Lunch', '2 Snack', 'Dinner']

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
      // backgroundColor: '#FF5733',
      background:
        'linear-gradient(90deg, rgba(251,0,0,0.23573179271708689) 0%, rgba(255,0,0,0.5018382352941176) 50%, rgba(255,0,0,0.24) 100%)',
    }

    const sharedStyleYellow = {
      border: '1px solid #e8e8e8',
      borderCollapse: 'collapse',
      padding: '0.5em',
      textAlign: 'center',
      textSize: '10px',
      // backgroundColor: '#FF5733',
      background:
        'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(232,255,0,0.3113620448179272) 50%, rgba(255,255,255,1) 100%)',
    }

    const sharedStyleGreen = {
      border: '1px solid #e8e8e8',
      borderCollapse: 'collapse',
      padding: '0.5em',
      textAlign: 'center',
      textSize: '10px',
      background:
        'linear-gradient(90deg, rgba(22,251,0,0.23573179271708689) 0%, rgba(0,255,12,0.41780462184873945) 50%, rgba(22,251,0,0.24) 100%)',
    }

    const tableStyle = {
      border: '1px solid #e8e8e8',
      borderCollapse: 'collapse',
      borderRadius: '5px',
      padding: '0.5em',
      marginTop: '15px',
      display: 'inline-table',
    }

    const weekRange = week.range

    return (
      <div>
        {Boolean(week.id) && (
          <div style={{ minWidth: '100%', maxWidth: '100%' }}>
            <br />
            <Row span={16}>
              <Col md={18} sm={24}>
                <h3>
                  {week.isCompleted ? formatMessage({ id: 'Weeks.[COMPLETED]' }) : ''}&nbsp;
                  {week.title}
                </h3>
              </Col>
              <Col md={6} sm={24}>
                <Button
                  type="default"
                  onClick={this.markWeekAsCompleted}
                  size="small"
                  style={{ margin: '0 5px 5px 0', float: 'right' }}
                >
                  {week.isCompleted
                    ? formatMessage({ id: 'Weeks.UnmarkAsCompleted' })
                    : formatMessage({ id: 'Weeks.MarkAsCompleted' })}
                </Button>
              </Col>
            </Row>
            <center>
              <table style={tableStyle} width="100%">
                <tbody>
                  <tr>
                    <th style={sharedStyle}>
                      <FormattedMessage id="erp.meal" />
                    </th>
                    {[0, 1, 2, 3, 4, 5].map(dayNumber => {
                      if (isEditMode[dayNumber]) {
                        return (
                          <th key={Math.random()} style={sharedStyle}>
                            <Select
                              showSearch
                              defaultActiveFirstOption={false}
                              showArrow={false}
                              placeholder={<FormattedMessage id="erp.selectTemplate" />}
                              filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                0
                              }
                              style={{ width: '100%' }}
                              size="small"
                              defaultValue={week.days[dayNumber].template.id}
                              onChange={e => this.onChangeField(e, 'newDayId')}
                            >
                              {dayTemplates.map(temp => (
                                <Option key={temp.id} value={temp.id}>
                                  {temp.name}
                                </Option>
                              ))}
                            </Select>
                            <br />
                            <br />
                            <Button
                              type="default"
                              onClick={() => this.onEdit(dayNumber)}
                              size="small"
                              style={{ margin: '0 5px 5px 0' }}
                            >
                              {isEditMode[dayNumber] ? (
                                <FormattedMessage id="main.save" />
                              ) : (
                                <FormattedMessage id="global.edit" />
                              )}
                            </Button>
                          </th>
                        )
                      }
                      return (
                        <th style={sharedStyle}>
                          <Authorize roles={['root', 'admin']}>
                            <NavLink
                              to="#"
                              onClick={e => {
                                this.showTemplate(dayNumber)
                                e.preventDefault()
                              }}
                              style={{ textDecoration: 'underline' }}
                            >
                              {week.days[dayNumber].template.isCompleted ? (
                                <Icon type="file-done" />
                              ) : (
                                ''
                              )}
                              {` ${week.days[dayNumber].template.name}`}
                            </NavLink>
                          </Authorize>
                          <Authorize roles={['finance']}>
                            {week.days[dayNumber].template.isCompleted ? (
                              <Icon type="file-done" />
                            ) : (
                              ''
                            )}
                            {` ${week.days[dayNumber].template.name}`}
                          </Authorize>

                          {!Math.max(...isEditMode) && settings.tools && (
                            <Authorize roles={['root', 'admin']}>
                              &nbsp; &nbsp;
                              <Button
                                type="default"
                                onClick={() => this.onEdit(dayNumber)}
                                // style={{ margin: '0 5px 0 0' }}
                                size="small"
                              >
                                {isEditMode[dayNumber] ? (
                                  <FormattedMessage id="global.save" />
                                ) : (
                                  <Icon type="edit" />
                                )}
                              </Button>
                              <Button
                                type="default"
                                onClick={() =>
                                  this.markDayAsCompleted(week.days[dayNumber].template.id)
                                }
                                size="small"
                                style={{ margin: '0 5px 5px 5px' }}
                              >
                                {week.days[dayNumber].template.isCompleted
                                  ? formatMessage({ id: 'Weeks.Unmark' })
                                  : formatMessage({ id: 'Weeks.Mark' })}
                              </Button>
                            </Authorize>
                          )}
                        </th>
                      )
                    })}
                  </tr>
                  {[0, 1, 2, 3, 4].map(mealNumber => {
                    return (
                      <tr key={mealNumber}>
                        <td style={sharedStyle}>{meals[mealNumber]}</td>
                        {[0, 1, 2, 3, 4, 5].map(dayNumber => {
                          const dish = week.days[dayNumber].dishes.find(d => d.meal === mealNumber)
                          let style =
                            dish !== undefined && dish.score >= 4.2
                              ? sharedStyleGreen
                              : sharedStyleYellow
                          if (dish !== undefined && dish.score < 3.7) {
                            style = sharedStyleRed
                          }
                          if (dish === undefined || Number(dish.score) === 0) {
                            style = sharedStyle
                          }
                          if (!settings.coloredRating) {
                            style = sharedStyle
                          }
                          return (
                            <td key={Math.random()} style={style}>
                              {dish !== undefined ? (
                                <span>
                                  <NavLink
                                    to="#"
                                    onClick={e => {
                                      this.showTechcard(dish.id)
                                      e.preventDefault()
                                    }}
                                  >
                                    {dish.title}
                                  </NavLink>
                                  {Number(dish.score) !== 0 && ' '}
                                  {Number(dish.score) !== 0 && <Icon type="star" />}
                                  {Number(dish.score) !== 0 && dish.score}
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                  {(settings.showMinMaxDay || settings.showMinMaxWeek) && (
                    <tr style={{ border: 0 }}>
                      <td colSpan="7" style={{ border: 0, height: '15px' }} />
                    </tr>
                  )}

                  {settings.showMinMaxDay && (
                    <>
                      <tr key="min-max-five">
                        <td style={sharedStyle}>5 meals</td>
                        {[0, 1, 2, 3, 4, 5].map(dayNumber => {
                          const minMaxFive = week.days[dayNumber].range.five

                          return (
                            <td key={dayNumber} style={sharedStyle}>
                              <center>
                                <b>
                                  {minMaxFive.min} - {minMaxFive.max} kCal
                                </b>
                              </center>
                            </td>
                          )
                        })}
                      </tr>
                      <tr key="min-max-three">
                        <td style={sharedStyle}>{formatMessage({ id: 'Weeks.3Meals' })}</td>
                        {[0, 1, 2, 3, 4, 5].map(dayNumber => {
                          const minMaxThree = week.days[dayNumber].range.three

                          return (
                            <td key={dayNumber} style={sharedStyle}>
                              <center>
                                <b>
                                  {minMaxThree.min} - {minMaxThree.max} kCal
                                </b>
                              </center>
                            </td>
                          )
                        })}
                      </tr>
                    </>
                  )}
                  {settings.showMinMaxWeek && (
                    <>
                      <tr key="min-max-week">
                        <td style={sharedStyle}>{formatMessage({ id: 'Weeks.MinMaxWeek' })}</td>
                        <td colSpan="6">
                          <center>
                            {formatMessage({ id: 'Weeks.5Meals:SPACE' })}{' '}
                            <b>{weekRange.five.min}</b> - <b>{weekRange.five.max} kCal</b>
                          </center>
                          <center>
                            {formatMessage({ id: 'Weeks.3Meals:SPACE' })}{' '}
                            <b>{weekRange.three.min}</b> - <b>{weekRange.three.max} kCal</b>
                          </center>
                        </td>
                      </tr>
                      <tr key="jumpn">
                        <td style={sharedStyle}>{formatMessage({ id: 'Weeks.Jump' })}</td>
                        <td colSpan="6">
                          <center>
                            {formatMessage({ id: 'Weeks.5Meals:byMin-' })}{' '}
                            <b>{weekRange.five.jumpByMin} kCal</b> |{' '}
                            {formatMessage({ id: 'Weeks.byMax-SPACE' })}
                            <b>{weekRange.five.jumpByMax} kCal</b>
                          </center>
                          <center>
                            {formatMessage({ id: 'Weeks.3Meals:byMin-' })}{' '}
                            <b>{weekRange.three.jumpByMin} kCal</b> |{' '}
                            {formatMessage({ id: 'Weeks.byMax-SPACE' })}
                            <b>{weekRange.three.jumpByMax} kCal</b>
                          </center>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </center>
          </div>
        )}
        <TechcardDetail
          visible={techcardVisible}
          techcard={selectedTechcard}
          onClose={this.onCloseTechcard}
          edit={this.editTechcardModal}
        />
        <TemplateDetail
          template={selectedDay > -1 ? week?.days[selectedDay]?.template : {}}
          visible={templateVisible}
          onClose={this.onCloseTemplate}
          edit={this.editTemplateModal}
          removeTemplate={this.removeTemplate}
        />
        <EditTemplateForm
          visible={editTemplateFormVisible}
          onClose={this.onCloseEditTemplateForm}
          forEdit={editTemplateFormVisible ? forEdit : {}}
          edit={editTemplateMenu}
          update={this.props.update}
        />
        <CreateTechcardForm
          visible={createTechcardFormVisible}
          onClose={this.onCloseCreateTechcardForm}
          data={techcards}
          forEdit={createTechcardFormVisible ? forEdit : {}}
          edit={editTechcard}
          update={this.weekUpdate}
          showTechcard={this.showTechcard}
        />
      </div>
    )
  }
}

export default Week
