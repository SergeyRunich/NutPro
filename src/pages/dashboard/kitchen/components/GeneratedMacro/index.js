/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
import React from 'react'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { Link, withRouter } from 'react-router-dom'
import { Drawer, Button, Table, Input, Icon, Tag } from 'antd'

@injectIntl
@withRouter
class GeneratedMacro extends React.Component {
  state = {
    tableData: [],
    data: [],
    filterDropdownVisible: false,
    searchText: '',
    filtered: false,
  }

  constructor(props) {
    super(props)

    this.closeDrawer = this.closeDrawer.bind(this)
  }

  componentWillReceiveProps() {
    const { data } = this.props
    this.setState({
      tableData: data.firstDay.generated.concat(data.secondDay.generated),
      data: data.firstDay.generated.concat(data.secondDay.generated),
    })
  }

  onInputChange = e => {
    this.setState({ searchText: e.target.value })
  }

  onChangeViewDay = day => {
    const { data } = this.props
    let viewd = data.firstDay.generated.concat(data.secondDay.generated)
    if (day === 1) {
      viewd = data.firstDay.generated
    } else if (day === 2) {
      viewd = data.secondDay.generated
    }
    this.setState({
      tableData: viewd,
      data: viewd,
    })
  }

  onSearch = () => {
    const { searchText, tableData } = this.state
    const reg = new RegExp(searchText, 'gi')
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      data: tableData
        .map(record => {
          const match = record.user.name.match(reg)
          if (!match) {
            return null
          }
          return {
            ...record,
            name: (
              <span>
                {record.user.name.split(reg).map((text, i) =>
                  i > 0
                    ? [
                        // eslint-disable-next-line react/jsx-indent
                        <span className="highlight" key={Math.random()}>
                          {match[0]}
                        </span>,
                        text,
                      ]
                    : text,
                )}
              </span>
            ),
          }
        })
        .filter(record => !!record),
    })
    if (searchText === '') {
      this.setState({
        filtered: false,
      })
    }
  }

  refSearchInput = node => {
    this.searchInput = node
  }

  closeDrawer() {
    const { onClose } = this.props
    onClose()
  }

  render() {
    const {
      visible,
      intl: { formatMessage },
    } = this.props
    const { data, searchText, filterDropdownVisible, filtered } = this.state

    const columns = [
      {
        title: formatMessage({ id: 'global.name' }),
        dataIndex: 'order',
        key: 'name',
        // sorter: (a, b) => a.user.name - b.user.name,
        render: (text, record) => <Link to={`/orders/${text.id}`}>{` ${record.user.name}`}</Link>,
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch}>
              {formatMessage({ id: 'KitchenGeneratedMacro.Search' })}
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible,
        onFilterDropdownVisibleChange: visibleSearch => {
          this.setState(
            {
              filterDropdownVisible: visibleSearch,
            },
            () => this.searchInput && this.searchInput.focus(),
          )
        },
      },
      {
        title: formatMessage({ id: 'KitchenGeneratedMacro.MealsP/d' }),
        dataIndex: 'order',
        key: 'meals',
        render: text => <span>{`${text.mealsPerDay}`}</span>,
        sorter: (a, b) => a.order.mealsPerDay - b.order.mealsPerDay,
      },
      {
        title: formatMessage({ id: 'KitchenGeneratedMacro.IgnoredMeals' }),
        dataIndex: 'order',
        key: 'ignored',
        render: text => <span>{`${text.ignoredMealTypes.length}`}</span>,
        sorter: (a, b) => a.order.ignoredMealTypes.length - b.order.ignoredMealTypes.length,
      },
      {
        title: formatMessage({ id: 'KitchenGeneratedMacro.lCal' }),
        dataIndex: 'dayShouldBe',
        key: 'kCal',
        render: text => {
          return (
            <Tag color="geekblue" key="dfsdsds">
              {Math.round(text.kcal)}
            </Tag>
          )
        },
        sorter: (a, b) => a.dayShouldBe.kcal - b.dayShouldBe.kcal,
      },
      {
        title: formatMessage({ id: 'KitchenGeneratedMacro.Prot' }),
        dataIndex: 'dayShouldBe',
        key: 'prot',
        render: text => {
          return (
            <Tag color="geekblue" key="dfdfdfdfe">
              {Math.round(text.prot)}
            </Tag>
          )
        },
        sorter: (a, b) => a.dayShouldBe.prot - b.dayShouldBe.prot,
      },
      {
        title: formatMessage({ id: 'KitchenGeneratedMacro.Fat' }),
        dataIndex: 'dayShouldBe',
        key: 'fat',
        render: text => {
          return (
            <Tag color="geekblue" key="3343fe">
              {Math.round(text.fat)}
            </Tag>
          )
        },
        sorter: (a, b) => a.dayShouldBe.fat - b.dayShouldBe.fat,
      },
      {
        title: formatMessage({ id: 'KitchenGeneratedMacro.Carb' }),
        dataIndex: 'dayShouldBe',
        key: 'carb',
        render: text => {
          return (
            <Tag color="geekblue" key="dfdfe33">
              {Math.round(text.carb)}
            </Tag>
          )
        },
        sorter: (a, b) => a.dayShouldBe.fat - b.dayShouldBe.fat,
      },
      {
        title: formatMessage({ id: 'KitchenGeneratedMacro.kCal(G)' }),
        dataIndex: 'nutrients',
        key: 'kCal-nutr',
        render: (text, record) => {
          const color =
            Math.abs(record.kcalTh) <= 10
              ? 'green'
              : Math.abs(record.kcalTh) <= 20
              ? 'orange'
              : 'red'
          return (
            <Tag color={color} key="fdfd44thde">
              {Math.round(text.kcal)}
            </Tag>
          )
        },
        sorter: (a, b) => a.nutrients.kcal - b.nutrients.kcal,
      },
      {
        title: formatMessage({ id: 'KitchenGeneratedMacro.Prot(G)' }),
        dataIndex: 'nutrients',
        key: 'prot-nutr',
        render: (text, record) => {
          const color =
            Math.abs(record.protTh) <= 10
              ? 'green'
              : Math.abs(record.protTh) <= 20
              ? 'orange'
              : 'red'
          return (
            <Tag color={color} key={Math.random()}>
              {Math.round(text.prot)}
            </Tag>
          )
        },
        sorter: (a, b) => a.nutrients.prot - b.nutrients.prot,
      },
      {
        title: formatMessage({ id: 'KitchenGeneratedMacro.Fat(G)' }),
        dataIndex: 'nutrients',
        key: 'fat-nutr',
        render: (text, record) => {
          const color =
            Math.abs(record.fatTh) <= 10 ? 'green' : Math.abs(record.fatTh) <= 20 ? 'orange' : 'red'
          return (
            <Tag color={color} key={Math.random()}>
              {Math.round(text.fat)}
            </Tag>
          )
        },
        sorter: (a, b) => a.nutrients.fat - b.nutrients.fat,
      },
      {
        title: formatMessage({ id: 'KitchenGeneratedMacro.Carb(G)' }),
        dataIndex: 'nutrients',
        key: 'carb-nutr',
        render: (text, record) => {
          const color =
            Math.abs(record.carbTh) <= 10
              ? 'green'
              : Math.abs(record.carbTh) <= 20
              ? 'orange'
              : 'red'
          return (
            <Tag color={color} key={Math.random()}>
              {Math.round(text.carb)}
            </Tag>
          )
        },
        sorter: (a, b) => a.nutrients.carb - b.nutrients.carb,
      },
      {
        title: formatMessage({ id: 'KitchenGeneratedMacro.%kCal' }),
        dataIndex: 'kcalTh',
        key: 'kcalTh',
        render: text => <span>{`${text}`}</span>,
        sorter: (a, b) => Math.abs(a.kcalTh) - Math.abs(b.kcalTh),
      },
      {
        title: formatMessage({ id: 'KitchenGeneratedMacro.%Prot' }),
        dataIndex: 'protTh',
        key: 'protTh',
        render: text => <span>{`${text}`}</span>,
        sorter: (a, b) => Math.abs(a.protTh) - Math.abs(b.protTh),
      },
      {
        title: formatMessage({ id: 'KitchenGeneratedMacro.%Fat' }),
        dataIndex: 'fatTh',
        key: 'fatTh',
        render: text => <span>{`${text}`}</span>,
        sorter: (a, b) => Math.abs(a.fatTh) - Math.abs(b.fatTh),
      },
      {
        title: formatMessage({ id: 'KitchenGeneratedMacro.%Carb' }),
        dataIndex: 'carbTh',
        key: 'carbTh',
        render: text => <span>{`${text}`}</span>,
        sorter: (a, b) => Math.abs(a.carbTh) - Math.abs(b.carbTh),
      },
    ]
    return (
      <div>
        <Drawer
          title={formatMessage({ id: 'KitchenGeneratedMacro.NutrientsError' })}
          width="100%"
          onClose={this.closeDrawer}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Button
            style={{ marginRight: '15px', marginBottom: '30px' }}
            type="primary"
            onClick={() => this.onChangeViewDay(0)}
          >
            {formatMessage({ id: 'KitchenGeneratedMacro.AllDays' })}
          </Button>
          <Button
            style={{ marginRight: '15px', marginBottom: '30px' }}
            type="primary"
            onClick={() => this.onChangeViewDay(1)}
          >
            {moment.unix(this.props.data.firstDay.timestamp).format('DD.MM.YYYY')}
          </Button>
          <Button
            style={{ marginRight: '15px', marginBottom: '30px' }}
            type="primary"
            onClick={() => this.onChangeViewDay(2)}
          >
            {moment.unix(this.props.data.secondDay.timestamp).format('DD.MM.YYYY')}
          </Button>
          <Table
            className="utils__scrollTable"
            tableLayout="auto"
            scroll={{ x: '100%' }}
            columns={columns}
            dataSource={data}
            pagination={{
              position: 'bottom',
              total: data.length,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100', '200'],
              hideOnSinglePage: data.length < 10,
            }}
            rowKey={() => Math.random()}
          />
        </Drawer>
      </div>
    )
  }
}

export default GeneratedMacro
