"use client";
import React from "react";
import MemeCarousel from "../components/meme-carousel";
import useMeme from "../hooks/useMeme";

const HotMeme = () => {
  const { memes, searchText } = useMeme();
  console.log("MemeList:", memes, searchText, "xxx1x");
  return (
    <div className="flex flex-col h-[300px] w-full">
      <MemeCarousel memes={memes} />
    </div>
  );
};

export default HotMeme;
