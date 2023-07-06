/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { withRouter } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import { Button, notification, Select, Tabs, Spin } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'

import {
  getWeekTemplate,
  createWeekTemplate,
  editWeekTemplate,
  deleteWeekTemplate,
} from '../../../api/erp/weekTemplate'

import CreateIngredientForm from './CreateTemplate'
import AllTemplate from './AllTemplate'
import TemplateDetail from './TemplateDetail'

const { Option } = Select
const { TabPane } = Tabs

@injectIntl
@withRouter
@connect(({ user }) => ({ user }))
class WeekTemplateMenu extends React.Component {
  state = {
    data: [],
    // loading: true,
    createTemplateFormVisible: false,
    forEdit: {},
    selected: {
      id: '',
    },
  }

  constructor(props) {
    super(props)

    this.updateTemplates = this.updateTemplates.bind(this)
    this.removeTemplate = this.removeTemplate.bind(this)
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

  showDrawerCreateTemplateForm = () => {
    this.setState({
      createTemplateFormVisible: true,
    })
  }

  editTemplateModal = forEdit => {
    this.setState({
      forEdit,
      createTemplateFormVisible: true,
    })
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

  onCloseCreateTemplateForm = () => {
    this.setState({
      createTemplateFormVisible: false,
      forEdit: {},
    })
  }

  updateTemplates() {
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
        let { selected } = this.state

        if (!json.length) {
          selected = json
        } else if (selected.id) {
          const selected2 = json.find(d => d.id === selected.id)
          if (selected) {
            selected = selected2
          }
        } else {
          selected = {}
        }

        this.setState({
          data,
          // loading: false,
          forEdit: {},
          selected,
        })
      }
    })
  }

  async removeTemplate(id) {
    const {
      intl: { formatMessage },
    } = this.props
    const req = await deleteWeekTemplate(id)
    if (req.status === 204) {
      notification.success({
        message: formatMessage({ id: 'WeekTemplateMenu.Deleted' }),
        description: formatMessage({ id: 'WeekTemplateMenu.TemplateSuccessfullyDeleted' }),
        placement: 'topRight',
      })
      this.updateTemplates()
      this.setState({
        selected: {},
      })
    } else {
      notification.error({
        message: formatMessage({ id: 'global.error' }),
        description: req.statusText,
        placement: 'topRight',
      })
    }
  }

  render() {
    const { data, createTemplateFormVisible, forEdit, selected } = this.state
    const {
      user,
      intl: { formatMessage },
    } = this.props

    return (
      <Authorize roles={['root', 'admin']} redirect to="/main">
        <Helmet title={formatMessage({ id: 'WeekTemplateMenu.WeekTemplatesMenu' })} />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>
                <FormattedMessage id="erp.weekTemplates" />
              </strong>
            </div>
          </div>
          <div className="card-body">
            {user.name !== 'david' && (
              <Button
                type="primary"
                onClick={this.showDrawerCreateTemplateForm}
                style={{ marginBottom: '15px' }}
              >
                <FormattedMessage id="erp.newTemplate" />
              </Button>
            )}

            <Tabs type="card">
              <TabPane tab={<FormattedMessage id="erp.searchView" />} key={0}>
                <Spin spinning={false}>
                  <center>
                    <Select
                      showSearch
                      // value={selected.id}
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      placeholder="Search..."
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      style={{ width: '500px', marginBottom: '15px' }}
                      onChange={this.selectTemplate}
                    >
                      {data.map(temp => (
                        <Option key={temp.id} value={temp.id}>
                          {temp.name}
                        </Option>
                      ))}
                    </Select>
                  </center>
                  <TemplateDetail
                    template={selected}
                    edit={this.editTemplateModal}
                    removeTemplate={this.removeTemplate}
                  />
                </Spin>
              </TabPane>
              <TabPane tab={<FormattedMessage id="erp.allTemplates" />} key={1}>
                <Spin spinning={false}>
                  <AllTemplate
                    data={data}
                    edit={this.editTemplateModal}
                    removeTemplate={this.removeTemplate}
                  />
                </Spin>
              </TabPane>
            </Tabs>
          </div>
        </div>
        <CreateIngredientForm
          visible={createTemplateFormVisible}
          onClose={this.onCloseCreateTemplateForm}
          data={data}
          forEdit={forEdit}
          create={createWeekTemplate}
          edit={editWeekTemplate}
          update={this.updateTemplates}
        />
      </Authorize>
    )
  }
}

export default WeekTemplateMenu
