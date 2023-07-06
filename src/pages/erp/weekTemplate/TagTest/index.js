/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
import React from 'react'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Drawer, Table, Tag } from 'antd'

@injectIntl
@withRouter
class TagTest extends React.Component {
  // state = {
  //   data: [],
  // };

  constructor(props) {
    super(props)

    this.closeDrawer = this.closeDrawer.bind(this)
  }

  // componentWillReceiveProps() {
  //   const { data } = this.props
  //    this.setState({
  //      data,
  //    })
  // }

  closeDrawer() {
    const { onClose } = this.props
    onClose()
  }

  render() {
    const {
      visible,
      data,
      intl: { formatMessage },
    } = this.props
    // const { data } = this.state
    const meals = ['Завтрак', '1 Перекус', 'Обед', '2 Перекус', 'Ужин']
    const columns = [
      {
        title: formatMessage({ id: 'TagTest.Meal' }),
        dataIndex: 'meal',
        key: 'meal',
        render: text => <span>{`${meals[text]}`}</span>,
        sorter: (a, b) => a.meal - b.meal,
      },
      {
        title: formatMessage({ id: 'TagTest.Tag' }),
        dataIndex: 'tag',
        key: 'tag',
        render: text => text.ru,
        sorter: (a, b) => a.tag.id - b.tag.id,
      },
      {
        title: formatMessage({ id: 'TagTest.Tuesday' }),
        dataIndex: 'amount',
        key: 'day2',
        render: (text, record) => {
          const color = text === record.count ? 'green' : 'red'
          return <Tag color={color}>{`${record.count}/${text}`}</Tag>
        },
      },
    ]
    return (
      <div>
        <Drawer
          title={formatMessage({ id: 'TagTest.TagWeekTest' })}
          width="100%"
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
            pagination={false}
            rowKey={() => Math.random()}
          />
        </Drawer>
      </div>
    )
  }
}

export default TagTest
