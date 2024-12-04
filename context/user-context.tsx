"use client";
import React from "react";

type User = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  profile_photo_temp: string;
  user: string;
};

type IUserContext = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  id: string;
  name: string;
  email: string;
  profilePhoto: string;
};

export const UserContext = React.createContext<IUserContext | null>(null);

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === null) {
    throw new Error("useContext must be within the Provider");
  }
  return context;
};

export function UserContextProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  const [userState, setUser] = React.useState<User | null>(user);

  return (
    <UserContext.Provider
      value={{
        user: userState,
        setUser,
        id: userState?.id?.toString() || '',
        name: userState?.name || '',
        email: userState?.email || '',
        profilePhoto: userState?.profile_photo_temp || '',
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
