# 🎴 UNO Card Game

A fully functional web-based UNO card game built with HTML, CSS, and JavaScript. Play against the computer with all the classic UNO rules and special cards!

## 🎮 Live Demo

**[Play UNO Online](https://YOUR_USERNAME.github.io/uno-card-game/)**

## ✨ Features

### Core Gameplay
- ✅ Complete UNO deck with 108 cards
- ✅ All standard UNO rules implemented
- ✅ Player vs Computer gameplay
- ✅ Color and number matching
- ✅ Special action cards (Skip, Reverse, Draw 2)
- ✅ Wild cards (Wild, Wild Draw 4)
- ✅ UNO button and penalty system
- ✅ Automatic deck reshuffling

### Special Cards
- **Skip**: Next player loses their turn
- **Reverse**: Changes direction of play
- **Draw Two**: Next player draws 2 cards
- **Wild**: Change the color to any color
- **Wild Draw Four**: Change color and next player draws 4 cards

### Game Features
- 🎨 Beautiful, responsive design
- 📱 Mobile-friendly interface
- 🤖 Smart AI opponent
- 🔄 Card stacking for Draw 2 and Wild Draw 4
- 🎯 Visual indicators for playable cards
- 📊 Real-time game status updates
- 🏆 Win/lose detection
- 📖 Built-in rules explanation

## 🚀 How to Play

1. **Match the Card**: Play a card that matches the color or number of the top card
2. **Special Cards**: Use action cards strategically to gain advantage
3. **Wild Cards**: Change the color when you need to
4. **Call UNO**: Click "UNO!" when you have one card left (or face a penalty!)
5. **Win**: Be the first to get rid of all your cards

## 🛠️ Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling, animations, and responsive design
- **JavaScript (ES6+)**: Game logic and interactivity
- **Git**: Version control
- **GitHub Pages**: Free hosting and deployment

## 📁 Project Structure

```
uno-card-game/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # Game logic and functionality
└── README.md           # Project documentation
```

## 🎯 Game Rules

### Basic Rules
- Each player starts with 7 cards
- Match the top card by color, number, or symbol
- If you can't play, draw a card from the deck
- First player to empty their hand wins

### Special Cards Effects
- **Skip (24 cards)**: Next player loses turn
- **Reverse (24 cards)**: Reverses play direction
- **Draw Two (24 cards)**: Next player draws 2 cards
- **Wild (4 cards)**: Player chooses new color
- **Wild Draw Four (4 cards)**: Player chooses color, next player draws 4

### UNO Rules
- Must call "UNO" when you have one card left
- Penalty: Draw 2 cards if you forget to call UNO
- Can stack Draw 2 and Wild Draw 4 cards

## 🔧 Installation & Setup

### Option 1: Play Online
Just visit the [live demo](https://YOUR_USERNAME.github.io/uno-card-game/) and start playing!

### Option 2: Run Locally
1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/uno-card-game.git
   cd uno-card-game
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

## 🚀 Deployment

This game is deployed using GitHub Pages. To deploy your own version:

1. **Fork this repository**
2. **Go to Settings → Pages**
3. **Select "Deploy from a branch"**
4. **Choose "main" branch**
5. **Your game will be available at:** `https://YOUR_USERNAME.github.io/uno-card-game/`

## 🎨 Customization

### Easy Modifications
- **Colors**: Edit CSS color variables in `styles.css`
- **Card Design**: Modify the `.card` styles
- **AI Difficulty**: Adjust computer strategy in `computerTurn()` function
- **Game Rules**: Modify game logic in `script.js`

### Adding Features
- **Multiplayer**: Add WebSocket support for real-time multiplayer
- **Animations**: Enhance card animations with CSS/JS
- **Sound Effects**: Add audio feedback for card plays
- **Themes**: Create multiple visual themes
- **Tournament Mode**: Add multiple rounds and scoring

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Ideas for Contributions
- Add sound effects and music
- Implement online multiplayer
- Create different AI difficulty levels
- Add card animations and effects
- Implement tournament mode
- Add accessibility features
- Create mobile app version

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- UNO® is a trademark of Mattel, Inc.
- Inspired by the classic UNO card game
- Built with modern web technologies
- Thanks to the open-source community

## 📞 Contact

- **GitHub**: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- **Email**: your.email@example.com
- **Project Link**: [https://github.com/YOUR_USERNAME/uno-card-game](https://github.com/YOUR_USERNAME/uno-card-game)

---

**Enjoy playing UNO! 🎉**

*Don't forget to ⭐ star this repository if you enjoyed the game!*