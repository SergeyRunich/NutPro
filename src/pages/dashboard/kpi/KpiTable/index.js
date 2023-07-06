import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Button, Table, Progress, Tag } from 'antd'
import { getKpiPlan } from '../../../../api/kpiMetric'

@injectIntl
class KpiTable extends React.Component {
  state = {
    data: [],
    loading: true,
  }

  constructor(props) {
    super(props)

    this.onCloseCreateForm = this.onCloseCreateForm.bind(this)
    this.update = this.update.bind(this)
  }

  componentDidMount() {
    getKpiPlan().then(async answer => {
      const json = await answer.json()
      this.setState({
        data: json.result,
        loading: false,
      })
    })
  }

  update(status = 'all') {
    this.setState({
      loading: true,
    })
    getKpiPlan(status)
      .then(async answer => {
        const json = await answer.json()
        this.setState({
          data: json.result,
          loading: false,
        })
      })
      .finally(() => {
        this.setState({
          loading: false,
        })
      })
  }

  render() {
    const { data } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    const columns = [
      {
        title: formatMessage({ id: 'KPITable.Employee' }),
        dataIndex: 'metric',
        key: Math.random(),
        render: metric => <span>{metric.user.username}</span>,
      },
      {
        title: formatMessage({ id: 'KPITable.Direction' }),
        dataIndex: 'metric',
        key: Math.random(),
        render: metric => <span>{metric.user.direction}</span>,
      },
      {
        title: formatMessage({ id: 'KPITable.Metric' }),
        dataIndex: 'metric',
        key: Math.random(),
        render: metric => <span>{metric.name}</span>,
      },
      {
        title: formatMessage({ id: 'global.date' }),
        dataIndex: 'metric',
        key: Math.random(),
        render: metric => (
          <span>
            {metric.sourceData === 'all'
              ? formatMessage({ id: 'KPITable.System' })
              : formatMessage({ id: 'KPITable.Employee' })}
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'KPITable.Month' }),
        dataIndex: 'month',
        key: Math.random(),
        render: month => <span>{moment(month).format('MMMM YYYY')}</span>,
      },
      {
        title: formatMessage({ id: 'KPITable.Result' }),
        dataIndex: 'result',
        key: Math.random(),
        render: result => (
          <Tag color="blue" key={Math.random()}>
            {result}
          </Tag>
        ),
      },
      {
        title: formatMessage({ id: 'KPITable.Goal' }),
        dataIndex: 'goal',
        key: Math.random(),
        render: goal => (
          <Tag color="green" key={Math.random()}>
            {goal}
          </Tag>
        ),
      },
      {
        title: formatMessage({ id: 'KPITable.Progress' }),
        dataIndex: 'goal',
        key: Math.random(),
        render: (goal, record) => (
          <Progress
            style={{ width: '180px' }}
            percent={Math.round((record.result / goal) * 10000) / 100}
          />
        ),
      },
      {
        title: formatMessage({ id: 'KPITable.Creation' }),
        dataIndex: 'creation',
        key: Math.random(),
        render: creationDate => <span>{moment(creationDate).format('DD.MM.YYYY HH:mm')}</span>,
      },
    ]
    return (
      <div>
        <div>
          <Button type="primary" style={{ marginBottom: '15px' }} onClick={this.showCreateForm}>
            {formatMessage({ id: 'KPITable.CreateNewPlan' })}
          </Button>
        </div>
        <Table
          tableLayout="auto"
          scroll={{ x: '100%' }}
          columns={columns}
          dataSource={data}
          onChange={this.handleTableChange}
          pagination={{
            position: 'bottom',
            total: data.length,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100', '200'],
            hideOnSinglePage: data.length < 10,
          }}
          loading={this.state.loading}
          rowKey={() => Math.random()}
        />
      </div>
    )
  }
}

export default KpiTable
