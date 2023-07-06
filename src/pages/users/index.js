import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useQuery } from 'react-query'
import { Helmet } from 'react-helmet'
import { Button, Checkbox, Icon, Input, message, notification, Popconfirm, Table } from 'antd'
import { useIntl } from 'react-intl'
import { HeartTwoTone } from '@ant-design/icons'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Authorize from '../../components/LayoutComponents/Authorize'
import { createUser, getAllUsers } from '../../api/customer'
import { getQueryName } from '../../helpers/components'
import {
  DATE_TIME_FORMAT,
  TAG_VIP,
  USER_ROLE_ADMIN,
  USER_ROLE_FINANCE,
  USER_ROLE_ROOT,
  USER_ROLE_SALES,
  USER_ROLE_SALES_DIRECTOR,
} from '../../helpers/constants'
import CreateUserForm from './CreateUserForm'

const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100', '200']

const Users = () => {
  const dispatch = useDispatch()
  const { formatMessage } = useIntl()
  const [data, setData] = useState([])
  const [isDropdownFilterVisible, setIsDropdownFilterVisible] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [isFiltered, setIsFiltered] = useState(false)
  const [isCreateUserFormVisible, setIsCreateUserFormVisible] = useState(false)
  const [isVipOnly, setIsVipOnly] = useState(false)
  const refSearchInput = useRef()

  const allUsers = useQuery(
    getQueryName(Users, 'allUsers'),
    async () => {
      const response = await getAllUsers()
      if (response.status === 401) {
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            authorized: false,
          },
        })

        notification.error({
          message: `Authentication is required: ${response.statusText}`,
        })
        return
      }

      return response.json()
    },
    {
      retry: false,
      cacheTime: 0,
      onError: e => {
        notification.error({
          message: `Something went wrong while obtaining users list from server: ${e.message}`,
        })
      },
    },
  )

  useEffect(() => {
    if (allUsers.data) {
      setData(allUsers.data)
    }
  }, [allUsers.data])

  useEffect(() => {
    if (refSearchInput.target) {
      refSearchInput.target.focus()
    }
  }, [isDropdownFilterVisible])

  const onSearch = () => {
    setIsDropdownFilterVisible(false)
    setIsFiltered(searchText !== '')

    const reg = new RegExp(searchText, 'gi')
    setData(allUsers.data.filter(record => record.name.match(reg)))
  }

  const updateUsers = () => {
    allUsers.refetch()
  }

  const deleteUser = async id => {
    const response = await deleteUser(id)
    if (response.status === 204) {
      message.success(formatMessage({ id: 'Uers.User deleted!' }))
      updateUsers()
    } else {
      message.error(formatMessage({ id: 'Uers.Error: ' }), response.statusText)
    }
  }

  const columns = [
    {
      title: formatMessage({ id: 'Uers.ID' }),
      dataIndex: 'inBodyId',
      key: 'id',
      render: text => <span>{`${text}`}</span>,
      sorter: (a, b) => a.inBodyId - b.inBodyId,
    },
    {
      title: formatMessage({ id: 'global.name' }),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      render: (_, record) => {
        return (
          <span>
            {record.tag === TAG_VIP && <HeartTwoTone twoToneColor="#eb2f96" />}
            {` ${record.name}`}
          </span>
        )
      },
      filterDropdown: (
        <div className="custom-filter-dropdown">
          <Input
            ref={refSearchInput}
            placeholder={formatMessage({ id: 'Uers.Search name' })}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onPressEnter={onSearch}
          />
          <Button type="primary" onClick={onSearch}>
            {formatMessage({ id: 'Uers.Search' })}
          </Button>
        </div>
      ),
      filterIcon: <Icon type="search" style={{ color: isFiltered ? '#108ee9' : '#aaa' }} />,
      // filterDropdownVisible: {isDropdownFilterVisible},
      onFilterDropdownVisibleChange: visible => {
        setIsDropdownFilterVisible(visible)
      },
    },
    {
      title: formatMessage({ id: 'Uers.Created date' }),
      dataIndex: 'id',
      key: 'createdDate',
      render: text => (
        <span>{`${moment.unix(parseInt(text.substring(0, 8), 16)).format(DATE_TIME_FORMAT)}`}</span>
      ),
      // sorter: (a, b) => a.id - b.id,
    },
    {
      title: formatMessage({ id: 'global.email' }),
      dataIndex: 'email',
      key: 'email',
      render: text => <span>{`${text || '-'}`}</span>,
      // sorter: (a, b) => a.email - b.email,
    },
    {
      title: formatMessage({ id: 'global.address' }),
      dataIndex: 'address',
      key: 'address',
      render: text => <span>{`${text || '-'}`}</span>,
      // sorter: (a, b) => a.address - b.address,
    },

    {
      title: formatMessage({ id: 'Uers.Action' }),
      dataIndex: 'id',
      key: 'action',
      render: userId => (
        <span>
          <Link to={`/users/${userId}`}>
            <Button icon="edit" className="mr-1" size="small">
              {formatMessage({ id: 'Uers.View' })}
            </Button>
          </Link>
          <Authorize
            roles={[USER_ROLE_ROOT, USER_ROLE_ADMIN, USER_ROLE_SALES_DIRECTOR, USER_ROLE_FINANCE]}
          >
            <Popconfirm
              title={formatMessage({ id: 'Uers.Are you sure delete this user?' })}
              onConfirm={() => deleteUser(userId)}
              okText={formatMessage({ id: 'global.yes' })}
              cancelText={formatMessage({ id: 'global.no' })}
            >
              <Button icon="close" size="small">
                {formatMessage({ id: 'global.remove' })}
              </Button>
            </Popconfirm>
          </Authorize>
        </span>
      ),
    },
  ]

  let filteredData = data
  if (isVipOnly) {
    filteredData = data.filter(record => record.tag === TAG_VIP)
  }

  return (
    <Authorize
      roles={[
        USER_ROLE_ROOT,
        USER_ROLE_ADMIN,
        USER_ROLE_SALES,
        USER_ROLE_SALES_DIRECTOR,
        USER_ROLE_FINANCE,
      ]}
      denied={['Dany', 'Vitaly']}
      redirect
      to="/main"
    >
      <div>
        <Helmet title="Users" />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>{formatMessage({ id: 'Uers.Users' })}</strong>
            </div>
          </div>
          <div className="card-body">
            <Button
              type="primary"
              onClick={() => setIsCreateUserFormVisible(true)}
              style={{ marginRight: '30px', marginBottom: '30px' }}
            >
              {formatMessage({ id: 'Uers.New account' })}
            </Button>
            <Checkbox
              style={{ marginBottom: '30px' }}
              checked={isVipOnly}
              onClick={e => setIsVipOnly(e.target.checked)}
            >
              {formatMessage({ id: 'Uers.VIP filter' })}
            </Checkbox>
            <Table
              className="utils__scrollTable"
              tableLayout="auto"
              scroll={{ x: '100%' }}
              columns={columns}
              dataSource={filteredData}
              pagination={{
                position: 'bottom',
                total: filteredData.length,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                showSizeChanger: true,
                pageSizeOptions: PAGE_SIZE_OPTIONS,
                hideOnSinglePage: filteredData.length < 10,
              }}
              loading={allUsers.isLoading}
              rowKey={() => Math.random()}
            />
          </div>
        </div>
        <CreateUserForm
          visible={isCreateUserFormVisible}
          onClose={() => setIsCreateUserFormVisible(false)}
          create={createUser}
          update={updateUsers}
        />
      </div>
    </Authorize>
  )
}

export default Users
