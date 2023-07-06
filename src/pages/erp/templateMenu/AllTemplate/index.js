/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'
import { Table, Icon, Input, Button, Popconfirm, Dropdown, Menu } from 'antd'

@injectIntl
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
    const {
      edit,
      removeTemplate,
      dublicateTemplate,
      intl: { formatMessage },
    } = this.props

    const menu = id => (
      <Menu style={{ padding: '0px' }}>
        <Menu.Item key="rempve">
          <Popconfirm
            title="Are you sure delete this template?"
            onConfirm={async () => removeTemplate(id)}
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
        title: formatMessage({ id: 'TemplateMenu.ID' }),
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => a.id.length - b.id.length,
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
              placeholder="Search id"
              value={searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch} style={{ marginTop: '5px' }}>
              {formatMessage({ id: 'TemplateMenu.Search' })}
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
        title: formatMessage({ id: 'TemplateMenu.Template' }),
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
              placeholder={formatMessage({ id: 'TemplateMenu.SearchName' })}
              value={searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch} style={{ marginTop: '5px' }}>
              {formatMessage({ id: 'TemplateMenu.Search' })}
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
        title: formatMessage({ id: 'TemplateMenu.Count' }),
        dataIndex: 'dishes',
        key: 'dishes',
        render: text => <span>{`${text ? text.length : '-'}`}</span>,
        sorter: (a, b) => a.dishes.length - b.dishes.length,
      },
      {
        title: formatMessage({ id: 'TemplateMenu.Class' }),
        dataIndex: 'class',
        key: 'class',
        render: text => <span>{`${text || '-'}`}</span>,
        sorter: (a, b) => a.class.length - b.amount.length,
      },
      {
        title: '---',
        dataIndex: 'id',
        key: 'actionEdit',
        render: (text, record) => (
          <span>
            <Dropdown.Button overlay={menu(text)} onClick={() => edit(record)}>
              {formatMessage({ id: 'global.edit' })}
            </Dropdown.Button>
          </span>
        ),
      },
      {
        title: '---',
        dataIndex: 'id',
        key: 'actionDuplicate',
        render: (text, record) => (
          <span>
            <Button overlay={menu(text)} onClick={() => dublicateTemplate(record.id)}>
              {formatMessage({ id: 'TemplateMenu.Duplicate' })}
            </Button>
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
