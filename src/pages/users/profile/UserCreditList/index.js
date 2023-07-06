/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Table } from 'antd'
import moment from 'moment'

const UserCreditList = ({ creditBalanceHistory }) => {
  const [creditBalance, setCreditBalance] = useState([])
  const { formatMessage } = useIntl()

  useEffect(() => {
    setCreditBalance(creditBalanceHistory.history)
  }, [creditBalanceHistory])

  const columns = [
    {
      title: formatMessage({ id: 'Users.Action' }),
      dataIndex: 'action',
      render: action => {
        return <span>{action}</span>
      },
    },
    {
      title: formatMessage({ id: 'global.date' }),
      dataIndex: 'date',
      render: date => {
        return <span>{moment.utc(date).format('L')}</span>
      },
    },
    {
      title: formatMessage({ id: 'Users.Amount' }),
      dataIndex: 'amount',
      render: amount => {
        return <span style={{ color: amount > 0 ? 'green' : 'red' }}>{amount} Kč</span>
      },
    },
    {
      title: formatMessage({ id: 'Users.Initial balance' }),
      dataIndex: 'initial_balance',
      render: initialBalance => {
        return <span>{initialBalance} Kč</span>
      },
    },
    {
      title: formatMessage({ id: 'Users.Final balance' }),
      dataIndex: 'final_balance',
      render: finalBalance => {
        return <span>{finalBalance} Kč</span>
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
        dataSource={creditBalance}
        pagination={{
          position: 'bottom',
          total: creditBalance && creditBalance.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '200'],
          hideOnSinglePage: creditBalance && creditBalanceHistory.length < 10,
        }}
        rowKey={() => Math.random().toString()}
      />
    </div>
  )
}

export default UserCreditList
