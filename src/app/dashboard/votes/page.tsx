"use client";

import { useEffect, useState } from "react";

type VoteResponse = {
  id: string; choix: string; createdAt: string;
  user: { id: string; nom: string; prenom: string };
};

type VoteStats = {
  id: string; title: string; description: string | null;
  actif: boolean; createdAt: string;
  total: number;
  pour: { count: number; pct: number };
  contre: { count: number; pct: number };
  neutre: { count: number; pct: number };
  responses: VoteResponse[];
};

const choixLabels: Record<string, string> = {
  pour: "Pour",
  contre: "Contre",
  neutre: "Neutre",
};

const choixColors: Record<string, string> = {
  pour: "bg-emerald-500",
  contre: "bg-red-500",
  neutre: "bg-zinc-400",
};

const choixBadge: Record<string, string> = {
  pour: "bg-emerald-100 text-emerald-700",
  contre: "bg-red-100 text-red-700",
  neutre: "bg-zinc-200 text-zinc-600",
};

export default function VotesPage() {
  const [votes, setVotes] = useState<VoteStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [closingId, setClosingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/votes")
      .then((r) => r.json())
      .then((d) => setVotes(d.votes ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleCloseVote(id: string) {
    setClosingId(id);
    await fetch(`/api/votes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actif: false }),
    });
    const r = await fetch("/api/votes");
    setVotes((await r.json()).votes ?? []);
    setClosingId(null);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError("Titre requis");
    setError("");
    setCreating(true);
    const res = await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    if (!res.ok) {
      const d = await res.json();
      setCreating(false);
      return setError(d.error);
    }
    setTitle("");
    setDescription("");
    setShowCreate(false);
    setCreating(false);
    const r = await fetch("/api/votes");
    setVotes((await r.json()).votes ?? []);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-primary" />
          <p className="text-sm text-zinc-500">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 mt-2 rounded-lg bg-zinc-400/10 md:mt-4">
        <h2 className="p-4 text-2xl font-bold md:text-3xl">Sondages</h2>
      </div>

      <button onClick={() => setShowCreate(true)} className="mb-6 self-start rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover active:scale-95">
        + Nouveau sondage
      </button>

      {votes.length === 0 ? (
        <div className="animate-fade-in-up rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-zinc-500">Aucun sondage pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {votes.map((v) => (
            <div key={v.id} className="animate-fade-in-up overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{v.title}</h3>
                    {v.actif ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Actif</span>
                    ) : (
                      <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-500">Clôturé</span>
                    )}
                  </div>
                  {v.description && <p className="mt-1 text-sm text-zinc-500">{v.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {v.actif && (
                    <button
                      onClick={() => handleCloseVote(v.id)}
                      disabled={closingId === v.id}
                      className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-700 transition-all duration-200 hover:bg-amber-500 hover:text-white active:scale-95 disabled:opacity-50"
                    >
                      {closingId === v.id ? "Clôture..." : "Clôturer le sondage"}
                    </button>
                  )}
                  <button
                    onClick={() => setExpanded(expanded === v.id ? null : v.id)}
                    className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-all hover:bg-zinc-200"
                  >
                    {expanded === v.id ? "Réduire" : "Détails"}
                  </button>
                </div>
              </div>

              {/* Barres de progression */}
              <div className="px-6 pb-4 space-y-2">
                {[
                  { key: "pour", label: "Pour", count: v.pour.count, pct: v.pour.pct, color: "bg-emerald-500" },
                  { key: "contre", label: "Contre", count: v.contre.count, pct: v.contre.pct, color: "bg-red-500" },
                  { key: "neutre", label: "Neutre", count: v.neutre.count, pct: v.neutre.pct, color: "bg-zinc-400" },
                ].map((item) => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-zinc-500">{item.count} votant{item.count > 1 ? "s" : ""} ({item.pct}%)</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-zinc-100">
                      <div className={`h-2.5 rounded-full ${item.color} transition-all duration-500`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
                <p className="text-xs text-zinc-400 pt-1">Total: {v.total} votant{v.total > 1 ? "s" : ""}</p>
              </div>

              {/* Liste des votants (détaillée) */}
              {expanded === v.id && (
                <div className="border-t border-zinc-100 px-6 py-4">
                  <h4 className="mb-3 text-sm font-medium text-zinc-700">Liste des votants</h4>
                  {v.responses.length === 0 ? (
                    <p className="text-sm text-zinc-400">Aucun vote pour le moment.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {v.responses.map((r) => (
                        <div key={r.id} className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-2.5 text-sm">
                          <span className="font-medium">{r.user.prenom} {r.user.nom}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${choixBadge[r.choix]}`}>
                            {choixLabels[r.choix]}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <form onSubmit={handleCreate} className="animate-scale-in flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-8 shadow-lg">
            <h2 className="text-lg font-semibold">Nouveau sondage</h2>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700">Titre <span className="text-red-500">*</span></label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700">Description / Objectif</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none" />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={creating} className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50 flex items-center justify-center gap-2">{creating ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Création...</> : "Créer le sondage"}</button>
              <button type="button" onClick={() => setShowCreate(false)} className="flex-1 rounded-lg border border-zinc-300 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100">Annuler</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
