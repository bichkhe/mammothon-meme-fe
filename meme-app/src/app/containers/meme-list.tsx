"use client";

import React, { useEffect, useState } from "react";
import MemeItem from "../components/meme-item";
import MemeSearch from "../components/meme-search";
import { HotMemeCoins } from "../constant";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useMemeStore } from "@/store/meme";
import useMeme from "../hooks/useMeme";

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
        <div className="flex flex-1 justify-center items-center  text-2xl font-bold text-white bg-black p-2 rounded-md font-mono">
          Searching:{" "}
          <span className="font-mono text-md ml-5">{searchText}</span>
        </div>
      )}
    </div>
  );
};

export default MemeList;
