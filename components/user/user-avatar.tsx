import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const UserAvatar = ({
  src,
  alt = "Avatar",
  fallbackText = "AA",
  username = "usuario",
  fullName = "Nome Completo",
  hasStory = false,
}: {
  src?: string;
  alt?: string;
  fallbackText?: string;
  username?: string;
  fullName?: string;
  hasStory?: boolean;
}) => {
  return (
    <div className="w-fit flex flex-row items-center justify-center space-x-2">
      <div
        className={`relative flex items-center justify-center w-16 h-16 ${
          hasStory
            ? "p-[2px] bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full"
            : ""
        }`}
      >
        <Avatar className="w-12 h-12 rounded-full bg-background">
          <AvatarImage src={src} alt={alt} />
          <AvatarFallback>{fallbackText}</AvatarFallback>
        </Avatar>
      </div>
      <div className="text-left space-y-1">
        <span className="block text-sm font-semibold text-foreground">{username}</span>
        <span className="block text-xs text-foreground/70">{fullName}</span>
      </div>
    </div>
  );
};
