// Enhanced Chess Game Implementation with AI
class ChessGame {
    constructor() {
        // Game state
        this.board = [];
        this.currentPlayer = 'white';
        this.gameOver = false;
        this.selectedSquare = null;
        this.validMoves = [];
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.gameStartTime = Date.now();
        this.gameTimer = null;
        
        // AI Settings
        this.gameMode = 'human-vs-human';
        this.aiDifficulty = 'medium';
        this.aiThinking = false;
        
        // Enhanced features
        this.gameMode = 'human-vs-human';
        this.aiDifficulty = 'medium';
        this.currentTheme = 'classic';
        this.soundEnabled = true;
        this.aiThinking = false;
        
        // Chess piece symbols
        this.pieces = {
            white: {
                king: '♔',
                queen: '♕',
                rook: '♖',
                bishop: '♗',
                knight: '♘',
                pawn: '♙'
            },
            black: {
                king: '♚',
                queen: '♛',
                rook: '♜',
                bishop: '♝',
                knight: '♞',
                pawn: '♟'
            }
        };
        
        // Special move tracking
        this.castlingRights = {
            white: { kingside: true, queenside: true },
            black: { kingside: true, queenside: true }
        };
        this.enPassantTarget = null;
        this.kingPositions = { white: { row: 7, col: 4 }, black: { row: 0, col: 4 } };
        
        this.initializeGame();
        this.bindEvents();
        this.bindEnhancedEvents();
        this.startGameTimer();
    }
    
    bindEnhancedEvents() {
        // Game mode selector
        const gameModeSelect = document.getElementById('game-mode');
        if (gameModeSelect) {
            gameModeSelect.addEventListener('change', (e) => {
                this.gameMode = e.target.value;
                const difficultySelector = document.querySelector('.difficulty-selector');
                
                if (this.gameMode === 'human-vs-ai') {
                    difficultySelector.classList.remove('hidden');
                    this.updateGameStatus('Playing against AI - You are White');
                } else {
                    difficultySelector.classList.add('hidden');
                    this.updateGameStatus('Human vs Human mode');
                }
            });
        }
        
        // Difficulty selector
        const difficultySelect = document.getElementById('ai-difficulty');
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                this.aiDifficulty = e.target.value;
                this.updateGameStatus(`AI difficulty set to ${e.target.value}`);
            });
        }
        
        // Theme selector
        const themeSelect = document.getElementById('board-theme');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.changeTheme(e.target.value);
            });
        }
        
        // Sound toggle
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                this.soundEnabled = !this.soundEnabled;
                soundToggle.textContent = this.soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
            });
        }
    }
    
    changeTheme(theme) {
        this.currentTheme = theme;
        const boardElement = document.getElementById('chess-board');
        
        // Remove all theme classes
        boardElement.classList.remove('theme-classic', 'theme-wood', 'theme-marble', 'theme-neon');
        
        // Add new theme class
        if (theme !== 'classic') {
            boardElement.classList.add(`theme-${theme}`);
        }
        
        this.updateGameStatus(`Theme changed to ${theme}`);
    }
    
    initializeGame() {
        this.initializeBoard();
        this.renderBoard();
        this.updateDisplay();
    }
    
    initializeBoard() {
        // Initialize empty board
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Set up starting position
        const startingPosition = [
            ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
            ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
            ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
        ];
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (startingPosition[row][col]) {
                    const color = row < 2 ? 'black' : 'white';
                    this.board[row][col] = {
                        type: startingPosition[row][col],
                        color: color,
                        hasMoved: false
                    };
                }
            }
        }
    }
    
    renderBoard() {
        const boardElement = document.getElementById('chess-board');
        boardElement.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                const piece = this.board[row][col];
                if (piece) {
                    const pieceElement = document.createElement('span');
                    pieceElement.className = `piece ${piece.color}`;
                    pieceElement.textContent = this.pieces[piece.color][piece.type];
                    square.appendChild(pieceElement);
                }
                
                square.addEventListener('click', () => this.handleSquareClick(row, col));
                boardElement.appendChild(square);
            }
        }
    }
    
    handleSquareClick(row, col) {
        if (this.gameOver) return;
        
        const clickedPiece = this.board[row][col];
        
        // If a square is selected and this is a valid move
        if (this.selectedSquare && this.isValidMove(this.selectedSquare.row, this.selectedSquare.col, row, col)) {
            this.makeMove(this.selectedSquare.row, this.selectedSquare.col, row, col);
            this.clearSelection();
            return;
        }
        
        // If clicking on own piece, select it
        if (clickedPiece && clickedPiece.color === this.currentPlayer) {
            this.selectSquare(row, col);
        } else {
            this.clearSelection();
        }
    }
    
    selectSquare(row, col) {
        this.clearSelection();
        this.selectedSquare = { row, col };
        this.validMoves = this.getValidMoves(row, col);
        this.highlightValidMoves();
        
        // Highlight selected square
        const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        square.classList.add('selected');
    }
    
    clearSelection() {
        this.selectedSquare = null;
        this.validMoves = [];
        
        // Remove all highlights
        document.querySelectorAll('.square').forEach(square => {
            square.classList.remove('selected', 'valid-move', 'capture');
        });
    }
    
    highlightValidMoves() {
        this.validMoves.forEach(move => {
            const square = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
            square.classList.add('valid-move');
            if (move.capture) {
                square.classList.add('capture');
            }
        });
    }
    
    getValidMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece || piece.color !== this.currentPlayer) return [];
        
        let moves = [];
        
        switch (piece.type) {
            case 'pawn':
                moves = this.getPawnMoves(row, col);
                break;
            case 'rook':
                moves = this.getRookMoves(row, col);
                break;
            case 'knight':
                moves = this.getKnightMoves(row, col);
                break;
            case 'bishop':
                moves = this.getBishopMoves(row, col);
                break;
            case 'queen':
                moves = this.getQueenMoves(row, col);
                break;
            case 'king':
                moves = this.getKingMoves(row, col);
                break;
        }
        
        // Filter out moves that would put own king in check
        return moves.filter(move => !this.wouldBeInCheck(row, col, move.row, move.col));
    }
    
    getPawnMoves(row, col) {
        const moves = [];
        const piece = this.board[row][col];
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        
        // Forward move
        if (this.isInBounds(row + direction, col) && !this.board[row + direction][col]) {
            moves.push({ row: row + direction, col: col });
            
            // Two squares forward from starting position
            if (row === startRow && !this.board[row + 2 * direction][col]) {
                moves.push({ row: row + 2 * direction, col: col });
            }
        }
        
        // Diagonal captures
        for (let dc of [-1, 1]) {
            const newRow = row + direction;
            const newCol = col + dc;
            if (this.isInBounds(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (target && target.color !== piece.color) {
                    moves.push({ row: newRow, col: newCol, capture: true });
                }
                
                // En passant
                if (this.enPassantTarget && 
                    this.enPassantTarget.row === newRow && 
                    this.enPassantTarget.col === newCol) {
                    moves.push({ row: newRow, col: newCol, capture: true, enPassant: true });
                }
            }
        }
        
        return moves;
    }
    
    getRookMoves(row, col) {
        return this.getLinearMoves(row, col, [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ]);
    }
    
    getBishopMoves(row, col) {
        return this.getLinearMoves(row, col, [
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ]);
    }
    
    getQueenMoves(row, col) {
        return this.getLinearMoves(row, col, [
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ]);
    }
    
    getKnightMoves(row, col) {
        const moves = [];
        const knightMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        
        knightMoves.forEach(([dr, dc]) => {
            const newRow = row + dr;
            const newCol = col + dc;
            if (this.isInBounds(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target || target.color !== this.board[row][col].color) {
                    moves.push({ 
                        row: newRow, 
                        col: newCol, 
                        capture: target ? true : false 
                    });
                }
            }
        });
        
        return moves;
    }
    
    getKingMoves(row, col) {
        const moves = [];
        const kingMoves = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        kingMoves.forEach(([dr, dc]) => {
            const newRow = row + dr;
            const newCol = col + dc;
            if (this.isInBounds(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target || target.color !== this.board[row][col].color) {
                    moves.push({ 
                        row: newRow, 
                        col: newCol, 
                        capture: target ? true : false 
                    });
                }
            }
        });
        
        // Castling
        const piece = this.board[row][col];
        if (!piece.hasMoved && !this.isInCheck(piece.color)) {
            // Kingside castling
            if (this.canCastle(piece.color, 'kingside')) {
                moves.push({ row: row, col: col + 2, castle: 'kingside' });
            }
            // Queenside castling
            if (this.canCastle(piece.color, 'queenside')) {
                moves.push({ row: row, col: col - 2, castle: 'queenside' });
            }
        }
        
        return moves;
    }
    
    getLinearMoves(row, col, directions) {
        const moves = [];
        const piece = this.board[row][col];
        
        directions.forEach(([dr, dc]) => {
            for (let i = 1; i < 8; i++) {
                const newRow = row + dr * i;
                const newCol = col + dc * i;
                
                if (!this.isInBounds(newRow, newCol)) break;
                
                const target = this.board[newRow][newCol];
                if (!target) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (target.color !== piece.color) {
                        moves.push({ row: newRow, col: newCol, capture: true });
                    }
                    break;
                }
            }
        });
        
        return moves;
    }
    
    isValidMove(fromRow, fromCol, toRow, toCol) {
        return this.validMoves.some(move => move.row === toRow && move.col === toCol);
    }
    
    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const target = this.board[toRow][toCol];
        const move = this.validMoves.find(m => m.row === toRow && m.col === toCol);
        
        // Record move for history
        const moveNotation = this.getMoveNotation(fromRow, fromCol, toRow, toCol, piece, target, move);
        
        // Handle captures
        if (target) {
            this.capturedPieces[this.currentPlayer === 'white' ? 'black' : 'white'].push(target);
        }
        
        // Handle en passant capture
        if (move && move.enPassant) {
            const capturedPawnRow = piece.color === 'white' ? toRow + 1 : toRow - 1;
            const capturedPawn = this.board[capturedPawnRow][toCol];
            this.capturedPieces[this.currentPlayer === 'white' ? 'black' : 'white'].push(capturedPawn);
            this.board[capturedPawnRow][toCol] = null;
        }
        
        // Handle castling
        if (move && move.castle) {
            const rookCol = move.castle === 'kingside' ? 7 : 0;
            const newRookCol = move.castle === 'kingside' ? 5 : 3;
            const rook = this.board[fromRow][rookCol];
            this.board[fromRow][newRookCol] = rook;
            this.board[fromRow][rookCol] = null;
            rook.hasMoved = true;
        }
        
        // Make the move
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        piece.hasMoved = true;
        
        // Update king position
        if (piece.type === 'king') {
            this.kingPositions[piece.color] = { row: toRow, col: toCol };
        }
        
        // Set en passant target
        this.enPassantTarget = null;
        if (piece.type === 'pawn' && Math.abs(toRow - fromRow) === 2) {
            this.enPassantTarget = { row: (fromRow + toRow) / 2, col: toCol };
        }
        
        // Check for pawn promotion
        if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
            this.handlePawnPromotion(toRow, toCol);
            return;
        }
        
        // Add move to history
        this.moveHistory.push(moveNotation);
        
        // Switch turns
        this.switchTurn();
        
        // Check for game end conditions
        this.checkGameEnd();
        
        // Update display
        this.renderBoard();
        this.updateDisplay();
    }
    
    switchTurn() {
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        
        // If it's AI's turn and game mode is human vs AI
        if (this.gameMode === 'human-vs-ai' && this.currentPlayer === 'black' && !this.gameOver) {
            this.updateGameStatus('Computer is thinking...');
            setTimeout(() => this.makeAIMove(), 1000);
        }
        
        this.updateDisplay();
    }
    
    makeAIMove() {
        if (this.aiThinking || this.gameOver) return;
        
        this.aiThinking = true;
        
        // Get all valid moves for AI (black)
        const possibleMoves = this.getAllValidMovesForColor('black');
        
        if (possibleMoves.length > 0) {
            // Simple AI: choose a random move with slight preference for captures
            let bestMove = possibleMoves[0];
            
            // Prefer captures
            const captureMoves = possibleMoves.filter(move => {
                const target = this.board[move.to.row][move.to.col];
                return target && target.color === 'white';
            });
            
            if (captureMoves.length > 0 && this.aiDifficulty !== 'easy') {
                bestMove = captureMoves[Math.floor(Math.random() * captureMoves.length)];
            } else {
                // For easy mode or when no captures, pick randomly
                bestMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            }
            
            // Make the AI move
            setTimeout(() => {
                this.makeMove(bestMove.from.row, bestMove.from.col, bestMove.to.row, bestMove.to.col);
                this.aiThinking = false;
                this.updateGameStatus("Your turn!");
            }, 500);
        } else {
            this.aiThinking = false;
        }
    }
    
    getAllValidMovesForColor(color) {
        const moves = [];
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    const validMoves = this.getValidMoves(row, col);
                    validMoves.forEach(move => {
                        moves.push({
                            from: { row, col },
                            to: { row: move.row, col: move.col }
                        });
                    });
                }
            }
        }
        
        return moves;
    }
    
    isInBounds(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
    
    isInCheck(color) {
        const kingPos = this.kingPositions[color];
        const opponentColor = color === 'white' ? 'black' : 'white';
        
        // Check if any opponent piece can capture the king
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === opponentColor) {
                    const moves = this.getPieceAttacks(row, col);
                    if (moves.some(move => move.row === kingPos.row && move.col === kingPos.col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    getPieceAttacks(row, col) {
        const piece = this.board[row][col];
        if (!piece) return [];
        
        // Similar to getValidMoves but without check filtering
        switch (piece.type) {
            case 'pawn':
                return this.getPawnAttacks(row, col);
            case 'rook':
                return this.getRookMoves(row, col);
            case 'knight':
                return this.getKnightMoves(row, col);
            case 'bishop':
                return this.getBishopMoves(row, col);
            case 'queen':
                return this.getQueenMoves(row, col);
            case 'king':
                return this.getKingAttacks(row, col);
            default:
                return [];
        }
    }
    
    getPawnAttacks(row, col) {
        const attacks = [];
        const piece = this.board[row][col];
        const direction = piece.color === 'white' ? -1 : 1;
        
        for (let dc of [-1, 1]) {
            const newRow = row + direction;
            const newCol = col + dc;
            if (this.isInBounds(newRow, newCol)) {
                attacks.push({ row: newRow, col: newCol });
            }
        }
        
        return attacks;
    }
    
    getKingAttacks(row, col) {
        const attacks = [];
        const kingMoves = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        kingMoves.forEach(([dr, dc]) => {
            const newRow = row + dr;
            const newCol = col + dc;
            if (this.isInBounds(newRow, newCol)) {
                attacks.push({ row: newRow, col: newCol });
            }
        });
        
        return attacks;
    }
    
    wouldBeInCheck(fromRow, fromCol, toRow, toCol) {
        // Make temporary move
        const piece = this.board[fromRow][fromCol];
        const target = this.board[toRow][toCol];
        const originalKingPos = { ...this.kingPositions[piece.color] };
        
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        if (piece.type === 'king') {
            this.kingPositions[piece.color] = { row: toRow, col: toCol };
        }
        
        const inCheck = this.isInCheck(piece.color);
        
        // Restore board
        this.board[fromRow][fromCol] = piece;
        this.board[toRow][toCol] = target;
        this.kingPositions[piece.color] = originalKingPos;
        
        return inCheck;
    }
    
    canCastle(color, side) {
        if (!this.castlingRights[color][side]) return false;
        
        const row = color === 'white' ? 7 : 0;
        const kingCol = 4;
        const rookCol = side === 'kingside' ? 7 : 0;
        const squares = side === 'kingside' ? [5, 6] : [1, 2, 3];
        
        // Check if rook is in place and hasn't moved
        const rook = this.board[row][rookCol];
        if (!rook || rook.type !== 'rook' || rook.hasMoved) return false;
        
        // Check if squares between king and rook are empty
        for (let col of squares) {
            if (this.board[row][col]) return false;
        }
        
        // Check if king would pass through or end up in check
        const checkSquares = side === 'kingside' ? [4, 5, 6] : [2, 3, 4];
        for (let col of checkSquares) {
            if (this.wouldBeInCheck(row, kingCol, row, col)) return false;
        }
        
        return true;
    }
    
    handlePawnPromotion(row, col) {
        const piece = this.board[row][col];
        this.showPromotionModal(piece.color, (promotionType) => {
            this.board[row][col].type = promotionType;
            this.renderBoard();
            this.switchTurn();
            this.checkGameEnd();
            this.updateDisplay();
        });
    }
    
    showPromotionModal(color, callback) {
        const modal = document.getElementById('promotion-modal');
        const piecesContainer = document.getElementById('promotion-pieces');
        
        piecesContainer.innerHTML = '';
        
        const promotionOptions = ['queen', 'rook', 'bishop', 'knight'];
        promotionOptions.forEach(type => {
            const piece = document.createElement('span');
            piece.className = `promotion-piece ${color}`;
            piece.textContent = this.pieces[color][type];
            piece.addEventListener('click', () => {
                modal.classList.add('hidden');
                callback(type);
            });
            piecesContainer.appendChild(piece);
        });
        
        modal.classList.remove('hidden');
    }
    
    checkGameEnd() {
        const opponentColor = this.currentPlayer;
        const hasValidMoves = this.hasValidMoves(opponentColor);
        const inCheck = this.isInCheck(opponentColor);
        
        if (!hasValidMoves) {
            if (inCheck) {
                // Checkmate
                const winner = opponentColor === 'white' ? 'black' : 'white';
                this.endGame(`Checkmate! ${winner.charAt(0).toUpperCase() + winner.slice(1)} wins!`);
            } else {
                // Stalemate
                this.endGame('Stalemate! It\'s a draw.');
            }
        } else if (inCheck) {
            this.highlightCheck(opponentColor);
            this.updateGameStatus(`${opponentColor.charAt(0).toUpperCase() + opponentColor.slice(1)} is in check!`);
        }
    }
    
    hasValidMoves(color) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    const moves = this.getValidMoves(row, col);
                    if (moves.length > 0) return true;
                }
            }
        }
        return false;
    }
    
    highlightCheck(color) {
        const kingPos = this.kingPositions[color];
        const square = document.querySelector(`[data-row="${kingPos.row}"][data-col="${kingPos.col}"]`);
        square.classList.add('in-check');
        
        setTimeout(() => {
            square.classList.remove('in-check');
        }, 3000);
    }
    
    endGame(message) {
        this.gameOver = true;
        this.stopGameTimer();
        this.showGameOverModal(message);
    }
    
    showGameOverModal(message) {
        const modal = document.getElementById('game-over-modal');
        const resultElement = document.getElementById('game-result');
        const messageElement = document.getElementById('game-message');
        
        resultElement.textContent = 'Game Over!';
        messageElement.textContent = message;
        modal.classList.remove('hidden');
    }
    
    getMoveNotation(fromRow, fromCol, toRow, toCol, piece, target, move) {
        const files = 'abcdefgh';
        const fromSquare = files[fromCol] + (8 - fromRow);
        const toSquare = files[toCol] + (8 - toRow);
        
        let notation = '';
        
        if (move && move.castle) {
            notation = move.castle === 'kingside' ? 'O-O' : 'O-O-O';
        } else {
            if (piece.type !== 'pawn') {
                notation += this.pieces[piece.color][piece.type];
            }
            
            if (target || (move && move.enPassant)) {
                if (piece.type === 'pawn') {
                    notation += files[fromCol];
                }
                notation += 'x';
            }
            
            notation += toSquare;
            
            if (move && move.enPassant) {
                notation += ' e.p.';
            }
        }
        
        return notation;
    }
    
    startGameTimer() {
        this.gameTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            document.getElementById('game-time').textContent = `${minutes}:${seconds}`;
        }, 1000);
    }
    
    stopGameTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }
    
    updateDisplay() {
        this.updateTurnIndicator();
        this.updateMoveHistory();
        this.updateCapturedPieces();
        this.updateMoveCount();
        this.updateGameStatus();
    }
    
    updateGameStatus(customMessage = null) {
        const statusElement = document.getElementById('game-status');
        if (statusElement) {
            if (customMessage) {
                statusElement.textContent = customMessage;
            } else if (this.gameOver) {
                statusElement.textContent = this.gameOverMessage || 'Game Over';
            } else {
                const playerName = this.gameMode === 'human-vs-ai' && this.currentPlayer === 'black' 
                    ? 'Computer' 
                    : this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1);
                statusElement.textContent = `${playerName}'s turn`;
            }
        }
    }
    
    updateTurnIndicator() {
        const turnElement = document.getElementById('current-turn');
        turnElement.textContent = `${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)}'s Turn`;
    }
    
    updateGameStatus(message = 'Game in progress') {
        document.getElementById('game-status').textContent = message;
    }
    
    updateMoveHistory() {
        const movesList = document.getElementById('moves-list');
        movesList.innerHTML = '';
        
        for (let i = 0; i < this.moveHistory.length; i += 2) {
            const moveNumber = Math.floor(i / 2) + 1;
            const whiteMove = this.moveHistory[i] || '';
            const blackMove = this.moveHistory[i + 1] || '';
            
            const moveEntry = document.createElement('div');
            moveEntry.className = 'move-entry';
            moveEntry.innerHTML = `
                <span class="move-number">${moveNumber}.</span> 
                ${whiteMove} ${blackMove}
            `;
            movesList.appendChild(moveEntry);
        }
        
        movesList.scrollTop = movesList.scrollHeight;
    }
    
    updateCapturedPieces() {
        const whiteCaptured = document.querySelector('#captured-white .pieces-container');
        const blackCaptured = document.querySelector('#captured-black .pieces-container');
        
        whiteCaptured.innerHTML = '';
        blackCaptured.innerHTML = '';
        
        this.capturedPieces.white.forEach(piece => {
            const pieceElement = document.createElement('span');
            pieceElement.className = `captured-piece ${piece.color}`;
            pieceElement.textContent = this.pieces[piece.color][piece.type];
            whiteCaptured.appendChild(pieceElement);
        });
        
        this.capturedPieces.black.forEach(piece => {
            const pieceElement = document.createElement('span');
            pieceElement.className = `captured-piece ${piece.color}`;
            pieceElement.textContent = this.pieces[piece.color][piece.type];
            blackCaptured.appendChild(pieceElement);
        });
    }
    
    updateMoveCount() {
        document.getElementById('move-count').textContent = Math.floor(this.moveHistory.length / 2);
    }
    
    bindEvents() {
        // New game button
        document.getElementById('new-game-btn').addEventListener('click', () => this.newGame());
        document.getElementById('new-game-modal-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.add('hidden');
            this.newGame();
        });
        
        // Close modal button
        document.getElementById('close-modal-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.add('hidden');
        });
        
        // Rules modal
        document.getElementById('rules-btn').addEventListener('click', () => {
            document.getElementById('rules-modal').classList.remove('hidden');
        });
        
        document.getElementById('close-rules').addEventListener('click', () => {
            document.getElementById('rules-modal').classList.add('hidden');
        });
        
        // Undo move (simplified - just restart for now)
        document.getElementById('undo-btn').addEventListener('click', () => {
            if (this.moveHistory.length > 0) {
                // For simplicity, just show a message
                alert('Undo feature coming soon! Use "New Game" to restart.');
            }
        });
        
        // Close modals on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }
    
    newGame() {
        this.stopGameTimer();
        this.gameOver = false;
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.validMoves = [];
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.castlingRights = {
            white: { kingside: true, queenside: true },
            black: { kingside: true, queenside: true }
        };
        this.enPassantTarget = null;
        this.kingPositions = { white: { row: 7, col: 4 }, black: { row: 0, col: 4 } };
        this.gameStartTime = Date.now();
        
        this.initializeBoard();
        this.renderBoard();
        this.updateDisplay();
        this.updateGameStatus('Game in progress');
        this.startGameTimer();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.chessGameInstance = new ChessGame();
});

// Expose ChessGame class globally for enhanced features
window.ChessGame = ChessGame;