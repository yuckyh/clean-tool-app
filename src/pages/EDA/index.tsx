import Nav from '@/components/Nav'
import { getFormattedColumns } from '@/features/columnsSlice'
import { useAppSelector } from '@/lib/hooks'
import { makeStyles } from '@fluentui/react-components'
import { Outlet } from 'react-router-dom'

const snakeToSlug = (str: string) => str.replace(/_/g, '-')

const useClasses = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
})

export const Component = () => {
  const formattedColumns = useAppSelector(getFormattedColumns)

  const paths = formattedColumns.map(snakeToSlug).map((slug) => `/EDA/${slug}`)

  const classes = useClasses()

  return (
    <div className={classes.root}>
      <Nav paths={paths} vertical={true} />
      <Outlet />
    </div>
  )
}

Component.displayName = 'EDA'
