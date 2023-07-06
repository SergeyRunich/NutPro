/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Table, Icon, Input, Button, Popconfirm, notification, Dropdown, Menu } from 'antd'
import { connect } from 'react-redux'

import { deleteTechcard } from '../../../../api/erp/techcard'

@injectIntl
@withRouter
@connect(({ user }) => ({ user }))
class AllTechcard extends React.Component {
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

  componentWillReceiveProps() {
    setTimeout(() => {
      this.update()
    }, 300)
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
          const match = record.title.match(reg)
          if (!match) {
            return null
          }
          return {
            ...record,
            title: record.title,
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

  async removeTechcard(id) {
    const {
      intl: { formatMessage },
    } = this.props
    const req = await deleteTechcard(id)
    if (req.status === 204) {
      notification.success(formatMessage({ id: 'Techcard.TechcardDeleted' }))
      this.update()
    } else {
      notification.error({
        message: formatMessage({ id: 'global.error' }),
        description: req.statusText,
        placement: 'topRight',
      })
    }
  }

  render() {
    const { data, searchText, filterDropdownVisible, filtered } = this.state
    const {
      edit,
      removeTechcard,
      user,
      intl: { formatMessage },
    } = this.props

    const menu = id => (
      <Menu style={{ padding: '0px' }}>
        <Menu.Item key="rempve">
          <Popconfirm
            title={formatMessage({ id: 'Techcard.AreYouSureDeleteThisTechcard?' })}
            onConfirm={async () => removeTechcard(id)}
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
        title: formatMessage({ id: 'Techcard.Techcard' }),
        dataIndex: 'title',
        key: 'name',
        sorter: (a, b) => a.title.length - b.title.length,
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
              placeholder={formatMessage({ id: 'Techcard.SearchName' })}
              value={searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch} style={{ marginTop: '5px' }}>
              {formatMessage({ id: 'Techcard.Search' })}
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
        title: formatMessage({ id: 'Techcard.Tags' }),
        dataIndex: 'group',
        key: 'group',
        render: text => <span>{`${text ? text.name : '-'}`}</span>,
        // sorter: (a, b) => a.id - b.id,
      },
      {
        title: formatMessage({ id: 'Techcard.Amount' }),
        dataIndex: 'amount',
        key: 'amount',
        render: text => <span>{`${text || '-'}`}</span>,
        sorter: (a, b) => a.amount - b.amount,
      },
      {
        title: formatMessage({ id: 'Techcard.Unit' }),
        dataIndex: 'unit',
        key: 'unit',
        render: text => <span>{`${text === 0 ? 'kg' : 'ks'}`}</span>,
        sorter: (a, b) => a.unit - b.unit,
      },
      {
        title: formatMessage({ id: 'Techcard.Ingredients' }),
        dataIndex: 'ingredients',
        key: 'ingrth',
        render: text => <span>{`${text.length || '-'}`}</span>,
        sorter: (a, b) => a.ingredients.length - b.ingredients.length,
      },
      {
        title: formatMessage({ id: 'Techcard.Semiproducts' }),
        dataIndex: 'subTechcards',
        key: 'subTC',
        render: text => <span>{`${text.length || '-'}`}</span>,
        sorter: (a, b) => a.subTechcards.length - b.subTechcards.length,
      },
      {
        title: formatMessage({ id: 'Techcard.kCal' }),
        dataIndex: 'nutrients',
        key: 'kCal',
        render: text => <span>{`${text.energy.toFixed(0) || '-'}`}</span>,
        // sorter: (a, b) => a.email - b.email,
      },
      {
        title: formatMessage({ id: 'Techcard.Semiproduct' }),
        dataIndex: 'isSubTechcard',
        key: 'isSub',
        render: text => <span>{`${text ? 'Yes' : 'No'}`}</span>,
        sorter: (a, b) => a.isSubTechcard - b.isSubTechcard,
      },
      {
        title: formatMessage({ id: 'Techcard.Action' }),
        dataIndex: 'id',
        key: 'action',
        render: (text, record) => (
          <span>
            {user.name !== 'david' && (
              <Dropdown.Button overlay={menu(text, record)} onClick={() => edit(record)}>
                {formatMessage({ id: 'global.edit' })}
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

export default AllTechcard
