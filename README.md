# 🐍 SnakeSats - Bitcoin Education Game

A modern twist on the classic Snake game that teaches Bitcoin investment best practices through engaging gameplay. Stack sats, avoid bad investment habits, and learn about Bitcoin while having fun!

## 🎮 Game Concept

SnakeSats combines nostalgic gameplay with Bitcoin education. Players control a snake that grows longer as it collects **sats** (satoshis). Along the way, players must **avoid bad investment habits** ("Don'ts") while safely navigating **Bitcoin best practices** ("Do's").

## 🚀 Features

### Core Gameplay
- **Classic Snake Mechanics**: Control a snake using arrow keys or WASD
- **Sat Collection**: Eat golden sats to grow and earn points
- **Educational Hazards**: Avoid red skulls representing bad investment habits
- **Safe Paths**: Pass through green checkmarks for bonus points and Bitcoin tips
- **Progressive Difficulty**: Speed increases as you level up

### Educational Content
- **Bitcoin Tips**: Real-time educational messages about Bitcoin best practices
- **Investment Lessons**: Learn about self-custody, DCA, and avoiding scams
- **Interactive Learning**: Game mechanics reinforce Bitcoin concepts

### Technical Features
- **Cross-Platform**: Works on desktop, mobile, and tablet
- **Touch Controls**: Swipe gestures for mobile devices
- **Local Storage**: Saves your best score
- **Responsive Design**: Adapts to different screen sizes
- **Modern UI**: Bitcoin-themed design with glowing effects

## 🎯 How to Play

### Controls
- **Desktop**: Arrow keys or WASD
- **Mobile**: Swipe in any direction

### Game Elements
- 🟡 **Golden Sats**: Collect these to grow your snake and earn 10 points
- ❌ **Red Skulls**: Avoid these bad investment habits (game over if hit)
- ✅ **Green Checkmarks**: Pass through these Bitcoin best practices for 5 bonus points

### Scoring
- **Sat Collection**: +10 points per sat
- **Good Practices**: +5 points for passing through green checkmarks
- **Level Progression**: Every 50 points increases your level and speed

## 🛠️ Installation & Setup

### Quick Start
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Click "Start Game" and begin playing!

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/snakesats.git
cd snakesats

# Open in your preferred web server
# For example, using Python:
python -m http.server 8000
# Then visit http://localhost:8000
```

### Deployment
The game is ready to deploy to any static hosting service:
- **GitHub Pages**: Push to a GitHub repository and enable Pages
- **Netlify**: Drag and drop the folder to Netlify
- **Vercel**: Connect your repository for automatic deployment
- **Itch.io**: Upload as a web game

## 🎨 Customization

### Adding New Bitcoin Tips
Edit the `bitcoinTips` array in `game.js`:
```javascript
this.bitcoinTips = [
    "Your new Bitcoin tip here!",
    // ... existing tips
];
```

### Modifying Game Difficulty
Adjust these values in the constructor:
```javascript
this.speed = 150;           // Initial speed (lower = faster)
this.speedIncrease = 10;    // Speed increase per level
```

### Changing Colors
Modify the CSS variables in `styles.css`:
```css
:root {
    --bitcoin-orange: #f7931a;
    --background-dark: #0f1419;
    --accent-blue: #8b9dc3;
}
```

## 📚 Educational Content

### Bitcoin Concepts Covered
- **Self-Custody**: "Not your keys, not your coins"
- **Dollar Cost Averaging (DCA)**: Regular, consistent investing
- **Cold Storage**: Keeping private keys offline
- **Scarcity**: Only 21 million Bitcoin will ever exist
- **Decentralization**: No single point of failure
- **Research**: "Verify, don't trust" principle

### Bad Investment Habits (Avoid These!)
- Trading on emotions (FOMO/FUD)
- Keeping coins on exchanges
- Falling for get-rich-quick schemes
- Investing without understanding
- Not doing your own research

## 🎮 Game Mechanics

### Snake Movement
- The snake moves continuously in the current direction
- Change direction using controls (cannot reverse directly)
- Snake grows when eating sats
- Game ends if snake hits walls, itself, or red skulls

### Object Generation
- **Sats**: Always one on screen, respawns when collected
- **Don'ts**: One red skull, respawns when avoided
- **Do's**: One green checkmark, respawns when passed through

### Level System
- **Level 1**: Introduction with slower speed
- **Level 2+**: Increasing speed and complexity
- **Speed Increase**: Snake moves faster each level
- **Visual Feedback**: Level up messages and animations

## 🔧 Technical Details

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Required Features**: HTML5 Canvas, Local Storage, Touch Events

### Performance
- **60 FPS**: Smooth gameplay on most devices
- **Responsive**: Adapts to different screen sizes
- **Lightweight**: No external dependencies

### File Structure
```
snakesats/
├── index.html      # Main HTML file
├── styles.css      # CSS styling and animations
├── game.js         # Game logic and mechanics
└── README.md       # This documentation
```

## 🎯 Future Enhancements

### Planned Features
- **Power-ups**: Ledger Shield (immunity), Lightning Dash (speed boost)
- **Leaderboards**: Integration with Nostr or Lightning addresses
- **Sound Effects**: Bitcoin-themed audio feedback
- **More Levels**: Boss levels with complex patterns
- **Achievements**: Unlockable badges and skins

### Monetization Ideas
- **Lightning Payments**: Pay for ad-free mode
- **Sats Rewards**: Earn real sats for high scores
- **Premium Features**: Advanced levels and customization

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Bugs**: Open an issue with detailed descriptions
2. **Suggest Features**: Propose new educational content or gameplay mechanics
3. **Code Contributions**: Submit pull requests for improvements
4. **Educational Content**: Help expand Bitcoin tips and lessons

### Development Guidelines
- Follow existing code style and structure
- Test on multiple devices and browsers
- Ensure educational content is accurate
- Keep the game accessible and fun

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Bitcoin Community**: For educational content and inspiration
- **Classic Snake Game**: For the timeless gameplay mechanics
- **Open Source Community**: For tools and libraries that made this possible

## 📞 Support

- **Issues**: Report bugs on GitHub
- **Discussions**: Join community discussions
- **Email**: Contact for business inquiries

---

**Remember**: This game is for educational purposes. Always do your own research and never invest more than you can afford to lose. Bitcoin is a long-term investment, not a get-rich-quick scheme.

**Stack sats, stay safe, and HODL! 🚀** 