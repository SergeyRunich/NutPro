import React from 'react'
import { Table, Tag } from 'antd'

function MarginByMonth({ data }) {
  const columns = [
    {
      title: '',
      dataIndex: 'title',
      key: 'title',
      render: title => <strong>{title}</strong>,
    },
    {
      title: data.months ? data.months[0] : '-',
      dataIndex: 'month5',
      key: 'month5',
      render: (text, _, i) => {
        if (i === 8 || i === 10) {
          return <strong>{text}</strong>
        }
        if (i === 1 || i === 7) {
          return (
            <Tag color="blue" key={Math.random()}>
              {text}
            </Tag>
          )
        }
        if (i === 3 || i === 5 || i === 9) {
          return (
            <Tag color="green" key={Math.random()}>
              {text}
            </Tag>
          )
        }
        return text
      },
    },
    {
      title: data.months ? data.months[1] : '-',
      dataIndex: 'month4',
      key: 'month4',
      render: (text, _, i) => {
        if (i === 8 || i === 10) {
          return <strong>{text}</strong>
        }
        if (i === 1 || i === 7) {
          return (
            <Tag color="blue" key={Math.random()}>
              {text}
            </Tag>
          )
        }
        if (i === 3 || i === 5 || i === 9) {
          return (
            <Tag color="green" key={Math.random()}>
              {text}
            </Tag>
          )
        }
        return text
      },
    },
    {
      title: data.months ? data.months[2] : '-',
      dataIndex: 'month3',
      key: 'month3',
      render: (text, _, i) => {
        if (i === 8 || i === 10) {
          return <strong>{text}</strong>
        }
        if (i === 1 || i === 7) {
          return (
            <Tag color="blue" key={Math.random()}>
              {text}
            </Tag>
          )
        }
        if (i === 3 || i === 5 || i === 9) {
          return (
            <Tag color="green" key={Math.random()}>
              {text}
            </Tag>
          )
        }
        return text
      },
    },
    {
      title: data.months ? data.months[3] : '-',
      dataIndex: 'month2',
      key: 'month2',
      render: (text, _, i) => {
        if (i === 8 || i === 10) {
          return <strong>{text}</strong>
        }
        if (i === 1 || i === 7) {
          return (
            <Tag color="blue" key={Math.random()}>
              {text}
            </Tag>
          )
        }
        if (i === 3 || i === 5 || i === 9) {
          return (
            <Tag color="green" key={Math.random()}>
              {text}
            </Tag>
          )
        }
        return text
      },
    },
    {
      title: data.months ? data.months[4] : '-',
      dataIndex: 'month1',
      key: 'month1',
      render: (text, _, i) => {
        if (i === 8 || i === 10) {
          return <strong>{text}</strong>
        }
        if (i === 1 || i === 7) {
          return (
            <Tag color="blue" key={Math.random()}>
              {text}
            </Tag>
          )
        }
        if (i === 3 || i === 5 || i === 9) {
          return (
            <Tag color="green" key={Math.random()}>
              {text}
            </Tag>
          )
        }
        return text
      },
    },
    {
      title: data.months ? data.months[5] : '-',
      dataIndex: 'month0',
      key: 'month0',
      render: (text, _, i) => {
        if (i === 8 || i === 10) {
          return <strong>{text}</strong>
        }
        if (i === 1 || i === 7) {
          return (
            <Tag color="blue" key={Math.random()}>
              {text}
            </Tag>
          )
        }
        if (i === 3 || i === 5 || i === 9) {
          return (
            <Tag color="green" key={Math.random()}>
              {text}
            </Tag>
          )
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

export default MarginByMonth
