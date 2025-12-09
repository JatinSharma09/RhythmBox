import React from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const VirtualQueue = ({ queue, currentSongIndex, playSong }) => {
  const Row = ({ index, style }) => {
    const song = queue[index];
    const isCurrent = index === currentSongIndex;

    return (
      <div
        style={style}
        className={`flex items-center p-2 hover:bg-white/10 cursor-pointer rounded-md transition-colors ${
          isCurrent ? 'bg-green-500/20 text-green-400' : 'text-gray-300'
        }`}
        onClick={() => playSong(song)}
      >
        <div className="w-8 text-center text-sm opacity-50 mr-2">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="truncate font-medium text-sm">
            {song.name || song.title}
          </div>
          <div className="truncate text-xs opacity-70">
            {song.artists?.primary?.[0]?.name || song.artist || "Unknown Artist"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 h-full">
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={queue.length}
            itemSize={60} // Adjust based on your design
            width={width}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default VirtualQueue;
