"use client";

import { wagmiAdapter, projectId } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
// import { mainnet, arbitrum } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import {
  mainnet,
  arbitrum,
  avalanche,
  base,
  optimism,
  polygon,
  sepolia,
  // base_sepolia,
} from "@reown/appkit/networks";
import { vBaseSepolia } from "@/app/base_sepolia.config";

// Set up queryClient
const queryClient = new QueryClient();
if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "Meme Fun Marketplace",
  description: "RustWarriors Meme Marketplace",
  defaultNetwork: mainnet,
  // networks: [
  //   mainnet,
  //   arbitrum,
  //   avalanche,
  //   base,
  //   optimism,
  //   polygon,
  //   // base_sepolia,
  //   sepolia,
  // ],
  url: "https://memeapp.rustwarriors.vn", // origin must match your domain & subdomain
  icons: ["https://profile.rustwarriors.vn"],
};

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, sepolia, vBaseSepolia],
  defaultNetwork: vBaseSepolia,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
