/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { withRouter } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Table, Button, notification, Switch, Popconfirm } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import {
  getIngredientTags,
  deleteIngredientTag,
  createIngredientTag,
  editIngredientTag,
} from '../../../api/erp/ingredientTags'
import { getIngredientGroup } from '../../../api/erp/ingredientGroup'
import { getIngredient } from '../../../api/erp/ingredient'

import CreateTagForm from './CreateTag'

@injectIntl
@withRouter
@connect(({ user }) => ({ user }))
class Tags extends React.Component {
  state = {
    ingredientList: [],
    data: [],
    loading: true,
    createIngredientTagFormVisible: false,
    groupList: [],
    forEdit: {},
    tagsList: [],
    showOnlyActive: true,
  }

  constructor(props) {
    super(props)

    this.updateIngredientTag = this.updateIngredientTag.bind(this)
  }

  componentWillMount() {
    const { showOnlyActive } = this.state
    getIngredientTags(showOnlyActive).then(async answer => {
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
        // eslint-disable-next-line no-unused-vars
        const json = await answer.json()
        this.setState({
          tagsList: json.result,
        })
      }
    })

    getIngredient().then(async answer => {
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
          ingredientList: json,
          loading: false,
        })
      }
    })
    getIngredientGroup().then(async answer => {
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
          groupList: json,
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

  showDrawerCreateIngredientTagForm = () => {
    this.setState({
      createIngredientTagFormVisible: true,
    })
  }

  editIngredientTagModal = forEdit => {
    this.setState({
      forEdit,
      createIngredientTagFormVisible: true,
    })
  }

  onCloseCreateIngredientTagForm = () => {
    this.setState({
      forEdit: {},
      createIngredientTagFormVisible: false,
    })
  }

  refSearchInput = node => {
    this.searchInput = node
  }

  updateIngredientTag(showOnlyActive) {
    getIngredientTags(showOnlyActive).then(async answer => {
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
        // eslint-disable-next-line no-unused-vars
        const json = await answer.json()
        this.setState({
          tagsList: json.result,
          loading: false,
          forEdit: {},
        })
      }
    })
  }

  async removeIngredientTag(id) {
    const {
      intl: { formatMessage },
    } = this.props
    const { showOnlyActive } = this.state
    const req = await deleteIngredientTag(id)
    if (req.status === 205) {
      notification.success({
        message: formatMessage({ id: 'IngrTag.Removed' }),
        description: formatMessage({ id: 'IngrTag.IngredienttagDeleted!' }),
      })
      this.updateIngredientTag(showOnlyActive)
    } else {
      notification.error({
        message: formatMessage({ id: 'global.error' }),
        description: req.statusText,
        placement: 'topRight',
      })
    }
  }

  render() {
    const {
      data,
      createIngredientTagFormVisible,
      groupList,
      ingredientList,
      forEdit,
      tagsList,
      showOnlyActive,
    } = this.state
    // eslint-disable-next-line no-unused-vars
    const { user } = this.props

    const columns = [
      {
        title: <FormattedMessage id="IngrTag.ID" />,
        dataIndex: 'id',
        key: 'id',
        render: text => <span>{text}</span>,
        // sorter: (a, b) => a.id - b.id,
      },
      {
        title: <FormattedMessage id="IngrTag.Tag" />,
        dataIndex: 'title',
        key: 'title',
        render: text => <span>{text}</span>,
        // sorter: (a, b) => a.id - b.id,
      },
      {
        title: <FormattedMessage id="IngrTag.Ingredients" />,
        dataIndex: 'ingredients',
        key: 'ingredients',
        render: ingredients => <span>{ingredients.map(ingredient => ingredient.name).join()}</span>,
        // sorter: (a, b) => a.email - b.email,
      },
      {
        title: <FormattedMessage id="IngrTag.Groups" />,
        dataIndex: 'groups',
        key: 'groups',
        render: groups => <span>{groups.map(group => group.name).join()}</span>,
        // sorter: (a, b) => a.email - b.email,
      },
      {
        title: <FormattedMessage id="IngrTag.Actions" />,
        dataIndex: 'id',
        key: 'editorremove',
        render: (text, record) => (
          <span>
            <Button type="primary" onClick={() => this.editIngredientTagModal(record)}>
              <FormattedMessage id="IngrTag.Edit" />
            </Button>
            <Popconfirm
              title="Are you sure delete this tag?"
              onConfirm={() => this.removeIngredientTag(text)}
              okText="Yes"
              cancelText="No"
            >
              <Button style={{ marginLeft: '30px' }} type="danger">
                <FormattedMessage id="IngrTag.Delete" />
              </Button>
            </Popconfirm>
          </span>
        ),
      },
    ]

    return (
      <Authorize roles={['root', 'admin']} redirect to="/main">
        <Helmet title="Ingredient Tags" />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>
                <FormattedMessage id="IngrTag.ingredientTags" />
              </strong>
            </div>
          </div>
          <div className="card-body">
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              <span>
                <FormattedMessage id="IngrTag.showOnlyActiveTags" />
              </span>
              <Switch
                style={{ marginLeft: '15px' }}
                checked={showOnlyActive}
                onChange={e => this.onChangeField(e, 'showOnlyActive')}
              />

              <Button
                style={{ marginLeft: '20px' }}
                type="primary"
                onClick={() => {
                  this.updateIngredientTag(showOnlyActive)
                }}
              >
                <FormattedMessage id="IngrTag.Update" />
              </Button>
              <Button
                style={{ marginLeft: 'auto' }}
                type="primary"
                onClick={this.showDrawerCreateIngredientTagForm}
              >
                <FormattedMessage id="IngrTag.newIngredientTag" />
              </Button>
            </div>
            <Table
              className="utils__scrollTable"
              tableLayout="auto"
              scroll={{ x: '100%' }}
              columns={columns}
              dataSource={tagsList}
              onChange={this.handleTableChange}
              pagination={{
                position: 'bottom',
                total: data.length,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100', '200'],
                hideOnSinglePage: data.length < 10,
              }}
              loading={this.state.loading}
              rowKey={() => Math.random()}
            />
          </div>
        </div>
        <CreateTagForm
          visible={createIngredientTagFormVisible}
          onClose={this.onCloseCreateIngredientTagForm}
          groupList={groupList}
          ingredientList={ingredientList}
          forEdit={forEdit}
          create={createIngredientTag}
          edit={editIngredientTag}
          update={this.updateIngredientTag}
          showOnlyActive={showOnlyActive}
        />
      </Authorize>
    )
  }
}

export default Tags
