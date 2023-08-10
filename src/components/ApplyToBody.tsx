import { useThemeClassName } from '@fluentui/react-components'
import { useEffect } from 'react'

export default function ApplyToBody() {
  const classes = useThemeClassName()

  useEffect(() => {
    const classList = classes.split(' ')
    document.body.classList.add(...classList)

    return () => {
      document.body.classList.remove(...classList)
    }
  }, [classes])

  return null
}
