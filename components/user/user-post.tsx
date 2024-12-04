"use client";

import React, { useContext, useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CardContent, CardTitle } from "@/components/ui/card";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { UserContext } from "@/context/user-context";
import getToken from "@/utils/getToken";
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
  };
}

interface Engagement {
  type: string;
  post_id: string;
  user_id: string;
}

export default function UserPost({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const userData = useContext(UserContext);
  const userId = userData?.user?.id;

  // Fetch engagements
  const getEngagements = async () => {
    try {
      const userToken = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/me/posts/engagements?post_id=${post.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (res.ok) {
        const engagements = await res.json();
        const likes = engagements.response.filter(
          (engagement: Engagement) => engagement.type === "like"
        ).length;
        setLikesCount(likes);

        const userLiked = engagements.response.some(
          (engagement: Engagement) =>
            engagement.post_id === post.id && engagement.type === "like"
        );
        setLiked(userLiked);
      }
    } catch (error) {
      console.error("Error fetching engagements:", error);
    }
  };

  useEffect(() => {
    getEngagements();
  }, [post.id, userId]);

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

  const handleLike = async () => {
    const userToken = await getToken();

    try {
      if (liked) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post-engagements`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            post_id: post.id,
            user_id: userId,
            type: "like",
          }),
        });
        setLikesCount((prev) => prev - 1);
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post-engagements`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            post_id: post.id,
            user_id: userId,
            type: "like",
          }),
        });
        setLikesCount((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

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
            {post.post.media_type === "image" && (
              <Image
                src={post.post.media_temp}
                alt="Post media"
                className="rounded-lg"
                width={1440}
                height={1800}
              />
            )}
            {post.post.media_type === "audio" && (
              <audio controls className="mt-4 w-full">
                <source src={post.post.media_temp} type="audio/mp3" />
                Seu navegador não suporta esse audio.
              </audio>
            )}
          </div>
          <div className="flex items-center gap-3 my-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 !no-underline"
            >
              {liked ? (
                <FaHeart className="text-red-500 w-6 h-6 cursor-pointer" />
              ) : (
                <FaRegHeart className="text-foreground w-6 h-6 cursor-pointer" />
              )}
              <span className="text-sm font-medium text-gray-500">
                {likesCount} curtidas
              </span>
            </button>
          </div>
          <CardContent className="p-0">
            <div className="mb-4">
              <div className="inline-block mr-1">
                <div className="inline">
                  <span className="m-0">{post.post.user.user}</span>
                </div>
              </div>
              <span>{post.post.content}</span>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
