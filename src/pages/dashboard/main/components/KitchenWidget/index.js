import React, { useState } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import { Button, notification, DatePicker } from 'antd'
import { downloadWeekMenu } from '../../../../../api/kitchen'

const { WeekPicker } = DatePicker

function KitchenWidget({ intl }) {
  const [weekDate, setWeekDate] = useState(0)

  const selectWeek = date => {
    if (date) {
      const timestamp = moment
        .utc(date.startOf('isoWeek').format('DD.MM.YYYY'), 'DD.MM.YYYY')
        .unix()
      setWeekDate(timestamp)
    }
  }

  const onDownloadMenu = async () => {
    const { formatMessage } = intl
    const req = await downloadWeekMenu(weekDate)
    if (req.status === 200) {
      notification.success({
        message: formatMessage({ id: 'global.success' }),
        description: formatMessage({ id: 'KitchenWidget.MenuSent!' }),
      })
    }
  }

  const onDownloadB2BMenu = async () => {
    const { formatMessage } = intl
    const req = await downloadWeekMenu(weekDate, true)
    if (req.status === 200) {
      notification.success({
        message: formatMessage({ id: 'global.success' }),
        description: formatMessage({ id: 'KitchenWidget.MenuSent!' }),
      })
    }
  }

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="h-20 d-flex flex-column justify-content-center">
          <WeekPicker
            format="w \w\e\e\k - YYYY"
            placeholder="Select week (any day)"
            onChange={selectWeek}
          />
        </div>
        <br />
        <div className="h-15 d-flex flex-column justify-content-center">
          <Button type="primary" onClick={async () => onDownloadMenu()}>
            <FormattedMessage id="KitchenWidget.SendMenu" />
          </Button>
        </div>
        <br />
        <div className="h-15 d-flex flex-column justify-content-center">
          <Button type="primary" onClick={async () => onDownloadB2BMenu()}>
            <FormattedMessage id="KitchenWidget.SendB2BMenu" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default withRouter(injectIntl(KitchenWidget))
