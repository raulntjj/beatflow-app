"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/user-context";
import getToken from "@/utils/getToken";
import UserPost from "@/components/user/user-post";
import CreatePost from "@/components/user/create-post";
import { redirect } from "next/navigation";

type Post = {
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
};

type ApiResponse = {
  response: {
    data: Post[];
  };
};

export default function Feed() {
  const userData = useContext(UserContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userToken = await getToken();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/feed`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("Erro ao retornar posts.");
        }

        const data: ApiResponse = await res.json();

        // Usando o tipo `ApiResponse` e mapeando corretamente os dados
        setPosts(data.response.data);
      } catch (err) {
        console.error("Erro ao buscar posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleRedirect = () => {
    redirect("/profile/" + userData?.user?.user);
  };

  return (
    <div>
      <h1>Olá {userData?.user?.name}</h1>
      <br />
      <br />
      <button onClick={handleRedirect} className="p-2 bg-pink-400 rounded-md">
        Meu perfil
      </button>
      <br />
      <br />
      <h1>CRIAR NOVO POST</h1>
      <CreatePost />
      <br />
      <br />
      <h1>POSTS</h1>
      {loading ? (
        <p>Carregando posts...</p>
      ) : (
        <ul>
          {posts.length > 0 ? (
            posts.map((post) => (
              <li key={post.id}>
                <UserPost post={post} />
              </li>
            ))
          ) : (
            <p>Siga uma pessoa para que comecem a aparecer posts.</p>
          )}
        </ul>
      )}
    </div>
  );
}
