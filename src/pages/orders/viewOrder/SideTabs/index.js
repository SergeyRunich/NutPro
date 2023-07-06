import React from 'react'
import { FormattedMessage } from 'react-intl'
import Authorize from 'components/LayoutComponents/Authorize'
import {
  Button,
  Icon,
  Dropdown,
  Menu,
  Statistic,
  Row,
  Col,
  Divider,
  Popover,
  Tabs,
  notification,
  Timeline,
} from 'antd'

import style from '../style.module.scss'
import { sendInvoiceEmail, sendAdditionalInfoEmail } from '../../../../api/order'

const { TabPane } = Tabs

const SideTabs = ({ id, order }) => {
  const currentPrice = order.currentPrice || {}
  const acceptedPrice = order.acceptedPrice || {}

  const summaryPricePerDay = (
    <div>
      <Timeline>
        <Timeline.Item>
          <FormattedMessage id="Orders.Original price per day: " />
          {`${currentPrice.perDay} Kč`}
        </Timeline.Item>
        <Timeline.Item>
          <FormattedMessage id="Orders.Discount on skipped meals - " />
          {`${currentPrice.discountForSkipped} Kč`}
        </Timeline.Item>
        <Timeline.Item>
          <FormattedMessage id="Orders.Promo code discount - " />
          {`${currentPrice.perDay -
            Math.round(currentPrice.total / order.length) -
            currentPrice.discountForSkipped} Kč`}
        </Timeline.Item>
        <Timeline.Item>
          <FormattedMessage id="Orders.Delivery - " />
          {`${order.isAddDeliveryFee ? 50 : 0} Kč`}
        </Timeline.Item>
        <Timeline.Item color="green">
          <FormattedMessage id="Orders.Total - " />
          {`${currentPrice.totalPerDay + (order.isAddDeliveryFee ? 50 : 0)} Kč`}
        </Timeline.Item>
      </Timeline>
    </div>
  )

  const summaryTotalPrice = (
    <div>
      <Timeline>
        <Timeline.Item>
          <FormattedMessage id="Orders.Original price: " />
          {`${currentPrice.original} Kč`}
        </Timeline.Item>
        <Timeline.Item>
          <FormattedMessage id="Orders.Discount on skipped meals - " />
          {`${currentPrice.discountForSkipped * order.length} Kč`}
        </Timeline.Item>
        <Timeline.Item>
          <FormattedMessage id="Orders.Promo code discount - " />
          {`${currentPrice.discount} Kč`}
        </Timeline.Item>
        <Timeline.Item>
          <FormattedMessage id="Orders.Delivery - " />
          {`${order.isAddDeliveryFee ? order.length * 50 : 0} Kč`}
        </Timeline.Item>
        <Timeline.Item color="green">
          <FormattedMessage id="Orders.Total - " />
          {`${currentPrice.total + (order.isAddDeliveryFee ? order.length * 50 : 0)} Kč`}
        </Timeline.Item>
      </Timeline>
    </div>
  )

  function onAcceptedPriceMenuClick() {}

  async function onSendInvoiceButtonClick() {
    const req = await sendInvoiceEmail(id)
    if (req.status === 204) {
      notification.success({
        message: 'Success',
        description: 'Invoice successfully send!',
      })
    } else {
      notification.error({
        message: 'Error',
        description: req.statusText,
      })
    }
  }

  async function onSendAdditionalInfoButtonClick() {
    const req = await sendAdditionalInfoEmail(id)
    if (req.status === 204) {
      notification.success({
        message: 'Success',
        description: 'Additional info about order successfully send!',
      })
    } else {
      notification.error({
        message: 'Error',
        description: req.statusText,
      })
    }
  }

  const acceptedPriceMenu = (
    <Menu onClick={onAcceptedPriceMenuClick}>
      <Menu.Item key="sendInvoiceEmailKey" onClick={onSendInvoiceButtonClick}>
        <Icon type="mail" />
        <FormattedMessage id="Orders.ResendInvoiceEmail" />
      </Menu.Item>
      <Menu.Item key="sendAdditionalInfoEmailKey" onClick={onSendAdditionalInfoButtonClick}>
        <Icon type="mail" />
        <FormattedMessage id="Orders.ResendAdditionalInfoEmail" />
      </Menu.Item>
    </Menu>
  )

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab={<FormattedMessage id="Orders.CURRENT" />} key="1">
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title={<FormattedMessage id="Orders.PricePerDay" />}
              value={order.originalPrice / order.length}
              suffix="Kč"
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={<FormattedMessage id="Orders.OriginalPrice" />}
              value={order.originalPrice}
              suffix="Kč"
            />
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={12}>
            <Popover
              content={summaryPricePerDay}
              title={<FormattedMessage id="Orders.MoreDetailed" />}
            >
              <a>
                <Statistic
                  title={<FormattedMessage id="Orders.TotalForTheDay" />}
                  value={currentPrice.totalPerDay + (order.isAddDeliveryFee ? 50 : 0)}
                  suffix="Kč"
                />
              </a>
            </Popover>
          </Col>
          <Col span={12}>
            <Popover
              content={summaryTotalPrice}
              title={<FormattedMessage id="Orders.MoreDetailed" />}
            >
              <a>
                <Statistic
                  title={<FormattedMessage id="Orders.TotalPrice" />}
                  value={order.price + (order.isAddDeliveryFee ? order.length * 50 : 0)}
                  suffix="Kč"
                />
              </a>
            </Popover>
          </Col>
        </Row>

        {order.customPrice.status && (
          <div>
            <Divider />
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title={<FormattedMessage id="Orders.CustomPrice" />}
                  value={order.customPrice.value}
                  suffix="Kč"
                />
              </Col>
            </Row>
          </div>
        )}

        {order.promoCode.active && (
          <div>
            <Divider />
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title={<FormattedMessage id="Orders.Promocode" />}
                  value={order.promoCode.active ? order.promoCode.code : '-'}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={<FormattedMessage id="Orders.Amount" />}
                  value={order.promoCode.active ? order.promoCode.amount : '-'}
                  suffix={
                    order.promoCode.active && order.promoCode.type === 'fixedAmount' ? 'Kč' : '%'
                  }
                />
              </Col>
            </Row>
          </div>
        )}
        {order.useCredit > 0 && (
          <div>
            <Divider />
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title={<FormattedMessage id="Orders.PaidFromCreditBalance" />}
                  value={order.useCredit}
                  suffix="Kč"
                />
              </Col>
            </Row>
          </div>
        )}
      </TabPane>
      <TabPane tab={<FormattedMessage id="Orders.ACCEPTED" />} key="2">
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title={<FormattedMessage id="Orders.PricePerDay" />}
              value={acceptedPrice.perDay}
              suffix="Kč"
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={<FormattedMessage id="Orders.OriginalPrice" />}
              value={acceptedPrice.original}
              suffix="Kč"
            />
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={12}>
            <a>
              <Statistic
                title={<FormattedMessage id="Orders.TotalForTheDay" />}
                value={acceptedPrice.totalPerDay + (acceptedPrice.isAddDeliveryFee ? 50 : 0) || 0}
                suffix="Kč"
              />
            </a>
          </Col>
          <Col span={12}>
            <a>
              <Statistic
                title={<FormattedMessage id="Orders.TotalPrice" />}
                value={
                  acceptedPrice.total + (acceptedPrice.isAddDeliveryFee ? order.length * 50 : 0) ||
                  0
                }
                suffix="Kč"
              />
            </a>
          </Col>
        </Row>

        {order.customPrice.status && (
          <div>
            <Divider />
            <Row gutter={16}>
              <Col span={24}>
                <Statistic
                  title={<FormattedMessage id="Orders.CustomPrice" />}
                  value={order.customPrice.value}
                  suffix="Kč"
                />
              </Col>
            </Row>
          </div>
        )}
        {order.customInvoiceName && (
          <div>
            <Divider />
            <Row gutter={16}>
              <Col span={24}>
                <Statistic
                  title={<FormattedMessage id="Orders.CustomInvoiceName" />}
                  value={order.customInvoiceName}
                />
              </Col>
            </Row>
          </div>
        )}

        {order.invoice && (
          <Authorize roles={['root', 'admin', 'sales', 'salesDirector', 'finance', 'trainer']}>
            <div className={style.controls}>
              <Divider />
              <Button type="primary" size="large" href={order.invoice} target="blank">
                <Icon type="qrcode" />
                <FormattedMessage id="Orders.Invoice" />
              </Button>
              <Dropdown overlay={acceptedPriceMenu}>
                <Button size="large" style={{ float: 'right' }}>
                  <Icon type="mail" />
                  Emails <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
          </Authorize>
        )}
      </TabPane>
    </Tabs>
  )
}

export default SideTabs
