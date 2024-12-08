import React, { useContext, useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CardContent, CardTitle } from "@/components/ui/card";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { UserContext } from "@/context/user-context";
import getToken from "@/utils/getToken";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SlOptions } from "react-icons/sl";
import { MdOutlineDeleteForever } from "react-icons/md";

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
  const [isProcessing, setIsProcessing] = useState(false);

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

    if (years > 0) return rtf.format(-years, "year");
    if (months > 0) return rtf.format(-months, "month");
    if (days > 0) return rtf.format(-days, "day");
    if (hours > 0) return rtf.format(-hours, "hour");
    if (minutes > 0) return rtf.format(-minutes, "minute");
    return rtf.format(-seconds, "second");
  };

  const handleLike = async () => {
    if (isProcessing) return; // Bloqueia múltiplos cliques
    setIsProcessing(true); // Inicia o processamento

    const userToken = await getToken();

    try {
      if (liked) {
        if (likesCount <= 0) return; // Impede decremento abaixo de 0
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
        setLikesCount((prev) => Math.max(prev - 1, likesCount - 1));
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
        setLikesCount((prev) => Math.min(prev + 1, likesCount + 1));
      }
      setLiked(!liked); // Atualiza o estado do like
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsProcessing(false); // Finaliza o processamento
    }
  };

  const deletePost = async () => {
    const userToken = await getToken();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

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
    <div className="w-full mx-auto shadow-none border-0 rounded-none bg-background">
      <div className="p-0">
        <div className="flex items-center justify-between text-foreground">
          <div className="flex items-center gap-3">
            <a
              href={`/profile/${post.post.user.user}`}
              className="cursor-pointer"
            >
              <Avatar>
                <AvatarImage src={post.post.user.profile_photo_temp} />
                <AvatarFallback>
                  {post.post.user.user.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </a>
            <a
              href={`/profile/${post.post.user.user}`}
              className="cursor-pointer"
            >
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
                    <MdOutlineDeleteForever className="" />
                    <button onClick={deletePost}>Deletar Post</button>
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
