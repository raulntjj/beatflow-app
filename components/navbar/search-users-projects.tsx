"use client";
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface User {
  id: number;
  name: string;
  username: string;
  user: string;
  avatarSrc?: string;
}

interface SearchUsersProps {
  users: User[];
  selectedUsers: User[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
  ownerId: number; // Adicionado para identificar o ID do proprietário
}

export default function SearchUsers({
  users,
  selectedUsers,
  setSelectedUsers,
  ownerId,
}: SearchUsersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter users to exclude ownerId and already selected users
  const filteredUsers = users.filter(
    (user) =>
      user.id !== ownerId && // Excluir o proprietário
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user.toLowerCase().includes(searchTerm.toLowerCase())) &&
      !selectedUsers.some((selected) => selected.id === user.id)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(value.length > 0);
  };

  const handleInputFocus = () => {
    if (searchTerm.length > 0) {
      setIsOpen(true);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUsers((prev) => [...prev, user]);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleUserRemove = (user: User) => {
    setSelectedUsers((prev) =>
      prev.filter((selected) => selected.id !== user.id)
    );
  };

  return (
    <div className="space-y-4">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search users by name or username"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className="w-full"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[calc(100%+1rem)] p-0"
          align="start"
          sideOffset={5}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {searchTerm && filteredUsers.length === 0 ? (
            <p className="text-gray-500 text-center p-4">No users found</p>
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-4 p-2 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleUserSelect(user)}
                >
                  <Avatar>
                    <AvatarImage
                      src={user.avatarSrc || "/default-avatar.png"}
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-gray-500 text-sm">@{user.username}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-4">
        {selectedUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg shadow-md"
          >
            <Avatar>
              <AvatarImage
                src={user.avatarSrc || "/default-avatar.png"}
                alt={user.name}
              />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-gray-500 text-sm">@{user.username}</p>
            </div>
            <button
              onClick={() => handleUserRemove(user)}
              className="text-red-500 font-bold hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
