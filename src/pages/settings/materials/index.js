/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import { Tabs, Spin, Button, Select } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { getMaterialLog, createMateralLog } from '../../../api/erp/materials'
import { getAllKitchen } from '../../../api/kitchen'

import Stats from './Stats'
import Logs from './Logs'
import AddLog from './AddLog'

const { TabPane } = Tabs
const { Option } = Select

@injectIntl
@withRouter
@connect(({ user }) => ({ user }))
class MaterialLog extends React.Component {
  state = {
    loading: true,
    createFormVisible: false,
    logs: [],
    errors: [],
    kitchens: [],
    kitchen: '',
  }

  constructor(props) {
    super(props)

    this.update = this.update.bind(this)
  }

  componentDidMount() {
    this.update()
  }

  showCreateForm = () => {
    this.setState({
      createFormVisible: true,
    })
  }

  onCloseCreateForm = () => {
    this.setState({
      createFormVisible: false,
    })
  }

  setKitchen = async kitchen => {
    this.setState({ kitchen: kitchen.key })
    getMaterialLog(kitchen.key).then(async answer => {
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          logs: json.result,
          errors: json.errors,
          loading: false,
        })
      }
    })
  }

  update() {
    this.setState({
      loading: true,
    })
    let kitchen = ''
    getAllKitchen().then(async req => {
      const kitchens = await req.json()
      kitchen = kitchens[0].id
      this.setState({
        kitchens,
        kitchen: kitchens[0].id,
      })
    })
    setTimeout(() => {
      getMaterialLog(kitchen).then(async answer => {
        if (answer.status === 200) {
          const json = await answer.json()
          this.setState({
            logs: json.result,
            errors: json.errors,
            loading: false,
          })
        }
      })
    }, 300)
  }

  render() {
    const { loading, logs, createFormVisible, errors, kitchen, kitchens } = this.state
    const {
      intl: { formatMessage },
    } = this.props
    return (
      <Authorize roles={['root', 'admin', 'sales', 'salesDirector']} redirect to="/main">
        <div>
          <Helmet title={formatMessage({ id: 'Materials.Material logs' })} />
          <div className="card">
            <div className="card-header">
              <div className="utils__title">
                <strong>{formatMessage({ id: 'Materials.Material log' })}</strong>
              </div>
            </div>
            <div className="card-body">
              <h4>{formatMessage({ id: 'Materials.Kitchen' })}</h4>
              <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                <Select
                  labelInValue
                  style={{ width: '115px', marginRight: '30px' }}
                  onChange={this.setKitchen}
                  value={{ key: kitchen }}
                  placeholder={formatMessage({ id: 'Materials.Select' })}
                >
                  {kitchens.map(k => (
                    <Option key={k.id} value={k.id}>
                      {k.name}
                    </Option>
                  ))}
                </Select>
                <Button type="primary" onClick={() => this.showCreateForm()}>
                  {formatMessage({ id: 'Materials.Create log' })}
                </Button>
              </div>
              <Tabs type="card">
                <TabPane tab={formatMessage({ id: 'Materials.Statistics' })} key={0}>
                  <Spin spinning={loading}>
                    {!loading && (
                      <Stats
                        stickers={logs[0] ? logs[0].stickers : undefined}
                        boxes={logs[0] ? logs[0].boxes : undefined}
                        packages={logs[0] ? logs[0].packages : undefined}
                        menu={logs[0] ? logs[0].menu : 0}
                        errors={errors}
                      />
                    )}
                  </Spin>
                </TabPane>
                <TabPane tab={formatMessage({ id: 'Materials.Logs' })} key={1}>
                  <Spin spinning={loading}>{!loading && <Logs logs={logs} />}</Spin>
                </TabPane>
              </Tabs>
            </div>
          </div>
          <AddLog
            visible={createFormVisible}
            onClose={this.onCloseCreateForm}
            create={createMateralLog}
            update={this.update}
            kitchens={kitchens}
            kitchen={kitchen}
          />
        </div>
      </Authorize>
    )
  }
}

export default MaterialLog
