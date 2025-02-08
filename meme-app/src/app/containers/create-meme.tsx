"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import UploadPhoto from "../components/meme-upload";

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

const formSchema = z.object({
  memeName: z.string().min(1, "Meme name is required"),
  files: z.instanceof(FileList),
});

const CreateMemeContainer = () => {
  const [success, setSuccess] = useState(false);
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
    console.log(data);
    // Upload to IPFS
    const storageId = await handleUpload(data.files[0]);

    // Call to smart contract to mint this coin
    const addr = "meme-addr";
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
  };

  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-[800px] gap-4 bg-black p-8 rounded-md mt-[200px] gap-3">
      {!success && (
        <>
          <h1 className="text-2xl font-bold mb-4 text-white">Create Meme</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full p-10 text-white"
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
              <Button type="submit">Submit</Button>
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
