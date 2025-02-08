# AI Chess Clock

A modern, gesture-controlled chess clock that uses machine learning to detect hand movements for controlling player timers. Built with vanilla JavaScript, p5.js, and ml5.js for hand pose detection.

## Features

- 👋 Gesture control: Wave hands to switch timers
- ⏱️ Customizable time settings (1-30 minutes per player)
- 💾 Persistent player names with local storage
- 📹 Toggle-able camera feed
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔄 Real-time hand pose detection
- 📱 Mobile-friendly design

## Technologies Used

- HTML5
- JavaScript (ES6+)
- [p5.js](https://p5js.org/) for canvas handling
- [ml5.js](https://ml5js.org/) for hand pose detection
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Getting Started

### Prerequisites

- Modern web browser with webcam access
- Internet connection (for loading CDN resources)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-chess-clock.git
cd ai-chess-clock
```

2. Open `index.html` in a web browser or serve using a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js's http-server
npx http-server
```

## Usage

1. Allow camera access when prompted
2. (Optional) Set player names by clicking the edit icons
3. Adjust time using the slider (1-30 minutes per player)
4. Click "Start Game" to begin
5. Control the timer by waving your hands:
   - Player 1: Wave right hand to switch to Player 2
   - Player 2: Wave left hand to switch to Player 1
6. Use the "Reset" button to start over

### Camera Controls

- Click "Hide Camera" to hide the camera feed
- Click "Show Camera" to show the camera feed
- Camera preference is saved between sessions

### Player Names

- Click the edit icon next to player names to change them
- Names are saved in local storage
- Use "Clear Saved Names" to reset to defaults

## Browser Support

Tested and working on:
- Chrome (recommended)
- Firefox
- Edge
- Safari

## Privacy Note

The hand detection runs entirely in your browser - no video data is sent to any server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Hand pose detection powered by [MediaPipe](https://mediapipe.dev/)
- UI design inspired by modern chess applications
- Thanks to the p5.js and ml5.js communities