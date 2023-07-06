/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import { Button, notification, Select, Tabs, Spin } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import _ from 'lodash'

import {
  getTemplateMenu,
  createTemplateMenu,
  editTemplateMenu,
  deleteTemplateMenu,
  copyTemplate,
} from '../../../api/erp/template'

import CreateIngredientForm from './CreateTemplate'
import AllTemplate from './AllTemplate'
import TemplateDetail from './TemplateDetail'

const { Option } = Select
const { TabPane } = Tabs

@injectIntl
@withRouter
@connect(({ user }) => ({ user }))
class TemplateMenu extends React.Component {
  state = {
    data: [],
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
    this.dublicateTemplate = this.dublicateTemplate.bind(this)
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
        let { selected } = this.state

        if (selected.id) {
          const selected2 = json.find(d => d.id === selected.id)
          if (selected) {
            selected = selected2
          }
        } else {
          selected = {}
        }

        this.setState({
          data: json,
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
    const req = await deleteTemplateMenu(id)
    if (req.status === 204) {
      notification.success({
        message: formatMessage({ id: 'TemplateMenu.Deleted' }),
        description: formatMessage({ id: 'TemplateMenu.TemplateSuccessfullyDeleted!' }),
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

  async dublicateTemplate(id) {
    const {
      intl: { formatMessage },
    } = this.props
    const req = await copyTemplate(id)
    if (req.status === 200) {
      notification.success({
        message: formatMessage({ id: 'TemplateMenu.Duplicated' }),
        description: formatMessage({ id: 'TemplateMenu.TemplateSuccessfullyDuplicated!' }),
        placement: 'topRight',
      })
      this.updateTemplates()
      const json = await req.json()
      getTemplateMenu().then(async answer => {
        if (answer.status === 200) {
          const templates = await answer.json()
          this.setState({
            data: templates,
          })
          const copy = _.find(this.state.data, { id: json.id })
          this.editTemplateModal(copy)
        }
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
      // eslint-disable-next-line no-unused-vars
      user,
      intl: { formatMessage },
    } = this.props

    return (
      <Authorize roles={['root', 'admin']} redirect to="/main">
        <Helmet title={formatMessage({ id: 'TemplateMenu.DayTemplates' })} />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>{formatMessage({ id: 'TemplateMenu.DayTemplates' })}</strong>
            </div>
          </div>
          <div className="card-body">
            <Button
              type="primary"
              onClick={this.showDrawerCreateTemplateForm}
              style={{ marginBottom: '15px' }}
            >
              {formatMessage({ id: 'TemplateMenu.NewTemplate' })}
            </Button>
            <Tabs type="card">
              <TabPane tab={formatMessage({ id: 'TemplateMenu.Search/View' })} key={0}>
                <Spin spinning={false}>
                  <center>
                    <Select
                      showSearch
                      // value={selected.id}
                      autoClearSearchValue={false}
                      showArrow={false}
                      placeholder={formatMessage({ id: 'TemplateMenu.SearchTemplate...' })}
                      filterOption={(input, option) =>
                        option.props.children
                          .toString()
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      style={{ width: '500px', marginBottom: '15px' }}
                      onChange={this.selectTemplate}
                    >
                      {data.map(temp => (
                        <Option key={temp.id} value={temp.id}>
                          {temp.isCompleted
                            ? formatMessage({ id: 'TemplateMenu.[COMPLETED]' })
                            : ''}
                          {temp.name}
                        </Option>
                      ))}
                    </Select>
                  </center>
                  <TemplateDetail
                    template={selected}
                    edit={this.editTemplateModal}
                    removeTemplate={this.removeTemplate}
                    dublicateTemplate={this.dublicateTemplate}
                  />
                </Spin>
              </TabPane>
              <TabPane tab={formatMessage({ id: 'TemplateMenu.AllTemplates' })} key={1}>
                <Spin spinning={false}>
                  <AllTemplate
                    data={data}
                    edit={this.editTemplateModal}
                    removeTemplate={this.removeTemplate}
                    dublicateTemplate={this.dublicateTemplate}
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
          create={createTemplateMenu}
          edit={editTemplateMenu}
          update={this.updateTemplates}
        />
      </Authorize>
    )
  }
}

export default TemplateMenu
