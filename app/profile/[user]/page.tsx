"use client";

import { useContext, useEffect, useState } from "react";
import ProfilePhoto from "@/components/user/profile-photo";
import getToken from "@/utils/getToken";
import { UserContext } from "@/context/user-context";
import UserPost from "@/components/user/user-post";

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
    <div>
      <div>
        <ProfilePhoto src={userData?.profile_photo_temp} alt={userData?.name} />
        <h1>{userData?.user}</h1>
        <div className="flex gap-2">
          <span>Seguindo: {userData?.followed_count}</span>
          <span>Seguidores: {followersCount}</span>
        </div>
        <p>{userData?.bio}</p>
      </div>
      {!isSameUser && (
        <button className="p-2 bg-blue-600 rounded-md" onClick={handleFollow}>
          {isFollowing ? "Deixar de seguir" : "Seguir"}
        </button>
      )}
      {isSameUser && (
        <button
          className="p-2 bg-green-600 rounded-md"
          onClick={() => setIsEditing(true)}
        >
          Editar Perfil
        </button>
      )}
      <div className="relative flex flex-col space-y-10 w-[500px]">
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
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-xl mb-4">Editar Perfil</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block">Nome</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={userData.name}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block">Sobrenome</label>
                <input
                  type="text"
                  name="last_name"
                  defaultValue={userData.last_name}
                  className="border p-2 w-full"
                />
              </div>
              {/* <div className="mb-4">
                <label className="block">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={userData.email}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block">Usuário</label>
                <input
                  type="text"
                  name="user"
                  defaultValue={userData.user}
                  className="border p-2 w-full"
                />
              </div> */}
              <div className="mb-4">
                <label className="block">Foto de Perfil</label>
                <input
                  type="file"
                  name="profile_photo_path"
                  className="border p-2 w-full"
                  accept="image/*"
                />
              </div>
              <div className="mb-4">
                <label className="block">Biografia</label>
                <textarea
                  name="bio"
                  defaultValue={userData.bio}
                  className="border p-2 w-full"
                />
              </div>
              {/* <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_private"
                    defaultChecked={userData.is_private}
                    className="mr-2"
                  />
                  Perfil Privado
                </label>
              </div> */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-md"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  className="p-2 bg-gray-400 text-white rounded-md"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
