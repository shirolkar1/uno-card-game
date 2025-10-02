# ♔ Chess Game ♛

A fully functional web-based chess game built with HTML, CSS, and JavaScript. Features complete chess rules, beautiful UI, and all special moves including castling, en passant, and pawn promotion.

## 🎮 Live Demo

**[Play Chess Online](https://shirolkar1.github.io/chess-game/)**

## ✨ Features

### Complete Chess Implementation
- ✅ **Full Chess Rules** - All standard chess rules implemented
- ✅ **All Piece Movements** - King, Queen, Rook, Bishop, Knight, Pawn
- ✅ **Special Moves** - Castling, En Passant, Pawn Promotion
- ✅ **Check Detection** - Visual indicators when king is in check
- ✅ **Checkmate & Stalemate** - Proper game end detection
- ✅ **Move Validation** - Prevents illegal moves and checks
- ✅ **Two-Player Local** - Play against a friend on same device

### Special Chess Features
- **🏰 Castling** - Both kingside and queenside castling
- **👻 En Passant** - Special pawn capture move
- **👑 Pawn Promotion** - Choose Queen, Rook, Bishop, or Knight
- **🛡️ Check Protection** - Cannot move into check
- **⚡ Move Highlighting** - Visual indicators for valid moves
- **📝 Algebraic Notation** - Standard chess move notation

### Game Interface
- 🎨 **Beautiful Design** - Modern, clean interface
- 📱 **Responsive Layout** - Works on desktop, tablet, and mobile
- 🕐 **Game Timer** - Track game duration
- 📊 **Move History** - Complete record of all moves
- 🏆 **Captured Pieces** - Visual display of captured pieces
- 📋 **Game Status** - Real-time game state updates
- 📖 **Built-in Rules** - Complete chess rules reference

## 🎯 How to Play

### Basic Rules
1. **Objective**: Checkmate your opponent's king
2. **Turns**: White moves first, then players alternate
3. **Movement**: Click a piece to select, then click destination
4. **Capturing**: Move to opponent's square to capture
5. **Check**: When king is attacked, must get out of check
6. **Checkmate**: King in check with no escape = game over

### Piece Movements
- **♔ King**: One square in any direction
- **♕ Queen**: Any number of squares in any direction
- **♖ Rook**: Any number of squares horizontally or vertically
- **♗ Bishop**: Any number of squares diagonally
- **♘ Knight**: L-shape: 2 squares + 1 perpendicular
- **♙ Pawn**: Forward one square (two on first move), captures diagonally

### Special Moves
- **Castling**: King + Rook move simultaneously (conditions apply)
- **En Passant**: Special pawn capture after opponent's two-square pawn move
- **Pawn Promotion**: Pawn reaching end becomes Queen, Rook, Bishop, or Knight

## 🛠️ Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling, animations, and responsive design
- **JavaScript (ES6+)**: Game logic and interactivity
- **Unicode Chess Symbols**: Beautiful piece representation
- **CSS Grid**: Perfect board layout
- **Local Storage**: Game state persistence (coming soon)

## 📁 Project Structure

```
chess-game/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # Chess game logic
└── README.md           # Project documentation
```

## 🎮 Game Features

### Visual Feedback
- **Selected Piece**: Red border highlight
- **Valid Moves**: Green dots for empty squares
- **Capture Moves**: Red circles for enemy pieces
- **Check Warning**: Pulsing red background for king in check
- **Move History**: Scrollable list with algebraic notation

### Game Controls
- **New Game**: Start fresh game anytime
- **Move History**: Review all moves made
- **Captured Pieces**: See what you've captured
- **Game Timer**: Track how long you've been playing
- **Rules**: Built-in help for chess rules

## 🚀 Installation & Setup

### Option 1: Play Online
Just visit the [live demo](https://shirolkar1.github.io/chess-game/) and start playing!

### Option 2: Run Locally
1. **Clone the repository**
   ```bash
   git clone https://github.com/shirolkar1/chess-game.git
   cd chess-game
   ```

2. **Open in browser**
   ```bash
   # Option A: Using Python
   python -m http.server 8000
   
   # Option B: Using Node.js
   npx serve .
   
   # Option C: Just open index.html in your browser
   open index.html
   ```

3. **Start playing!**
   Navigate to `http://localhost:8000` (if using server) or just open the file directly.

## 🎯 Game Rules Reference

### Standard Rules
- **Check**: King under attack must move to safety
- **Checkmate**: King under attack with no legal moves
- **Stalemate**: No legal moves available (results in draw)
- **Castling**: King and rook special move (requires specific conditions)
- **En Passant**: Special pawn capture (must be used immediately)

### Win Conditions
- **Checkmate**: Opponent's king cannot escape attack
- **Resignation**: Opponent gives up (use New Game button)
- **Draw**: Stalemate, insufficient material, or agreement

## 🎨 Customization

### Easy Modifications
- **Board Colors**: Edit `.square.light` and `.square.dark` in CSS
- **Piece Symbols**: Change Unicode symbols in JavaScript `pieces` object
- **UI Colors**: Modify CSS color variables
- **Board Size**: Adjust grid dimensions in CSS

### Advanced Features (Future)
- **AI Opponent**: Computer player with different difficulty levels
- **Online Multiplayer**: Play against remote opponents
- **Game Analysis**: Move evaluation and suggestions
- **Themes**: Multiple visual themes
- **Save/Load**: Game state persistence

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Ideas for Contributions
- Add AI opponent with different difficulty levels
- Implement online multiplayer functionality
- Add move analysis and evaluation
- Create multiple visual themes
- Add sound effects and animations
- Implement PGN (Portable Game Notation) support
- Add game analysis features
- Create accessibility improvements

## 📊 Game Statistics

### Implementation Stats
- **Lines of Code**: ~1,200+ lines of JavaScript
- **Chess Rules**: 100% complete implementation
- **Special Moves**: All implemented (castling, en passant, promotion)
- **Move Validation**: Full legal move checking
- **Game States**: Check, checkmate, stalemate detection
- **UI Elements**: Responsive design for all screen sizes

### Features Coverage
- ✅ All piece movements
- ✅ Check/checkmate detection
- ✅ Castling (both sides)
- ✅ En passant capture
- ✅ Pawn promotion
- ✅ Move history tracking
- ✅ Visual move indicators
- ✅ Responsive design
- ✅ Game timer
- ✅ Captured pieces display

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Chess rules and piece movements based on FIDE standards
- Unicode chess symbols for beautiful piece representation
- Modern web technologies for smooth gameplay
- Open source community for inspiration and best practices

## 📞 Contact

- **GitHub**: [@shirolkar1](https://github.com/shirolkar1)
- **Project Link**: [https://github.com/shirolkar1/chess-game](https://github.com/shirolkar1/chess-game)

---

**Enjoy playing Chess! ♔♛**

*Don't forget to ⭐ star this repository if you enjoyed the game!*