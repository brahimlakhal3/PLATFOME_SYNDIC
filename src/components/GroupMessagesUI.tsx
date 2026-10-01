"use client";

import { useState, useRef, useEffect } from "react";

export type GroupMessage = {
  id: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  sender: {
    id: string;
    nom: string;
    prenom: string;
    role: string;
  };
};

interface GroupMessagesUIProps {
  messages: GroupMessage[];
  currentUserId: string | null;
  onSendMessage: (content: string, isAnonymous: boolean) => Promise<void>;
  allowAnonymous?: boolean;
}

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return `Aujourd'hui, ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
    }
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function renderContent(content: string) {
  return content.split("\n").map((line, i) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <span key={i} className="block">
        {parts.map((p, j) =>
          p.startsWith("**") && p.endsWith("**")
            ? <strong key={j} className="font-semibold">{p.slice(2, -2)}</strong>
            : p
        )}
      </span>
    );
  });
}

export default function GroupMessagesUI({
  messages,
  currentUserId,
  onSendMessage,
  allowAnonymous = true,
}: GroupMessagesUIProps) {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || sending) return;
    try {
      setSending(true);
      setError("");
      await onSendMessage(content, isAnonymous);
      setContent("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden h-[calc(100vh-220px)] min-h-[400px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 bg-zinc-50/40">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400">
            <p className="text-sm font-medium text-zinc-500">Aucun message pour le moment</p>
            <p className="text-xs mt-1">Soyez le premier à écrire !</p>
          </div>
        ) : (
          [...messages].reverse().map((m) => {
            const isMine = currentUserId ? m.sender.id === currentUserId : false;
            const isSyndic = m.sender.role === "syndic";
            const initials = m.isAnonymous
              ? "?"
              : `${m.sender.prenom?.[0] || ""}${m.sender.nom?.[0] || ""}`.toUpperCase();

            return (
              <div key={m.id} className={`flex gap-2.5 ${isMine ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                {!isMine && (
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                      m.isAnonymous
                        ? "bg-zinc-400"
                        : isSyndic
                        ? "bg-primary"
                        : "bg-amber-500"
                    }`}
                  >
                    {initials}
                  </div>
                )}

                {/* Bubble */}
                <div className={`flex max-w-[80%] sm:max-w-[70%] flex-col ${isMine ? "items-end" : "items-start"}`}>
                  {!isMine && (
                    <div className="flex items-center gap-2 mb-0.5 px-0.5">
                      <span className="text-xs font-semibold text-zinc-800">
                        {m.isAnonymous ? "Anonyme" : `${m.sender.prenom} ${m.sender.nom}`}
                      </span>
                      {!m.isAnonymous && (
                        <span className={`text-[10px] font-medium ${isSyndic ? "text-primary" : "text-amber-600"}`}>
                          {isSyndic ? "Syndic" : "Résident"}
                        </span>
                      )}
                      <span className="text-[10px] text-zinc-400">{formatDate(m.createdAt)}</span>
                    </div>
                  )}

                  {isMine && (
                    <span className="text-[10px] text-zinc-400 mb-0.5 px-0.5">
                      {formatDate(m.createdAt)}
                    </span>
                  )}

                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      isMine
                        ? "bg-zinc-100 text-zinc-800"
                        : "bg-white text-zinc-800 border border-zinc-200"
                    }`}
                  >
                    {renderContent(m.content)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-200 bg-white p-3">
        {error && <p className="mb-2 text-xs text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-2">
          {allowAnonymous && (
            <label className="inline-flex items-center gap-1.5 text-xs text-zinc-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-zinc-300 text-primary focus:ring-primary/40"
              />
              Publier anonymement
            </label>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Écrivez votre message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-200 px-3.5 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <button
              type="submit"
              disabled={sending || !content.trim()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover active:scale-95 disabled:opacity-40 transition"
            >
              {sending ? "..." : "Envoyer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
