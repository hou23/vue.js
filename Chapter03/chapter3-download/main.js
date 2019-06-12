new Vue({
    name: 'game',
    el: '#app',

    template: `<div id="#app" :class="cssClass">
            <top-bar :turn="turn" :current-player-index="currentPlayerIndex" :players="players"/>
            <div class="world">
                <castle v-for="(player, index) in players" :player="player" :index="index"></castle>
                <div class="land"></div>
                <div class="clouds">
                    <cloud v-for="index in 10" :type="(index - 1) % 5 + 1"></cloud>
                </div>
            </div>
            <transition name="hand">
                <hand :cards="currentHand" v-if="!activeOverlay" @card-play="handlePlayCard" @card-leave-end="handleCardLeaveEnd"/>
            </transition>
            <transition name="zoom">
                <overlay v-if="activeOverlay" :key="activeOverlay" @close="handleOverlayClose">
                    <!--<overlay-content-player-turn v-if="activeOverlay === 'player-turn'" :player="currentPlayer" />
                    <overlay-content-last-play v-else-if="activeOverlay === 'last-play'" :opponent="currentOpponent" />
                    <overlay-content-game-over v-else-if="activeOverlay === 'game-over'" :players="players" />-->
                    <component :is="'overlay-content-' + activeOverlay" :player="currentPlayer" :opponent="currentOpponent" :players="players"></component>
                </overlay>
            </transition>
            <transition>
                <div class="overlay-background" v-if="activeOverlay"></div>
            </transition>
        </div>`,
    data: state,
    computed: {
        testCard() {
            return cards.archers
        },
        cssClass() {
            return {
                'can-play': this.canPlay,
            }
        }
    },
    mounted() {
        beginGame()
    },
    methods: {
        handlePlayCard(card) {
            playCard(card)
        },
        handleCardLeaveEnd() {
            applyCard()
        },
        handleOverlayClose() {
            overlayCloseHandlers[this.activeOverlay]()
        }
    },
})

// 窗口大小变化的处理
window.addEventListener('resize', () => {
    state.worldRatio = getWorldRatio()
})

// 借助 request-AnimationFrame函数，请求浏览器绘制帧使TWEEN.js库倒计时
requestAnimationFrame(animate);

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time)
}

function beginGame() {
    state.players.forEach(drawInitialHand())
}

function playCard(card) {
    if (state.canPlay) {
        state.canPlay = false
        currentPlayingCard = card

        // 移除卡牌
        const index = state.currentPlayer.hand.indexOf(card)
        state.currentPlayer().hand.splice(index, 1)
        // 放入废弃牌堆
        addCardToPile(state.discardPile, card.id)
    }
}

function applyCard() {
    const card = currentPlayingCard
    applyCardEffect(card)

    setTimeout(() => {
        // 检查玩家是否死亡
        state.players.forEach(checkPlayerLost)
        if (isOnePlayerDead()) {
            endGame()
        } else {
            nextTurn()
        }
    }, 700)
}

function nextTurn() {
    state.turn++
    state.currentPlayerIndex = state.currentOpponentId
    state.activeOverlay = 'player-turn'
}

function endGame() {
    state.activeOverlay = 'game-over'
}

function newTurn() {
    state.activeOverlay = null
    if (state.currentPlayer.skipTurn) {
        skipTurn()
    } else {
        startTurn()
    }
}

function startTurn() {
    state.currentPlayer().skippedTurn = false
    // 如果两名玩家都已玩过一回合
    if (state.turn > 2) {
        // 抽一张新的卡牌
        setTimeout(() => {
            state.currentPlayer().hand.push(drawCard())
            state.canPlay = true
        }, 800)
    } else {
        state.canPlay = true
    }
}

var overlayCloseHandlers = {
    'player-turn'() {
        if (state.turn > 1) {
            state.activeOverlay = 'last-play'
        } else {
            newTurn()
        }
    },
    'last-play'() {
        newTurn()
    },
    'game-over'() {
        // 重新加载游戏
        document.location.reload()
    }
}