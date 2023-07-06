/* eslint-disable no-unused-vars */
import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import C3Chart from 'react-c3js'
import { Select, Button } from 'antd'

const { Option } = Select

@injectIntl
class GlobalChartZoom extends React.Component {
  state = {
    type: this.props.defaultType,
  }

  handleChangeType = async type => {
    this.setState({ type: type.key })
  }

  render() {
    const {
      defaultType,
      months,
      loadGlobalChart,
      chartLoading,
      intl: { formatMessage },
    } = this.props
    const { type } = this.state
    const colors = {
      primary: '#01a8fe',
      def: '#acb7bf',
      success: '#46be8a',
      danger: '#fb434a',
    }

    let columns = []
    columns = [['All orders', ...months.map(d => d.all)]]

    if (type === 'new') {
      columns = [['New', ...months.map(d => d.new)]]
    } else if (type === 'prolong') {
      columns = [['Prolong', ...months.map(d => d.prolong)]]
    } else if (type === 'renew') {
      columns = [['Renewal', ...months.map(d => d.renew)]]
    } else if (type === 'combined') {
      columns = [
        ['All orders', ...months.map(d => d.all)],
        ['New', ...months.map(d => d.new)],
        ['Prolong', ...months.map(d => d.prolong)],
        ['Renewal', ...months.map(d => d.renew)],
      ]
    }
    const zoom = {
      data: {
        unload: true,
        columns,
        colors: {
          'All orders': colors.def,
          New: colors.primary,
          Prolong: colors.success,
          Renewal: colors.danger,
        },
      },
      axis: {
        x: {
          tick: {
            format(x) {
              if (x < months.length) return months[x].month
            },
          },
        },
      },
      zoom: {
        enabled: !0,
      },
      grid: {
        y: {
          show: !0,
          lines: [
            {
              value: 0,
            },
          ],
        },
        x: {
          show: !0,
          lines: [
            {
              value: 0,
            },
          ],
        },
      },
    }

    return (
      <div className="card">
        <div className="card-header">
          <div className="utils__title" style={{ marginBottom: '-20px' }}>
            <strong className="text-uppercase font-size-14">
              <Select
                labelInValue
                defaultValue={{ key: defaultType }}
                // style={{ width: 250 }}
                style={{ marginBottom: '15px', width: 180, marginRight: '10px' }}
                onChange={this.handleChangeType}
              >
                <Option value="all">{formatMessage({ id: 'GlobalChartZoom.AllOrders' })}</Option>
                <Option value="new">{formatMessage({ id: 'GlobalChartZoom.NewOrders' })}</Option>
                <Option value="prolong">
                  {formatMessage({ id: 'GlobalChartZoom.ProlongedOrders' })}
                </Option>
                <Option value="renew">
                  {formatMessage({ id: 'GlobalChartZoom.RenewalOrders' })}
                </Option>
                <Option value="combined">
                  {formatMessage({ id: 'GlobalChartZoom.Combined' })}
                </Option>
              </Select>
            </strong>
            <Button loading={chartLoading} type="primary" onClick={() => loadGlobalChart()}>
              {formatMessage({ id: 'GlobalChartZoom.LoadChart' })}
            </Button>
          </div>
        </div>
        <div className="card-body">
          <C3Chart
            data={zoom.data}
            color={zoom.color}
            zoom={zoom.zoom}
            axis={zoom.axis}
            grid={zoom.grid}
          />
        </div>
      </div>
    )
  }
}

export default GlobalChartZoom
