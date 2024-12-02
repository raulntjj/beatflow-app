"use client";

import React, { useContext, useEffect, useState } from "react";
import ProfilePhoto from "./profile-photo";
import Image from "next/image";
import { UserContext } from "@/context/user-context";
import getToken from "@/utils/getToken";
import { FaRegHeart, FaHeart } from "react-icons/fa";

interface Post {
  id: string;
  user: {
    id: string;
    user: string;
    profile_photo_temp: string;
  };
  content: string;
  media_type: string;
  media_temp: string;
  created_at: string;
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

  // Buscar engajamentos
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

        // Conta o número de likes para o post
        const likes = engagements.response.filter(
          (engagement: Engagement) => engagement.type === "like"
        ).length;
        setLikesCount(likes); // Inicializa o estado com a quantidade de likes

        // Verifica se há algum engajamento do tipo "like" para o post
        const userLiked = engagements.response.some(
          (engagement: Engagement) =>
            engagement.post_id === post.id && engagement.type === "like"
        );

        // Atualiza o estado 'liked' com base na verificação
        setLiked(userLiked);
      }
    } catch (error) {
      console.error("Erro ao buscar engajamentos:", error);
    }
  };

  useEffect(() => {
    getEngagements();
  }, [post.id, userId]);

  // Formatando horário de postagem
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

    const rtf = new Intl.RelativeTimeFormat("pt", { numeric: "auto" });

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

  // Realizar curtida
  const handleLike = async () => {
    const userToken = await getToken();

    try {
      if (liked) {
        // Descurtir o post
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
        setLikesCount((prev) => prev - 1); // Decrementa a contagem de likes
      } else {
        // Curtir o post
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
        setLikesCount((prev) => prev + 1); // Incrementa a contagem de likes
      }

      setLiked(!liked);
    } catch (error) {
      console.error("Erro ao realizar a requisição", error);
    }
  };

  return (
    <div className="w-[700px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ProfilePhoto
            src={post.user.profile_photo_temp}
            alt={post.user.user}
          />
          <span>{post.user.user}</span>
        </div>
        <div>
          <span>{formatDate(post.created_at)}</span>
        </div>
      </div>
      <div className="pt-2">
        <p>{post.content}</p>
      </div>
      {post.media_type === "image" && (
        <div>
          <Image
            src={post.media_temp}
            alt="Media do post"
            width={500}
            height={500}
          />
        </div>
      )}
      <div className="flex items-center gap-2 pt-2">
        <button onClick={handleLike} className="flex items-center gap-1">
          {liked ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-500" />
          )}
          <span>{likesCount}</span>
        </button>
      </div>
    </div>
  );
}
