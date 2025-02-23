interface MemeCoinLogoProps {
  src: string;
  alt: string;
  size?: number;
}

import Image from "next/image";

export default function MemeCoinLogo({
  src,
  alt,
  size = 80,
}: MemeCoinLogoProps) {
  return (
    <div className="flex items-center justify-center p-2">
      <Image
        src={src}
        alt={alt}
        // className="rounded-full"
        width={size}
        height={size}
      />
    </div>
  );
}
