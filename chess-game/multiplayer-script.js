// Online Multiplayer Chess Game
class MultiplayerChessGame extends EnhancedChessGame {
    constructor() {
        super();
        
        // Multiplayer settings
        this.socket = null;
        this.gameId = null;
        this.playerId = null;
        this.playerColor = null;
        this.isOnline = false;
        this.opponentConnected = false;
        
        this.initializeMultiplayer();
    }
    
    initializeMultiplayer() {
        this.createMultiplayerUI();
        this.bindMultiplayerEvents();
    }
    
    createMultiplayerUI() {
        const controlsContainer = document.querySelector('.game-controls');
        
        const multiplayerSection = document.createElement('div');
        multiplayerSection.className = 'multiplayer-section';
        multiplayerSection.innerHTML = `
            <h4>Online Multiplayer</h4>
            <div class="multiplayer-controls">
                <button id="create-room" class="btn btn-primary">Create Room</button>
                <button id="join-room" class="btn btn-secondary">Join Room</button>
                <div class="room-input hidden">
                    <input type="text" id="room-code" placeholder="Enter room code" maxlength="6">
                    <button id="join-room-submit" class="btn btn-primary">Join</button>
                </div>
                <div class="room-info hidden">
                    <p>Room: <span id="current-room"></span></p>
                    <p>Status: <span id="connection-status">Waiting for opponent...</span></p>
                    <button id="copy-room-code" class="btn btn-secondary">Copy Room Code</button>
                    <button id="leave-room" class="btn btn-danger">Leave Room</button>
                </div>
            </div>
        `;
        
        controlsContainer.insertBefore(multiplayerSection, controlsContainer.firstChild);
    }
    
    bindMultiplayerEvents() {
        document.getElementById('create-room').addEventListener('click', () => this.createRoom());
        document.getElementById('join-room').addEventListener('click', () => this.showJoinRoom());
        document.getElementById('join-room-submit').addEventListener('click', () => this.joinRoom());
        document.getElementById('copy-room-code').addEventListener('click', () => this.copyRoomCode());
        document.getElementById('leave-room').addEventListener('click', () => this.leaveRoom());
    }
    
    createRoom() {
        this.gameId = this.generateRoomCode();
        this.playerId = this.generatePlayerId();
        this.playerColor = 'white'; // Room creator is white
        
        this.connectToServer();
        this.showRoomInfo();
        
        // Simulate server connection (replace with real WebSocket)
        setTimeout(() => {
            this.updateConnectionStatus('Room created! Share code with opponent.');
        }, 500);
    }
    
    showJoinRoom() {
        document.querySelector('.room-input').classList.remove('hidden');
        document.getElementById('room-code').focus();
    }
    
    joinRoom() {
        const roomCode = document.getElementById('room-code').value.trim().toUpperCase();
        if (roomCode.length !== 6) {
            alert('Please enter a valid 6-character room code');
            return;
        }
        
        this.gameId = roomCode;
        this.playerId = this.generatePlayerId();
        this.playerColor = 'black'; // Joiner is black
        
        this.connectToServer();
        this.showRoomInfo();
        
        // Simulate joining (replace with real WebSocket)
        setTimeout(() => {
            this.opponentConnected = true;
            this.updateConnectionStatus('Connected! Game ready to start.');
            this.startOnlineGame();
        }, 1000);
    }
    
    connectToServer() {
        // This would be a real WebSocket connection in production
        // For demo purposes, we'll simulate it
        
        /*
        // Real WebSocket implementation would look like:
        this.socket = new WebSocket('wss://your-chess-server.com');
        
        this.socket.onopen = () => {
            this.isOnline = true;
            this.socket.send(JSON.stringify({
                type: 'join-game',
                gameId: this.gameId,
                playerId: this.playerId
            }));
        };
        
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleServerMessage(data);
        };
        
        this.socket.onclose = () => {
            this.isOnline = false;
            this.updateConnectionStatus('Disconnected from server');
        };
        */
        
        // Simulate connection
        this.isOnline = true;
    }
    
    handleServerMessage(data) {
        switch (data.type) {
            case 'player-joined':
                this.opponentConnected = true;
                this.updateConnectionStatus('Opponent connected! Game starting...');
                this.startOnlineGame();
                break;
                
            case 'move-made':
                this.receiveOpponentMove(data.move);
                break;
                
            case 'player-disconnected':
                this.opponentConnected = false;
                this.updateConnectionStatus('Opponent disconnected');
                break;
                
            case 'game-ended':
                this.handleOnlineGameEnd(data.result);
                break;
        }
    }
    
    startOnlineGame() {
        this.gameMode = 'online-multiplayer';
        this.newGame();
        
        if (this.playerColor === 'black') {
            this.updateGameStatus('Waiting for opponent\'s move...');
        }
    }
    
    // Override makeMove to send moves to opponent
    makeMove(fromRow, fromCol, toRow, toCol) {
        // Check if it's the player's turn in online mode
        if (this.gameMode === 'online-multiplayer' && this.currentPlayer !== this.playerColor) {
            this.updateGameStatus('Not your turn!');
            return;
        }
        
        super.makeMove(fromRow, fromCol, toRow, toCol);
        
        // Send move to opponent
        if (this.isOnline && this.gameMode === 'online-multiplayer') {
            this.sendMoveToOpponent(fromRow, fromCol, toRow, toCol);
        }
    }
    
    sendMoveToOpponent(fromRow, fromCol, toRow, toCol) {
        if (!this.socket) return;
        
        const moveData = {
            type: 'make-move',
            gameId: this.gameId,
            playerId: this.playerId,
            move: {
                from: { row: fromRow, col: fromCol },
                to: { row: toRow, col: toCol }
            }
        };
        
        this.socket.send(JSON.stringify(moveData));
    }
    
    receiveOpponentMove(move) {
        // Apply opponent's move to the board
        super.makeMove(move.from.row, move.from.col, move.to.row, move.to.col);
        this.updateGameStatus('Your turn!');
    }
    
    showRoomInfo() {
        document.querySelector('.room-input').classList.add('hidden');
        document.querySelector('.room-info').classList.remove('hidden');
        document.getElementById('current-room').textContent = this.gameId;
    }
    
    updateConnectionStatus(status) {
        document.getElementById('connection-status').textContent = status;
    }
    
    copyRoomCode() {
        navigator.clipboard.writeText(this.gameId).then(() => {
            const btn = document.getElementById('copy-room-code');
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    }
    
    leaveRoom() {
        if (this.socket) {
            this.socket.close();
        }
        
        this.isOnline = false;
        this.opponentConnected = false;
        this.gameId = null;
        this.playerId = null;
        this.playerColor = null;
        
        document.querySelector('.room-info').classList.add('hidden');
        this.gameMode = 'human-vs-human';
        this.updateConnectionStatus('Disconnected');
    }
    
    generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    generatePlayerId() {
        return 'player_' + Math.random().toString(36).substr(2, 9);
    }
}

// Game Analysis System
class ChessAnalyzer {
    constructor(game) {
        this.game = game;
        this.analysisCache = new Map();
    }
    
    analyzePosition() {
        const position = this.getBoardState();
        
        if (this.analysisCache.has(position)) {
            return this.analysisCache.get(position);
        }
        
        const analysis = {
            evaluation: this.evaluatePosition(),
            bestMoves: this.findBestMoves(),
            threats: this.findThreats(),
            suggestions: this.generateSuggestions()
        };
        
        this.analysisCache.set(position, analysis);
        return analysis;
    }
    
    evaluatePosition() {
        const material = this.calculateMaterial();
        const positional = this.calculatePositional();
        const safety = this.calculateKingSafety();
        
        return {
            total: material + positional + safety,
            material: material,
            positional: positional,
            kingSafety: safety
        };
    }
    
    findBestMoves() {
        const moves = this.game.getAllValidMoves(this.game.currentPlayer);
        const evaluatedMoves = moves.map(move => ({
            move: move,
            score: this.evaluateMove(move)
        }));
        
        return evaluatedMoves
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
    }
    
    findThreats() {
        const threats = [];
        const opponentColor = this.game.currentPlayer === 'white' ? 'black' : 'white';
        const opponentMoves = this.game.getAllValidMoves(opponentColor);
        
        opponentMoves.forEach(move => {
            if (move.capture) {
                threats.push({
                    type: 'capture',
                    target: move.to,
                    attacker: move.from,
                    piece: move.piece.type
                });
            }
        });
        
        return threats;
    }
    
    generateSuggestions() {
        const suggestions = [];
        const analysis = this.analyzePosition();
        
        if (analysis.evaluation.material < -2) {
            suggestions.push('You are behind in material. Look for tactical opportunities.');
        }
        
        if (analysis.evaluation.kingSafety < -1) {
            suggestions.push('Your king looks unsafe. Consider castling or moving to safety.');
        }
        
        if (analysis.threats.length > 0) {
            suggestions.push('Watch out for opponent threats on the board.');
        }
        
        return suggestions;
    }
    
    calculateMaterial() {
        const pieceValues = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 };
        let whiteTotal = 0, blackTotal = 0;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.game.board[row][col];
                if (piece) {
                    const value = pieceValues[piece.type];
                    if (piece.color === 'white') {
                        whiteTotal += value;
                    } else {
                        blackTotal += value;
                    }
                }
            }
        }
        
        return this.game.currentPlayer === 'white' ? whiteTotal - blackTotal : blackTotal - whiteTotal;
    }
    
    calculatePositional() {
        // Simplified positional evaluation
        let score = 0;
        
        // Center control
        const centerSquares = [[3,3], [3,4], [4,3], [4,4]];
        centerSquares.forEach(([row, col]) => {
            const piece = this.game.board[row][col];
            if (piece && piece.color === this.game.currentPlayer) {
                score += 0.3;
            }
        });
        
        return score;
    }
    
    calculateKingSafety() {
        const kingPos = this.game.kingPositions[this.game.currentPlayer];
        let safety = 0;
        
        // Check if king is castled (simplified)
        if (this.game.currentPlayer === 'white' && kingPos.col > 5) {
            safety += 1;
        } else if (this.game.currentPlayer === 'black' && kingPos.col > 5) {
            safety += 1;
        }
        
        return safety;
    }
    
    getBoardState() {
        return JSON.stringify(this.game.board);
    }
    
    evaluateMove(move) {
        // Simplified move evaluation
        let score = 0;
        
        if (move.capture) {
            const pieceValues = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9 };
            score += pieceValues[move.capture.type] || 0;
        }
        
        // Center moves are better
        const centerDistance = Math.abs(move.to.row - 3.5) + Math.abs(move.to.col - 3.5);
        score += (7 - centerDistance) * 0.1;
        
        return score;
    }
}

// Additional CSS for multiplayer features
const multiplayerStyles = `
/* Multiplayer Section */
.multiplayer-section {
    margin-bottom: 20px;
    padding: 15px;
    background: #e8f4fd;
    border-radius: 10px;
    border: 2px solid #3498db;
}

.multiplayer-section h4 {
    color: #2980b9;
    margin-bottom: 15px;
    font-weight: 700;
}

.multiplayer-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.room-input {
    display: flex;
    gap: 8px;
    align-items: center;
}

.room-input input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #bdc3c7;
    border-radius: 5px;
    font-size: 0.9rem;
    text-transform: uppercase;
}

.room-info {
    background: rgba(39, 174, 96, 0.1);
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #27ae60;
}

.room-info p {
    margin: 5px 0;
    font-size: 0.9rem;
}

.btn-danger {
    background-color: #e74c3c;
    color: white;
}

.btn-danger:hover {
    background-color: #c0392b;
}

/* Online game indicators */
.online-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #27ae60;
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.8rem;
}

.waiting-indicator {
    background: #f39c12;
}

.disconnected-indicator {
    background: #e74c3c;
}

/* Analysis Panel */
.analysis-panel {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    margin-top: 20px;
    border: 1px solid #e9ecef;
}

.analysis-panel h4 {
    color: #2c3e50;
    margin-bottom: 10px;
}

.evaluation-bar {
    width: 100%;
    height: 20px;
    background: linear-gradient(to right, #2c3e50 0%, #2c3e50 50%, #ecf0f1 50%, #ecf0f1 100%);
    border-radius: 10px;
    position: relative;
    margin-bottom: 15px;
}

.evaluation-indicator {
    position: absolute;
    top: 0;
    left: 50%;
    width: 4px;
    height: 100%;
    background: #e74c3c;
    border-radius: 2px;
    transition: left 0.3s ease;
}

.best-moves {
    margin-bottom: 15px;
}

.best-move {
    background: #ecf0f1;
    padding: 8px 12px;
    margin: 5px 0;
    border-radius: 5px;
    font-family: monospace;
    font-size: 0.9rem;
}

.suggestions {
    font-size: 0.9rem;
    color: #7f8c8d;
    line-height: 1.4;
}

/* Mobile optimizations for multiplayer */
@media (max-width: 768px) {
    .multiplayer-section {
        padding: 10px;
    }
    
    .room-input {
        flex-direction: column;
        align-items: stretch;
    }
    
    .room-input input {
        margin-bottom: 8px;
    }
}
`;

// Add multiplayer styles
const multiplayerStyleElement = document.createElement('style');
multiplayerStyleElement.textContent = multiplayerStyles;
document.head.appendChild(multiplayerStyleElement);

// Initialize multiplayer chess game
document.addEventListener('DOMContentLoaded', () => {
    const game = new MultiplayerChessGame();
    
    // Add analysis panel to the game
    const gamePanel = document.querySelector('.game-panel');
    const analysisPanel = document.createElement('div');
    analysisPanel.className = 'analysis-panel';
    analysisPanel.innerHTML = `
        <h4>Position Analysis</h4>
        <div class="evaluation-bar">
            <div class="evaluation-indicator"></div>
        </div>
        <div class="best-moves">
            <strong>Best Moves:</strong>
            <div id="best-moves-list"></div>
        </div>
        <div class="suggestions">
            <div id="suggestions-list"></div>
        </div>
    `;
    gamePanel.appendChild(analysisPanel);
    
    // Initialize analyzer
    const analyzer = new ChessAnalyzer(game);
    
    // Update analysis after each move
    const originalMakeMove = game.makeMove.bind(game);
    game.makeMove = function(fromRow, fromCol, toRow, toCol) {
        originalMakeMove(fromRow, fromCol, toRow, toCol);
        
        // Update analysis
        setTimeout(() => {
            const analysis = analyzer.analyzePosition();
            updateAnalysisDisplay(analysis);
        }, 100);
    };
    
    function updateAnalysisDisplay(analysis) {
        // Update evaluation bar
        const indicator = document.querySelector('.evaluation-indicator');
        const evaluation = Math.max(-5, Math.min(5, analysis.evaluation.total));
        const percentage = ((evaluation + 5) / 10) * 100;
        indicator.style.left = `${percentage}%`;
        
        // Update best moves
        const bestMovesList = document.getElementById('best-moves-list');
        bestMovesList.innerHTML = '';
        analysis.bestMoves.forEach(moveData => {
            const moveElement = document.createElement('div');
            moveElement.className = 'best-move';
            moveElement.textContent = `${moveData.move.piece.type} ${String.fromCharCode(97 + moveData.move.to.col)}${8 - moveData.move.to.row} (${moveData.score.toFixed(1)})`;
            bestMovesList.appendChild(moveElement);
        });
        
        // Update suggestions
        const suggestionsList = document.getElementById('suggestions-list');
        suggestionsList.innerHTML = analysis.suggestions.join('<br>');
    }
});