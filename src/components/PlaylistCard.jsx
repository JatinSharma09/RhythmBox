import React from "react";
import { FaPlay } from "react-icons/fa";

const PlaylistCard = ({ playlist, compact = false, onClick, cleanTitle }) => {
    const handlePlaylistClick = (e) => {
        if (onClick) {
            onClick(playlist);
        }
    };

    const getCleanTitle = (name) => {
        return cleanTitle ? cleanTitle(name) : name;
    };

    if (compact) {
        return (
            <div
                className="flex items-center gap-3 p-2 rounded-xl bg-surface hover:bg-white/5 transition-colors cursor-pointer group"
                onClick={handlePlaylistClick}
            >
                {/* Small Thumbnail */}
                <img
                    src={playlist.image}
                    alt={playlist.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    loading="lazy"
                />

                {/* Playlist Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white text-sm truncate group-hover:text-primary transition-colors">
                        {getCleanTitle(playlist.name)}
                    </h3>
                    <p className="text-xs text-gray-400 truncate">{playlist.songCount} songs</p>
                </div>
            </div>
        );
    }

    // Horizontal Scroll item (for Home page desktop view)
    // Wait, the previous code had TWO types of desktop views: horizontal scroll in Home, and grid in Full Page.
    // I should probably support both or just handles the "Card" look.
    // The 'compact' prop in Playlists.jsx handles "Home Page View" (which matches CardGrid style?).
    // Let's look at Playlists.jsx again.
    // It has:
    // 1. Mobile Compact List (vertical) - handled above.
    // 2. Desktop Horizontal Scroll (horizontal) - used in Home.
    // 3. Full Grid - used in Playlists page.

    // To keep it simple, I might need another prop or style.
    // Let's assume this component handles the "Card" look (Square Image).

    return (
        <div
            className="relative group bg-surface hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300 rounded-xl overflow-hidden p-2.5 cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 h-full"
            onClick={handlePlaylistClick}
        >
            {/* Playlist Image */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg mb-2">
                <img
                    src={playlist.image}
                    alt={playlist.name}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <div className="bg-primary p-3 rounded-full text-white shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <FaPlay className="h-4 w-4 ml-0.5" />
                    </div>
                </div>
            </div>

            {/* Playlist Info */}
            <h3 className="font-semibold text-white text-sm truncate group-hover:text-primary transition-colors">
                {getCleanTitle(playlist.name)}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
                {playlist.songCount} songs
            </p>
        </div>
    );
};

export default React.memo(PlaylistCard);
