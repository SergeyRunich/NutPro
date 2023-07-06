/* eslint-disable no-unused-vars */
import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import lodash from 'lodash'
import { connect } from 'react-redux'
import ChartistGraph from 'react-chartist'
import ChartistTooltip from 'chartist-plugin-tooltips-updated'
import ChartistLegend from 'chartist-plugin-legend'
import { Button, Table, Dropdown, Menu, notification, Row, Col } from 'antd'
import styles from './style.module.scss'
import { getCustomersByPeriod } from '../../../../api/kpiMetric'

@injectIntl
@connect(({ user }) => ({ user }))
class CustomersBoard extends React.Component {
  state = {
    data: [],
    loading: false,
  }

  constructor(props) {
    super(props)

    this.show = this.show.bind(this)
  }

  // componentDidMount() {
  //   this.show()
  // }

  show() {
    const { start, end } = this.props
    this.setState({
      loading: true,
    })
    getCustomersByPeriod(start.format('DD-MM-YYYY'), end.format('DD-MM-YYYY')).then(async req => {
      if (req.status === 401) {
        const { dispatch } = this.props
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            authorized: false,
          },
        })
        return
      }
      if (req.status === 200) {
        const json = await req.json()
        this.setState({
          data: json.result,
          loading: false,
        })
      } else {
        notification.error({
          message: req.status,
          description: req.statusText,
        })
        this.setState({
          loading: false,
        })
      }
    })
  }

  render() {
    const { data } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    const areaData = {
      labels: data.map(d => moment(d.isoDate).format('DD')),
      series: [
        data.map(d => d.users),
        data.map(d => d.kitchens[0].total),
        data.map(d => d.kitchens[1].total),
      ],
    }

    const areaOptions = {
      low: 0,
      showArea: true,
      onlyInteger: true,
      plugins: [
        ChartistTooltip({ anchorToPoint: false, appendToBody: true, seriesName: false }),
        ChartistLegend({
          legendNames: ['Total', 'RiverFood', 'FoodWay'],
          className: styles.ct_legend,
        }),
      ],
    }

    const columns = [
      {
        title: formatMessage({ id: 'global.date' }),
        dataIndex: 'isoDate',
        key: Math.random(),
        render: isoDate => <span>{moment(isoDate).format('DD.MM.YYYY')}</span>,
      },
      {
        title: formatMessage({ id: 'CustomersBoard.Total' }),
        dataIndex: 'users',
        key: Math.random(),
        render: users => <span>{users}</span>,
      },
      {
        title: 'RiverFood',
        dataIndex: 'kitchens',
        key: Math.random(),
        render: kitchens => <span>{kitchens[0].total}</span>,
      },
      {
        title: 'FoodWay',
        dataIndex: 'kitchens',
        key: Math.random(),
        render: kitchens => <span>{kitchens[1].total}</span>,
      },
    ]
    return (
      <div>
        <div>
          <Button type="primary" style={{ marginBottom: '15px' }} onClick={this.show}>
            {formatMessage({ id: 'CustomersBoard.Load' })}
          </Button>
        </div>
        <Row gutter={16}>
          <Col md={10} sm={24}>
            <Table
              columns={columns}
              dataSource={data}
              size="middle"
              pagination={{
                position: 'bottom',
                total: data.length,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100', '200'],
                hideOnSinglePage: data.length < 10,
              }}
              loading={this.state.loading}
              rowKey={() => Math.random()}
            />
          </Col>

          <Col md={14} sm={24}>
            <ChartistGraph
              className="height-300"
              data={areaData}
              options={areaOptions}
              type="Line"
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default CustomersBoard
