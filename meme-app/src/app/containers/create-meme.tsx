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
// const INFURA_PROJECT_ID = "e11fea93e1e24107aa26935258904434";
// const SEPOLIA_RPC_URL = `https://base-sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;

// const memeContractAddress = "0xf3DB161c2Af54157772e734fb17f6bC1217D36A5";
// const memeContractAddress = "0x5d1cA17202eaf101c114903fAd2EF8F30EA95be9";
const memeContractAddress = "0x3a8D97356D47b5BBE2e42E3e7827C0915f3dB7e4";
const formSchema = z.object({
  memeName: z.string().min(1, "Meme name is required"),
  files: z.instanceof(FileList),
});

const CreateMemeContainer = () => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { address, caipAddress, isConnected } = useAppKitAccount();
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
      const storageId = await handleUpload(data.files[0]);

      // Call to smart contract to mint this coin
      const generateRandomString = (length: number) => {
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }
        return result;
      };

      const addr = generateRandomString(10);

      const result = await createMemeContract(storageId);
      console.log("result", result);
      // Insert to database
      const resp2 = await createMeme({
        meme: {
          name: data.memeName,
          addr: addr,
          url: storageId,
          icon: storageId,
          market_cap: "1000000",
          description: "kitto test",
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

  async function createMemeContract(imageUrl: string) {
    if (!isConnected && !walletProvider) throw Error("User disconnected");

    // const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    const provider = new ethers.BrowserProvider(
      window.ethereum as unknown as ethers.Eip1193Provider
    );
    // const provider = getProvider();
    console.log("provider:-------", provider);
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

    /*
        {
          "name": "name",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "symbol",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "metadata",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "initialPrice",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "owner",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_salt",
          "type": "bytes32",
          "internalType": "bytes32"
        }
    */

    // const salt = createSalt();
    const amountInWei = ethers.parseUnits("0.005", 18);
    // const amountInWei = 0.005e18; // buy 1 ETH
    console.log(
      "ethers.encodeBytes32String",
      ethers.encodeBytes32String("1233")
    );
    const result = await USDTContract.createMemeContract(
      "Meme-Kitto1",
      "MKT1",
      imageUrl,
      amountInWei,
      address,
      // ethers.keccak256("1233")
      ethers.keccak256(ethers.toUtf8Bytes("MemeCoinv11"))
      // ethers.encodeBytes32String("1233")
    );
    // const amountInWei = ethers.parseUnits(amountInWei.toString(), 18);
    console.log(result);
    return result;
  }

  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-[800px] gap-4 bg-black p-8 rounded-md mt-[200px] ">
      {loading && <div className="text-white">Minting meme...</div>}
      {!success && !loading && (
        <>
          <h1 className="text-2xl font-bold mb-4 text-white">Create Meme</h1>
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
                color="red"
                // className="w-full text-black font-extrabold text-md"
                variant="default"
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
            <Link href="/meme/trading"> Trading</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreateMemeContainer;
