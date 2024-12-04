import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { FaRegImage } from "react-icons/fa";

export const ImageUploadProjects = ({
  onFileChange,
}: {
  onFileChange: (file: File | null, fileType: string) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFile: File) => {
    setFile(newFile);
    onFileChange(newFile, newFile.type);
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) handleFileChange(selectedFile);
    },
  });

  return (
    <div
      className="w-full"
      {...getRootProps()}
      onClick={() => fileInputRef.current?.click()}
    >
      <motion.div className="p-5 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) handleFileChange(selectedFile);
          }}
        />
        <div className="flex flex-col items-center justify-center">
          <p className="font-sans font-bold text-foreground text-sm">Upload image</p>
          <p className="font-sans font-normal text-foreground text-base mt-2">
            Solte sua imagem aqui
          </p>
          {file ? (
            <div className="mt-4 text-sm">
              <p>{file.name}</p>
              <p>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          ) : (
            <FaRegImage className="h-6 w-6 text-neutral-600 mt-4" />
          )}
        </div>
      </motion.div>
    </div>
  );
};
