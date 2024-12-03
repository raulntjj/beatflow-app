import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserContext } from "@/context/user-context";
import { useContext } from "react";

export const UserAvatar = () => {
  const userData = useContext(UserContext);
  return (
    <div className="w-fit flex flex-row items-center justify-center space-x-2">
      <div className={`relative flex items-center justify-center w-16 h-16`}>
        <Avatar className="w-12 h-12 rounded-full bg-background">
          <AvatarImage
            src={userData?.user?.profile_photo_temp}
            alt={userData?.user?.name}
          />
          <AvatarFallback>{userData?.user?.profile_photo_temp}</AvatarFallback>
        </Avatar>
      </div>
      <div className="text-left space-y-1">
        <span className="block text-sm font-semibold text-foreground">
          {userData?.user?.user}
        </span>
        <span className="block text-xs text-foreground/70">
          {userData?.user?.name} {userData?.user?.last_name}
        </span>
      </div>
    </div>
  );
};
