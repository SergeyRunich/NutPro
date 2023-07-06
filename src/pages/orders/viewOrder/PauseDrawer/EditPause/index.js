import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import moment from 'moment'
import { Modal, Col, Row, DatePicker } from 'antd'

const EditPauseForm = ({ visible, onSave, onCancel, editData }) => {
  const [newEndTimestamp, setNewEndTimestamp] = useState(null)
  const intl = useIntl()

  const onChange = e => {
    setNewEndTimestamp(
      e
        .utc()
        .startOf('day')
        .unix(),
    )
  }

  return (
    <Modal
      visible={visible}
      title="Update pause (only end date)"
      okText="Save"
      width={300}
      cancelText="Cancel"
      onCancel={() => {
        onCancel()
        setNewEndTimestamp(null)
      }}
      onOk={() => {
        onSave(editData.id, newEndTimestamp)
        setNewEndTimestamp(null)
      }}
    >
      <Row gutter={16}>
        <Col sm={24} lg={24}>
          <small>{intl.formatMessage({ id: 'Orders.NewEndDate' })}</small>
          <DatePicker
            style={{ width: '100%' }}
            format="DD.MM.YYYY"
            placeholder="Date"
            value={newEndTimestamp ? moment.unix(newEndTimestamp) : null}
            disabledDate={currentDay =>
              (currentDay && currentDay < moment().add(1, 'days')) ||
              (currentDay && !editData.isLast && currentDay >= moment.unix(editData.end)) ||
              (currentDay.day() !== 1 && currentDay.day() !== 3 && currentDay.day() !== 5)
            }
            onChange={onChange}
          />
        </Col>
      </Row>
    </Modal>
  )
}

export default EditPauseForm
