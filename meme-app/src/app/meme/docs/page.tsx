import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function DocsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white">
      <div className="mb-4">For more detail, please visit link</div>
      <Button className="ml-2 bg-green-500 text-white font-bold">
        <Link href="https://rustwarriors-docs.gitbook.io/rustwarriors-docs/">
          🚀 Documentation
        </Link>
      </Button>
    </div>
  );
}
