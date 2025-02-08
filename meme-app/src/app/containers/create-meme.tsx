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

const formSchema = z.object({
  memeName: z.string().min(1, "Meme name is required"),
  files: z.instanceof(FileList),
});

const CreateMemeContainer = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const fileRef = form.register("files");

  // const uploadData = async () => {
  //   // Get any data that you want to upload
  //   const dataToUpload = image ? [image] : [];
  //   console.log("Uploading dataToUpload...", dataToUpload);
  //   // And upload the data with the upload function
  //   // const uris = await upload({ data: dataToUpload });
  //   // console.log(uris);
  // };

  // const handleUploadImage = async (e) => {};
  // const [memeName, setMemeName] = useState("");
  // const [image, setImage] = useState(null);
  // const [url, setUrl] = useState("");
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
      // alert("File uploaded successfully!");
    }
    return resp;
  };
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    // Upload to IPFS
    const respUrl = await uploadImage(data.files[0]);
    console.log("respUrl", respUrl);
  };

  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-[800px] gap-4 bg-black p-8 rounded-md mt-[200px]">
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
                  <Input type="text" placeholder="Enter meme name" {...field} />
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
                        field.onChange(event.target?.files?.[0] ?? undefined);
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
      {/* <Input
        type="text"
        placeholder="Meme Name"
        value={memeName}
        onChange={(e) => setMemeName(e.target.value)}
        className="mb-4 text-white"
      />*/}
      <div className="flex items-center gap-2">
        <UploadPhoto />
      </div>
      {/* <Button color="red" onClick={handleUpload2}>
        Upload Meme
      </Button> */}
      {/* {url && (
        <p>
          Uploaded to:{" "}
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </p>
      )} */}
    </div>
  );
};

export default CreateMemeContainer;
