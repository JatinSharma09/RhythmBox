# 🎵 RhythmBox

A modern, feature-rich music streaming web application built with React and powered by the JioSaavn API.

![RhythmBox](https://img.shields.io/badge/React-18.3-blue) ![Vite](https://img.shields.io/badge/Vite-7.2-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-4.1-cyan)

## ✨ Features

### 🎧 Core Playback
- **Advanced Audio Player** with play/pause, next/previous controls
- **Queue Management** with drag-and-drop reordering
- **Shuffle & Repeat** modes (off, all, one)
- **Playback Speed Control** (0.5x to 2x)
- **Crossfade** transitions between tracks
- **Volume Control** with persistent settings
- **Media Session API** - Control playback from your keyboard or lock screen
- **Keyboard Shortcuts** - `Space` (Play/Pause), `Arrows` (Seek/Volume), `M` (Mute)
- **PWA Support** - Installable on desktop and mobile, works offline

### 📚 User Features
- **Recently Played History** - Track your listening journey
- **Favorites/Liked Songs** - Save your favorite tracks
- **Custom Playlists** - Create and manage personal playlists
- **Share Functionality** - Copy song links to clipboard
- **Toast Notifications** - Sleek feedback for user actions

### 🔍 Discovery
- **Advanced Search** with filters (Songs, Albums, Artists, Playlists)
- **Search History** - Quick access to recent searches
- **Genre Browsing** - Explore music by genre (Pop, Rock, Hip Hop, etc.)
- **For You Page** - Personalized recommendations and daily mixes

### 🎨 Modern UI/UX
- **Glassmorphism Design** - Premium, modern aesthetic
- **Dark Mode** - Easy on the eyes
- **Responsive Layout** - Seamless experience on desktop and mobile
- **Smooth Animations** - Powered by Framer Motion
- **Custom Scrollbars** - Polished, integrated design

## 🛠️ Tech Stack

- **React 18.3** - UI library
- **Vite 7.2** - Build tool and dev server
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **@dnd-kit** - Drag and drop functionality
- **React Icons** - Icon library

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JatinSharma09/RhythmBox.git
   cd rhythmbox
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Deploy to Vercel

The project includes a `vercel.json` configuration for seamless deployment.

1.  Connect your GitHub repository to Vercel.
2.  Vercel will detect Vite and configure the build command automatically.
3.  Deploy!


## 📁 Project Structure

```
RhythmBox/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Card.jsx
│   │   ├── Player.jsx
│   │   ├── FullScreenPlayer.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Navbar.jsx
│   │   └── ErrorBoundary.jsx
│   ├── context/          # React Context providers
│   │   ├── PlayerContext.jsx
│   │   └── AudioPlaybackStateContext.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Explore.jsx
│   │   ├── ForYou.jsx
│   │   ├── Playlists.jsx
│   │   ├── History.jsx
│   │   ├── Favorites.jsx
│   │   └── NotFound.jsx
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── package.json
└── vite.config.js
```

## 🎯 Key Features Explained

### Queue Management
- Drag and drop songs to reorder the queue
- Visual feedback during drag operations
- Persistent queue state

### Data Persistence
All user data (history, favorites, playlists, search history) is stored in `localStorage` for a seamless experience across sessions.

### Responsive Design
- Desktop: Full sidebar with collapsible functionality
- Mobile: Bottom navigation bar with optimized touch targets
- Adaptive layouts for all screen sizes

## 🔧 Configuration

The app uses Tailwind CSS v4's new CSS-first configuration approach. Custom design tokens are defined in `src/index.css`:

```css
@theme {
  --color-background: #0F0F0F;
  --color-surface: #1F1F22;
  --color-primary: #22C55E;
  --color-secondary: #3B82F6;
  --color-accent: #8B5CF6;
  /* ... */
}
```

## 🐛 Known Issues

- Lint warnings for Tailwind v4 directives (`@theme`, `@utility`, `@apply`) are expected and do not affect functionality
- Gapless playback is not yet implemented

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Music data provided by [JioSaavn API](https://github.com/sumitkolhe/jiosaavn-api)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Fonts from [Google Fonts](https://fonts.google.com/)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ by Jatin Sharma**
