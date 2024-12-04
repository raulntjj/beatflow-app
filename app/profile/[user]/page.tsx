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
  followers_count: string;
  followed_count: string;
  bio: string;
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
      <div className="relative flex flex-col space-y-10 w-[500px]">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article key={post.id} className="w-full">
              {/* Transformar o dado para que siga o formato esperado */}
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
    </div>
  );
}
