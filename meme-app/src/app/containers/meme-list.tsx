import React from "react";
import MemeItem from "../components/meme-item";
import MemeSearch from "../components/meme-search";

const MemeList = () => {
  return (
    <div className="md:mx-[100px] h-full">
      <MemeSearch />
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-2 border-1 border-gray-200">
        <MemeItem />
        <MemeItem />
        <MemeItem />
        <MemeItem />
        <MemeItem />
        <MemeItem />
        <MemeItem />
        <MemeItem />
        <MemeItem />
        <MemeItem />
        <MemeItem />
        <MemeItem />
      </div>
    </div>
  );
};

export default MemeList;
