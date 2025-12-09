import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { PlayerContext } from "../context/PlayerContext";
import { FaSearch, FaSpinner, FaPlay } from "react-icons/fa";

// --- Helper Components for Displaying Search Results ---

// Generic card for Albums, Artists, Playlists
const ResultCard = React.memo(({ item, type, onCardClick }) => {
  
  const imageUrl = item.image && item.image.length > 0
    ? item.image[item.image.length - 1].url
    : `https://placehold.co/170x170/333333/FFFFFF?text=${type.toUpperCase()}`;

  return (
    <div
      className="bg-[#111] hover:bg-[#1c1c1c] transition duration-300 rounded-lg overflow-hidden p-3 cursor-pointer w-full max-w-[170px] hover:scale-105 flex flex-col items-center text-center"
      onClick={() => onCardClick(item, type)} // Pass item and type on click
    >
      <img
        src={imageUrl}
        alt={item.title || item.name || "Result"}
        className="w-full h-[170px] rounded-md object-cover mb-3"
        loading="lazy"
      />
      <h3 className="font-bold text-sm text-white truncate w-full px-1">
        {item.title || item.name}
      </h3>
      <p className="text-xs text-gray-400 truncate w-full px-1">
        {item.description || item.artist || item.primaryArtists || type}
      </p>
    </div>
  );
});

// Card specifically for Songs from search results, integrates with PlayerContext
const SongResultCard = React.memo(({ songData, onCardClick }) => {
  const { cleanTitle } = useContext(PlayerContext);
  
  const imageUrl = songData.image && songData.image.length > 0
    ? songData.image[songData.image.length - 1].url
    : `https://placehold.co/170x170/333333/FFFFFF?text=Song`;

  return (
    <div className="relative w-full group bg-[#111] hover:bg-[#1c1c1c] transition duration-300 rounded-lg overflow-hidden p-3 cursor-pointer w-full max-w-[170px] hover:scale-105">
      {/* Album Art */}
      <div className="relative w-full h-[170px] rounded-md overflow-hidden">
        <img
          src={imageUrl}
          alt={songData.title}
          className="object-cover w-full h-full rounded-md"
          loading="lazy"
        />

        {/* Play Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300"
          onClick={() => onCardClick(songData, 'song')} // Pass songData and type on click
        >
          <div className="bg-green-500 p-3 rounded-full text-white">
            <FaPlay className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Title & Artist */}
      <div className="mt-3 text-white text-center">
        <h3 className="font-bold text-sm truncate">{cleanTitle(songData?.title || songData?.name)}</h3>
        <p className="text-xs text-gray-400 truncate">{songData.artists.primary[0].name || "Unknown Artist"}</p>
      </div>
    </div>
  );
});

// --- Main Explore Page Component ---

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All"); // All, Songs, Albums, Artists, Playlists
  const [searchResults, setSearchResults] = useState({
    albums: [],
    songs: [],
    artists: [],
    playlists: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { playSong, setQueue, cleanTitle, searchHistory, addToSearchHistory, removeFromSearchHistory } = useContext(PlayerContext);

  // Debounced search function
  const fetchSearchResults = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults({ albums: [], songs: [], artists: [], playlists: [] });
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Fetch all categories in parallel for efficiency
      const [songsRes, albumsRes, artistsRes, playlistsRes] = await Promise.all([
        axios.get(`https://saavanapi-mu.vercel.app/api/search/songs?query=${encodeURIComponent(query)}`),
        axios.get(`https://saavanapi-mu.vercel.app/api/search/albums?query=${encodeURIComponent(query)}`),
        axios.get(`https://saavanapi-mu.vercel.app/api/search/artists?query=${encodeURIComponent(query)}`),
        axios.get(`https://saavanapi-mu.vercel.app/api/search/playlists?query=${encodeURIComponent(query)}`),
      ]);

      setSearchResults({
        songs: songsRes.data?.data?.results || [],
        albums: albumsRes.data?.data?.results || [],
        artists: artistsRes.data?.data?.results || [],
        playlists: playlistsRes.data?.data?.results || [],
      });
      
      // Add to history only if results are found and it's a new search (simple check)
      // Moving addToSearchHistory to onBlur or Enter key might be better to avoid spamming history while typing
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to fetch search results. Please try again.");
      setSearchResults({ albums: [], songs: [], artists: [], playlists: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for debouncing the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSearchResults(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, fetchSearchResults]);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      addToSearchHistory(searchQuery.trim());
    }
  };

  const handleHistoryClick = (query) => {
    setSearchQuery(query);
  };

  // Function to handle click on any search result card
  const handleCardClick = useCallback(async (item, type) => {
    setLoading(true); // Show loading while fetching full details
    try {
      let songsToPlay = [];
      let songToStart = null;

      if (type === 'song') {
        songToStart = {
          id: item.id,
          title: item.title || item.name,
          artist: item.primaryArtists || item.artists.primary[0].name || "Unknown Artist",
          album: item.album || "Unknown Album",
          image: item.image?.[2]?.url,
          url: item.downloadUrl?.[4]?.url,
        };
        songsToPlay = [songToStart];
      } else if (type === 'album') {
        const albumDetailsRes = await axios.get(`https://saavanapi-mu.vercel.app/api/albums?link=${encodeURIComponent(item.url)}`);
        const albumSongs = albumDetailsRes.data?.data?.songs || [];
        songsToPlay = albumSongs.map(s => ({
          id: s.id,
          title: s.name,
          artist: s.artists?.primary?.[0]?.name || "Unknown Artist",
          album: s.album?.name || "Unknown Album",
          image: s.image?.[2]?.url,
          url: s.downloadUrl?.[4]?.url,
        }));
        songToStart = songsToPlay.length > 0 ? songsToPlay[0] : null;
      } else if (type === 'playlist') {
        const playlistDetailsRes = await axios.get(`https://saavanapi-mu.vercel.app/api/playlists?link=${encodeURIComponent(item.url)}&limit=20`);
        const playlistSongs = playlistDetailsRes.data?.data?.songs || [];
        songsToPlay = playlistSongs.map(s => ({
          id: s.id,
          title: s.name,
          artist: s.artists?.primary?.[0]?.name || "Unknown Artist",
          album: s.album?.name || "Unknown Album",
          image: s.image?.[2]?.url,
          url: s.downloadUrl?.[4]?.url,
        }));
        songToStart = songsToPlay.length > 0 ? songsToPlay[0] : null;
      } else if (type === 'artist') {
        console.warn("Playing artist's songs is not directly supported.");
        setError("Cannot play artist's songs directly. API limitation.");
        setLoading(false);
        return;
      }

      if (songToStart && songsToPlay.length > 0) {
        setQueue(songsToPlay);
        playSong(songToStart);
        // Add to history when a result is clicked/played
        if (searchQuery.trim()) {
            addToSearchHistory(searchQuery.trim());
        }
      } else {
        setError("No playable content found for this selection.");
      }
    } catch (err) {
      console.error("Error playing content from search:", err);
      setError("Failed to load content for playback. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [playSong, setQueue, addToSearchHistory, searchQuery]);

  // Helper to render a section of results
  const renderResultsSection = (title, items, CardComponent, type) => {
    if (!items || items.length === 0) return null;
    if (activeFilter !== "All" && activeFilter !== title) return null;

    return (
      <section className="mb-8">
        <h2 className="text-white text-2xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item) => (
            <CardComponent
              key={item.id || item.title || item.name}
              item={item}
              type={type}
              songData={item}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      </section>
    );
  };

  const genres = [
    { name: "Pop", color: "bg-pink-500" },
    { name: "Rock", color: "bg-red-500" },
    { name: "Hip Hop", color: "bg-orange-500" },
    { name: "Electronic", color: "bg-teal-500" },
    { name: "Indie", color: "bg-purple-500" },
    { name: "R&B", color: "bg-blue-500" },
    { name: "Classical", color: "bg-yellow-600" },
    { name: "Jazz", color: "bg-indigo-500" },
  ];

  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white pb-24 md:pb-8 mb-20">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md py-4 -mx-4 px-4 md:-mx-8 md:px-8 mb-2">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search for songs, albums, artists, or playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            className="w-full p-3 pl-10 rounded-full bg-[#1c1c1c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Filters */}
        {searchQuery.trim() && (
          <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
            {["All", "Songs", "Albums", "Artists", "Playlists"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-white text-black"
                    : "bg-[#1c1c1c] text-white hover:bg-[#2a2a2a]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <FaSpinner className="animate-spin text-green-500 text-4xl" />
          <p className="ml-3 text-lg">Searching...</p>
        </div>
      )}
      {error && (
        <div className="text-red-500 text-center text-lg mt-4">{error}</div>
      )}

      {/* Search History & Genres (When no query) */}
      {!searchQuery.trim() && !loading && (
        <div className="max-w-5xl mx-auto">
          {/* Search History */}
          {searchHistory.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl font-bold">Recent Searches</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {searchHistory.map((query, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-2 bg-[#1c1c1c] hover:bg-[#2a2a2a] px-4 py-2 rounded-full cursor-pointer transition-colors"
                    onClick={() => handleHistoryClick(query)}
                  >
                    <span className="text-sm text-gray-200">{query}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromSearchHistory(query);
                      }}
                      className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Browse All / Genres */}
          <section>
            <h2 className="text-white text-2xl font-bold mb-6">Browse All</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {genres.map((genre) => (
                <div
                  key={genre.name}
                  className={`${genre.color} h-32 rounded-xl p-4 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
                  onClick={() => setSearchQuery(genre.name)}
                >
                  <h3 className="text-white text-xl font-bold">{genre.name}</h3>
                  {/* Decorative circle */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full transform rotate-12" />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && searchQuery.trim() &&
        Object.values(searchResults).every(arr => arr.length === 0) && (
          <div className="text-center text-gray-400 mt-12">
            <p className="text-xl">No results found for "{searchQuery}"</p>
            <p className="text-sm mt-2">Please make sure your words are spelled correctly or use less or different keywords.</p>
          </div>
        )}

      {/* Search Results Display */}
      {!loading && !error && searchQuery.trim() && (
        <div className="mt-4 space-y-8">
          {renderResultsSection("Songs", searchResults.songs, SongResultCard, "song")}
          {renderResultsSection("Playlists", searchResults.playlists, ResultCard, "playlist")}
          {renderResultsSection("Albums", searchResults.albums, ResultCard, "album")}
          {renderResultsSection("Artists", searchResults.artists, ResultCard, "artist")}
        </div>
      )}
    </div>
  );
};

export default Explore;
