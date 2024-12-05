"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/user-context";
import getToken from "@/utils/getToken";
import UserPost from "@/components/user/user-post";
import { redirect } from "next/navigation";

import { Skeleton } from "../../components/ui/skeleton";

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
        <div className="space-y-4">
          <div className="w-full mx-auto shadow-none border-0 rounded-none bg-background">
            <div className="p-0">
              <div className="flex items-center justify-between text-foreground">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="w-32 h-4 mb-2" />
                    <Skeleton className="w-24 h-3" />
                  </div>
                </div>
                <Skeleton className="w-16 h-3" />
              </div>
            </div>
            <div className="ml-[19px] pl-5 pb-10 mt-1 border-l-[2px] border-zinc-700">
              <Skeleton className="w-full h-64 rounded-lg mb-4" />
              <Skeleton className="w-3/4 h-4 mb-4" />
              <Skeleton className="w-1/2 h-4 mb-4" />
              <div className="mt-4 space-y-2">
                <Skeleton className="w-1/4 h-4" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-32 h-3" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-32 h-3" />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mx-auto shadow-none border-0 rounded-none bg-background">
            <div className="p-0">
              <div className="flex items-center justify-between text-foreground">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="w-32 h-4 mb-2" />
                    <Skeleton className="w-24 h-3" />
                  </div>
                </div>
                <Skeleton className="w-16 h-3" />
              </div>
            </div>
            <div className="ml-[19px] pl-5 pb-10 mt-1 border-l-[2px] border-zinc-700">
              <Skeleton className="w-full h-64 rounded-lg mb-4" />
              <Skeleton className="w-3/4 h-4 mb-4" />
              <Skeleton className="w-1/2 h-4 mb-4" />
              <div className="mt-4 space-y-2">
                <Skeleton className="w-1/4 h-4" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-32 h-3" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-32 h-3" />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mx-auto shadow-none border-0 rounded-none bg-background">
            <div className="p-0">
              <div className="flex items-center justify-between text-foreground">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="w-32 h-4 mb-2" />
                    <Skeleton className="w-24 h-3" />
                  </div>
                </div>
                <Skeleton className="w-16 h-3" />
              </div>
            </div>
            <div className="ml-[19px] pl-5 pb-10 mt-1 border-l-[2px] border-zinc-700">
              <Skeleton className="w-full h-64 rounded-lg mb-4" />
              <Skeleton className="w-3/4 h-4 mb-4" />
              <Skeleton className="w-1/2 h-4 mb-4" />
              <div className="mt-4 space-y-2">
                <Skeleton className="w-1/4 h-4" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-32 h-3" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-32 h-3" />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mx-auto shadow-none border-0 rounded-none bg-background">
            <div className="p-0">
              <div className="flex items-center justify-between text-foreground">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="w-32 h-4 mb-2" />
                    <Skeleton className="w-24 h-3" />
                  </div>
                </div>
                <Skeleton className="w-16 h-3" />
              </div>
            </div>
            <div className="ml-[19px] pl-5 pb-10 mt-1 border-l-[2px] border-zinc-700">
              <Skeleton className="w-full h-64 rounded-lg mb-4" />
              <Skeleton className="w-3/4 h-4 mb-4" />
              <Skeleton className="w-1/2 h-4 mb-4" />
              <div className="mt-4 space-y-2">
                <Skeleton className="w-1/4 h-4" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-32 h-3" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-32 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
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
