// import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from "next/server";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

export async function POST(req: NextRequest) {
  console.log("POST /api/post-photo");
  const formData = await req.formData();
  const filename = req.nextUrl.searchParams.get("filename") as string;
  const contentType = req.nextUrl.searchParams.get("contentType") as string;
  console.log("filename", filename);
  try {
    const SECRET_KEY =
      "cm4Nxzt3Dvk8VGUFzRxVJeg8XwE05yOxkHTbLxIeffgI4bQ7mBdwOF-Hs89oeuCFMFfPocJSevB5O_svnRNjAA";
    const storage = new ThirdwebStorage({
      secretKey: SECRET_KEY,
    });
    const buf = Buffer.from(formData.get("file")?.toString()!, "base64");
    console.info("buf", buf);
    const metadata = "metadata";
    // Here we get the IPFS URI of where our metadata has been uploaded
    // const uri = await storage.upload({
    //   filename,
    //   contentType,
    //   // buf,
    // });
    console.info("starting upload...", metadata);
    const uri = await storage.upload(metadata);
    // This will log a URL like ipfs://QmWgbcjKWCXhaLzMz4gNBxQpAHktQK6MkLvBkKXbsoWEEy/0
    //ipfs://QmUBAfQ6hWfnXxmBktFQt7thfMVdbWQ5tQu3iEYnmG6PCy/0
    console.info("urixxxx", uri);
    return NextResponse.json({ status: 0, data: { uri: "1222" } });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message });
    }
    return NextResponse.json({ error: "An unknown error occurred" });
  }
}
