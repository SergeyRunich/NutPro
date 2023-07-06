import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'antd'

import { getTechcard } from '../../../../api/erp/techcard'
import { editTemplateMenu } from '../../../../api/erp/template'
import TechcardDetail from '../TechcardDetail'
import TemplateDetail from '../TemplateDetail'
import EditTemplateForm from '../CreateTemplate'

@connect(({ user }) => ({ user }))
class Week extends React.Component {
  state = {
    selectedTechcard: '',
    techcardVisible: false,
    selectedTemplate: '',
    templateVisible: false,
    editTemplateFormVisible: false,
    forEdit: {},
  }

  showTechcard = id => {
    getTechcard(id).then(async answer => {
      if (answer.status === 200) {
        const json = await answer.json()
        this.setState({
          selectedTechcard: json,
          techcardVisible: true,
        })
      }
    })
  }

  onCloseTechcard = () => {
    this.setState({
      techcardVisible: false,
      selectedTechcard: '',
    })
  }

  showTemplate = template => {
    this.setState({
      selectedTemplate: template,
      templateVisible: true,
    })
  }

  onCloseTemplate = () => {
    this.setState({
      templateVisible: false,
      selectedTemplate: '',
    })
  }

  editTemplateModal = forEdit => {
    this.setState({
      forEdit,
      editTemplateFormVisible: true,
    })
  }

  onCloseEditTemplateForm = () => {
    this.setState({
      editTemplateFormVisible: false,
      forEdit: {},
    })
  }

  render() {
    const { week } = this.props
    const {
      selectedTechcard,
      techcardVisible,
      selectedTemplate,
      templateVisible,
      editTemplateFormVisible,
      forEdit,
    } = this.state

    const meals = ['Breakfast', '1 Snack', 'Lunch', '2 Snack', 'Dinner']

    const sharedStyle = {
      border: '1px solid #e8e8e8',
      borderCollapse: 'collapse',
      borderRadius: '10px',
      padding: '0.5em',
      textAlign: 'center',
      textSize: '10px',
    }

    const sharedStyleRed = {
      border: '1px solid #e8e8e8',
      borderCollapse: 'collapse',
      padding: '0.5em',
      textAlign: 'center',
      textSize: '10px',
      // backgroundColor: '#FF5733',
      background:
        'linear-gradient(90deg, rgba(251,0,0,0.23573179271708689) 0%, rgba(255,0,0,0.5018382352941176) 50%, rgba(255,0,0,0.24) 100%)',
    }

    const sharedStyleYellow = {
      border: '1px solid #e8e8e8',
      borderCollapse: 'collapse',
      padding: '0.5em',
      textAlign: 'center',
      textSize: '10px',
      // backgroundColor: '#FF5733',
      background:
        'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(232,255,0,0.3113620448179272) 50%, rgba(255,255,255,1) 100%)',
    }

    const sharedStyleGreen = {
      border: '1px solid #e8e8e8',
      borderCollapse: 'collapse',
      padding: '0.5em',
      textAlign: 'center',
      textSize: '10px',
      background:
        'linear-gradient(90deg, rgba(22,251,0,0.23573179271708689) 0%, rgba(0,255,12,0.41780462184873945) 50%, rgba(22,251,0,0.24) 100%)',
    }

    const tableStyle = {
      border: '1px solid #e8e8e8',
      borderCollapse: 'collapse',
      borderRadius: '5px',
      padding: '0.5em',
      marginTop: '15px',
      display: 'inline-table',
    }

    return (
      <div>
        {Boolean(week.id) && (
          <div style={{ minWidth: '100%', maxWidth: '100%' }}>
            <br />
            <center>
              <h3>{week.title}</h3>
            </center>
            <center>
              <table style={tableStyle} width="100%">
                <tbody>
                  <tr>
                    <th style={sharedStyle}>
                      <FormattedMessage id="erp.meal" />
                    </th>
                    {[0, 1, 2, 3, 4, 5].map(dayNumber => {
                      return (
                        <th key={dayNumber} style={sharedStyle}>
                          <NavLink
                            to="#"
                            onClick={e => {
                              this.showTemplate(week.days[dayNumber].template)
                              e.preventDefault()
                            }}
                            style={{ textDecoration: 'underline' }}
                          >
                            {` ${week.days[dayNumber].template.name}`}
                          </NavLink>
                        </th>
                      )
                    })}
                  </tr>
                  {[0, 1, 2, 3, 4].map(mealNumber => {
                    return (
                      <tr key={mealNumber}>
                        <td style={sharedStyle}>{meals[mealNumber]}</td>
                        {[0, 1, 2, 3, 4, 5].map(dayNumber => {
                          const dish = week.days[dayNumber].dishes.find(d => d.meal === mealNumber)
                          let style =
                            dish !== undefined && dish.score >= 4.2
                              ? sharedStyleGreen
                              : sharedStyleYellow
                          if (dish !== undefined && dish.score < 3.7) {
                            style = sharedStyleRed
                          }
                          if (dish === undefined || Number(dish.score) === 0) {
                            style = sharedStyle
                          }
                          return (
                            <td key={dayNumber} style={style}>
                              {dish !== undefined ? (
                                <span>
                                  <NavLink
                                    to="#"
                                    onClick={e => {
                                      this.showTechcard(dish.id)
                                      e.preventDefault()
                                    }}
                                  >
                                    {dish.title}
                                  </NavLink>
                                  {Number(dish.score) !== 0 && ' '}
                                  {Number(dish.score) !== 0 && <Icon type="star" />}
                                  {Number(dish.score) !== 0 && dish.score}
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </center>
          </div>
        )}
        <TechcardDetail
          visible={techcardVisible}
          techcard={selectedTechcard}
          onClose={this.onCloseTechcard}
        />
        <TemplateDetail
          template={selectedTemplate}
          visible={templateVisible}
          onClose={this.onCloseTemplate}
          edit={this.editTemplateModal}
          removeTemplate={this.removeTemplate}
        />
        <EditTemplateForm
          visible={editTemplateFormVisible}
          onClose={this.onCloseEditTemplateForm}
          forEdit={forEdit}
          edit={editTemplateMenu}
        />
      </div>
    )
  }
}

export default Week
