import React, { useState, useEffect, useCallback } from 'react'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import { withRouter } from 'react-router-dom'
import { Button, Table, notification, Select, Row, Col } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { getErpLog } from '../../../api/erpLog'

const { Option } = Select

function ErpLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [systemUser, setSystemUser] = useState('')
  const [entity, setEntity] = useState('')
  const [action, setAction] = useState('')
  const [limit, setLimit] = useState(500)

  const update = useCallback(() => {
    setLoading(true)
    getErpLog({ limit, systemUser, entity, action }).then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        setLogs(json.result)
        setLoading(false)
      } else {
        setLoading(false)
        notification.error({
          message: 'Error',
          description: req.statusText,
        })
      }
    })
  }, [action, entity, limit, systemUser])

  useEffect(() => {
    update()
  }, [update])

  const positive = ['CREATE', 'UPDATE', 'COPY']

  const neutral = ['DELETE']

  const columns = [
    {
      title: 'DATE',
      dataIndex: 'date',
      key: 'date',
      render: dateCol => moment(dateCol).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: 'SYSTEM USER',
      dataIndex: 'systemUser',
      key: 'systemUser',
      render: systemUserCol => systemUserCol,
    },
    {
      title: 'MODULE',
      dataIndex: 'entity',
      key: 'module',
      render: moduleColl => moduleColl,
    },
    {
      title: 'ACTION',
      dataIndex: 'action',
      key: 'action',
      render: actionCol => (
        <span
          style={{
            fontWeight: '26px',
            // eslint-disable-next-line no-nested-ternary
            color: positive.includes(actionCol)
              ? '#46be8a'
              : neutral.includes(actionCol)
              ? '#0887c9'
              : '#fb434a',
          }}
        >
          {actionCol}
        </span>
      ),
    },
    {
      title: 'TITLE',
      dataIndex: 'object',
      key: 'title',
      render: titleCol => titleCol.title,
    },
  ]

  return (
    <Authorize roles={['root', 'admin', 'sales', 'salesDirector']}>
      <Helmet title="Orders log" />
      <div className="row">
        <div className="col-lg-12">
          <div className="card card--fullHeight">
            <div className="card-header">
              <div className="utils__title utils__title--flat">
                <strong className="text-uppercase font-size-16">ERP Log</strong>
              </div>
            </div>
            <div className="card-body">
              <Row gutter={16}>
                <Col sm={24} md={4}>
                  <small>Number of records</small>
                  <br />
                  <Select
                    placeholder="limit"
                    value={limit}
                    style={{ width: '100%' }}
                    onChange={e => setLimit(e)}
                  >
                    <Option key={500} value={500}>
                      Last 500
                    </Option>
                    <Option key={1000} value={1000}>
                      Last 1000
                    </Option>
                    <Option key="" value="">
                      All
                    </Option>
                  </Select>
                </Col>

                <Col sm={24} md={4}>
                  <small>System User</small>
                  <br />
                  <Select
                    placeholder="system user"
                    value={systemUser}
                    style={{ width: '100%' }}
                    onChange={e => setSystemUser(e)}
                  >
                    <Option key="" value="">
                      None
                    </Option>
                    <Option key="david" value="david">
                      david
                    </Option>
                    <Option key="Denisa" value="Denisa">
                      Denisa
                    </Option>
                    <Option key="Adela" value="Adela">
                      Adela
                    </Option>
                    <Option key="justSales" value="justSales">
                      justSales
                    </Option>
                    <Option key="Dany" value="Dany">
                      Dany
                    </Option>
                  </Select>
                </Col>

                <Col sm={24} md={4}>
                  <small>Module</small>
                  <br />
                  <Select
                    placeholder="entity"
                    value={entity}
                    style={{ width: '100%' }}
                    onChange={e => setEntity(e)}
                  >
                    <Option key="" value="">
                      None
                    </Option>
                    <Option key="GROUP_INGREDIENTS" value="GROUP_INGREDIENTS">
                      GROUP_INGREDIENTS
                    </Option>
                    <Option key="INGREDIENT" value="INGREDIENT">
                      INGREDIENT
                    </Option>
                    <Option key="TECHCARD" value="TECHCARD">
                      TECHCARD
                    </Option>
                    <Option key="DAY_TEMPLATE" value="DAY_TEMPLATE">
                      DAY_TEMPLATE
                    </Option>
                    <Option key="WEEK_TEMPLATE" value="WEEK_TEMPLATE">
                      WEEK_TEMPLATE
                    </Option>
                    <Option key="CALENDAR_MENU" value="CALENDAR_MENU">
                      CALENDAR_MENU
                    </Option>
                  </Select>
                </Col>

                <Col sm={24} md={4}>
                  <small>Action</small>
                  <br />
                  <Select
                    placeholder="action"
                    value={action}
                    style={{ width: '100%' }}
                    onChange={e => setAction(e)}
                  >
                    <Option key="" value="">
                      None
                    </Option>
                    <Option key="CREATE" value="CREATE">
                      CREATE
                    </Option>
                    <Option key="UPDATE" value="UPDATE">
                      UPDATE
                    </Option>
                    <Option key="DELETE" value="DELETE">
                      DELETE
                    </Option>
                    <Option key="COPY" value="COPY">
                      COPY
                    </Option>
                  </Select>
                </Col>

                <Col sm={24} md={4}>
                  <Button style={{ marginTop: '20px' }} type="primary" onClick={update}>
                    Refresh
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
      <div className="card card--fullHeight">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-12">
              <Table
                tableLayout="auto"
                scroll={{ x: '100%' }}
                columns={columns}
                dataSource={logs}
                pagination={{
                  position: 'bottom',
                  total: logs.length,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50', '100', '200'],
                  hideOnSinglePage: logs.length < 10,
                }}
                loading={loading}
                rowKey={() => Math.random()}
              />
            </div>
          </div>
        </div>
      </div>
    </Authorize>
  )
}

export default withRouter(ErpLog)
