// UNO Game Implementation
class UNOGame {
    constructor() {
        this.colors = ['red', 'yellow', 'green', 'blue'];
        this.numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.actionCards = ['skip', 'reverse', 'draw2'];
        this.wildCards = ['wild', 'wild_draw4'];
        
        this.deck = [];
        this.discardPile = [];
        this.playerHand = [];
        this.computerHand = [];
        this.currentPlayer = 'player'; // 'player' or 'computer'
        this.gameDirection = 1; // 1 for normal, -1 for reverse
        this.currentColor = null;
        this.gameRunning = false;
        this.unoCalledByPlayer = false;
        this.drawCount = 0; // For stacking draw cards
        
        this.initializeElements();
        this.bindEvents();
        this.startNewGame();
    }
    
    initializeElements() {
        // Get DOM elements
        this.playerHandElement = document.getElementById('player-hand');
        this.currentCardElement = document.getElementById('current-card');
        this.drawPileElement = document.getElementById('draw-pile');
        this.gameStatusElement = document.getElementById('game-status');
        this.deckCountElement = document.getElementById('deck-count');
        this.opponentCardCountElement = document.getElementById('opponent-card-count');
        this.playerTurnElement = document.querySelector('.player-turn');
        this.unoButton = document.getElementById('uno-button');
        this.passTurnButton = document.getElementById('pass-turn');
        this.colorPicker = document.getElementById('color-picker');
        this.gameOverModal = document.getElementById('game-over-modal');
        this.rulesModal = document.getElementById('rules-modal');
    }
    
    bindEvents() {
        // Draw pile click
        this.drawPileElement.addEventListener('click', () => this.drawCard());
        
        // UNO button
        this.unoButton.addEventListener('click', () => this.callUno());
        
        // Pass turn button
        this.passTurnButton.addEventListener('click', () => this.passTurn());
        
        // Color picker
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectColor(e.target.dataset.color));
        });
        
        // New game buttons
        document.getElementById('new-game').addEventListener('click', () => this.startNewGame());
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.gameOverModal.classList.add('hidden');
            this.startNewGame();
        });
        
        // Rules modal
        document.getElementById('rules-btn').addEventListener('click', () => {
            this.rulesModal.classList.remove('hidden');
        });
        
        document.getElementById('close-rules').addEventListener('click', () => {
            this.rulesModal.classList.add('hidden');
        });
        
        // Close modals on background click
        [this.gameOverModal, this.rulesModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }
    
    createDeck() {
        this.deck = [];
        
        // Add number and action cards for each color
        this.colors.forEach(color => {
            // Numbers 0-9 (0 appears once, 1-9 appear twice)
            this.deck.push(this.createCard(color, 0));
            for (let i = 1; i <= 9; i++) {
                this.deck.push(this.createCard(color, i));
                this.deck.push(this.createCard(color, i));
            }
            
            // Action cards (2 of each per color)
            this.actionCards.forEach(action => {
                this.deck.push(this.createCard(color, action));
                this.deck.push(this.createCard(color, action));
            });
        });
        
        // Add wild cards (4 of each)
        for (let i = 0; i < 4; i++) {
            this.deck.push(this.createCard(null, 'wild'));
            this.deck.push(this.createCard(null, 'wild_draw4'));
        }
        
        this.shuffleDeck();
    }
    
    createCard(color, value) {
        return {
            color: color,
            value: value,
            id: Math.random().toString(36).substr(2, 9)
        };
    }
    
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    
    dealCards() {
        // Deal 7 cards to each player
        this.playerHand = [];
        this.computerHand = [];
        
        for (let i = 0; i < 7; i++) {
            this.playerHand.push(this.deck.pop());
            this.computerHand.push(this.deck.pop());
        }
        
        // Find a non-wild card for the starting card
        let startingCard;
        do {
            startingCard = this.deck.pop();
        } while (startingCard.value === 'wild' || startingCard.value === 'wild_draw4');
        
        this.discardPile = [startingCard];
        this.currentColor = startingCard.color;
        
        // Handle special starting card
        if (startingCard.value === 'skip') {
            this.currentPlayer = 'computer';
            this.updateGameStatus('Starting card is Skip! Computer\'s turn is skipped.');
        } else if (startingCard.value === 'draw2') {
            this.drawCount = 2;
            this.updateGameStatus('Starting card is Draw 2! Draw 2 cards or play another Draw 2.');
        } else if (startingCard.value === 'reverse') {
            this.gameDirection *= -1;
            this.updateGameStatus('Starting card is Reverse! Turn order reversed.');
        }
    }
    
    startNewGame() {
        this.createDeck();
        this.dealCards();
        this.currentPlayer = 'player';
        this.gameDirection = 1;
        this.gameRunning = true;
        this.unoCalledByPlayer = false;
        this.drawCount = 0;
        
        this.updateDisplay();
        this.updateGameStatus('Game started! Match the color or number.');
    }
    
    updateDisplay() {
        this.renderPlayerHand();
        this.renderCurrentCard();
        this.updateCounts();
        this.updateTurnIndicator();
        this.updateButtons();
    }
    
    renderPlayerHand() {
        this.playerHandElement.innerHTML = '';
        
        this.playerHand.forEach(card => {
            const cardElement = this.createCardElement(card);
            cardElement.addEventListener('click', () => this.playCard(card));
            
            // Highlight playable cards
            if (this.canPlayCard(card) && this.currentPlayer === 'player') {
                cardElement.classList.add('playable');
            }
            
            this.playerHandElement.appendChild(cardElement);
        });
    }
    
    createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        
        if (card.color) {
            cardElement.classList.add(card.color);
        } else {
            cardElement.classList.add('wild');
        }
        
        // Set card text
        if (card.value === 'wild') {
            cardElement.textContent = 'WILD';
        } else if (card.value === 'wild_draw4') {
            cardElement.textContent = 'WILD +4';
        } else if (card.value === 'skip') {
            cardElement.textContent = 'SKIP';
        } else if (card.value === 'reverse') {
            cardElement.textContent = '⟲';
        } else if (card.value === 'draw2') {
            cardElement.textContent = '+2';
        } else {
            cardElement.textContent = card.value;
        }
        
        return cardElement;
    }
    
    renderCurrentCard() {
        const currentCard = this.discardPile[this.discardPile.length - 1];
        this.currentCardElement.innerHTML = '';
        this.currentCardElement.appendChild(this.createCardElement(currentCard));
    }
    
    updateCounts() {
        this.deckCountElement.textContent = this.deck.length;
        this.opponentCardCountElement.textContent = this.computerHand.length;
    }
    
    updateTurnIndicator() {
        if (this.currentPlayer === 'player') {
            this.playerTurnElement.textContent = "Your Turn";
        } else {
            this.playerTurnElement.textContent = "Computer's Turn";
        }
    }
    
    updateButtons() {
        // Show UNO button if player has 2 cards and hasn't called UNO
        if (this.playerHand.length === 2 && !this.unoCalledByPlayer) {
            this.unoButton.classList.remove('hidden');
        } else {
            this.unoButton.classList.add('hidden');
        }
        
        // Show pass turn button if there are draw cards to handle
        if (this.drawCount > 0 && this.currentPlayer === 'player') {
            this.passTurnButton.classList.remove('hidden');
        } else {
            this.passTurnButton.classList.add('hidden');
        }
    }
    
    canPlayCard(card) {
        const currentCard = this.discardPile[this.discardPile.length - 1];
        
        // If there are draw cards pending, can only play matching draw cards
        if (this.drawCount > 0) {
            if (currentCard.value === 'draw2' && card.value === 'draw2') return true;
            if (currentCard.value === 'wild_draw4' && card.value === 'wild_draw4') return true;
            return false;
        }
        
        // Wild cards can always be played
        if (card.value === 'wild' || card.value === 'wild_draw4') {
            return true;
        }
        
        // Match color or value
        return card.color === this.currentColor || 
               card.value === currentCard.value;
    }
    
    playCard(card) {
        if (!this.gameRunning || this.currentPlayer !== 'player' || !this.canPlayCard(card)) {
            return;
        }
        
        // Remove card from player hand
        const cardIndex = this.playerHand.findIndex(c => c.id === card.id);
        this.playerHand.splice(cardIndex, 1);
        
        // Add to discard pile
        this.discardPile.push(card);
        
        this.executeCardEffect(card);
        this.updateDisplay();
        
        // Check for win
        if (this.playerHand.length === 0) {
            this.endGame('player');
            return;
        }
        
        // Check UNO penalty
        if (this.playerHand.length === 1 && !this.unoCalledByPlayer) {
            this.updateGameStatus('UNO penalty! You forgot to call UNO. Drawing 2 cards.');
            this.drawCardsForPlayer(2);
            this.updateDisplay();
        }
        
        // Switch turns if not affected by special cards
        if (this.currentPlayer === 'player') {
            this.switchTurn();
        }
    }
    
    executeCardEffect(card) {
        switch (card.value) {
            case 'skip':
                this.updateGameStatus('Skip card played! Next player skipped.');
                this.switchTurn(); // Skip the next player
                break;
                
            case 'reverse':
                this.gameDirection *= -1;
                this.updateGameStatus('Reverse card played! Turn order reversed.');
                break;
                
            case 'draw2':
                this.drawCount += 2;
                this.updateGameStatus('Draw 2 played! Next player must draw 2 or play another Draw 2.');
                break;
                
            case 'wild':
                this.showColorPicker();
                return; // Don't switch turns yet
                
            case 'wild_draw4':
                this.drawCount += 4;
                this.showColorPicker();
                return; // Don't switch turns yet
                
            default:
                this.currentColor = card.color;
                this.updateGameStatus(`${card.color} ${card.value} played.`);
        }
    }
    
    showColorPicker() {
        this.colorPicker.classList.remove('hidden');
    }
    
    selectColor(color) {
        this.currentColor = color;
        this.colorPicker.classList.add('hidden');
        
        const lastCard = this.discardPile[this.discardPile.length - 1];
        if (lastCard.value === 'wild') {
            this.updateGameStatus(`Wild card played! Color changed to ${color}.`);
        } else {
            this.updateGameStatus(`Wild Draw 4 played! Color changed to ${color}. Next player draws 4.`);
        }
        
        this.switchTurn();
    }
    
    drawCard() {
        if (!this.gameRunning || this.currentPlayer !== 'player') {
            return;
        }
        
        if (this.drawCount > 0) {
            // Handle pending draw cards
            this.drawCardsForPlayer(this.drawCount);
            this.drawCount = 0;
            this.switchTurn();
        } else {
            // Normal draw
            const drawnCard = this.drawCardFromDeck();
            if (drawnCard) {
                this.playerHand.push(drawnCard);
                this.updateGameStatus('You drew a card.');
                
                // If the drawn card is playable, player can choose to play it
                if (this.canPlayCard(drawnCard)) {
                    this.updateGameStatus('You drew a playable card! You can play it or pass.');
                } else {
                    this.switchTurn();
                }
            }
        }
        
        this.updateDisplay();
    }
    
    drawCardsForPlayer(count) {
        for (let i = 0; i < count; i++) {
            const card = this.drawCardFromDeck();
            if (card) {
                this.playerHand.push(card);
            }
        }
    }
    
    drawCardFromDeck() {
        if (this.deck.length === 0) {
            this.reshuffleDeck();
        }
        
        return this.deck.length > 0 ? this.deck.pop() : null;
    }
    
    reshuffleDeck() {
        if (this.discardPile.length <= 1) return;
        
        // Keep the current card, reshuffle the rest
        const currentCard = this.discardPile.pop();
        this.deck = [...this.discardPile];
        this.discardPile = [currentCard];
        this.shuffleDeck();
        
        this.updateGameStatus('Deck reshuffled!');
    }
    
    callUno() {
        if (this.playerHand.length === 2) {
            this.unoCalledByPlayer = true;
            this.updateGameStatus('UNO called!');
            this.updateButtons();
        }
    }
    
    passTurn() {
        if (this.drawCount > 0) {
            this.drawCardsForPlayer(this.drawCount);
            this.drawCount = 0;
            this.switchTurn();
            this.updateDisplay();
        }
    }
    
    switchTurn() {
        this.currentPlayer = this.currentPlayer === 'player' ? 'computer' : 'player';
        
        if (this.currentPlayer === 'computer') {
            setTimeout(() => this.computerTurn(), 1000);
        }
        
        this.updateDisplay();
    }
    
    computerTurn() {
        if (!this.gameRunning || this.currentPlayer !== 'player') {
            // Handle draw cards first
            if (this.drawCount > 0) {
                let canPlayDrawCard = false;
                const currentCard = this.discardPile[this.discardPile.length - 1];
                
                for (let card of this.computerHand) {
                    if ((currentCard.value === 'draw2' && card.value === 'draw2') ||
                        (currentCard.value === 'wild_draw4' && card.value === 'wild_draw4')) {
                        canPlayDrawCard = true;
                        this.computerPlayCard(card);
                        return;
                    }
                }
                
                if (!canPlayDrawCard) {
                    // Computer draws the cards
                    for (let i = 0; i < this.drawCount; i++) {
                        const card = this.drawCardFromDeck();
                        if (card) this.computerHand.push(card);
                    }
                    this.drawCount = 0;
                    this.updateGameStatus(`Computer drew ${this.drawCount} cards.`);
                    this.switchTurn();
                    return;
                }
            }
            
            // Find playable cards
            const playableCards = this.computerHand.filter(card => this.canPlayCard(card));
            
            if (playableCards.length > 0) {
                // Simple AI: prefer special cards, then by color match
                playableCards.sort((a, b) => {
                    if (a.value === 'wild_draw4') return -1;
                    if (b.value === 'wild_draw4') return 1;
                    if (a.value === 'wild') return -1;
                    if (b.value === 'wild') return 1;
                    if (this.actionCards.includes(a.value)) return -1;
                    if (this.actionCards.includes(b.value)) return 1;
                    if (a.color === this.currentColor) return -1;
                    if (b.color === this.currentColor) return 1;
                    return 0;
                });
                
                this.computerPlayCard(playableCards[0]);
            } else {
                // Draw a card
                const drawnCard = this.drawCardFromDeck();
                if (drawnCard) {
                    this.computerHand.push(drawnCard);
                    this.updateGameStatus('Computer drew a card.');
                    
                    // Check if drawn card is playable
                    if (this.canPlayCard(drawnCard)) {
                        setTimeout(() => this.computerPlayCard(drawnCard), 500);
                        return;
                    }
                }
                this.switchTurn();
            }
        }
    }
    
    computerPlayCard(card) {
        // Remove from computer hand
        const cardIndex = this.computerHand.findIndex(c => c.id === card.id);
        this.computerHand.splice(cardIndex, 1);
        
        // Add to discard pile
        this.discardPile.push(card);
        
        // Handle wild cards
        if (card.value === 'wild' || card.value === 'wild_draw4') {
            // Simple AI: choose most common color in hand
            const colorCounts = {};
            this.computerHand.forEach(c => {
                if (c.color) {
                    colorCounts[c.color] = (colorCounts[c.color] || 0) + 1;
                }
            });
            
            const chosenColor = Object.keys(colorCounts).length > 0 ?
                Object.keys(colorCounts).reduce((a, b) => colorCounts[a] > colorCounts[b] ? a : b) :
                this.colors[Math.floor(Math.random() * this.colors.length)];
            
            this.currentColor = chosenColor;
            
            if (card.value === 'wild') {
                this.updateGameStatus(`Computer played Wild! Color changed to ${chosenColor}.`);
            } else {
                this.drawCount += 4;
                this.updateGameStatus(`Computer played Wild Draw 4! Color changed to ${chosenColor}. You must draw 4!`);
            }
        } else {
            this.executeCardEffect(card);
        }
        
        this.updateDisplay();
        
        // Check for computer win
        if (this.computerHand.length === 0) {
            this.endGame('computer');
            return;
        }
        
        // Switch turns if appropriate
        if (this.currentPlayer !== 'player') {
            this.switchTurn();
        }
    }
    
    endGame(winner) {
        this.gameRunning = false;
        
        const resultElement = document.getElementById('game-result');
        const messageElement = document.getElementById('game-message');
        
        if (winner === 'player') {
            resultElement.textContent = 'You Won! 🎉';
            messageElement.textContent = 'Congratulations! You got rid of all your cards!';
        } else {
            resultElement.textContent = 'Computer Won! 😔';
            messageElement.textContent = 'Better luck next time! The computer got rid of all their cards.';
        }
        
        this.gameOverModal.classList.remove('hidden');
    }
    
    updateGameStatus(message) {
        this.gameStatusElement.textContent = message;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new UNOGame();
});