import React, { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Link, useLocation } from 'react-router-dom'
import moment from 'moment'
import { List, Statistic, Row, Col, notification } from 'antd'
import Calendar from '../../../../components/NutritionPRO/Calendar'
import { getUserMenu } from '../../../../api/erp/users'

moment.updateLocale('en', {
  week: { dow: 1 },
})

const mealCodes = ['Breakfast', 'Snack 1', 'Lunch', 'Snack 2', 'Dinner', 'Dinner 2']

const MenuList = () => {
  const [currentDay, setCurrentDay] = useState(
    moment
      .utc()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .unix(),
  )
  const [days, setDays] = useState([])
  const [dayMenu, setDayMenu] = useState([])
  const [user, setUser] = useState({})

  const [userId, orderId] = useLocation()
    .pathname.split('/')
    .slice(-2)

  const { formatMessage } = useIntl()

  const fetchUserMenu = useCallback(async () => {
    const res = await getUserMenu({ order: orderId, user: userId })
    if (res.ok) {
      const json = await res.json()
      setDays(json.days)
      setUser(json.user)
      setDayMenu(json.result)
    }
  }, [userId, orderId])

  const onSelectChange = date => {
    const current = moment.utc(date.format('DD.MM.YYYY'), 'DD.MM.YYYY').unix()
    setCurrentDay(current)
  }

  const findDay = timestamp => {
    let current = {}
    dayMenu.forEach(menu => {
      if (menu.timestamp === timestamp) current = menu
    })
    return current
  }

  useEffect(() => {
    document.title = 'User menu'
    fetchUserMenu().catch(() => {
      notification.error({
        message: formatMessage({ id: 'global.error' }),
        description: 'User menu not found',
        placement: 'topRight',
      })
    })
  }, [fetchUserMenu, formatMessage])

  const highlightedDays = days.map(d => moment.unix(d).format('DD-MM-YYYY'))
  const day = findDay(currentDay)

  return (
    <div className="card">
      <div className="card-header">
        <div className="utils__title">
          <strong>{formatMessage({ id: 'MenuList.UserMenu' })}</strong>
        </div>
      </div>
      <div className="card-body">
        <Row>
          <Col sm={24} lg={7}>
            <div className="text-center mb-1 mr-1">
              <h4>
                <Link to={`/users/${user.id}`}>
                  <i className="icmn-user mr-1" />
                  {user.name}
                </Link>
              </h4>
              {Boolean(day.order) && (
                <h4>
                  <Link to={`/orders/${day.order}`}>
                    {formatMessage({ id: 'MenuList.ViewOrder' })}
                  </Link>
                </h4>
              )}
              <h4>
                {moment.weekdays(moment.unix(currentDay).isoWeekday())}{' '}
                {moment.unix(currentDay).format('DD.MM.YYYY')}
              </h4>
              <Calendar
                onSelectChange={onSelectChange}
                highlightedDays={highlightedDays}
                isActive
              />
              <br />
              {Boolean(day.order) && (
                <div>
                  <h4>{formatMessage({ id: 'MenuList.RequiredMacro' })}</h4>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Statistic style={{}} title="kCal" value={day.shouldBe.kcal} />
                    <Statistic
                      style={{ marginLeft: '7px' }}
                      title={formatMessage({ id: 'MenuList.Protein' })}
                      value={day.shouldBe.prot}
                    />
                    <Statistic
                      style={{ marginLeft: '7px' }}
                      title={formatMessage({ id: 'MenuList.Fat' })}
                      value={day.shouldBe.fat}
                    />
                    <Statistic
                      style={{ marginLeft: '7px' }}
                      title={formatMessage({ id: 'MenuList.Carbo' })}
                      value={day.shouldBe.carb}
                    />
                  </div>
                </div>
              )}
              {Boolean(day.order) && (
                <div>
                  <br />
                  <h4>{formatMessage({ id: 'MenuList.GeneratedMacro' })}</h4>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Statistic title="kCal" value={day.nutrients ? day.nutrients.kcal : ''} />
                    <Statistic
                      style={{ marginLeft: '10px' }}
                      title={formatMessage({ id: 'MenuList.Protein' })}
                      value={day.nutrients ? day.nutrients.prot : ''}
                    />
                    <Statistic
                      style={{ marginLeft: '10px' }}
                      title={formatMessage({ id: 'MenuList.Fat' })}
                      value={day.nutrients ? day.nutrients.fat : ''}
                    />
                    <Statistic
                      style={{ marginLeft: '10px' }}
                      title={formatMessage({ id: 'MenuList.Carbo' })}
                      value={day.nutrients ? day.nutrients.carb : ''}
                    />
                  </div>
                </div>
              )}
              {Boolean(day.order) && (
                <div>
                  <br />
                  <h4>{formatMessage({ id: 'MenuList.OriginalMacro' })}</h4>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Statistic
                      title={formatMessage({ id: 'MenuList.kCal' })}
                      value={day.originalNutrients ? day.originalNutrients.kcal : ''}
                    />
                    <Statistic
                      style={{ marginLeft: '10px' }}
                      title={formatMessage({ id: 'MenuList.Protein' })}
                      value={day.originalNutrients ? day.originalNutrients.prot : ''}
                    />
                    <Statistic
                      style={{ marginLeft: '10px' }}
                      title={formatMessage({ id: 'MenuList.Fat' })}
                      value={day.originalNutrients ? day.originalNutrients.fat : ''}
                    />
                    <Statistic
                      style={{ marginLeft: '10px' }}
                      title={formatMessage({ id: 'MenuList.Carbo' })}
                      value={day.originalNutrients ? day.originalNutrients.carb : ''}
                    />
                  </div>
                </div>
              )}
            </div>
          </Col>
          <Col sm={24} lg={17}>
            <List
              size="small"
              dataSource={day.dishes}
              renderItem={item => (
                <div className="card" style={{ border: '1px solid #e4e9f0' }}>
                  <div className="card-body">
                    <div style={{ float: 'left' }}>
                      <h4>{mealCodes[item.meal]}</h4>
                      {item.title}
                    </div>
                    <div style={{ alignContent: 'center', float: 'right' }}>
                      <Statistic
                        style={{ float: 'left' }}
                        title={formatMessage({ id: 'MenuList.Energy' })}
                        value={item.nutrients.kcal}
                        suffix="kCal"
                      />
                      <Statistic
                        style={{ float: 'left', marginLeft: '30px' }}
                        title={formatMessage({ id: 'MenuList.Protein' })}
                        value={item.nutrients.prot}
                        suffix="g"
                      />
                      <Statistic
                        style={{ float: 'left', marginLeft: '30px' }}
                        title={formatMessage({ id: 'MenuList.Fat' })}
                        value={item.nutrients.fat}
                        suffix="g"
                      />
                      <Statistic
                        style={{ float: 'left', marginLeft: '30px' }}
                        title={formatMessage({ id: 'MenuList.Carbo' })}
                        value={item.nutrients.carb}
                        suffix="g"
                      />
                      <Statistic
                        style={{ float: 'left', marginLeft: '30px' }}
                        title={formatMessage({ id: 'MenuList.Weight' })}
                        value={item.amount * 1000}
                        suffix="g"
                      />
                    </div>
                  </div>
                </div>
              )}
            />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default MenuList
