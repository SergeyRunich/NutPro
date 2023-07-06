/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Slider, Row, Col, Radio } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

const costOfIngredients = {
  120: 'Low',
  140: 'Standard',
  160: 'High',
}

const costOfRecipe = {
  30: 'Low',
  50: 'Standard',
  70: 'High',
}

const customersMarks = {
  1: '1',
  61: '61',
  121: '121',
}

const dietPrice = {
  loose: 440,
  keep: 460,
  gain: 480,
}

@injectIntl
@withRouter
@connect(({ user }) => ({ user }))
class FoodCost extends React.Component {
  state = {
    cstIng: 140,
    cstRec: 50,
    customers: 1,
    diet: 'loose',
  }

  change(e, field) {
    if (field === 'diet') {
      this.setState({
        [field]: e.target.value,
      })
    } else {
      this.setState({
        [field]: e,
      })
    }
  }

  render() {
    const { cstIng, cstRec, customers, diet } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    // eslint-disable-next-line no-nested-ternary
    const discount = customers === 61 ? 65 : customers === 121 ? 90 : 0

    const total = (cstIng + cstRec) * 2 - discount
    return (
      <div>
        <Helmet title="Offer Calculator" />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>{formatMessage({ id: 'FoodCost.OfferCalculator' })}</strong>
            </div>
          </div>
          <div className="card-body">
            <Row gutter={16}>
              <Col md={6}>
                <h4>{formatMessage({ id: 'FoodCost.FoodCost' })}</h4>
                <Slider
                  marks={costOfIngredients}
                  defaultValue={140}
                  min={120}
                  max={160}
                  step={20}
                  tooltipVisible={false}
                  onChange={e => this.change(e, 'cstIng')}
                />
                <br />
                <h4>{formatMessage({ id: 'FoodCost.OperatingCosts' })}</h4>
                <Slider
                  marks={costOfRecipe}
                  defaultValue={50}
                  min={30}
                  max={70}
                  step={20}
                  tooltipVisible={false}
                  onChange={e => this.change(e, 'cstRec')}
                />
                <br />
                <h4>{formatMessage({ id: 'FoodCost.SetsPerDay' })}</h4>
                <Slider
                  marks={customersMarks}
                  defaultValue={1}
                  min={1}
                  max={121}
                  step={60}
                  onChange={e => this.change(e, 'customers')}
                />
                <br />
                <h4>{formatMessage({ id: 'FoodCost.Diet' })}</h4>
                <Radio.Group
                  key="diet"
                  name="diet"
                  onChange={e => this.change(e, 'diet')}
                  value={diet}
                >
                  <Radio.Button value="loose">
                    {formatMessage({ id: 'FoodCost.Loose' })}
                  </Radio.Button>
                  <Radio.Button value="keep">{formatMessage({ id: 'FoodCost.Keep' })}</Radio.Button>
                  <Radio.Button value={formatMessage({ id: 'FoodCost.Gain' })}>Gain</Radio.Button>
                </Radio.Group>
              </Col>

              <Col md={6}>
                <div style={{ marginLeft: 50, fontSize: 22 }}>
                  <strong>{formatMessage({ id: 'FoodCost.FoodCost:SPACE' })} </strong> {cstIng} Kč{' '}
                  <br />
                  <strong>{formatMessage({ id: 'FoodCost.OperatingCost:SPACE' })} </strong> {cstRec}{' '}
                  Kč
                  <br />
                  <strong>{formatMessage({ id: 'FoodCost.Volume:SPACE' })} </strong>{' '}
                  {` > ${customers}`} <br />
                  <strong>{formatMessage({ id: 'FoodCost.Diet:SPACE' })} </strong> {diet}
                  <br />
                  <span style={{ fontSize: 28 }}>
                    <strong>{formatMessage({ id: 'FoodCost.OfferPrice:SPACE' })} </strong> {total}{' '}
                    Kč
                    <br />
                  </span>
                </div>
              </Col>
              <Col md={6}>
                <div style={{ marginLeft: 50, fontSize: 22 }}>
                  <strong>{formatMessage({ id: 'FoodCost.PriceForCustomer:SPACE' })} </strong>{' '}
                  {dietPrice[diet]} Kč <br />
                  <strong>{formatMessage({ id: 'FoodCost.Margin:SPACE' })} </strong>{' '}
                  {dietPrice[diet] - total} Kč
                  <br />
                  <strong>{formatMessage({ id: 'FoodCost.Margin%:SPACE' })}</strong>{' '}
                  {`${(((dietPrice[diet] - total) / dietPrice[diet]) * 100).toFixed(2)} %`} <br />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

export default FoodCost
