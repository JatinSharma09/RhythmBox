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

// /**
//  * @typedef {Object} SongData
//  * @property {string} id
//  * @property {string} title
//  * @property {string} artist
//  * @property {string} album
//  * @property {string} image
//  * @property {string} url
//  */

// /**
//  * Main context for the music player, managing core player controls,
//  * current song information, and overall application state (songs list, loading).
//  * This context provides values that change less frequently.
//  *
//  * @type {React.Context<Object>}
//  */
export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [queue, setQueue] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [currentSong, setCurrentSong] = useState(
    {
      // Default song state
      id: "",
      title: "Shaky",
      artist: "Sanju Rathod",
      album: "Coexist",
      image:
        "https://c.saavncdn.com/634/Shaky-Marathi-2025-20250422143320-500x500.jpg",
      url: "http://aac.saavncdn.com/634/c19474e494116361fddf2e6db2ffed64_320.mp4",
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to fetch initial song data when the component mounts
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get(
          "https://saavanapi-mu.vercel.app/api/playlists?link=https://www.jiosaavn.com/featured/trending-today/I3kvhipIy73uCJW60TJk1Q__&limit=50"
        );
        const fetchedSongs = response.data?.data.songs || [];
        setSongs(fetchedSongs);
        setQueue(fetchedSongs); // Populate queue with fetched songs

        // Optionally, if you want the first song from the fetched list to be the current song
        // and ready to play, you can set it here.
        if (fetchedSongs.length > 0) {
          // Map fetched song to SongData format
          const firstSong = {
            id: fetchedSongs[0].id,
            title: fetchedSongs[0].name,
            artist: fetchedSongs[0].artists?.all?.[0]?.name || "Unknown Artist",
            album: fetchedSongs[0].album?.name || "Unknown Album",
            image: fetchedSongs[0].image?.[2]?.url,
            url: fetchedSongs[0].downloadUrl?.[4]?.url,
          };
          setCurrentSong(firstSong);
          setCurrentSongIndex(0); // Set initial index
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
        setError("Failed to fetch songs");
        setLoading(false); // Ensure loading is set to false even on error
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
    // console.log(foundIndex);
    
    setCurrentSongIndex(foundIndex);
  }, [queue]); // queue is a dependency because findIndex depends on it

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

    const nextIndex = currentSongIndex + 1;
    // console.log(currentSongIndex);
    
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
      playSong(nextSong); // Use playSong to handle setting currentSong and isPlaying
      setCurrentSongIndex(nextIndex); // Explicitly update index
    } else {
      // End of queue: stop playback and reset index
      setIsPlaying(false);
      setCurrentTime(0); // Reset time
      setCurrentSongIndex(-1); // No song currently selected
      // Optional: If you want to loop back to the first song:
      // if (queue.length > 0) {
      //   playSong(queue[0]);
      //   setCurrentSongIndex(0);
      // }
    }
  }, [currentSongIndex, queue, playSong, setCurrentTime]);

  // NEW: Function to play the previous song in the queue
  const playPreviousSong = useCallback(() => {
    if (queue.length === 0) {
      setIsPlaying(false);
      setCurrentSongIndex(-1);
      return;
    }

    const prevIndex = currentSongIndex - 1;
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
      playSong(prevSong); // Use playSong to handle setting currentSong and isPlaying
      setCurrentSongIndex(prevIndex); // Explicitly update index
    } else {
      // Beginning of queue: stop playback and reset index
      setIsPlaying(false);
      setCurrentTime(0); // Reset time
      setCurrentSongIndex(-1); // No song currently selected
      // Optional: If you want to loop back to the last song:
      // if (queue.length > 0) {
      //   playSong(queue[queue.length - 1]);
      //   setCurrentSongIndex(queue.length - 1);
      // }
    }
  }, [currentSongIndex, queue, playSong, setCurrentTime]);

  // Callback for when the current song finishes playing
  // Now automatically plays the next song
  const handleEnded = useCallback(() => {
    playNextSong(); // Call playNextSong when current song ends
  }, [playNextSong]); // playNextSong is a dependency

  // Callback to clean up song titles (e.g., remove parenthesized content)
  const cleanTitle = useCallback((title) => {
    let cleanedTitle = title.replace(/&quot;/g, '"');
    cleanedTitle = cleanedTitle.replace(/\s*\(.*?\)\s*/g, "").trim();
    return cleanedTitle;
  }, []);

  // console.log("This component is is rendering");

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
      navigator.mediaSession.setActionHandler('play', () => {
        togglePlayPause();
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        togglePlayPause();
      });

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        playNextSong();
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        playPreviousSong();
      });

      // Optional: Add seek action handlers if you have seek functionality
      
      // navigator.mediaSession.setActionHandler('seekbackward', (event) => {
      //   audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - (event.seekOffset || 10));
      // });
      // navigator.mediaSession.setActionHandler('seekforward', (event) => {
      //   audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + (event.seekOffset || 10));
      // });
      // navigator.mediaSession.setActionHandler('seekto', (event) => {
      //   if (event.fastSeek && 'fastSeek' in audioRef.current) {
      //     audioRef.current.fastSeek(event.seekTime);
      //     return;
      //   }
      //   audioRef.current.currentTime = event.seekTime;
      // });
     

      // Clean up on component unmount
      return () => {
        if ('mediaSession' in navigator) {
          navigator.mediaSession.setActionHandler('play', null);
          navigator.mediaSession.setActionHandler('pause', null);
          navigator.mediaSession.setActionHandler('nexttrack', null);
          navigator.mediaSession.setActionHandler('previoustrack', null);
          navigator.mediaSession.metadata = null;
          navigator.mediaSession.playbackState = 'none';
        }
      };
    }
  }, [currentSong, isPlaying, togglePlayPause, playNextSong, playPreviousSong, cleanTitle, audioRef]);

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
    loading,
    error,
    queue,
    setQueue,
    togglePlayPause,
    playSong,
    playNextSong,     // Expose next song function
    playPreviousSong, // Expose previous song function
    cleanTitle,
  }), [
    isPlaying,
    isFullScreen,
    setIsFullScreen,
    volume,
    setVolume,
    currentSong,
    currentSongIndex, // Dependency
    songs,
    loading,
    error,
    queue,
    setQueue,
    togglePlayPause,
    playSong,
    playNextSong,
    playPreviousSong,
    cleanTitle,
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
