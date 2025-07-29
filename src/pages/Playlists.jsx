import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { PlayerContext } from '../context/PlayerContext'; // Adjust path as needed
import { FaSpinner } from 'react-icons/fa'; // For loading icon

// Helper component for a single playlist card
const PlaylistCard = React.memo(({ playlist, onPlaylistClick }) => {
  // console.log("Playlist Card Rendered");
  // Ensure we get a good quality image, fallback to placeholder
  const imageUrl = playlist.image && playlist.image.length > 0
    ? playlist.image[playlist.image.length - 1].url // Get the largest available image
    : `https://placehold.co/170x170/333333/FFFFFF?text=Playlist`;

  return (
    <div
      className="bg-[#111] hover:bg-[#1c1c1c] transition duration-300 rounded-lg overflow-hidden p-3 cursor-pointer w-full max-w-[170px] hover:scale-105 flex flex-col items-center text-center"
      onClick={() => onPlaylistClick(playlist)}
    >
      <img
        src={imageUrl}
        alt={playlist.name || playlist.title}
        className="w-full h-[170px] rounded-md object-cover mb-3"
      />
      <h3 className="font-bold text-sm text-white truncate w-full px-1">
        {playlist.name || playlist.title}
      </h3>
      <p className="text-xs text-gray-400 truncate w-full px-1">
        {playlist.language || playlist.description || 'Playlist'}
      </p>
    </div>
  );
});

const Playlists = ({className}) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Access playSong and setQueue from PlayerContext
  const { playSong, setQueue, queue, cleanTitle } = useContext(PlayerContext);

  // Define the list of playlist names to search for
  const playListNames = ['most-searched-songs-hindi', 'monsoon', 'Top 50', 'viralnation', 'taaza-tunes','badshah', 'lets-play-arijit-singh-hindi', 'bhojpuri hits', 'bhakti','indie pop', '90s', '80s'];

  // Function to fetch all playlists
  const fetchPlaylists = useCallback(async () => {
    setLoading(true);
    setError(null);
    const fetchedPlaylistsData = [];

    for (const name of playListNames) {
      try {
        // Step 1: Search for the playlist to get its full URL/link
        const searchResponse = await axios.get(`https://saavanapi-mu.vercel.app/api/search?query=${encodeURIComponent(name)}`);
        const playlistResult = searchResponse.data?.data?.playlists?.results?.[0]; // Get the first playlist result

        if (playlistResult && playlistResult.url) {
          // Step 2: Fetch the actual playlist details (songs) using the link
          const playlistContentResponse = await axios.get(`https://saavanapi-mu.vercel.app/api/playlists?link=${encodeURIComponent(playlistResult.url)}&limit=50`);
          const fullPlaylistData = playlistContentResponse.data?.data;

          if (fullPlaylistData && fullPlaylistData.songs) {
            fetchedPlaylistsData.push({
              id: playlistResult.id,
              title: playlistResult.title,
              name: playlistResult.name || playlistResult.title,
              image: playlistResult.image,
              language: playlistResult.language,
              url: playlistResult.url,
              songs: fullPlaylistData.songs, // Store the actual songs for later playback
            });
          }
        }
      } catch (err) {
        console.error(`Failed to fetch playlist for "${name}":`, err);
      }
    }
    setPlaylists(fetchedPlaylistsData);
    setLoading(false);
  }, []);

  // Effect to run the fetch function on component mount
  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  // Handler for when a playlist card is clicked
  const handlePlaylistClick = useCallback((playlist) => {
    // console.log(playlist);
    
    if (playlist.songs && playlist.songs.length > 0) {
      // 1. Set the entire playlist's songs as the new queue in PlayerContext
      
      setQueue(playlist.songs.map(song => ({
        id: song.id,
        title: song.name, // Use 'name' from API response for queue
        artist: song.artists?.primary?.[0]?.name || "Unknown Artist",
        album: song.album?.name || "Unknown Album",
        image: song.image?.[2]?.url,
        url: song.downloadUrl?.[4]?.url,
      })));

      // 2. Start playing the first song of the playlist
      // The playSong function will automatically find its index in the newly set queue
      playSong({
        id: playlist.songs[0].id,
        title: playlist.songs[0].name,
        artist: playlist.songs[0].artists?.primary?.[0]?.name || "Unknown Artist",
        album: playlist.songs[0].album?.name || "Unknown Album",
        image: playlist.songs[0].image?.[2]?.url,
        url: playlist.songs[0].downloadUrl?.[4]?.url,
      });
    } else {
      console.warn(`Playlist "${playlist.name}" has no songs to play.`);
    }
  }, [setQueue, playSong]); // Dependencies from context
  // console.log(queue);
  

  return (
    <div className="p-4 md:p-8 bg-black h-[130vh] md:h-auto  md:h-full md:min-h-screen text-white">
      <h2 className={`text-3xl font-bold mb-6 ${className}`}>Explore Playlists</h2>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <FaSpinner className="animate-spin text-green-500 text-4xl" />
          <p className="ml-3 text-lg">Loading playlists...</p>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center text-lg mt-4">{error}</div>
      )}

      {!loading && !error && playlists.length === 0 && (
        <p className="text-center text-gray-400 text-lg mt-8">
          No playlists found.
        </p>
      )}

      {!loading && !error && playlists.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id || playlist.name}
              playlist={playlist}
              onPlaylistClick={handlePlaylistClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlists;
