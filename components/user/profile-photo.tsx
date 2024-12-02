"use client";

import Image from "next/image";
import React from "react";

interface ProfilePhotoProps {
  src: string;
  alt: string;
}

export default function ProfilePhoto({ src, alt }: ProfilePhotoProps) {
  return (
    <div>
      <Image
        src={src}
        alt={alt}
        width={50}
        height={50}
        className="rounded-full"
      />
    </div>
  );
}
