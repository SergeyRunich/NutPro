import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Button, Table, Dropdown, Menu, notification, Progress, Tag } from 'antd'
import { getKpiPlan, deleteKpiPlan } from '../../../../api/kpiMetric'

import CreateKpiPlan from '../CreateKpiPlan'

@injectIntl
class KpiPlanTable extends React.Component {
  state = {
    data: [],
    createFormVisible: false,
    forEdit: {},
    loading: true,
  }

  constructor(props) {
    super(props)

    this.onCloseCreateForm = this.onCloseCreateForm.bind(this)
    this.update = this.update.bind(this)
  }

  componentDidMount() {
    let { start, end } = this.props
    const { isAction } = this.props
    start = moment(start).format('DD-MM-YYYY')
    end = moment(end).format('DD-MM-YYYY')
    getKpiPlan(!isAction ? start : '', !isAction ? end : '').then(async answer => {
      const json = await answer.json()
      this.setState({
        data: json.result,
        loading: false,
      })
    })
  }

  showCreateForm = (forEdit = {}) => {
    this.setState({
      forEdit,
      createFormVisible: true,
    })
  }

  onCloseCreateForm = () => {
    this.setState({
      forEdit: {},
      createFormVisible: false,
    })
  }

  update() {
    this.setState({
      loading: true,
    })
    let { start, end } = this.props
    const { isAction } = this.props
    start = moment(start).format('DD-MM-YYYY')
    end = moment(end).format('DD-MM-YYYY')
    getKpiPlan(!isAction ? start : '', !isAction ? end : '')
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
    const { data, createFormVisible, forEdit } = this.state
    const {
      isAction,
      intl: { formatMessage },
    } = this.props

    const removePlan = async id => {
      const req = await deleteKpiPlan(id)
      if (req.status === 204) {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'KPIPlanTable.PlanSuccessfullyRemoved' }),
        })
        this.update()
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    }

    const menu = id => (
      <Menu style={{ padding: '0px' }}>
        <Menu.Item
          key="remove"
          onClick={() => removePlan(id)}
          style={{ backgroundColor: 'LightCoral', color: 'AliceBlue', fontWeight: 'bolder' }}
        >
          {formatMessage({ id: 'global.remove' })}
        </Menu.Item>
      </Menu>
    )

    const columns = [
      {
        title: formatMessage({ id: 'KPIPlanTable.Employee' }),
        dataIndex: 'metric',
        key: Math.random(),
        render: metric => <span>{metric.user.username}</span>,
      },
      {
        title: formatMessage({ id: 'KPIPlanTable.Direction' }),
        dataIndex: 'metric',
        key: Math.random(),
        render: metric => <span>{metric.user.direction}</span>,
      },
      {
        title: formatMessage({ id: 'KPIPlanTable.Metric' }),
        dataIndex: 'metric',
        key: Math.random(),
        render: metric => <span>{metric.name}</span>,
      },
      {
        title: formatMessage({ id: 'KPIPlanTable.Data' }),
        dataIndex: 'metric',
        key: Math.random(),
        render: metric => <span>{metric.sourceData === 'all' ? 'System' : 'Employee'}</span>,
      },
      {
        title: formatMessage({ id: 'KPIPlanTable.Month' }),
        dataIndex: 'month',
        key: Math.random(),
        render: month => <span>{moment(month).format('MMMM YYYY')}</span>,
      },
      {
        title: formatMessage({ id: 'KPIPlanTable.Result' }),
        dataIndex: 'result',
        key: Math.random(),
        render: result => (
          <Tag color="blue" key={Math.random()}>
            {result}
          </Tag>
        ),
      },
      {
        title: formatMessage({ id: 'KPIPlanTable.Goal' }),
        dataIndex: 'goal',
        key: Math.random(),
        render: goal => (
          <Tag color="green" key={Math.random()}>
            {goal}
          </Tag>
        ),
      },
      {
        title: formatMessage({ id: 'KPIPlanTable.Progress' }),
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
        title: formatMessage({ id: 'KPIPlanTable.Creation' }),
        dataIndex: 'creation',
        key: Math.random(),
        render: creationDate => <span>{moment(creationDate).format('DD.MM.YYYY HH:mm')}</span>,
      },
    ]

    if (isAction) {
      columns.push({
        title: formatMessage({ id: 'KPIPlanTable.Action' }),
        dataIndex: 'id',
        key: Math.random(),
        render: (id, record) => (
          <span>
            <Dropdown.Button overlay={menu(id)} onClick={() => this.showCreateForm(record)}>
              {formatMessage({ id: 'global.edit' })}
            </Dropdown.Button>
          </span>
        ),
      })
    }
    return (
      <>
        <div>
          {isAction && (
            <div>
              <Button type="primary" style={{ marginBottom: '15px' }} onClick={this.showCreateForm}>
                {formatMessage({ id: 'KPIPlanTable.CreateNewPlan' })}
              </Button>
            </div>
          )}

          {!isAction && (
            <div>
              <Button type="primary" style={{ marginBottom: '15px' }} onClick={this.update}>
                {formatMessage({ id: 'KPIPlanTable.Refresh' })}
              </Button>
            </div>
          )}

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
        <CreateKpiPlan
          visible={createFormVisible}
          onClose={this.onCloseCreateForm}
          update={this.update}
          forEdit={forEdit}
        />
      </>
    )
  }
}

export default KpiPlanTable
