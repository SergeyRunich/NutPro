import React from 'react'
import { injectIntl } from 'react-intl'

import { Radio, Divider } from 'antd'

import { activitiesFree, activitiesWork, trainingTime, looseSpeed } from '../data'

@injectIntl
class Wizard extends React.Component {
  state = {}

  componentDidMount() {
    const { update } = this.props
    update()
  }

  render() {
    const {
      diet,
      wizard,
      update,
      customParams,
      intl: { formatMessage },
    } = this.props

    const radioStyle = {
      display: 'block',
      whiteSpace: 'pre-wrap',
      lineHeight: '30px',
      textAlign: 'justify',
    }

    const inWrapStyle = {
      display: 'flex',
      alignItems: 'flex-start',
    }

    return (
      <div>
        {diet === 'loose' && <Divider>{formatMessage({ id: 'Orders.Weight loss rate' })}</Divider>}
        {diet === 'loose' && (
          <div style={{ marginBottom: '20px', width: '100%' }}>
            <Radio.Group key="looseSpeed" value={wizard.speed} onChange={e => update(e, 'speed')}>
              {looseSpeed.map(item => (
                <div key={Math.random()} style={inWrapStyle}>
                  <Radio style={radioStyle} value={item.value}>
                    {item.name}
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
        )}
        {diet === 'gain' && (
          <Divider>{formatMessage({ id: 'Orders.When do you go to training?' })}</Divider>
        )}
        {diet === 'gain' && (
          <div style={{ marginBottom: '20px', width: '100%' }}>
            <Radio.Group
              key="trainingTime"
              value={wizard.trainingTime}
              onChange={e => update(e, 'trainingTime')}
            >
              {trainingTime.map(item => (
                <Radio key={Math.random()} style={radioStyle} value={item.value}>
                  {item.name}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        )}
        <Divider>{formatMessage({ id: 'Orders.Physical activity level - Job / school' })}</Divider>
        <div style={{ marginBottom: '20px', width: '100%' }}>
          <Radio.Group
            key="activeWork"
            value={wizard.activitiesWork}
            onChange={e => update(e, 'activitiesWork')}
          >
            {activitiesWork.map(item => (
              <Radio key={Math.random()} style={radioStyle} value={item.value}>
                {item.name}
              </Radio>
            ))}
          </Radio.Group>
        </div>
        <Divider>{formatMessage({ id: 'Orders.Physical Activity Level - Leisure:' })}</Divider>
        <div style={{ marginBottom: '20px', width: '100%' }}>
          <Radio.Group
            key="activeFree"
            value={wizard.activitiesFree}
            onChange={e => update(e, 'activitiesFree')}
          >
            {activitiesFree.map(item => (
              <Radio key={Math.random()} style={radioStyle} value={item.value}>
                {item.name}
              </Radio>
            ))}
          </Radio.Group>
        </div>
        <div className="form-actions">
          <h4>{`kCal:${customParams.kcal} P:${customParams.prot} F:${customParams.fat} C:${customParams.carb}`}</h4>
          <span style={{ float: 'right' }}>{`BMR ${wizard.BMR}`}</span>
        </div>
      </div>
    )
  }
}

export default Wizard
