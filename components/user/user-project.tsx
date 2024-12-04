"use client";

import React, { useContext, useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CardContent, CardTitle } from "@/components/ui/card";
import { UserContext } from "@/context/user-context";
import Image from "next/image";

interface Post {
  id: string;
  post: {
    user: {
      id: string;
      user: string;
      profile_photo_temp: string;
    };
    content: string;
    media_type: string;
    media_temp: string;
    created_at: string;
    cover_temp: string;
  };
}

export default function UserProject({ post }: { post: Post }) {
  const userData = useContext(UserContext);
  const userId = userData?.user?.id;

  const formatDate = (createdAt: string) => {
    const postDate = new Date(createdAt);
    const now = new Date();

    const diffInMilliseconds = now.getTime() - postDate.getTime();

    const seconds = Math.floor(diffInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (years > 0) {
      return rtf.format(-years, "year");
    } else if (months > 0) {
      return rtf.format(-months, "month");
    } else if (days > 0) {
      return rtf.format(-days, "day");
    } else if (hours > 0) {
      return rtf.format(-hours, "hour");
    } else if (minutes > 0) {
      return rtf.format(-minutes, "minute");
    } else {
      return rtf.format(-seconds, "second");
    }
  };

  console.log(post);

  return (
    <div className="w-full mx-auto shadow-none border-0 rounded-none bg-background ">
      <div className="p-0">
        <div className="flex items-center justify-between text-foreground">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.post.user.profile_photo_temp} />
              <AvatarFallback>
                {post.post.user.user.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-sm font-medium">
              {post.post.user.user}
            </CardTitle>
          </div>
          <span className="text-xs text-gray-500">
            {formatDate(post.post.created_at)}
          </span>
        </div>
      </div>
      <div className="ml-[19px] pl-5 pb-10 mt-1 border-l-[2px] border-zinc-700">
        <div>
          <div className="text-foreground">
            <Image
              src={post.post.cover_temp}
              alt="Post media"
              className="rounded-lg"
              width={1440}
              height={1800}
            />

            <audio controls className="mt-4 w-full">
              <source src={post.post.media_temp} type="audio/mp3" />
              Seu navegador não suporta esse audio.
            </audio>
          </div>
          <CardContent className="p-0">
            <div className="mb-4">
              <span>{post.post.content}</span>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
