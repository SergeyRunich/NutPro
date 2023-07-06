/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Statistic, Row, Col, Divider } from 'antd'

function Margin({ data }) {
  const [deliveryPrice, setDeliveryPrice] = useState(40)
  const [deliveryCost, setDeliveryCost] = useState(0)

  useEffect(() => {
    setDeliveryCost((deliveryPrice || 40) * (data?.kitchenCost?.totalSets || 0))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.kitchenCost?.totalSets, deliveryPrice])
  // const { searchText, filterDropdownVisible, filtered} = this.state
  // const { isShowInvoiced, isShowWithoutInvoice } = this.state

  const totalInvoicedWithVat = data?.customerCost?.cost?.invoiced
  const totalInvoicedlWithoutVat = Number((totalInvoicedWithVat / 1.15).toFixed(2))
  const totalPaidWithoutVat = Number((data?.customerCost?.cost?.paid / 1.15).toFixed(2))
  const totalInvoicedVat = Number((totalInvoicedWithVat - totalInvoicedlWithoutVat).toFixed(2))

  const invoicedWithoutVat = Number((data?.customerCost?.cost?.invoiced / 1.15).toFixed(2))
  // const noneInvoicedWithoutVat = Number((data?.cost?.withoutInvoice / 1.15).toFixed(2));

  // const netRevenueInvoiced = totalInvoicedlWithoutVat - data?.kitchenCost?.totalWithVAT - deliveryCost;
  // const netRevenuePaid = totalPaidWithoutVat - data?.kitchenCost?.totalWithVAT - deliveryCost;
  const netRevenueInvoiced = totalInvoicedWithVat - data?.kitchenCost?.totalWithVAT - deliveryCost
  const netRevenuePaid =
    data?.customerCost?.cost?.paid - data?.kitchenCost?.totalWithVAT - deliveryCost

  // const marginInvoiced = (netRevenueInvoiced / totalInvoicedlWithoutVat * 100).toFixed(2)
  // const marginPaid = (netRevenuePaid / totalPaidWithoutVat * 100).toFixed(2)
  const marginInvoiced = ((netRevenueInvoiced / totalInvoicedWithVat) * 100).toFixed(2)
  const marginPaid = ((netRevenuePaid / data?.customerCost?.cost?.paid) * 100).toFixed(2)

  return (
    <div>
      {data.length !== 0 && (
        <>
          <Divider>Food & Delivery cost</Divider>
          <Row>
            <Col sm={24} lg={5}>
              <Statistic
                title="Food cost (without VAT)"
                value={data?.kitchenCost?.totalPrice}
                suffix="Kč"
              />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic title="VAT 15%" value={data?.kitchenCost?.totalVAT} suffix="Kč" />
            </Col>
            <Col sm={24} lg={5}>
              <Statistic
                title="Food cost (with VAT)"
                value={data?.kitchenCost?.totalWithVAT}
                suffix="Kč"
              />
            </Col>
            <Col sm={24} lg={5}>
              <Statistic title="Delivery cost" value={deliveryCost} suffix="Kč" />
            </Col>
          </Row>
          <Divider>Revenue</Divider>
          <Row>
            <Col sm={24} lg={5}>
              <Statistic title="Invoiced revenue" value={totalInvoicedlWithoutVat} suffix="Kč" />
            </Col>
            <Col sm={24} lg={5}>
              <Statistic title="VAT 15%" value={totalInvoicedVat} suffix="Kč" />
            </Col>
            <Col sm={24} lg={5}>
              <Statistic
                title="Customer cost (with VAT)"
                value={totalInvoicedWithVat}
                suffix="Kč"
              />
            </Col>
            <Col sm={24} lg={5}>
              <Statistic
                title="Revenue paid (with VAT)"
                value={data?.customerCost?.cost?.paid}
                suffix="Kč"
              />
            </Col>
          </Row>
          <Divider>Net Revenue & Margin</Divider>
          <Row>
            <Col sm={24} lg={5}>
              <Statistic title="Net revenue (invoiced)" value={netRevenueInvoiced} suffix="Kč" />
            </Col>
            <Col sm={24} lg={5}>
              <Statistic title="Margin (invoiced)" value={marginInvoiced} suffix="%" />
            </Col>
            <Col sm={24} lg={5}>
              <Statistic title="Net revenue (paid)" value={netRevenuePaid} suffix="Kč" />
            </Col>
            <Col sm={24} lg={5}>
              <Statistic title="Margin (paid)" value={marginPaid} suffix="%" />
            </Col>
          </Row>
          <Divider>Number of boxes</Divider>
          <Row>
            <Col sm={24} lg={4}>
              <Statistic title="Big (invoiced)" value={data.kitchenCost.mainDishAmount.invoiced} />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic
                title="Small (invoiced)"
                value={data.kitchenCost.optionDishAmount.invoiced}
              />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic title="Total (invoiced)" value={data.kitchenCost.totalDishes.invoiced} />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic
                title="Big (without invoice)"
                value={data.kitchenCost.mainDishAmount.withoutInvoice}
              />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic
                title="Small (without invoice)"
                value={data.kitchenCost.optionDishAmount.withoutInvoice}
              />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic
                title="Total (without invoice)"
                value={data.kitchenCost.totalDishes.withoutInvoice}
              />
            </Col>
          </Row>
          {/* <Divider>Number of programs (invoiced)</Divider>
          <Row>
            <Col sm={24} lg={4}>
              <Statistic title="5ch" value={data.fiveMeals.invoiced} />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic title="4ch" value={data.fourMeals.invoiced} />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic title="3ch" value={data.threeMeals.invoiced} />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic title="2ch" value={data.twoMeals.invoiced} />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic title="Custom" value={data.custom.invoiced} />
            </Col>
          </Row> */}
          {/* <Divider>Number of programs (without invoice)</Divider>
          <Row>
            <Col sm={24} lg={4}>
              <Statistic title="5ch (without invoice)" value={data.fiveMeals.withoutInvoice} />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic title="4ch (without invoice)" value={data.fourMeals.withoutInvoice} />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic title="3ch (without invoice)" value={data.threeMeals.withoutInvoice} />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic title="2ch (without invoice)" value={data.twoMeals.withoutInvoice} />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic title="Custom (without invoice)" value={data.custom.withoutInvoice} />
            </Col>
          </Row> */}
          <Divider />
          {/* <Row>
            <Col sm={24} lg={5}>
              <Statistic
                title="Big box price (without VAT)"
                value={data.mainDishPrice}
                suffix="Kč"
              />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic title="Big boxes" value={data.mainDishAmount} />
            </Col>
            <Col sm={24} lg={5}>
              <Statistic
                title="Small box price (without VAT)"
                value={data.optionDishPrice}
                suffix="Kč"
              />
            </Col>
            <Col sm={24} lg={3}>
              <Statistic title="Small boxes" value={data.optionDishAmount} />
            </Col>
            <Col sm={24} lg={4}>
              <Statistic title="Total boxes" value={data.totalDishes} />
            </Col>
            <Col sm={24} lg={3}>
              <Statistic title="Total sets" value={data.totalCustomers} />
            </Col>
          </Row> */}
        </>
      )}
    </div>
  )
}

export default Margin
