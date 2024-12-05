"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/user-context";
import getToken from "@/utils/getToken";
import UserProjects from "@/components/user/user-projects";
import { Skeleton } from "../../../components/ui/skeleton";

export default function Projects() {
  const userData = useContext(UserContext);
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]); // Usuários selecionados para o projeto
  const [projectData, setProjectData] = useState({
    name: "",
    title: "",
    content: "",
    cover_path: null as File | null, // Alterado para cover_path
    cover_pathType: "", // Alterado para cover_pathType
    media_path: null as File | null, // Novo campo para o arquivo de áudio
    media_type: "audio", // Novo campo para o tipo de áudio
  });

  useEffect(() => {
    const fetchUsers = async () => {
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
          throw new Error("Erro ao retornar projetos.");
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
        console.error("Erro ao buscar projetos:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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

        const formattedPosts = data.response.data.map((project: any) => ({
          id: project.id,
          post: {
            user: {
              id: project.owner.id,
              name: `${project.owner.name} ${project.owner.last_name}`,
              user: `${project.owner.user}`,
              profile_photo_temp: project.owner.profile_photo_temp || "",
            },
            content: project.content,
            cover_temp: project.cover_temp,
            media_type: project.media_type,
            media_temp: project.media_temp,
            created_at: project.created_at,
            participants: project.participants.map((participant: any) => ({
              id: participant.id,
              name: `${participant.name} ${participant.last_name}`,
              user: `${participant.user}`,
              avatarSrc: participant.profile_photo_temp || "",
            })),
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ownerId = userData?.user?.id;
    if (!ownerId) {
      alert("Owner ID is required");
      return;
    }

    if (!projectData.name) {
      alert("Project name is required");
      return;
    }

    const userToken = await getToken();
    const formData = new FormData();
    formData.append("name", projectData.name);
    formData.append("content", projectData.content);

    if (projectData.cover_path) {
      // Manter o nome do arquivo corretamente
      formData.append("cover_path", projectData.cover_path);
      formData.append("cover_pathType", projectData.cover_pathType);
    }

    if (projectData.media_path) {
      // Manter o nome do arquivo corretamente
      formData.append("media_path", projectData.media_path);
      formData.append("media_type", projectData.media_type);
    }

    formData.append("owner_id", ownerId.toString());
    formData.append(
      "participants",
      JSON.stringify(selectedUsers.map((user) => user.id))
    );

    console.log(formData);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Erro ao criar projeto.");
      }

      const data = await res.json();
      console.log("Projeto criado com sucesso:", data);
    } catch (err) {
      console.error("Erro ao criar projeto:", err);
    }
  };

  return (
    <div className="w-[600px]">
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
                <UserProjects post={post} />
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
