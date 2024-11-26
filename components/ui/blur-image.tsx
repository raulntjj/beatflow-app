/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import clsx from "clsx";
import Image from "next/image";
import React, { useState } from "react";

interface IBlurImage {
  height?: any;
  width?: any;
  src?: string | any;
  objectFit?: any;
  Unoptimized?: boolean | any;
  className?: string | any;
  alt?: string | undefined;
  layout?: any;

  [x: string]: any;
}

export const BlurImage = ({
  height,
  width,
  src,
  className,
  objectFit,
  Unoptimized,
  alt,
  layout,
  ...rest
}: IBlurImage) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={clsx(
        "transition duration-500",
        isLoading ? "blur-sm scale-100" : " blur-0 scale-100",
        className
      )}
      onLoadingComplete={() => setLoading(false)}
      src={src}
      unoptimized={Unoptimized}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={src}
      layout={layout}
      alt={alt ? alt : "Avatar"}
      {...rest}
    />
  );
};
