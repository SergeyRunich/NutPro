/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import moment from 'moment'
import { Table, Button, Popconfirm, message, Modal, Input, Switch, notification } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import {
  getAllUsers,
  deactivateUser,
  createUser,
  changeUserPassword,
  getAllBranches,
} from '../../../api/user'

import CreateUserForm from './createUserForm'

@injectIntl
@withRouter
@connect(({ user }) => ({ user }))
class Users extends React.Component {
  state = {
    users: [],
    branches: [],
    loading: true,
    createUserFormVisible: false,
    editForm: false,
    currentUser: {},
    showModal: false,
    newPassword: '',
    user: '',
    showInactive: false,
  }

  constructor(props) {
    super(props)
    this.deactivateUser = this.deactivateUser.bind(this)
    this.updateUsers = this.updateUsers.bind(this)
    this.editUserInfo = this.editUserInfo.bind(this)
    this.filterData = this.filterData.bind(this)
  }

  componentWillMount() {
    getAllUsers().then(async answer => {
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
        users: json.result,
        loading: false,
      })
    })

    getAllBranches().then(async answer => {
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
        branches: json.result,
      })
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

  showDrawerCreateUserForm = () => {
    this.setState({
      createUserFormVisible: true,
      editForm: false,
    })
  }

  onCloseCreateUserForm = () => {
    this.setState({
      createUserFormVisible: false,
      editForm: false,
    })
  }

  editUserInfo = record => {
    this.setState({
      createUserFormVisible: true,
      editForm: true,
      currentUser: record,
    })
  }

  hendleChangePassword = record => {
    this.setState({
      showModal: true,
      user: record.id,
    })
  }

  handleCancel = () => {
    this.setState({
      showModal: false,
      newPassword: '',
    })
  }

  handleOk = () => {
    const {
      intl: { formatMessage },
    } = this.props
    const { user, newPassword } = this.state
    this.setState({
      showModal: false,
    })
    changeUserPassword(user, { password: newPassword }).then(async answer => {
      const json = await answer.json()
      if (answer.status === 200) {
        this.setState({
          user: json.result,
          loading: false,
        })
        notification.success({
          message: formatMessage({ id: 'User.Updated' }),
          description: formatMessage({ id: 'User.User password successfully updated!' }),
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: answer.statusText,
          placement: 'topRight',
        })
      }
    })
  }

  filterData = () => {
    const { users, showInactive } = this.state
    const filteredTableData = users.filter(user => {
      if (user?.isActive === false && !showInactive) return false
      return true
    })
    return filteredTableData
  }

  updateUsers() {
    getAllUsers().then(async answer => {
      const json = await answer.json()
      this.setState({
        users: json.result,
        loading: false,
      })
    })
  }

  async deactivateUser(id) {
    const req = await deactivateUser(id)
    if (req.status === 200) {
      message.success('User deleted!')
      this.updateUsers()
    } else {
      message.error('Error: ', req.statusText)
    }
  }

  render() {
    const { createUserFormVisible, currentUser, showModal, branches } = this.state
    const {
      intl: { formatMessage },
    } = this.props
    const filteredTableData = this.filterData()
    const columns = [
      {
        title: formatMessage({ id: 'User.Username' }),
        dataIndex: 'username',
        key: 'username',
        render: text => <span>{` ${text}`}</span>,
      },

      {
        title: formatMessage({ id: 'global.email' }),
        dataIndex: 'email',
        key: 'email',
        render: text => <span>{text}</span>,
      },

      {
        title: formatMessage({ id: 'User.Role' }),
        dataIndex: 'role',
        key: 'role',
        render: text => <span>{text}</span>,
      },

      {
        title: formatMessage({ id: 'User.Branches' }),
        dataIndex: 'branches',
        key: 'branches',
        render: (text, record) =>
          record.branches.map(b => {
            const branch = branches.find(e => e.id === b)
            return <p>{branch?.name || b}</p>
          }),
      },

      {
        title: formatMessage({ id: 'User.Created date' }),
        dataIndex: 'id',
        key: 'createdDate',
        render: text => (
          <span>
            {`${moment.unix(parseInt(text.substring(0, 8), 16)).format('DD.MM.YYYY HH:mm')}`}
          </span>
        ),
      },

      {
        title: formatMessage({ id: 'User.Is Active' }),
        dataIndex: 'isActive',
        key: 'isActive',
        render: text => <span>{text ? 'Yes' : 'No'}</span>,
      },

      {
        title: formatMessage({ id: 'User.Is Next Logout' }),
        dataIndex: 'isNextLogout',
        key: 'isNextLogout',
        render: text => <span>{text ? 'Yes' : 'No'}</span>,
      },

      {
        title: 'Action',
        dataIndex: 'id',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              style={{ marginRight: '15px' }}
              onClick={() => this.editUserInfo(record)}
              size="small"
            >
              Edit
            </Button>
            <Button
              style={{ marginRight: '15px' }}
              onClick={() => this.hendleChangePassword(record)}
              size="small"
            >
              Change Password
            </Button>
            <Popconfirm
              title="Are you sure delete this user?"
              onConfirm={() => this.deactivateUser(text)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon="close" size="small">
                Remove
              </Button>
            </Popconfirm>
          </span>
        ),
      },
    ]

    return (
      <Authorize roles={['root']} redirect to="/main">
        <Helmet title="Users" />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>{formatMessage({ id: 'User.Users' })}</strong>
            </div>
          </div>
          <div className="card-body">
            <Button
              style={{ marginBottom: '20px' }}
              type="primary"
              onClick={this.showDrawerCreateUserForm}
            >
              {formatMessage({ id: 'User.New user' })}
            </Button>
            <span style={{ marginLeft: '20px' }}>Show inactive users</span>
            <Switch
              style={{ marginLeft: '15px' }}
              onChange={e => this.onChangeField(e, 'showInactive')}
            />
            <Table
              className="utils__scrollTable"
              tableLayout="auto"
              scroll={{ x: '100%' }}
              columns={columns}
              dataSource={filteredTableData}
              onChange={this.handleTableChange}
              pagination={{
                position: 'bottom',
                total: filteredTableData.length,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100', '200'],
                hideOnSinglePage: filteredTableData.length < 10,
              }}
              loading={this.state.loading}
              rowKey={() => Math.random()}
            />
          </div>
        </div>
        <Modal
          title="Change user password"
          visible={showModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Input
            type="password"
            placeholder={formatMessage({ id: 'User.Please enter new password' })}
            onChange={e => this.onChangeField(e, 'newPassword')}
          />
        </Modal>
        <CreateUserForm
          visible={createUserFormVisible}
          onClose={this.onCloseCreateUserForm}
          create={createUser}
          update={this.updateUsers}
          editForm={this.state.editForm}
          currentUser={currentUser}
          branchesList={branches}
        />
      </Authorize>
    )
  }
}

export default Users
