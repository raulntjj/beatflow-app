import { UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ProfilePhotoProps {
  src: string;
  alt: string;
  size?: "small" | "medium" | "large";
  className?: string;
  fallbackIcon?: React.ReactNode;
}

export default function ProfilePhoto({ 
  src, 
  alt, 
  size = "small", 
  className, 
  fallbackIcon = <UserIcon className="w-4 h-4" />
 }: ProfilePhotoProps) {
  const sizeClasses = {
    small: "w-7 h-7",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  return (
    <div>
      <Avatar className={`${sizeClasses[size]} ${className || ""}`}>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback>{fallbackIcon || alt?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
      </Avatar>
    </div>
  );
}
