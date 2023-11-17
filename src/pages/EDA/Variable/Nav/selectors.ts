/**
 * @file This file contains the selectors for the EDA variable nav page.
 * @module pages/EDA/Variable/Nav/selectors
 */

import type { AppState } from '@/app/store'

import { getColumnPath, getFormattedColumn } from '@/selectors/matches/format'
import { getLocationPathWords } from '@/selectors/progress/paths'

/**
 * The props for the variable nav selectors.
 */
interface BaseProps {
  /**
   * The position of the variable.
   */
  readonly pos: number
}

/**
 * Selector function to get the path.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.pos - The position of the variable.
 * @returns The path.
 * @example
 * ```tsx
 *  const path = useAppSelector(selectPath(props))
 * ```
 */
export const selectPath =
  ({ pos }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getColumnPath(state, pos)

/**
 * Selector function to get the label.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.pos - The position of the variable.
 * @returns The label.
 * @example
 * ```tsx
 *  const label = useAppSelector(selectLabel(props))
 * ```
 */
export const selectLabel =
  ({ pos }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getFormattedColumn(state, pos)

/**
 * Selector function to get the path words.
 * @param pathname - The location pathname.
 * @returns The path words.
 * @example
 * ```tsx
 *  const pathWords = useAppSelector(selectPathWords(pathname))
 * ```
 */
export const selectPathWords = (pathname: string) => (state: AppState) =>
  getLocationPathWords(state, '', pathname)

/**
 * Selector function to get the previous variable path.
 * @param pos - The position of the variable.
 * @returns The previous variable path.
 * @example
 * ```tsx
 *  const prevVariablePath = useAppSelector(selectPrevVariablePath(pos))
 * ```
 */
export const selectPrevVariablePath = (pos: number) => (state: AppState) =>
  getColumnPath(state, pos - 1)

/**
 * Selector function to get the next variable path.
 * @param pos - The position of the variable.
 * @returns The next variable path.
 * @example
 * ```tsx
 *  const nextVariablePath = useAppSelector(selectNextVariablePath(pos))
 * ```
 */
export const selectNextVariablePath = (pos: number) => (state: AppState) =>
  getColumnPath(state, pos + 1)
