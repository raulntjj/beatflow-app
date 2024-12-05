"use client";

import Link from "next/link";
import { logo1 } from "../../../public";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { BlurImage } from "../../ui/blur-image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { saveCookie } from "@/utils/saveCookie";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false); 
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.get("identifier"),
          password: formData.get("password"),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        saveCookie(data.response.access_token);

        toast.success("Login realizado com sucesso!", {
          description: "Bem-vindo(a) ao nosso sistema!",
        });

        router.push("/feed");
      } else {
        toast.error("Erro ao fazer login.", {
          description: data.message || "Verifique suas credenciais.",
        });
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Erro ao fazer login.", {
        description: "Algo deu errado. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
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
            id="identifier"
            placeholder="Usuário ou e-mail"
            className="w-full"
            name="identifier"
            disabled={isLoading}
          />
        </div>

        <div>
          <Input
            type="password"
            id="password"
            placeholder="Senha"
            className="w-full"
            name="password"
            disabled={isLoading}
          />

          <Link
            href="/forgot-password"
            className="text-sm text-foreground hover:underline block mt-2 text-right"
          >
            Esqueceu sua senha?
          </Link>
        </div>

        <Button
          variant={"secondary"}
          className="w-full mt-4 flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : (
            "Login"
          )}
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
