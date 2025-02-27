import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white">
      <h1 className="mb-4">Meme App - Mammothon 2025</h1>
      <img
        src="/path/to/your/image.jpg"
        alt="Meme Image"
        className="w-1/2 h-auto rounded-lg shadow-lg mb-4"
      />
      <Button className="ml-2 bg-green-500 text-white font-bold">
        <Link href="/meme">Start journey</Link>
      </Button>
    </div>
  );
}
