"use client";

import Link from "next/link";
import { logo1 } from "../../../public";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { BlurImage } from "../../ui/blur-image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Importando toast
import { FaSpinner } from "react-icons/fa"; // Ícone de carregamento

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Ativar estado de carregamento

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registro concluído com sucesso!", {
          description: "Bem-vindo(a) ao BeatFlow!",
        });

        router.push("/login"); // Redirecionar para a página de login
      } else {
        toast.error("Erro ao registrar.", {
          description: data.message || "Verifique os dados fornecidos.",
        });
      }
    } catch (error) {
      console.error("Erro no registro:", error);
      toast.error("Erro ao registrar.", {
        description: "Algo deu errado. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false); // Desativar estado de carregamento
    }
  };

  return (
    <div className="w-full h-full max-w-md p-8 rounded-xl m-auto -translate-y-14">
      <BlurImage
        src={logo1}
        alt="logo"
        className="w-[130px] h-auto mx-auto mb-6"
      />
      <h2 className="text-xl font-semibold text-center mb-6">Criar Conta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            id="username"
            placeholder="Nome de usuário"
            className="w-full"
            name="username"
            disabled={isLoading}
          />
        </div>
        <div>
          <Input
            type="email"
            id="email"
            placeholder="E-mail"
            className="w-full"
            name="email"
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
        </div>

        <Button
          variant={"secondary"}
          className="w-full mt-4 flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : (
            "Registrar"
          )}
        </Button>

        <div className="text-center text-sm mt-4">
          Já possui uma conta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Faça login
          </Link>
        </div>
      </form>
    </div>
  );
}
