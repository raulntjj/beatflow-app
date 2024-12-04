"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/user-context";
import getToken from "@/utils/getToken";
import UserProject from "@/components/user/user-projects";
import SearchUsers from "@/components/navbar/search-users-projects";

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
        <p>Carregando projetos...</p>
      ) : (
        <div className="relative flex flex-col space-y-10">
          <SearchUsers
            users={users}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            ownerId={userData?.user?.id ?? 0}
          />

          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Nome do projeto"
              value={projectData.name}
              onChange={(e) =>
                setProjectData({ ...projectData, name: e.target.value })
              }
            />
            <textarea
              placeholder="Descrição do projeto"
              value={projectData.content}
              onChange={(e) =>
                setProjectData({ ...projectData, content: e.target.value })
              }
            />
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setProjectData({
                    ...projectData,
                    cover_path: e.target.files[0],
                    cover_pathType: e.target.files[0].type,
                  });
                }
              }}
            />
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setProjectData({
                    ...projectData,
                    media_path: e.target.files[0],
                    media_type: "audio",
                  });
                }
              }}
            />
            <button type="submit">Criar Projeto</button>
          </form>

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
