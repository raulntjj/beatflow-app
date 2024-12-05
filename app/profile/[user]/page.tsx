"use client";

import { useContext, useEffect, useState } from "react";
import ProfilePhoto from "@/components/user/profile-photo";
import getToken from "@/utils/getToken";
import { UserContext } from "@/context/user-context";
import UserPost from "@/components/user/user-post";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { FileInputIcon } from "lucide-react";
import { FileUpload } from "../../../components/ui/file-upload";

interface UserData {
  id: number;
  user: string;
  profile_photo_temp: string;
  name: string;
  last_name: string;
  email: string;
  followers_count: string;
  followed_count: string;
  bio: string;
  is_private: boolean;
}

type Post = {
  created_at: string;
  media_temp: string;
  media_type: string;
  content: string;
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
  data: Post[];
};

interface Follow {
  followed_id: number;
}

export default function Profile({
  params,
}: {
  params: Promise<{ user: string }>;
}) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ user: string } | null>(
    null
  );
  const [followersCount, setFollowersCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const userSession = useContext(UserContext);

  useEffect(() => {
    params
      .then((resolved) => setResolvedParams(resolved))
      .catch(() => setError("Erro ao resolver parâmetros da URL."));
  }, [params]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userToken = await getToken();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/slug/${resolvedParams?.user}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Erro ao buscar usuário.");
        }

        const data = await res.json();
        setUserData(data.response);

        setFollowersCount(data.response.followers_count);
        setPosts(data.response.posts);

        const userProfileId = data.response.id;

        const resFollowed = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/me/followed`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        const follows = await resFollowed.json();

        const isAlreadyFollowing = follows.response.data.some(
          (follow: Follow) => follow.followed_id === userProfileId
        );

        setIsFollowing(isAlreadyFollowing);
      } catch {
        setError("Erro ao buscar dados do usuário.");
      }
    };

    if (resolvedParams?.user) {
      fetchUserData();
    }
  }, [resolvedParams]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Carregando...</div>;
  }

  const isSameUser = resolvedParams?.user === userSession?.user?.user;

  const handleFollow = async () => {
    const userToken = await getToken();

    const url = `${process.env.NEXT_PUBLIC_API_URL}/follows`;
    const method = isFollowing ? "DELETE" : "POST";
    const body = JSON.stringify({
      follower_id: userSession?.user?.id,
      followed_id: userData?.id,
    });

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body,
    });

    if (res.ok) {
      setIsFollowing(!isFollowing);
      setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
  
    formData.append('_method', 'PUT');
  
    try {
      const userToken = await getToken();
  
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/me`,
        {
          method: "POST", // Enviado como POST para suporte ao FormData com _method
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          body: formData,
        }
      );
  
      if (!res.ok) {
        throw new Error("Erro ao salvar as alterações.");
      }
  
      const updatedData = await res.json();
      setUserData(updatedData.response); // Atualiza os dados do usuário
      setIsEditing(false); // Fecha o modal
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar os dados. Verifique o console.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <div className="w-full flex flex-col justify-center items-center gap-5">
        <div className="w-full  flex justify-center items-center gap-5">
          <ProfilePhoto size="profile" src={userData?.profile_photo_temp} alt={userData?.name} />
          <div className="flex justify-start flex-col gap-5">
            <div className="flex justify-start items-center gap-5">
              <p className="text-lg">{userData?.user}</p> 
              {!isSameUser && (
                <Button size={"sm"} variant={"outline"} onClick={handleFollow}>
                  {isFollowing ? "Deixar de seguir" : "Seguir"}
                </Button>
              )}
              {isSameUser && (
                <Button size={"sm"} variant={"outline"} onClick={() => setIsEditing(true)}
                >
                  Editar Perfil
                </Button>
              )}
            </div>
            <div className="flex gap-5">
              <span className="text-sm">Seguindo: <span className="font-bold">{userData?.followed_count}    </span></span>
              <span className="text-sm">Seguidores: <span className="font-bold">{followersCount}</span></span>
            </div>
            <div>
              <p>{userData?.bio}</p>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center items-center gap-5">
          <span className="w-full h-full border border-zinc-700" />
          <span>
            Postagens
          </span>
          <span className="w-full h-full border border-zinc-700" />

          <span/>
        </div>
      </div>

      <div className="relative w-full flex flex-col space-y-10">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article key={post.id} className="w-full">
              <UserPost
                post={{
                  id: post.id,
                  post: {
                    user: {
                      id: String(userData?.id),
                      user: userData?.user || "",
                      profile_photo_temp: userData?.profile_photo_temp || "",
                    },
                    content: post.content,
                    media_type: post.media_type,
                    media_temp: post.media_temp,
                    created_at: post.created_at,
                  },
                }}
              />
            </article>
          ))
        ) : (
          <p>Nenhuma postagem.</p>
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-background p-4 rounded-md">
            <h2 className="text-xl mb-4">Editar Perfil</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="text-sm block text-zinc-500 pb-1">Nome</label>
                <Input
                  type="text"
                  name="name"
                  defaultValue={userData.name}
                  className="border p-2 w-full bg-zinc-800 border-zinc-700" 
                />
              </div>
              <div className="mb-4">
                <label className="text-sm block text-zinc-500 pb-1">Sobrenome</label>
                <Input
                  type="text"
                  name="last_name"
                  defaultValue={userData.last_name}
                  className="border p-2 w-full bg-zinc-800 border-zinc-700"
                />
              </div>
              <div className="mb-4">
                <label className="text-sm block text-zinc-500 pb-1">Foto de Perfil</label>
                <Input
                  type="file"
                  name="profile_photo_path"
                  className="border p-2 w-full bg-zinc-800 border-zinc-700"
                  accept="image/*"
                />
              </div>
              <div className="mb-4">
                <label className="text-sm block text-zinc-500 pb-1">Biografia</label>
                <Textarea
                  name="bio"
                  defaultValue={userData.bio}
                  className="border p-2 w-full bg-zinc-800 border-zinc-700"
                />
              </div>
              <div className="flex justify-around items-center gap-4">
                <Button
                  type="submit"
                  variant={"outline"}
                  className="w-full"
                >
                  Salvar
                </Button>
                <Button
                  type="button"
                  variant={"outline"}
                  className="w-full"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
