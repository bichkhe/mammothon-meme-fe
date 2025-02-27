"use client";

import React, { useState } from "react";
import PoolsTable, { TableProps } from "./pools-table";
import AddLiquidity from "./add-liquidity";

const PoolsPage = () => {
  const [poolData] = useState<TableProps[]>([
    {
      coinId: "1",
      coinIconUrl: "https://cdn-icons-png.flaticon.com/512/1078/1078454.png",
      allTimeVolume: 1000,
      volume24h: 100,
      tvl: 1000,
      dpr: 1,
    },
    {
      coinId: "3",
      coinIconUrl: "https://cdn-icons-png.flaticon.com/512/1078/1078454.png",
      allTimeVolume: 3000,
      volume24h: 300,
      tvl: 3000,
      dpr: 3,
    },
    {
      coinId: "4",
      coinIconUrl: "https://cdn-icons-png.flaticon.com/512/648/648270.png",
      allTimeVolume: 4000,
      volume24h: 400,
      tvl: 4000,
      dpr: 4,
    },
    {
      coinId: "5",
      coinIconUrl: "https://cdn-icons-png.flaticon.com/512/1078/1078454.png",
      allTimeVolume: 5000,
      volume24h: 500,
      tvl: 5000,
      dpr: 5,
    },
    {
      coinId: "6",
      coinIconUrl: "https://cdn-icons-png.flaticon.com/512/648/648270.png",
      allTimeVolume: 6000,
      volume24h: 600,
      tvl: 6000,
      dpr: 6,
    },
    {
      coinId: "7",
      coinIconUrl: "https://cdn-icons-png.flaticon.com/512/1078/1078454.png",
      allTimeVolume: 7000,
      volume24h: 700,
      tvl: 7000,
      dpr: 7,
    },
    {
      coinId: "8",
      coinIconUrl: "https://cdn-icons-png.flaticon.com/512/648/648270.png",
      allTimeVolume: 8000,
      volume24h: 800,
      tvl: 8000,
      dpr: 8,
    },
    {
      coinId: "9",
      coinIconUrl: "https://cdn-icons-png.flaticon.com/512/1078/1078454.png",
      allTimeVolume: 9000,
      volume24h: 900,
      tvl: 9000,
      dpr: 9,
    },
    {
      coinId: "10",
      coinIconUrl: "https://cdn-icons-png.flaticon.com/512/648/648270.png",
      allTimeVolume: 10000,
      volume24h: 1000,
      tvl: 10000,
      dpr: 10,
    },
    {
      coinId: "11",
      coinIconUrl: "https://cdn-icons-png.flaticon.com/512/1078/1078454.png",
      allTimeVolume: 11000,
      volume24h: 1100,
      tvl: 11000,
      dpr: 11,
    },
    {
      coinId: "12",
      coinIconUrl: "https://cdn-icons-png.flaticon.com/512/648/648270.png",
      allTimeVolume: 12000,
      volume24h: 1200,
      tvl: 12000,
      dpr: 12,
    },
    {
      coinId: "2",
      coinIconUrl: "https://cdn-icons-png.flaticon.com/512/648/648270.png",
      allTimeVolume: 2000.333,
      volume24h: 200.12,
      tvl: 2000.12,
      dpr: 2.33,
    },
  ]);

  return (
    <div className="flex h-full items-center justify-center">
      <h1 className="text-4xl font-bold">Coming Soon...</h1>
    </div>
  );
};

export default PoolsPage;
