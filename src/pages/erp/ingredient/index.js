/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { withRouter } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Table, Icon, Input, Button, Popconfirm, notification, Dropdown, Menu } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import {
  getIngredient,
  deleteIngredient,
  createIngredient,
  editIngredient,
} from '../../../api/erp/ingredient'
import { getIngredientGroup } from '../../../api/erp/ingredientGroup'

import CreateIngredientForm from './CreateIngredient'

@injectIntl
@withRouter
@connect(({ user }) => ({ user }))
class Ingredient extends React.Component {
  state = {
    tableData: [],
    data: [],
    filterDropdownVisible: false,
    searchText: '',
    filtered: false,
    loading: true,
    createIngredientFormVisible: false,
    groups: [],
    forEdit: {},
  }

  constructor(props) {
    super(props)

    this.updateIngredients = this.updateIngredients.bind(this)
  }

  componentWillMount() {
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
          tableData: json,
          data: json,
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
          groups: json,
        })
      }
    })
  }

  onInputChange = e => {
    this.setState({ searchText: e.target.value })
  }

  showDrawerCreateIngredientForm = () => {
    this.setState({
      createIngredientFormVisible: true,
    })
  }

  editIngredientModal = forEdit => {
    this.setState({
      forEdit,
      createIngredientFormVisible: true,
    })
  }

  onCloseCreateIngredientForm = () => {
    this.setState({
      forEdit: {},
      createIngredientFormVisible: false,
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

  updateIngredients() {
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
          tableData: json,
          data: json,
          loading: false,
          forEdit: {},
        })
      }
    })
  }

  async removeIngredient(id) {
    const {
      intl: { formatMessage },
    } = this.props
    const req = await deleteIngredient(id)
    if (req.status === 204) {
      notification.success(formatMessage({ id: 'CreateIngrForm.IngredientDeleted' }))
      this.updateIngredients()
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
      createIngredientFormVisible,
      groups,
      forEdit,
    } = this.state
    const {
      user,
      intl: { formatMessage },
    } = this.props

    const menu = id => (
      <Menu style={{ padding: '0px' }}>
        <Menu.Item key="remove">
          <Popconfirm
            title={formatMessage({ id: 'CreateIngrForm.AreYouSureDeleteThisIngredient?' })}
            onConfirm={async () => this.removeIngredient(id)}
            okText={formatMessage({ id: 'global.yes' })}
            cancelText={formatMessage({ id: 'global.no' })}
          >
            <FormattedMessage id="global.remove" />
          </Popconfirm>
        </Menu.Item>
      </Menu>
    )

    const columns = [
      {
        title: <FormattedMessage id="erp.ingredient" />,
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.length - b.name.length,
        render: (_, record) => {
          return (
            <span>
              <strong>{` ${record.name}`}</strong>
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
              {formatMessage({ id: 'CreateIngrForm.Search' })}
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
        title: <FormattedMessage id="erp.group" />,
        dataIndex: 'group',
        key: 'group',
        render: text => <span>{`${text ? text.name : '-'}`}</span>,
        // sorter: (a, b) => a.id - b.id,
      },
      {
        title: <FormattedMessage id="erp.unit" />,
        dataIndex: 'unit',
        key: 'unit',
        render: text => <span>{`${text || '-'}`}</span>,
        // sorter: (a, b) => a.email - b.email,
      },
      {
        title: <FormattedMessage id="erp.brutto" />,
        dataIndex: 'brutto',
        key: 'brutto',
        render: text => <span>{`${text || '-'}`}</span>,
        sorter: (a, b) => a.brutto - b.brutoo,
      },
      {
        title: <FormattedMessage id="erp.netto" />,
        dataIndex: 'netto',
        key: 'netto',
        render: text => <span>{`${text || '-'}`}</span>,
        sorter: (a, b) => a.netto - b.netto,
      },
      {
        title: '%',
        dataIndex: 'percent',
        key: 'percent',
        render: text => <span>{`${text || '-'}`}</span>,
        sorter: (a, b) => a.percent - b.percent,
      },
      {
        title: 'kCal',
        dataIndex: 'nutrients',
        key: 'kCal',
        render: text => <span>{`${text.energy || '-'}`}</span>,
        // sorter: (a, b) => a.email - b.email,
      },
      {
        title: <FormattedMessage id="erp.prot" />,
        dataIndex: 'nutrients',
        key: 'prot',
        render: text => <span>{`${text.prot || '-'}`}</span>,
        // sorter: (a, b) => a.email - b.email,
      },
      {
        title: <FormattedMessage id="erp.fat" />,
        dataIndex: 'nutrients',
        key: 'fat',
        render: text => <span>{`${text.fat || '-'}`}</span>,
        // sorter: (a, b) => a.email - b.email,
      },
      {
        title: <FormattedMessage id="erp.carb" />,
        dataIndex: 'nutrients',
        key: 'carb',
        render: text => <span>{`${text.carb || '-'}`}</span>,
        // sorter: (a, b) => a.email - b.email,
      },
      {
        title: '---',
        dataIndex: 'id',
        key: 'action',
        render: (text, record) => (
          <span>
            {user.name !== 'david' && (
              <Dropdown.Button
                onClick={() => this.editIngredientModal(record)}
                overlay={menu(text)}
              >
                <FormattedMessage id="global.edit" />
              </Dropdown.Button>
            )}
          </span>
        ),
      },
    ]

    return (
      <Authorize roles={['root', 'admin']} redirect to="/main">
        <Helmet title="Ingredients" />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>
                <FormattedMessage id="erp.ingredients" />
              </strong>
            </div>
          </div>
          <div className="card-body">
            {user.name !== 'david' && (
              <Button
                style={{ marginBottom: '20px' }}
                type="primary"
                onClick={this.showDrawerCreateIngredientForm}
              >
                <FormattedMessage id="erp.newIngredient" />
              </Button>
            )}
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
        <CreateIngredientForm
          visible={createIngredientFormVisible}
          onClose={this.onCloseCreateIngredientForm}
          groups={groups}
          forEdit={forEdit}
          create={createIngredient}
          edit={editIngredient}
          update={this.updateIngredients}
        />
      </Authorize>
    )
  }
}

export default Ingredient
