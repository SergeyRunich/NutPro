import React from 'react'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { notification, Spin, Select, Statistic, Row, Col } from 'antd'
import { Helmet } from 'react-helmet'

import DayCard from './DayCard'

import { getMacroRanges } from '../../../api/dashboard'

@injectIntl
@withRouter
class MacroRanges extends React.Component {
  state = {
    loading: true,
    data: [],
    mealsPerDay: 5,
    summary: {
      dates: '',
      min: {
        min: 0,
        max: 0,
        average: 0,
      },
      max: {
        min: 0,
        max: 0,
        average: 0,
      },
    },
  }

  constructor(props) {
    super(props)

    this.onChangeField = this.onChangeField.bind(this)
  }

  componentDidMount() {
    const {
      intl: { formatMessage },
    } = this.props
    getMacroRanges(5).then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        this.setState({
          data: json.result,
          summary: json.summary,
          loading: false,
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    })
  }

  onChangeField(e, field) {
    this.setState({
      loading: true,
    })
    let val = e
    if (e !== null && e.target) {
      if (e.target.type === 'checkbox') {
        val = e.target.checked
      } else {
        val = e.target.value
      }
    }
    getMacroRanges(val).then(async req => {
      const {
        intl: { formatMessage },
      } = this.props
      if (req.status === 200) {
        const json = await req.json()
        this.setState({
          data: json.result,
          summary: json.summary,
          loading: false,
          [field]: val,
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
        this.setState({
          loading: false,
        })
      }
    })
  }

  render() {
    const { data, loading, mealsPerDay, summary } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    return (
      <div>
        <Helmet title={formatMessage({ id: 'MacroRanges.RangesOfMacro' })} />
        <div className="card">
          <div className="card-body">
            <div style={{ marginBottom: '10px' }}>
              <h4>{summary.dates}</h4>
              <small style={{ marginRight: '10px' }}>
                {formatMessage({ id: 'MacroRanges.MealsPerDay' })}
              </small>
              <Select value={mealsPerDay} onChange={e => this.onChangeField(e, 'mealsPerDay')}>
                <Select.Option value={5} key={5}>
                  {' '}
                  {formatMessage({ id: 'MacroRanges.5Meals' })}
                </Select.Option>
                <Select.Option value={3} key={3}>
                  {' '}
                  {formatMessage({ id: 'MacroRanges.3Meals' })}
                </Select.Option>
                <Select.Option value={2} key={2}>
                  {' '}
                  {formatMessage({ id: 'MacroRanges.2Meals' })}
                </Select.Option>
              </Select>
            </div>
            <div>
              <Row gutter={16}>
                <Col md={4} xs={12}>
                  <Statistic
                    title={formatMessage({ id: 'MacroRanges.MIN' })}
                    value={summary.min.max}
                    suffix="kCal"
                  />
                </Col>
                <Col md={4} xs={12}>
                  <Statistic
                    title={formatMessage({ id: 'MacroRanges.MAX' })}
                    value={summary.max.min}
                    suffix="kCal"
                  />
                </Col>
                <Col md={4} xs={12}>
                  <Statistic
                    title={formatMessage({ id: 'MacroRanges.AVERAGEMIN' })}
                    value={summary.min.average}
                    suffix="kCal"
                  />
                </Col>
                <Col md={4} xs={12}>
                  <Statistic
                    title={formatMessage({ id: 'MacroRanges.AVERAGEMAX' })}
                    value={summary.max.average}
                    suffix="kCal"
                  />
                </Col>
                <Col md={5} xs={12}>
                  <Statistic
                    title={formatMessage({ id: 'MacroRanges.AVERAGEOPTIMAL' })}
                    value={(summary.max.average + summary.min.average) / 2}
                    suffix="kCal"
                  />
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong style={{ marginRight: '15px' }}>
                {formatMessage({ id: 'MacroRanges.RangesOfMacro' })}
              </strong>
            </div>
          </div>
          <div className="card-body">
            <div>
              <Spin spinning={loading}>
                <div className="row">
                  {data.map(day => (
                    <div key={Math.random()} className="col-xl-2 col-lg-4 col-md-6 col-sm-12">
                      <DayCard day={day} />
                    </div>
                  ))}
                </div>
              </Spin>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MacroRanges
