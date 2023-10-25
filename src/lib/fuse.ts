import { codebook } from '@/data'
import Fuse from 'fuse.js'

const fuse = new Fuse(codebook, {
  includeScore: true,
  keys: ['name'],
  threshold: 1,
})

export default fuse
