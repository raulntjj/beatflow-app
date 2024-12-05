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
import { saveCookie } from "@/utils/saveCookie";

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
  const [step, setStep] = useState(1); // Controle de etapas
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // Armazenar a imagem selecionada
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações da etapa 1
    if (!termos) {
      setErro("Você precisa aceitar os termos e condições");
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas não correspondem");
      return;
    }

    setErro("");
    setStep(2); // Avança para a próxima etapa
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const bio = null; // Definindo bio como null

      // Simular envio dos dados
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.nome);
      formDataToSend.append("last_name", formData.sobreNome);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("user", formData.usuario);
      formDataToSend.append("password", formData.senha);
      formDataToSend.append("password_confirmation", formData.confirmarSenha);
      formDataToSend.append("bio", bio ?? "");
      if (selectedImage) {
        formDataToSend.append("profile_photo_path", selectedImage);
      }

      const formDataToSendLogin = new FormData();
      formDataToSendLogin.append("identifier", formData.usuario);
      formDataToSendLogin.append("password", formData.senha);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        toast.success("Registro concluído com sucesso!", {
          description: "Bem-vindo(a) ao nosso sistema!",
        });

        const resLogin = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/login`,
          {
            method: "POST",
            body: formDataToSendLogin,
          }
        );

        const dataLogin = await resLogin.json();

        if (resLogin.ok) {
          saveCookie(dataLogin.response.access_token);
          setTimeout(() => {
            router.push(`/feed`);
          }, 2000);
        } else {
          setTimeout(() => {
            router.push(`/`);
          }, 2000);
        }
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
        {step === 1 ? "Crie sua conta" : "Envie sua imagem"}
      </h2>
      <form
        onSubmit={step === 1 ? handleNextStep : handleSubmit}
        className="space-y-4"
      >
        {step === 1 && (
          <>
            {/* Etapa 1: Formulário de dados */}
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
                placeholder="Sobrenome"
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
          </>
        )}

        {step === 2 && (
          <>
            {/* Etapa 2: Upload de imagem */}
            <div>
              <Label
                htmlFor="image"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Envie uma imagem
              </Label>
              <Input
                type="file"
                id="image"
                name="profile_photo_path"
                onChange={handleImageChange}
                accept="image/*"
                className="block w-full text-sm text-gray-300 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}

        {erro && (
          <div className="text-red-500 text-sm mt-2 text-center">{erro}</div>
        )}

        <Button
          type="submit"
          variant={"default"}
          className="w-full mt-6"
          disabled={loading}
        >
          {loading
            ? step === 1
              ? "Validando..."
              : "Enviando..."
            : step === 1
            ? "Próximo"
            : "Enviar"}
        </Button>
      </form>
    </div>
  );
}
