import React, { useState, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import Authorize from 'components/LayoutComponents/Authorize'
import { useIntl } from 'react-intl'

import {
  Button,
  notification,
  Select,
  Spin,
  Row,
  Col,
  Radio,
  Popconfirm,
  DatePicker,
  Switch,
} from 'antd'

import {
  getCalendarMenu,
  createCalendarMenu,
  editCalendarMenu,
  deleteCalendarMenu,
  setWeekMenu,
} from '../../../api/erp/calendar'
import { getTemplateMenu } from '../../../api/erp/template'
import { getWeekTemplate } from '../../../api/erp/weekTemplate'
import TemplateDetail from './TemplateDetail'
import Calendar from '../../../components/NutritionPRO/Calendar'

moment.updateLocale('en', {
  week: { dow: 1 },
})

const { Option } = Select
const { WeekPicker } = DatePicker

const CalendarMenu = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [classMenu, setClassMenu] = useState('Normal')
  const [days, setDays] = useState([])
  const [timestamp, setTimestamp] = useState(0)
  const [isEditMode, setIsEditMode] = useState(false)
  const [calendarTemplate, setCalendarTemplate] = useState('')
  const [dayView, setDayView] = useState('')
  const [templates, setTemplates] = useState([])
  const [weekDate, setWeekDate] = useState(0)
  const [weekTemplate, setWeekTemplate] = useState('')
  const [weekTemplates, setWeekTemplates] = useState([])
  const [isWeekMode, setIsWeekMode] = useState(false)

  const dispatch = useDispatch()
  const intl = useIntl()

  const fetchTemplateMenu = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await getTemplateMenu()
      const json = await res.json()
      setTemplates(json)
    } catch (e) {
      notification.error({
        message: intl.formatMessage({ id: 'global.error' }),
        description: 'Template Menu not found',
        placement: 'topRight',
      })
    }
  }, [intl])

  const fetchWeekTemplate = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await getWeekTemplate()
      const json = await res.json()
      setWeekTemplates(json.length ? json : [json])
    } catch (e) {
      notification.error({
        message: intl.formatMessage({ id: 'global.error' }),
        description: 'Week Template not found',
        placement: 'topRight',
      })
    }
  }, [intl])

  const onChangeTimestamp = async date => {
    setTimestamp(moment.utc(date.format('DD.MM.YYYY'), 'DD.MM.YYYY').unix())
  }

  const onSend = async () => {
    if (isEditMode) {
      const req = await editCalendarMenu(dayView.id, {
        timestamp,
        template: calendarTemplate,
        class: classMenu,
      })
      if (req.status === 200) {
        notification.success({
          message: intl.formatMessage({ id: 'CalendarMenu.Saved' }),
          description: intl.formatMessage({ id: 'CalendarMenu.DaySuccessfullySaved!' }),
        })
        await loadDay(dayView.id)
      }
    } else {
      const req = await createCalendarMenu({
        timestamp,
        template: calendarTemplate,
        class: classMenu,
      })
      if (req.status === 201) {
        notification.success({
          message: intl.formatMessage({ id: 'CalendarMenu.Saved' }),
          description: intl.formatMessage({ id: 'CalendarMenu.DaySuccessfullySaved!' }),
        })
        const json = await req.json()
        await loadDay(json.id)
      }
    }
    await updateCalendar()
    setIsEditMode(false)
    setCalendarTemplate('')
  }

  const onSetWeek = async () => {
    const req = await setWeekMenu({
      timestamp: weekDate,
      template: weekTemplate,
      class: classMenu,
    })
    if (req.status === 201) {
      notification.success({
        message: intl.formatMessage({ id: 'CalendarMenu.Saved' }),
        description: intl.formatMessage({ id: 'CalendarMenu.templateSuccessfullySaved!' }),
      })
      await updateCalendar()
      setIsEditMode(false)
      setCalendarTemplate('')
      setWeekDate(0)
      setWeekTemplate('')
    }
  }

  const onChangeWeekMode = checked => {
    setIsWeekMode(checked)
    setCalendarTemplate('')
    setIsEditMode(false)
    setDayView('')
    setTimestamp(0)
    if (!checked) {
      setWeekDate(0)
      setWeekTemplate('')
    }
  }

  const onSelectTemplate = id => {
    setCalendarTemplate(id)
  }

  const onSelectWeekTemplate = id => {
    setWeekTemplate(id)
  }

  const onSelectWeek = date => {
    if (date) {
      const computedTimestamp = moment
        .utc(date.startOf('isoWeek').format('DD.MM.YYYY'), 'DD.MM.YYYY')
        .unix()
      setWeekDate(computedTimestamp)
      setCalendarTemplate('')
      setIsEditMode(false)
      setDayView('')
      setTimestamp(0)
    }
  }

  const onChangeClass = async menu => {
    try {
      setIsLoading(true)
      setDays([])
      setCalendarTemplate('')
      setIsEditMode(false)
      setDayView('')
      setTimestamp(0)
      setClassMenu(menu.target.value)

      await updateCalendar()
    } catch (e) {
      notification.error({
        message: intl.formatMessage({ id: 'global.error' }),
        description: 'Class not found',
        placement: 'topRight',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadDay = useCallback(
    async id => {
      const log = await getCalendarMenu(classMenu, id)
      const json = await log.json()
      if (json) {
        setDayView(json)
        setCalendarTemplate(json.template.id)
        setWeekDate(0)
        setWeekTemplate('')
        setIsWeekMode(false)
      }
    },
    [classMenu],
  )

  const onChangeSelectedDay = useCallback(async () => {
    const selected = days.find(d => d.timestamp === timestamp)
    if (selected) {
      setIsLoading(true)
      await loadDay(selected.id)
    } else {
      setDayView('')
      setIsEditMode(false)
      setCalendarTemplate('')
      setWeekDate(0)
      setWeekTemplate('')
      setIsWeekMode(false)
    }
  }, [days, loadDay, timestamp])

  const remove = async () => {
    const del = await deleteCalendarMenu(dayView.id)
    if (del.status === 204) {
      notification.success({
        message: intl.formatMessage({ id: 'CalendarMenu.Removed' }),
        description: intl.formatMessage({ id: 'CalendarMenu.DaySuccessfullyRemoved!' }),
        placement: 'topRight',
      })
      await updateCalendar()
      setTimestamp(0)
      setIsEditMode(false)
      setCalendarTemplate('')
      setDayView('')
    } else {
      notification.error({
        message: intl.formatMessage({ id: 'global.error' }),
        description: del.statusText,
        placement: 'topRight',
      })
    }
  }

  const onCancelEdit = () => {
    setIsEditMode(false)
    setCalendarTemplate('')
  }

  const edit = async () => {
    setIsEditMode(true)
    setTimestamp(dayView.timestamp)
    setCalendarTemplate(dayView.template.id)
  }

  const updateCalendar = useCallback(async () => {
    try {
      setIsLoading(true)
      setDays([])
      const res = await getCalendarMenu(classMenu)
      if (res.status === 401) {
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            authorized: false,
          },
        })
        return
      }
      const json = await res.json()
      const computedDays = json.map(day => ({ timestamp: day.timestamp, id: day.id }))
      setDays(computedDays)
    } catch (e) {
      notification.error({
        message: intl.formatMessage({ id: 'global.error' }),
        description: 'Calendar not found',
        placement: 'topRight',
      })
    }
  }, [classMenu, dispatch, intl])

  const onDisableDate = currentDay => {
    return currentDay && currentDay.weekday() === 6
  }

  const daysForWeekPicker = days.map(day => moment.unix(day.timestamp).format('DD-MM-YYYY'))
  const dateRender = current => {
    const style = {}
    if (daysForWeekPicker.indexOf(current.format('DD-MM-YYYY')) !== -1) {
      style.border = '1px solid #1890ff'
      style.borderRadius = '50%'
    }
    return (
      <div className="ant-picker-cell-inner" style={style}>
        {current.date()}
      </div>
    )
  }

  const highlightedDays = days.map(day => moment.unix(day.timestamp).format('DD-MM-YYYY'))

  useEffect(() => {
    document.title = 'Calendar menu'
    fetchTemplateMenu().finally(() => setIsLoading(false))
    fetchWeekTemplate().finally(() => setIsLoading(false))
    updateCalendar().finally(() => setIsLoading(false))
  }, [fetchTemplateMenu, fetchWeekTemplate, updateCalendar])

  useEffect(() => {
    onChangeSelectedDay().finally(() => setIsLoading(false))
  }, [onChangeSelectedDay])

  return (
    <Authorize roles={['root', 'admin']} redirect to="/main">
      <div>
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>{intl.formatMessage({ id: 'erp.menuCalendar' })}</strong>
            </div>
          </div>
          <div className="card-body">
            <Row gutter={16}>
              <Col md={12} sm={24}>
                <center>
                  <Radio.Group
                    value={classMenu}
                    style={{ marginBottom: 16 }}
                    onChange={onChangeClass}
                  >
                    <Radio.Button value="Normal">Normal</Radio.Button>
                    <Radio.Button value="B2B">B2B</Radio.Button>
                  </Radio.Group>
                  <Switch
                    onChange={onChangeWeekMode}
                    checked={isWeekMode}
                    style={{ margin: '0 5px' }}
                  />
                  {intl.formatMessage({ id: 'CalendarMenu.WeekMode' })}
                </center>
                <Row gutter={16}>
                  <Col md={24} sm={24} className="mb-4">
                    <Spin spinning={isLoading || days.length === 0}>
                      <Calendar
                        highlightedDays={highlightedDays}
                        onSelectChange={onChangeTimestamp}
                        onDisableDate={onDisableDate}
                        isActive
                      />
                    </Spin>
                  </Col>
                  <Col md={24} sm={24}>
                    <center>
                      {isWeekMode && (
                        <WeekPicker
                          format="w \w\e\e\k - YYYY"
                          dateRender={dateRender}
                          onChange={onSelectWeek}
                        />
                      )}
                    </center>
                    {weekDate !== 0 && isWeekMode && (
                      <Select
                        showSearch
                        value={weekTemplate || undefined}
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        placeholder="Search..."
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: '100%', margin: '15px 0 15px 0' }}
                        onChange={onSelectWeekTemplate}
                      >
                        {weekTemplates.map(temp => (
                          <Option key={temp.id} value={temp.id}>
                            {temp.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                    <center>
                      {weekDate !== 0 && (
                        <Button
                          type="primary"
                          onClick={onSetWeek}
                          style={{ margin: '0 5px 5px 0' }}
                          disabled={!weekTemplate}
                        >
                          {intl.formatMessage({ id: 'global.save' })}
                        </Button>
                      )}
                    </center>
                    {((timestamp !== 0 && Boolean(!dayView)) || isEditMode) && (
                      <Select
                        showSearch
                        value={calendarTemplate || undefined}
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        placeholder="Search..."
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: '100%', margin: '0 0 15px 0' }}
                        onChange={onSelectTemplate}
                      >
                        {templates.map(temp => {
                          if (classMenu === 'B2B' && !temp.isB2B) return
                          return (
                            <Option key={temp.id} value={temp.id}>
                              {temp.name}
                            </Option>
                          )
                        })}
                      </Select>
                    )}
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                      {dayView && !isEditMode && (
                        <Button type="primary" onClick={edit} style={{ margin: '0 5px 5px 0' }}>
                          {intl.formatMessage({ id: 'global.edit' })}
                        </Button>
                      )}
                      {((timestamp !== 0 && Boolean(!dayView)) || isEditMode) && (
                        <Button
                          type="primary"
                          onClick={onSend}
                          style={{ margin: '0 5px 5px 0' }}
                          disabled={!calendarTemplate}
                        >
                          {intl.formatMessage({ id: 'global.save' })}
                        </Button>
                      )}
                      {isEditMode && (
                        <Button
                          type="default"
                          onClick={onCancelEdit}
                          style={{ margin: '0 5px 5px 0' }}
                        >
                          {intl.formatMessage({ id: 'global.cancel' })}
                        </Button>
                      )}
                      {dayView && !isEditMode && (
                        <Popconfirm
                          title="Are you sure delete this day?"
                          onConfirm={remove}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type="danger">
                            {intl.formatMessage({ id: 'global.remove' })}
                          </Button>
                        </Popconfirm>
                      )}
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col md={12} sm={24}>
                <TemplateDetail day={dayView} />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Authorize>
  )
}

export default CalendarMenu
