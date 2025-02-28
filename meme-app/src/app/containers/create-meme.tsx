"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
// import UploadPhoto from "../components/meme-upload";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import {
  useAppKitProvider,
  useAppKitAccount,
  useAppKitNetwork,
} from "@reown/appkit/react";
import { BrowserProvider, Contract, Eip1193Provider, ethers } from "ethers";
// import { utils } from "ethers";
import type { Provider } from "@reown/appkit/react";

// import contractABI from "@/contracts/MyContractABI.json";
import memeContractABI from "@/contracts/MemeContract.json";
import { set } from "lodash";
// const INFURA_PROJECT_ID = "e11fea93e1e24107aa26935258904434";
// const SEPOLIA_RPC_URL = `https://base-sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;

const memeContractAddress = "0x82B7FC2e3bBf777D5e798C3bF5eE3a2F0eC057C4";
const formSchema = z.object({
  memeName: z.string().min(1, "Meme name is required"),
  initialPrice: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Initial price must be a valid number",
    })
    .refine((val) => parseFloat(val) <= 5, {
      message: "Initial price must be less than or equal to 5",
    }),
  files: z.instanceof(FileList),
});

const CreateMemeContainer = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { address, caipAddress, isConnected } = useAppKitAccount();
  const [lastMemeContract, setLastMemeContract] = useState("");
  console.log(
    "address",
    address,
    "caipAddress",
    caipAddress,
    "isConnected",
    isConnected
  );
  const { walletProvider } = useAppKitProvider<Provider>("eip155");
  const { caipNetwork, caipNetworkId, chainId, switchNetwork } =
    useAppKitNetwork();
  console.log(
    "caipNetwork",
    caipNetwork,
    "caipNetworkId",
    caipNetworkId,
    "chainId",
    chainId,
    "switchNetwork",
    switchNetwork
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _generateRandomString = (length: number) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const goBack = () => {
    window.history.back();
  };
  const generateUploadUrl = useMutation(api.meme_images.generateUploadUrl);
  // const sendImage = useMutation(api.meme_images.sendImage);
  const createMeme = useMutation(api.meme.createMeme);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const fileRef = form.register("files");

  const handleUpload = async (file: unknown) => {
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": "image/*" },
      body: file,
    });
    const json = await result.json();
    if (!result.ok) {
      throw new Error(`Upload failed: ${json.error}`);
    }
    console.log("json", json);
    const { storageId } = json;
    return storageId;
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      console.log(data);
      // Upload to IPFS
      const priceInWei = ethers.parseUnits(data.initialPrice.toString(), 18);
      const storageId = await handleUpload(data.files[0]);
      const shortName = data.memeName.substring(0, 5).toUpperCase();
      const contractAddress = await createMemeContract(
        data.memeName,
        shortName,
        priceInWei.toString(),
        storageId
      );
      if (!contractAddress) {
        throw new Error("Failed to create meme contract");
      }
      console.log("contractAddress:xxx", contractAddress);
      setLastMemeContract(contractAddress);
      // Insert to database

      const resp2 = await createMeme({
        meme: {
          name: data.memeName,
          addr: contractAddress || "failed",
          url: storageId,
          icon: storageId,
          price: priceInWei.toString(),
          market_cap: "0",
        },
      });
      console.log("resp2", resp2);
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  // const getProvider = (): ethers.BrowserProvider | null => {
  //   if (window.ethereum) {
  //     if (window.ethereum.providers?.length) {
  //       // If there are multiple providers, choose the first one or a specific provider

  //       console.log("window.ethereum.providers", window.ethereum.providers);
  //       const provider =
  //         (window.ethereum.providers as ethers.Eip1193Provider[]).find(
  //           (provider) => (provider as any).isMetaMask
  //         ) || (window.ethereum.providers as ethers.Eip1193Provider[])[0];
  //       return new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
  //     } else {
  //       // If there is only one provider
  //       return new ethers.BrowserProvider(
  //         window.ethereum as ethers.Eip1193Provider
  //       );
  //     }
  //   } else {
  //     alert(
  //       "No Ethereum provider found. Please install MetaMask or another wallet."
  //     );
  //     return null;
  //   }
  // };

  // const connectWallet = async () => {
  //   const provider = getProvider();
  //   if (!provider) return;

  //   try {
  //     const accounts = await provider.send("eth_requestAccounts", []);
  //     setAccount(accounts[0]);
  //     fetchBalance(accounts[0]);
  //   } catch (error) {
  //     console.error("Cannot connect to Wallet:", error);
  //   }
  // };

  async function createMemeContract(
    memeName: string,
    memeSymbol: string,
    initialPrice: string,
    imageUrl: string
  ) {
    if (!isConnected && !walletProvider) throw Error("User disconnected");
    try {
      // const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
      const provider = new ethers.BrowserProvider(
        window.ethereum as unknown as ethers.Eip1193Provider
      );
      // const provider = getProvider();
      // const ethersProvider = new BrowserProvider(
      //   provider as unknown as Eip1193Provider
      // );
      const signer = await provider.getSigner();
      // The Contract object
      const USDTContract = new Contract(
        memeContractAddress,
        memeContractABI,
        signer
      );
      // const salt = createSalt();
      const initialPriceInGwei = ethers.parseUnits(initialPrice, 18);
      // const amountInWei = 0.005e18; // buy 1 ETH
      const result = await USDTContract.createMemeContract(
        memeName,
        memeSymbol,
        imageUrl,
        initialPriceInGwei,
        address,
        ethers.keccak256(ethers.toUtf8Bytes(memeSymbol))
      );
      // we sleep 5 seconds to wait for the transaction to be mined
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const transaction = await provider.getTransactionReceipt(result.hash);
      if (transaction == undefined || transaction.logs.length == 0) {
        return null;
      }
      return transaction.logs[0].address;
    } catch (error) {
      console.error("Cannot connect to Wallet:", error);
      setError(error as unknown);
      return null;
    }
  }
  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-[800px] gap-4 bg-black p-8 rounded-md mt-[200px] ">
      {loading && <div className="text-white">Minting meme...</div>}
      {!success && !loading && !error && (
        <>
          <h1 className="text-2xl font-bold mb-4 text-white">
            Create Meme Contract
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full p-10 text-white flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="memeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meme Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter meme name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="initialPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Price</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Initial Price (in ETH). Eg: 0.005, maximum: 5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          // {...fieldProps}
                          placeholder="shadcn"
                          {...fileRef}
                          // onClick={handleUploadImage}
                          onChange={(event) => {
                            field.onChange(
                              event.target?.files?.[0] ?? undefined
                            );
                          }}
                        />
                        {/* <UploadPhoto /> */}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button
                type="submit"
                // color="red"
                // className="w-full text-black font-extrabold text-md"
                variant="default"
                className="font-extrabold text-md bg-red-600 hover:bg-red-500 mt-4"
              >
                Mint
              </Button>
            </form>
          </Form>
        </>
      )}
      {success && (
        <div className="text-white font-bold text-2xl">
          You created a meme coin successfully{" "}
          <Button onClick={goBack}>Go back</Button>
          <Button className="bg-green-500 text-white font-bold">
            {!lastMemeContract && <Link href={`/meme`}> Trading</Link>}
            {lastMemeContract && (
              <Link href={`/meme/market?addr=${lastMemeContract}`}>
                {" "}
                Trading
              </Link>
            )}
          </Button>
        </div>
      )}
      {error && (
        <div className="text-white font-bold text-2xl">
          Failed to create meme coin <Button onClick={goBack}>Go back</Button>
        </div>
      )}
    </div>
  );
};

export default CreateMemeContainer;
