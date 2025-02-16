import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueries, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const UploadPhoto = () => {
  const generateUploadUrl = useMutation(api.meme_images.generateUploadUrl);
  const sendImage = useMutation(api.meme_images.sendImage);
  //   const queryByStorageId = useQuery(api.meme_images.queryByStorageId);
  const createMeme = useMutation(api.meme.createMeme);

  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("event.target.files", event.target.files);
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
    // setFile(ref.current?.files?.[0] || null);
  };

  const handleUpload = async () => {
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": "image/png" },
      body: file,
    });
    const json = await result.json();
    if (!result.ok) {
      throw new Error(`Upload failed: ${json.error}`);
    }
    console.log("json", json);
    const { storageId } = json;
    // const resp = await sendImage({ storageId, image: storageId });
    // console.log("resp", resp);
    // const url = await queryByStorageId({ storageId });
    // console.log("urlxxx", url);
    const resp2 = await createMeme({
      meme: {
        name: "test",
        addr: "test",
        url: storageId,
        icon: storageId,
        market_cap: "test",
        description: "kitto test",
      },
    });

    console.log("resp2", resp2);

    // if (!file) return;
    // const uploadUrl = `/api/post-photo?filename=${file.name}&contentType=${file.type}`;
    // console.log("uploading file:", uploadUrl);

    // const formData = new FormData();
    // formData.append("file", file);

    // const resp = await fetch(uploadUrl, {
    //   method: "POST",
    //   body: formData,
    // });

    // if (resp) {
    //   console.log(resp);
    //   alert("File uploaded successfully!");
    // }
  };

  return (
    <div className="flex flex-col md:flex-row gap-1">
      <Input
        type="file"
        onChange={(e) => handleFileChange(e)}
        placeholder="*.png, *jpeg"
      />
      <Button onClick={handleUpload} color="red">
        Send
      </Button>
    </div>
  );
};

export default UploadPhoto;
