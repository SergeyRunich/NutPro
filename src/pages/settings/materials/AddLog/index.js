import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Form, Col, Row, notification, InputNumber, Drawer, Divider, Button } from 'antd'

const boxesList = [
  { type: 'type1', title: 'Dvoudílná 40mm' },
  { type: 'type2', title: 'Dvoudílná 50mm' },
  { type: 'type3', title: 'Dvoudílná 60mm' },
  { type: 'type4', title: 'Jednodílná 40mm' },
  { type: 'type5', title: 'Jednodílná 50mm' },
  { type: 'type6', title: 'Jednodílná 60mm' },
  { type: 'type7', title: 'Polevková zatavovací malá' },
  { type: 'type8', title: 'Polevková zatavovací velká' },
  { type: 'type9', title: 'Uzavírací krabička malá' },
  { type: 'type10', title: 'Uzavírací krabička velká' },
]

const meals = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner']

@injectIntl
@Form.create()
class CreateMaterialLogForm extends React.Component {
  state = {
    stickers: {
      monday: {
        breakfast: 0,
        snack1: 0,
        lunch: 0,
        snack2: 0,
        dinner: 0,
      },
      tuesday: {
        breakfast: 0,
        snack1: 0,
        lunch: 0,
        snack2: 0,
        dinner: 0,
      },
      wednesday: {
        breakfast: 0,
        snack1: 0,
        lunch: 0,
        snack2: 0,
        dinner: 0,
      },
      thursday: {
        breakfast: 0,
        snack1: 0,
        lunch: 0,
        snack2: 0,
        dinner: 0,
      },
      friday: {
        breakfast: 0,
        snack1: 0,
        lunch: 0,
        snack2: 0,
        dinner: 0,
      },
      saturday: {
        breakfast: 0,
        snack1: 0,
        lunch: 0,
        snack2: 0,
        dinner: 0,
      },
    },
    boxes: {
      type1: 0,
      type2: 0,
      type3: 0,
      type4: 0,
      type5: 0,
      type6: 0,
      type7: 0,
      type8: 0,
      type9: 0,
      type10: 0,
    },
    packages: {
      type1: 0,
      type2: 0,
    },
    menu: 0,
  }

  constructor(props) {
    super(props)

    this.onSend = this.onSend.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.onChangeSticker = this.onChangeSticker.bind(this)
    this.onChangeBox = this.onChangeBox.bind(this)
    this.onChangePackage = this.onChangePackage.bind(this)
  }

  onChangeSticker(e, weekday, meal) {
    const { stickers } = this.state
    let value = e
    if (e && e.target) {
      if (e.target.type === 'checkbox') {
        value = e.target.checked
      } else {
        // eslint-disable-next-line prefer-destructuring
        value = e.target.value
      }
    }
    stickers[weekday][meal] = value
    this.setState({
      stickers,
    })
  }

  onChangePackage(e, type) {
    const { packages } = this.state

    let value = e
    if (e && e.target) {
      if (e.target.type === 'checkbox') {
        value = e.target.checked
      } else {
        // eslint-disable-next-line prefer-destructuring
        value = e.target.value
      }
    }
    packages[type] = value
    this.setState({
      packages,
    })
  }

  onChangeBox(e, type) {
    const { boxes } = this.state

    let value = e
    if (e && e.target) {
      if (e.target.type === 'checkbox') {
        value = e.target.checked
      } else {
        // eslint-disable-next-line prefer-destructuring
        value = e.target.value
      }
    }
    boxes[type] = value
    this.setState({
      boxes,
    })
  }

  onChangeMenu(e) {
    let value = e
    if (e.target) {
      if (e.target.type === 'checkbox') {
        value = e.target.checked
      } else {
        // eslint-disable-next-line prefer-destructuring
        value = e.target.value
      }
    }
    this.setState({
      menu: value,
    })
  }

  async onSend(e) {
    e.preventDefault()
    try {
      const {
        form,
        create,
        update,
        kitchen,
        intl: { formatMessage },
      } = this.props
      await form.validateFields()
      const { stickers, packages, menu, boxes } = this.state
      const onSendData = {
        stickers,
        packages,
        menu,
        boxes,
        kitchen,
      }
      const req = await create(onSendData)
      if (req.status === 200) {
        update()
        this.closeDrawer()
        notification.success({
          message: formatMessage({ id: 'global.success' }),
          description: formatMessage({ id: 'Materials.Data added successfully!' }),
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'global.error' }),
          description: req.statusText,
          placement: 'topLeft',
        })
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  closeDrawer() {
    const { onClose, form } = this.props
    onClose()
    this.setState({
      stickers: {
        monday: {
          breakfast: 0,
          snack1: 0,
          lunch: 0,
          snack2: 0,
          dinner: 0,
        },
        tuesday: {
          breakfast: 0,
          snack1: 0,
          lunch: 0,
          snack2: 0,
          dinner: 0,
        },
        wednesday: {
          breakfast: 0,
          snack1: 0,
          lunch: 0,
          snack2: 0,
          dinner: 0,
        },
        thursday: {
          breakfast: 0,
          snack1: 0,
          lunch: 0,
          snack2: 0,
          dinner: 0,
        },
        friday: {
          breakfast: 0,
          snack1: 0,
          lunch: 0,
          snack2: 0,
          dinner: 0,
        },
        saturday: {
          breakfast: 0,
          snack1: 0,
          lunch: 0,
          snack2: 0,
          dinner: 0,
        },
      },
      boxes: {
        type1: 0,
        type2: 0,
        type3: 0,
        type4: 0,
        type5: 0,
        type6: 0,
        type7: 0,
        type8: 0,
        type9: 0,
        type10: 0,
      },
      packages: {
        type1: 0,
        type2: 0,
      },
      menu: 0,
    })

    form.resetFields()
  }

  render() {
    const {
      visible,
      kitchen,
      kitchens,
      intl: { formatMessage },
    } = this.props
    const { stickers, packages, menu, boxes } = this.state

    const rowStyle = {
      padding: '0.5em',
      textAlign: 'center',
      textSize: '10px',
    }

    const currentKitchen = kitchens.find(k => k.id === kitchen)

    return (
      <div>
        <Drawer
          title={formatMessage({ id: 'Materials.Add material log' })}
          width="50%"
          onClose={this.closeDrawer}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" onSubmit={this.onSend}>
            <span style={{ marginRight: '15px', fontSize: '18px' }}>
              {formatMessage({ id: 'Materials.Kitchen: ' })}
              {currentKitchen ? currentKitchen.name : 'Unknown'}
            </span>
            <Button type="primary" onClick={this.onSend}>
              {formatMessage({ id: 'global.create' })}
            </Button>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <Divider orientation="center">
                  {formatMessage({ id: 'Materials.Menu / Packages' })}
                </Divider>
                <center>
                  <Row gutter={16}>
                    <Col md={5} sm={8} style={rowStyle}>
                      <b>{formatMessage({ id: 'Materials.Menu' })}</b>
                    </Col>
                    <Col md={5} sm={8} style={rowStyle}>
                      <b>{formatMessage({ id: 'Materials.Package Small' })}</b>
                    </Col>
                    <Col md={5} sm={8} style={rowStyle}>
                      <b>{formatMessage({ id: 'Materials.Package Big' })}</b>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col style={rowStyle} lg={5} sm={8}>
                      <InputNumber onChange={e => this.onChangeMenu(e)} value={menu} />
                    </Col>
                    <Col style={rowStyle} lg={5} sm={8}>
                      <InputNumber
                        onChange={e => this.onChangePackage(e, 'type1')}
                        value={packages.type1}
                      />
                    </Col>
                    <Col style={rowStyle} lg={5} sm={8}>
                      <InputNumber
                        onChange={e => this.onChangePackage(e, 'type2')}
                        value={packages.type2}
                      />
                    </Col>
                  </Row>
                </center>

                <Divider orientation="center">
                  {formatMessage({ id: 'Materials.Stickers' })}
                </Divider>
                <Row gutter={16}>
                  <Col style={rowStyle} md={4}>
                    <b>
                      <FormattedMessage id="main.monday" />
                    </b>
                  </Col>
                  <Col md={4} style={rowStyle}>
                    <b>
                      <FormattedMessage id="main.tuesday" />
                    </b>
                  </Col>
                  <Col md={4} style={rowStyle}>
                    <b>
                      <FormattedMessage id="main.wednesday" />
                    </b>
                  </Col>
                  <Col md={4} style={rowStyle}>
                    <b>
                      <FormattedMessage id="main.thursday" />
                    </b>
                  </Col>
                  <Col md={4} style={rowStyle}>
                    <b>
                      <FormattedMessage id="main.friday" />
                    </b>
                  </Col>
                  <Col md={4} style={rowStyle}>
                    <b>
                      <FormattedMessage id="main.saturday" />
                    </b>
                  </Col>
                </Row>

                {meals.map(meal => (
                  <Row key={Math.random()} gutter={16}>
                    <Col style={rowStyle} md={4}>
                      <InputNumber
                        onChange={e => this.onChangeSticker(e, 'monday', meal)}
                        value={stickers.monday[meal]}
                      />
                    </Col>
                    <Col style={rowStyle} md={4}>
                      <InputNumber
                        onChange={e => this.onChangeSticker(e, 'tuesday', meal)}
                        value={stickers.tuesday[meal]}
                      />
                    </Col>
                    <Col style={rowStyle} md={4}>
                      <InputNumber
                        onChange={e => this.onChangeSticker(e, 'wednesday', meal)}
                        value={stickers.wednesday[meal]}
                      />
                    </Col>
                    <Col style={rowStyle} md={4}>
                      <InputNumber
                        onChange={e => this.onChangeSticker(e, 'thursday', meal)}
                        value={stickers.thursday[meal]}
                      />
                    </Col>
                    <Col style={rowStyle} md={4}>
                      <InputNumber
                        onChange={e => this.onChangeSticker(e, 'friday', meal)}
                        value={stickers.friday[meal]}
                      />
                    </Col>
                    <Col style={rowStyle} md={4}>
                      <InputNumber
                        onChange={e => this.onChangeSticker(e, 'saturday', meal)}
                        value={stickers.saturday[meal]}
                      />
                    </Col>
                  </Row>
                ))}
              </Col>

              <Col md={24} sm={24}>
                <Divider orientation="center">{formatMessage({ id: 'Materials.Boxes' })}</Divider>

                <center>
                  <Row gutter={16}>
                    <Col md={5} sm={12} style={rowStyle}>
                      <b>{formatMessage({ id: 'Materials.Box' })}</b>
                    </Col>
                    <Col md={5} sm={12} style={rowStyle}>
                      <b>{formatMessage({ id: 'Materials.Value' })}</b>
                    </Col>
                  </Row>

                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(index => (
                    <Row key={index} gutter={16}>
                      <Col style={rowStyle} lg={5} sm={12}>
                        {boxesList[index].title}
                      </Col>
                      <Col style={rowStyle} lg={5} sm={12}>
                        <InputNumber
                          onChange={e => this.onChangeBox(e, `type${index + 1}`)}
                          value={boxes[`type${index + 1}`]}
                        />
                      </Col>
                    </Row>
                  ))}
                </center>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
    )
  }
}

export default CreateMaterialLogForm
