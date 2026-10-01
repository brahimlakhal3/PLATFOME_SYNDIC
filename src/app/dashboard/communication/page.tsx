"use client";

import { useEffect, useState } from "react";
import GroupMessagesUI, { GroupMessage } from "@/components/GroupMessagesUI";

export default function CommunicationPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);

  const fetchMessages = async () => {
    const r = await fetch("/api/group-messages");
    if (r.ok) {
      const data = await r.json();
      setMessages(data.messages ?? []);
    }
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/group-messages").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([userData, msgData]) => {
        if (userData?.user) setCurrentUserId(userData.user.id);
        if (msgData?.messages) setMessages(msgData.messages);
      })
      .catch(() => {});
  }, []);

  const handleSendMessage = async (content: string, isAnonymous: boolean) => {
    const res = await fetch("/api/group-messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, isAnonymous }),
    });
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.error || "Erreur lors de l'envoi");
    }
    await fetchMessages();
  };

  return (
    <div>
      <div className="mb-6 mt-2 rounded-lg bg-zinc-400/10 md:mt-4">
        <h2 className="p-4 text-2xl font-bold md:text-3xl">Communication</h2>
      </div>
      <GroupMessagesUI
        messages={messages}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
        allowAnonymous={true}
      />
    </div>
  );
}
