import React from 'react'
import moment from 'moment'
import { Button, DatePicker, Spin, Radio, notification, Statistic, Modal, Switch } from 'antd'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import PausesData from './PausesData'
import { getPauseData, setMultiPauses } from '../../api/order'

const { RangePicker } = DatePicker

moment.updateLocale('en', {
  week: { dow: 1 },
})

class CheckingPauses extends React.Component {
  state = {
    start: moment('22-12-2021', 'DD-MM-YYYY').unix(),
    end: moment('03-01-2022', 'DD-MM-YYYY').unix(),
    data: [],
    stats: {},
    loading: false,
    verified: 'no',
    hasPause: 'all',
    modalVisible: false,
    isSetingPauses: false,
    notApproved: true,
    newPauses: 0,
  }

  constructor(props) {
    super(props)

    this.show = this.show.bind(this)
    this.filterData = this.filterData.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleToggleSwitch = this.handleToggleSwitch.bind(this)
    this.handleSetPauses = this.handleSetPauses.bind(this)
  }

  componentDidMount() {}

  handleChangeVerified = async e => {
    this.setState({ verified: e.target.value })
  }

  handleChangeHasPause = async e => {
    this.setState({ hasPause: e.target.value })
  }

  handleChangePeriod = async period => {
    this.setState({ start: period[0].unix(), end: period[1].unix() })
  }

  filterData = () => {
    const { data, verified, hasPause } = this.state

    const filteredTableData = data.filter(item => {
      if (verified === 'no') {
        if (item.verified === true) return false
      }
      if (verified === 'yes') {
        if (item.verified === false) return false
      }
      if (hasPause === 'no') {
        if (item.hasPause === true) return false
      }
      if (hasPause === 'yes') {
        if (item.hasPause === false) return false
      }
      return true
    })
    return filteredTableData
  }

  handleCancel() {
    const { newPauses } = this.state
    this.setState({ modalVisible: false })
    if (newPauses !== 0) this.show()
  }

  handleToggleSwitch(notApproved) {
    this.setState({ notApproved: !notApproved })
  }

  handleSetPauses() {
    const { start, end } = this.state
    const onSendData = {
      start: moment.unix(start).format('DD-MM-YYYY'),
      end: moment.unix(end).format('DD-MM-YYYY'),
    }

    this.setState({
      isSetingPauses: true,
    })
    setMultiPauses(onSendData).then(async req => {
      if (req.status === 201) {
        const pausedOrders = await req.json()
        this.setState({
          newPauses: pausedOrders.newPauses,
          isSetingPauses: false,
        })
      } else {
        this.setState({
          isSetingPauses: false,
        })
        notification.error({
          message: 'Error',
          description: req.statusText,
        })
      }
    })
  }

  show() {
    const { start, end } = this.state

    this.setState({
      loading: true,
    })
    getPauseData(
      moment.unix(start).format('DD-MM-YYYY'),
      moment.unix(end).format('DD-MM-YYYY'),
    ).then(async req => {
      if (req.status === 200) {
        const pausesData = await req.json()
        this.setState({
          data: pausesData.data,
          stats: pausesData.stats,
          loading: false,
        })
      } else {
        this.setState({
          loading: false,
        })
        notification.error({
          message: 'Error',
          description: req.statusText,
        })
      }
    })
  }

  render() {
    const {
      start,
      end,
      loading,
      verified,
      hasPause,
      stats,
      isSetingPauses,
      notApproved,
      modalVisible,
      newPauses,
    } = this.state
    const filteredData = this.filterData()

    return (
      <Authorize roles={['root', 'salesDirector']} users={['David']} redirect to="/main">
        <Helmet title="Checking Pauses" />
        <div className="row">
          <div className="col-xl-12">
            <div className="card card--fullHeight">
              <div className="card-body">
                <small>Select the dates as when setting the pause</small> <br />
                <RangePicker
                  ranges={{
                    'Previous Month': [
                      moment()
                        .subtract(1, 'month')
                        .startOf('month'),
                      moment()
                        .subtract(1, 'month')
                        .endOf('month'),
                    ],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Christmas holidays 2021-2022': [
                      moment('22-12-2021', 'DD-MM-YYYY'),
                      moment('03-01-2022', 'DD-MM-YYYY'),
                    ],
                  }}
                  defaultValue={[moment(start * 1000), moment(end * 1000)]}
                  format="DD.MM.YYYY"
                  onChange={this.handleChangePeriod}
                  style={{ marginRight: '10px' }}
                />
                <Button
                  loading={loading}
                  type="primary"
                  style={{ margin: '0px 10px' }}
                  onClick={this.show}
                >
                  Show
                </Button>
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    marginTop: '15px',
                  }}
                >
                  <span
                    style={{
                      border: '1px solid #e4e9f0',
                      borderRadius: '4px',
                      padding: '5px 15px',
                      marginRight: '10px',
                    }}
                  >
                    <span style={{ marginRight: '20px' }}>Verified</span>
                    <Radio.Group onChange={this.handleChangeVerified} value={verified}>
                      <Radio value="no">No</Radio>
                      <Radio value="yes">Yes</Radio>
                      <Radio value="all">All</Radio>
                    </Radio.Group>
                  </span>
                  <span
                    style={{
                      border: '1px solid #e4e9f0',
                      borderRadius: '4px',
                      padding: '5px 15px',
                      marginLeft: '10px',
                    }}
                  >
                    <span style={{ marginRight: '20px' }}>Possibility of automatic pause</span>
                    <Radio.Group onChange={this.handleChangeHasPause} value={hasPause}>
                      <Radio value="yes">No</Radio>
                      <Radio value="no">Yes</Radio>
                      <Radio value="all">All</Radio>
                    </Radio.Group>
                  </span>
                  <Button
                    disabled={!stats.automaticPause || stats.automaticPause === 0}
                    type="primary"
                    style={{ margin: '0px 15px' }}
                    onClick={() => {
                      this.setState({ modalVisible: true })
                    }}
                  >
                    Set automatic pauses
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card card--fullHeight">
              <div className="card-body">
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <Statistic style={{ textAlign: 'center' }} title="Total" value={stats.total} />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title="Verified"
                      value={stats.verified}
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title="Unverified"
                      value={stats.unverified}
                    />
                  </div>
                  {/* <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title="Has pause"
                      value={stats.hasPause}
                    />
                  </div> */}
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title="Possibility of automatic pause"
                      value={stats.automaticPause}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="card card--fullHeight">
              <div className="card-body">
                <Spin spinning={loading}>
                  <PausesData data={filteredData} />
                </Spin>
              </div>
            </div>
          </div>
        </div>
        <Modal
          title="Set automatic pauses"
          visible={modalVisible}
          onCancel={this.handleCancel}
          footer={[
            newPauses === 0 && (
              <Button
                disabled={notApproved}
                loading={isSetingPauses}
                key="approve"
                type="primary"
                onClick={this.handleSetPauses}
              >
                Pause
              </Button>
            ),
            <Button key="cancel" onClick={this.handleCancel}>
              {newPauses === 0 ? 'Cancel' : 'Ok'}
            </Button>,
          ]}
        >
          {newPauses === 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <strong>
                Are you sure you want set pauses automatically for {stats.automaticPause} orders?
              </strong>
              <br />
              <strong style={{ color: 'red' }}>
                This action is irreversible in automatic mode.
              </strong>
              <Switch
                style={{ marginTop: '15px' }}
                onChange={this.handleToggleSwitch}
                title="I'm sure"
              />
            </div>
          )}
          {newPauses !== 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <strong>Pause set successfully for {newPauses} orders</strong>
            </div>
          )}
        </Modal>
      </Authorize>
    )
  }
}

export default CheckingPauses
