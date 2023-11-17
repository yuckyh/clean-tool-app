/**
 * @file This file contains the selectors for the progress slice of the app state.
 * @module selectors/progress
 */

/* eslint-disable
  import/prefer-default-export
*/
import type { AppState } from '@/app/store'

/**
 * Selector function to get the progress.
 * @param state - The {@link AppState state} of the app.
 * @param state.progress - The progress value.
 * @returns The progress.
 * @example
 * ```tsx
 *  const progress = useAppSelector(getProgress)
 * ```
 */
export const getProgress = ({ progress }: AppState) => progress.progress
