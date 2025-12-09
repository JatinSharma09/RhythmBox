import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MdDragHandle } from 'react-icons/md';

const SortableFullScreenQueueItem = ({ song, index, isCurrent, playSong, cleanTitle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: song.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const handlePlay = () => {
    if (!isDragging) {
      playSong({
        id: song.id,
        title: song.name || song?.title,
        artist: song.artists?.primary?.[0]?.name || song?.artist,
        album: song.album?.name || song?.album,
        image: song.image?.[2]?.url || song?.image,
        url: song.downloadUrl?.[4]?.url || song?.url,
      });
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-xl p-2.5 transition-colors ${
        isCurrent
          ? "bg-primary/20 border-l-4 border-primary"
          : "bg-white/5 hover:bg-white/10"
      }`}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-1 text-gray-500 hover:text-white cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <MdDragHandle size={20} />
      </button>

      {/* Song Info - Clickable */}
      <div 
        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
        onClick={handlePlay}
      >
        <img
          src={song.image?.[1]?.url || song?.image}
          className="h-11 w-11 rounded-lg object-cover flex-shrink-0"
          loading="lazy"
          alt=""
        />
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate text-sm">
            {cleanTitle(song?.name || song?.title)}
          </p>
          <p className="text-gray-400 text-xs truncate">
            {song.artists?.primary?.[0]?.name || song?.artist}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SortableFullScreenQueueItem;
