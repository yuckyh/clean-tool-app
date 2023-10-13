import Fuse from 'fuse.js'
import { codebook } from '@/data'

const fuse = new Fuse(codebook, {
  includeScore: true,
  keys: ['name'],
  threshold: 1,
})

export default fuse
