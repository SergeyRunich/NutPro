import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Tag } from 'antd'
import moment from 'moment'
import style from '../style.module.scss'

const SocialInfo = ({ id, order }) => {
  return (
    <div className={`card card-body mb-4 ${style.socialInfo}`}>
      <div>
        <div>
          <Tag color="green" key={Math.random()} className={style.orderTag}>
            {order.kitchen.current}
          </Tag>
          {order.kitchen.current !== order.kitchen.last.name && (
            <Tag color="orange" key={Math.random()} className={style.orderTag}>
              {order.kitchen.last.name} from {order.kitchen.last.date}
            </Tag>
          )}
          {order.user.language === 'English' && (
            <Tag color="blue" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.English" />
            </Tag>
          )}
        </div>
        <h2>
          <span className="text-black mr-2">
            <strong>{order.user.name}</strong>
          </span>
          <small className="text-muted">{order.user.inBodyId}</small>
        </h2>
        <span className="mb-1">
          <small className="text-muted">
            <FormattedMessage id="Orders.Order ID: " />
            {`${id}`}
          </small>
        </span>
        {order.affiliateId && (
          <p className="mb-1">
            <small className="text-muted">
              <FormattedMessage id="Orders.Affiliate ID: " />
              {`${order.affiliateId}`}
            </small>
          </p>
        )}
        <p className="mb-1">
          <small className="text-muted">
            <FormattedMessage id="Orders.Source: " />
            {`${order.source}`}
          </small>
        </p>
        <p className="mb-1">
          <small className="text-muted">
            <FormattedMessage id="Orders.PaymentProvider: " />
            {`${order.paymentProvider}`}
          </small>
        </p>
        <p className="mb-1">
          <small className="text-muted">
            <FormattedMessage id="Orders.Created: " />
            {`${moment.unix(parseInt(id.substring(0, 8), 16)).format('DD.MM.YYYY HH:mm')}`}
          </small>
        </p>
        <div>
          {order.status === 'accepted' && (
            <Tag color="green" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.ACCEPTED" />
            </Tag>
          )}
          {order.status === 'offer' && (
            <Tag color="blue" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.OFFER" />
            </Tag>
          )}
          {order.status === 'new' && (
            <Tag color="blue" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.NEW" />
            </Tag>
          )}
          {order.status === 'fromWeb' && (
            <Tag color="blue" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.FROM WEB" />
            </Tag>
          )}
          {order.status === 'waitingPayment' && (
            <Tag color="blue" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.WAITING FOR PAYMENT (FROM WEB)" />
            </Tag>
          )}
          {order.status === 'verification' && (
            <Tag color="blue" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.VERIFICATION" />
            </Tag>
          )}
          {order.onApproveDeliveryFee && (
            <Tag color="orange" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.VERIFICATION (delivery fee)" />
            </Tag>
          )}
          {order.extraDays === -1 && (
            <Tag color="orange" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.VERIFICATION (extra days)" />
            </Tag>
          )}
          {order.status === 'rejected' && (
            <Tag color="red" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.REJECTED" />
            </Tag>
          )}
          {order.status === 'canceled' && (
            <Tag color="red" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.CANCELED" />
            </Tag>
          )}
          {order.status === 'incomplete' && (
            <Tag color="orange" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.INCOMPLETE" />
            </Tag>
          )}
          {order.isSplitPayment && (
            <Tag color="orange" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.SplitPayment" />
            </Tag>
          )}
          {order.customMenu.isActive && (
            <Tag color="orange" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.CUSTOM MENU" />
            </Tag>
          )}
          {order.invoiceStatus === 'paid' && order.paymentProvider !== 'GoPay' && (
            <Tag color="green" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.INVOICE PAID" />
            </Tag>
          )}
          {order.invoiceStatus === 'pending' && order.paymentProvider !== 'GoPay' && (
            <Tag color="blue" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.PENDING" />
            </Tag>
          )}
          {order.invoiceStatus === 'open' && order.paymentProvider !== 'GoPay' && (
            <Tag color="blue" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.INVOICE OPEN" />
            </Tag>
          )}
          {order.invoiceStatus === 'sent' && order.paymentProvider !== 'GoPay' && (
            <Tag color="blue" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.INVOICE SENT" />
            </Tag>
          )}
          {Boolean(!order.invoice) &&
            order.status === 'accepted' &&
            order.paymentProvider !== 'GoPay' && (
              <Tag color="blue" key={Math.random()} className={style.orderTag}>
                <FormattedMessage id="Orders.WITHOUT INVOICE" />
              </Tag>
            )}
          {order.invoiceStatus === 'accepted' && order.paymentProvider === 'GoPay' && (
            <Tag color="green" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.INVOICE PAID" />
            </Tag>
          )}
          {order.invoiceStatus === 'pending' && order.paymentProvider === 'GoPay' && (
            <Tag color="red" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.INVOICE UNPAID" />
            </Tag>
          )}
          {order.invoiceStatus === 'overdue' && order.paymentProvider !== 'GoPay' && (
            <Tag color="red" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.INVOICE OVERDUE" />
            </Tag>
          )}
          {order.invoiceStatus === 'open' &&
            order.isModifiedPrice &&
            !order.isOnApprovalOfRecalculatedPrice && (
              <Tag color="red" key={Math.random()} className={style.orderTag}>
                <FormattedMessage id="Orders.PRICE RECALCULATED" />
              </Tag>
            )}
          {order.isOnApprovalOfRecalculatedPrice && (
            <Tag color="blue" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.RECALCULATED PRICE ON APPROVAL" />
            </Tag>
          )}
          {order.isOnApprovalWithoutInvoice && (
            <Tag color="orange" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.ON APPROVAL (WITHOUT INVOICE)" />
            </Tag>
          )}
          {order.stage.code !== 0 && (
            <Tag color="green" key={Math.random()} className={style.orderTag}>
              {String(order.stage.text).toUpperCase()}
            </Tag>
          )}
          {order.b2bOrder.isActive && (
            <Tag color="orange" key={Math.random()} className={style.orderTag}>
              <FormattedMessage id="Orders.B2B" />
            </Tag>
          )}
        </div>
      </div>
      <div className={style.socialCounts}>
        <div className="text-center mr-3">
          <h2>{order.nutrients ? Math.round(order.nutrients.kcal) : '-'}</h2>
          <p className="mb-0">
            <FormattedMessage id="Orders.kCal" />
          </p>
        </div>
        <div className="text-center mr-3">
          <h2>{order.nutrients ? Math.round(order.nutrients.prot) : '-'}</h2>
          <p className="mb-0">
            <FormattedMessage id="Orders.Prot" />
          </p>
        </div>
        <div className="text-center mr-3">
          <h2>{order.nutrients ? Math.round(order.nutrients.fat) : '-'}</h2>
          <p className="mb-0">
            <FormattedMessage id="Orders.Fat" />
          </p>
        </div>
        <div className="text-center">
          <h2>{order.nutrients ? Math.round(order.nutrients.carb) : '-'}</h2>
          <p className="mb-0">
            <FormattedMessage id="Orders.Carb" />
          </p>
        </div>
        <br />
        <div style={{ marginLeft: '10px' }}>
          <Tag
            color="green"
            key={Math.random()}
            style={{ fontSize: '32px', padding: '15px' }}
            className={style.orderTag}
          >
            {order.sales.name || '-'}
          </Tag>
        </div>
      </div>
    </div>
  )
}

export default SocialInfo
