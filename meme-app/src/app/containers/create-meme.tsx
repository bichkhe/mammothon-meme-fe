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
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider, Contract, utils } from "ethers";
// import { utils } from "ethers";
import { EIP1193Provider } from "viem";
// import contractABI from "@/contracts/MyContractABI.json";
import memeContractABI from "@/contracts/MemeContract.json";

const memeContractAddress = "0xf3DB161c2Af54157772e734fb17f6bC1217D36A5";
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
  const { walletProvider } = useAppKitProvider("eip155");

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

  async function createMemeContract(imageUrl: string) {
    if (!isConnected) throw Error("User disconnected");

    const ethersProvider = new BrowserProvider(
      walletProvider as EIP1193Provider
    );
    const signer = await ethersProvider.getSigner();
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
    const amountInWei = 0.005e18; // buy 1 ETH
    const result = await USDTContract.createMemeContract(
      "Meme-Kitto",
      "MKT",
      imageUrl,
      amountInWei,
      utils.encodeBytes32String("hello")
    );
    // const amountInWei = ethers.parseUnits(amountInWei.toString(), 18);
    console.log(result);
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
