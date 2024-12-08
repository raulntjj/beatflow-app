"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/user-context";
import getToken from "@/utils/getToken";
import UserPost from "@/components/user/user-post";
import { Skeleton } from "@/components/ui/skeleton";

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

const FeedSkeleton = () => (
  <div className="space-y-4">
    {[...Array(4)].map((_, index) => (
      <div
        key={index}
        className="w-full mx-auto shadow-none border-0 rounded-none bg-background"
      >
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
        </div>
      </div>
    ))}
  </div>
);

export default function Feed() {
  const userData = useContext(UserContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const userToken = await getToken();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/me/feed`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data: ApiResponse = await response.json();
        setPosts(data.response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts([]);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (error) {
    return <div className="w-full text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="w-full">
      <div className="relative flex flex-col space-y-10">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article key={post.id} className="w-full">
              <UserPost post={post} />
            </article>
          ))
        ) : (
          <p className="text-center text-gray-500">No posts available</p>
        )}
      </div>
    </div>
  );
}
