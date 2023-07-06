import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import { Form, Input, Button } from 'antd'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'

@injectIntl
@Form.create()
class Forgot extends Component {
  render() {
    const {
      form,
      intl: { formatMessage },
    } = this.props
    return (
      <div>
        <Helmet title={formatMessage({ id: 'User.Forgot' })} />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>{formatMessage({ id: 'User.Restore Password' })}</strong>
                  </h4>
                  <br />
                  <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit}>
                    <Form.Item label={formatMessage({ id: 'User.Username' })}>
                      {form.getFieldDecorator('username', {
                        initialValue: '',
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'User.Please input username or email' }),
                          },
                        ],
                      })(<Input size="default" />)}
                    </Form.Item>
                    <div className="mb-2">
                      <Link to="/user/login" className="utils__link--blue utils__link--underlined">
                        {formatMessage({ id: 'User.Back to login' })}
                      </Link>
                    </div>
                    <div className="form-actions">
                      <Link to="/">
                        <Button
                          type="primary"
                          className="width-150 mr-4"
                          htmlType="submit"
                          loading={false}
                        >
                          {formatMessage({ id: 'User.Restore Password' })}
                        </Button>
                      </Link>
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

export default Forgot
