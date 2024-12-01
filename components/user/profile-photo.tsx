"use client";

import { UserContext } from "@/context/user-context";
import Image from "next/image";
import React from "react";

export default function ProfilePhoto({ src, alt }) {
  const user = React.useContext(UserContext);

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
