import React from "react";
import Card from "./Card";

const CardGrid = ({ Data }) => {
  // Ensure Data is an array, even if it's undefined or null initially.
  // This prevents the "Cannot read properties of undefined (reading 'map')" error.
  const dataToRender = Data || []; 
  
  return (
    <div className="w-full">
      <div className="flex overflow-y-auto max-w-[90vw]  md:max-w-[77vw] gap-4 scrollbar-hide p-2">
        {dataToRender.map((item, index) => (
          <div key={index} className="flex-shrink-0 w-[155px] md:w-[160px]">
            <Card
              songData={item} // pass the entire data for context
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardGrid;
  