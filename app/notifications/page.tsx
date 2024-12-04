"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/user-context";
import getToken from "@/utils/getToken";

export default function Notifications() {
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

  const markAsRead = async (notificationId: number) => {
    try {
      const userToken = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/read/${notificationId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Erro ao marcar notificação como lida.");
      }

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: 1 }
            : notification
        )
      );
    } catch (err) {
      console.error("Erro ao marcar notificação como lida:", err);
    }
  };

  return (
    <div className="w-[600px]">
      {loading ? (
        <p>Carregando notificações...</p>
      ) : (
        <div className="flex flex-col space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center p-4 bg-gray-900 text-white"
              >
                {notification.user ? (
                  <img
                    src={notification.user.avatarSrc}
                    alt={notification.user.name}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-4" />
                )}
                <div className="flex-1">
                  {notification.user && (
                    <p className="font-bold">{notification.user.name}</p>
                  )}
                  <p>{notification.content}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                {!notification.is_read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-blue-400"
                  >
                    Marcar como lida
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>Nenhuma notificação encontrada.</p>
          )}
        </div>
      )}
    </div>
  );
}
