"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/user-context";
import getToken from "@/utils/getToken";

type Post = {
  id: number;
  content: string;
};

export default function Feed() {
  const userData = useContext(UserContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userToken = await getToken();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Erro ao retornar posts.");
        }

        const data = await res.json();
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

  return (
    <div>
      <h1>Olá {userData?.user?.[0]?.name}</h1>
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
                <h2>Id: {post.id}</h2>
                <h2>Conteúdo: {post.content}</h2>
              </li>
            ))
          ) : (
            <p>Nenhum post encontrado.</p>
          )}
        </ul>
      )}
    </div>
  );
}
