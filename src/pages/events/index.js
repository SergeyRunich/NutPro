/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Link, withRouter } from 'react-router-dom'
import moment from 'moment'
import Authorize from 'components/LayoutComponents/Authorize'
import { Table, Dropdown, Menu, Button } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { getEvents, deleteOrder, approveEvent } from '../../api/order'
import CreateEvent from './CreateEvent'

@injectIntl
@withRouter
@connect(({ user }) => ({ user }))
class Orders extends React.Component {
  state = {
    data: [],
    loading: true,
    createTemplateFormVisible: false,
    forEdit: {},
  }

  constructor(props) {
    super(props)

    this.update = this.update.bind(this)
  }

  componentWillMount() {
    getEvents().then(async answer => {
      if (answer.ok) {
        const json = await answer.json()
        this.setState({
          data: json,
          loading: false,
        })
      }
    })
  }

  createEventForm = () => {
    this.setState({
      createTemplateFormVisible: true,
    })
  }

  editEventForm = forEdit => {
    this.setState({
      forEdit,
      createTemplateFormVisible: true,
    })
  }

  closeEditForm = () => {
    this.setState({
      createTemplateFormVisible: false,
      forEdit: {},
    })
  }

  update() {
    this.setState({
      loading: true,
    })
    getEvents()
      .then(async answer => {
        if (answer.ok) {
          const json = await answer.json()
          this.setState({
            data: json,
            loading: false,
          })
        }
      })
      .finally(() => {
        this.setState({
          loading: false,
        })
      })
  }

  render() {
    const { data, createTemplateFormVisible, forEdit } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    const menu = (id, isActive) => (
      <Menu style={{ padding: '0px' }}>
        <Menu.Item key="view">
          <Link to={`/orders/${id}`}>{formatMessage({ id: 'Events.View' })}</Link>
        </Menu.Item>
        <Menu.Item
          key="view"
          onClick={async () => {
            await deleteOrder(id)
            this.update()
          }}
        >
          {formatMessage({ id: 'Events.Delete' })}
        </Menu.Item>
        {!isActive && (
          <Menu.Item
            key="view"
            onClick={async () => {
              await approveEvent(id)
              this.update()
            }}
          >
            <Authorize roles={['root', 'salesDirector']}>
              {formatMessage({ id: 'Events.Approve' })}
            </Authorize>
          </Menu.Item>
        )}
      </Menu>
    )

    const badgeColor = {
      accepted: 'success',
      rejected: 'danger',
      new: 'primary',
      waitingPayment: 'info',
      fromWeb: 'info',
      incomplete: 'warning',
    }

    const columns = [
      {
        title: formatMessage({ id: 'Events.CreatedDate' }),
        dataIndex: 'id',
        key: 'createdDate',
        render: text => (
          <span>
            {`${moment.unix(parseInt(text.substring(0, 8), 16)).format('DD.MM.YYYY HH:mm')}`}
          </span>
        ),
        sorter: (a, b) => parseInt(a.id.substring(0, 8), 16) - parseInt(b.id.substring(0, 8), 16),
      },
      {
        title: formatMessage({ id: 'Events.Description' }),
        dataIndex: 'kitchenDescription',
        key: 'desc',
        render: text => {
          return <span>{text}</span>
        },
      },
      {
        title: formatMessage({ id: 'global.date' }),
        dataIndex: 'timestamp',
        key: 'startDate',
        render: text => {
          return <span>{moment.unix(text).format('DD.MM.YYYY')}</span>
        },
        sorter: (a, b) => a.timestamp - b.timestamp,
      },
      {
        title: formatMessage({ id: 'Events.Status' }),
        dataIndex: 'eventMenu',
        key: 'status',
        render: text => (
          <span
            className={`font-size-12 badge badge-${
              text.isActive ? badgeColor.accepted : badgeColor.new
            }`}
          >
            {text.isActive
              ? formatMessage({ id: 'Events.Approved' })
              : formatMessage({ id: 'Events.New' })}
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'Events.Action' }),
        dataIndex: 'id',
        key: 'action',
        render: (id, record) => (
          <span>
            <Dropdown.Button
              overlay={menu(id, record.eventMenu.isActive)}
              onClick={() => this.editEventForm(record)}
            >
              {formatMessage({ id: 'global.edit' })}
            </Dropdown.Button>
          </span>
        ),
      },
    ]

    return (
      <Authorize roles={['root', 'admin', 'production', 'salesDirector']} redirect to="/main">
        <Helmet title="Events" />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>{formatMessage({ id: 'Events.Events' })}</strong>
            </div>
          </div>
          <div className="card-body">
            <Button type="primary" onClick={this.createEventForm} style={{ marginBottom: '15px' }}>
              {formatMessage({ id: 'Events.NewEvent' })}
            </Button>
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
        <CreateEvent
          visible={createTemplateFormVisible}
          onClose={this.closeEditForm}
          data={data}
          forEdit={forEdit}
          update={this.update}
        />
      </Authorize>
    )
  }
}

export default Orders
