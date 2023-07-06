import React from 'react'
import { injectIntl } from 'react-intl'
import Authorize from 'components/LayoutComponents/Authorize'
import { Spin, Skeleton } from 'antd'
import { Helmet } from 'react-helmet'
import SalesStatisticCard from 'components/NutritionPRO/SalesStatisticCard'
import { getSalesDashboardMainData } from '../../../api/dashboard'

@injectIntl
class DashboardProduction extends React.Component {
  state = {
    mainData: false,
    loading: true,
  }

  componentWillMount() {
    getSalesDashboardMainData().then(async answer => {
      if (answer.status === 401) {
        const { dispatch } = this.props
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            authorized: false,
          },
        })
        return
      }
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          mainData: json,
          loading: false,
        })
      }
    })
  }

  render() {
    const { loading, mainData } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    return (
      <Authorize roles={['root', 'admin']} redirect to="/main">
        <div>
          <Helmet title={formatMessage({ id: 'DashboardProduction.DashboardProduction' })} />
          <Spin spinning={loading && mainData === {}}>
            {!loading && mainData !== {} && (
              <div>
                <div className="row">
                  <div className="col-lg-6 col-xl-6">
                    <div className="utils__title mb-3">
                      <strong className="text-uppercase font-size-16">
                        {formatMessage({ id: 'DashboardProduction.RenewalRate' })}
                      </strong>
                    </div>
                    {mainData && <SalesStatisticCard defaultRange="month" data={mainData} />}
                    {!mainData && (
                      <div className="card" style={{ padding: '15px' }}>
                        <Skeleton />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Spin>
        </div>
      </Authorize>
    )
  }
}

export default DashboardProduction
