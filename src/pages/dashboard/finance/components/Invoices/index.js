/* eslint-disable no-restricted-globals */
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Link, withRouter } from 'react-router-dom'
import { Table, Statistic } from 'antd'

function Invoices(data) {
  const columns = [
    {
      title: <FormattedMessage id="global.date" />,
      dataIndex: 'date',
      key: 'date',
      render: (text, record) => (
        <span>
          <Link to={`/orders/${record.id}`}>{text}</Link>
        </span>
      ),
      sorter: (a, b) => a.date.length - b.date.length,
    },
    {
      title: <FormattedMessage id="global.name" />,
      dataIndex: 'user',
      key: 'name',
      // sorter: (a, b) => a.user.name - b.user.name,
      render: text => <Link to={`/users/${text.id}`}>{text.name}</Link>,
    },
    {
      title: <FormattedMessage id="Invoices.Length" />,
      dataIndex: 'length',
      key: 'length',
      render: text => {
        return <span>{text}</span>
      },
      sorter: (a, b) => a.length - b.length,
    },
    {
      title: <FormattedMessage id="Invoices.Price" />,
      dataIndex: 'total',
      key: 'totalPrice',
      render: text => `${Math.round(text)} Kč`,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: <FormattedMessage id="Invoices.DueOn" />,
      dataIndex: 'due',
      key: 'due',
      render: text => text,
      sorter: (a, b) => a.due.length - b.due.length,
    },
    {
      title: <FormattedMessage id="Invoices.Invoice" />,
      dataIndex: 'invoice',
      key: 'invoice',
      render: text => {
        return (
          <a href={text} target="blank">
            Faktura
          </a>
        )
      },
    },
  ]

  return (
    <div>
      {data.totalAmount && (
        <div className="row">
          <div className="col-lg-12">
            <div className="card card--fullHeight">
              <div className="card-body">
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={<FormattedMessage id="Invoices.Orders" />}
                      value={data.result.length}
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={<FormattedMessage id="Invoices.TotalDays" />}
                      value={data.totalDays}
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={<FormattedMessage id="Invoices.AverageAmountPerDay" />}
                      value={(data.totalAmount / data.totalDays).toFixed(2)}
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={<FormattedMessage id="Invoices.TotalAmount" />}
                      value={data.totalAmount}
                      suffix="Kč"
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={<FormattedMessage id="Invoices.AverageAmountPerOrder" />}
                      value={Math.round(data.totalAmount / data.result.length)}
                      suffix="Kč"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Table
        className="utils__scrollTable"
        tableLayout="auto"
        scroll={{ x: '100%' }}
        columns={columns}
        dataSource={data.result}
        pagination={{
          position: 'bottom',
          total: data && data.result ? data.result.length : 0,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '200'],
          hideOnSinglePage: data && data.result && data.result.length < 10,
        }}
        rowKey={() => Math.random()}
      />
    </div>
  )
}

export default withRouter(injectIntl(Invoices))
