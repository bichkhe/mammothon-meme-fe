"use client";
import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import React from "react";
import { HotMemeCoins } from "../constant";
type MemeCarouselProps = {
  memes: any;
};
const MemeCarousel = ({ memes }: MemeCarouselProps) => {
  if (!memes) {
    return null;
  }
  return (
    <Carousel
      className="w-full h-[400px] mx-auto"
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
    >
      <CarouselContent>
        {memes.map((meme: any, index: number) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <CardContent className="flex items-center justify-center p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 min-w-screen gap-12">
                {/* <Rocket className="size-12 text-red-600 right-10" /> */}
                <Image
                  src={meme.icon}
                  alt={meme.name}
                  width={200}
                  height={200}
                />
                <div className="flex flex-col gap-4 justify-center items-center">
                  <div className="text-4xl text-white font-bold ">
                    {meme.name}
                  </div>
                  <div className="text-2xl text-white font-extralight">
                    {meme.symbol}
                  </div>
                  <div className="text-md text-white font-extralight">
                    Last Price: {meme.price / 1e18}ETH
                  </div>
                  <div className="text-md text-white font-extralight">
                    Market cap:{" "}
                    {meme.current_minted_token &&
                      meme.price &&
                      (meme.price * meme.current_minted_token) / 1e18}
                    {!meme.current_minted_token && meme.price / 1e18} ETH
                  </div>
                  {/* <div className="text-md text-white font-extralight">
                    Change 24h: {meme.change}
                  </div> */}
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
