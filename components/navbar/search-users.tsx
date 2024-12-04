"use client";

import React, { useState, useRef, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { UserAvatar } from "../user/user-avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface User {
  id: number;
  name: string;
  username: string;
  avatarSrc?: string;
}

interface SearchUsersProps {
  users: User[];
}

export default function SearchUsersJonas({ users }: SearchUsersProps) {
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFilteredUsers([]);
    } else {
      const results = users.filter(
        (user) =>
          user.name.toLowerCase().includes(value.toLowerCase()) ||
          user.username.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(results);
    }

    setIsDropdownVisible(true);
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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full mx-auto p-4" ref={searchContainerRef}>
      {/* Campo de entrada com ícone */}
      <div className="relative">
        <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={handleFocus}
          placeholder="Pesquisar"
          className="w-full pl-10 text-base"
        />
      </div>
      {/* Dropdown de resultados */}
      {isDropdownVisible && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-full-minus-2rem bg-background border shadow-lg rounded-md z-20 text-base">
          {filteredUsers.length > 0 ? (
            <ScrollArea className="h-full">
              <ul className="p-2 max-h-64">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-2 transition bg-background hover:bg-zinc-700 rounded-md"
                  >
                    <UserAvatar
                      src={user.avatarSrc}
                      fallbackText={
                        user.name.charAt(0) + user.username.charAt(0)
                      }
                      username={user.username}
                      fullName={user.name}
                    />
                  </div>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <p className="p-4 text-gray-500 text-sm">
              Nenhum resultado para &ldquo;{query}&ldquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
