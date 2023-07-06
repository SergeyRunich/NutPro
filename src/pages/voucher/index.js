/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import Authorize from 'components/LayoutComponents/Authorize'
import { Table, Icon, Input, Button, notification, Dropdown, Menu } from 'antd'
import { Helmet } from 'react-helmet'

import CreateVoucherForm from './CreateVoucherForm'

import {
  getVouchers,
  deleteVoucher,
  createVoucher,
  sentVoucher,
  acceptVoucher,
} from '../../api/voucher'

@injectIntl
class Vouchers extends React.Component {
  state = {
    tableData: [],
    data: [],
    filterDropdownVisible: false,
    searchText: '',
    filtered: false,
    loading: true,
    // status: 'all',
    createFormVisible: false,
  }

  constructor(props) {
    super(props)

    // this.onChangeStatus = this.onChangeStatus.bind(this)
    this.onCloseCreateForm = this.onCloseCreateForm.bind(this)
    this.update = this.update.bind(this)
  }

  componentWillMount() {
    getVouchers().then(async answer => {
      const json = await answer.json()
      this.setState({
        tableData: json.result,
        data: json.result,
        loading: false,
      })
    })
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
          const match = record.name.match(reg)
          if (!match) {
            return null
          }
          return {
            ...record,
            name: (
              <span>
                {record.name
                  .split(reg)
                  .map((text, i) =>
                    i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text,
                  )}
              </span>
            ),
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

  showCreateForm = () => {
    this.setState({
      createFormVisible: true,
    })
  }

  onCloseCreateForm = () => {
    this.setState({
      createFormVisible: false,
    })
  }

  refSearchInput = node => {
    this.searchInput = node
  }

  update(status = 'all') {
    this.setState({
      loading: true,
    })
    getVouchers(status)
      .then(async answer => {
        const json = await answer.json()
        this.setState({
          tableData: json.result,
          data: json.result,
          loading: false,
        })
      })
      .finally(() => {
        this.setState({
          loading: false,
        })
      })
  }

  render() {
    const { data, searchText, filterDropdownVisible, filtered, createFormVisible } = this.state
    const {
      intl: { formatMessage },
    } = this.props
    const removeVoucher = async id => {
      const req = await deleteVoucher(id)
      if (req.status === 204) {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'Vaucher.Voucher successfully removed!' }),
        })
        this.update()
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    }

    const markAsSent = async id => {
      const req = await sentVoucher(id)
      if (req.status === 200) {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: 'Voucher successfully marked!',
        })
        this.update()
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    }

    const accept = async id => {
      const req = await acceptVoucher(id)
      if (req.status === 200) {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'Vaucher.Voucher successfully accepted!' }),
        })
        this.update()
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    }

    const menu = (id, invoice = false, isPaid = false) => (
      <Menu style={{ padding: '0px' }}>
        {!invoice && (
          <Menu.Item
            key="accept"
            onClick={() => accept(id)}
            style={{ backgroundColor: 'LimeGreen', color: 'AliceBlue', fontWeight: 'bolder' }}
          >
            {formatMessage({ id: 'global.accept' })}
          </Menu.Item>
        )}
        {!isPaid && (
          <Menu.Item
            key="remove"
            onClick={() => removeVoucher(id)}
            style={{ backgroundColor: 'LightCoral', color: 'AliceBlue', fontWeight: 'bolder' }}
          >
            {formatMessage({ id: 'global.remove' })}
          </Menu.Item>
        )}
      </Menu>
    )

    const columns = [
      {
        title: formatMessage({ id: 'global.name' }),
        dataIndex: 'name',
        key: 'name',
        render: text => <span>{text}</span>,
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder={formatMessage({ id: 'Vaucher.Search name' })}
              value={searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch} style={{ marginTop: '5px' }}>
              {formatMessage({ id: 'Vaucher.Search' })}
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
        title: formatMessage({ id: 'global.phone' }),
        dataIndex: 'phone',
        key: 'phone',
        // sorter: (a, b) => a.phone - b.phone,
        render: text => <span>{text}</span>,
      },
      {
        title: formatMessage({ id: 'global.email' }),
        dataIndex: 'email',
        key: 'email',
        // sorter: (a, b) => a.email - b.email,
        render: text => <span>{text}</span>,
      },
      {
        title: formatMessage({ id: 'Vaucher.Meals' }),
        dataIndex: 'mealsPerDay',
        key: 'meals',
        sorter: (a, b) => a.meals - b.meals,
        render: text => <span>{text}</span>,
      },
      {
        title: formatMessage({ id: 'Vaucher.Days' }),
        dataIndex: 'days',
        key: 'days',
        render: text => <span>{`${text}`}</span>,
        sorter: (a, b) => a.days - b.days,
      },
      {
        title: formatMessage({ id: 'Vaucher.Price' }),
        dataIndex: 'price',
        key: 'price',
        render: text => <span>{`${text}`}</span>,
        sorter: (a, b) => a.price - b.price,
      },
      {
        title: formatMessage({ id: 'Vaucher.Code' }),
        dataIndex: 'promo',
        key: 'code',
        render: text => <span>{`${text.code}`}</span>,
      },
      {
        title: formatMessage({ id: 'Vaucher.Status' }),
        dataIndex: 'promo',
        key: 'status',
        render: text => (
          <span
            className={
              text.active === true
                ? 'font-size-12 badge badge-success'
                : 'font-size-12 badge badge-danger'
            }
          >
            {text.active
              ? formatMessage({ id: 'Vaucher.Active' })
              : formatMessage({ id: 'Vaucher.Disabled' })}
          </span>
        ),
        sorter: (a, b) => a.promo.active - b.promo.active,
      },
      {
        title: formatMessage({ id: 'Vaucher.Invoice' }),
        dataIndex: 'isPaid',
        key: 'isPaid',
        render: (text, record) => (
          <span
            className={
              text === true
                ? 'font-size-12 badge badge-success'
                : record.invoice
                ? 'font-size-12 badge badge-primary'
                : 'font-size-12 badge badge-default'
            }
          >
            {text
              ? 'Paid'
              : record.invoice
              ? formatMessage({ id: 'Vaucher.Pending' })
              : formatMessage({ id: 'Vaucher.None' })}
          </span>
        ),
        sorter: (a, b) => a.isPaid - b.isPaid,
      },
      {
        title: formatMessage({ id: 'Vaucher.Sent?' }),
        dataIndex: 'isSent',
        key: 'isSent',
        render: text => (
          <span
            className={
              text === true ? 'font-size-12 badge badge-success' : 'font-size-12 badge badge-danger'
            }
          >
            {text ? formatMessage({ id: 'global.yes' }) : formatMessage({ id: 'global.no' })}
          </span>
        ),
        sorter: (a, b) => a.isSent - b.isSent,
      },
      {
        title: formatMessage({ id: 'Vaucher.Action' }),
        dataIndex: 'id',
        key: 'action',
        render: (text, record) => (
          <span>
            <Dropdown.Button
              overlay={menu(text, record.invoice, record.isPaid)}
              onClick={() => markAsSent(text)}
            >
              {formatMessage({ id: 'Vaucher.Mark as sent' })}
            </Dropdown.Button>
          </span>
        ),
      },
    ]

    return (
      <Authorize
        roles={['root', 'admin', 'sales', 'salesDirector']}
        denied={['Dany']}
        redirect
        to="/main"
      >
        <Helmet title={formatMessage({ id: 'Vaucher.Vouchers' })} />
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="utils__title">
              <strong>{formatMessage({ id: 'Vaucher.Vouchers' })}</strong>
            </div>
            <Button type="primary" onClick={this.showCreateForm}>
              {formatMessage({ id: 'Vaucher.Create new Voucher' })}
            </Button>
          </div>
          <div className="card-body">
            <Table
              // className="utils__scrollTable"
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
        <CreateVoucherForm
          visible={createFormVisible}
          create={createVoucher}
          onClose={this.onCloseCreateForm}
          update={this.update}
        />
      </Authorize>
    )
  }
}

export default Vouchers
