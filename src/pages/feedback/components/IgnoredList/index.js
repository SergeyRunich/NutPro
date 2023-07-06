import React from 'react'
import { Modal } from 'antd'

class IgnoredList extends React.Component {
  render() {
    const { visible, onCancel, list } = this.props

    return (
      <Modal
        visible={visible}
        title="Ignored list"
        okText="OK"
        cancelText="Close"
        onCancel={onCancel}
        onOk={onCancel}
      >
        {list.map(u => (
          <p key={u.id}>
            <a href={`/#/users/${u.id}`} target="_blank" rel="noopener noreferrer">
              {u.name}
            </a>
          </p>
        ))}
      </Modal>
    )
  }
}

export default IgnoredList
