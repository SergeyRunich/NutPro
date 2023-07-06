/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import Authorize from 'components/LayoutComponents/Authorize'
import { Table, Icon, Input, Button, Radio, notification } from 'antd'
import { Helmet } from 'react-helmet'

import CreatePromoForm from './CreatePromoForm'

import { getPromoCodes, removePromoCode, createPromoCode, editPromoCode } from '../../api/promo'

@injectIntl
class PromoCodes extends React.Component {
  state = {
    tableData: [],
    data: [],
    filterDropdownVisible: false,
    searchText: '',
    filtered: false,
    loading: true,
    status: 'all',
    createFormVisible: false,
    forEdit: {},
  }

  constructor(props) {
    super(props)

    this.onChangeStatus = this.onChangeStatus.bind(this)
    this.onCloseCreateForm = this.onCloseCreateForm.bind(this)
    this.update = this.update.bind(this)
  }

  componentWillMount() {
    getPromoCodes().then(async answer => {
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

  onSearch = () => {
    const { searchText, tableData } = this.state
    const reg = new RegExp(searchText, 'gi')
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      data: tableData
        .map(record => {
          const match = record.code.match(reg)
          if (!match) {
            return null
          }
          return {
            ...record,
            name: (
              <span>
                {record.code
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

  onChangeStatus(e) {
    try {
      this.setState({
        status: e.target.value,
      })
      this.update(e.target.value)
    } catch (error) {
      console.log(error)
    }
  }

  showDrawerCreateForm = () => {
    this.setState({
      createFormVisible: true,
    })
  }

  editPromo = forEdit => {
    this.setState({
      forEdit,
      createFormVisible: true,
    })
  }

  onCloseCreateForm = () => {
    this.setState({
      forEdit: {},
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
    getPromoCodes(status)
      .then(async answer => {
        const json = await answer.json()
        this.setState({
          tableData: json,
          data: json,
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
    const {
      data,
      searchText,
      filterDropdownVisible,
      filtered,
      status,
      createFormVisible,
      forEdit,
    } = this.state
    const {
      intl: { formatMessage },
    } = this.props
    const removePromo = async id => {
      const req = await removePromoCode(id)
      if (req.status === 204) {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'Promo.Promocode successfully removed!' }),
        })
        this.update()
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    }

    const columns = [
      {
        title: formatMessage({ id: 'Promo.Code' }),
        dataIndex: 'code',
        key: 'code',
        render: text => <span>{text}</span>,
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder={formatMessage({ id: 'Promo.Search name' })}
              value={searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch} style={{ marginTop: '5px' }}>
              {formatMessage({ id: 'Promo.Search' })}
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
        title: formatMessage({ id: 'Promo.Created' }),
        dataIndex: 'created',
        key: 'created',
        render: text => <span>{text}</span>,
      },
      {
        title: formatMessage({ id: 'Promo.expirationDate' }),
        dataIndex: 'expirationDate',
        key: 'expirationDate',
        render: text => <span>{text}</span>,
      },
      {
        title: formatMessage({ id: 'Promo.Type' }),
        dataIndex: 'type',
        key: 'type',
        render: text => <span>{text}</span>,
      },
      {
        title: formatMessage({ id: 'Promo.Amount' }),
        dataIndex: 'amount',
        key: 'amount',
        render: text => <span>{`${text}`}</span>,
        sorter: (a, b) => a.amount - b.amount,
      },
      {
        title: formatMessage({ id: 'Promo.Activations/Max activations' }),
        dataIndex: 'id',
        key: 'act/maxAct',
        render: (text, record) => {
          if (record.maxActivations !== 0) {
            return <span>{`${record.activations} / ${record.maxActivations}`}</span>
          }
          return <span>{`${record.activations}`}</span>
        },
      },
      {
        title: formatMessage({ id: 'Promo.Status' }),
        dataIndex: 'active',
        key: 'active',
        render: text => (
          <span
            className={
              text === true ? 'font-size-12 badge badge-success' : 'font-size-12 badge badge-danger'
            }
          >
            {text ? formatMessage({ id: 'Promo.Active' }) : formatMessage({ id: 'Promo.Disabled' })}
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'Promo.Access' }),
        dataIndex: 'access',
        key: 'access',
        render: text => <span>{`${text}`}</span>,
      },
      {
        title: formatMessage({ id: 'Promo.Deactivate after apply' }),
        dataIndex: 'deactivateAfterApply',
        key: 'deactivateAfterApply',
        render: text => {
          return <span>{text ? 'Yes' : 'No'}</span>
        },
      },
      {
        title: formatMessage({ id: 'Promo.Action' }),
        dataIndex: 'id',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              style={{ marginRight: '20px' }}
              type="primary"
              onClick={() => this.editPromo(record)}
            >
              {formatMessage({ id: 'global.edit' })}
            </Button>
            <Button type="danger" onClick={() => removePromo(text)}>
              {formatMessage({ id: 'global.remove' })}
            </Button>
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
        <Helmet title={formatMessage({ id: 'Promo.Promocodes' })} />
        <div className="card">
          <div className="card-body">
            <div style={{ float: 'left' }}>
              <h4>{formatMessage({ id: 'Promo.Status' })}</h4>
              <Radio.Group value={status} onChange={this.onChangeStatus}>
                <Radio.Button value="all">{formatMessage({ id: 'Promo.All' })}</Radio.Button>
                <Radio.Button value="active">{formatMessage({ id: 'Promo.Active' })}</Radio.Button>
                <Radio.Button value="disabled">
                  {formatMessage({ id: 'Promo.Disabled' })}
                </Radio.Button>
              </Radio.Group>
            </div>
            <div style={{ float: 'right' }}>
              <Button type="primary" onClick={this.showDrawerCreateForm}>
                {formatMessage({ id: 'Promo.Create promocode' })}
              </Button>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>{formatMessage({ id: 'Promo.Promocodes' })}</strong>
            </div>
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
        <CreatePromoForm
          visible={createFormVisible}
          create={createPromoCode}
          onClose={this.onCloseCreateForm}
          edit={editPromoCode}
          update={this.update}
          forEdit={forEdit}
        />
      </Authorize>
    )
  }
}

export default PromoCodes
