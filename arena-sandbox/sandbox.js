import { SEED_NAMES, SEED_SCORES } from './catalog.js'
import { handle } from './server.js'
                                                               
import { emptyState } from './store.js'
                                                

                       
                                                      
                                            
                                                                                          
                                                                 
                                                        
                   
                                            
                   
 

                              
                  
           
                                                           
                            
                                                                                                    
                                                                                              
 

const BASE_PATH = '/v1'
const SEED_KEY = 'sk_test_sandbox_seed'

// Fills an empty sandbox with a few players and scores, using the same API calls a game would make.
function seed(state       , env     )       {
  const call = (method        , path        , body          ) =>
    handle(state, { method, path, query: {}, headers: { authorization: `Bearer ${SEED_KEY}` }, body }, env).body                           
  const ids = SEED_NAMES.map((name) => String(call('POST', '/players', { display_name: name }).id))
  for (const [board, scores] of Object.entries(SEED_SCORES)) {
    scores.forEach((score, i) => call('POST', `/leaderboards/${board}/scores`, { player_id: ids[i], score }))
  }
}

export function createSandbox(options                )          {
  const env      = options.env ?? { now: () => new Date() }

  const load = ()        => {
    const saved = options.storage.load()
    if (saved) return saved
    const fresh = emptyState()
    seed(fresh, env)
    options.storage.save(fresh)
    return fresh
  }

  const call = (request            )              => {
    const state = load()
    const response = handle(state, request, env)
    options.storage.save(state)
    return response
  }

  const sandboxFetch = async (input        , init              = {})                    => {
    const url = new URL(input, 'https://api.arena.example')
    const headers                         = {}
    new Headers(init.headers).forEach((value, name) => {
      headers[name.toLowerCase()] = value
    })
    let body         
    if (typeof init.body === 'string' && init.body !== '') {
      try {
        body = JSON.parse(init.body)
      } catch {
        return new Response(JSON.stringify({ error: { type: 'invalid_request_error', code: 'invalid_json', message: 'The request body is not valid JSON.' } }), { status: 400, headers: { 'Content-Type': 'application/json' } })
      }
    }
    const request             = {
      method: (init.method ?? 'GET').toUpperCase(),
      path: url.pathname.startsWith(BASE_PATH) ? url.pathname.slice(BASE_PATH.length) || '/' : url.pathname,
      query: Object.fromEntries(url.searchParams),
      headers,
      body,
    }
    if (options.latency) {
      const [min, max] = options.latency
      await new Promise((resolve) => setTimeout(resolve, min + Math.random() * (max - min)))
    }
    const fault = options.fault?.(request)
    if (fault) {
      return new Response(JSON.stringify({ error: { type: 'api_error', code: 'injected_fault', message: 'A test fault.' } }), {
        status: fault.status,
        headers: { 'Content-Type': 'application/json', ...fault.headers },
      })
    }
    const response = call(request)
    return new Response(JSON.stringify(response.body), { status: response.status, headers: response.headers })
  }

  return {
    call,
    fetch: sandboxFetch,
    reset: () => {
      options.storage.clear()
      load()
    },
    peek: load,
  }
}
