/* eslint-disable import/prefer-default-export */
import { codebook } from '@/data'
import Fuse from 'fuse.js'

const fuse = new Fuse(codebook, {
  ignoreFieldNorm: true,
  ignoreLocation: true,
  includeScore: true,
  keys: ['name'],
  threshold: 1,
})

export const search = (pattern: string) =>
  fuse.search(pattern.replace(/\W+/g, '').replace(/(_\d)$/gm, ''))
