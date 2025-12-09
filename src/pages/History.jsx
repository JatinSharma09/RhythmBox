import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import Card from "../components/Card";

const History = () => {
  const { history } = useContext(PlayerContext);

  return (
    <div className="flex flex-col h-full flex-1 overflow-y-auto bg-background pb-24 md:pb-0">
      <div className="p-6 md:p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Recently Played</h1>
        
        {history.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {history.map((song, index) => (
              <Card key={`${song.id}-${index}`} songData={song} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
            <p className="text-lg">No history yet.</p>
            <p className="text-sm mt-2">Start listening to build your history!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
