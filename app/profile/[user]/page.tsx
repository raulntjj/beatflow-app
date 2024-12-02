"use client";

import { useContext, useEffect, useState } from "react";
import ProfilePhoto from "@/components/user/profile-photo";
import getToken from "@/utils/getToken";
import { use } from "react";
import { UserContext } from "@/context/user-context";

interface UserData {
  id: number;
  user: string;
  profile_photo_temp: string;
  name: string;
  followers_count: string;
  followed_count: string;
  bio: string;
}

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

  const resolvedParams = use(params);

  const userSession = useContext(UserContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userToken = await getToken();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/slug/${resolvedParams.user}`,
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
        console.log(data);

        console.log(data);
        const userProfileId = data.response.id; // Use const

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

        // Verify if the logged-in user is following the profile
        const isAlreadyFollowing = follows.response.data.some(
          (follow: Follow) => follow.followed_id === userProfileId
        );

        setIsFollowing(isAlreadyFollowing);
      } catch {
        setError("Erro ao buscar dados do usuário.");
      }
    };

    if (resolvedParams) {
      fetchUserData();
    }
  }, [resolvedParams]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Carregando...</div>;
  }

  const isSameUser = resolvedParams.user === userSession?.user?.user;

  const handleFollow = async () => {
    const userToken = await getToken();

    if (isFollowing) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follows`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          follower_id: userSession?.user?.id,
          followed_id: userData?.id,
        }),
      });
      if (res.ok) {
        setIsFollowing(!isFollowing);
      }
    } else {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          follower_id: userSession?.user?.id,
          followed_id: userData?.id,
        }),
      });
      if (res.ok) {
        setIsFollowing(!isFollowing);
      }
    }
  };

  return (
    <div>
      <div>
        <ProfilePhoto src={userData?.profile_photo_temp} alt={userData?.name} />
        <h1>{userData?.user}</h1>
        <div className="flex gap-2">
        <span>Seguindo: {userData?.followed_count}</span>
        <span>Seguidores: {userData?.followers_count}</span>
        </div>
        <p>{userData?.bio}</p>
      </div>
      {!isSameUser && (
        <button className="p-2 bg-blue-600 rounded-md" onClick={handleFollow}>
          {isFollowing ? "Deixar de seguir" : "Seguir"}
        </button>
      )}
    </div>
  );
}
