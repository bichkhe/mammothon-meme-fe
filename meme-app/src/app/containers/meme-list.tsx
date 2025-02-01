"use client";

import React from "react";
import MemeItem from "../components/meme-item";
import MemeSearch from "../components/meme-search";
import useMeme from "../hooks/useMeme";
import { Skeleton } from "@/components/ui/skeleton";

const MemeList = () => {
  const { memes, searchText } = useMeme();
  console.log("MemeList:", memes, searchText, "xxx1x");
  return (
    <div className="md:mx-[100px]">
      <MemeSearch />
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-2 border-1 border-gray-200">
        {memes &&
          memes.map(
            (
              meme: { icon: string; name: string; market_cap: string },
              index: React.Key | null | undefined
            ) => (
              <MemeItem
                key={index}
                icon={meme.icon}
                name={meme.name}
                marketCap={meme.market_cap}
              />
            )
          )}
      </div>
      {memes && memes.length === 0 && (
        <div className="flex flex-1 justify-center items-center  text-2xl font-bold text-white bg-black p-2 rounded-md font-mono">
          No memes found
        </div>
      )}
      {!memes && (
        <div className="flex flex-1 justify-center items-center  text-2xl font-bold text-white p-2  font-mono  bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 animate-pulse">
          <Skeleton className="w-full h-[500px] flex justify-center items-center">
            <span className="font-mono text-md ml-5 text-4xl text-black j">
              {searchText}
            </span>
          </Skeleton>
        </div>
      )}
    </div>
  );
};

export default MemeList;
