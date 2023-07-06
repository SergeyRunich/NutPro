import React from 'react'
import { useIntl } from 'react-intl'
import moment from 'moment'
import { Table, Tag, Popover } from 'antd'

const TableOfOrders = ({ data, loading }) => {
  const intl = useIntl()

  const columns = [
    {
      title: intl.formatMessage({ id: 'global.date' }),
      dataIndex: 'date',
      key: 'date',
      render: text => <span>{`${text}`}</span>,
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: intl.formatMessage({ id: 'STF.Invoice' }),
      dataIndex: 'invoice',
      key: 'invoice',
      render: invoice => {
        if (invoice.invoiced) {
          return (
            <a href={invoice.url} target="blank">
              {invoice.number}
            </a>
          )
        }
        return 'none'
      },
    },
    {
      title: intl.formatMessage({ id: 'global.name' }),
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => {
        return (
          <a href={`/#/orders/${record.id}`} rel="noopener noreferrer" target="_blank">
            {name}
          </a>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'STF.Source' }),
      dataIndex: 'source',
      key: 'source',
      render: source => <span>{`${source}`}</span>,
      sorter: (a, b) => a.source.length - b.source.length,
    },
    {
      title: intl.formatMessage({ id: 'STF.Type' }),
      dataIndex: 'type',
      key: 'type',
      render: type => <span>{`${type}`}</span>,
      sorter: (a, b) => a.type.length - b.type.length,
    },
    {
      title: intl.formatMessage({ id: 'STF.Days' }),
      dataIndex: 'days',
      key: 'days',
      render: days => {
        return <span>{days}</span>
      },
      sorter: (a, b) => a.days - b.days,
    },
    {
      title: intl.formatMessage({ id: 'STF.Program' }),
      dataIndex: 'mealsPerDay',
      key: 'meals',
      render: mealsPerDay => <span>{`${mealsPerDay.split('')[0]}`}</span>,
      sorter: (a, b) => a.mealsPerDay.split('')[0] - b.mealsPerDay.split('')[0],
    },
    {
      title: intl.formatMessage({ id: 'STF.OriginalPrice' }),
      dataIndex: 'acceptedPrice',
      key: 'acceptedPrice',
      render: (acceptedPrice, record) => {
        return (
          <Tag color={acceptedPrice === record.finalPrice ? 'green' : 'red'} key={Math.random()}>
            {acceptedPrice.toLocaleString('en', {
              minimumFractionDigits: 0,
            })}
          </Tag>
        )
      },
      sorter: (a, b) => a.acceptedPrice - b.acceptedPrice,
    },
    {
      title: intl.formatMessage({ id: 'STF.FinalPrice' }),
      dataIndex: 'finalPrice',
      key: 'finalPrice',
      render: (finalPrice, record) => {
        return (
          <Tag color="green" key={Math.random()}>
            {record.isCustomPrice === 1 && '*'}
            {finalPrice.toLocaleString('en', {
              minimumFractionDigits: 0,
            })}
          </Tag>
        )
      },
      sorter: (a, b) => a.finalPrice - b.finalPrice,
    },
    {
      title: intl.formatMessage({ id: 'STF.PerDay' }),
      dataIndex: 'pricePerDay',
      key: 'pricePerDay',
      render: (pricePerDay, record) => {
        const content = (
          <div>
            <p>Accepted: {pricePerDay}</p>
            <p>Final: {record.finalPerDay}</p>
          </div>
        )
        return (
          <Popover content={content} title={intl.formatMessage({ id: 'STF.PricePerDay' })}>
            <Tag color="geekblue" key={Math.random()}>
              {pricePerDay.toLocaleString('en', {
                minimumFractionDigits: 0,
              })}
            </Tag>
          </Popover>
        )
      },
      sorter: (a, b) => a.pricePerDay - b.pricePerDay,
    },
    {
      title: intl.formatMessage({ id: 'STF.COGS' }),
      dataIndex: 'cogs',
      key: 'cogs',
      render: cogs => {
        return (
          <span>
            {cogs.toLocaleString('en', {
              minimumFractionDigits: 0,
            })}
          </span>
        )
      },
      sorter: (a, b) => a.cogs - b.cogs,
    },
    {
      title: intl.formatMessage({ id: 'STF.Margin' }),
      dataIndex: 'margin',
      key: 'margin',
      render: margin => {
        return (
          <span>
            {margin.toLocaleString('en', {
              minimumFractionDigits: 0,
            })}
          </span>
        )
      },
      sorter: (a, b) => a.margin - b.margin,
    },
    {
      title: intl.formatMessage({ id: 'STF.Margin%' }),
      dataIndex: 'marginPercent',
      key: 'marginPercent',
      render: marginPercent => {
        return <span>{Number(marginPercent).toFixed(2)}</span>
      },
      sorter: (a, b) => a.marginPercent - b.marginPercent,
    },
    {
      title: intl.formatMessage({ id: 'STF.Promo' }),
      dataIndex: 'promo',
      key: 'promo',
      render: promo => {
        return <span>{promo}</span>
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
        dataSource={data}
        size="small"
        rowKey={() => Math.random().toString()}
        pagination={{
          defaultPageSize: 100,
          position: 'bottom',
          total: data.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          showSizeChanger: true,
          pageSizeOptions: ['100', '200', '300', '400', '500', '1000'],
          hideOnSinglePage: data.length <= 100,
        }}
        loading={loading}
      />
      {data.length <= 100 && (
        <strong style={{ float: 'right', marginTop: '20px' }}>
          {intl.formatMessage({ id: 'STF.Total items:' })} {data.length}
        </strong>
      )}
    </div>
  )
}

export default TableOfOrders
