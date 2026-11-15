                                                                                               
import { ACHIEVEMENTS, ITEMS, LEADERBOARDS } from './catalog.js'
                                       

// A working implementation of the Arena API, for the sandbox. It follows openapi/arena.json and the docs.
// One call: handle(state, request, env). It changes state in place. The caller saves it.

                          
                
                                                                         
                               
                                                     
               
 
                                                                                            
                                     

class ApiFail extends Error {
           status        
           type        
           code        
           param                    
  constructor(status        , type        , code        , message        , param         ) {
    super(message)
    this.status = status
    this.type = type
    this.code = code
    this.param = param
  }
}

const fail = (status        , type        , code        , message        , param         )        => {
  throw new ApiFail(status, type, code, message, param)
}
const notFound = (code        , what        )        => fail(404, 'not_found_error', code, `${what} was not found.`)
const conflict = (code        , message        )        => fail(409, 'conflict_error', code, message)
const invalid = (code        , message        , param         )        => fail(422, 'invalid_request_error', code, message, param)

            
              
          
                                
                               
                               
 
                                                               

const iso = (env     ) => env.now().toISOString().replace(/\.\d+Z$/, 'Z')
const newId = (state       , prefix        ) => `${prefix}${1000 + ++state.seq}`

// ---- validation ----

function reqString(body                         , name        )         {
  const value = body[name]
  if (value === undefined || value === null) return fail(400, 'invalid_request_error', 'missing_parameter', `${name} is required.`, name)
  if (typeof value !== 'string' || value === '') return invalid('invalid_parameter', `${name} must be a non-empty string.`, name)
  return value
}

function reqInt(body                         , name        , min        , max         )         {
  const value = body[name]
  if (value === undefined || value === null) return fail(400, 'invalid_request_error', 'missing_parameter', `${name} is required.`, name)
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || (max !== undefined && value > max)) {
    const range = max !== undefined ? `from ${min} to ${max}` : `at least ${min}`
    return invalid('invalid_parameter', `${name} must be an integer ${range}.`, name)
  }
  return value
}

function oneOf                  (value         , name        , allowed              , required         )                {
  if (value === undefined || value === null) {
    if (required) return fail(400, 'invalid_request_error', 'missing_parameter', `${name} is required.`, name)
    return undefined
  }
  if (typeof value !== 'string' || !allowed.includes(value     )) return invalid('invalid_parameter', `${name} must be ${allowed.join(' or ')}.`, name)
  return value     
}

function checkName(state       , name         , exceptId         )         {
  if (typeof name !== 'string' || name.length < 3 || name.length > 24 || !/^[A-Za-z0-9_ -]+$/.test(name)) {
    return invalid('invalid_display_name', 'The name must be 3 to 24 characters: letters, numbers, spaces, - or _.', 'display_name')
  }
  const taken = Object.values(state.players).some((p) => p.id !== exceptId && p.display_name.toLowerCase() === name.toLowerCase())
  if (taken) return conflict('display_name_taken', 'Another player already uses this name.')
  return name
}

function mergeMetadata(current                        , incoming         , allowNull         )                         {
  if (incoming === undefined) return current
  if (typeof incoming !== 'object' || incoming === null || Array.isArray(incoming)) return invalid('invalid_parameter', 'metadata must be an object.', 'metadata')
  const next = { ...current }
  for (const [key, value] of Object.entries(incoming)) {
    if (value === null && allowNull) delete next[key]
    else if (typeof value === 'string') next[key] = value
    else return invalid('invalid_parameter', 'metadata values must be strings.', 'metadata')
  }
  if (Object.keys(next).length > 20) return invalid('invalid_parameter', 'A player can have up to 20 metadata keys.', 'metadata')
  return next
}

function page   (items     , query                        )                                                                               {
  let limit = 25
  if (query.limit !== undefined) {
    limit = Number(query.limit)
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) invalid('invalid_parameter', 'limit must be an integer from 1 to 100.', 'limit')
  }
  let start = 0
  if (query.cursor !== undefined) {
    const match = /^cur_(\d+)$/.exec(query.cursor)
    if (!match) invalid('invalid_cursor', 'The cursor is not valid or has expired.', 'cursor')
    else start = Number(match[1])
  }
  const end = start + limit
  return { object: 'list', data: items.slice(start, end), has_more: end < items.length, next_cursor: end < items.length ? `cur_${end}` : null }
}

// ---- lookups ----

const getPlayer = (state       , id        )         => state.players[id] ?? notFound('player_not_found', 'The player')
const getMatch = (state       , id        )        => state.matches[id] ?? notFound('match_not_found', 'The match')
const getPurchase = (state       , id        )           => state.purchases[id] ?? notFound('purchase_not_found', 'The purchase')
function getLeaderboard(id        )              {
  const def = LEADERBOARDS[id] ?? notFound('leaderboard_not_found', 'The leaderboard')
  return { id, object: 'leaderboard', ...def, created_at: '2026-01-05T00:00:00Z' }
}
const newestFirst =    (ids          , map                   )      => [...ids].reverse().map((id) => map[id]).filter(Boolean)

// ---- leaderboard ranking ----

function ranked(state       , boardId        )                                                            {
  const def = LEADERBOARDS[boardId]
  const rows = Object.entries(state.scores[boardId] ?? {}).map(([player_id, row]) => ({ player_id, score: row.score }))
  rows.sort((a, b) => (def.sort === 'desc' ? b.score - a.score : a.score - b.score))
  // Equal scores share a rank and the next rank is not skipped.
  let rank = 0
  let previous                    
  return rows.map((row) => {
    if (row.score !== previous) rank += 1
    previous = row.score
    return { ...row, rank }
  })
}

// ---- inventory ----

function addItems(state       , env     , playerId        , itemId        , quantity        , reason               )        {
  const item = ITEMS[itemId] ?? notFound('item_not_found', 'The item')
  const owned = state.inventory[playerId]?.[itemId]?.quantity ?? 0
  if (owned + quantity > item.max) invalid('item_limit_reached', `A player can own at most ${item.max} of this item.`, 'quantity')
  state.inventory[playerId] = state.inventory[playerId] ?? {}
  state.inventory[playerId][itemId] = { quantity: owned + quantity, updated_at: iso(env) }
  const grant        = { id: newId(state, 'gnt_'), object: 'grant', player_id: playerId, item_id: itemId, quantity, reason, created_at: iso(env) }
  state.grants[grant.id] = grant
  return grant
}

function removeItems(state       , env     , playerId        , itemId        , quantity        )         {
  const entry = state.inventory[playerId]?.[itemId]
  const removed = Math.min(entry?.quantity ?? 0, quantity)
  if (entry) state.inventory[playerId][itemId] = { quantity: entry.quantity - removed, updated_at: iso(env) }
  return removed
}

const inventoryList = (state       , playerId        ) =>
  Object.entries(state.inventory[playerId] ?? {})
    .filter(([, entry]) => entry.quantity > 0)
    .map(([item_id, entry]) => ({ object: 'inventory_item'         , item_id, quantity: entry.quantity, updated_at: entry.updated_at }))

// ---- routes ----

                                                                                                                           
const routes          = []

function route(method        , template        , handler         , publishable = false)       {
  const names           = []
  const pattern = new RegExp('^' + template.replace(/\{(\w+)\}/g, (_m, name        ) => (names.push(name), '([^/]+)')) + '$')
  routes.push({ method, template, pattern, names, handler, publishable })
}

// Players
route('POST', '/players', ({ state, env, body }) => {
  const name = checkName(state, body.display_name ?? fail(400, 'invalid_request_error', 'missing_parameter', 'display_name is required.', 'display_name'))
  const player         = {
    id: newId(state, 'plr_'),
    object: 'player',
    display_name: name,
    status: 'active',
    metadata: mergeMetadata({}, body.metadata, false),
    created_at: iso(env),
  }
  state.players[player.id] = player
  state.order.players.push(player.id)
  return { status: 201, body: player }
})
route('GET', '/players', ({ state, query }) => {
  const status = oneOf(query.status, 'status', ['active', 'suspended'], false)
  const list = newestFirst(state.order.players, state.players).filter(
    (p) => (query.display_name === undefined || p.display_name === query.display_name) && (!status || p.status === status),
  )
  return { body: page(list, query) }
})
route('GET', '/players/{player_id}', ({ state, params }) => ({ body: getPlayer(state, params.player_id) }))
route('PATCH', '/players/{player_id}', ({ state, params, body }) => {
  const player = getPlayer(state, params.player_id)
  const next         = { ...player }
  if (body.display_name !== undefined) next.display_name = checkName(state, body.display_name, player.id)
  const status = oneOf(body.status, 'status', ['active', 'suspended'], false)
  if (status) next.status = status
  next.metadata = mergeMetadata(player.metadata, body.metadata, true)
  state.players[player.id] = next
  return { body: next }
})
route('DELETE', '/players/{player_id}', ({ state, params }) => {
  const player = getPlayer(state, params.player_id)
  delete state.players[player.id]
  state.order.players = state.order.players.filter((id) => id !== player.id)
  delete state.inventory[player.id]
  delete state.unlocked[player.id]
  for (const board of Object.values(state.scores)) delete board[player.id]
  return { body: player }
})

// Matches
route('POST', '/matches', ({ state, env, body }) => {
  const mode = oneOf(body.mode, 'mode', ['ranked', 'casual'], true)                 
  const maxPlayers = reqInt(body, 'max_players', 2, 16)
  const ids = body.player_ids === undefined ? [] : Array.isArray(body.player_ids) ? (body.player_ids             ) : invalid('invalid_parameter', 'player_ids must be a list.', 'player_ids')
  const playerIds           = []
  for (const id of ids) {
    if (typeof id !== 'string') invalid('invalid_parameter', 'player_ids must be strings.', 'player_ids')
    const player = getPlayer(state, id          )
    if (player.status === 'suspended') invalid('player_suspended', 'The player is suspended.', 'player_ids')
    if (!playerIds.includes(player.id)) playerIds.push(player.id)
  }
  if (playerIds.length > maxPlayers) conflict('match_full', 'More players than max_players.')
  const match        = {
    id: newId(state, 'mch_'),
    object: 'match',
    mode,
    status: 'pending',
    max_players: maxPlayers,
    player_ids: playerIds,
    results: [],
    created_at: iso(env),
    started_at: null,
    ended_at: null,
  }
  state.matches[match.id] = match
  state.order.matches.push(match.id)
  return { status: 201, body: match }
})
route('GET', '/matches', ({ state, query }) => {
  const status = oneOf(query.status, 'status', ['pending', 'active', 'completed', 'cancelled'], false)
  const list = newestFirst(state.order.matches, state.matches).filter(
    (m) => (!status || m.status === status) && (query.player_id === undefined || m.player_ids.includes(query.player_id)),
  )
  return { body: page(list, query) }
})
route('GET', '/matches/{match_id}', ({ state, params }) => ({ body: getMatch(state, params.match_id) }))
route('POST', '/matches/{match_id}/join', ({ state, params, body }) => {
  const match = getMatch(state, params.match_id)
  const player = getPlayer(state, reqString(body, 'player_id'))
  if (match.status !== 'pending') conflict('match_not_joinable', 'The match is not pending.')
  if (player.status === 'suspended') invalid('player_suspended', 'The player is suspended.', 'player_id')
  if (!match.player_ids.includes(player.id)) {
    if (match.player_ids.length >= match.max_players) conflict('match_full', 'The match already has max_players players.')
    match.player_ids.push(player.id)
  }
  return { body: match }
})
route('POST', '/matches/{match_id}/start', ({ state, env, params }) => {
  const match = getMatch(state, params.match_id)
  if (match.status !== 'pending' || match.player_ids.length < 2) conflict('match_not_startable', 'The match is not pending or has too few players.')
  match.status = 'active'
  match.started_at = iso(env)
  return { body: match }
})
route('POST', '/matches/{match_id}/end', ({ state, env, params, body }) => {
  const match = getMatch(state, params.match_id)
  if (!Array.isArray(body.results) || body.results.length === 0) fail(400, 'invalid_request_error', 'missing_parameter', 'results is required.', 'results')
  if (match.status !== 'active') conflict('match_not_active', 'The match is not active.')
  const results = (body.results                                  ).map((entry) => {
    const playerId = reqString(entry, 'player_id')
    if (!match.player_ids.includes(playerId)) invalid('player_not_in_match', 'A result references a player who did not join the match.', 'results')
    const result                                                           = { player_id: playerId, placement: reqInt(entry, 'placement', 1) }
    if (entry.score !== undefined) result.score = reqInt(entry, 'score', Number.MIN_SAFE_INTEGER)
    return result
  })
  results.sort((a, b) => a.placement - b.placement)
  match.results = results
  match.status = 'completed'
  match.ended_at = iso(env)
  return { body: match }
})
route('POST', '/matches/{match_id}/cancel', ({ state, env, params }) => {
  const match = getMatch(state, params.match_id)
  if (match.status !== 'pending' && match.status !== 'active') conflict('match_not_cancellable', 'Only a pending or active match can be cancelled.')
  match.status = 'cancelled'
  match.ended_at = iso(env)
  return { body: match }
})

// Leaderboards
route('GET', '/leaderboards', () => ({ body: { object: 'list', data: Object.keys(LEADERBOARDS).map(getLeaderboard), has_more: false, next_cursor: null } }), true)
route('GET', '/leaderboards/{leaderboard_id}', ({ params }) => ({ body: getLeaderboard(params.leaderboard_id) }))
route('POST', '/leaderboards/{leaderboard_id}/scores', ({ state, env, params, body }) => {
  const board = getLeaderboard(params.leaderboard_id)
  const player = getPlayer(state, reqString(body, 'player_id'))
  if (player.status === 'suspended') invalid('player_suspended', 'The player is suspended.', 'player_id')
  const score = body.score
  if (typeof score !== 'number' || !Number.isInteger(score) || score < 0) invalid('invalid_score', 'The score must be an integer of 0 or more.', 'score')
  const value = score          
  const rows = (state.scores[board.id] = state.scores[board.id] ?? {})
  const current = rows[player.id]
  let kept = value
  if (current) {
    if (board.update_mode === 'best') kept = board.sort === 'desc' ? Math.max(current.score, value) : Math.min(current.score, value)
    else if (board.update_mode === 'sum') kept = current.score + value
  }
  const id = newId(state, 'scr_')
  rows[player.id] = { id, score: kept, submitted_at: iso(env) }
  const rank = ranked(state, board.id).find((row) => row.player_id === player.id)?.rank ?? 1
  const matchId = typeof body.match_id === 'string' ? body.match_id : null
  return { status: 201, body: { id, object: 'score', leaderboard: board.id, player_id: player.id, score: value, rank, match_id: matchId, submitted_at: iso(env) } }
})
route('GET', '/leaderboards/{leaderboard_id}/entries', ({ state, params, query }) => {
  const board = getLeaderboard(params.leaderboard_id)
  const entries = ranked(state, board.id).map((row) => ({
    rank: row.rank,
    player_id: row.player_id,
    display_name: state.players[row.player_id]?.display_name,
    score: row.score,
  }))
  return { body: page(entries, query) }
}, true)
route('GET', '/leaderboards/{leaderboard_id}/players/{player_id}', ({ state, params }) => {
  const board = getLeaderboard(params.leaderboard_id)
  const row = ranked(state, board.id).find((r) => r.player_id === params.player_id)
  if (!row) return notFound('entry_not_found', 'The player entry')
  return { body: { rank: row.rank, player_id: row.player_id, display_name: state.players[row.player_id]?.display_name, score: row.score } }
})

// Inventory
route('GET', '/players/{player_id}/inventory', ({ state, params, query }) => {
  getPlayer(state, params.player_id)
  return { body: page(inventoryList(state, params.player_id), query) }
})
route('POST', '/players/{player_id}/inventory/grants', ({ state, env, params, body }) => {
  const player = getPlayer(state, params.player_id)
  const itemId = reqString(body, 'item_id')
  const quantity = reqInt(body, 'quantity', 1, 1000)
  const reason = typeof body.reason === 'string' ? body.reason : null
  return { body: addItems(state, env, player.id, itemId, quantity, reason) }
})
route('POST', '/players/{player_id}/inventory/consume', ({ state, env, params, body }) => {
  const player = getPlayer(state, params.player_id)
  const itemId = reqString(body, 'item_id')
  const quantity = reqInt(body, 'quantity', 1)
  if ((state.inventory[player.id]?.[itemId]?.quantity ?? 0) < quantity) conflict('insufficient_quantity', 'The player owns fewer than quantity.')
  removeItems(state, env, player.id, itemId, quantity)
  const entry = state.inventory[player.id][itemId]
  return { body: { object: 'inventory_item', item_id: itemId, quantity: entry.quantity, updated_at: entry.updated_at } }
})

// Achievements
const achievementObject = (a                               )              => ({ id: a.id, object: 'achievement', key: a.key, name: a.name, description: a.description, hidden: a.hidden })
route('GET', '/achievements', ({ query }) => ({ body: page(ACHIEVEMENTS.filter((a) => !a.hidden).map(achievementObject), query) }), true)
route('GET', '/players/{player_id}/achievements', ({ state, params, query }) => {
  getPlayer(state, params.player_id)
  const list = Object.entries(state.unlocked[params.player_id] ?? {}).map(([achievement_id, unlocked_at]) => ({ achievement_id, unlocked_at }))
  return { body: page(list, query) }
})
route('POST', '/players/{player_id}/achievements/{achievement_id}/unlock', ({ state, env, params }) => {
  const player = getPlayer(state, params.player_id)
  if (!ACHIEVEMENTS.some((a) => a.id === params.achievement_id)) notFound('achievement_not_found', 'The achievement')
  state.unlocked[player.id] = state.unlocked[player.id] ?? {}
  const existing = state.unlocked[player.id][params.achievement_id]
  const unlockedAt = existing ?? iso(env)
  state.unlocked[player.id][params.achievement_id] = unlockedAt
  return { body: { achievement_id: params.achievement_id, player_id: player.id, unlocked_at: unlockedAt } }
})

// Purchases. Test tokens: tok_test_success pays, tok_test_declined is declined.
route('POST', '/purchases', ({ state, env, body }) => {
  const player = getPlayer(state, reqString(body, 'player_id'))
  const itemId = reqString(body, 'item_id')
  const quantity = reqInt(body, 'quantity', 1, 100)
  const token = reqString(body, 'payment_token')
  const item = ITEMS[itemId] ?? notFound('item_not_found', 'The item')
  const owned = state.inventory[player.id]?.[itemId]?.quantity ?? 0
  if (!item.forSale || owned + quantity > item.max) invalid('item_not_for_sale', 'The item is not available for purchase.', 'item_id')
  if (token !== 'tok_test_success' && token !== 'tok_test_declined') invalid('invalid_parameter', 'In the sandbox, use tok_test_success or tok_test_declined.', 'payment_token')
  const purchase           = {
    id: newId(state, 'pur_'),
    object: 'purchase',
    player_id: player.id,
    item_id: itemId,
    quantity,
    status: token === 'tok_test_success' ? 'succeeded' : 'failed',
    grant_id: null,
    refund: null,
    created_at: iso(env),
  }
  state.purchases[purchase.id] = purchase
  state.order.purchases.push(purchase.id)
  if (purchase.status === 'failed') fail(402, 'invalid_request_error', 'payment_declined', 'The payment method was declined.', 'payment_token')
  purchase.grant_id = addItems(state, env, player.id, itemId, quantity, 'purchase').id
  return { status: 201, body: purchase }
})
route('GET', '/purchases', ({ state, query }) => {
  const status = oneOf(query.status, 'status', ['pending', 'succeeded', 'failed', 'refunded'], false)
  const list = newestFirst(state.order.purchases, state.purchases).filter(
    (p) => (!status || p.status === status) && (query.player_id === undefined || p.player_id === query.player_id),
  )
  return { body: page(list, query) }
})
route('GET', '/purchases/{purchase_id}', ({ state, params }) => ({ body: getPurchase(state, params.purchase_id) }))
route('POST', '/purchases/{purchase_id}/refund', ({ state, env, params, body }) => {
  const purchase = getPurchase(state, params.purchase_id)
  const reason = oneOf(body.reason, 'reason', ['customer_request', 'fraud', 'other'], false) ?? 'other'
  if (purchase.status === 'refunded') conflict('purchase_already_refunded', 'The purchase was refunded before.')
  const ageDays = (env.now().getTime() - new Date(purchase.created_at).getTime()) / 86_400_000
  if (purchase.status !== 'succeeded' || ageDays > 14) conflict('purchase_not_refundable', 'The purchase is not succeeded, or it is older than 14 days.')
  const revoked = removeItems(state, env, purchase.player_id, purchase.item_id, purchase.quantity)
  purchase.status = 'refunded'
  purchase.refund = { reason, revoked_quantity: revoked, refunded_at: iso(env) }
  return { body: purchase }
})
route('GET', '/players/{player_id}/entitlements', ({ state, params, query }) => {
  getPlayer(state, params.player_id)
  const list = Object.values(state.purchases)
    .filter((p) => p.player_id === params.player_id && p.status === 'succeeded' && ITEMS[p.item_id] && !ITEMS[p.item_id].consumable)
    .map((p) => ({ item_id: p.item_id, purchase_id: p.id, granted_at: p.created_at }))
  return { body: page(list, query) }
})

export const OPERATIONS = routes.map((r) => `${r.method} ${r.template}`)

// ---- dispatcher ----

function errorResponse(requestId        , status        , type        , code        , message        , param         )              {
  return { status, headers: { 'Content-Type': 'application/json', 'X-Request-Id': requestId }, body: { error: { type, code, message, ...(param ? { param } : {}), request_id: requestId } } }
}

export function handle(state       , req            , env     )              {
  const requestId = `req_${1000 + ++state.seq}`
  const headers = { 'Content-Type': 'application/json', 'X-Request-Id': requestId, 'X-RateLimit-Limit': '25', 'X-RateLimit-Remaining': '24' }
  try {
    const auth = /^Bearer (sk|pk)_test_\S+$/.exec(req.headers.authorization ?? '')
    if (!auth) return errorResponse(requestId, 401, 'authentication_error', 'invalid_api_key', 'The API key is missing or invalid. The sandbox accepts sk_test_ and pk_test_ keys.')

    let matched                                                              
    for (const candidate of routes) {
      if (candidate.method !== req.method) continue
      const m = candidate.pattern.exec(req.path)
      if (m) {
        matched = { route: candidate, params: Object.fromEntries(candidate.names.map((name, i) => [name, decodeURIComponent(m[i + 1])])) }
        break
      }
    }
    if (!matched) return errorResponse(requestId, 404, 'not_found_error', 'route_not_found', `No route for ${req.method} ${req.path}.`)
    if (auth[1] === 'pk' && !matched.route.publishable) {
      return errorResponse(requestId, 403, 'permission_error', 'insufficient_permissions', 'This request needs a secret key (sk_).')
    }

    const bodyObject = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? (req.body                           ) : {}
    const key = req.method === 'POST' ? req.headers['idempotency-key'] : undefined
    const fingerprint = JSON.stringify([req.path, bodyObject])
    if (key) {
      const seen = state.idempotency[key]
      if (seen) {
        if (seen.fingerprint !== fingerprint) return errorResponse(requestId, 409, 'conflict_error', 'idempotency_key_reuse', 'This idempotency key was used with different parameters.')
        return { status: seen.status, headers: { ...headers, 'Idempotent-Replayed': 'true' }, body: seen.body }
      }
    }

    const result = matched.route.handler({ state, env, params: matched.params, query: req.query, body: bodyObject })
    const response              = { status: result.status ?? 200, headers, body: result.body }
    if (key) state.idempotency[key] = { fingerprint, status: response.status, body: response.body }
    return response
  } catch (error) {
    if (error instanceof ApiFail) {
      const response = errorResponse(requestId, error.status, error.type, error.code, error.message, error.param)
      const key = req.method === 'POST' ? req.headers['idempotency-key'] : undefined
      if (key && !state.idempotency[key]) state.idempotency[key] = { fingerprint: JSON.stringify([req.path, req.body && typeof req.body === 'object' ? req.body : {}]), status: response.status, body: response.body }
      return response
    }
    throw error
  }
}
