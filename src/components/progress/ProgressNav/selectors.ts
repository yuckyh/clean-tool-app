import type { AppState } from '@/app/store'

import {
  getAllowedPaths,
  getIsDisabled,
  getShouldNavigateToAllowed,
} from '@/selectors/progress'
import {
  getPaths,
  getPosition,
  getProgressValue,
} from '@/selectors/progress/paths'

/**
 * The selector to get the allowed paths for the current progress navigation.
 * @param componentPath - The progress nav's component path in the router.
 * @returns The selector function.
 * @example
 * ```ts
 *    const allowedPaths = useAppSelector(selectAllowedPaths(componentPath))
 * ```
 */
export const selectAllowedPaths =
  (componentPath: string) => (state: AppState) =>
    getAllowedPaths(state, componentPath)

/**
 * The selector to get whether the user should be navigated to the allowed path.
 * @param componentPath - The progress nav's component path in the router.
 * @param locationPath - The current location path.
 * @returns The selector function.
 * @example
 * ```ts
 *    const shouldNavigateToAllowed = useAppSelector(
 *      selectShouldNavigateToAllowed(componentPath, locationPath),
 *    )
 * ```
 */
export const selectShouldNavigateToAllowed =
  (componentPath: string, locationPath: string) => (state: AppState) =>
    getShouldNavigateToAllowed(state, componentPath, locationPath)

/**
 * The selector to get the paths for the current progress navigation.
 * @param componentPath - The progress nav's component path in the router.
 * @returns The selector function.
 * @example
 * ```tsx
 *    const paths = useAppSelector(selectPaths(componentPath))
 * ```
 */
export const selectPaths = (componentPath: string) => (state: AppState) =>
  getPaths(state, componentPath)

/**
 * The selector to get the position for the current progress navigation.
 * @param componentPath - The progress nav's component path in the router.
 * @param locationPath - The current location path.
 * @returns The selector function.
 * @example
 * ```tsx
 *    const position = useAppSelector(selectPosition(componentPath, locationPath))
 * ```
 */
export const selectPosition =
  (componentPath: string, locationPath: string) => (state: AppState) =>
    getPosition(state, componentPath, locationPath)

/**
 * The selector to get whether the current progress nav item is disabled.
 * @param componentPath - The progress nav's component path in the router.
 * @param locationPath - The current location path.
 * @param pos - The position of the current progress nav item.
 * @returns The selector function.
 * @example
 * ```tsx
 *    const isDisabled = useAppSelector(selectIsDisabled(componentPath, locationPath, pos))
 * ```
 */
export const selectIsDisabled =
  (componentPath: string, locationPath: string, pos: number) =>
  (state: AppState) =>
    getIsDisabled(state, componentPath, locationPath, pos)

/**
 * The selector to get the progress value for the current progress navigation.
 * @param componentPath - The progress nav's component path in the router.
 * @param locationPath - The current location path.
 * @returns The selector function.
 * @example
 * ```tsx
 *    const progressValue = useAppSelector(selectProgressValue(componentPath, locationPath))
 * ```
 */
export const selectProgressValue =
  (componentPath: string, locationPath: string) => (state: AppState) =>
    getProgressValue(state, componentPath, locationPath)
