import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Button, Table, notification, Select } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { getCompareData } from '../../../../../api/dashboard'
import { regenerateErpKitchen } from '../../../../../api/kitchen'

const { Option } = Select

@injectIntl
class KitchenWidget extends React.Component {
  state = {
    period: 0,
    cookingData: {
      firstDay: {
        timestamp: 0,
        shouldBe: [],
        generated: [],
        totalShouldBe: 0,
        totalGenerated: 0,
        errors: {
          orders: [],
          meals: [],
        },
      },
      secondDay: {
        timestamp: 0,
        shouldBe: [],
        generated: [],
        totalShouldBe: 0,
        totalGenerated: 0,
        errors: {
          orders: [],
          meals: [],
        },
      },
      totalCooking: 0,
    },
  }

  componentDidMount() {
    const { period } = this.state
    getCompareData(period).then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        this.setState({
          cookingData: json,
        })
      } else {
        notification.error({
          message: 'Error',
          description: req.statusText,
        })
      }
    })
  }

  handleChangePeriod = async period => {
    this.setState({ period: period.key })
    getCompareData(period.key).then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        this.setState({
          cookingData: json,
        })
      } else {
        notification.error({
          message: 'Error',
          description: req.statusText,
        })
      }
    })
  }

  render() {
    const { cookingData } = this.state
    const {
      intl: { formatMessage },
    } = this.props
    const supportCasesTableColumns = [
      {
        title: '#',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: formatMessage({ id: 'KitchenWidget.Amount' }),
        key: 'amount',
        dataIndex: 'amount',
        render: amount => {
          if (amount === 'Negative') {
            return <span className="text-danger font-weight-bold">{amount}</span>
          }
          return <span className="text-primary font-weight-bold">{amount}</span>
        },
      },
    ]

    const startErpRegeneration = async () => {
      const req = await regenerateErpKitchen()
      if (req.status === 200) {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({
            id: 'KitchenWidget.ERPKitchenRegenerationSuccessfullyStarted!',
          }),
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    }

    return (
      <div className="row">
        <div className="col-xl-6">
          <div className="mb-3">
            <Select
              labelInValue
              defaultValue={{ key: '0' }}
              style={{ width: 250 }}
              onChange={this.handleChangePeriod}
            >
              <Option value="0">{formatMessage({ id: 'KitchenWidget.UpcommingCoocing' })}</Option>
              <Option value="1">{formatMessage({ id: 'KitchenWidget.NextCoocing' })}</Option>
            </Select>
            <div style={{ marginBottom: '10px', marginTop: '10px' }}>
              <strong>
                {`${moment.unix(cookingData.firstDay.timestamp).format('DD.MM.YYYY')}
                 - 
                ${moment.unix(cookingData.secondDay.timestamp).format('DD.MM.YYYY')}`}
              </strong>
            </div>
            <Table
              className="utils__scrollTable"
              scroll={{ x: '100%' }}
              rowKey={() => Math.random()}
              dataSource={[
                {
                  key: '1',
                  type: `${moment.unix(cookingData.firstDay.timestamp).format('DD.MM.YYYY')}`,
                  amount: `${cookingData.firstDay.totalGenerated}/${cookingData.firstDay.totalShouldBe}`,
                },
                {
                  key: '2',
                  type: `${moment.unix(cookingData.secondDay.timestamp).format('DD.MM.YYYY')}`,
                  amount: `${cookingData.secondDay.totalGenerated}/${cookingData.secondDay.totalShouldBe}`,
                },
                {
                  key: '3',
                  type: 'Delivery',
                  amount: cookingData.firstDay.totalShouldBe,
                },
                {
                  key: '4',
                  type: 'Total sets',
                  amount: `${cookingData.firstDay.totalGenerated +
                    cookingData.secondDay.totalGenerated}/${cookingData.firstDay.totalShouldBe +
                    cookingData.secondDay.totalShouldBe}`,
                },
              ]}
              columns={supportCasesTableColumns}
              pagination={false}
            />
          </div>
        </div>

        <div className="col-xl-6">
          <Authorize roles={['admin']}>
            <div
              className="h-15 d-flex flex-column justify-content-center"
              style={{ marginBottom: '10px' }}
            >
              <Button type="primary" onClick={startErpRegeneration}>
                {formatMessage({ id: 'KitchenWidget.ERPRegeneration' })}
              </Button>
            </div>
            <div className="h-25 d-flex flex-column justify-content-center">
              <Button type="default">{formatMessage({ id: 'KitchenWidget.KitchenReport' })}</Button>
            </div>
          </Authorize>
        </div>
      </div>
    )
  }
}

export default KitchenWidget
