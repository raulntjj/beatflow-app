"use client";

import React, { useState, useRef, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import getToken from "@/utils/getToken";

interface User {
  id: number;
  name: string;
  username: string;
  avatarSrc?: string;
}

export default function SearchUsers() {
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFilteredUsers([]);
      setIsDropdownVisible(false);
      return;
    }

    setIsLoading(true);

    try {
      const userToken = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users?search=${value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Erro ao buscar usuários");
      }

      const responseData = await res.json();
      const usersData = responseData.response.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        username: user.user,
        avatarSrc: user.profile_photo_temp,
      }));

      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Erro na busca de usuários:", error);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
      setIsDropdownVisible(true);
    }
  };

  const handleFocus = () => {
    if (query.trim() !== "") {
      setIsDropdownVisible(true);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target as Node)
    ) {
      setIsDropdownVisible(false);
    }
  };

  const handleUserClick = (username: string) => {
    router.push(`/profile/${username}`);
    setIsDropdownVisible(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchContainerRef} className="relative w-full py-4">
      <div className="relative">
        <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={handleFocus}
          placeholder="Pesquisar"
          className="w-full pl-10 text-base border-[2px] border-zinc-700"
        />
      </div>
      {isDropdownVisible && (
        <div className="absolute top-full left-0 w-full bg-background border-[2px] border-zinc-700 shadow-lg rounded-md overflow-hidden z-20">
          {isLoading ? (
            <p className="p-4 text-gray-500">Buscando...</p>
          ) : filteredUsers.length > 0 ? (
            <ScrollArea className="h-full">
              <div className="max-h-64">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-2 cursor-pointer hover:bg-zinc-800 flex items-center gap-4"
                    onClick={() => handleUserClick(user.username)}
                  >
                    <img
                      src={user.avatarSrc}
                      alt={`${user.name} avatar`}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">@{user.username}</p>
                      <p className="text-sm text-foreground/70">{user.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="p-4 text-gray-500">Nenhum resultado para &ldquo;{query}&rdquo;</p>
          )}
        </div>
      )}
    </div>
  );
}