import React from 'react'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Drawer, Table, Row, Col } from 'antd'

@injectIntl
@withRouter
class CompareIngredientList extends React.Component {
  state = {
    initialIngredients: [],
    finalIngredients: [],
    compareData: [],
  }

  constructor(props) {
    super(props)

    this.closeDrawer = this.closeDrawer.bind(this)
  }

  componentWillReceiveProps() {
    const { initialIngredients, finalIngredients, compareData } = this.props
    this.setState({
      initialIngredients,
      finalIngredients,
      compareData,
    })
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
    const { initialIngredients, finalIngredients, compareData } = this.state

    const columns = [
      {
        title: formatMessage({ id: 'Documents.Ingredient' }),
        dataIndex: 'name',
        key: 'name',
        render: name => name,
      },
      {
        title: formatMessage({ id: 'Documents.Brutto' }),
        dataIndex: 'totalBrutto',
        key: 'totalBrutto',
        render: totalBrutto => Number(totalBrutto).toFixed(2),
        sorter: (a, b) => a.totalBrutto - b.totalBrutto,
      },
      {
        title: formatMessage({ id: 'Documents.Unit' }),
        dataIndex: 'unit',
        key: 'unit',
        render: unit => unit,
      },
    ]

    const columnsCompare = [
      {
        title: formatMessage({ id: 'Documents.Ingredient' }),
        dataIndex: 'name',
        key: 'name',
        render: name => name,
      },
      {
        title: formatMessage({ id: 'Documents.Initial' }),
        dataIndex: 'initialBrutto',
        key: 'initialBrutto',
        render: initialBrutto => Number(initialBrutto).toFixed(2),
        sorter: (a, b) => a.initialBrutto - b.initialBrutto,
      },
      {
        title: formatMessage({ id: 'Documents.Final' }),
        dataIndex: 'finalBrutto',
        key: 'finalBrutto',
        render: finalBrutto => Number(finalBrutto).toFixed(2),
        sorter: (a, b) => a.finalBrutto - b.finalBrutto,
      },
      {
        title: formatMessage({ id: 'Documents.Unit' }),
        dataIndex: 'unit',
        key: 'unit',
        render: unit => unit,
      },
      {
        title: formatMessage({ id: 'Documents.%' }),
        dataIndex: 'diffPercent',
        key: 'diffPercent',
        render: diffPercent => diffPercent,
        sorter: (a, b) => a.diffPercent - b.diffPercent,
      },
    ]
    return (
      <div>
        <Drawer
          title={formatMessage({ id: 'Documents.ComparisonOfIngredients' })}
          width="100%"
          onClose={this.closeDrawer}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Row gutter={16}>
            <Col md={8} sm={24}>
              <h2>{formatMessage({ id: 'Documents.InitialIngredient' })}</h2>
              <Table
                className="utils__scrollTable"
                tableLayout="auto"
                scroll={{ x: '100%' }}
                columns={columns}
                dataSource={initialIngredients}
                pagination={{
                  position: 'bottom',
                  total: initialIngredients.length,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50', '100', '200'],
                  hideOnSinglePage: initialIngredients.length < 10,
                }}
                rowKey={() => Math.random()}
              />
            </Col>
            <Col md={8} sm={24}>
              <h2>{formatMessage({ id: 'Documents.FinalIngredient' })}</h2>
              <Table
                className="utils__scrollTable"
                tableLayout="auto"
                scroll={{ x: '100%' }}
                columns={columns}
                dataSource={finalIngredients}
                pagination={{
                  position: 'bottom',
                  total: finalIngredients.length,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50', '100', '200'],
                  hideOnSinglePage: finalIngredients.length < 10,
                }}
                rowKey={() => Math.random()}
              />
            </Col>
            <Col md={compareData.length !== 0 ? 8 : 0} sm={compareData.length !== 0 ? 24 : 0}>
              <h2>{formatMessage({ id: 'Documents.Extreme' })}</h2>
              <Table
                className="utils__scrollTable"
                tableLayout="auto"
                scroll={{ x: '100%' }}
                columns={columnsCompare}
                dataSource={compareData}
                pagination={{
                  position: 'bottom',
                  total: compareData.length,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50', '100', '200'],
                  hideOnSinglePage: compareData.length < 10,
                }}
                rowKey={() => Math.random()}
              />
            </Col>
          </Row>
        </Drawer>
      </div>
    )
  }
}

export default CompareIngredientList
