import React, { useEffect } from 'react'
import { Calendar as CalendarAnt, Col, Row, Icon, Typography } from 'antd'
import classNames from 'classnames'
import moment from 'moment'
import styles from './style.module.scss'

const { Title } = Typography

const Calendar = ({
  isFullscreen = false,
  highlightedDays,
  onSelectChange,
  onDisableDate,
  startPause,
  endPause,
  isActive = false,
}) => {
  const headerRender = e => {
    const current = e.value.clone()
    const localeData = e.value.localeData()
    const months = []
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 12; i++) {
      current.month(i)
      months.push(localeData.monthsShort(current))
    }

    const month = e.value.month()
    const year = e.value.year()

    const leftHandler = () => {
      const newValue = moment(e.value.clone()).subtract(1, 'M')
      e.onChange(newValue)
    }

    const rightHandler = () => {
      const newValue = moment(e.value.clone()).add(1, 'M')
      e.onChange(newValue)
    }

    return (
      <div className="ant-calendar-header px-3" style={{ borderBottom: 'none' }}>
        <Row type="flex" justify="space-between">
          <Col>
            <Icon type="left" className={styles.arrow} onClick={leftHandler} />
          </Col>
          <Col className="d-flex align-items-center">
            <Title level={4} className="m-0">
              {months[month]} {year}
            </Title>
          </Col>
          <Col>
            <Icon type="right" className={styles.arrow} onClick={rightHandler} />
          </Col>
        </Row>
      </div>
    )
  }

  const dateFullCellRender = current => {
    const formattedCurrent = current.format('DD-MM-YYYY')
    const formattedStartPause = startPause ? startPause.format('DD-MM-YYYY') : ''
    const formattedEndPause = endPause ? endPause.format('DD-MM-YYYY') : ''
    const today = moment().format('DD-MM-YYYY')
    let style = {
      lineHeight: '24px',
      width: '24px',
      height: '24px',
      borderRadius: '2px',
      fontWeight: formattedCurrent === today ? 'bold' : 'normal',
      cursor: isActive ? 'pointer' : 'default',
    }

    const isHighlighted =
      Array.isArray(highlightedDays) &&
      highlightedDays.length > 0 &&
      highlightedDays.includes(formattedCurrent)

    if (formattedCurrent === formattedStartPause) {
      style = {
        ...style,
        background: '#3dcc4a',
        color: 'green',
      }
    }

    if (formattedCurrent === formattedEndPause) {
      style = {
        ...style,
        background: '#1890ff',
        color: '#fff',
      }
    }

    return (
      <div
        className={classNames({
          'ant-calendar-date': isActive,
          'ant-calendar-custom-cell': !isActive,
        })}
      >
        <div
          style={style}
          className={classNames({
            'ant-fullcalendar-value': isActive,
            'ant-calendar-custom-cell-value': isHighlighted,
          })}
        >
          {current.date()}
        </div>
      </div>
    )
  }

  useEffect(() => {
    const selectedDay = document.querySelector('.ant-fullcalendar-selected-day')
    if (selectedDay) {
      selectedDay.classList.remove('ant-fullcalendar-selected-day')
    }
    if (endPause) {
      selectedDay.classList.remove('ant-fullcalendar-selected-day')
    }
  }, [endPause])

  return (
    <div className={styles.calendar_container}>
      <CalendarAnt
        fullscreen={isFullscreen}
        headerRender={headerRender}
        onSelect={onSelectChange}
        disabledDate={onDisableDate}
        dateFullCellRender={dateFullCellRender}
      />
    </div>
  )
}

export default Calendar
