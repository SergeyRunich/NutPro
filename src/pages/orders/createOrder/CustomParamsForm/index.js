import React from 'react'
import { injectIntl } from 'react-intl'

import { Row, Col, InputNumber, Radio } from 'antd'

import styles from './style.module.scss'

@injectIntl
class CustomParamsForm extends React.Component {
  state = {
    type: 'kcal',
  }

  handleChangeType = async type => {
    this.setState({ type: type.target.value })
  }

  render() {
    const { type } = this.state
    const {
      customParams,
      onChange,
      intl: { formatMessage },
    } = this.props

    let viewportWidth = 1080
    if (typeof window.innerWidth !== 'undefined') {
      viewportWidth = window.innerWidth
    }
    return (
      <div>
        <div style={{ marginRight: '20px', marginBottom: '20px', textAlign: 'center' }}>
          <Radio.Group key="calcType" value={type} onChange={this.handleChangeType}>
            <Radio.Button value="kcal">{formatMessage({ id: 'Orders.AutoKcal' })}</Radio.Button>
            <Radio.Button value="macro">{formatMessage({ id: 'Orders.AutoMacro' })}</Radio.Button>
          </Radio.Group>
        </div>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <Row gutter={16} className={styles.customFormField}>
            <Col span={24}>
              <h5>{formatMessage({ id: 'Orders.Calories' })}</h5>
              <InputNumber
                value={customParams.kcal}
                name="kcal"
                min={500}
                max={4500}
                size="large"
                onChange={value => onChange(value, 'kcal', type)}
                defaultValue={1700}
                style={{ width: viewportWidth < 768 ? '100%' : '350px' }}
              />
            </Col>
          </Row>
          <Row gutter={16} className={styles.customFormField}>
            <Col span={24}>
              <h5>{formatMessage({ id: 'Orders.Protein' })}</h5>
              <InputNumber
                value={customParams.prot}
                size="large"
                name="prot"
                label="Protein"
                min={10}
                max={600}
                onChange={value => onChange(value, 'prot', type)}
                defaultValue={100}
                style={{ width: viewportWidth < 768 ? '100%' : '350px' }}
              />
            </Col>
          </Row>
          <Row gutter={16} className={styles.customFormField}>
            <Col span={24}>
              <h5>{formatMessage({ id: 'Orders.Fat' })}</h5>
              <InputNumber
                value={customParams.fat}
                size="large"
                name="fat"
                label="Fat"
                min={10}
                max={600}
                onChange={value => onChange(value, 'fat', type)}
                defaultValue={100}
                style={{ width: viewportWidth < 768 ? '100%' : '350px' }}
              />
            </Col>
          </Row>
          <Row gutter={16} className={styles.customFormField}>
            <Col span={24}>
              <h5>{formatMessage({ id: 'Orders.Carbo' })}</h5>
              <InputNumber
                value={customParams.carb}
                size="large"
                name="carb"
                label="Carbo"
                min={10}
                max={600}
                onChange={value => onChange(value, 'carb', type)}
                defaultValue={100}
                style={{ width: viewportWidth < 768 ? '100%' : '350px' }}
              />
            </Col>
          </Row>
          <div className="form-actions">
            <h4>{`kCal:${customParams.kcal} P:${customParams.prot} F:${customParams.fat} C:${customParams.carb}`}</h4>
          </div>
        </div>
      </div>
    )
  }
}

export default CustomParamsForm
