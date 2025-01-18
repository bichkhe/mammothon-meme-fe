"use client";

import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Rocket } from "lucide-react";
import Image from "next/image";

import React from "react";

const HotMemeCoins = [
  {
    icon: "https://upload.wikimedia.org/wikipedia/en/d/d0/Dogecoin_Logo.png",
    name: "Doge",
    symbol: "DOGE",
    price: 0.3,
    market_cap: "200,278.91",
    all_time_vol: "34,850.5",
    change: 0.000001,
  },
  {
    icon: "/shiba.png",
    name: "Shiba",
    symbol: "SHIB",
    price: 0.00001,
    market_cap: "200,278.91",
    all_time_vol: "34,850.5",
    change: 0.000001,
  },
  {
    icon: "/btc.png",
    name: "bitcoin",
    symbol: "BTC",
    price: 0.00001,
    market_cap: "200,278.91",
    all_time_vol: "34,850.5",
    change: 0.000001,
  },
  {
    icon: "/safemoon.png",
    name: "SafeMoon",
    symbol: "SAFEMOON",
    price: 0.00001,
    market_cap: "200,278.91",
    all_time_vol: "34,850.5",
    change: 0.000001,
  },
];
const MemeCarousel = () => {
  return (
    <Carousel
      className="w-full h-[400px] mx-auto "
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
    >
      <CarouselContent>
        {HotMemeCoins.map((meme, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <CardContent className="flex items-center justify-center p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 min-w-screen">
                {/* <Rocket className="size-12 text-red-600 right-10" /> */}
                <Image
                  src={meme.icon}
                  alt={meme.name}
                  width={200}
                  height={200}
                />
                <div className="flex flex-col gap-4 justify-center items-center">
                  <div className="text-2xl text-white font-extralight">
                    {meme.name}
                  </div>
                  <div className="text-2xl text-white font-extralight">
                    {meme.symbol}
                  </div>
                  <div className="text-md text-white font-extralight">
                    Market cap: {meme.market_cap}
                  </div>
                  <div className="text-md text-white font-extralight">
                    All time volume: {meme.all_time_vol}
                  </div>
                  <div className="text-md text-white font-extralight">
                    Change 24h: {meme.change}
                  </div>
                </div>
              </CardContent>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious /> */}
      {/* <CarouselNext /> */}
    </Carousel>
  );
};

export default MemeCarousel;
