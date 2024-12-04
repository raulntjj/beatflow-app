"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BlurImage } from "../../ui/blur-image";
import { useRouter } from "next/navigation";
import { logo1 } from "../../../public";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FaCheckCircle } from "react-icons/fa";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nome: "",
    sobreNome: "",
    email: "",
    usuario: "",
    senha: "",
    confirmarSenha: "",
  });
  const [termos, setTermos] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    if (!termos) {
      setErro("Você precisa aceitar os termos e condições");
      setLoading(false);
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas não correspondem");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.nome,
          last_name: formData.sobreNome,
          email: formData.email,
          user: formData.usuario,
          password: formData.senha,
          password_confirmation: formData.confirmarSenha,
          bio: "",
          is_private: 0,
        }),
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        // Exibir toast de confirmação
        toast.success(
          "Registro concluído com sucesso!",
          {
            description: "Bem-vindo(a) ao nosso sistema!",
            action: {
              label: <FaCheckCircle className="text-green-600 h-5 w-5" />,
              onClick: () => console.log("Toast confirmado"),
            },
          }
        );

        // Redirecionar para a próxima etapa
        setTimeout(() => {
          router.push(`/`);
        }, 2000); // Aguarda 2 segundos antes de redirecionar
      } else {
        setErro(data.message || "Erro ao registrar usuário");
      }
    } catch {
      setErro("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full h-full max-w-md p-8 rounded-xl m-auto">
      <BlurImage
        src={logo1}
        alt="logo"
        className="w-[130px] h-auto mx-auto mb-6 pointer-events-none"
      />
      <h2 className="text-base font-semibold text-center mb-6">
        Crie sua conta
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome"
            className="mt-2 bg-zinc-800 border-zinc-700 text-white focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <Input
            type="text"
            name="sobreNome"
            value={formData.sobreNome}
            onChange={handleChange}
            placeholder="Sobre nome"
            className="mt-2 bg-zinc-800 border-zinc-700 text-white focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="mt-2 bg-zinc-800 border-zinc-700 text-white focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <Input
            type="text"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            placeholder="Usuário"
            className="mt-2 bg-zinc-800 border-zinc-700 text-white focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <Input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            placeholder="Senha"
            className="mt-2 bg-zinc-800 border-zinc-700 text-white focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <Input
            type="password"
            name="confirmarSenha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            placeholder="Confirmar senha"
            className="mt-2 bg-zinc-800 border-zinc-700 text-white focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="termos"
            checked={termos}
            onCheckedChange={(checked) => setTermos(!!checked)}
            className="border-zinc-600 bg-zinc-800"
          />
          <Label
            htmlFor="termos"
            className="text-zinc-300 cursor-pointer hover:text-white"
          >
            Concordo com os termos e condições
          </Label>
        </div>

        {erro && (
          <div className="text-red-500 text-sm mt-2 text-center">{erro}</div>
        )}

        <Button
          type="submit"
          variant={"default"}
          className="w-full mt-6"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </div>
  );
}
