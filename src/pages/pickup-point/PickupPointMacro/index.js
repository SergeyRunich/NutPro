import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Modal, Col, Row, Button, Table, DatePicker } from 'antd'

@injectIntl
class PickupPointMacro extends React.Component {
  render() {
    const {
      visible,
      orders,
      intl: { formatMessage },
      onClose,
      currentPpCapacity,
      showPickupPointNewDate,
      start,
      handleChangeDate,
      loading,
    } = this.props

    const dDay = moment()
      .endOf('day')
      .add(-1, 'days')

    const columns = [
      {
        title: formatMessage({ id: 'global.name' }),
        dataIndex: 'user',
        key: 'user',
        render: (text, record) => {
          return <span>{record.user.name}</span>
        },
      },
      {
        title: formatMessage({ id: 'PickUpPoint.StartDate' }),
        dataIndex: 'timestamp',
        key: 'timestamp',
        render: (text, record) => {
          return <span>{moment.unix(record.timestamp).format('YYYY-MM-DD')}</span>
        },
      },
      {
        title: formatMessage({ id: 'PickUpPoint.Length' }),
        dataIndex: 'orderDays',
        key: 'orderDays',
        render: (text, record) => {
          return <span>{record.orderDays.length}</span>
        },
      },
      {
        title: formatMessage({ id: 'PickUpPoint.Action' }),
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => {
          return (
            <Button>
              <Link target="_blank" to={`/orders/${record.id}`}>
                {formatMessage({ id: 'PickUpPoint.Open' })}
              </Link>
            </Button>
          )
        },
      },
    ]

    return (
      <div>
        <Modal
          title={formatMessage({ id: 'PickUpPoint.Pick-up point macro' })}
          onCancel={() => {
            onClose()
          }}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
          footer=""
        >
          <Row style={{ display: 'flex', justifyContent: 'center' }} gutter={24}>
            <Col
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              span={8}
            >
              <DatePicker
                disabledDate={currentDay => currentDay && currentDay < dDay}
                style={{ width: '100%' }}
                value={moment(start)}
                format="YYYY-MM-DD"
                onChange={date => {
                  handleChangeDate(date)
                }}
              />
            </Col>
            <Col
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              span={4}
            >
              <Button
                loading={loading}
                type="primary"
                onClick={() => {
                  showPickupPointNewDate()
                }}
              >
                {formatMessage({ id: 'global.show' })}
              </Button>
            </Col>
            <Col
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              span={12}
            >
              <strong>
                {formatMessage({ id: 'PickUpPoint.Available' })}
                <span style={{ marginLeft: '10px', marginRight: '10px' }}>
                  {currentPpCapacity - orders.length}
                </span>
                {formatMessage({ id: 'PickUpPoint.from' })}
                <span style={{ marginLeft: '10px', marginRight: '10px' }}>{currentPpCapacity}</span>
              </strong>
            </Col>
          </Row>
          <hr />
          <Row style={{ display: 'flex', justifyContent: 'center' }} gutter={24}>
            <Col span={24}>
              <Table
                className="utils__scrollTable"
                tableLayout="auto"
                scroll={{ x: '100%' }}
                columns={columns}
                dataSource={orders}
                pagination={{
                  position: 'bottom',
                  total: orders.length,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50', '100', '200'],
                  hideOnSinglePage: orders.length < 10,
                }}
                loading={loading}
                rowKey={() => Math.random()}
              />
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}

export default PickupPointMacro
