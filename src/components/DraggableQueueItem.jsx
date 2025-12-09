import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MdDragIndicator } from 'react-icons/md';

const DraggableQueueItem = ({ song, index, isCurrent, playSong }) => {
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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center p-2 hover:bg-white/10 rounded-md group ${
        isCurrent ? 'bg-green-500/20 text-green-400' : 'text-gray-300'
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="mr-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <MdDragIndicator size={20} />
      </div>
      <div 
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => playSong(song)}
      >
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

export default DraggableQueueItem;
