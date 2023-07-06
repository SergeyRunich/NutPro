/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { withRouter } from 'react-router-dom'
import { injectIntl, FormattedMessage } from 'react-intl'
import Authorize from 'components/LayoutComponents/Authorize'
import { isArray } from 'react-stockcharts/lib/utils'
import { Button, notification, Select, Tabs, Spin, Row, Col } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import {
  getTechcard,
  createTechcard,
  editTechcard,
  deleteTechcard,
  getTechcardByTag,
  getTechcardTags,
} from '../../../api/erp/techcard'

import CreateTechcardForm from './CreateTechcard'
import AllTechcard from './AllTechcard'
import TechcardDetail from './TechcardDetail'

const { Option } = Select
const { TabPane } = Tabs

@injectIntl
@withRouter
@connect(({ user }) => ({ user }))
class Techcard extends React.Component {
  state = {
    data: [],
    // loading: true,
    createTechcardFormVisible: false,
    forEdit: {},
    selected: {
      id: '',
    },
    tag: [],
    allTags: [],
  }

  constructor(props) {
    super(props)

    this.updateTechcards = this.updateTechcards.bind(this)
    this.removeTechcard = this.removeTechcard.bind(this)
    this.clearSearch = this.clearSearch.bind(this)
  }

  componentWillMount() {
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
          data: json,
          // loading: false,
        })
      }
    })

    getTechcardTags().then(async answer => {
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          allTags: json,
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

  showDrawerCreateTechcardForm = () => {
    this.setState({
      createTechcardFormVisible: true,
    })
  }

  editTechcardModal = forEdit => {
    this.setState({
      forEdit,
      createTechcardFormVisible: true,
    })
  }

  selectTechcard = id => {
    const { data } = this.state
    const selected = data.find(d => d.id === id)
    if (selected) {
      this.setState({
        selected,
      })
    }
  }

  onCloseCreateTechcardForm = () => {
    this.setState({
      createTechcardFormVisible: false,
      forEdit: {},
    })
  }

  updateTechcards() {
    const { tag } = this.state
    if (!tag) {
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

    if (tag) {
      getTechcardByTag(tag.toString()).then(async answer => {
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
          const {
            intl: { formatMessage },
          } = this.props
          let json = await answer.json()
          if (!isArray(json)) json = [json]
          this.setState({
            data: json,
            forEdit: {},
            selected: {},
            // loading: false,
          })
          notification.success({
            message: formatMessage({ id: 'global.success' }),
            description: formatMessage({ id: 'Techcard.TechcardListUpdated!' }),
            placement: 'topRight',
          })
        }
      })
    }
  }

  async removeTechcard(id) {
    const {
      intl: { formatMessage },
    } = this.props
    const req = await deleteTechcard(id)
    if (req.status === 204) {
      notification.success({
        message: formatMessage({ id: 'Techcard.Removed' }),
        description: formatMessage({ id: 'Techcard.TechcardSuccessfullyRemoved!' }),
        placement: 'topRight',
      })
      this.updateTechcards()
      this.setState({
        selected: {},
      })
    } else {
      notification.error({
        message: 'Error',
        description: req.statusText,
        placement: 'topRight',
      })
    }
  }

  clearSearch() {
    const {
      intl: { formatMessage },
    } = this.props
    this.setState({
      tag: [],
    })
    setTimeout(() => {
      this.updateTechcards()
      notification.success({
        message: formatMessage({ id: 'global.success' }),
        description: formatMessage({ id: 'Techcard.TechcardListUpdated!' }),
        placement: 'topRight',
      })
    }, 100)
  }

  render() {
    const { data, createTechcardFormVisible, forEdit, selected, allTags, tag } = this.state
    const {
      user,
      intl: { formatMessage },
    } = this.props

    return (
      <Authorize roles={['root', 'admin']} redirect to="/main">
        <Helmet title="ERP: Techcards" />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>
                <FormattedMessage id="erp.techcards" />
              </strong>
            </div>
          </div>
          <div className="card-body">
            <Row gutter={16}>
              <Col md={6} sm={24}>
                {user.name !== 'david' && (
                  <Button
                    type="primary"
                    onClick={this.showDrawerCreateTechcardForm}
                    style={{ marginBottom: '15px' }}
                  >
                    <FormattedMessage id="erp.newTechcard" />
                  </Button>
                )}
              </Col>
              <Col md={6} sm={24}>
                <Select
                  placeholder="Select tag"
                  value={tag}
                  onChange={e => this.onChangeField(e, 'tag')}
                  style={{ width: '100%' }}
                  mode="tags"
                >
                  {allTags.map(mTag => (
                    <Option key={mTag.id} value={mTag.id}>
                      {mTag.cz}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col md={6} sm={24}>
                <Button
                  type="primary"
                  onClick={this.updateTechcards}
                  disabled={tag.length === 0}
                  style={{ margin: '0 15px 15px 0' }}
                >
                  {formatMessage({ id: 'Techcard.SearchByTags' })}
                </Button>
                <Button
                  type="danger"
                  disabled={tag.length === 0}
                  onClick={this.clearSearch}
                  style={{ marginBottom: '15px' }}
                >
                  {formatMessage({ id: 'Techcard.ResetFilter' })}
                </Button>
              </Col>
            </Row>

            <Tabs type="card">
              <TabPane tab={<FormattedMessage id="erp.searchView" />} key={0}>
                <Spin spinning={false}>
                  <center>
                    <Select
                      showSearch
                      // value={tag}
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      placeholder={formatMessage({ id: 'Techcard.Search...' })}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      style={{ width: '500px', marginBottom: '15px' }}
                      onChange={this.selectTechcard}
                    >
                      {data.map(tc => (
                        <Option key={tc.id} value={tc.id}>
                          {tc.title}
                        </Option>
                      ))}
                    </Select>
                  </center>
                  <TechcardDetail
                    techcard={selected}
                    edit={this.editTechcardModal}
                    removeTechcard={this.removeTechcard}
                  />
                </Spin>
              </TabPane>
              <TabPane tab={<FormattedMessage id="erp.allTechcards" />} key={1}>
                <Spin spinning={false}>
                  <AllTechcard
                    data={data}
                    edit={this.editTechcardModal}
                    removeTechcard={this.removeTechcard}
                  />
                </Spin>
              </TabPane>
            </Tabs>
          </div>
        </div>
        <CreateTechcardForm
          visible={createTechcardFormVisible}
          onClose={this.onCloseCreateTechcardForm}
          data={data}
          forEdit={forEdit}
          create={createTechcard}
          edit={editTechcard}
          update={this.updateTechcards}
        />
      </Authorize>
    )
  }
}

export default Techcard
