import React from 'react'
import moment from 'moment'
import { Link, withRouter } from 'react-router-dom'
import { Input, Icon, Empty, Radio, Spin, Checkbox } from 'antd'
import { injectIntl } from 'react-intl'
import debounce from 'lodash/debounce'
import styles from './style.module.scss'

import { multiSearch } from '../../../../api/dashboard'

@injectIntl
@withRouter
class LiveSearch extends React.Component {
  state = {
    showSearch: false,
    searchText: '',
    users: [],
    orders: [],
    searchBy: 'auto',
    autoType: 'name',
    liveMode: true,
    loading: false,
  }

  debouncedSearch = debounce(() => this.search(), 1000)

  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown, false)
  }

  showLiveSearch = () => {
    setTimeout(() => {
      this.searchInput.focus()
    }, 100)
    this.setState({
      showSearch: true,
    })
  }

  changeSearchText = async e => {
    const { searchBy, liveMode } = this.state
    this.setState({
      searchText: e.target.value,
    })
    let query = e.target.value
    let type = typeof query
    query = String(query).trim()
    const regexInvoice = new RegExp(/\d{4}-\d{4}/gm)
    if (type === 'string') query = query.toLowerCase()
    if (Number(query) && query.length <= 9) type = 'InBodyId'
    if (query.indexOf('@') !== -1) type = 'email'
    if (query[0] === '+' || (Number(query) && query.length > 9)) {
      type = 'phone'
      query = query.slice(1, query.length)
    }
    if (type === 'string') {
      if (query.match(regexInvoice) !== null) type = 'invoice'
    }
    if (type === 'string') type = 'name'
    this.setState({
      autoType: type,
    })
    if (searchBy === 'auto' && liveMode) this.debouncedSearch()
  }

  search = async () => {
    const { searchBy, searchText } = this.state
    this.setState({
      loading: true,
    })
    if (searchText.length > 2) {
      const body = {
        query: searchText,
        searchBy,
      }
      const req = await multiSearch(body)
      if (req.ok) {
        const json = await req.json()
        this.setState({
          orders: json.orders,
          users: json.users,
        })
      } else {
        this.setState({
          orders: [],
          users: [],
        })
      }
    } else {
      this.setState({
        orders: [],
        users: [],
      })
    }
    this.setState({
      loading: false,
    })
  }

  hideLiveSearch = () => {
    this.searchInput.blur()
    this.setState({
      showSearch: false,
      searchText: '',
      users: [],
      orders: [],
    })
  }

  handleKeyDown = event => {
    const { showSearch } = this.state
    if (showSearch) {
      const key = event?.keyCode?.toString()
      if (key === '27') {
        this.hideLiveSearch()
      }
      if (key === '13') {
        this.search()
      }
    }
  }

  handleNode = node => {
    this.searchInput = node
  }

  handleChangeSearchBy = async type => {
    this.setState({ searchBy: type.target.value })
  }

  handleChangeLiveMode = async type => {
    this.setState({ liveMode: type.target.checked })
  }

  render() {
    const {
      showSearch,
      searchText,
      users,
      orders,
      searchBy,
      autoType,
      loading,
      liveMode,
    } = this.state
    const {
      intl: { formatMessage },
    } = this.props
    return (
      <div className="d-inline-block mr-4">
        <Input
          className={styles.extInput}
          placeholder={formatMessage({ id: 'topBar.typeToSearch' })}
          value=""
          prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
          style={{ width: 200 }}
          onClick={this.showLiveSearch}
        />
        <div
          className={`${
            showSearch ? `${styles.livesearch} ${styles.livesearchVisible}` : styles.livesearch
          }`}
          id="livesearch"
        >
          <button className={styles.close} type="button" onClick={this.hideLiveSearch}>
            <span className="utils__visibilityHidden">{formatMessage({ id: 'topBar.close' })}</span>
            <i className="icmn-cross" />
          </button>
          <div className="container-fluid">
            <div className={styles.wrapper}>
              <input
                type="search"
                className={styles.searchInput}
                value={searchText}
                onChange={this.changeSearchText}
                id="livesearchInput"
                placeholder={formatMessage({ id: 'topBar.typeToSearch' })}
                ref={this.handleNode}
              />
              <ul className={styles.options}>
                <li key="searchBy" className={`${styles.option} ${styles.optionCheckbox}`}>
                  <Radio.Group
                    key="searchBy"
                    value={searchBy}
                    onChange={this.handleChangeSearchBy}
                    size="small"
                  >
                    <Radio.Button value="auto">{formatMessage({ id: 'topBar.Auto' })}</Radio.Button>
                    <Radio.Button value="name">{formatMessage({ id: 'global.name' })}</Radio.Button>
                    <Radio.Button value="number">
                      {formatMessage({ id: 'topBar.InBodyId' })}
                    </Radio.Button>
                    <Radio.Button value="phone">
                      {formatMessage({ id: 'global.phone' })}
                    </Radio.Button>
                    <Radio.Button value="email">
                      {formatMessage({ id: 'global.email' })}
                    </Radio.Button>
                    <Radio.Button value="address">
                      {formatMessage({ id: 'global.address' })}
                    </Radio.Button>
                    <Radio.Button value="invoice">
                      {formatMessage({ id: 'topBar.Invoice' })}
                    </Radio.Button>
                  </Radio.Group>
                </li>
                {searchBy === 'auto' && (
                  <li className={styles.option}>
                    {formatMessage({ id: 'topBar.Invoice' })} {autoType}
                  </li>
                )}

                <li key="liveMode" className={`${styles.option} ${styles.optionCheckbox}`}>
                  <Checkbox checked={liveMode} onChange={this.handleChangeLiveMode}>
                    {formatMessage({ id: 'topBar.LiveMod' })}
                  </Checkbox>
                </li>
                {!liveMode && (
                  <li key="enterToSearch" className={styles.option}>
                    <strong>{formatMessage({ id: 'topBar.PressEnterToSearch' })}</strong>
                  </li>
                )}
              </ul>
              <Spin spinning={loading}>
                <div className={styles.results}>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className={styles.resultsTitle}>
                        <span>{formatMessage({ id: 'topBar.UsersSearchResults' })}</span>
                      </div>
                      {!users.length && <Empty style={{ marginTop: '100px' }} />}
                      {users.map(user => {
                        return (
                          <Link
                            key={user.id}
                            to={`/users/${user.id}`}
                            onClick={() => this.hideLiveSearch()}
                          >
                            <div className={styles.resultContent}>
                              <div className={styles.resultThumb}>
                                <Icon type="user" />
                              </div>
                              <div className={styles.result}>
                                <div className={styles.resultText}>
                                  {`${user.name} | ${user.inBodyId}`}
                                </div>
                                <div className={styles.resultSource}>
                                  {`Phone: ${user.phone || '-'} Email: ${user.email || '-'}`}
                                  <small
                                    style={{ float: 'right', marginRight: '10px' }}
                                    className="text-muted"
                                  >
                                    {`Created: ${moment
                                      .unix(parseInt(user.id.substring(0, 8), 16))
                                      .format('DD.MM.YYYY HH:mm')}`}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                    <div className="col-lg-6">
                      <div className={styles.resultsTitle}>
                        <span>{formatMessage({ id: 'topBar.OrdersSearchResults' })}</span>
                      </div>
                      {!orders.length && <Empty style={{ marginTop: '100px' }} />}
                      {orders.map(order => {
                        return (
                          <Link
                            key={order.id}
                            to={`/orders/${order.id}`}
                            onClick={() => this.hideLiveSearch()}
                          >
                            <div className={styles.resultContent}>
                              <div className={styles.resultThumb}>
                                <Icon type="file" />
                              </div>
                              <div className={styles.result}>
                                <div className={styles.resultText}>
                                  {`${order.name} | ${order.inBodyId}`}
                                  <small style={{ float: 'right', marginRight: '10px' }}>
                                    {`Start: ${moment
                                      .unix(order.startTimestamp)
                                      .format('DD.MM.YYYY')}`}
                                  </small>
                                </div>
                                <div className={styles.resultSource}>
                                  {`Length: ${order.length || '-'} Diet: ${order.diet}`}
                                  <small
                                    style={{ float: 'right', marginRight: '10px' }}
                                    className="text-muted"
                                  >
                                    {`Created: ${moment
                                      .unix(parseInt(order.id.substring(0, 8), 16))
                                      .format('DD.MM.YYYY HH:mm')}`}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </Spin>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LiveSearch
