"use client";
import React from "react";
import NavBar from "../components/navbar"; // Adjust the import path as necessary
import { ConvexClientProvider } from "../ConvexClientProvider";
import { ThirdwebProvider } from "@thirdweb-dev/react";

// const convexUrl = process.env.VITE_CONVEX_URL;
// if (!convexUrl) {
//   throw new Error("VITE_CONVEX_URL is not defined");
// }
// const convex = new ConvexReactClient(convexUrl);
// const convexQueryClient = new ConvexQueryClient(convex);
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       queryKeyHashFn: convexQueryClient.hashFn(),
//       queryFn: convexQueryClient.queryFn(),
//     },
//   },
// });
// convexQueryClient.connect(queryClient);

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Rustwarriors Meme Marketplace",
//   description: "Generated by Rustwarriors Team - Mammothon 2025",
// };

const MainHomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // <ThirdwebProvider
    //   clientId="d9e4941f828ef19d6379f81337129438"
    //   activeChain="goerli"
    // >
    <ConvexClientProvider>
      <div className="h-screen min-h-screen max-h-screen overflow-auto bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <NavBar />
        <div className="flex flex-col w-full h-full">{children}</div>
      </div>
    </ConvexClientProvider>
    // </ThirdwebProvider>
  );
};

export default MainHomeLayout;
