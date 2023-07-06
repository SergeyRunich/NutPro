import React from 'react'
import { injectIntl } from 'react-intl'
import { Link, withRouter } from 'react-router-dom'
import { Table, Tag, Result, notification, Button, Popconfirm, Divider } from 'antd'
import { regenerateOrder, regenerateAllOrders } from '../../../../../api/order'

@injectIntl
@withRouter
class OrderList extends React.Component {
  state = {
    regenerated: [],
    regeneration: false,
    regenerateAllLoading: false,
  }

  regenerate(id, i) {
    const { regenerated } = this.state
    regenerateOrder(id).then(r => {
      if (r.ok) {
        regenerated.push(i)
        this.setState({ regenerated })
      } else {
        notification.error({
          message: `Error code: ${r.status}`,
        })
      }
    })
  }

  regenerateAll(ids) {
    this.setState({ regenerateAllLoading: true })
    regenerateAllOrders(ids).then(r => {
      if (r.ok) {
        this.setState({
          regeneration: true,
          regenerateAllLoading: false,
        })
      } else {
        notification.error({
          message: `Error code: ${r.status}`,
        })
      }
    })
  }

  render() {
    const {
      data,
      title,
      regenButton,
      intl: { formatMessage },
    } = this.props
    const { regenerated, regeneration, regenerateAllLoading } = this.state

    const regArray = { orderId: data.map(o => o.id) }

    const columns = [
      {
        title: formatMessage({ id: 'global.name' }),
        dataIndex: 'id',
        key: 'name',
        render: (id, record) => <Link to={`/orders/${id}`}>{` ${record.user.name}`}</Link>,
      },
      {
        title: formatMessage({ id: 'KitchenOrderList.Kitchen' }),
        dataIndex: 'kitchen',
        key: 'kitchen',
        render: kitchen => <span>{`${kitchen}`}</span>,
      },
      {
        title: formatMessage({ id: 'KitchenOrderList.Meals' }),
        dataIndex: 'mealsPerDay',
        key: 'meals',
        render: mealsPerDay => <span>{`${mealsPerDay}`}</span>,
        sorter: (a, b) => a.mealsPerDay - b.mealsPerDay,
      },
      {
        title: formatMessage({ id: 'KitchenOrderList.Week' }),
        dataIndex: 'size',
        key: 'size',
        render: size => <span>{`${size}`}</span>,
      },
      {
        title: formatMessage({ id: 'KitchenOrderList.Skip#' }),
        dataIndex: 'ignoredMealTypes',
        key: 'ignoredMealTypes',
        render: ignoredMealTypes => <span>{`${ignoredMealTypes.length || '-'}`}</span>,
      },
      {
        title: formatMessage({ id: 'KitchenOrderList.Tags' }),
        dataIndex: 'tags',
        key: 'tags',
        render: tags => {
          return tags.map(tag => (
            <Tag color="cyan" key={Math.random()}>
              {tag}
            </Tag>
          ))
        },
      },
    ]

    if (regenButton) {
      columns.push({
        title: '---',
        dataIndex: 'id',
        key: 'remove',
        render: (id, _, i) => (
          <>
            {regenerated.indexOf(i) === -1 && (
              <Popconfirm
                title="Are you sure?"
                onConfirm={() => this.regenerate(id, i)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary">
                  {formatMessage({ id: 'KitchenOrderList.Regenerate' })}
                </Button>
              </Popconfirm>
            )}
            {regenerated.indexOf(i) !== -1 && (
              <Tag color="green">{formatMessage({ id: 'KitchenOrderList.Regenerated' })}</Tag>
            )}
          </>
        ),
      })
    }

    return (
      <div className="card card--fullHeight">
        <div className="card-header">
          <div className="utils__title utils__title--flat">
            <strong className="text-uppercase font-size-16">{title || ''}</strong>
          </div>
        </div>
        <div className="card-body">
          {title && title === 'Missing orders' && regArray.orderId.length ? (
            <Divider>
              <Button
                type="primary"
                loading={regenerateAllLoading}
                onClick={() => this.regenerateAll(regArray)}
              >
                {formatMessage({ id: 'KitchenOrderList.RegenerateAll' })}
              </Button>
            </Divider>
          ) : (
            ''
          )}
          {data.length !== 0 && !regeneration && (
            <Table
              className="utils__scrollTable"
              tableLayout="auto"
              scroll={{ x: '100%' }}
              columns={columns}
              dataSource={data}
              pagination={{
                position: 'bottom',
                total: data.length,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100', '200'],
                hideOnSinglePage: data.length < 10,
              }}
              rowKey={() => Math.random()}
            />
          )}
          {title === 'Missing orders' && regeneration ? (
            <Result
              status="success"
              title={formatMessage({ id: 'KitchenOrderList.RegenerationInProgress' })}
            />
          ) : (
            data.length === 0 && (
              <Result
                status="success"
                title={formatMessage({ id: 'KitchenOrderList.SuccessfullyChecked!' })}
              />
            )
          )}
        </div>
      </div>
    )
  }
}

export default OrderList
