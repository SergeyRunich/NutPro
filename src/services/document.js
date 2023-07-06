import { notification } from 'antd'
import { saveAs } from 'file-saver'
import * as API from '../api/document'

export default API.getDocument

export async function getDocument(
  doc,
  periodCode,
  kitchen = 'kitchen',
  period = [],
  event = false,
) {
  await API.getDocument(doc, periodCode, kitchen, period, event)
    .then(async resp => {
      const blob = await resp.blob()
      const filename = resp.headers.get('Filename')
      saveAs(blob, `${filename}`)
      return true
    })
    .catch(error => {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    })
  return false
}
