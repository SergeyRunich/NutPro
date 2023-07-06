import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import { Form, Input, Button } from 'antd'
import { Helmet } from 'react-helmet'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './style.module.scss'

@injectIntl
@Form.create()
@connect(({ user }) => ({ user }))
class Login extends Component {
  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: 'user/LOGIN',
          payload: values,
        })
      }
    })
  }

  render() {
    const {
      form,
      user: { loading },
      intl: { formatMessage },
    } = this.props
    return (
      <div>
        <Helmet title={formatMessage({ id: 'User.Login' })} />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>NutritionPRO</strong>
                  </h4>
                  <br />
                  <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit}>
                    <Form.Item label={formatMessage({ id: 'User.Login' })}>
                      {form.getFieldDecorator('login', {
                        initialValue: '',
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'User.Please input your login' }),
                          },
                        ],
                      })(<Input size="default" />)}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'User.Password' })}>
                      {form.getFieldDecorator('password', {
                        initialValue: '',
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'User.Please input your password' }),
                          },
                        ],
                      })(<Input size="default" type="password" />)}
                    </Form.Item>
                    <div className="form-actions">
                      <Button
                        type="primary"
                        className="width-150 mr-4"
                        htmlType="submit"
                        loading={loading}
                      >
                        {formatMessage({ id: 'User.Login' })}
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
