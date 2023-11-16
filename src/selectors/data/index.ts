import type { AppState } from '@/app/store'

/**
 * Selector function to get the data from the sheet slice of the state.
 * @param state - The application state {@link AppState}.
 * @param state.data - The data slice of the state.
 * @returns The data from the sheet slice of the state.
 * @example
 *  const getColumnsByData = createSelector(
 *    [getData],
 *    f.flow(
 *      RA.map(RR.keys),
 *      head,
 *      f.apply([] as readonly (keyof CellItem.CellItem)[]),
 *    ),
 *  )
 */
export const getData = ({ data }: AppState) => data.data

/**
 *
 * @param state
 * @param state.data
 * @returns
 * @example
 */
export const getDataLength = ({ data }: AppState) => data.data.length
