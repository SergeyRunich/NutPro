/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
// import { Link } from 'react-router-dom'
import { Table, Icon, Input, Button, Popconfirm, Dropdown, Menu } from 'antd'

@connect(({ user }) => ({ user }))
class AllTemplate extends React.Component {
  state = {
    tableData: [],
    data: [],
    filterDropdownVisible: false,
    searchText: '',
    filtered: false,
    loading: true,
  }

  constructor(props) {
    super(props)

    this.update = this.update.bind(this)
  }

  componentWillMount() {
    this.update()
  }

  onInputChange = e => {
    this.setState({ searchText: e.target.value })
  }

  onSearch = () => {
    const { searchText, tableData } = this.state
    const reg = new RegExp(searchText, 'gi')
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      data: tableData
        .map(record => {
          const match = record.id.match(reg)
          if (!match) {
            return null
          }
          return {
            ...record,
            id: record.id,
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

  update() {
    const { data } = this.props
    this.setState({
      tableData: data,
      data,
      loading: false,
    })
  }

  render() {
    const { data, searchText, filterDropdownVisible, filtered } = this.state
    const { edit, removeTemplate, user } = this.props

    const menu = id => (
      <Menu style={{ padding: '0px' }}>
        <Menu.Item key="remove">
          <Popconfirm
            title="Are you sure delete this template?"
            onConfirm={async () => removeTemplate(id)}
            okText={<FormattedMessage id="global.yes" />}
            cancelText={<FormattedMessage id="global.no" />}
          >
            <FormattedMessage id="global.remove" />!
          </Popconfirm>
        </Menu.Item>
      </Menu>
    )

    const columns = [
      {
        title: <FormattedMessage id="erp.template" />,
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.length - b.name.length,
        render: text => {
          return (
            <span>
              <strong>{` ${text}`}</strong>
            </span>
          )
        },
        filterDropdown: (
          <div className="custom-filter-dropdown" style={{ padding: '5px' }}>
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch} style={{ marginTop: '5px' }}>
              Search
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
        title: '---',
        dataIndex: 'id',
        key: 'action',
        render: (text, record) => (
          <span>
            {user.name !== 'david' && (
              <Dropdown.Button overlay={menu(text)} onClick={() => edit(record)}>
                <FormattedMessage id="global.edit" />
              </Dropdown.Button>
            )}
          </span>
        ),
      },
    ]

    return (
      <div>
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
    )
  }
}

export default AllTemplate
