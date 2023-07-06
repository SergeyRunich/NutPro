/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import { Table, Icon, Input, Button, Popconfirm, message, notification, Dropdown, Menu } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
// import table from './data.json'
import {
  getIngredientGroup,
  deleteGroup,
  createNewGroup,
  editGroup,
} from '../../../api/erp/ingredientGroup'

import CreateGroupForm from './CreateGroupIngredient'

@injectIntl
@withRouter
@connect(({ user }) => ({ user }))
class GroupIngredient extends React.Component {
  state = {
    tableData: [],
    data: [],
    filterDropdownVisible: false,
    searchText: '',
    filtered: false,
    loading: true,
    createGroupFormVisible: false,
    forEdit: {},
  }

  constructor(props) {
    super(props)

    this.updateGroups = this.updateGroups.bind(this)
  }

  componentWillMount() {
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
          tableData: json,
          data: json,
          loading: false,
        })
      }
    })
  }

  onInputChange = e => {
    this.setState({ searchText: e.target.value })
  }

  showDrawerCreateGroupForm = () => {
    this.setState({
      createGroupFormVisible: true,
    })
  }

  editGroupModal = forEdit => {
    this.setState({
      forEdit,
      createGroupFormVisible: true,
    })
  }

  onCloseCreateGroupForm = () => {
    this.setState({
      createGroupFormVisible: false,
      forEdit: {},
    })
  }

  onSearch = () => {
    const { searchText, tableData } = this.state
    const reg = new RegExp(searchText, 'gi')
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      data: tableData
        .map(record => {
          const match = record.name.match(reg)
          if (!match) {
            return null
          }
          return {
            ...record,
            name: record.name,
          }
        })
        .filter(record => !!record),
    })
    if (searchText === '') {
      this.setState({
        filtered: false,
      })
    }
  }

  refSearchInput = node => {
    this.searchInput = node
  }

  updateGroups() {
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
          tableData: json,
          data: json,
          loading: false,
          forEdit: {},
        })
      }
    })
  }

  async deleteGroupIngredient(id) {
    const {
      intl: { formatMessage },
    } = this.props
    const req = await deleteGroup(id)
    if (req.status === 204) {
      message.success(formatMessage({ id: 'CreateGroupIng.GroupDeleted' }))
      this.updateGroups()
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
      searchText,
      filterDropdownVisible,
      filtered,
      createGroupFormVisible,
      forEdit,
    } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    const menu = id => (
      <Menu style={{ padding: '0px' }}>
        <Menu.Item key="rempve">
          <Popconfirm
            title="Are you sure delete this group?"
            onConfirm={() => this.deleteGroupIngredient(id)}
            okText="Yes"
            cancelText="No"
          >
            {formatMessage({ id: 'global.remove' })}
          </Popconfirm>
        </Menu.Item>
      </Menu>
    )

    const columns = [
      {
        title: formatMessage({ id: 'global.name' }),
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.length - b.name.length,
        render: (_, record) => {
          return <span>{` ${record.name}`}</span>
        },
        filterDropdown: (
          <div className="custom-filter-dropdown" style={{ padding: '5px' }}>
            <Input
              ref={this.refSearchInput}
              placeholder={formatMessage({ id: 'CreateGroupIng.SearchName' })}
              value={searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch} style={{ marginTop: '5px' }}>
              {formatMessage({ id: 'CreateGroupIng.Search' })}
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterDropdownVisible: visible,
            },
            () => this.searchInput && this.searchInput.focus(),
          )
        },
      },
      {
        title: formatMessage({ id: 'CreateGroupIng.MainGroup' }),
        dataIndex: 'mainGroup',
        key: 'mainGroup',
        render: text => <span>{`${text ? text.name : '-'}`}</span>,
        // sorter: (a, b) => a.id - b.id,
      },
      {
        title: formatMessage({ id: 'CreateGroupIng.NumberOfIngredients' }),
        dataIndex: 'numberIngredients',
        key: 'numberIngredients',
        render: text => <span>{`${text || '-'}`}</span>,
        // sorter: (a, b) => a.email - b.email,
      },
      {
        title: formatMessage({ id: 'CreateGroupIng.NumberOfSubGroups' }),
        dataIndex: 'numberSubGroups',
        key: 'numberSubGroups',
        render: text => <span>{`${text || '-'}`}</span>,
        // sorter: (a, b) => a.email - b.email,
      },
      {
        title: formatMessage({ id: 'CreateGroupIng.Action' }),
        dataIndex: 'id',
        key: 'action',
        render: (text, record) => (
          <span>
            <Dropdown.Button
              onClick={() =>
                this.editGroupModal({ id: text, name: record.name, mainGroup: record.mainGroup })
              }
              overlay={menu(text)}
            >
              {formatMessage({ id: 'global.edit' })}
            </Dropdown.Button>
          </span>
        ),
      },
    ]

    return (
      <Authorize roles={['root', 'admin']} redirect to="/main">
        <Helmet title="Groups ingredients" />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>{formatMessage({ id: 'CreateGroupIng.GroupIngredients' })}</strong>
            </div>
          </div>
          <div className="card-body">
            <Button
              style={{ marginBottom: '20px' }}
              type="primary"
              onClick={this.showDrawerCreateGroupForm}
            >
              {formatMessage({ id: 'CreateGroupIng.NewGroup' })}
            </Button>
            <Table
              className="utils__scrollTable"
              tableLayout="auto"
              scroll={{ x: '100%' }}
              columns={columns}
              dataSource={data}
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
        <CreateGroupForm
          visible={createGroupFormVisible}
          onClose={this.onCloseCreateGroupForm}
          groups={data}
          forEdit={forEdit}
          create={createNewGroup}
          edit={editGroup}
          update={this.updateGroups}
        />
      </Authorize>
    )
  }
}

export default GroupIngredient
