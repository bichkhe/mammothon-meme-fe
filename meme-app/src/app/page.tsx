import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 text-4xl font-bold">
      Meme App - Mammothon 2025{" "}
      <Button className="ml-2 bg-green-500 text-white font-bold">
        <Link href="/meme">Start journey</Link>
      </Button>
    </div>
  );
}
