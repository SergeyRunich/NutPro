/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Link, withRouter } from 'react-router-dom'
import { Drawer, Table, Rate } from 'antd'

@injectIntl
@withRouter
class DishDetails extends React.Component {
  constructor(props) {
    super(props)

    this.closeDrawer = this.closeDrawer.bind(this)
  }

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

    const columns = [
      {
        title: formatMessage({ id: 'Rating.Client' }),
        dataIndex: 'name',
        key: 'name',
        // sorter: (a, b) => a.user.name - b.user.name,
        render: (text, record) => <Link to={`/users/${record.id}`}>{` ${text}`}</Link>,
      },
      {
        title: formatMessage({ id: 'Rating.Score' }),
        dataIndex: 'score',
        key: 'score',
        render: text => <span>{`${text}`}</span>,
      },
      {
        title: formatMessage({ id: 'Rating.Day' }),
        dataIndex: 'day',
        key: 'day',
        render: text => <span>{`${moment.unix(text).format('DD.MM.YYYY')}`}</span>,
      },
      {
        title: formatMessage({ id: 'Rating.Kitchen' }),
        dataIndex: 'kitchen',
        key: 'kitchen',
        render: text => <span>{text}</span>,
      },
      {
        title: formatMessage({ id: 'global.date' }),
        dataIndex: 'date',
        key: 'date',
        render: text => <span>{`${moment(text).format('DD.MM.YYYY HH:mm')}`}</span>,
      },
      {
        title: formatMessage({ id: 'Rating.Review' }),
        dataIndex: 'review',
        key: 'review',
        render: text => <span>{`${text}`}</span>,
      },
    ]
    return (
      <div>
        <Drawer
          title="Rating details"
          width="100%"
          onClose={this.closeDrawer}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          {data.dish && (
            <div>
              <h1>{data.dish.title}</h1>
              <div style={{ float: 'right', marginBottom: '5px' }}>
                <Rate
                  style={{ color: '#2fa037' }}
                  defaultValue={Number(data.scores.average)}
                  allowHalf
                  disabled
                />
                <span style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: '18px' }}>
                  {data.scores.average} ({data.scores.count})
                </span>
              </div>
            </div>
          )}

          <Table
            className="utils__scrollTable"
            tableLayout="auto"
            scroll={{ x: '100%' }}
            columns={columns}
            dataSource={data}
            pagination={{
              defaultPageSize: 100,
              position: 'bottom',
              total: data.length,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              showSizeChanger: true,
              pageSizeOptions: ['100', '200', '300', '400', '500', '1000'],
              hideOnSinglePage: data.length <= 100,
            }}
            rowKey={() => Math.random()}
          />
          {data.length <= 100 && (
            <strong style={{ float: 'right', marginTop: '20px' }}>
              {formatMessage({ id: 'STF.Total items:' })} {data.length}
            </strong>
          )}
        </Drawer>
      </div>
    )
  }
}

export default DishDetails
