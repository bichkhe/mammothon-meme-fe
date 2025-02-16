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
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { EIP1193Provider } from "viem";
import contractABI from "@/contracts/MyContractABI.json";

const USDTAddress = "0x617f3112bf5397D0467D315cC709EF968D9ba546";

const formSchema = z.object({
  memeName: z.string().min(1, "Meme name is required"),
  files: z.instanceof(FileList),
});

const CreateMemeContainer = () => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { address, caipAddress, isConnected } = useAppKitAccount();
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

  const handleUpload = async (file: any) => {
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

  const uploadImage = async (file: any) => {
    if (!file) return;
    const uploadUrl = `/api/post-photo?filename=${file.name}&contentType=${file.type}`;
    console.log("uploading file:", uploadUrl);

    const formData = new FormData();
    formData.append("file", file.file);

    const resp = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (resp) {
      console.log(resp);
    }
    return resp;
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
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  async function createMemeContract() {
    if (!isConnected) throw Error("User disconnected");

    const ethersProvider = new BrowserProvider(
      walletProvider as EIP1193Provider
    );
    const signer = await ethersProvider.getSigner();
    // The Contract object
    const USDTContract = new Contract(USDTAddress, contractABI, signer);
    const USDTBalance = await USDTContract.buy("2221xx");

    console.log(formatUnits(USDTBalance, 18));
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
