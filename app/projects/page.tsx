"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/user-context";
import getToken from "@/utils/getToken";
import UserProject from "@/components/user/user-project";
import SearchUsers from "@/components/navbar/search-usersv2";

export default function Projects() {
  const userData = useContext(UserContext);
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userToken = await getToken();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("Erro ao retornar posts.");
        }

        const data = await res.json();

        const formattedUsers = data.response.data.map((user: any) => ({
          id: user.id,
          name: user.name,
          username: user.last_name,
          user: user.user,
          avatarSrc: user.profile_photo_temp,
        }));

        setUsers(formattedUsers);
      } catch (err) {
        console.error("Erro ao buscar posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userToken = await getToken();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("Erro ao retornar posts.");
        }

        const data = await res.json();

        console.log(data);

        // Transformando os dados para o formato esperado por UserPost
        const formattedPosts = data.response.data.map((project: any) => ({
          id: project.id,
          post: {
            user: {
              id: project.owner.id,
              user: `${project.owner.name} ${project.owner.last_name}`,
              profile_photo_temp: project.owner.profile_photo_temp || "",
            },
            content: project.content,
            cover_temp: project.cover_temp,
            media_type: project.media_type,
            media_temp: project.media_temp,
            created_at: project.created_at,
          },
        }));

        setPosts(formattedPosts);
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
    <div className="w-[600px]">
      {loading ? (
        <p>Carregando posts...</p>
      ) : (
        <div className="relative flex flex-col space-y-10">
          <SearchUsers users={users} />

          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.id} className="w-full">
                <UserProject post={post} />
              </article>
            ))
          ) : (
            <p>Nenhuma postagem.</p>
          )}
        </div>
      )}
    </div>
  );
}
