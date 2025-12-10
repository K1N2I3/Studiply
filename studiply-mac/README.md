# Studiply Mac App

A lightweight menu bar app for Studiply Focus Mode on macOS.

## Features

- 🍅 **Focus Timer** - Pomodoro, Short Break, Long Break, Deep Work sessions
- 📊 **Progress Tracking** - Track your daily sessions and streak
- 🔔 **Native Notifications** - Get notified when sessions complete
- 🔥 **Streak Counter** - Stay motivated with your daily streak
- 🔗 **Firebase Integration** - Sync with your Studiply account

## Tech Stack

- **Tauri** - Lightweight desktop app framework (~10-20MB)
- **React** - Frontend UI
- **Rust** - Backend for system integration
- **Firebase** - User data and authentication

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/tools/install)
- [Xcode](https://developer.apple.com/xcode/) (for macOS development)

### Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

## Building

```bash
# Create production build
npm run tauri build
```

The built app will be in `src-tauri/target/release/bundle/`.

## Project Structure

```
studiply-mac/
├── src/                    # React frontend
│   ├── App.jsx            # Main app component
│   ├── App.css            # Styles
│   ├── firebase/          # Firebase config
│   └── services/          # API services
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── main.rs        # Entry point
│   │   └── lib.rs         # Core logic
│   └── tauri.conf.json    # Tauri config
└── package.json
```

## License

MIT
