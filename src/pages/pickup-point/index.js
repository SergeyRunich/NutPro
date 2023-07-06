import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import Authorize from 'components/LayoutComponents/Authorize'
import { Table, Icon, Input, Button, notification, Dropdown, Menu } from 'antd'
import { Helmet } from 'react-helmet'

import CreatePointForm from './CreatePointForm'
import PickupPointMacro from './PickupPointMacro'

import {
  getPickupPoints,
  // deletePickupPoint,
  createPickupPoint,
  updatePickupPoint,
  getPickupPointByDate,
} from '../../api/pickupPoint'

@injectIntl
class PickupPoints extends React.Component {
  state = {
    tableData: [],
    data: [],
    filterDropdownVisible: false,
    searchText: '',
    filtered: false,
    loading: true,
    // status: 'all',
    createFormVisible: false,
    forEdit: {},
    start: moment().format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
    PickupPointMacroVisible: false,
    ppOrdersByDate: [],
    currentPpCapacity: 0,
    currentPpId: '',
    tableLoading: true,
  }

  constructor(props) {
    super(props)

    // this.onChangeStatus = this.onChangeStatus.bind(this)
    this.onCloseCreateForm = this.onCloseCreateForm.bind(this)
    this.onClosePickupPointMacro = this.onClosePickupPointMacro.bind(this)
    this.update = this.update.bind(this)
    this.showPickupPoint = this.showPickupPoint.bind(this)
  }

  componentWillMount() {
    getPickupPoints().then(async answer => {
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

  showCreateForm = (forEdit = {}) => {
    this.setState({
      forEdit,
      createFormVisible: true,
    })
  }

  showPickupPoint = async (id, record) => {
    this.setState({
      PickupPointMacroVisible: true,
      currentPpCapacity: record.orderCapacity,
      currentPpId: record.id,
      tableLoading: true,
    })
    const { start, end } = this.state
    const req = await getPickupPointByDate(id, start, end)
    const json = await req.json()
    if (req.status === 200) {
      this.setState({
        ppOrdersByDate: json.result[0].orders,
        tableLoading: false,
      })
    }
  }

  handleChangeDate = date => {
    this.setState({
      start: moment(date).format('YYYY-MM-DD'),
      end: moment(date).format('YYYY-MM-DD'),
    })
  }

  showPickupPointNewDate = async () => {
    this.setState({
      tableLoading: true,
    })
    const { currentPpId, start, end } = this.state
    const req = await getPickupPointByDate(currentPpId, start, end)
    // eslint-disable-next-line no-unused-vars
    const json = await req.json()
    if (req.status === 200) {
      this.setState({
        ppOrdersByDate: json.result[0].orders,
        tableLoading: false,
      })
    }
  }

  onClosePickupPointMacro = () => {
    this.setState({
      PickupPointMacroVisible: false,
      start: moment().format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
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
    getPickupPoints(status)
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
    const {
      data,
      searchText,
      filterDropdownVisible,
      filtered,
      createFormVisible,
      PickupPointMacroVisible,
      forEdit,
      ppOrdersByDate,
      currentPpCapacity,
      start,
      end,
      tableLoading,
    } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    const changeStatus = async (id, record) => {
      const onSendData = {
        isActive: !record.isActive,
        name: record.name,
        address: record.address,
        orderCapacity: record.orderCapacity,
      }
      const req = await updatePickupPoint(id, onSendData)
      if (req.status === 200) {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'PickUpPoint.Pick-up point successfully changed!' }),
        })
        this.update()
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    }

    // eslint-disable-next-line no-unused-vars
    const menu = (id, isActive = false, record, deleted = false) => (
      <Menu style={{ padding: '0px' }}>
        <Menu.Item
          key="accept"
          onClick={() => changeStatus(id, record, isActive)}
          style={{
            backgroundColor: isActive ? 'LightCoral' : 'LimeGreen',
            color: 'AliceBlue',
            fontWeight: 'bolder',
          }}
        >
          {isActive
            ? formatMessage({ id: 'PickUpPoint.Disable' })
            : formatMessage({ id: 'PickUpPoint.Enable' })}
        </Menu.Item>
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
              placeholder={formatMessage({ id: 'PickUpPoint.Search name' })}
              value={searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch} style={{ marginTop: '5px' }}>
              {formatMessage({ id: 'PickUpPoint.Search' })}
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
        title: formatMessage({ id: 'global.address' }),
        dataIndex: 'address',
        key: 'address',
        // sorter: (a, b) => a.phone - b.phone,
        render: text => <span>{text}</span>,
      },
      {
        title: formatMessage({ id: 'PickUpPoint.Creation' }),
        dataIndex: 'creationDate',
        key: 'creationDate',
        // sorter: (a, b) => a.phone - b.phone,
        render: creationDate => <span>{moment(creationDate).format('DD.MM.YYYY')}</span>,
      },
      {
        title: formatMessage({ id: 'PickUpPoint.Status' }),
        dataIndex: 'isActive',
        key: 'isActive',
        render: isActive => (
          <span
            className={
              isActive ? 'font-size-12 badge badge-success' : 'font-size-12 badge badge-danger'
            }
          >
            {isActive
              ? formatMessage({ id: 'PickUpPoint.Active' })
              : formatMessage({ id: 'PickUpPoint.Inactive' })}
          </span>
        ),
        sorter: (a, b) => a.isActive - b.isActive,
      },
      {
        title: formatMessage({ id: 'PickUpPoint.orderCapacity' }),
        dataIndex: 'orderCapacity',
        key: 'orderCapacity',
        // sorter: (a, b) => a.phone - b.phone,
        render: orderCapacity => <span>{orderCapacity}</span>,
      },
      {
        title: formatMessage({ id: 'PickUpPoint.Action' }),
        dataIndex: 'id',
        key: 'action',
        render: (id, record) => (
          <span>
            <Button
              style={{ marginRight: '15px' }}
              overlay={menu(id, record.isActive, record.deleted)}
              onClick={() => this.showPickupPoint(id, record)}
            >
              {formatMessage({ id: 'PickUpPoint.View' })}
            </Button>
            <Dropdown.Button
              overlay={menu(id, record.isActive, record, record.deleted)}
              onClick={() =>
                this.showCreateForm({
                  name: record.name,
                  address: record.address,
                  isActive: record.isActive,
                  orderCapacity: record.orderCapacity,
                  id,
                })
              }
            >
              {formatMessage({ id: 'global.edit' })}
            </Dropdown.Button>
          </span>
        ),
      },
    ]

    return (
      <Authorize
        roles={['root', 'admin', 'salesDirector']}
        denied={['Dany', 'Jan']}
        redirect
        to="/main"
      >
        <Helmet title={formatMessage({ id: 'PickUpPoint.Pick-up points' })} />
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="utils__title">
              <strong>{formatMessage({ id: 'PickUpPoint.Pick-up points' })}</strong>
            </div>
            <Button type="primary" onClick={this.showCreateForm}>
              {formatMessage({ id: 'PickUpPoint.Create new Pick-up point' })}
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
        <CreatePointForm
          visible={createFormVisible}
          create={createPickupPoint}
          change={updatePickupPoint}
          onClose={this.onCloseCreateForm}
          update={this.update}
          forEdit={forEdit}
        />
        <PickupPointMacro
          visible={PickupPointMacroVisible}
          onClose={this.onClosePickupPointMacro}
          orders={ppOrdersByDate}
          currentPpCapacity={currentPpCapacity}
          showPickupPointNewDate={this.showPickupPointNewDate}
          start={start}
          end={end}
          handleChangeDate={this.handleChangeDate}
          loading={tableLoading}
        />
      </Authorize>
    )
  }
}

export default PickupPoints
