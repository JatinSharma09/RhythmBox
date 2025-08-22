# RhythmBox

RhythmBox is a **modern music streaming web application** built with React and Tailwind CSS. It provides a clean and interactive interface for streaming songs, managing queues, and enjoying music with a sleek fullscreen player.

## Features

* **Global Music Player** – Play, pause, skip, and control volume globally across the app.
* **Queue Management** – Add, remove, and view upcoming songs in the queue.
* **Fullscreen Player** – Immersive experience with transparent overlays and blurred backgrounds.
* **Modern UI** – Dark theme with accent colors, smooth transitions, and responsive design.
* **Search & Explore** – Fetch songs, albums, and playlists using JioSaavn API.
* **Responsive Design** – Works seamlessly on mobile, tablet, and desktop.

## Tech Stack

* **Frontend:** React (JavaScript), Tailwind CSS
* **State Management:** React Context API (Global Player Context)
* **API:** JioSaavn API (for fetching songs, albums, and playlists)

## Project Structure

```
├── README.md
├── index.html
├── public
|     ├── assets
|     |     ├── All Icons
├── src
|     ├── App.css
|     ├── App.jsx
|     ├── components
|     |     ├── Card.jsx
|     |     ├── Cardgrid.jsx
|     |     ├── FullScreenPlayer.jsx
|     |     ├── Navbar.jsx
|     |     ├── Player.jsx
|     |     ├── SearchBar.jsx
|     |     ├── Sidebar.jsx
|     ├── context
|     |     ├── AudioPlaybackStateContext.jsx
|     |     ├── PlayerContext.jsx
|     ├── data
|     |     ├── songs.js
|     ├── index.css
|     ├── main.jsx
|     ├── pages
|     |     ├── Explore.jsx
|     |     ├── Home.jsx
|     |     ├── NotFound.jsx
|     |     ├── Playlists.jsx
```
## Future Improvements

* User authentication and personalized playlists
* Offline playback mode
* Save and sync queues across devices
* Notifications for new releases

##
Built with passion for music – *Enjoy streaming with RhythmBox!*
