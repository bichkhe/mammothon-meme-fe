"use client";

import React from "react";
import MemeItem from "../components/meme-item";
import MemeSearch from "../components/meme-search";
import { HotMemeCoins } from "../constant";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
const MemeList = () => {
  const memes = useQuery(api.meme.get); //meme iss the name of file and get is the function name
  console.log("meme:", memes);
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
