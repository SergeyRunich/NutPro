/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
// import { FormattedMessage } from 'react-intl'
import { Row, Col, Checkbox, Button, Slider } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

// const { Option } = Select

@injectIntl
@withRouter
@connect(({ user }) => ({ user }))
class AlgoSettings extends React.Component {
  // state = {
  //   loading: [true, true],
  //   dayKcal: [],
  //   ingredientFrequency: [],
  //   allTags: [],
  // }

  // constructor(props) {
  //   super(props)

  // }

  onChangeField(e, field) {
    if (e.target) {
      if (e.target.type === 'checkbox') {
        this.setState({
          [field]: e.target.checked,
        })
      } else {
        this.setState({
          [field]: e.target.value,
        })
      }
    } else {
      this.setState({
        [field]: e,
      })
    }
  }

  render() {
    const {
      intl: { formatMessage },
    } = this.props
    const marks = {
      '-30': {
        style: {
          color: '#f50',
        },
        label: <strong>-30%</strong>,
      },
      '-20': {
        style: {
          color: '#ec8100',
        },
        label: <strong>-20%</strong>,
      },
      '-10': {
        style: {
          color: '#96c800',
        },
        label: <strong>-10%</strong>,
      },
      0: {
        style: {
          color: 'green',
        },
        label: <strong>0%</strong>,
      },
      10: {
        style: {
          color: '#96c800',
        },
        label: <strong>10%</strong>,
      },
      20: {
        style: {
          color: '#ec8100',
        },
        label: <strong>20%</strong>,
      },
      30: {
        style: {
          color: '#f50',
        },
        label: <strong>30%</strong>,
      },
    }

    return (
      <div>
        <Helmet title={formatMessage({ id: 'Setts.Algorithm settings' })} />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>{formatMessage({ id: 'Setts.Algorithm settings' })}</strong>
            </div>
          </div>
          <div className="card-body">
            <Row style={{ width: '100%' }} gutter={32}>
              <Col md={12} sm={24} style={{ marginBottom: '15px' }}>
                <h3>
                  {formatMessage({ id: 'Setts.Acceptable errors of kcal and macronutrients' })}
                </h3>

                <Row style={{ width: '100%' }} gutter={16}>
                  <Col md={24} sm={18} style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <strong>{formatMessage({ id: 'Setts.kCal' })}</strong>
                    <Slider range marks={marks} defaultValue={[-5, 5]} min={-30} max={30} />
                  </Col>
                </Row>
                <Row style={{ width: '100%' }} gutter={16}>
                  <Col md={24} sm={18} style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <strong>{formatMessage({ id: 'Setts.Protein' })}</strong>
                    <Slider range marks={marks} defaultValue={[-10, 10]} min={-30} max={30} />
                  </Col>
                </Row>
                <Row style={{ width: '100%' }} gutter={16}>
                  <Col md={24} sm={18} style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <strong>{formatMessage({ id: 'Setts.Fats' })}</strong>
                    <Slider range marks={marks} defaultValue={[-10, 10]} min={-30} max={30} />
                  </Col>
                </Row>
                <Row style={{ width: '100%' }} gutter={16}>
                  <Col md={24} sm={18} style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <strong>{formatMessage({ id: 'Setts.Carbohydrates' })}</strong>
                    <Slider range marks={marks} defaultValue={[-10, 10]} min={-30} max={30} />
                  </Col>
                </Row>
              </Col>
              <Col md={12} sm={24} style={{ marginBottom: '15px' }}>
                <h3>{formatMessage({ id: 'Setts.Options' })}</h3>
                <p>
                  <Checkbox defaultChecked />
                  <span style={{ marginLeft: '10px' }}>
                    {formatMessage({ id: 'Setts.Allow 2 meals a day' })}
                  </span>
                </p>
                <p>
                  <Checkbox defaultChecked />
                  <span style={{ marginLeft: '10px' }}>
                    {formatMessage({ id: 'Setts.Allow 3 meals a day' })}
                  </span>
                </p>
                <p>
                  <Checkbox defaultChecked />
                  <span style={{ marginLeft: '10px' }}>
                    {formatMessage({ id: 'Setts.Allow 5 meals a day' })}
                  </span>
                </p>
                <p>
                  <Checkbox />
                  <span style={{ marginLeft: '10px' }}>
                    {formatMessage({ id: 'Setts.Generate a salad' })}
                  </span>
                </p>
                <p>
                  <Checkbox defaultChecked />
                  <span style={{ marginLeft: '10px' }}>
                    {formatMessage({ id: 'Setts.Process missed meals' })}
                  </span>
                </p>
                <p>
                  <Checkbox checked={false} disabled />
                  <span style={{ marginLeft: '10px' }}>
                    {formatMessage({ id: 'Setts.To handle exceptions ingredients' })}
                  </span>
                </p>
                <p>
                  <Checkbox checked={false} disabled />
                  <span style={{ marginLeft: '10px' }}>
                    {formatMessage({
                      id: 'Setts.Intelligent distribution of macronutrients throughout the day',
                    })}
                  </span>
                </p>
              </Col>
            </Row>
            <Row style={{ width: '100%' }} gutter={16}>
              <Col md={24} sm={24} style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button type="primary">{formatMessage({ id: 'global.save' })}</Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

export default AlgoSettings
