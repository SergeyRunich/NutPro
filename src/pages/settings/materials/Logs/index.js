import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Col, Row, Table } from 'antd'

@injectIntl
class MaterialLogList extends React.Component {
  render() {
    const {
      logs,
      intl: { formatMessage },
    } = this.props

    const columns = [
      {
        title: formatMessage({ id: 'global.date' }),
        dataIndex: 'date',
        key: 'date',
        render: dateCol => moment(dateCol).format('DD.MM.YYYY'),
      },
      {
        title: formatMessage({ id: 'Materials.Menu' }),
        dataIndex: 'menu',
        key: 'menu',
        render: menu => menu,
      },
      {
        title: formatMessage({ id: 'Materials.Pac small' }),
        dataIndex: 'packages',
        key: 'pachages1',
        render: packages => packages.type1,
      },
      {
        title: formatMessage({ id: 'Materials.Pac big' }),
        dataIndex: 'packages',
        key: 'pachages2',
        render: packages => packages.type2,
      },
      {
        title: formatMessage({ id: 'Materials.Box1' }),
        dataIndex: 'boxes',
        key: 'box1',
        render: boxes => boxes.type1,
      },
      {
        title: formatMessage({ id: 'Materials.Box2' }),
        dataIndex: 'boxes',
        key: 'box2',
        render: boxes => boxes.type2,
      },
      {
        title: formatMessage({ id: 'Materials.Box3' }),
        dataIndex: 'boxes',
        key: 'box3',
        render: boxes => boxes.type3,
      },
      {
        title: formatMessage({ id: 'Materials.Box4' }),
        dataIndex: 'boxes',
        key: 'box4',
        render: boxes => boxes.type4,
      },
      {
        title: formatMessage({ id: 'Materials.Box5' }),
        dataIndex: 'boxes',
        key: 'box5',
        render: boxes => boxes.type5,
      },
      {
        title: formatMessage({ id: 'Materials.Box6' }),
        dataIndex: 'boxes',
        key: 'box6',
        render: boxes => boxes.type6,
      },
      {
        title: formatMessage({ id: 'Materials.Box7' }),
        dataIndex: 'boxes',
        key: 'box7',
        render: boxes => boxes.type7,
      },
      {
        title: formatMessage({ id: 'Materials.Box8' }),
        dataIndex: 'boxes',
        key: 'box8',
        render: boxes => boxes.type8,
      },
      {
        title: formatMessage({ id: 'Materials.Box9' }),
        dataIndex: 'boxes',
        key: 'box9',
        render: boxes => boxes.type9,
      },
      {
        title: formatMessage({ id: 'Materials.Box10' }),
        dataIndex: 'boxes',
        key: 'box10',
        render: boxes => boxes.type10,
      },
    ]

    return (
      <div>
        <Row gutter={16}>
          <Col md={24} sm={24}>
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
              rowKey={() => Math.random()}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default MaterialLogList
