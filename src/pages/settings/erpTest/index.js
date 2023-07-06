/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { withRouter } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Tabs, Spin } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { getTechcardTags } from '../../../api/erp/techcard'
import {
  getDayKcal,
  updateDayKcal,
  getIngredientFrequency,
  updateIngredientFrequency,
} from '../../../api/erp/testSettings'

import DayKcal from './DayKcal'
import IngredientFrequency from './IngredientFrequency'

const { TabPane } = Tabs

@withRouter
@connect(({ user }) => ({ user }))
class ErpSettings extends React.Component {
  state = {
    loading: [true, true],
    dayKcal: [],
    ingredientFrequency: [],
    allTags: [],
  }

  constructor(props) {
    super(props)

    this.updateSettings = this.updateSettings.bind(this)
  }

  componentDidMount() {
    getTechcardTags().then(async answer => {
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          allTags: json,
          // loading: false,
        })
      }
    })
    this.updateSettings('dayKcal')
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

  // selectTechcard = id => {
  //   const { data } = this.state
  //   const selected = data.find(d => d.id === id)
  //   if (selected) {
  //     this.setState({
  //       selected,
  //     })
  //   }

  // }

  // onCloseCreateTechcardForm = () => {
  //   this.setState({
  //     createTechcardFormVisible: false,
  //     forEdit: {},
  //   })
  // }

  updateSettings() {
    getDayKcal().then(async answer => {
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
      const json = await answer.json()
      this.setState(state => ({
        dayKcal: json.result,
        loading: [false, state.loading[1]],
      }))
    })

    getIngredientFrequency().then(async answer => {
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
      const json = await answer.json()
      this.setState(state => ({
        ingredientFrequency: json.result,
        loading: [state.loading[0], false],
      }))
    })
  }

  render() {
    const { dayKcal, allTags, loading, ingredientFrequency } = this.state

    return (
      <div>
        <Helmet title={<FormattedMessage id="erp.ERP Settings" />} />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>
                <FormattedMessage id="erp.title.settings.test" />
              </strong>
            </div>
          </div>
          <div className="card-body">
            <Tabs type="card">
              <TabPane tab={<FormattedMessage id="erp.meal" />} key={0}>
                <Spin spinning={loading[0]}>
                  {!loading[0] && <DayKcal data={dayKcal} post={updateDayKcal} />}
                </Spin>
              </TabPane>
              <TabPane tab={<FormattedMessage id="erp.ingredients" />} key={1}>
                <Spin spinning={loading[1]}>
                  {!loading[1] && (
                    <IngredientFrequency
                      data={ingredientFrequency}
                      post={updateIngredientFrequency}
                      tags={allTags}
                    />
                  )}
                </Spin>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}

export default ErpSettings
