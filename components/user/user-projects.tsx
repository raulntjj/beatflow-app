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
      name: string;
      user: string;
      profile_photo_temp: string;
    };
    content: string;
    media_type: string;
    media_temp: string;
    created_at: string;
    cover_temp: string;
    participants: Array<{
      id: string;
      name: string;
      user: string;
      avatarSrc: string;
    }>;
  };
}

export default function UserProject({ post }: { post: Post }) {
  const userData = useContext(UserContext);
  const userId = userData?.user?.id;
  // console.log(userData);
  // console.log(post);

  // Função para formatar a data
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

  // Criar lista de participantes incluindo o criador
  // const participants = [
  //   post.post.user.user,
  //   ...post.post.participants.map((participant) => participant.name),
  // ];

  return (
    <div className="w-full mx-auto shadow-none border-0 rounded-none bg-background ">
      <div className="p-0">
        <div className="flex items-center justify-between text-foreground">
          <div className="flex items-center gap-3">
            <a href={`/profile/${post.post.user.user}`} className="cursor-pointer">
              <Avatar>
                <AvatarImage src={post.post.user.profile_photo_temp} />
                <AvatarFallback>
                  {post.post.user.user.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </a>
            <a href={`/profile/${post.post.user.user}`} className="cursor-pointer">
              <CardTitle className="text-sm font-medium">
                {post.post.user.name}
              </CardTitle>
            </a>
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
            {post.post.participants.length > 0 && (
              <div className="mt-4">
                <span className="text-sm font-medium">Participantes:</span>
                <ul className="space-y-2">
                  {post.post.participants.map((participant) => (
                    <li
                      key={participant.id}
                      className="flex items-center gap-3 text-xs text-gray-600"
                    >
                      <a href={`/profile/${participant.user}`} className="cursor-pointer">
                        <img
                          src={participant.avatarSrc}
                          alt={`${participant.name}'s avatar`}
                          className="w-8 h-8 rounded-full"
                        />
                      </a>
                      <a href={`/profile/${participant.user}`} className="cursor-pointer">
                        {participant.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </div>
  );
}
