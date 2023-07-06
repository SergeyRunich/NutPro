/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Table, Empty } from 'antd'

@injectIntl
class TemplateDetail extends React.Component {
  state = {}

  render() {
    const {
      day,
      intl: { formatMessage },
    } = this.props

    const meals = [
      'Breakfast',
      '1 Snack',
      'Lunch',
      '2 Snack',
      'Dinner',
      '2 Dinner',
      '',
      '',
      '',
      '',
      'Salad',
    ]

    const columns = [
      {
        title: <strong>#</strong>,
        // dataIndex: 'id',
        key: 'id',
        render: (text, record, index) => {
          return (
            <span>
              <strong>{` ${index + 1}`}</strong>
            </span>
          )
        },
      },
      {
        title: <strong>{formatMessage({ id: 'TemplateDetail.Dish' })}</strong>,
        dataIndex: 'techcard',
        key: 'dish',
        render: text => {
          return (
            <span>
              <strong>{` ${text.title}`}</strong>
            </span>
          )
        },
      },
      {
        title: <strong>{formatMessage({ id: 'TemplateDetail.Kf' })}</strong>,
        dataIndex: 'amount',
        key: 'kf',
        render: text => <span>{`${text}`}</span>,
        sorter: (a, b) => a.amount - b.amount,
      },

      {
        title: <strong>{formatMessage({ id: 'TemplateDetail.Weight(g)' })}</strong>,
        dataIndex: 'amount',
        key: 'weight',
        render: (text, record) => {
          const weight = Math.floor(text * record.techcard.amount * 100) * 10
          return <span>{`${weight}`}</span>
        },
      },
      {
        title: <strong>{formatMessage({ id: 'TemplateDetail.kcal' })}</strong>,
        dataIndex: 'kcal',
        key: 'kcal',
        render: text => {
          return <span>{`${text}`}</span>
        },
      },
      {
        title: <strong>{formatMessage({ id: 'TemplateDetail.Prot' })}</strong>,
        dataIndex: 'prot',
        key: 'prot',
        render: text => {
          return <span>{`${text}`}</span>
        },
      },
      {
        title: <strong>{formatMessage({ id: 'TemplateDetail.Fat' })}</strong>,
        dataIndex: 'fat',
        key: 'fat',
        render: text => {
          return <span>{`${text}`}</span>
        },
      },
      {
        title: <strong>{formatMessage({ id: 'TemplateDetail.C' })}</strong>,
        dataIndex: 'fat',
        key: 'c',
        render: text => {
          return <span>{`${text}`}</span>
        },
      },
      {
        title: <strong>{formatMessage({ id: 'TemplateDetail.Meal' })}</strong>,
        dataIndex: 'meal',
        key: 'meal',
        render: text => <span>{`${meals[text]}`}</span>,
        sorter: (a, b) => a.meal - b.meal,
      },
      {
        title: <strong>{formatMessage({ id: 'TemplateDetail.Group' })}</strong>,
        dataIndex: 'group',
        key: 'group',
        render: text => <span>{`${text}`}</span>,
        sorter: (a, b) => a.group - b.group,
      },
    ]

    return (
      <div>
        {day.id && (
          <div>
            <div style={{ marginTop: '10px' }}>
              <center>
                <h3>{day.template.name}</h3>
              </center>
            </div>
            <Table
              columns={columns}
              dataSource={day ? day.template.dishes : []}
              pagination={false}
              rowKey={() => String(Math.random())}
              bordered
            />
          </div>
        )}
        {!day.id && <Empty description={false} />}
      </div>
    )
  }
}

export default TemplateDetail
