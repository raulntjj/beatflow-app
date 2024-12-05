"use client";

import React, { useContext, useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CardContent, CardTitle } from "@/components/ui/card";
import { UserContext } from "@/context/user-context";
import Image from "next/image";
import getToken from "@/utils/getToken";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { SlOptions } from "react-icons/sl";
import { MdOutlineDelete } from "react-icons/md";

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


  const deletePost = async () => {
    const userToken = await getToken();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${post.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (res.ok) {
        window.location.reload();
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Ocorreu um erro ao deletar o post.");
    }
  };


  return (
    <div className="w-full mx-auto shadow-none border-0 rounded-none bg-background ">
      <div className="p-0">
        <div className="flex items-center justify-between text-foreground">
          <div className="flex items-center gap-3">
            <a href={`/profile/${post.post.user.user}`} className="cursor-pointer flex justify-center items-center gap-3">
              <Avatar>
                <AvatarImage src={post.post.user.profile_photo_temp} />
                <AvatarFallback>
                  {post.post.user.user.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-sm font-medium">
                {post.post.user.user}
              </CardTitle>
            </a>
          </div>
          <div className="w-full flex items-end gap-4">
            <span className="w-full text-right text-xs text-gray-500">
              {formatDate(post.post.created_at)}
            </span>
            {userId?.toString() == post.post.user.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex w-fit justify-center tablet:justify-end items-center">
                    <SlOptions className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="tablet:w-[200px] bg-background border-zinc-700 p-2">
                  <DropdownMenuItem className="text-foreground cursor-pointer">
                    <MdOutlineDelete className="" />
                    <button onClick={deletePost} >Deletar Post</button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
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
            <div className="my-4">
              <span>{post.post.content}</span>
            </div>
            {post.post.participants.length > 0 && (
              <div className="mt-4 space-y-2">
                <span className="text-sm font-medium text-foreground">Participantes:</span>
                <ul className="space-y-3">
                  {post.post.participants.map((participant) => (
                    <li
                      key={participant.id}
                      className="flex items-center gap-3 text-xs text-gray-600"
                    >
                      <a href={`/profile/${participant.user}`} className="flex justify-center items-center gap-2">
                        <img
                          src={participant.avatarSrc}
                          alt={`${participant.name}'s avatar`}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm text-foreground/70">

                         {participant.name}
                        </span>
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
