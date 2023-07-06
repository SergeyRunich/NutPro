/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import { Button, notification, Select, Tabs, Spin, DatePicker } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { getTemplateMenu, editTemplateMenu, deleteTemplateMenu } from '../../../api/erp/template'

import { getWeeklyCalendar } from '../../../api/erp/calendar'

import TemplateDetail from './TemplateDetail'
import Week from './week'

moment.updateLocale('en', {
  week: { dow: 1 },
})

const { Option } = Select
const { WeekPicker } = DatePicker
const { TabPane } = Tabs

@injectIntl
@withRouter
@connect(({ user }) => ({ user }))
class TemplateMenu extends React.Component {
  state = {
    data: [],
    // loading: true,
    createTemplateFormVisible: false,
    forEdit: {},
    selected: {
      id: '',
    },
    weeks: [],
  }

  componentWillMount() {
    getTemplateMenu().then(async answer => {
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
          data: json,
          // loading: false,
        })
      }
    })
  }

  onCloseCreateTemplateForm = () => {
    this.setState({
      createTemplateFormVisible: false,
      forEdit: {},
    })
  }

  async onDownloadMenu() {
    const { weekDate } = this.state
    const {
      intl: { formatMessage },
    } = this.props
    const req = await getWeeklyCalendar(weekDate)
    if (req.status === 401) {
      const { dispatch } = this.props
      dispatch({
        type: 'user/SET_STATE',
        payload: {
          authorized: false,
        },
      })
      return
    }
    if (req.status === 200) {
      const json = await req.json()
      this.setState({
        weeks: json,
        // loading: false,
      })
      notification.success({
        message: formatMessage({ id: 'global.success' }),
        description: formatMessage({ id: 'TemplateMenu.WeeksLoaded!' }),
      })
    }
    if (req.status === 404) {
      notification.warning({
        message: formatMessage({ id: 'TemplateMenu.TheCalendarIsNotFilledIn' }),
        description: formatMessage({
          id: 'TemplateMenu.TheCalendarForTheSelectedWeeksIsNotFilledIn',
        }),
      })
    }
  }

  selectWeek = date => {
    if (date) {
      const timestamp = moment
        .utc(date.startOf('isoWeek').format('DD.MM.YYYY'), 'DD.MM.YYYY')
        .unix()
      this.setState({
        weekDate: timestamp,
      })
    }
  }

  render() {
    const { data, createTemplateFormVisible, forEdit, selected, weeks } = this.state
    const {
      // eslint-disable-next-line no-unused-vars
      user,
      intl: { formatMessage },
    } = this.props

    return (
      <Authorize roles={['root', 'admin']} redirect to="/main">
        <Helmet title="Weekly calendar" />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>{formatMessage({ id: 'TemplateMenu.WeeklyCalendar' })}</strong>
            </div>
          </div>
          <div className="card-body">
            <WeekPicker
              format="w \w\e\e\k - YYYY"
              placeholder={formatMessage({ id: 'TemplateMenu.SelectFirstWeek(anyDayInWeek)' })}
              onChange={this.selectWeek}
              style={{ width: 250 }}
            />

            <Button
              type="primary"
              style={{ marginLeft: '15px' }}
              onClick={async () => this.onDownloadMenu()}
            >
              {formatMessage({ id: 'TemplateMenu.Load' })}
            </Button>
            {weeks.map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Week key={i} week={weeks[i]} />
            ))}
          </div>
        </div>
      </Authorize>
    )
  }
}

export default TemplateMenu
