// What the dashboard would configure for a real game: items, leaderboards and achievements.

                                                                                          

export const ITEMS                          = {
  itm_gold_pack: { name: 'Booster pack', consumable: true, forSale: true, max: 99 },
  itm_arena_skin: { name: 'Neon skin', consumable: false, forSale: true, max: 1 },
  itm_season_pass: { name: 'Season pass', consumable: false, forSale: true, max: 1 },
  itm_coin: { name: 'Coins', consumable: true, forSale: false, max: 10000 },
}

                              
              
                      
                                        
                                                 
 

export const LEADERBOARDS                                 = {
  weekly: { name: 'Weekly best', sort: 'desc', update_mode: 'best', reset: 'weekly' },
  lifetime: { name: 'Lifetime total', sort: 'desc', update_mode: 'sum', reset: 'never' },
  memory_weekly: { name: 'Memory weekly best', sort: 'desc', update_mode: 'best', reset: 'weekly' },
  memory_lifetime: { name: 'Memory lifetime total', sort: 'desc', update_mode: 'sum', reset: 'never' },
  words_weekly: { name: 'Word scramble weekly best', sort: 'desc', update_mode: 'best', reset: 'weekly' },
  words_lifetime: { name: 'Word scramble lifetime total', sort: 'desc', update_mode: 'sum', reset: 'never' },
  tiles_weekly: { name: 'Tile merge weekly best', sort: 'desc', update_mode: 'best', reset: 'weekly' },
  tiles_lifetime: { name: 'Tile merge lifetime total', sort: 'desc', update_mode: 'sum', reset: 'never' },
  connect4_weekly: { name: 'Connect Four weekly best', sort: 'desc', update_mode: 'best', reset: 'weekly' },
  connect4_lifetime: { name: 'Connect Four lifetime total', sort: 'desc', update_mode: 'sum', reset: 'never' },
}

                                                                                                            

export const ACHIEVEMENTS                   = [
  { id: 'ach_first_win', key: 'first_win', name: 'First win', description: 'Win your first ranked match.', hidden: false },
  { id: 'ach_sharpshooter', key: 'sharpshooter', name: 'Sharpshooter', description: 'Score 2,000 or more in one round.', hidden: false },
  { id: 'ach_elephant', key: 'elephant', name: 'Elephant memory', description: 'Complete level 10 in Memory sequence.', hidden: false },
  { id: 'ach_wordsmith', key: 'wordsmith', name: 'Wordsmith', description: 'Solve 12 words in one Word scramble round.', hidden: false },
  { id: 'ach_big_tile', key: 'big_tile', name: 'Big tile', description: 'Make a 256 tile in Tile merge.', hidden: false },
  { id: 'ach_diagonal', key: 'diagonal', name: 'Corner to corner', description: 'Win a Connect Four game with a diagonal line.', hidden: false },
  { id: 'ach_flawless', key: 'flawless', name: 'Flawless', description: 'Finish a round without a miss.', hidden: true },
]

// Used by tests and by the game to create a believable board.
export const SEED_NAMES = ['NovaKnight', 'IronVale', 'RivalBot', 'PixelFox', 'Quasar']

// Starting scores per leaderboard, in the order of SEED_NAMES. A leaderboard without an entry here starts empty.
export const SEED_SCORES                           = {
  weekly: [3400, 3100, 2600, 2200, 1700],
  lifetime: [18200, 15800, 9400, 7300, 4100],
  memory_weekly: [660, 550, 440, 330, 210],
  memory_lifetime: [3900, 3200, 2500, 1800, 900],
  words_weekly: [1100, 950, 760, 600, 420],
  words_lifetime: [6000, 5100, 3900, 2800, 1700],
  tiles_weekly: [4200, 3400, 2600, 1900, 1200],
  tiles_lifetime: [22000, 18000, 13000, 9000, 5200],
  connect4_weekly: [165, 150, 135, 120, 100],
  connect4_lifetime: [1700, 1400, 1100, 800, 500],
}
