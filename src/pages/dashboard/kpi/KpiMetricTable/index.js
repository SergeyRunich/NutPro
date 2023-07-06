import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Button, Table, Dropdown, Menu, notification } from 'antd'
import { getKpiMetric, deleteKpiMetric } from '../../../../api/kpiMetric'

import CreateKpiMetric from '../CreateKpiMetric'

@injectIntl
class KpiMetricTable extends React.Component {
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
    getKpiMetric().then(async answer => {
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

  update(status = 'all') {
    this.setState({
      loading: true,
    })
    getKpiMetric(status)
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
      intl: { formatMessage },
    } = this.props

    const removeMetric = async id => {
      const req = await deleteKpiMetric(id)
      if (req.status === 204) {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'KPIMetricTable.MetricSuccessfullyRemoved!' }),
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
          onClick={() => removeMetric(id)}
          style={{ backgroundColor: 'LightCoral', color: 'AliceBlue', fontWeight: 'bolder' }}
        >
          {formatMessage({ id: 'global.remove' })}
        </Menu.Item>
      </Menu>
    )

    const columns = [
      {
        title: formatMessage({ id: 'KPIMetricTable.Employee' }),
        dataIndex: 'user',
        key: Math.random(),
        render: user => <span>{user.username}</span>,
      },
      {
        title: formatMessage({ id: 'KPIMetricTable.Direction' }),
        dataIndex: 'user',
        key: Math.random(),
        render: user => <span>{user.username}</span>,
      },
      {
        title: formatMessage({ id: 'global.name' }),
        dataIndex: 'name',
        key: Math.random(),
        render: text => <span>{text}</span>,
      },
      {
        title: formatMessage({ id: 'KPIMetricTable.Data' }),
        dataIndex: 'sourceData',
        key: Math.random(),
        render: sourceData => (
          <span>
            {sourceData === 'all'
              ? formatMessage({ id: 'KPIMetricTable.System' })
              : formatMessage({ id: 'KPIMetricTable.Employee' })}
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'KPIMetricTable.Creation' }),
        dataIndex: 'creation',
        key: Math.random(),
        render: creationDate => <span>{moment(creationDate).format('DD.MM.YYYY HH:mm')}</span>,
      },
      {
        title: formatMessage({ id: 'KPIMetricTable.Action' }),
        dataIndex: 'id',
        key: Math.random(),
        render: (id, record) => (
          <span>
            <Dropdown.Button overlay={menu(id)} onClick={() => this.showCreateForm(record)}>
              {formatMessage({ id: 'global.edit' })}
            </Dropdown.Button>
          </span>
        ),
      },
    ]
    return (
      <>
        <div>
          <div>
            <Button type="primary" style={{ marginBottom: '15px' }} onClick={this.showCreateForm}>
              {formatMessage({ id: 'KPIMetricTable.CreateNewMetric' })}
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
        <CreateKpiMetric
          visible={createFormVisible}
          onClose={this.onCloseCreateForm}
          update={this.update}
          forEdit={forEdit}
        />
      </>
    )
  }
}

export default KpiMetricTable
