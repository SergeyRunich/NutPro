import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import moment from 'moment'
import { Table } from 'antd'

const ListDataset = ({ data }) => {
  const [datasets, setDatasets] = useState([])
  const { formatMessage } = useIntl()

  const columns = [
    {
      title: formatMessage({ id: 'global.date' }),
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: text => <span>{`${moment.unix(text).format('DD.MM.YYYY HH:mm')}`}</span>,
    },
    {
      title: formatMessage({ id: 'ListDataset.Age' }),
      dataIndex: 'data',
      key: 'age',
      render: text => <span>{` ${text.age}`}</span>,
    },
    {
      title: formatMessage({ id: 'ListDataset.Weight' }),
      dataIndex: 'data',
      key: 'weight',
      render: text => <span>{` ${text.weight}`}</span>,
    },
    {
      title: formatMessage({ id: 'ListDataset.Height' }),
      dataIndex: 'data',
      key: 'height',
      render: text => <span>{` ${text.height}`}</span>,
    },
    {
      title: formatMessage({ id: 'ListDataset.PBF' }),
      dataIndex: 'data',
      key: 'PBF',
      render: text => <span>{` ${text.PBF}`}</span>,
    },
    {
      title: formatMessage({ id: 'ListDataset.BMR' }),
      dataIndex: 'data',
      key: 'BMR',
      render: text => <span>{` ${text.BMR}`}</span>,
    },
    {
      title: formatMessage({ id: 'ListDataset.Muscle' }),
      dataIndex: 'data',
      key: 'muscle',
      render: text => <span>{` ${text.muscle}`}</span>,
    },
    {
      title: formatMessage({ id: 'ListDataset.VFA' }),
      dataIndex: 'data',
      key: 'VFA',
      render: text => <span>{` ${text.VFA}`}</span>,
    },
    {
      title: formatMessage({ id: 'ListDataset.BMI' }),
      dataIndex: 'data',
      key: 'BMI',
      render: text => <span>{` ${text.BMI}`}</span>,
    },
    {
      title: formatMessage({ id: 'ListDataset.TBW' }),
      dataIndex: 'data',
      key: 'TBW',
      render: text => <span>{` ${text.TBW}`}</span>,
    },
  ]

  useEffect(() => {
    setDatasets(data.result)
  }, [data])

  return (
    <div>
      <Table
        className="utils__scrollTable"
        tableLayout="auto"
        scroll={{ x: '100%' }}
        columns={columns}
        dataSource={datasets}
        pagination={{
          position: 'bottom',
          total: datasets && datasets.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '200'],
          hideOnSinglePage: datasets && datasets.length < 10,
        }}
        rowKey={() => Math.random().toString()}
      />
    </div>
  )
}

export default ListDataset
