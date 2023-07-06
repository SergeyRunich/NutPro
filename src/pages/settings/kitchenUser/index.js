/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import moment from 'moment'
import { Table, Icon, Input, Button } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { getKitchenUsers, createKitchenUser } from '../../../api/kitchenUser'

import CreateUserForm from './CreateUserForm'

@injectIntl
@withRouter
@connect(({ user }) => ({ user }))
class Users extends React.Component {
  state = {
    tableData: [],
    data: [],
    filterDropdownVisible: false,
    searchText: '',
    filtered: false,
    loading: true,
    createUserFormVisible: false,
  }

  constructor(props) {
    super(props)

    this.updateUsers = this.updateUsers.bind(this)
  }

  componentWillMount() {
    getKitchenUsers().then(async answer => {
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
      this.setState({
        tableData: json,
        data: json,
        loading: false,
      })
    })
  }

  onInputChange = e => {
    this.setState({ searchText: e.target.value })
  }

  showDrawerCreateUserForm = () => {
    this.setState({
      createUserFormVisible: true,
    })
  }

  onCloseCreateUserForm = () => {
    this.setState({
      createUserFormVisible: false,
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

  updateUsers() {
    getKitchenUsers().then(async answer => {
      const json = await answer.json()
      this.setState({
        tableData: json,
        data: json,
        loading: false,
      })
    })
  }

  // async deleteUser(id) {
  //   const req = await deleteUser(id)
  //   if (req.status === 204) {
  //     message.success('User deleted!')
  //     this.updateUsers()
  //   } else {
  //     message.error('Error: ', req.statusText)
  //   }
  // }

  render() {
    const { data, searchText, filterDropdownVisible, filtered, createUserFormVisible } = this.state
    const {
      intl: { formatMessage },
    } = this.props
    const columns = [
      {
        title: formatMessage({ id: 'KitchenUser.Username' }),
        dataIndex: 'username',
        key: 'username',
        sorter: (a, b) => a.name.length - b.name.length,
        render: text => <span>{` ${text}`}</span>,
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder={formatMessage({ id: 'KitchenUser.Search name' })}
              value={searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch}>
              {formatMessage({ id: 'KitchenUser.Search' })}
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
        title: formatMessage({ id: 'KitchenUser.Created date' }),
        dataIndex: 'id',
        key: 'createdDate',
        render: text => (
          <span>
            {`${moment.unix(parseInt(text.substring(0, 8), 16)).format('DD.MM.YYYY HH:mm')}`}
          </span>
        ),
        // sorter: (a, b) => a.id - b.id,
      },
      {
        title: formatMessage({ id: 'KitchenUser.Kitchen' }),
        dataIndex: 'kitchen',
        key: 'kitchen',
        render: text => <span>{`${text.name || '-'}`}</span>,
        // sorter: (a, b) => a.email - b.email,
      },
      {
        title: formatMessage({ id: 'KitchenUser.Role' }),
        dataIndex: 'role',
        key: 'role',
        render: text => <span>{`${text || '-'}`}</span>,
        // sorter: (a, b) => a.email - b.email,
      },
      // {
      //   title: 'Action',
      //   dataIndex: 'id',
      //   key: 'action',
      //   render: text => (
      //     <span>
      //       <Button icon="edit" className="mr-1" size="small">
      //         View
      //       </Button>
      //       <Popconfirm
      //         title="Are you sure delete this user?"
      //         onConfirm={() => this.deleteUser(text)}
      //         okText="Yes"
      //         cancelText="No"
      //       >
      //         <Button icon="close" size="small">
      //           Remove
      //         </Button>
      //       </Popconfirm>
      //     </span>
      //   ),
      // },
    ]

    return (
      <Authorize roles={['root']} redirect to="/main">
        <Helmet title="Users" />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>{formatMessage({ id: 'KitchenUser.Kitchen users' })}</strong>
            </div>
          </div>
          <div className="card-body">
            <Button
              style={{ marginBottom: '20px' }}
              type="primary"
              onClick={this.showDrawerCreateUserForm}
            >
              {formatMessage({ id: 'KitchenUser.New kitchen user' })}
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
        <CreateUserForm
          visible={createUserFormVisible}
          onClose={this.onCloseCreateUserForm}
          create={createKitchenUser}
          update={this.updateUsers}
        />
      </Authorize>
    )
  }
}

export default Users
