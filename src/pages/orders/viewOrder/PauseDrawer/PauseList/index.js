import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import moment from 'moment'
import { Table, Popconfirm, Button } from 'antd'

const PauseList = ({ pauses, onDelete, editMode }) => {
  const columns = [
    {
      title: <FormattedMessage id="global.date" />,
      dataIndex: 'timestamp',
      key: Math.random(),
      render: (text, record) => (
        <span>
          {`${moment.unix(parseInt(record.id.substring(0, 8), 16)).format('DD.MM.YYYY HH:mm')}`}
        </span>
      ),
    },
    {
      title: <FormattedMessage id="Orders.StartDate" />,
      dataIndex: 'start',
      key: Math.random(),
      render: text => <span>{` ${moment.unix(text).format('DD.MM.YYYY')}`}</span>,
    },
    {
      title: <FormattedMessage id="Orders.EndDate" />,
      dataIndex: 'end',
      key: Math.random(),
      render: text => <span>{` ${moment.unix(text).format('DD.MM.YYYY')}`}</span>,
    },
    {
      title: '-----',
      dataIndex: 'id',
      key: Math.random(),
      render: (text, record) => (
        <span>
          <Button
            style={{ marginRight: '10px' }}
            onClick={() => editMode(record)}
            icon="edit"
            size="small"
            type="primary"
            disabled={moment.utc() > moment.unix(record.end).subtract(2, 'days')}
          >
            <FormattedMessage id="global.edit" />
          </Button>
          <Popconfirm
            title={<FormattedMessage id="Orders.AreYouSureDeleteThisPause?" />}
            onConfirm={() => onDelete(text)}
            okText={<FormattedMessage id="global.yes" />}
            cancelText={<FormattedMessage id="global.no" />}
            disabled={
              moment.utc() > moment.unix(record.start).subtract(1, 'days') ||
              pauses[pauses.length - 1].id !== text
            }
          >
            <Button
              icon="close"
              size="small"
              type="danger"
              disabled={
                moment.utc() > moment.unix(record.start).subtract(1, 'days') ||
                pauses[pauses.length - 1].id !== text
              }
            >
              <FormattedMessage id="global.remove" />
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ]

  return (
    <div>
      <Table
        className="utils__scrollTable"
        tableLayout="auto"
        scroll={{ x: '100%' }}
        columns={columns}
        dataSource={pauses}
        rowKey={() => Math.random()}
      />
    </div>
  )
}

export default injectIntl(PauseList)
