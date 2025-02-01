"use client";

import React, { useEffect } from "react";
import Logo from "./logo";
import { MenuItems } from "../constant";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { useWalletStore } from "@/store/wallet";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

const NavBar = () => {
  const { setWalletAddress } = useWalletStore();
  const { open } = useAppKit();
  const { address } = useAppKitAccount();
  useEffect(() => {
    if (address) {
      console.log("Wallet connected");
      setWalletAddress(address);
    }
  }, [address]);

  return (
    <nav className="flex w-full justify-between items-center gap-2">
      <Logo />
      {/* <Menu /> */}
      <ul className="hidden md:flex justify-between m-1 items-center gap-4 h-16 text-black shadow-md font-mono">
        {MenuItems.map((item) => (
          <li
            className="hover:bg-slate-900 rounded-md hover:text-white"
            key={item.name}
          >
            <Link href="#home" className="p-2">
              {item.name}
            </Link>
          </li>
        ))}
        <li>
          {address ? (
            <div className="flex gap-2 justify-center items-center mx-4">
              <appkit-button />
            </div>
          ) : (
            <>
              <Button
                onClick={() => open()}
                className="bg-white font-bold text-black hover:bg-cyan-300 rounded-none"
              >
                Connect Wallet
              </Button>
              <Button
                onClick={() => open({ view: "Networks" })}
                className="rounded-none mx-2"
              >
                Select Networks
              </Button>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
