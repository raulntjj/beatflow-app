"use client";

import React, { useContext, useEffect, useState } from "react";
import ProfilePhoto from "./profile-photo";
import Image from "next/image";
import { UserContext } from "@/context/user-context";
import getToken from "@/utils/getToken";

export default function UserPost({ post }) {
  console.log(post.id);

  const [liked, setLiked] = useState(false);
  const userData = useContext(UserContext);
  const userId = userData?.user?.[0]?.id;

  // Buscar engajamentos
  const getEngagements = async () => {
    try {
      const userToken = await getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/me/posts/engagements?post_id=${post.id}`,
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

        console.log(engagements);

        // Verifica se há algum engajamento do tipo "like" para o post
        const userLiked = engagements.response.some(
          (engagement) =>
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
  }, [post.id, userId]); // Dependências: apenas executa quando estas mudam

  // Formatando horário de postagem
  const formatDate = (createdAt) => {
    const postDate = new Date(createdAt);
    const now = new Date();

    const diffInMilliseconds = now - postDate;

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
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post-engagements`, {
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
      } else {
        // Curtir o post
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post-engagements`, {
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
        <Image
          src={post.media_temp}
          alt={post.content}
          width={300}
          height={300}
        />
      </div>
      <div>
        <button
          onClick={handleLike}
          className={`p-2 ${
            liked ? "bg-blue-600" : "bg-red-600"
          } text-white rounded-sm`}
        >
          {liked ? "Descurtir" : "Gostei"}
        </button>
      </div>
    </div>
  );
}
