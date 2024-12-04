"use client";

import { useContext, useState } from "react";
import { Input } from "../ui/input";
import { UserContext } from "@/context/user-context";
import { Button } from "../ui/button";
import getToken from "@/utils/getToken";
import { FileUpload } from "../ui/file-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PlusSquare } from "lucide-react";
import { toast } from "sonner";
import { FaCheck } from "react-icons/fa";

export default function CreatePost() {
  const userData = useContext(UserContext);
  const userId = userData?.user?.id;
  const userUser = userData?.user?.user;

  const [formData, setFormData] = useState({
    content: "",
    image: null as File | null, // Altere para aceitar um arquivo
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false); // Controla a visibilidade do dialog

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        image: files[0], // Adiciona o primeiro arquivo selecionado
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
    data.append("user_id", userId.toString());
    data.append("content", formData.content);
    data.append("visibility", "public");
    data.append("user", userUser || "");

    // Determinar o media_type baseado no arquivo
    let mediaType = "unknown";
    if (formData.image) {
      const fileType = formData.image.type; // Obtém o MIME type do arquivo
      if (fileType.startsWith("image/")) {
        mediaType = "image";
      } else if (fileType.startsWith("audio/")) {
        mediaType = "audio";
      } else if (fileType.startsWith("video/")) {
        mediaType = "video";
      }
    }

    data.append("media_type", mediaType);

    if (formData.image) {
      data.append("media_path", formData.image);
    }

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

      if (res.ok) {
        toast("Postagem criada com sucesso!", {
          action: {
            label: <FaCheck className="text-green-600 h-5 w-5" />,
            onClick: () => {},
          },
        });
        setIsDialogOpen(false); // Fecha o dialog
        setFormData({ content: "", image: null }); // Reseta o formulário
      } else {
        console.error("Erro ao criar o post:", response);
        toast.error("Erro ao criar a postagem.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      toast.error("Erro na requisição.");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className="flex w-full justify-center tablet:justify-start items-center">
        <PlusSquare className="tablet:mr-3 h-7 w-7" />
        <span className="hidden tablet:block">Criar</span>
      </DialogTrigger>
      <DialogContent className="border-zinc-700 bg-background">
        <DialogHeader>
          <DialogTitle className="text-center">
            Criar nova publicação
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* <Input
              type="text"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Conteúdo"
              className="mt-2 bg-zinc-800 border-zinc-700 text-white focus:ring-blue-500"
              required
            /> */}
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Conteúdo"
              className="mt-2 bg-zinc-800 border border-zinc-700 text-white focus:ring-blue-500 focus:border-blue-500 rounded-md w-full p-2 resize-none"
              rows={2}
              required
            ></textarea>
            <FileUpload onChange={handleFileChange} />
            <div className="w-full flex">
              <Button
                type="submit"
                variant="outline"
                className="w-[85%] mx-auto mt-6"
              >
                Postar
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
