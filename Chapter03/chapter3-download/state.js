// Some usefull variables
var maxHealth = 10
var maxFood = 10
var handSize = 5
var cardUid = 0
var currentPlayingCard = null

// The consolidated state of our app
var state = {
    // World
    worldRatio: getWorldRatio(),
    // TODO Other things
    // 游戏
    turn: 1,
    canPlay: false,
    players: [
        {
            name: 'Anne of Cleves',
            food: 10,
            health: 10,
            // 是否跳过下一回合
            skipTurn: false,
            // 跳过了上个回合
            skippedTurn: false,
            hand: [],
            lastPlayedCardId: null,
            dead: false,
        },
        {
            name: 'William the Bald',
            food: 10,
            health: 10,
            // 是否跳过下一回合
            skipTurn: false,
            // 跳过了上个回合
            skippedTurn: false,
            hand: [],
            lastPlayedCardId: null,
            dead: false,
        },
    ],
    currentPlayerIndex: Math.round(Math.random()),
    testHand: [],
    activeOverlay: null,
    drawPile: pile,
    discardPile: {},
    get currentPlayer() {
        return state.players[state.currentPlayerIndex]
    },
    get currentOpponentId() {
        return state.currentPlayerIndex === 0 ? 1 : 0
    },
    get currentOpponent() {
        return state.players[state.currentOpponentId]
    },
    get currentHand() {
        return state.currentPlayer.hand
    }
}