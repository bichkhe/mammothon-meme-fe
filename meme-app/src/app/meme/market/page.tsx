"use client";
import React from "react";
import MarketInfo from "@/app/components/market-info";
import Chart from "@/app/components/chart";
import Transactions from "@/app/components/transactions";
import BuyAndSell from "@/app/components/buy-and-sell";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const MemeMarketPage = () => {
  const searchParams = useSearchParams();
  const addr = searchParams.get("addr");

  const meme = useQuery(api.meme.getMeme, {
    addr: Array.isArray(addr) ? addr[0] : (addr ?? ""),
  });

  if (!meme) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex flex-col md:flex-row gap-4 p-4">
        <div className="w-full md:w-3/4">
          <MarketInfo
            icon={meme.icon}
            name={meme.name}
            marketCap={meme.market_cap}
            dailyVolume={meme.volume}
            allTimeVolume={meme.all_time_vol}
          />
          <Chart />
          <Transactions />
        </div>
        <div className="w-full md:w-1/4">
          <BuyAndSell />
        </div>
      </main>
    </div>
  );
};

export default MemeMarketPage;
