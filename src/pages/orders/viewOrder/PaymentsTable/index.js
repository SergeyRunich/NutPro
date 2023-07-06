/* eslint-disable react/destructuring-assignment */
/* eslint-disable camelcase */
import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
// import { Link } from 'react-router-dom'
import { Table, Popover, Tag } from 'antd'

@injectIntl
class PaymentsTable extends React.Component {
  transformTableData = data => {
    return data.map(payment => {
      if (payment.parent_payment) {
        const parent = data?.find(i => i.id === payment?.parent_payment)
        payment.parent_payment_id = parent?.payment_id
      }
      if (payment.status === 'PAID' && payment.gw === 'GoPay') {
        const parent = data?.find(i => i.parent_payment === payment.id)
        payment.payment_number = parent?.payment_number
        payment.gw_url = parent?.gw_url
      }
      return payment
    })
  }

  render() {
    const {
      data,
      intl: { formatMessage },
    } = this.props

    const transformedTableData = this.transformTableData(data)

    const columns = [
      {
        title: formatMessage({ id: 'Payments.Created' }),
        align: 'center',
        dataIndex: 'created',
        key: 'created',
        render: (text, record) => {
          if (record.updated !== '') {
            const content = (
              <div>
                <p>{moment(record.updated).format('DD.MM.YYYY HH:mm')}</p>
              </div>
            )
            return (
              <Popover content={content} title="Date of update">
                <span>{moment(record.created).format('DD.MM.YYYY HH:mm')}</span>
              </Popover>
            )
          }
          return <span>{moment(record.created).format('DD.MM.YYYY HH:mm')}</span>
        },
      },
      {
        title: formatMessage({ id: 'Payments.PaymentID' }),
        align: 'center',
        dataIndex: 'payment_id',
        key: 'payment_id',
        render: text => {
          return <span>{text}</span>
        },
      },
      {
        title: formatMessage({ id: 'Payments.PaymentLink' }),
        align: 'center',
        dataIndex: 'payment_number',
        key: 'payment_number',
        render: (text, record) => {
          let paymentLink = ''
          if (text) {
            paymentLink = text
          } else if (record.gw_url) {
            paymentLink = 'GoPay Link'
          }
          return (
            <a href={record.gw_url} target="_blank" rel="noopener noreferrer">
              {paymentLink}
            </a>
          )
        },
      },
      {
        title: formatMessage({ id: 'Payments.Duplicate Fakturoid Invoice' }),
        align: 'center',
        dataIndex: 'parent_payment',
        key: 'parent_payment',
        render: (text, record) => {
          return <span>{record.parent_payment_id || '-'}</span>
        },
      },
      {
        title: formatMessage({ id: 'Payments.Amount' }),
        align: 'center',
        dataIndex: 'amount',
        key: 'amount',
        render: text => <span>{text}</span>,
      },
      {
        title: formatMessage({ id: 'Payments.Currency' }),
        align: 'center',
        dataIndex: 'currency',
        key: 'currency',
        render: text => <span>{text}</span>,
      },
      {
        title: formatMessage({ id: 'Payments.Status' }),
        align: 'center',
        dataIndex: 'status',
        key: 'status',
        render: text => <span>{text}</span>,
      },
      {
        title: formatMessage({ id: 'Payments.gateway' }),
        align: 'center',
        dataIndex: 'gw',
        key: 'gw',
        render: text => <span>{text}</span>,
      },
      {
        title: formatMessage({ id: 'Payments.PaymentMethod' }),
        align: 'center',
        dataIndex: 'payment_instrument',
        key: 'payment_instrument',
        render: (text, record) => {
          if (record.parent_payment_id) {
            return <Tag color="blue">{formatMessage({ id: 'Payments.Paid by GoPay' })}</Tag>
          }
          return text
        },
      },
    ]

    return (
      <div>
        <Table
          className="utils__scrollTable"
          tableLayout="auto"
          scroll={{ x: '100%' }}
          columns={columns}
          dataSource={transformedTableData}
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
      </div>
    )
  }
}

export default PaymentsTable
