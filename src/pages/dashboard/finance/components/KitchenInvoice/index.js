import React from 'react'
import moment from 'moment'
import { Table, Statistic, Row, Col, Divider } from 'antd'

class KitchenInvoice extends React.Component {
  state = {}

  render() {
    // const { searchText, filterDropdownVisible, filtered} = this.state
    const { data, stats } = this.props

    const columns = [
      {
        title: 'Date',
        dataIndex: 'cookingDate',
        key: 'cookingDate',
        render: text => {
          return <span>{text}</span>
        },
        sorter: (a, b) => moment(a.cookingDate) - moment(b.cookingDate),
      },
      {
        title: 'Kitchen',
        dataIndex: 'kitchen',
        key: 'kitchen',
        render: text => {
          return <span>{text}</span>
        },
        sorter: (a, b) => a.kitchen - b.kitchen,
      },
      // {
      //   title: 'Den',
      //   dataIndex: 'cookingWeekday',
      //   key: 'cookingWeekday',
      //   render: text => {
      //     return <span>{text}</span>
      //   },
      // },
      {
        title: 'Total price (without VAT)',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        render: text => {
          const formatted = text.toLocaleString('cs-CZ', {
            style: 'currency',
            currency: 'CZK',
            minimumFractionDigits: 0,
          })
          return <span>{formatted}</span>
        },
        sorter: (a, b) => a.totalPrice - b.totalPrice,
      },
      {
        title: 'VAT 15%',
        dataIndex: 'totalVAT',
        key: 'totalVAT',
        render: text => {
          const formatted = text.toLocaleString('cs-CZ', {
            style: 'currency',
            currency: 'CZK',
            minimumFractionDigits: 0,
          })
          return <span>{formatted}</span>
        },
        sorter: (a, b) => a.totalVAT - b.totalVAT,
      },
      {
        title: 'Total with VAT',
        dataIndex: 'totalWithVAT',
        key: 'totalWithVAT',
        render: text => {
          const formatted = text.toLocaleString('cs-CZ', {
            style: 'currency',
            currency: 'CZK',
            minimumFractionDigits: 0,
          })
          return <span>{formatted}</span>
        },
        sorter: (a, b) => a.totalWithVAT - b.totalWithVAT,
      },
      {
        title: 'Big box price (without VAT)',
        dataIndex: 'mainDishPrice',
        key: 'mainDishPrice',
        render: text => {
          const formatted = text.toLocaleString('cs-CZ', {
            style: 'currency',
            currency: 'CZK',
            minimumFractionDigits: 0,
          })
          return <span>{formatted}</span>
        },
        sorter: (a, b) => a.mainDishPrice - b.mainDishPrice,
      },
      {
        title: 'Big boxes',
        dataIndex: 'mainDishAmount',
        key: 'mainDishAmount',
        render: text => {
          return <span>{text.invoiced + text.withoutInvoice}</span>
        },
        sorter: (a, b) => a.mainDishAmount - b.mainDishAmount,
      },
      {
        title: 'Small box price (without VAT)',
        dataIndex: 'optionDishPrice',
        key: 'optionDishPrice',
        render: text => {
          const formatted = text.toLocaleString('cs-CZ', {
            style: 'currency',
            currency: 'CZK',
            minimumFractionDigits: 0,
          })
          return <span>{formatted}</span>
        },
        sorter: (a, b) => a.optionDishPrice - b.optionDishPrice,
      },
      {
        title: 'Small boxes',
        dataIndex: 'optionDishAmount',
        key: 'optionDishAmount',
        render: text => {
          return <span>{text.invoiced + text.withoutInvoice}</span>
        },
        sorter: (a, b) => a.optionDishAmount - b.optionDishAmount,
      },
      {
        title: 'Total boxes',
        dataIndex: 'totalDishes',
        key: 'totalDishes',
        render: text => {
          return <span>{text.invoiced + text.withoutInvoice}</span>
        },
        sorter: (a, b) => a.totalDishes - b.totalDishes,
      },
      {
        title: 'Total sets',
        dataIndex: 'totalSets',
        key: 'totalSets',
        render: text => {
          return <span>{text}</span>
        },
        sorter: (a, b) => a.totalSets - b.totalSets,
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: price => {
          return <span>{`${price?.main} Kč / ${price?.option} Kč`}</span>
        },
      },
    ]

    return (
      <div>
        {stats.length !== 0 && (
          <>
            <Row>
              <Col sm={24} lg={5}>
                <Statistic title="Total price (without VAT)" value={stats.totalPrice} suffix="Kč" />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic title="VAT 15%" value={stats.totalVAT} suffix="Kč" />
              </Col>
              <Col sm={24} lg={5}>
                <Statistic title="Total price (with VAT)" value={stats.totalWithVAT} suffix="Kč" />
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col sm={24} lg={5}>
                <Statistic
                  title="Big box price (without VAT)"
                  value={stats.mainDishPrice}
                  suffix="Kč"
                />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic
                  title="Big boxes"
                  value={stats.mainDishAmount.invoiced + stats.mainDishAmount.withoutInvoice}
                />
              </Col>
              <Col sm={24} lg={5}>
                <Statistic
                  title="Small box price (without VAT)"
                  value={stats.optionDishPrice}
                  suffix="Kč"
                />
              </Col>
              <Col sm={24} lg={3}>
                <Statistic
                  title="Small boxes"
                  value={stats.optionDishAmount.invoiced + stats.optionDishAmount.withoutInvoice}
                />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic
                  title="Total boxes"
                  value={stats.totalDishes.invoiced + stats.totalDishes.withoutInvoice}
                />
              </Col>
              <Col sm={24} lg={3}>
                <Statistic title="Total sets" value={stats.totalSets} />
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col sm={24} lg={4}>
                <Statistic title="Big boxes (invoiced)" value={stats.mainDishAmount.invoiced} />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic title="Small boxes (invoiced)" value={stats.optionDishAmount.invoiced} />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic
                  title="Big boxes (without invoice)"
                  value={stats.mainDishAmount.withoutInvoice}
                />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic
                  title="Small boxes (without invoice)"
                  value={stats.optionDishAmount.withoutInvoice}
                />
              </Col>
            </Row>
          </>
        )}
        <Table
          // className="utils__scrollTable"
          style={{ marginTop: '20px' }}
          tableLayout="auto"
          scroll={{ x: '100%' }}
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 12, position: 'bottom' }}
        />
      </div>
    )
  }
}

export default KitchenInvoice
