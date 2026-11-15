import { createSandbox } from './arena-sandbox/sandbox.js'
import { localStorageStorage } from './arena-sandbox/store.js'
import { OPERATIONS } from './arena-sandbox/operations.js'

const $ = (id) => document.getElementById(id)
const BASE = 'https://api.arena.example/v1'

let storage
try {
  window.localStorage.setItem('arena-probe', '1')
  window.localStorage.removeItem('arena-probe')
  storage = localStorageStorage('arena-api-playground')
} catch {
  let held = null
  storage = { load: () => held, save: (s) => { held = s }, clear: () => { held = null } }
}
const sandbox = createSandbox({ storage, latency: [40, 120] })
const auth = () => ({ authorization: `Bearer ${$('key').value.trim()}` })
const call = (method, path, query = {}, body) => sandbox.call({ method, path, query, headers: auth(), body })

// The spec's examples use made-up IDs. Swap in IDs that exist in the sandbox so the first request works.
function liveIds() {
  const players = call('GET', '/players', { limit: '1' }).body
  const boards = call('GET', '/leaderboards').body
  return {
    plr_123: players?.data?.[0]?.id,
    weekly: boards?.data?.[0]?.id,
  }
}

function fill(op) {
  const ids = liveIds()
  let path = op.path
  for (const [name, value] of Object.entries(op.example.path ?? {})) {
    path = path.replace(`{${name}}`, ids[value] ?? value)
  }
  const body = op.example.body ? JSON.parse(JSON.stringify(op.example.body).replace(/plr_123/g, ids.plr_123 ?? 'plr_123')) : null
  $('path').value = path
  $('query').value = new URLSearchParams(op.example.query ?? {}).toString()
  // Fresh values each time, so a repeated Send is a new request and not a name clash or an idempotent replay.
  const tag = Math.random().toString(36).slice(2, 6)
  $('idem').value = op.example.idempotencyKey ? `${op.example.idempotencyKey}-${tag}` : ''
  if (body?.display_name) body.display_name = `${body.display_name}${tag}`
  $('body').value = body ? JSON.stringify(body, null, 2) : ''
}

OPERATIONS.forEach((op, i) => {
  const option = document.createElement('option')
  option.value = String(i)
  option.textContent = `${op.method} ${op.path} · ${op.summary}`
  $('op').appendChild(option)
})
$('op').addEventListener('change', () => fill(OPERATIONS[Number($('op').value)]))

function curlFor(op, path, query, body, idem) {
  const lines = [`curl -X ${op.method} "${BASE}${path}${query ? `?${query}` : ''}"`, `  -H "Authorization: Bearer ${$('key').value.trim()}"`]
  if (idem) lines.push(`  -H "Idempotency-Key: ${idem}"`)
  if (body) lines.push('  -H "Content-Type: application/json"', `  -d '${JSON.stringify(JSON.parse(body))}'`)
  return lines.join(' \\\n')
}

$('send').addEventListener('click', async () => {
  const op = OPERATIONS[Number($('op').value)]
  const path = $('path').value.trim()
  const query = $('query').value.trim()
  const bodyText = $('body').value.trim()
  const idem = $('idem').value.trim()
  let body
  if (bodyText) {
    try { body = JSON.parse(bodyText) } catch {
      $('status').className = 'status bad'
      $('status').textContent = 'The body is not valid JSON'
      return
    }
  }
  const headers = { ...auth() }
  if (idem) headers['idempotency-key'] = idem
  $('status').className = 'status'
  $('status').textContent = 'Sending…'
  // Same path through the same fetch function the SDK uses.
  const response = await sandbox.fetch(`${BASE}${path}${query ? `?${query}` : ''}`, {
    method: op.method,
    headers: { ...headers, ...(body ? { 'content-type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await response.text()
  let shown = text
  try { shown = JSON.stringify(JSON.parse(text), null, 2) } catch {}
  $('status').className = `status ${response.ok ? 'ok' : 'bad'}`
  $('status').textContent = `${response.status} ${response.statusText || ''}`.trim()
  $('out').textContent = shown
  $('curl').textContent = ''
  const pre = document.createElement('code')
  pre.style.whiteSpace = 'pre-wrap'
  pre.textContent = 'The same request against a real server would be:\n' + curlFor(op, path, query, bodyText, idem)
  $('curl').appendChild(pre)
})

$('reset').addEventListener('click', () => {
  sandbox.reset()
  fill(OPERATIONS[Number($('op').value)])
  $('status').className = 'status'
  $('status').textContent = 'Sandbox reset'
  $('out').textContent = 'All data erased and the starting players restored.'
})

fill(OPERATIONS[0])
