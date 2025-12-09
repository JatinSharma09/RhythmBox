import React, { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import Card from "../components/Card";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

const ForYou = () => {
  const { history, favorites } = useContext(PlayerContext);
  const [dailyMix, setDailyMix] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate "Daily Mix" by fetching trending songs (or a different playlist)
        const dailyMixRes = await axios.get(
          "https://saavanapi-mu.vercel.app/api/playlists?link=https://www.jiosaavn.com/featured/weekly-top-songs/8MT-LQlP35c_&limit=20"
        );
        setDailyMix(dailyMixRes.data?.data?.songs || []);

        // Simulate "Based on your listening"
        // In a real app, we'd analyze history/favorites. Here, we'll fetch another playlist
        // or if history exists, maybe fetch songs from the same language/genre as the last played song.
        // For now, let's fetch a "New Releases" or similar playlist.
        const recRes = await axios.get(
          "https://saavanapi-mu.vercel.app/api/playlists?link=https://www.jiosaavn.com/featured/new-releases-hindi/yK,w,w,w,w__&limit=20"
        );
        setRecommendations(recRes.data?.data?.songs || []);

      } catch (error) {
        console.error("Failed to fetch For You data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full flex-1 overflow-y-auto bg-background pb-24 md:pb-0">
      <div className="p-6 md:p-8 mb-20">
        <h1 className="text-3xl font-bold text-white mb-2">For You</h1>
        <p className="text-gray-400 mb-8">Music selected just for you.</p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-primary text-4xl" />
          </div>
        ) : (
          <div className="space-y-10">
            {/* Daily Mix */}
            <section>
              {/* <h2 className="text-2xl font-bold text-white mb-4">Daily Mix</h2> */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {dailyMix.slice(0, 10).map((song) => (
                  <Card key={song.id} songData={song} />
                ))}
              </div>
            </section>

            {/* Based on your listening */}
            {/* <section>
              <h2 className="text-2xl font-bold text-white mb-4">Based on your listening</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {recommendations.slice(0, 10).map((song) => (
                  <Card key={song.id} songData={song} />
                ))}
              </div>
            </section> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForYou;
