"use client";

import { useContext, useState } from "react";
import { Input } from "../ui/input";
import { UserContext } from "@/context/user-context";
import { Button } from "../ui/button";
import getToken from "@/utils/getToken";

export default function CreatePost() {
  const userData = useContext(UserContext);
  const userId = userData?.user?.id;
  const userUser = userData?.user?.user;

  const [formData, setFormData] = useState({
    content: "",
    image: null as File | null, // Altere para aceitar um arquivo
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: files[0], // Adiciona o arquivo
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !userUser) {
      console.error("User data is missing");
      return;
    }

    const data = new FormData();
    data.append("user_id", userId.toString()); // Ensure userId is a string
    data.append("content", formData.content);
    data.append("visibility", "public");
    data.append("user", userUser || ""); // Fallback to an empty string if userUser is undefined
    data.append("media_type", "audio");

    if (formData.image) {
      data.append("media_path", formData.image);
    }

    data.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    try {
      const userToken = await getToken();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: data,
      });

      const response = await res.json();
      console.log(response);

      if (res.ok) {
        console.log("Post criado com sucesso!");
      } else {
        console.error("Erro ao criar o post:", response);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" >
      <Input
        type="text"
        name="content"
        value={formData.content}
        onChange={handleChange}
        placeholder="Conteúdo"
        className="mt-2 bg-zinc-800 border-zinc-700 text-white focus:ring-blue-500"
        required
      />
      <Input
        type="file"
        name="image"
        onChange={handleChange}
        placeholder="Imagem"
        className="mt-2 bg-zinc-800 border-zinc-700 text-white focus:ring-blue-500"
        required
      />
      <Button type="submit" variant={"default"} className="w-full mt-6">
        Postar
      </Button>
    </form>
  );
}
