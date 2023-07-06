import React from 'react'
import { injectIntl } from 'react-intl'
import { Drawer, Col, Row } from 'antd'

import MenuItem from './Item'

@injectIntl
class B2BPreview extends React.Component {
  constructor(props) {
    super(props)

    this.closeDrawer = this.closeDrawer.bind(this)
  }

  closeDrawer() {
    const { onClose } = this.props
    onClose()
  }

  render() {
    const {
      visible,
      orders,
      intl: { formatMessage },
    } = this.props
    if (!orders) this.closeDrawer()
    return (
      <div>
        <Drawer
          title={formatMessage({ id: 'Orders.PreviewB2BOrder' })}
          width="100%"
          onClose={this.closeDrawer}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Row gutter={16}>
            {orders.map(order => (
              <Col key={Math.random()} md={8} sm={24} style={{ marginBottom: '20px' }}>
                <MenuItem order={order} />
              </Col>
            ))}
          </Row>
        </Drawer>
      </div>
    )
  }
}

export default B2BPreview
