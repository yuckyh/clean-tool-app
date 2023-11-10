import { codebook } from '@/data'
import Fuse from 'fuse.js'

const fuse = new Fuse(codebook, {
  ignoreFieldNorm: true,
  includeScore: true,
  keys: ['name'],
  location: 0,
  threshold: 1,
})

export default fuse
