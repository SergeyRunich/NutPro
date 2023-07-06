import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import { Button, notification, Select, DatePicker, Checkbox } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { getWeekTemplate, getExpandedWeekTemplate } from '../../../api/erp/weekTemplate'

import Week from './week'

moment.updateLocale('en', {
  week: { dow: 1 },
})

const { Option } = Select
const { RangePicker } = DatePicker

@injectIntl
@withRouter
@connect(({ user }) => ({ user }))
class TemplateMenu extends React.Component {
  state = {
    data: [],
    selected: {
      id: '',
    },
    weeks: [],
    settings: {
      coloredRating: true,
      saladOnDinner: false,
      showMinMaxDay: true,
      showMinMaxWeek: false,
      tools: false,
    },
    ratingStart: '',
    ratingEnd: '',
  }

  constructor(props) {
    super(props)

    this.update = this.update.bind(this)
  }

  componentWillMount() {
    getWeekTemplate().then(async answer => {
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
        const data = json.length ? json : [json]
        this.setState({
          data,
          // loading: false,
        })
      }
    })
  }

  async onDownloadMenu() {
    const { selected, weeks, settings, ratingStart, ratingEnd } = this.state
    const {
      intl: { formatMessage },
    } = this.props
    const req = await getExpandedWeekTemplate(
      selected.id,
      settings.saladOnDinner,
      ratingStart,
      ratingEnd,
    )
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
      const week = weeks.findIndex(t => t.id === json.id)
      if (week !== -1) {
        weeks[week] = json
        this.setState({
          weeks,
        })
      } else {
        weeks.push(json)
        this.setState({
          weeks,
        })
      }
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

  handleChangeRatingDates = period => {
    if (!period || period.length === 0 || period === undefined || period === null) {
      this.setState({ ratingStart: 0, ratingEnd: 0 })
    } else {
      this.setState({
        ratingStart: period[0].format('DD-MM-YYYY'),
        ratingEnd: period[1].format('DD-MM-YYYY'),
      })
    }
  }

  selectTemplate = id => {
    const { data } = this.state
    const selected = data.find(d => d.id === id)
    if (selected) {
      this.setState({
        selected,
      })
    }
  }

  update = async weekId => {
    const { weeks, settings } = this.state
    const req = await getExpandedWeekTemplate(weekId, settings.saladOnDinner)
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
      const week = weeks.findIndex(t => t.id === weekId)
      const json = await req.json()
      if (week !== -1) {
        weeks[week] = json
        this.setState({
          weeks,
        })
      }
    }
  }

  turnSetting(e, field) {
    const { settings } = this.state
    if (e.target) {
      if (e.target.type === 'checkbox') {
        settings[field] = e.target.checked
      } else {
        settings[field] = e.target.value
      }
    } else {
      settings[field] = e
    }
    this.setState({
      settings,
    })
  }

  render() {
    const { data, weeks, settings, ratingStart, ratingEnd } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    return (
      <Authorize
        roles={['root', 'admin', 'finance', 'sales']}
        denied={['Dave']}
        redirect
        to="/main"
      >
        <Helmet title="Managing templates" />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>{formatMessage({ id: 'TemplateMenu.ManagingTemplates' })}</strong>
            </div>
          </div>
          <div className="card-body">
            <Select
              showSearch
              // value={selected.id}
              defaultActiveFirstOption={false}
              showArrow={false}
              placeholder={formatMessage({ id: 'TemplateMenu.Search...' })}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: '350px', marginBottom: '15px' }}
              onChange={this.selectTemplate}
            >
              {data.map(temp => (
                <Option key={temp.id} value={temp.id}>
                  {temp.name}
                </Option>
              ))}
            </Select>
            &nbsp;&nbsp;&nbsp;
            <Checkbox
              checked={settings.saladOnDinner}
              onChange={e => this.turnSetting(e, 'saladOnDinner')}
            />
            &nbsp;&nbsp;
            <small>{formatMessage({ id: 'TemplateMenu.Salad' })}</small>
            <Button
              type="primary"
              style={{ marginLeft: '15px' }}
              onClick={async () => this.onDownloadMenu()}
            >
              {formatMessage({ id: 'TemplateMenu.Load' })}
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Checkbox
              checked={settings.coloredRating}
              onChange={e => this.turnSetting(e, 'coloredRating')}
            />
            &nbsp;&nbsp;
            <small>{formatMessage({ id: 'TemplateMenu.ColoredRating' })}</small>
            &nbsp;&nbsp;&nbsp;
            <Checkbox
              checked={settings.showMinMaxDay}
              onChange={e => this.turnSetting(e, 'showMinMaxDay')}
            />
            &nbsp;&nbsp;
            <small>{formatMessage({ id: 'TemplateMenu.ShowMin-MaxInDay' })}</small>
            &nbsp;&nbsp;&nbsp;
            <Checkbox
              checked={settings.showMinMaxWeek}
              onChange={e => this.turnSetting(e, 'showMinMaxWeek')}
            />
            &nbsp;&nbsp;
            <small>{formatMessage({ id: 'TemplateMenu.ShowMin-MaxInWeek' })}</small>
            &nbsp;&nbsp;&nbsp;
            <Authorize roles={['root', 'admin']}>
              <Checkbox checked={settings.tools} onChange={e => this.turnSetting(e, 'tools')} />
              &nbsp;&nbsp;
              <small>{formatMessage({ id: 'TemplateMenu.ShowTools' })}</small>
            </Authorize>
            <br />
            <small>
              {formatMessage({ id: 'TemplateMenu.SelectADateRangeToDisplayTheRating(optional)' })}
            </small>
            <br />
            <RangePicker
              ranges={{
                'Previous Month': [
                  moment()
                    .subtract(1, 'month')
                    .startOf('month'),
                  moment()
                    .subtract(1, 'month')
                    .endOf('month'),
                ],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
              }}
              value={
                ratingStart && ratingEnd
                  ? [moment(ratingStart, 'DD-MM-YYYY'), moment(ratingEnd, 'DD-MM-YYYY')]
                  : []
              }
              format="DD.MM.YYYY"
              onChange={this.handleChangeRatingDates}
            />
            <hr />
            {weeks.map((_, i) => (
              <Week
                key={() => Math.random()}
                week={weeks[i]}
                update={this.update}
                settings={{
                  coloredRating: settings.coloredRating,
                  showMinMaxDay: settings.showMinMaxDay,
                  showMinMaxWeek: settings.showMinMaxWeek,
                  tools: settings.tools,
                }}
              />
            ))}
          </div>
        </div>
      </Authorize>
    )
  }
}

export default TemplateMenu
