export interface Match<T extends Handle = Handle> {
  id: string
  pathname: string
  params: Params<string>
  data: unknown
  handle: T
}

interface Handle {
  id: string
  [key: string]: Function | string
}
