"use server";

import { cookies } from "next/headers";

export const saveCookie = async (token: string) => {
  const cookiesStore = await cookies();

  try {
    cookiesStore.set("token", token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return { success: true };
  } catch (err) {
    return { success: false };
  }
};
