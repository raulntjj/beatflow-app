"use client";

import Link from "next/link";
import { logo1 } from "../../../public";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { BlurImage } from "../../ui/blur-image";
import { FormEvent } from "react";
import { redirect, useRouter } from "next/navigation";
import { saveCookie } from "@/utils/saveCookie";

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const data = await res.json();
    saveCookie(data.response.access_token);

    if (res?.ok) {
      router.push("/feed");
    } else {
      redirect("/");
    }
  };

  return (
    <div className="w-full h-full max-w-md p-8 rounded-xl m-auto -translate-y-14">
      <BlurImage
        src={logo1}
        alt="logo"
        className="w-[130px] h-auto mx-auto mb-6"
      />
      <h2 className="text-xl font-semibold text-center mb-6">Fazer login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            id="email"
            placeholder="Email"
            className="w-full"
            name="email"
          />
        </div>

        <div>
          <Input
            type="password"
            id="password"
            placeholder="Senha"
            className="w-full"
            name="password"
          />

          <Link
            href="/forgot-password"
            className="text-sm text-foreground  hover:underline block mt-2 text-right"
          >
            Esqueceu sua senha?
          </Link>
        </div>

        <Button variant={"default"} className="w-full mt-4">
          Login
        </Button>

        <div className="text-center text-sm mt-4">
          Não possui conta?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </div>
      </form>
    </div>
  );
}
