// Enhanced Chess Game with AI Opponent
window.enhancedModeEnabled = true;

class EnhancedChessGame extends ChessGame {
    constructor() {
        super();
        
        // AI Settings
        this.gameMode = 'human-vs-human'; // 'human-vs-human', 'human-vs-ai'
        this.aiDifficulty = 'medium'; // 'easy', 'medium', 'hard'
        this.aiThinking = false;
        this.aiDepth = { easy: 2, medium: 3, hard: 4 };
        
        // Enhanced features
        this.soundEnabled = true;
        this.animationsEnabled = true;
        this.currentTheme = 'classic';
        this.moveHistory = [];
        this.gameAnalysis = [];
        
        this.initializeEnhancedFeatures();
    }
    
    initializeEnhancedFeatures() {
        this.createGameModeSelector();
        this.createDifficultySelector();
        this.createThemeSelector();
        this.createSoundToggle();
        this.bindEnhancedEvents();
    }
    
    createGameModeSelector() {
        const controlsContainer = document.querySelector('.game-controls');
        
        const modeSelector = document.createElement('div');
        modeSelector.className = 'game-mode-selector';
        modeSelector.innerHTML = `
            <h4>Game Mode</h4>
            <select id="game-mode" class="mode-select">
                <option value="human-vs-human">Human vs Human</option>
                <option value="human-vs-ai">Human vs Computer</option>
            </select>
        `;
        
        controlsContainer.insertBefore(modeSelector, controlsContainer.firstChild);
    }
    
    createDifficultySelector() {
        const controlsContainer = document.querySelector('.game-controls');
        
        const difficultySelector = document.createElement('div');
        difficultySelector.className = 'difficulty-selector hidden';
        difficultySelector.innerHTML = `
            <h4>AI Difficulty</h4>
            <select id="ai-difficulty" class="difficulty-select">
                <option value="easy">Easy</option>
                <option value="medium" selected>Medium</option>
                <option value="hard">Hard</option>
            </select>
        `;
        
        controlsContainer.insertBefore(difficultySelector, controlsContainer.children[1]);
    }
    
    createThemeSelector() {
        const controlsContainer = document.querySelector('.game-controls');
        
        const themeSelector = document.createElement('div');
        themeSelector.className = 'theme-selector';
        themeSelector.innerHTML = `
            <h4>Theme</h4>
            <select id="board-theme" class="theme-select">
                <option value="classic">Classic</option>
                <option value="wood">Wood</option>
                <option value="marble">Marble</option>
                <option value="neon">Neon</option>
            </select>
        `;
        
        controlsContainer.appendChild(themeSelector);
    }
    
    createSoundToggle() {
        const controlsContainer = document.querySelector('.game-controls');
        
        const soundToggle = document.createElement('div');
        soundToggle.className = 'sound-toggle';
        soundToggle.innerHTML = `
            <button id="sound-toggle" class="btn btn-secondary">
                🔊 Sound: ON
            </button>
        `;
        
        controlsContainer.appendChild(soundToggle);
    }
    
    bindEnhancedEvents() {
        // Game mode selector
        document.getElementById('game-mode').addEventListener('change', (e) => {
            this.gameMode = e.target.value;
            const difficultySelector = document.querySelector('.difficulty-selector');
            
            if (this.gameMode === 'human-vs-ai') {
                difficultySelector.classList.remove('hidden');
                if (this.currentPlayer === 'black') {
                    // If it's AI's turn, make AI move
                    setTimeout(() => this.makeAIMove(), 1000);
                }
            } else {
                difficultySelector.classList.add('hidden');
            }
        });
        
        // Difficulty selector
        document.getElementById('ai-difficulty').addEventListener('change', (e) => {
            this.aiDifficulty = e.target.value;
        });
        
        // Theme selector
        document.getElementById('board-theme').addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });
        
        // Sound toggle
        document.getElementById('sound-toggle').addEventListener('click', () => {
            this.soundEnabled = !this.soundEnabled;
            const btn = document.getElementById('sound-toggle');
            btn.textContent = this.soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
        });
    }
    
    // Override the switchTurn method to handle AI moves
    switchTurn() {
        super.switchTurn();
        
        // If it's AI's turn and game mode is human vs AI
        if (this.gameMode === 'human-vs-ai' && this.currentPlayer === 'black' && !this.gameOver) {
            this.updateGameStatus('Computer is thinking...');
            setTimeout(() => this.makeAIMove(), 1000);
        }
    }
    
    makeAIMove() {
        if (this.aiThinking || this.gameOver) return;
        
        this.aiThinking = true;
        const depth = this.aiDepth[this.aiDifficulty];
        
        // Get best move using minimax algorithm
        const bestMove = this.getBestMove(depth);
        
        if (bestMove) {
            // Animate AI thinking
            this.playSound('ai-thinking');
            
            setTimeout(() => {
                this.makeMove(bestMove.from.row, bestMove.from.col, bestMove.to.row, bestMove.to.col);
                this.playSound('move');
                this.aiThinking = false;
            }, 500);
        } else {
            this.aiThinking = false;
        }
    }
    
    getBestMove(depth) {
        const possibleMoves = this.getAllValidMoves('black');
        
        if (possibleMoves.length === 0) return null;
        
        let bestMove = null;
        let bestScore = -Infinity;
        
        // Evaluate each possible move
        for (let move of possibleMoves) {
            const score = this.evaluateMove(move, depth);
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        return bestMove;
    }
    
    getAllValidMoves(color) {
        const moves = [];
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    const validMoves = this.getValidMoves(row, col);
                    validMoves.forEach(move => {
                        moves.push({
                            from: { row, col },
                            to: { row: move.row, col: move.col },
                            piece: piece,
                            capture: move.capture,
                            special: move.castle || move.enPassant
                        });
                    });
                }
            }
        }
        
        return moves;
    }
    
    evaluateMove(move, depth) {
        // Make temporary move
        const originalPiece = this.board[move.to.row][move.to.col];
        this.board[move.to.row][move.to.col] = this.board[move.from.row][move.from.col];
        this.board[move.from.row][move.from.col] = null;
        
        let score;
        
        if (depth <= 0) {
            score = this.evaluatePosition();
        } else {
            // Minimax with alpha-beta pruning (simplified)
            const opponentMoves = this.getAllValidMoves('white');
            let minScore = Infinity;
            
            for (let opponentMove of opponentMoves.slice(0, 10)) { // Limit for performance
                const opponentScore = -this.evaluateMove(opponentMove, depth - 1);
                minScore = Math.min(minScore, opponentScore);
            }
            
            score = minScore === Infinity ? this.evaluatePosition() : minScore;
        }
        
        // Restore board
        this.board[move.from.row][move.from.col] = this.board[move.to.row][move.to.col];
        this.board[move.to.row][move.to.col] = originalPiece;
        
        return score;
    }
    
    evaluatePosition() {
        const pieceValues = {
            pawn: 1,
            knight: 3,
            bishop: 3,
            rook: 5,
            queen: 9,
            king: 100
        };
        
        let score = 0;
        
        // Material evaluation
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    const value = pieceValues[piece.type];
                    if (piece.color === 'black') {
                        score += value;
                    } else {
                        score -= value;
                    }
                }
            }
        }
        
        // Positional evaluation
        score += this.evaluatePosition_positional();
        
        // Add some randomness for easier difficulties
        if (this.aiDifficulty === 'easy') {
            score += (Math.random() - 0.5) * 2;
        } else if (this.aiDifficulty === 'medium') {
            score += (Math.random() - 0.5) * 0.5;
        }
        
        return score;
    }
    
    evaluatePosition_positional() {
        // Center control
        let score = 0;
        const centerSquares = [[3,3], [3,4], [4,3], [4,4]];
        
        centerSquares.forEach(([row, col]) => {
            const piece = this.board[row][col];
            if (piece) {
                if (piece.color === 'black') {
                    score += 0.3;
                } else {
                    score -= 0.3;
                }
            }
        });
        
        return score;
    }
    
    changeTheme(theme) {
        this.currentTheme = theme;
        const boardElement = document.getElementById('chess-board');
        
        // Remove all theme classes
        boardElement.classList.remove('theme-classic', 'theme-wood', 'theme-marble', 'theme-neon');
        
        // Add new theme class
        boardElement.classList.add(`theme-${theme}`);
        
        this.playSound('theme-change');
    }
    
    playSound(soundType) {
        if (!this.soundEnabled) return;
        
        // Create audio context for sound effects
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const sounds = {
            'move': { frequency: 800, duration: 100 },
            'capture': { frequency: 400, duration: 150 },
            'check': { frequency: 1000, duration: 300 },
            'ai-thinking': { frequency: 600, duration: 50 },
            'theme-change': { frequency: 500, duration: 80 }
        };
        
        const sound = sounds[soundType];
        if (!sound) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + sound.duration / 1000);
    }
    
    // Override makeMove to add sound effects
    makeMove(fromRow, fromCol, toRow, toCol) {
        const target = this.board[toRow][toCol];
        
        super.makeMove(fromRow, fromCol, toRow, toCol);
        
        // Play appropriate sound
        if (target) {
            this.playSound('capture');
        } else {
            this.playSound('move');
        }
        
        // Check for check
        if (this.isInCheck(this.currentPlayer)) {
            this.playSound('check');
        }
    }
}

// Enhanced CSS for new features
const enhancedStyles = `
/* Game Mode and Difficulty Selectors */
.game-mode-selector, .difficulty-selector, .theme-selector {
    margin-bottom: 15px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.game-mode-selector h4, .difficulty-selector h4, .theme-selector h4 {
    margin-bottom: 10px;
    color: #2c3e50;
    font-size: 0.9rem;
    font-weight: 600;
}

.mode-select, .difficulty-select, .theme-select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    background: white;
    font-size: 0.9rem;
}

/* AI Thinking Indicator */
.ai-thinking {
    background: linear-gradient(45deg, #3498db, #2980b9);
    animation: thinking 1s infinite;
}

@keyframes thinking {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
}

/* Theme Styles */
.theme-wood .square.light {
    background-color: #deb887;
}

.theme-wood .square.dark {
    background-color: #8b4513;
}

.theme-marble .square.light {
    background-color: #f5f5dc;
}

.theme-marble .square.dark {
    background-color: #708090;
}

.theme-neon .square.light {
    background-color: #00ffff;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.theme-neon .square.dark {
    background-color: #8a2be2;
    box-shadow: 0 0 10px rgba(138, 43, 226, 0.3);
}

/* Sound Toggle */
.sound-toggle {
    margin-top: 10px;
}

/* Enhanced Animations */
.piece-moving {
    transition: all 0.3s ease-in-out;
    transform: scale(1.1);
}

.square.highlight-last-move {
    background-color: rgba(255, 255, 0, 0.4) !important;
    border: 2px solid #ffd700;
}

/* Mobile Enhancements */
@media (max-width: 768px) {
    .game-mode-selector, .difficulty-selector, .theme-selector {
        padding: 10px;
        margin-bottom: 10px;
    }
    
    .mode-select, .difficulty-select, .theme-select {
        padding: 6px 10px;
        font-size: 0.8rem;
    }
}
`;

// Add enhanced styles to the page
const styleElement = document.createElement('style');
styleElement.textContent = enhancedStyles;
document.head.appendChild(styleElement);

// Initialize enhanced chess game when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the enhanced chess game
    window.chessGameInstance = new EnhancedChessGame();
});