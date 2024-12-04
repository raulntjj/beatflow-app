"use server";

import { cookies } from "next/headers";

export const removeCookie = async () => {
  const cookiesStore = await cookies();

  try {
    cookiesStore.delete("token");

    return { success: true };
  } catch (err) {
    return { success: false };
  }
};
