import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Link, withRouter } from 'react-router-dom'
import { Button, notification, Progress } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import RegenerationWidget from '../main/components/RegenerationWidget'
import { regenerateErpKitchen } from '../../../api/kitchen'
import { regenerationProgress } from '../../../api/dashboard'

moment.updateLocale('en', {
  week: { dow: 1 },
})

@injectIntl
@withRouter
class ProductionDashboard extends React.Component {
  state = {
    regenerationModalVisible: false,
    regenerationData: {
      timestamp: 0,
      status: false,
      progress: {
        current: 0,
        total: 0,
        percent: 0,
      },
    },
  }

  regenerationStatusTimer = null

  constructor(props) {
    super(props)

    this.getRegenerationProgress = this.getRegenerationProgress.bind(this)
  }

  componentDidMount() {
    this.getRegenerationProgress()
  }

  getRegenerationProgress() {
    const {
      intl: { formatMessage },
    } = this.props
    regenerationProgress().then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        if (this.state.regenerationData.status && !json.result.status) {
          notification.success({
            message: formatMessage({ id: 'Main.Done' }),
            description: formatMessage({ id: 'Main.RegenerationIsCompleted' }),
            duration: 0,
          })
        }
        const regenerationData = {
          timestamp: json.result.startTimestamp,
          status: json.result.status,
          progress: {
            current: json.result.progress.current,
            total: json.result.progress.total,
            percent: Math.round((json.result.progress.current / json.result.progress.total) * 100),
          },
        }
        this.setState({ regenerationData })

        clearTimeout(this.regenerationStatusTimer)
        this.regenerationStatusTimer = setTimeout(
          this.getRegenerationProgress,
          json.result.status ? 5 * 1000 : 30 * 1000,
        )
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    })
  }

  setRegenerationModalVisible = visible => {
    this.setState({
      regenerationModalVisible: visible,
    })
  }

  render() {
    const { regenerationModalVisible, regenerationData } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    const startErpRegeneration = async (
      kitchen = 'all',
      period = 0,
      dates = { start: 0, end: 0 },
    ) => {
      const req = await regenerateErpKitchen({
        kitchen,
        period,
        dates: { start: dates.start, end: dates.end },
      })
      if (req.status === 200) {
        setTimeout(() => regenerationProgress(), 7800)
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({
            id: 'KitchenWidget.ERPKitchenRegenerationSuccessfullyStarted!',
          }),
        })
        this.setState({
          regenerationModalVisible: false,
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
      return req
    }

    return (
      <div className="row">
        <div className="col-lg-9">
          <div className="card card--fullHeight">
            <div className="card-header">
              <div className="utils__title utils__title--flat">
                <strong className="text-uppercase font-size-16">
                  {formatMessage({ id: 'Main.RegenerationStatus' })}
                </strong>
              </div>
            </div>
            <div className="card-body">
              {regenerationData.status && (
                <div className="row">
                  <div className="col-xl-12">
                    <h3>{formatMessage({ id: 'KitchenWidget.REGENERATIONINPROGRESS!!!' })}</h3>
                    <Progress percent={regenerationData.progress.percent} />
                    <center>
                      <p>
                        {regenerationData.progress.current} / {regenerationData.progress.total}
                      </p>
                    </center>
                    <center>
                      <p>
                        {formatMessage({ id: 'KitchenWidget.StartTime' })}{' '}
                        {moment.unix(regenerationData.timestamp).format('DD.MM.YYYY HH:mm')} (
                        {moment.unix(regenerationData.timestamp).fromNow()})
                      </p>
                    </center>

                    <hr />
                  </div>
                </div>
              )}
              {!regenerationData.status && (
                <div className="row">
                  <div className="col-xl-12">
                    <center>
                      <p>
                        {formatMessage({ id: 'KitchenWidget.LastRegeneration' })}{' '}
                        {regenerationData.timestamp
                          ? moment.unix(regenerationData.timestamp).fromNow()
                          : ''}
                      </p>
                    </center>
                    <hr />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div className="card card--fullHeight">
            <div className="card-body">
              <div className="row">
                <div className="col-xl-12">
                  <Authorize roles={['root', 'admin']} users={['Vitaly']}>
                    <div
                      className="d-flex flex-column justify-content-center"
                      style={{ marginBottom: '10px' }}
                    >
                      <Button
                        disabled={regenerationData.status}
                        type="primary"
                        onClick={() => this.setRegenerationModalVisible(true)}
                      >
                        {formatMessage({ id: 'KitchenWidget.ERPRegeneration' })}
                      </Button>
                    </div>
                    <Link to="/dashboard/kitchen/">
                      <div
                        className="d-flex flex-column justify-content-center"
                        style={{ marginBottom: '10px' }}
                      >
                        <Button type="default">
                          {formatMessage({ id: 'KitchenWidget.KitchenReport' })}
                        </Button>
                      </div>
                    </Link>
                    <Link to="/users/test/kcal">
                      <div
                        className="d-flex flex-column justify-content-center"
                        style={{ marginBottom: '10px' }}
                      >
                        <Button type="default">
                          {formatMessage({ id: 'KitchenWidget.CustomersKcalTest' })}
                        </Button>
                      </div>
                    </Link>
                    <RegenerationWidget
                      visible={regenerationModalVisible}
                      onCancel={() => this.setRegenerationModalVisible(false)}
                      regenerationData={regenerationData}
                      startErpRegeneration={startErpRegeneration}
                    />
                  </Authorize>
                  <Authorize roles={['root', 'admin', 'salesDirector', 'sales', 'finance']}>
                    <div
                      className="h-15 d-flex flex-column justify-content-center"
                      style={{ marginBottom: '10px' }}
                    >
                      <Link target="_blank" to="/dashboard/production-buffer">
                        <Button style={{ width: '100%' }} type="primary">
                          {formatMessage({ id: 'KitchenWidget.ProductionBuffer' })}
                        </Button>
                      </Link>
                    </div>
                  </Authorize>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProductionDashboard
