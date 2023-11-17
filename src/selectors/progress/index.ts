/* eslint-disable import/prefer-default-export */
import type { AppState } from '@/app/store'

/**
 *
 * @param state
 * @param state.progress
 * @returns
 * @example
 */
export const getProgress = ({ progress }: AppState) => progress.progress
