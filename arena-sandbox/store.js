                                                                     

// All sandbox data. It is plain JSON, so any storage can hold it.
                     
             
                                 
                                
                                     
                               
                                                                      
                                                                                             
                                                                                     
                                                  
                                                                                     
 

export function emptyState()        {
  return {
    seq: 0,
    players: {},
    matches: {},
    purchases: {},
    grants: {},
    order: { players: [], matches: [], purchases: [] },
    scores: {},
    inventory: {},
    unlocked: {},
    idempotency: {},
  }
}

                       
                          
                              
                   
 

export function memoryStorage()          {
  let saved                = null
  return {
    load: () => (saved ? (JSON.parse(saved)         ) : null),
    save: (state) => {
      saved = JSON.stringify(state)
    },
    clear: () => {
      saved = null
    },
  }
}

// Keeps the sandbox in the browser, so it survives a reload.
export function localStorageStorage(key        )          {
  return {
    load: () => {
      try {
        const text = window.localStorage.getItem(key)
        return text ? (JSON.parse(text)         ) : null
      } catch {
        return null
      }
    },
    save: (state) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(state))
      } catch {
        // Storage can be full or blocked. The sandbox keeps working for this page view.
      }
    },
    clear: () => {
      try {
        window.localStorage.removeItem(key)
      } catch {
        // Nothing to clear.
      }
    },
  }
}
