import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public')
const index = join(root, 'index.html')
const html = readFileSync(index, 'utf8')

copyFileSync(index, join(root, '404.html'))

for (const route of [
  'access',
  'signin',
  'product',
  'network',
  'developers',
  'pricing',
  'resources',
  'contact',
  'quote',
]) {
  const dir = join(root, route)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}
