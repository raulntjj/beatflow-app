import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/lib/auth";
import { redirect } from "next/navigation";

export default async function Feed() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  return <h1>Feed</h1>;
}
