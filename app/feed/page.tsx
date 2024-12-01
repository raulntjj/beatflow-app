import React from "react";
import { cookies } from "next/headers";

type Post = {
  id: number;
  content: string;
};

export default async function Feed() {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("token")?.value;

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar posts.");
      }

      const data = await res.json();
      return data.response.data;
    } catch (err) {
      return [];
    }
  };

  const posts = await fetchPosts();

  return (
    <div>
      <ul>
        {posts.length > 0 ? (
          posts.map((post: Post) => (
            <li key={post.id}>
              <h2>Id: {post.id}</h2>
              <h2>Conteúdo: {post.content}</h2>
            </li>
          ))
        ) : (
          <p>Nenhum post encontrado.</p>
        )}
      </ul>
    </div>
  );
}
