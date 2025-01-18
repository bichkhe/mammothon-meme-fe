import React from "react";
import HotMeme from "../containers/hot-meme";
import MemeList from "../containers/meme-list";

const MemeHomePage = () => {
  return (
    <div className="w-full h-full">
      <HotMeme />
      <MemeList />
    </div>
  );
};

export default MemeHomePage;
