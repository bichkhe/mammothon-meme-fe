import { ArrowRight } from "lucide-react";
import React from "react";

interface MemeItemProps {
  // Define the props for the MemeItem component
  icon: string;
  name: string;
  marketCap: string;
}
const MemeItem = ({ icon, name, marketCap }: MemeItemProps) => {
  return (
    <div className="meme-item hover:border-blue-500 hover:border-4 bg-black p-4 text-white border-2 border-gray-700 hover:text-blue-600 cursor-pointer">
      <div className="meme-header">
        <div className="flex justify-between">
          <span className="text-2xl text-gray-400">101</span>
          <ArrowRight className="text-2xl text-gray-400" />
        </div>

        <div className="flex flex-col gap-4 justify-center items-center">
          {/* <Smile className="h-12 w-12" /> */}
          <img src={icon} alt={name} className="h-12 w-12" />
          <span className="text-2xl font-semibold uppercase overflow-hidden">
            {name}
          </span>
        </div>
      </div>
      <div className="flex gap-4 mt-5">
        <div className="flex flex-col ">
          <span className="body-sm  text-light-gray group-hover:text-ec-blue uppercase p-[1px] transition-all font-thin text-slate-500">
            Market Cap
          </span>
          <span className="text-sm text-cyan-500">{marketCap}$</span>
        </div>
        <div className="flex flex-col">
          <span className="body-sm font-forma text-light-gray group-hover:text-ec-blue uppercase p-[1px] transition-all font-thin text-slate-500">
            Last swap
          </span>
          <span className="text-sm text-cyan-500">0.99 APT</span>
        </div>
      </div>
    </div>
  );
};

export default MemeItem;
