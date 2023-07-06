import React from 'react'
import { injectIntl } from 'react-intl'
import { Link, NavLink } from 'react-router-dom'
import Highlighter from 'react-highlight-words'
import moment from 'moment'
import {
  Button,
  Table,
  notification,
  Select,
  Switch,
  DatePicker,
  Rate,
  Row,
  Col,
  Statistic,
  Checkbox,
  Input,
  Icon,
  Slider,
} from 'antd'
import { Helmet } from 'react-helmet'
// import { Link, withRouter } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import DishDetails from './components/DishDetail'
import IgnoredList from './components/IgnoredList'
import {
  getRating,
  getRatingDay,
  getRatingPeriod,
  getIgnoredList,
  getTagsList,
} from '../../api/rating'
import { getAllKitchen } from '../../api/kitchen'

moment.updateLocale('en', {
  week: { dow: 1 },
})

const { Option } = Select
const { RangePicker } = DatePicker

@injectIntl
class RatingMenu extends React.Component {
  state = {
    period: 2,
    dates: [
      moment()
        .startOf('month')
        .format('DD-MM-YYYY'),
      moment()
        .endOf('month')
        .format('DD-MM-YYYY'),
    ],
    ratings: [],
    details: [],
    stats: {},
    macroVisible: false,
    loading: true,
    min: 0,
    diet: '',
    isNotCzech: '',
    isIgnoreInRating: true,
    isOnlyReview: false,
    ignoredListVisible: false,
    ignoredList: [],
    kitchens: [],
    kitchen: [],
    searchText: '',
    searchedColumn: '',
    filteredInfo: '',
    scoreRange: [1, 5],
    tagsList: [],
    tags: [],
    ignoreTags: false,
  }

  constructor(props) {
    super(props)

    this.onCheck = this.onCheck.bind(this)
    this.onChangeField = this.onChangeField.bind(this)
    this.onChangeIgnoreTags = this.onChangeIgnoreTags.bind(this)
    this.onChangeScoreRange = this.onChangeScoreRange.bind(this)
  }

  componentDidMount() {
    const {
      intl: { formatMessage },
    } = this.props
    const { dates } = this.state
    getAllKitchen().then(async answer => {
      const json = await answer.json()
      this.setState({
        kitchens: json,
      })
    })
    getRatingPeriod('rating', dates[0], dates[1]).then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        this.setState({
          ratings: json.dishes,
          stats: json.stats,
          loading: false,
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    })

    getIgnoredList().then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        this.setState({
          ignoredList: json.result,
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    })

    getTagsList().then(async req => {
      if (req.status === 200) {
        const json = await req.json()
        this.setState({
          tagsList: json,
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
        })
      }
    })
  }

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

  onChangeIgnoreTags(checked) {
    this.setState({
      ignoreTags: checked,
    })
  }

  onChangeScoreRange(scoreRange) {
    this.setState({
      scoreRange,
    })
  }

  onCheck() {
    const {
      period,
      dates,
      min,
      diet,
      isNotCzech,
      isIgnoreInRating,
      kitchen,
      isOnlyReview,
      scoreRange,
      tags,
      ignoreTags,
    } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    this.setState({
      loading: true,
    })
    if (Number(period) === 1) {
      getRatingDay(
        'rating',
        dates[0],
        min,
        diet,
        isNotCzech,
        isIgnoreInRating,
        kitchen,
        isOnlyReview,
        scoreRange[0],
        scoreRange[1],
        tags,
        ignoreTags,
      ).then(async req => {
        if (req.status === 200) {
          const json = await req.json()
          this.setState({
            ratings: json.dishes,
            stats: json.stats,
            loading: false,
          })
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
          })
        }
      })
    } else if (Number(period) === 2) {
      getRatingPeriod(
        'rating',
        dates[0],
        dates[1],
        min,
        diet,
        isNotCzech,
        isIgnoreInRating,
        kitchen,
        isOnlyReview,
        scoreRange[0],
        scoreRange[1],
        tags,
        ignoreTags,
      ).then(async req => {
        if (req.status === 200) {
          const json = await req.json()
          this.setState({
            ratings: json.dishes,
            stats: json.stats,
            loading: false,
          })
        } else {
          notification.error({
            message: formatMessage({ id: 'global.error' }),
            description: req.statusText,
          })
        }
      })
    } else {
      getRating(
        'rating',
        min,
        diet,
        isNotCzech,
        isIgnoreInRating,
        kitchen,
        isOnlyReview,
        scoreRange[0],
        scoreRange[1],
        tags,
        ignoreTags,
      ).then(async req => {
        if (req.status === 200) {
          const json = await req.json()
          this.setState({
            ratings: json.dishes,
            stats: json.stats,
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

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].title
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    filteredValue: this.state.filteredInfo || '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    },
    render: (text, record) =>
      this.state.searchedColumn === dataIndex ? (
        <NavLink
          to="#"
          onClick={e => {
            this.showDrawerDetails(record)
            e.preventDefault()
          }}
        >
          <Highlighter
            highlightStyle={{
              backgroundColor: '#ffc069',
              padding: 0,
              fontWeight: 'bold',
              fontSize: '16px',
            }}
            unhighlightStyle={{ fontWeight: 'bold', fontSize: '16px' }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.title.toString()}
          />
        </NavLink>
      ) : (
        <NavLink
          to="#"
          onClick={e => {
            this.showDrawerDetails(record)
            e.preventDefault()
          }}
        >
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{text.title || text}</span>
        </NavLink>
      ),
  })

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    })
  }

  handleReset = (clearFilters, d) => {
    if (d === undefined) clearFilters()
    this.setState({ searchText: '', filteredInfo: '' })
  }

  handleChangeTable = (pagination, filters) => {
    this.setState({
      filteredInfo: filters.dish,
    })
  }

  showDrawerDetails = record => {
    this.setState({
      details: record.users,
      macroVisible: true,
    })
  }

  onCloseDrawerDetails = () => {
    this.setState({
      // details: {},
      macroVisible: false,
    })
  }

  setIgnoredListVisible = visible => {
    this.setState({
      ignoredListVisible: visible,
    })
  }

  handleChangeCustomPeriod = async period => {
    let dates = [null, null]
    if (period[0] !== undefined) {
      dates = [
        period[0].format('DD-MM-YYYY'),
        period[1] !== undefined ? period[1].format('DD-MM-YYYY') : null,
      ]
    }
    this.setState({ dates })
  }

  handleChangeCustomDay = async day => {
    let dates = [null, null]
    if (day !== undefined && day !== null) {
      dates = [day.format('DD-MM-YYYY'), day.format('DD-MM-YYYY')]
    }
    this.setState({ dates })
  }

  handleChangeCalendar = async value => {
    const value2 = value[1] ? value[1].format('DD-MM-YYYY') : ''
    this.setState({ dates: [value[0].format('DD-MM-YYYY'), value2] })
  }

  handleChangePeriod = async period => {
    this.setState({ period: period.key })
  }

  filterMinHandle = async min => {
    this.setState({ min: min.key })
  }

  filterDietHandle = async diet => {
    this.setState({ diet: diet.key })
  }

  filterNationHandle = async nation => {
    this.setState({ isNotCzech: nation.key })
  }

  filterIgnored = async e => {
    this.setState({ isIgnoreInRating: e.target.checked })
  }

  filterReview = async e => {
    this.setState({ isOnlyReview: e.target.checked })
  }

  render() {
    const {
      ratings,
      macroVisible,
      period,
      dates,
      details,
      loading,
      stats,
      isIgnoreInRating,
      ignoredList,
      ignoredListVisible,
      kitchens,
      kitchen,
      isOnlyReview,
      scoreRange,
      tagsList,
      tags,
      ignoreTags,
    } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    const columns = [
      {
        title: formatMessage({ id: 'Rating.Dish' }),
        dataIndex: 'dish',
        key: 'dish',
        // render: text => (
        //   <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{`${text.title}`}</span>
        // ),
        ...this.getColumnSearchProps('dish'),
      },
      {
        title: formatMessage({ id: 'Rating.Rating' }),
        dataIndex: 'scores',
        key: 'score',
        render: text => (
          <span>
            <Rate
              defaultValue={Number(text.average)}
              style={{ color: '#2fa037' }}
              allowHalf
              disabled
            />{' '}
            <span style={{ fontWeight: 'bold', fontSize: '16px', marginLeft: '6px' }}>
              {`${text.average}${text.isReview ? '*' : ''}`}
            </span>
          </span>
        ),
        sorter: (a, b) => Number(a.scores.average) - Number(b.scores.average),
      },
      {
        title: formatMessage({ id: 'Rating.Scores' }),
        dataIndex: 'scores',
        key: 'scores',
        render: text => (
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{`${text.count}`}</span>
        ),
        sorter: (a, b) => Number(a.scores.count) - Number(b.scores.count),
      },
    ]

    return (
      <Authorize
        roles={['admin', 'root', 'production', 'finance', 'salesDirector']}
        redirect
        to="/main"
      >
        <Helmet title={formatMessage({ id: 'Rating.Ratings of dishes' })} />
        <div className="row">
          <div className="col-xl-12">
            <div className="card card--fullHeight">
              <div className="card-body">
                <div className="col-xl-12">
                  <Select
                    labelInValue
                    value={{ key: period }}
                    // style={{ width: 250 }}
                    style={{ marginBottom: '15px', marginRight: '10px', minWidth: '100px' }}
                    onChange={this.handleChangePeriod}
                  >
                    <Option value={0}>{formatMessage({ id: 'Rating.All time' })}</Option>
                    <Option value={1}>{formatMessage({ id: 'Rating.Day' })}</Option>
                    <Option value={2}>{formatMessage({ id: 'Rating.Range' })}</Option>
                  </Select>
                  {Number(period) === 1 && (
                    <span>
                      <DatePicker
                        format="DD.MM.YYYY"
                        style={{ marginRight: '10px' }}
                        onChange={this.handleChangeCustomDay}
                        value={dates[0] !== null ? moment(dates[0], 'DD-MM-YYYY') : null}
                        onCalendarChange={this.handleChangeCalendar}
                      />
                    </span>
                  )}
                  {Number(period) === 2 && (
                    <span>
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
                        }}
                        format="DD.MM.YYYY"
                        style={{ marginRight: '10px' }}
                        onChange={this.handleChangeCustomPeriod}
                        value={[
                          dates[0] !== null ? moment(dates[0], 'DD-MM-YYYY') : null,
                          dates[0] !== null ? moment(dates[1], 'DD-MM-YYYY') : null,
                        ]}
                        // onCalendarChange={this.handleChangeCalendar}
                      />
                    </span>
                  )}
                  <Select
                    mode="multiple"
                    placeholder="Select kitchens"
                    value={kitchen}
                    style={{ width: '115px', marginRight: '10px' }}
                    onChange={e => this.onChangeField(e, 'kitchen')}
                  >
                    {kitchens.map(k => (
                      <Option key={k.id} value={k.id}>
                        {k.name}
                      </Option>
                    ))}
                  </Select>
                  <Select
                    labelInValue
                    defaultValue={{ key: 0 }}
                    style={{ marginBottom: '15px', marginRight: '10px', width: 100 }}
                    onChange={this.filterMinHandle}
                  >
                    <Option value={0}>{formatMessage({ id: 'Rating.Min votes' })}</Option>
                    <Option value={1}>1</Option>
                    <Option value={2}>2</Option>
                    <Option value={3}>3</Option>
                    <Option value={4}>4</Option>
                    <Option value={5}>5</Option>
                    <Option value={6}>6</Option>
                    <Option value={7}>7</Option>
                    <Option value={8}>8</Option>
                    <Option value={9}>9</Option>
                    <Option value={10}>10</Option>
                    <Option value={11}>11</Option>
                    <Option value={12}>12</Option>
                    <Option value={13}>13</Option>
                    <Option value={14}>14</Option>
                    <Option value={15}>15</Option>
                    <Option value={16}>16</Option>
                    <Option value={17}>17</Option>
                    <Option value={18}>18</Option>
                    <Option value={19}>19</Option>
                    <Option value={20}>20</Option>
                    <Option value={21}>21</Option>
                    <Option value={22}>22</Option>
                    <Option value={23}>23</Option>
                    <Option value={24}>24</Option>
                    <Option value={25}>25</Option>
                    <Option value={26}>26</Option>
                    <Option value={27}>27</Option>
                    <Option value={28}>28</Option>
                    <Option value={29}>29</Option>
                    <Option value={30}>30</Option>
                  </Select>
                  <Select
                    labelInValue
                    defaultValue={{ key: '' }}
                    style={{ marginBottom: '15px', marginRight: '10px', width: 100 }}
                    onChange={this.filterDietHandle}
                  >
                    <Option value="">{formatMessage({ id: 'Rating.Diet' })}</Option>
                    <Option value="loose">{formatMessage({ id: 'Rating.loose' })}</Option>
                    <Option value="keep">{formatMessage({ id: 'Rating.keep' })}</Option>
                    <Option value="gain">{formatMessage({ id: 'Rating.gain' })}</Option>
                    <Option value="custom">{formatMessage({ id: 'Rating.custom' })}</Option>
                  </Select>

                  <Select
                    labelInValue
                    defaultValue={{ key: '' }}
                    style={{ marginBottom: '15px', marginRight: '10px', width: 100 }}
                    onChange={this.filterNationHandle}
                  >
                    <Option value="">{`\"Nation\"`}</Option>
                    <Option value="Czech">{formatMessage({ id: 'Rating.Czech' })}</Option>
                    <Option value="not_Czech">{formatMessage({ id: 'Rating.not Czech' })}</Option>
                  </Select>
                  <div>
                    <Select
                      mode="multiple"
                      placeholder="Select tags"
                      value={tags}
                      style={{ minWidth: 150, marginRight: '10px' }}
                      onChange={e => this.onChangeField(e, 'tags')}
                    >
                      {tagsList.map(t => (
                        <Option key={t.id} value={t.id}>
                          {t.cz}
                        </Option>
                      ))}
                    </Select>
                    <span>
                      {formatMessage({ id: 'Rating.ignoreTags' })}
                      <Switch
                        style={{ marginLeft: '10px' }}
                        checked={ignoreTags}
                        onChange={this.onChangeIgnoreTags}
                      />
                    </span>
                  </div>
                </div>
                <div className="col-xl-12">
                  <div style={{ display: 'flex', alignItems: 'center' }} className="row">
                    <div className="col-xl-5 col-md-5  col-sm-12">
                      <Checkbox checked={isIgnoreInRating} onChange={this.filterIgnored} />{' '}
                      {formatMessage({ id: 'Rating.Hide ignored customers ' })}
                      <Checkbox checked={isOnlyReview} onChange={this.filterReview} />{' '}
                      {formatMessage({ id: 'Rating.Only with review Score range' })}
                    </div>
                    <div className="col-xl-4 col-md-4  col-sm-12">
                      <span>{formatMessage({ id: 'Rating.Min & Max Score' })}</span>
                      <Slider
                        range
                        max={5}
                        min={1}
                        step={1}
                        tipFormatter={value => `${value}⭐️`}
                        defaultValue={scoreRange}
                        style={{ width: '200px' }}
                        onChange={this.onChangeScoreRange}
                      />
                    </div>
                    <div className="col-xl-3 col-md-3  col-sm-12">
                      <Button
                        onClick={() => this.setIgnoredListVisible(true)}
                        type="default"
                        size="default"
                        style={{ float: 'right' }}
                      >
                        {formatMessage({ id: 'Rating.View ignored list' })}
                      </Button>
                      <Button
                        type="default"
                        size="default"
                        style={{ float: 'right', marginRight: '10px' }}
                      >
                        <Link to="/feedback" target="_blank">
                          {formatMessage({ id: 'Rating.Feedbacks' })}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
                <div style={{ float: 'right' }}>
                  <Button
                    onClick={this.onCheck}
                    type="primary"
                    size="default"
                    disabled={!dates[0] && period > 0}
                    style={{ marginRight: '10px' }}
                  >
                    {formatMessage({ id: 'Rating.View' })}
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
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={formatMessage({ id: 'Rating.Number of ratings' })}
                      value={stats.rateCount}
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={formatMessage({ id: 'Rating.Average rating' })}
                      value={
                        stats.rateCount !== 0 ? (stats.rateSum / stats.rateCount).toFixed(2) : 0
                      }
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={formatMessage({ id: 'Rating.Number of dishes' })}
                      value={stats.dishCount}
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={formatMessage({ id: 'Rating.Average number of ratings per dish' })}
                      value={
                        stats.dishCount !== 0 ? (stats?.rateCount / stats.dishCount).toFixed(2) : 0
                      }
                    />
                  </div>
                  <div>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={formatMessage({ id: 'Rating.Average rating per dish' })}
                      value={
                        stats.dishCount !== 0 ? (stats.dishRates / stats.dishCount).toFixed(2) : 0
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card card--fullHeight">
              <div className="card-body">
                <Row style={{ marginTop: '15px' }}>
                  <Col sm={24} lg={4}>
                    {this.state.filteredInfo && (
                      <Button
                        onClick={() => this.handleReset(false, true)}
                        type="primary"
                        size="default"
                        style={{ marginRight: '10px', marginBottom: '5px' }}
                      >
                        {formatMessage({ id: 'Rating.Reset search' })}
                      </Button>
                    )}
                  </Col>
                </Row>

                <Table
                  // className="utils__scrollTable"
                  tableLayout="auto"
                  scroll={{ x: '100%' }}
                  columns={columns}
                  dataSource={ratings}
                  loading={loading}
                  pagination={{
                    defaultPageSize: 100,
                    position: 'bottom',
                    total: ratings.length,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    showSizeChanger: true,
                    pageSizeOptions: ['100', '200', '300', '400', '500', '1000'],
                    hideOnSinglePage: ratings.length <= 100,
                  }}
                  onChange={this.handleChangeTable}
                  rowKey={() => Math.random()}
                />
                {ratings.length <= 100 && (
                  <strong style={{ float: 'right', marginTop: '20px' }}>
                    {formatMessage({ id: 'STF.Total items:' })} {ratings.length}
                  </strong>
                )}
              </div>
            </div>
          </div>
        </div>
        <DishDetails visible={macroVisible} onClose={this.onCloseDrawerDetails} data={details} />
        <IgnoredList
          visible={ignoredListVisible}
          onCancel={() => this.setIgnoredListVisible(false)}
          list={ignoredList}
        />
      </Authorize>
    )
  }
}

export default RatingMenu
