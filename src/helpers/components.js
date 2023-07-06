export function getQueryName(component, postfix = '') {
  let result = getComponentName(component)
  if (postfix) {
    result = `${result}.${postfix}`
  }

  return result
}

export function getComponentName(component) {
  if (component?.displayName) {
    return component.displayName
  }

  if (component?.name) {
    return component.name
  }

  return ''
}
