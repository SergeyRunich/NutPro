import React, { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import moment from 'moment'
import { DatePicker, Select, Timeline, Row, Col, Button, notification, Spin } from 'antd'
import { useQuery } from 'react-query'
import { getQueryName } from 'helpers/components'
import { getAllKitchen } from '../../../../api/kitchen'

import { DATE_FORMAT } from '../../../../helpers/constants'
import {
  IKitchen,
  IKitchenHistoryUser,
  TMongoObjectId,
  TUnixTimestamp,
} from '../../../../helpers/interfaces'

const { Option } = Select

/**
 * todo: Should not we configure locale somewhere on bootstrap?
 */
moment.updateLocale('en', {
  week: { dow: 1 },
})

const shouldDateBeDisabled: (
  currentDateTime: moment.Moment | null,
  kitchenStartTimestamp: number,
) => boolean = (currentMoment, currentKitchenStartTimestamp) => {
  /**
   * date will be disabled in case currentDateTime is not defined
   */
  if (currentMoment === null) {
    return true
  }

  /**
   * day should not be available if it stays before nearest available date
   */
  const endOfCurrentDayMoment = moment().endOf('day')
  const currentKitchenStartMoment = moment.unix(currentKitchenStartTimestamp)
  const nearestAvailableMoment =
    endOfCurrentDayMoment > currentKitchenStartMoment
      ? endOfCurrentDayMoment
      : currentKitchenStartMoment

  if (currentMoment < nearestAvailableMoment) {
    return true
  }

  /**
   * cooking days (Sunday, Tuesday, Thursday) should not be available for selection
   */
  const cookingDays = [1, 3, 5]
  return !cookingDays.includes(currentMoment.day())
}

interface IChangeKitchenForm {
  current: {
    id: TMongoObjectId
    name: string
    timestamp: TUnixTimestamp
    start: TUnixTimestamp
  }
  kitchenHistory: IKitchenHistoryUser[]
  push: (obj: Object) => void
  onDeleteLast: () => void
}

const ChangeKitchenForm: FC<IChangeKitchenForm> = ({
  current: currentUserKitchen,
  kitchenHistory,
  push,
  onDeleteLast,
}) => {
  const { formatMessage } = useIntl()
  const [startDate, setStartDate] = useState('')
  const [kitchen, setKitchen] = useState({ key: '' })

  const kitchens = useQuery<IKitchen[], Error>(
    getQueryName(ChangeKitchenForm, 'kitchens'),
    async () => {
      const req = await getAllKitchen()
      return req.json()
    },
    {
      retry: false,
      cacheTime: 0,
      onError: e =>
        notification.error({
          message: `Failed to obtain kitchens list: ${e.message}`,
        }),
    },
  )

  useEffect(() => {
    if (!kitchens.data) {
      return
    }
    setKitchen({ key: (kitchens.data[0].id as unknown) as string })
  }, [kitchens.data])

  if (!kitchens.isFetched || !kitchens.data) {
    return (
      <div
        style={{
          textAlign: 'center',
          display: 'block',
        }}
      >
        <Spin spinning />
      </div>
    )
  }

  return (
    <Row gutter={5}>
      <Col md={12} sm={24}>
        <div style={{ padding: '5px' }}>
          <Timeline mode="left">
            {kitchenHistory.map((historyRecord, i) => (
              <Timeline.Item
                key={Math.random()}
                color={i === kitchenHistory.length - 1 ? 'green' : 'blue'}
              >
                {`[${moment.unix(historyRecord.start).format(DATE_FORMAT)}] ${
                  historyRecord.kitchen.name
                }`}
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </Col>
      <Col md={12} sm={24}>
        <div>
          <div>
            <b>{formatMessage({ id: 'Users.Current kitchen:' })}</b>
            {` ${currentUserKitchen.name}`}
          </div>
          <div>
            <b>{formatMessage({ id: 'Users.From:' })}</b>
            {` ${moment.unix(currentUserKitchen.start).format(DATE_FORMAT)}`}
          </div>
          <div>
            <b>{formatMessage({ id: 'Users.Last change:' })}</b>
            {` ${moment.unix(currentUserKitchen.timestamp).format(DATE_FORMAT)}`}
          </div>
          {currentUserKitchen.start > moment().unix() && (
            <div>
              <Button type="danger" onClick={() => onDeleteLast()}>
                {formatMessage({ id: 'Users.Delete last' })}
              </Button>
            </div>
          )}
        </div>
        <hr />

        <h5>{formatMessage({ id: 'Users.Set new kitchen:' })}</h5>
        <Select
          labelInValue
          defaultValue={{ key: currentUserKitchen.id }}
          style={{ width: '115px', marginTop: '0px', marginRight: '20px' }}
          onChange={(k: any) => setKitchen({ key: k.key })}
          value={kitchen}
        >
          {kitchens.data.map(k => (
            // @ts-ignore ('Option' cannot be used as a JSX component. causes TS2786)
            <Option key={k.id} value={k.id}>
              {k.name}
            </Option>
          ))}
        </Select>
        {/* @ts-ignore ('DatePicker' cannot be used as a JSX component. causes TS2786) */}
        <DatePicker
          style={{ marginTop: '15px' }}
          format={DATE_FORMAT}
          disabledDate={currentDay => shouldDateBeDisabled(currentDay, currentUserKitchen.start)}
          onChange={(date, dateString) => setStartDate(dateString)}
        />
        <div>
          <Button
            type="primary"
            style={{ marginTop: '10px' }}
            onClick={() => push({ kitchenId: kitchen.key, startDate })}
          >
            {formatMessage({ id: 'global.save' })}
          </Button>
        </div>
      </Col>
    </Row>
  )
}

export default ChangeKitchenForm
