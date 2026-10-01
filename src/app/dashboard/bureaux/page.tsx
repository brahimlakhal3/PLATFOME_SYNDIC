"use client";

import { useEffect, useState, FormEvent } from "react";

type Bureau = {
  id: string; nom: string;
  etage: number | null;
  titreFoncier: string | null;
  quotePartPrivee: number; quotePartCommunes: number | null;
  numeroBureau: number;
  userId: string;
  user?: { nom: string; prenom: string }; createdAt: string;
};

type Copro = {
  id: string; nom: string; prenom: string;
};

const emptyBureau = {
  nom: "",
  etage: "",
  titreFoncier: "",
  quotePartPrivee: "",
  quotePartCommunes: "",
  coproprietaireId: ""
};

export default function BureauxPage() {
  const [bureaux, setBureaux] = useState<Bureau[]>([]);
  const [copros, setCopros] = useState<Copro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showBureauModal, setShowBureauModal] = useState(false);
  const [editingBureau, setEditingBureau] = useState<Bureau | null>(null);
  const [bureauForm, setBureauForm] = useState(emptyBureau);

  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [bRes, cRes] = await Promise.all([
      fetch("/api/bureaux"),
      fetch("/api/coproprietaires?all=true")
    ]);
    setBureaux((await bRes.json()).bureaux ?? []);
    setCopros((await cRes.json()).coproprietaires ?? []);
    setLoading(false);
  }

  function openCreateBureau() {
    setEditingBureau(null);
    setBureauForm({ ...emptyBureau, coproprietaireId: "" });
    setError("");
    setShowBureauModal(true);
  }

  function openEditBureau(b: Bureau) {
    setEditingBureau(b);
    setBureauForm({
      nom: b.nom,
      etage: b.etage?.toString() || "",
      titreFoncier: b.titreFoncier || "",
      quotePartPrivee: b.quotePartPrivee.toString(),
      quotePartCommunes: b.quotePartCommunes?.toString() || "",
      coproprietaireId: b.userId
    });
    setError("");
    setShowBureauModal(true);
  }

  async function handleBureauSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const url = editingBureau ? `/api/bureaux/${editingBureau.id}` : "/api/bureaux";
    const method = editingBureau ? "PUT" : "POST";
    const { coproprietaireId, ...rest } = bureauForm;
    const body = { ...rest, userId: coproprietaireId };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) { setSubmitting(false); return setError(data.error); }
    setShowBureauModal(false);
    setSubmitting(false);
    const r = await fetch("/api/bureaux");
    setBureaux((await r.json()).bureaux);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/bureaux/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    setDeleting(false);
    const r = await fetch("/api/bureaux");
    setBureaux((await r.json()).bureaux);
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
        <h2 className="p-4 text-2xl font-bold md:text-3xl"> Bureaux</h2>
      </div>


      {bureaux.length === 0 ? (
        <div className="animate-fade-in-up rounded-xl bg-white p-12 text-center shadow-sm"><p className="text-zinc-500">Aucun bureau pour le moment.</p></div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="animate-fade-in-up overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            {/* Mobile card view */}
            <div className="divide-y divide-zinc-100 sm:hidden">
              {bureaux.map((b) => (
                <div key={b.id} className="p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-900">{b.nom}</span>
                    <span className="text-xs text-zinc-400">N°{b.numeroBureau}</span>
                  </div>
                  <div className="mb-2 space-y-1 text-xs text-zinc-600">
                    <p>Étage: {b.etage != null ? `${b.etage}ᵉ` : "—"}</p>
                    <p>Titre foncier: {b.titreFoncier || "—"}</p>
                    <p>Q. privée: {b.quotePartPrivee} m² | Terrasse: {b.quotePartCommunes != null ? `${b.quotePartCommunes} m²` : "—"}</p>
                    <p>Copropriétaire: {b.user ? `${b.user.prenom} ${b.user.nom}` : "—"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditBureau(b)} className="flex-1 rounded-lg bg-primary/10 py-2 text-xs font-medium text-primary transition-all duration-200 hover:bg-primary hover:text-white active:scale-95">Modifier</button>
                    <button onClick={() => setDeleteTarget({ type: "bureau", id: b.id, name: b.nom })} className="flex-1 rounded-lg bg-red-100 py-2 text-xs font-medium text-red-700 transition-all duration-200 hover:bg-red-500 hover:text-white active:scale-95">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">N°</th>
                    <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Nom</th>
                    <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Étage</th>
                    <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Titre foncier</th>
                    <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Q. privée</th>
                    <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">teras</th>
                    <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Copropriétaire</th>
                    <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {bureaux.map((b) => (
                    <tr key={b.id} className="transition-colors duration-150 hover:bg-purple-50/70 even:bg-zinc-50/50">
                      <td className="whitespace-nowrap px-3 py-3 font-medium text-zinc-500 md:px-4">{b.numeroBureau}</td>
                      <td className="whitespace-nowrap px-3 py-3 font-medium md:px-4">{b.nom}</td>
                      <td className="whitespace-nowrap px-3 py-3 md:px-4">{b.etage != null ? `${b.etage}ᵉ` : "—"}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-zinc-500 md:px-4">{b.titreFoncier || "—"}</td>
                      <td className="whitespace-nowrap px-3 py-3 md:px-4">{b.quotePartPrivee}</td>
                      <td className="whitespace-nowrap px-3 py-3 md:px-4">{b.quotePartCommunes != null ? b.quotePartCommunes : "—"}</td>
                      <td className="whitespace-nowrap px-3 py-3 md:px-4">{b.user ? `${b.user.prenom} ${b.user.nom}` : "—"}</td>
                      <td className="whitespace-nowrap px-3 py-3 md:px-4">
                        <div className="flex gap-1.5">
                          <button onClick={() => openEditBureau(b)} className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-all duration-200 hover:bg-primary hover:text-white active:scale-95">Modifier</button>
                          <button onClick={() => setDeleteTarget({ type: "bureau", id: b.id, name: b.nom })} className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 transition-all duration-200 hover:bg-red-500 hover:text-white active:scale-95">Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className=" animate-fade-in-up mb-5 mt-2 flex flex-col gap-2 md:mt-0 md:flex-row md:items-center md:justify-between">
            <button onClick={openCreateBureau} className="self-start rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover hover:shadow-lg active:scale-95 md:self-auto">+ Ajouter un bureau</button>
          </div>


          <div className="animate-fade-in-up  grid grid-cols-1 gap-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Totale des quotes-parts Privative/Commune</p>
              <hr className="mt-3 border-zinc-200" />
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-zinc-500">Quote-part privative</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900">{bureaux.reduce((s, b) => s + b.quotePartPrivee, 0)} m²</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Quote-part communes</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900">{bureaux.reduce((s, b) => s + (b.quotePartCommunes ?? 0), 0)} m²</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Superficie totale</p>
                  <p className="mt-1 text-2xl font-bold text-primary">{bureaux.reduce((s, b) => s + (b.quotePartCommunes ?? 0) + (b.quotePartPrivee ?? 0), 0)} m²</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!bureaux.length && (
          <div className="pt-3 animate-fade-in-up mb-5 mt-2 flex flex-col gap-2 md:mt-0 md:flex-row md:items-center md:justify-between">
            <button onClick={openCreateBureau} className="self-start rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover hover:shadow-lg active:scale-95 md:self-auto">+ Ajouter un bureau</button>
          </div>

      )

      }

      {showBureauModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <form onSubmit={handleBureauSubmit} className="animate-scale-in flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-8 shadow-lg">
            <h2 className="text-lg font-semibold">{editingBureau ? "Modifier le bureau" : "Ajouter un nouveau bureau"}</h2>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700">Nom de Bureau <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Nom du bureau" value={bureauForm.nom} onChange={(e) => setBureauForm({ ...bureauForm, nom: e.target.value })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700">Étage </label>
              <input type="number" placeholder="EX: 5 " value={bureauForm.etage} onChange={(e) => setBureauForm({ ...bureauForm, etage: e.target.value })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700">Titre foncier<span className="text-red-500">*</span></label>
              <input type="text" placeholder="Titre foncier " value={bureauForm.titreFoncier} onChange={(e) => setBureauForm({ ...bureauForm, titreFoncier: e.target.value })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700">Quote-part privée <span className="text-red-500">*</span></label>
              <input type="number" step="0.0001" placeholder=" 120 (m²) " value={bureauForm.quotePartPrivee} onChange={(e) => setBureauForm({ ...bureauForm, quotePartPrivee: e.target.value })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700">Quote-part des parties communes</label>
              <input type="number" step="0.0001" placeholder=" 8 (m²)" value={bureauForm.quotePartCommunes} onChange={(e) => setBureauForm({ ...bureauForm, quotePartCommunes: e.target.value })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10" />
            </div>
            <select value={bureauForm.coproprietaireId} onChange={(e) => setBureauForm({ ...bureauForm, coproprietaireId: e.target.value })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10">
              <option value="">Non assigné</option>
              {copros.map((c) => (<option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>))}
            </select>
            <div className="flex gap-2">
              <button type="submit" disabled={submitting} className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> {editingBureau ? "Enregistrement..." : "Création..."}</> : (editingBureau ? "Enregistrer" : "Créer")}
              </button>
              <button type="button" onClick={() => setShowBureauModal(false)} className="flex-1 rounded-lg border border-zinc-300 py-2 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-100 active:scale-95">Annuler</button>
            </div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="animate-scale-in flex w-full max-w-sm flex-col gap-4 rounded-xl bg-white p-8 shadow-lg">
            <h2 className="text-lg font-semibold">Confirmer la suppression</h2>
            <p className="text-sm text-zinc-600">Êtes-vous sûr de vouloir supprimer <strong>{deleteTarget.name}</strong> ? Cette action est irréversible.</p>
            <div className="flex gap-2">
              <button onClick={handleDelete} disabled={deleting} className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-600 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                {deleting ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Suppression...</> : "Supprimer"}
              </button>
              <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-lg border border-zinc-300 py-2 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-100 active:scale-95">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
