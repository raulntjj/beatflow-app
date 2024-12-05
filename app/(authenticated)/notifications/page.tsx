"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserContext } from "@/context/user-context";
import getToken from "@/utils/getToken";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PiBroomFill } from "react-icons/pi";
import { Button } from "../../../components/ui/button";
import { ScrollArea } from "../../../components/ui/scroll-area";


export default function Notifications() {
  const pathname = usePathname(); 
  const userData = useContext(UserContext);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userToken = await getToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/me/notifications`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Erro ao retornar notificações.");
        }

        const data = await res.json();

        const formattedNotifications = data.response.data.map(
          (notification: any) => ({
            id: notification.id,
            type: notification.type,
            content: notification.content,
            is_read: notification.is_read,
            created_at: notification.created_at,
            user: notification.user
              ? {
                  id: notification.user.id,
                  name: `${notification.user.name} ${notification.user.last_name}`,
                  avatarSrc: notification.user.profile_photo_temp || "",
                }
              : null,
          })
        );

        setNotifications(formattedNotifications);
      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const deleteNotifications = async () => {
    try {
      const userToken = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${userData?.user?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        console.log("Notifications deleted successfully");
      } else {
        setNotifications([null]);
        console.error("Failed to delete notifications:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while deleting notifications:", error);
    }
  };

  return (
    <>
      <div className="space-y-4 w-full max-w-[600px] mx-auto bg-background py-4">
        {loading ? (
          <p className="px-4 text-foreground/60">Carregando notificações...</p>
        ) : (
          <div className="flex flex-col bg-background">
            <div className="px-4 pb-6 flex items-center justify-between">
              {/* Exibe o Link apenas se estiver na rota /notifications */}
              {pathname === "/notifications" && (
                <Link href={`/`}>
                  <ChevronLeft className="w-7 h-7" />
                </Link>
              )}
              <span className="text-2xl font-bold">Notificações</span>
              <Button
                variant={"outline"}
                className="text-sm p-2"
                onClick={deleteNotifications}
              >
                <PiBroomFill />
              </Button>
            </div>
            <ScrollArea className="h-full">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center px-4 py-2 transition duration-200 hover:bg-zinc-800 cursor-pointer"
                  >
                    <Avatar className="mr-4">
                      <AvatarImage
                        src={notification.user?.avatarSrc || ""}
                        alt={notification.user?.name || ""}
                      />
                      <AvatarFallback>
                        {notification.user?.name?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-left space-y-1">
                        {notification.user && (
                          <a
                            href={`/profile/${notification.user.id}`}
                            className="cursor-pointer"
                          >
                            <span className="block text-sm font-semibold text-foreground">
                              {notification.user.name}
                            </span>
                          </a>
                        )}
                        <span className="block text-xs text-foreground/70">
                          {notification.content}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="px-4 text-foreground/60" >Nenhuma notificação encontrada.</p>
              )}
            </ScrollArea>
          </div>
        )}
      </div>
    </>
  );
}
