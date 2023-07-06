import React from 'react'
import { injectIntl } from 'react-intl'
import { Modal } from 'antd'

@injectIntl
class IgnoredList extends React.Component {
  render() {
    const {
      visible,
      onCancel,
      list,
      intl: { formatMessage },
    } = this.props

    return (
      <Modal
        visible={visible}
        title={formatMessage({ id: 'Rating.Ignored list' })}
        okText={formatMessage({ id: 'Rating.OK' })}
        cancelText={formatMessage({ id: 'Rating.Close' })}
        onCancel={onCancel}
        onOk={onCancel}
      >
        {list.map(u => (
          <p key={Math.random()}>
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
