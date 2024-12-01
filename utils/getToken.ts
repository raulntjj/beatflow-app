"use server";

import { cookies } from "next/headers";

export default async function getToken() {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("token")?.value;

  if (userToken) {
    return userToken;
  } else {
    throw Error("Erro ao buscar token.");
  }
}
