"use client";

import React, { useEffect } from "react";
import Logo from "./logo";
import { MenuItems } from "../constant";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Copy } from "lucide-react";

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import { useWalletStore } from "@/store/wallet";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "670345e6b79b47c49582938724153b30", // Replace with your Infura Project ID
    },
  },
};

const NavBar = () => {
  const { walletAddress, setWalletAddress } = useWalletStore();
  const [copied, setCopied] = React.useState(false);
  let web3Modal: Web3Modal;
  if (typeof window !== "undefined") {
    web3Modal = new Web3Modal({
      network: "mainnet", // Optional: Change to the network you want to use
      cacheProvider: true, // Optional: Enable caching for better UX
      providerOptions, // Add the provider options
    });
  }

  const connectWallet = async () => {
    try {
      // Open the Web3Modal and get the provider
      const provider = await web3Modal.connect();

      // Create a Web3 instance using the provider
      const web3 = new Web3(provider);

      // Get the connected account
      const accounts = await web3.eth.getAccounts();
      console.log("Connected account:", accounts[0]);

      // Optionally, you can also get the chain ID
      const chainId = await web3.eth.getChainId();
      console.log("Chain ID:", chainId, accounts[0]);
      setWalletAddress(accounts[0]);

      // You can now use the `web3` object to interact with the blockchain
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet(); // Reconnect to the cached provider
    }
  }, []);
  const disconnectWallet = async () => {
    await web3Modal.clearCachedProvider();
    setWalletAddress("");
    console.log("Wallet disconnected");
  };
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
          {walletAddress ? (
            <div className="flex gap-2 justify-center items-center mx-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="truncate font-bold flex items-center gap-2">
                      {walletAddress.slice(0, 10) + "..."}
                      <Copy
                        className="w-6 h-6 cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(walletAddress);
                          console.log(
                            "Wallet address copied to clipboard:",
                            walletAddress
                          );
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1000);
                        }}
                      ></Copy>
                      {copied ? <div className="text-white">Copied</div> : null}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{walletAddress}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button onClick={disconnectWallet}>Disconnect</Button>
            </div>
          ) : (
            <Button
              onClick={connectWallet}
              className="bg-cyan-700 font-bold text-slate-200 hover:bg-cyan-600"
            >
              Connect Wallet
            </Button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
