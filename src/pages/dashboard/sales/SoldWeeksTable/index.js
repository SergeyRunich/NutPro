import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Table } from 'antd'

const SoldWeeksTable = ({ data }) => {
  const [columns, setColumns] = useState([])
  const [rows, setRows] = useState([])

  useEffect(() => {
    if (data?.columns) {
      setColumns(
        data.columns.map(title => ({
          title,
          dataIndex: title,
        })),
      )
    }
    if (data?.rows) {
      setRows(
        data.rows.map(({ values }, rowIndex) => {
          const row = {}
          data.columns.forEach((dataIndex, colIndex) => {
            if (rowIndex === 0 && colIndex === 0) {
              row[dataIndex] = 'Total'
            } else if (colIndex === 0) {
              row[dataIndex] = moment.unix(values[colIndex]).format('DD.MM.YYYY')
            } else {
              row[dataIndex] = values[colIndex]
            }
          })
          return row
        }),
      )
    }
  }, [data.columns, data.rows])

  return (
    <div>
      <Table
        tableLayout="auto"
        scroll={{ x: '100%' }}
        columns={columns}
        dataSource={rows}
        size="small"
        rowKey={() => Math.random().toString()}
        pagination={{
          position: 'bottom',
          total: rows.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '200'],
          hideOnSinglePage: rows.length < 10,
        }}
      />
    </div>
  )
}

export default SoldWeeksTable
