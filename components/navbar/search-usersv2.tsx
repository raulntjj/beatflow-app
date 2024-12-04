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
}

export default function SearchUsers({ users }: SearchUsersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user.toLowerCase().includes(searchTerm.toLowerCase())
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
    console.log("Selected user:", user);
  };

  return (
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
  );
}
