"use client";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/user-context";
import { Button } from "../ui/button";
import getToken from "@/utils/getToken";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { AudioUploadProjects } from "./audio-upload-projects";
import { ImageUploadProjects } from "./image-upload-projects";
import { LucideDisc3 } from "lucide-react";
import SearchUsersProjects from "../navbar/search-users-projects";
import { toast } from "sonner"; // Adicionado para notificações
import { FaCheck } from "react-icons/fa";

export default function CreateProjects() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const userData = useContext(UserContext);
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [projectData, setProjectData] = useState({
    name: "",
    title: "",
    content: "",
    cover_path: null as File | null,
    cover_pathType: "",
    media_path: null as File | null,
    media_type: "audio",
  });

  const [isPosting, setIsPosting] = useState(false);

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

    setLoading(true);

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
      formData.append("cover_path", projectData.cover_path);
      formData.append("cover_pathType", projectData.cover_pathType);
    }

    if (projectData.media_path) {
      formData.append("media_path", projectData.media_path);
      formData.append("media_type", projectData.media_type);
    }

    formData.append("owner_id", ownerId.toString());
    formData.append(
      "participants",
      JSON.stringify(selectedUsers.map((user) => user.id))
    );

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
      toast.success("Projeto criado com sucesso!", {
        action: {
          label: <FaCheck className="text-green-600 h-5 w-5" />,
          onClick: () => {},
        },
      });

      setIsDialogOpen(false); // Fecha o diálogo
      setProjectData({
        name: "",
        title: "",
        content: "",
        cover_path: null,
        cover_pathType: "",
        media_path: null,
        media_type: "audio",
      }); // Reseta os formulários
      setSelectedUsers([]); // Limpa os usuários selecionados

      console.log("Projeto criado com sucesso:", data);
    } catch (err) {
      console.error("Erro ao criar projeto:", err);
      toast.error("Erro ao criar o projeto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className="flex w-full justify-center tablet:justify-start items-center">
        <LucideDisc3 className="tablet:mr-3 h-7 w-7" />
        <span className="hidden tablet:block">Criar Projeto</span>
      </DialogTrigger>
      <DialogContent className="border-zinc-700 bg-background w-full">
        <DialogHeader>
          <DialogTitle className="text-center">Criar novo projeto</DialogTitle>
        </DialogHeader>
        <SearchUsersProjects
          users={users}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          ownerId={userData?.user?.id ?? 0}
        />
        <div className="flex flex-col items-center justify-center">
          <form onSubmit={handleFormSubmit} encType="multipart/form-data" className="w-full">
            <Input
              type="text"
              placeholder="Nome do projeto"
              className="mb-4"
              value={projectData.name}
              onChange={(e) =>
                setProjectData({ ...projectData, name: e.target.value })
              }
            />
            <Textarea
              placeholder="Descrição do projeto"
              value={projectData.content}
              onChange={(e) =>
                setProjectData({ ...projectData, content: e.target.value })
              }
              className="mt-2 bg-zinc-800 border border-zinc-700 text-white focus:ring-blue-500 focus:border-blue-500 rounded-md w-full p-2 resize-none"
              rows={2}
            />
            <div className="flex flex-col tablet:flex-row justify-center items-center">
              <AudioUploadProjects
                onFileChange={(file, fileType) =>
                  setProjectData({ ...projectData, media_path: file, media_type: fileType })
                }
              />
              <ImageUploadProjects
                onFileChange={(file, fileType) =>
                  setProjectData({ ...projectData, cover_path: file, cover_pathType: fileType })
                }
              />
            </div>
            <div className="w-full flex">
              (isPosting ? (<p className="p-4 text-foreground/70">Postando ...</p>) :
              (
              <Button
                type="submit"
                variant="outline"
                className="w-[85%] mx-auto mt-6"
              >
                Postar Projeto
              </Button>
               ))
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
