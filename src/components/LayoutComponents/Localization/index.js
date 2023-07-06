import React from 'react'
import { ConfigProvider } from 'antd'
import { IntlProvider } from 'react-intl'
import { connect } from 'react-redux'
import english from 'locales/en-US'
import french from 'locales/fr-FR'
import russian from 'locales/ru-RU'
import chinese from 'locales/zh-CN'

/**
 * To enable fallback missing localized messages to english
 */
russian.messages = { ...english.messages, ...russian.messages }
french.messages = { ...english.messages, ...french.messages }
chinese.messages = { ...english.messages, ...chinese.messages }

const locales = {
  'en-US': english,
  'fr-FR': french,
  'ru-RU': russian,
  'zh-CN': chinese,
}

@connect(({ settings }) => ({ settings }))
class Localization extends React.Component {
  render() {
    const {
      children,
      settings: { locale },
    } = this.props
    const currentLocale = locales[locale]
    return (
      <ConfigProvider locale={currentLocale.antdData}>
        <IntlProvider
          locale={currentLocale.locale}
          defaultLocale="en-US"
          messages={currentLocale.messages}
        >
          {children}
        </IntlProvider>
      </ConfigProvider>
    )
  }
}

export default Localization
