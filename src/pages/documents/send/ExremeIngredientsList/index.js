import React from 'react'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Drawer, Table, Tag } from 'antd'

@injectIntl
@withRouter
class ExremeIngredientsList extends React.Component {
  state = {
    data: [],
  }

  constructor(props) {
    super(props)

    this.closeDrawer = this.closeDrawer.bind(this)
  }

  componentWillReceiveProps() {
    const { data } = this.props
    this.setState({
      data,
    })
  }

  closeDrawer() {
    const { onClose } = this.props
    onClose()
  }

  render() {
    const {
      visible,
      intl: { formatMessage },
    } = this.props
    const { data } = this.state

    const columns = [
      {
        title: formatMessage({ id: 'ExremeIngredientsList.Ingredient' }),
        dataIndex: 'ingredient',
        key: 'ingredient',
        render: ingredient => ingredient,
      },
      {
        title: formatMessage({ id: 'ExremeIngredientsList.Total' }),
        dataIndex: 'total',
        key: 'total',
        render: (total, record) => `${total} ${record.unit}`,
        sorter: (a, b) => a.total - b.total,
      },
      {
        title: formatMessage({ id: 'ExremeIngredientsList.Min(g)' }),
        dataIndex: 'min',
        key: 'min',
        render: min => min,
        sorter: (a, b) => a.min - b.min,
      },
      {
        title: formatMessage({ id: 'ExremeIngredientsList.Max(g)' }),
        dataIndex: 'max',
        key: 'max',
        render: max => max,
        sorter: (a, b) => a.max - b.max,
      },
      {
        title: formatMessage({ id: 'ExremeIngredientsList.Avg.' }),
        dataIndex: 'avgPerCustomer',
        key: 'avgPerCustomer',
        render: avgPerCustomer => {
          return (
            <Tag color="geekblue" key={Math.random()}>
              {avgPerCustomer}
            </Tag>
          )
        },
        sorter: (a, b) => a.avgPerCustomer - b.avgPerCustomer,
      },
      {
        title: formatMessage({ id: 'ExremeIngredientsList.Customers' }),
        dataIndex: 'customers',
        key: 'customers',
        render: customers => customers,
      },
    ]
    return (
      <div>
        <Drawer
          title={formatMessage({ id: 'ExremeIngredientsList.ExtremeIngredients' })}
          width="50%"
          onClose={this.closeDrawer}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
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
        </Drawer>
      </div>
    )
  }
}

export default ExremeIngredientsList
