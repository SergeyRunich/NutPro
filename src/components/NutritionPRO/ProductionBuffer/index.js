/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Statistic, Row, Col, notification, Skeleton } from 'antd'
import { ExceptionOutlined } from '@ant-design/icons'
import { getBuffer } from '../../../api/productionBuffer'
import { getAllKitchen } from '../../../api/kitchen'

@injectIntl
class ProductionBufferWidget extends React.Component {
  state = {
    isChecked: false,
    loading: true,
    kitchens: [],
    buffers: [],
  }

  constructor(props) {
    super(props)

    this.checkBuffer = this.checkBuffer.bind(this)
  }

  componentDidMount() {
    getAllKitchen().then(async req => {
      const kitchens = await req.json()
      this.setState({
        kitchens,
      })
      this.checkBuffer()
    })
  }

  checkBuffer = async () => {
    const { kitchens } = this.state
    let { buffers } = this.state
    const {
      timestamp,
      intl: { formatMessage },
    } = this.props
    buffers = []
    for (const kitchen of kitchens) {
      this.setState({
        isChecked: false,
      })
      getBuffer(moment.unix(timestamp).format('DD-MM-YYYY'), kitchen.id).then(async req => {
        if (req.ok) {
          const bufferInfo = await req.json()

          buffers.push(bufferInfo.result)
          this.setState({
            buffers,
            isChecked: true,
            loading: false,
          })
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
          })
        }
      })
    }
  }

  render() {
    const { title } = this.props
    const { isChecked, buffers, kitchens, loading } = this.state
    return (
      <div className="card card--fullHeight">
        <div className="card-header">
          <div className="utils__title utils__title--flat">
            <strong className="text-uppercase font-size-16">{title}</strong>
          </div>
        </div>
        <div className="card-body">
          {isChecked && !loading && (
            <Row gutter={16}>
              {buffers &&
                buffers.map(buffer => {
                  return (
                    <Col span={12} key={buffer.kitchen.name}>
                      {buffers.length > 1 && buffers[0].maxValue !== 0 && (
                        <Statistic
                          title={kitchens.find(x => x.id === buffer.kitchen).name}
                          value={buffer.currentValue}
                          suffix={`/ ${buffer.maxValue}`}
                          prefix={<ExceptionOutlined />}
                        />
                      )}

                      {buffers.length > 1 && buffers[0].maxValue === 0 && (
                        <Statistic
                          title={kitchens.find(x => x.id === buffer.kitchen).name}
                          value={buffer.currentValue}
                          suffix="/ ∞"
                          prefix={<ExceptionOutlined />}
                        />
                      )}
                    </Col>
                  )
                })}
            </Row>
          )}
          {loading && (
            <Row gutter={16}>
              <Skeleton />
            </Row>
          )}
        </div>
      </div>
    )
  }
}

export default ProductionBufferWidget
