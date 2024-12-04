import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { RiMusicFill } from "react-icons/ri";

export const AudioUploadProjects = ({
  onFileChange,
}: {
  onFileChange: (file: File | null, fileType: string) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputAudioRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFile: File) => {
    setFile(newFile);
    onFileChange(newFile, "audio");
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
      onClick={() => fileInputAudioRef.current?.click()}
    >
      <motion.div className="p-5 group/audio block rounded-lg cursor-pointer w-full relative overflow-hidden">
        <input
          ref={fileInputAudioRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) handleFileChange(selectedFile);
          }}
        />
        <div className="flex flex-col items-center justify-center">
          <p className="font-sans font-bold text-foreground text-sm">Upload audio</p>
          <p className="font-sans font-normal text-foreground text-base mt-2">
            Solte seu áudio aqui
          </p>
          {file ? (
            <div className="mt-4 text-sm">
              <p>{file.name}</p>
              <p>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          ) : (
            <RiMusicFill className="h-6 w-6 text-neutral-600 mt-4" />
          )}
        </div>
      </motion.div>
    </div>
  );
};
