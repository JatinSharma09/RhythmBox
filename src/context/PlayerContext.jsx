import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { AudioPlaybackStateContext } from './AudioPlaybackStateContext';
import { useToast } from './ToastContext';

export const PlayerContext = createContext();
export const PlayerProvider = ({ children }) => {

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("rhythmbox_volume");
    return saved ? parseFloat(saved) : 1;
  });
  const [queue, setQueue] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [currentSong, setCurrentSong] = useState(
    {
      // Default song state
      id: "",
      title: "",
      artist: "",
      album: "",
      image: "null",
      url: "null",
    }
  );

  // Audio Playback State (frequently changing, provided via AudioPlaybackStateContext)
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Refs for direct DOM interaction (audio element and animation frame)
  const audioRef = useRef(null);
  const animationRef = useRef(null);

  // Home Page Data State
  const [songs, setSongs] = useState([]);
  const [homePlaylists, setHomePlaylists] = useState([]); // Cached playlists
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [shuffle, setShuffle] = useState(() => {
    return localStorage.getItem("rhythmbox_shuffle") === "true";
  });
  const [repeat, setRepeat] = useState(() => {
    const saved = localStorage.getItem("rhythmbox_repeat");
    return saved ? parseInt(saved) : 0;
  }); // 0: off, 1: all, 2: one

  // --- User Data Persistence (History, Favorites, Playlists) ---
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  // Toast Hook
  const { addToast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("rhythmbox_history");
    const savedFavorites = localStorage.getItem("rhythmbox_favorites");
    const savedPlaylists = localStorage.getItem("rhythmbox_playlists");

    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedPlaylists) setPlaylists(JSON.parse(savedPlaylists));

    const savedSearchHistory = localStorage.getItem("rhythmbox_search_history");
    if (savedSearchHistory) setSearchHistory(JSON.parse(savedSearchHistory));
  }, []);

  // Save Player State Persistence
  useEffect(() => {
    localStorage.setItem("rhythmbox_volume", volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem("rhythmbox_shuffle", shuffle.toString());
  }, [shuffle]);

  useEffect(() => {
    localStorage.setItem("rhythmbox_repeat", repeat.toString());
  }, [repeat]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("rhythmbox_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("rhythmbox_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("rhythmbox_playlists", JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem("rhythmbox_search_history", JSON.stringify(searchHistory));
  }, [searchHistory]);

  const addToHistory = useCallback((song) => {
    setHistory((prev) => {
      const newHistory = [song, ...prev.filter((s) => s.id !== song.id)].slice(0, 50); // Keep last 50 songs
      return newHistory;
    });
  }, []);

  const toggleFavorite = useCallback((song) => {
    setFavorites((prev) => {
      const isFavorite = prev.some((s) => s.id === song.id);
      if (isFavorite) {
        addToast("Removed from Favorites", "info");
        return prev.filter((s) => s.id !== song.id);
      } else {
        addToast("Added to Favorites", "success");
        return [song, ...prev];
      }
    });
  }, [addToast]);

  const createPlaylist = useCallback((name) => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      songs: [],
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
    addToast(`Playlist "${name}" created`, "success");
  }, [addToast]);

  const addToPlaylist = useCallback((playlistId, song) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          // Check for duplicates if needed, or allow them
          return { ...pl, songs: [...pl.songs, song] };
        }
        return pl;
      })
    );
    addToast("Added to playlist", "success");
  }, [addToast]);

  const removeFromPlaylist = useCallback((playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === playlistId
          ? { ...pl, songs: pl.songs.filter((s) => s.id !== songId) }
          : pl
      )
    );
  }, []);

  const deletePlaylist = useCallback((playlistId) => {
    setPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
  }, []);

  const addToSearchHistory = useCallback((query) => {
    setSearchHistory((prev) => {
      const newHistory = [query, ...prev.filter((q) => q !== query)].slice(0, 10); // Keep last 10 searches
      return newHistory;
    });
  }, []);

  const removeFromSearchHistory = useCallback((query) => {
    setSearchHistory((prev) => prev.filter((q) => q !== query));
  }, []);

  // Home Page Data State


  // ... (existing state)

  // Effect to fetch initial song data and playlists when the component mounts
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Trending Songs
        const response = await axios.get(
          "https://saavanapi-mu.vercel.app/api/playlists?link=https://www.jiosaavn.com/featured/trending-today/I3kvhipIy73uCJW60TJk1Q__&limit=50"
        );
        const fetchedSongs = response.data?.data.songs || [];
        setSongs(fetchedSongs);
        setQueue(fetchedSongs);

        if (fetchedSongs.length > 0) {
          const firstSong = {
            id: fetchedSongs[0].id,
            title: fetchedSongs[0].name,
            artist: fetchedSongs[0].artists?.all?.[0]?.name || "Unknown Artist",
            album: fetchedSongs[0].album?.name || "Unknown Album",
            image: fetchedSongs[0].image?.[2]?.url,
            url: fetchedSongs[0].downloadUrl?.[4]?.url,
          };
          setCurrentSong(firstSong);
          setCurrentSongIndex(0);
        }

        // 2. Fetch Playlists (Cached)
        const playlistNames = [
          'most-searched-songs-hindi',
          'monsoon',
          'Top 50',
          'viralnation',
          'taaza-tunes',
          'badshah',
          'lets-play-arijit-singh-hindi',
          'bhojpuri hits',
          'bhakti',
          'indie pop',
          '90s',
          '80s'
        ];

        const fetchedPlaylists = [];
        for (const name of playlistNames) {
          try {
            const searchResponse = await axios.get(`https://saavanapi-mu.vercel.app/api/search?query=${encodeURIComponent(name)}`);
            const playlistResult = searchResponse.data?.data?.playlists?.results?.[0];

            if (playlistResult && playlistResult.url) {
              const playlistContentResponse = await axios.get(`https://saavanapi-mu.vercel.app/api/playlists?link=${encodeURIComponent(playlistResult.url)}&limit=50`);
              const fullPlaylistData = playlistContentResponse.data?.data;

              if (fullPlaylistData) {
                fetchedPlaylists.push({
                  id: fullPlaylistData.id || playlistResult.id,
                  name: fullPlaylistData.name || playlistResult.name,
                  image: fullPlaylistData.image?.[2]?.url || fullPlaylistData.image?.[0]?.url || playlistResult.image?.[2]?.url,
                  songs: fullPlaylistData.songs || [],
                  songCount: fullPlaylistData.songCount || fullPlaylistData.songs?.length || 0,
                  url: playlistResult.url,
                });
              }
            }
          } catch (err) {
            console.error(`Error fetching playlist ${name}:`, err);
          }
        }

        const uniquePlaylists = Array.from(new Map(fetchedPlaylists.map(item => [item.id, item])).values());
        setHomePlaylists(uniquePlaylists);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []); // Empty dependency array means this runs once on mount

  // Callback to update the current playback time using requestAnimationFrame
  const updateTime = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      animationRef.current = requestAnimationFrame(updateTime);
    }
  }, []);

  // Main effect to control audio playback based on isPlaying and currentSong
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Update audio source if the current song changes
    if (currentSong.url && audio.src !== currentSong.url) {
      audio.src = currentSong.url;
      audio.load();
      setCurrentTime(0);
      setDuration(0);
    }

    if (isPlaying) {
      audio.play().catch(err => console.error("Audio play failed:", err));
      animationRef.current = requestAnimationFrame(updateTime);
    } else {
      audio.pause();
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, currentSong, updateTime]);

  // Callback to toggle play/pause state
  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Callback to play a specific song, updating currentSong and setting isPlaying to true
  // This function now also updates the currentSongIndex
  const playSong = useCallback((song) => {
    setCurrentSong(song);
    setIsPlaying(true);

    const foundIndex = queue.findIndex(qSong => qSong.id === song.id);
    setCurrentSongIndex(foundIndex);
    addToHistory(song); // Add to history
  }, [queue, addToHistory]); // queue is a dependency because findIndex depends on it

  // Callback for when audio metadata is loaded (e.g., duration becomes available)
  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  // NEW: Function to play the next song in the queue
  const playNextSong = useCallback(() => {
    if (queue.length === 0) {
      setIsPlaying(false);
      setCurrentSongIndex(-1);
      return;
    }

    let nextIndex = currentSongIndex + 1;

    // Handle Shuffle
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }

    // Handle Repeat
    if (repeat === 2) { // Repeat One
      nextIndex = currentSongIndex;
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        return;
      }
    } else if (repeat === 1 && nextIndex >= queue.length) { // Repeat All
      nextIndex = 0;
    }

    if (nextIndex < queue.length) {
      // Map the song from the queue to the expected SongData format
      const nextSong = {
        id: queue[nextIndex].id,
        title: queue[nextIndex].name || queue[nextIndex].title, // Assuming 'name' is the title in queue
        artist: queue[nextIndex].artists?.primary?.[0]?.name || queue[nextIndex].artists?.all?.[0]?.name || queue[nextIndex]?.artist || "Unknown Artist",
        album: queue[nextIndex].album?.name || queue[nextIndex]?.album || "Unknown Album",
        image: queue[nextIndex].image?.[2]?.url || queue[nextIndex]?.image,
        url: queue[nextIndex].downloadUrl?.[4]?.url || queue[nextIndex]?.url,
      };

      fadeOut(() => {
        playSong(nextSong); // Use playSong to handle setting currentSong and isPlaying
        setCurrentSongIndex(nextIndex); // Explicitly update index
        // fadeIn is handled in the main useEffect when isPlaying becomes true or song changes
        setTimeout(fadeIn, 200); // Small delay to ensure new source is loaded
      });
    } else {
      // End of queue: stop playback and reset index
      setIsPlaying(false);
      setCurrentTime(0); // Reset time
      setCurrentSongIndex(-1); // No song currently selected

    }
  }, [currentSongIndex, queue, playSong, setCurrentTime, shuffle, repeat]);

  // NEW: Function to play the previous song in the queue
  const playPreviousSong = useCallback(() => {
    if (queue.length === 0) {
      setIsPlaying(false);
      setCurrentSongIndex(-1);
      return;
    }

    let prevIndex = currentSongIndex - 1;

    if (repeat === 1 && prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    if (prevIndex >= 0) {
      // Map the song from the queue to the expected SongData format
      const prevSong = {
        id: queue[prevIndex].id,
        title: queue[prevIndex].name,
        artist: queue[prevIndex].artists?.primary?.[0]?.name || queue[prevIndex].artists?.all?.[0]?.name || "Unknown Artist",
        album: queue[prevIndex].album?.name || "Unknown Album",
        image: queue[prevIndex].image?.[2]?.url,
        url: queue[prevIndex].downloadUrl?.[4]?.url,
      };

      fadeOut(() => {
        playSong(prevSong); // Use playSong to handle setting currentSong and isPlaying
        setCurrentSongIndex(prevIndex); // Explicitly update index
        setTimeout(fadeIn, 200);
      });
    } else {
      // Beginning of queue: stop playback and reset index
      setIsPlaying(false);
      setCurrentTime(0); // Reset time
      setCurrentSongIndex(-1); // No song currently selected
    }
  }, [currentSongIndex, queue, playSong, setCurrentTime, repeat]);

  // Callback for when the current song finishes playing
  // Now automatically plays the next song
  const handleEnded = useCallback(() => {
    playNextSong(); // Call playNextSong when current song ends
  }, [playNextSong]); // playNextSong is a dependency

  // Callback to clean up song titles (e.g., remove parenthesized content)
  const cleanTitle = useCallback((title) => {
    if (!title) return "";
    let cleanedTitle = String(title).replace(/&quot;/g, '"');
    cleanedTitle = cleanedTitle.replace(/\s*\(.*?\)\s*/g, "").trim();
    return cleanedTitle;
  }, []);

  const addToQueue = useCallback((song) => {
    setQueue((prev) => [...prev, song]);
    addToast("Added to queue", "success");
  }, [addToast]);

  const removeFromQueue = useCallback((index) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const reorderQueue = useCallback((newQueue) => {
    setQueue(newQueue);
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeat((prev) => (prev + 1) % 3);
  }, []);

  // --- Playback Speed ---
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const changePlaybackSpeed = useCallback((speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, []);

  // Ensure playback speed is applied when audio element updates or song changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [currentSong, playbackSpeed]);

  // --- Crossfade Logic ---
  const [crossfadeEnabled, setCrossfadeEnabled] = useState(true);
  const CROSSFADE_DURATION = 1000; // 1 second

  const fadeOut = (callback) => {
    if (!crossfadeEnabled || !audioRef.current) {
      callback();
      return;
    }

    const audio = audioRef.current;
    const originalVolume = volume;
    const step = originalVolume / (CROSSFADE_DURATION / 50);

    const fadeInterval = setInterval(() => {
      if (audio.volume > step) {
        audio.volume -= step;
      } else {
        audio.volume = 0;
        clearInterval(fadeInterval);
        callback();
      }
    }, 50);
  };

  const fadeIn = () => {
    if (!crossfadeEnabled || !audioRef.current) return;

    const audio = audioRef.current;
    const targetVolume = volume;
    audio.volume = 0;
    const step = targetVolume / (CROSSFADE_DURATION / 50);

    const fadeInterval = setInterval(() => {
      if (audio.volume < targetVolume - step) {
        audio.volume += step;
      } else {
        audio.volume = targetVolume;
        clearInterval(fadeInterval);
      }
    }, 50);
  };

  // --- Media Session API Integration ---
  useEffect(() => {
    if ('mediaSession' in navigator) {
      // 1. Update Metadata when currentSong changes
      if (currentSong.id) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: cleanTitle(currentSong.title),
          artist: currentSong.artist,
          album: currentSong.album,
          artwork: [
            { src: currentSong.image || 'https://placehold.co/512x512/333333/FFFFFF?text=No+Art', sizes: '512x512', type: 'image/jpeg' },
          ]
        });
      } else {
        navigator.mediaSession.metadata = null;
      }

      // 2. Update Playback State when isPlaying changes
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      // 3. Set Action Handlers (only set once, they persist)
      const actionHandlers = [
        ['play', togglePlayPause],
        ['pause', togglePlayPause],
        ['previoustrack', playPreviousSong],
        ['nexttrack', playNextSong],
        ['stop', () => {
          setIsPlaying(false);
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }],
      ];

      actionHandlers.forEach(([action, handler]) => {
        try {
          navigator.mediaSession.setActionHandler(action, handler);
        } catch (error) {
          console.warn(`Media Session API action "${action}" is not supported.`);
        }
      });

      // Clean up on component unmount
      return () => {
        if ('mediaSession' in navigator) {
          actionHandlers.forEach(([action]) => {
            try {
              navigator.mediaSession.setActionHandler(action, null);
            } catch (e) { /* ignore */ }
          });
          navigator.mediaSession.metadata = null;
          navigator.mediaSession.playbackState = 'none';
        }
      };
    }
  }, [currentSong, isPlaying, togglePlayPause, playNextSong, playPreviousSong, cleanTitle]);

  // --- Global Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault(); // Prevent scrolling
          togglePlayPause();
          break;
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) {
            playNextSong();
          } else {
            if (audioRef.current) audioRef.current.currentTime += 5;
          }
          break;
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) {
            playPreviousSong();
          } else {
            if (audioRef.current) audioRef.current.currentTime -= 5;
          }
          break;
        case 'ArrowUp':
          e.preventDefault(); // Prevent scrolling
          setVolume(prev => Math.min(prev + 0.1, 1));
          break;
        case 'ArrowDown':
          e.preventDefault(); // Prevent scrolling
          setVolume(prev => Math.max(prev - 0.1, 0));
          break;
        case 'KeyM':
          setVolume(prev => (prev > 0 ? 0 : 1));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, playNextSong, playPreviousSong]);

  // Memoized value for the main PlayerContext.
  const mainPlayerContextValue = useMemo(() => ({
    isPlaying,
    isFullScreen,
    setIsFullScreen,
    volume,
    setVolume,
    audioRef,
    currentSong,
    currentSongIndex, // Expose currentSongIndex
    songs,
    homePlaylists, // Expose cached playlists
    loading,
    error,
    queue,
    setQueue,
    togglePlayPause,
    playSong,
    playNextSong,     // Expose next song function
    playPreviousSong, // Expose previous song function
    cleanTitle,
    shuffle,
    repeat,
    addToQueue,
    removeFromQueue,
    reorderQueue,
    toggleShuffle,
    toggleRepeat,
    playbackSpeed,
    changePlaybackSpeed,
    crossfadeEnabled,
    setCrossfadeEnabled,
    history,
    addToHistory,
    favorites,
    toggleFavorite,
    playlists,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    deletePlaylist,
    searchHistory,
    addToSearchHistory,
    removeFromSearchHistory,
  }), [
    isPlaying,
    isFullScreen,
    setIsFullScreen,
    volume,
    setVolume,
    currentSong,
    currentSongIndex, // Dependency
    songs,
    homePlaylists,
    loading,
    error,
    queue,
    setQueue,
    togglePlayPause,
    playSong,
    playNextSong,
    playPreviousSong,
    cleanTitle,
    shuffle,
    repeat,
    addToQueue,
    removeFromQueue,
    reorderQueue,
    toggleShuffle,
    toggleRepeat,
    playbackSpeed,
    changePlaybackSpeed,
    crossfadeEnabled,
    setCrossfadeEnabled,
    history,
    addToHistory,
    favorites,
    toggleFavorite,
    playlists,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    deletePlaylist,
    searchHistory,
    addToSearchHistory,
    removeFromSearchHistory,
  ]);

  // Memoized value for the AudioPlaybackStateContext.
  const playbackStateContextValue = useMemo(() => ({
    currentTime,
    duration,
  }), [currentTime, duration]);

  return (
    <PlayerContext.Provider value={mainPlayerContextValue}>
      <AudioPlaybackStateContext.Provider value={playbackStateContextValue}>
        {children}
        <audio
          ref={audioRef}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={updateTime}
          onEnded={handleEnded}
        />
      </AudioPlaybackStateContext.Provider>
    </PlayerContext.Provider>
  );
};

export default PlayerContext;
