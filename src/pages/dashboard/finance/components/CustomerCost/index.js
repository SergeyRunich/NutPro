import React from 'react'
import moment from 'moment'
import { Table, Statistic, Row, Col, Divider, Tag } from 'antd'

class CustomerCost extends React.Component {
  state = {
    // isShowInvoiced: true,
    // isShowWithoutInvoice: false,
  }

  render() {
    // const { searchText, filterDropdownVisible, filtered} = this.state
    const { data, stats } = this.props
    // const { isShowInvoiced, isShowWithoutInvoice } = this.state

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
      {
        title: 'Big boxes',
        dataIndex: 'mainDishAmount',
        key: 'mainDishAmount.invoiced',
        render: text => <Tag color="blue">{text.invoiced}</Tag>,
        sorter: (a, b) => a.mainDishAmount.invoiced - b.mainDishAmount.invoiced,
      },
      {
        title: 'Big boxes (-)',
        dataIndex: 'mainDishAmount',
        key: 'mainDishAmount.withoutInvoice',
        render: text => text.withoutInvoice,
        sorter: (a, b) => a.mainDishAmount.withoutInvoice - b.mainDishAmount.withoutInvoice,
      },
      {
        title: 'Small boxes',
        dataIndex: 'optionDishAmount',
        key: 'optionDishAmount.invoiced',
        render: text => <Tag color="blue">{text.invoiced}</Tag>,
        sorter: (a, b) => a.optionDishAmount.invoiced - b.optionDishAmount.invoiced,
      },
      {
        title: 'Small boxes (-)',
        dataIndex: 'optionDishAmount',
        key: 'optionDishAmount.withoutInvoice',
        render: text => text.withoutInvoice,
        sorter: (a, b) => a.optionDishAmount.withoutInvoice - b.optionDishAmount.withoutInvoice,
      },
      {
        title: 'Total boxes',
        dataIndex: 'totalDishes',
        key: 'totalDishes.invoiced',
        render: text => <Tag color="blue">{text.invoiced}</Tag>,
        sorter: (a, b) => a.totalDishes.invoiced - b.totalDishes.invoiced,
      },
      {
        title: 'Total boxes (-)',
        dataIndex: 'totalDishes',
        key: 'totalDishes.withoutInvoice',
        render: text => text.withoutInvoice,
        sorter: (a, b) => a.totalDishes.withoutInvoice - b.totalDishes.withoutInvoice,
      },
      {
        title: '5ch',
        dataIndex: 'fiveMeals',
        key: 'fiveMeals.invoiced',
        render: text => <Tag color="blue">{text.invoiced}</Tag>,
        sorter: (a, b) => a.fiveMeals.invoiced - b.fiveMeals.invoiced,
      },
      {
        title: '5ch (-)',
        dataIndex: 'fiveMeals',
        key: 'fiveMeals.withoutInvoice',
        render: text => text.withoutInvoice,
        sorter: (a, b) => a.fiveMeals.withoutInvoice - b.fiveMeals.withoutInvoice,
      },
      {
        title: '4ch',
        dataIndex: 'fourMeals',
        key: 'fourMeals.invoiced',
        render: text => <Tag color="blue">{text.invoiced}</Tag>,
        sorter: (a, b) => a.fourMeals.invoiced - b.fourMeals.invoiced,
      },
      {
        title: '4ch (-)',
        dataIndex: 'fourMeals',
        key: 'fourMeals.withoutInvoice',
        render: text => text.withoutInvoice,
        sorter: (a, b) => a.fourMeals.withoutInvoice - b.fourMeals.withoutInvoice,
      },
      {
        title: '3ch',
        dataIndex: 'threeMeals',
        key: 'threeMeals.invoiced',
        render: text => <Tag color="blue">{text.invoiced}</Tag>,
        sorter: (a, b) => a.threeMeals.invoiced - b.threeMeals.invoiced,
      },
      {
        title: '3ch (-)',
        dataIndex: 'threeMeals',
        key: 'threeMeals.withoutInvoice',
        render: text => text.withoutInvoice,
        sorter: (a, b) => a.threeMeals.withoutInvoice - b.threeMeals.withoutInvoice,
      },
      {
        title: '2ch',
        dataIndex: 'twoMeals',
        key: 'twoMeals.invoiced',
        render: text => <Tag color="blue">{text.invoiced}</Tag>,
        sorter: (a, b) => a.twoMeals.invoiced - b.twoMeals.invoiced,
      },
      {
        title: '2ch (-)',
        dataIndex: 'twoMeals',
        key: 'twoMeals.withoutInvoice',
        render: text => text.withoutInvoice,
        sorter: (a, b) => a.twoMeals.withoutInvoice - b.twoMeals.withoutInvoice,
      },
      {
        title: 'Custom',
        dataIndex: 'custom',
        key: 'custom.invoiced',
        render: text => <Tag color="blue">{text.invoiced}</Tag>,
        sorter: (a, b) => a.custom.invoiced - b.custom.invoiced,
      },
      {
        title: 'Custom (-)',
        dataIndex: 'custom',
        key: 'custom.withoutInvoice',
        render: text => text.withoutInvoice,
        sorter: (a, b) => a.custom.withoutInvoice - b.custom.withoutInvoice,
      },
      {
        title: 'Cost',
        dataIndex: 'cost',
        key: 'cost.invoiced',
        render: text => {
          const formatted = text.invoiced.toLocaleString('cs-CZ', {
            style: 'currency',
            currency: 'CZK',
            minimumFractionDigits: 0,
          })
          return <Tag color="blue">{formatted}</Tag>
        },
        sorter: (a, b) => a.cost.invoiced - b.cost.invoiced,
      },
      {
        title: 'Cost (-)',
        dataIndex: 'cost',
        key: 'cost.withoutInvoice',
        render: text => {
          const formatted = text.withoutInvoice.toLocaleString('cs-CZ', {
            style: 'currency',
            currency: 'CZK',
            minimumFractionDigits: 0,
          })
          return formatted
        },
        sorter: (a, b) => a.cost.withoutInvoice - b.cost.withoutInvoice,
      },
    ]

    const totalWithVat = stats?.cost?.invoiced + stats?.cost?.withoutInvoice
    const totalWithoutVat = Number((totalWithVat / 1.15).toFixed(2))
    const totalVat = Number((totalWithVat - totalWithoutVat).toFixed(2))

    const invoicedWithoutVat = Number((stats?.cost?.invoiced / 1.15).toFixed(2))
    const noneInvoicedWithoutVat = Number((stats?.cost?.withoutInvoice / 1.15).toFixed(2))

    return (
      <div>
        {stats.length !== 0 && (
          <>
            <Row>
              <Col sm={24} lg={5}>
                <Statistic title="Total cost (without VAT)" value={totalWithoutVat} suffix="Kč" />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic title="VAT 15%" value={totalVat} suffix="Kč" />
              </Col>
              <Col sm={24} lg={5}>
                <Statistic title="Total cost (with VAT)" value={totalWithVat} suffix="Kč" />
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col sm={24} lg={5}>
                <Statistic
                  title="Invoiced cost (without VAT)"
                  value={invoicedWithoutVat}
                  suffix="Kč"
                />
              </Col>
              <Col sm={24} lg={5}>
                <Statistic
                  title="Invoiced cost (with VAT)"
                  value={stats.cost.invoiced}
                  suffix="Kč"
                />
              </Col>
              <Col sm={24} lg={5}>
                <Statistic
                  title="Without invoice cost (without VAT)"
                  value={noneInvoicedWithoutVat}
                  suffix="Kč"
                />
              </Col>
              <Col sm={24} lg={5}>
                <Statistic
                  title="Without invoice (with VAT)"
                  value={stats.cost.withoutInvoice}
                  suffix="Kč"
                />
              </Col>
            </Row>
            <Divider>Number of boxes</Divider>
            <Row>
              <Col sm={24} lg={4}>
                <Statistic title="Big (invoiced)" value={stats.mainDishAmount.invoiced} />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic title="Small (invoiced)" value={stats.optionDishAmount.invoiced} />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic title="Total (invoiced)" value={stats.totalDishes.invoiced} />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic
                  title="Big (without invoice)"
                  value={stats.mainDishAmount.withoutInvoice}
                />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic
                  title="Small (without invoice)"
                  value={stats.optionDishAmount.withoutInvoice}
                />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic
                  title="Total (without invoice)"
                  value={stats.totalDishes.withoutInvoice}
                />
              </Col>
            </Row>
            <Divider>Number of programs (invoiced)</Divider>
            <Row>
              <Col sm={24} lg={4}>
                <Statistic title="5ch" value={stats.fiveMeals.invoiced} />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic title="4ch" value={stats.fourMeals.invoiced} />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic title="3ch" value={stats.threeMeals.invoiced} />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic title="2ch" value={stats.twoMeals.invoiced} />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic title="Custom" value={stats.custom.invoiced} />
              </Col>
            </Row>
            <Divider>Number of programs (without invoice)</Divider>
            <Row>
              <Col sm={24} lg={4}>
                <Statistic title="5ch (without invoice)" value={stats.fiveMeals.withoutInvoice} />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic title="4ch (without invoice)" value={stats.fourMeals.withoutInvoice} />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic title="3ch (without invoice)" value={stats.threeMeals.withoutInvoice} />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic title="2ch (without invoice)" value={stats.twoMeals.withoutInvoice} />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic title="Custom (without invoice)" value={stats.custom.withoutInvoice} />
              </Col>
            </Row>
            <Divider />
            {/* <Row>
              <Col sm={24} lg={5}>
                <Statistic
                  title="Big box price (without VAT)"
                  value={stats.mainDishPrice}
                  suffix="Kč"
                />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic title="Big boxes" value={stats.mainDishAmount} />
              </Col>
              <Col sm={24} lg={5}>
                <Statistic
                  title="Small box price (without VAT)"
                  value={stats.optionDishPrice}
                  suffix="Kč"
                />
              </Col>
              <Col sm={24} lg={3}>
                <Statistic title="Small boxes" value={stats.optionDishAmount} />
              </Col>
              <Col sm={24} lg={4}>
                <Statistic title="Total boxes" value={stats.totalDishes} />
              </Col>
              <Col sm={24} lg={3}>
                <Statistic title="Total sets" value={stats.totalCustomers} />
              </Col>
            </Row> */}
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

export default CustomerCost
