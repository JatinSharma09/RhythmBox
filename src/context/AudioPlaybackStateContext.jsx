// src/context/AudioPlaybackStateContext.js

import { createContext } from 'react';

/**
 * @typedef {Object} AudioPlaybackState
 * @property {number} currentTime - The current playback time of the audio in seconds.
 * @property {number} duration - The total duration of the audio in seconds.
 */

/**
 * Context for providing frequently updated audio playback state (current time, duration).
 * Components that only need to react to time updates should consume this context
 * to avoid re-rendering when other, less frequent player states change.
 *
 * @type {React.Context<AudioPlaybackState>}
 */
export const AudioPlaybackStateContext = createContext({
  currentTime: 0,
  duration: 0,
});

// Note: This file only defines and exports the context.
// The PlayerProvider in PlayerContext.js will be responsible for
// providing values to this context.
