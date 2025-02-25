import React from "react";
import MemeCoinLogo from "./meme-logo";

interface MarketData {
  icon: string;
  name: string;
  marketCap: string;
  dailyVolume: string;
  allTimeVolume: string;
}

const MarketInfo = ({
  icon,
  name,
  marketCap,
  dailyVolume,
  allTimeVolume,
}: MarketData) => {
  return (
    <div className="bg-black p-4 rounded-lg mb-4 flex items-center gap-4 text-white">
      <MemeCoinLogo src={icon} alt={name} size={64} />
      <div className="grid grid-cols-3 gap-4 text-center w-full">
        <div>
          <h3 className="body-sm text-light-gray uppercase p-[1px] transition-all font-thin text-slate-500">
            MARKET CAP
          </h3>
          <p className="text-xl text-cyan-500">{marketCap} ETH</p>
        </div>
        <div>
          <h3 className="body-sm text-light-gray uppercase p-[1px] transition-all font-thin text-slate-500">
            24 HOUR VOL
          </h3>
          <p className="text-xl text-cyan-500">{dailyVolume} ETH</p>
        </div>
        <div>
          <h3 className="body-sm text-light-gray uppercase p-[1px] transition-all font-thin text-slate-500">
            ALL-TIME VOL
          </h3>
          <p className="text-xl text-cyan-500">{allTimeVolume} ETH</p>
        </div>
      </div>
    </div>
  );
};

export default MarketInfo;
