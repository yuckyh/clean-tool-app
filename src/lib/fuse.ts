import codebook from '@/../data/codebook.json'
import Fuse from 'fuse.js'

const fuse = new Fuse(codebook, {
  fieldNormWeight: 1000,
  ignoreLocation: true,
  includeScore: true,
  keys: ['name'],
  threshold: 1,
})

export default fuse
