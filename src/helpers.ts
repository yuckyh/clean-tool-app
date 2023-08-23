// import type { Component } from 'react'

export const pascalToTitle = (pascalString: string) => {
  const titleString = pascalString.replace(/([a-z])([A-Z])/g, '$1 $2')
  return titleString.charAt(0).toUpperCase() + titleString.slice(1)
}

export const getPathTitle = (path: string) => {
  if (path === '/') {
    return 'Home'
  }
  const lastPart = path.split('/').pop() ?? ''
  // const title =
  return lastPart
    .replace(/-/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// export const lazyImportComponent = async (componentPath: string) => {
//   console.log('lazy loaded', componentPath)
//   return {
//     lazy: {
//       Component: (await import(componentPath)) as Component,
//     },
//   }
// }
