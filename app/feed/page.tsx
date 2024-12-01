"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/user-context";
import getToken from "@/utils/getToken";
import UserPost from "@/components/user/user-post";

type Post = {
  id: number;
  post: {
    content: string;
    media_temp: string;
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

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/me/feed`,
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
                <UserPost post={post.post} />
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
