"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/user-context";
import getToken from "@/utils/getToken";
import UserPost from "@/components/user/user-post";
import { redirect } from "next/navigation";
import SearchUsers from "../../components/navbar/search-users";

type Post = {
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
    <>
      <div className="w-full">
        {loading ? (
          <p>Carregando posts...</p>
        ) : (
          <div className="relative flex flex-col space-y-10">
            {posts.length > 0 ? (
              posts.map((post) => (
                <article key={post.id} className="w-full">
                  <UserPost post={post} />
                </article>
              ))
            ) : (
              <p>Nenhuma postagem.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
