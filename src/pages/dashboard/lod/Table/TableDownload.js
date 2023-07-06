import React, { Fragment, useState } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { saveAs } from 'file-saver'
import { Button, notification } from 'antd'
import moment from 'moment'
import { getLodData } from '../../../../api/dashboard'

function TableDownload(props) {
  const [loading, setLoading] = useState(false)

  return (
    <Fragment>
      <Button
        disabled={props.data.length === 0}
        loading={loading}
        type="primary"
        onClick={async () => {
          setLoading(true)
          const req = await getLodData(
            moment.unix(props.start).format('DD-MM-YYYY'),
            moment.unix(props.end).format('DD-MM-YYYY'),
            true,
          )
          if (req.status === 200) {
            const blob = await req.blob()
            saveAs(blob, `listofdebtors`)
            notification.success({
              message: <FormattedMessage id="global.success" />,
              description: (
                <FormattedMessage id="ListOfDebtors.Listofdebtors.xlsxSuccessfullyDownloaded!" />
              ),
            })
            setLoading(false)
          } else {
            notification.error({
              message: <FormattedMessage id="global.error" />,
              description: req.statusText,
            })
          }
        }}
      >
        <FormattedMessage id="ListOfDebtors.DownloadXLSX" />
      </Button>
    </Fragment>
  )
}

export default injectIntl(TableDownload)
