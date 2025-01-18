import React from "react";
import MemeItem from "../components/meme-item";
import MemeSearch from "../components/meme-search";
import { HotMemeCoins } from "../constant";

const MemeList = () => {
  return (
    <div className="md:mx-[100px]">
      <MemeSearch />
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-2 border-1 border-gray-200">
        {HotMemeCoins &&
          HotMemeCoins.map((meme, index) => (
            <MemeItem
              key={index}
              icon={meme.icon}
              name={meme.name}
              marketCap={meme.market_cap}
            />
          ))}
      </div>
    </div>
  );
};

export default MemeList;
