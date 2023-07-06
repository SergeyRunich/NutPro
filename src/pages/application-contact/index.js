import React from 'react'
import { injectIntl } from 'react-intl'
import Authorize from 'components/LayoutComponents/Authorize'
import { Table, Button, Modal, notification } from 'antd'

import CreateEmailForm from './CreateEmailForm'

import { getEmails, deleteEmail, createEmail, updateEmail } from '../../api/application-contact'

import { getAllKitchen } from '../../api/kitchen'

@injectIntl
class ApplicationContact extends React.Component {
  state = {
    data: [],
    loading: true,
    createFormVisible: false,
    forEdit: {},
    kitchens: [],
  }

  constructor(props) {
    super(props)

    // this.onChangeStatus = this.onChangeStatus.bind(this)
    this.onCloseCreateForm = this.onCloseCreateForm.bind(this)
    this.update = this.update.bind(this)
  }

  componentWillMount() {
    getEmails().then(async answer => {
      const json = await answer.json()
      this.setState({
        data: json.result,
        loading: false,
      })
    })
    getAllKitchen().then(async answer => {
      const json = await answer.json()
      this.setState({
        kitchens: json,
      })
    })
  }

  showCreateForm = forEdit => {
    this.setState({
      forEdit,
      createFormVisible: true,
    })
  }

  onCloseCreateForm = () => {
    this.setState({
      forEdit: {},
      createFormVisible: false,
    })
  }

  update(status = 'all') {
    this.setState({
      loading: true,
    })
    getEmails(status)
      .then(async answer => {
        const json = await answer.json()
        this.setState({
          data: json.result,
          loading: false,
        })
      })
      .finally(() => {
        this.setState({
          loading: false,
        })
      })
  }

  render() {
    const { data, createFormVisible, forEdit, kitchens } = this.state

    const {
      visible,
      showEmails,
      intl: { formatMessage },
    } = this.props

    const removeEmail = async id => {
      const req = await deleteEmail(id)
      if (req.status === 204) {
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'CreateEmailForm.EmailSuccessfullyRemoved!' }),
        })
        this.update()
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    }

    const columns = [
      {
        title: formatMessage({ id: 'global.email' }),
        dataIndex: 'email',
        key: 'email',
        render: text => <span>{text}</span>,
      },
      {
        title: formatMessage({ id: 'CreateEmailForm.Kitchen' }),
        dataIndex: 'kitchen',
        key: 'kitchen',
        // sorter: (a, b) => a.phone - b.phone,
        render: text => <span>{text.name}</span>,
      },
      {
        title: formatMessage({ id: 'CreateEmailForm.Default' }),
        dataIndex: 'defValue',
        key: 'defValue',
        render: defValue =>
          defValue ? formatMessage({ id: 'global.yes' }) : formatMessage({ id: 'global.no' }),
      },
      {
        title: formatMessage({ id: 'CreateEmailForm.Action' }),
        dataIndex: 'id',
        key: 'action',
        render: (id, record) => (
          <span>
            <Button
              onClick={() => this.showCreateForm(record)}
              style={{ marginRight: '10px' }}
              size="small"
            >
              {formatMessage({ id: 'global.edit' })}
            </Button>
            <Button onClick={() => removeEmail(id)} size="small" type="danger">
              {formatMessage({ id: 'CreateEmailForm.Delete' })}
            </Button>
          </span>
        ),
      },
    ]

    return (
      <Authorize roles={['root', 'admin', 'finance']} denied={['Jan']}>
        <Modal
          width="50%"
          title={formatMessage({ id: 'CreateEmailForm.Emails' })}
          onCancel={() => showEmails(false)}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
          footer=""
        >
          <div style={{ width: '100%', marginBottom: '15px' }}>
            <Button type="primary" onClick={this.showCreateForm}>
              {formatMessage({ id: 'CreateEmailForm.AddEmail' })}
            </Button>
          </div>
          <div className="card">
            <div className="card-body">
              <Table
                tableLayout="auto"
                scroll={{ x: '100%' }}
                columns={columns}
                dataSource={data}
                onChange={this.handleTableChange}
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
            </div>
          </div>
          <CreateEmailForm
            visible={createFormVisible}
            create={createEmail}
            change={updateEmail}
            onClose={this.onCloseCreateForm}
            update={this.update}
            forEdit={forEdit}
            kitchens={kitchens}
          />
        </Modal>
      </Authorize>
    )
  }
}

export default ApplicationContact
