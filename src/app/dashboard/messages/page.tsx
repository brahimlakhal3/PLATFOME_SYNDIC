"use client";

import { useEffect, useState, FormEvent } from "react";

type User = { id: string; nom: string; prenom: string; role: string };

type Message = {
  id: string;
  content: string;
  lu: boolean;
  createdAt: string;
  sender: { id: string; nom: string; prenom: string; role: string };
  receiver: { id: string; nom: string; prenom: string; role: string };
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [msgReceiver, setMsgReceiver] = useState("");
  const [msgContent, setMsgContent] = useState("");
  const [msgSending, setMsgSending] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [mRes, uRes] = await Promise.all([
        fetch("/api/messages"),
        fetch("/api/coproprietaires?all=true"),
      ]);
      const mData = await mRes.json();
      const uData = await uRes.json();
      setMessages(mData?.messages ?? []);
      setAllUsers(uData?.coproprietaires ?? []);
    } catch {
      setError("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!msgReceiver || !msgContent.trim()) {
      return setError("Veuillez sélectionner un destinataire et écrire votre message.");
    }

    try {
      setMsgSending(true);
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: msgReceiver, content: msgContent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi.");

      setMsgContent("");
      setMsgReceiver("");
      const r = await fetch("/api/messages");
      if (r.ok) {
        const updated = await r.json();
        setMessages(updated.messages ?? []);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi du message.");
    } finally {
      setMsgSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-primary" />
          <p className="text-sm text-zinc-500">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 mt-2 rounded-lg bg-zinc-400/10 md:mt-4">
        <h2 className="p-4 text-2xl font-bold md:text-3xl">Messagerie Privée</h2>
      </div>

      {/* Formulaire de nouveau message */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-zinc-100 bg-zinc-50 px-6 py-3.5">
          <h3 className="text-base font-semibold text-zinc-900">Nouveau message</h3>
        </div>
        <form onSubmit={handleSendMessage} className="p-5 md:p-6 space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-200/60">
              {error}
            </p>
          )}

          <div>
            <select
              value={msgReceiver}
              onChange={(e) => setMsgReceiver(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              required
            >
              <option value="">Choisir un destinataire...</option>
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.prenom} {u.nom} ({u.role === "syndic" ? "Syndic" : "Copropriétaire"})
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <textarea
              placeholder="Écrivez votre message..."
              value={msgContent}
              onChange={(e) => setMsgContent(e.target.value)}
              className="min-h-[110px] w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-primary focus:ring-2 focus:ring-primary/10 resize-y"
              required
            />
            <span className="absolute bottom-3 right-3.5 text-xs text-zinc-400">
              {msgContent.length} caractères
            </span>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={msgSending || !msgContent.trim() || !msgReceiver}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover active:scale-95 disabled:opacity-40 disabled:scale-100 shadow-sm"
            >
              {msgSending ? "Envoi en cours..." : "Envoyer le message"}
            </button>
          </div>
        </form>
      </div>

      {/* Liste des messages reçus */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-6 py-3.5">
          <h3 className="text-base font-semibold text-zinc-900">Messages reçus</h3>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {messages.length}
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-400">
            <p className="text-sm font-medium text-zinc-600">Aucun message privé reçu</p>
            <p className="text-xs text-zinc-400 mt-1">Vos conversations s'afficheront ici.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {messages.map((m) => {
              const isSyndic = m.sender.role === "syndic";
              const initials = `${m.sender.prenom?.[0] || ""}${m.sender.nom?.[0] || ""}`.toUpperCase();

              return (
                <div
                  key={m.id}
                  className={`p-5 transition hover:bg-zinc-50/60 ${
                    !m.lu ? "bg-primary/[0.02]" : ""
                  }`}
                >
                  <div className="mb-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs ${
                          isSyndic ? "bg-primary" : "bg-amber-500"
                        }`}
                      >
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-zinc-900">
                            {m.sender.prenom} {m.sender.nom}
                          </span>
                          <span
                            className={`text-[10px] font-medium ${
                              isSyndic ? "text-primary" : "text-amber-600"
                            }`}
                          >
                            {isSyndic ? "Syndic" : "Copropriétaire"}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {new Date(m.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    {!m.lu && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        Nouveau
                      </span>
                    )}
                  </div>

                  <div
                    className={`ml-12 rounded-xl p-3.5 text-sm leading-relaxed ${
                      !m.lu
                        ? "bg-white text-zinc-900 border border-primary/20 shadow-xs"
                        : "bg-zinc-50 text-zinc-800 border border-zinc-200/80"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
