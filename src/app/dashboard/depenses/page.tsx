"use client"

import { useEffect, useState, FormEvent } from "react";

type Depense = { id: string; libelle: string; montant: number; moisDepart: number; annee: number; imageUrl?: string | null; createdAt: string };

const moisNoms = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

export default function DepensesPage() {
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [depenseLibelle, setDepenseLibelle] = useState("");
  const [depenseMontant, setDepenseMontant] = useState("");
  const [depenseMois, setDepenseMois] = useState((new Date().getMonth() + 1).toString());
  const [depenseAnnee, setDepenseAnnee] = useState(new Date().getFullYear().toString());
  const [depenseImage, setDepenseImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/depenses")
        .then((r) => r.ok ? r.json() : { depenses: [] })
        .then((d) => setDepenses(d.depenses || []))
        .catch(() => setDepenses([]))
        .finally(() => setLoading(false));
  }, []);

  async function handleAddDepense(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!depenseLibelle || !depenseMontant || !depenseMois || !depenseAnnee) return setError("Tous les champs sont requis");

    let imageUrl = "";
    if (depenseImage) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", depenseImage);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) return setError(uploadData.error || "Erreur lors de l'upload");
      imageUrl = uploadData.url;
      setUploading(false);
    }

    const res = await fetch("/api/depenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        libelle: depenseLibelle,
        montant: depenseMontant,
        mois: depenseMois,
        annee: depenseAnnee,
        imageUrl: imageUrl || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    setDepenseLibelle("");
    setDepenseMontant("");
    setDepenseMois((new Date().getMonth() + 1).toString());
    setDepenseImage(null);
    const r = await fetch("/api/depenses");
    setDepenses((await r.json()).depenses);
  }

  async function handleDeleteDepense(id: string) {
    setDeletingId(id);
    await fetch(`/api/depenses/${id}`, { method: "DELETE" });
    const r = await fetch("/api/depenses");
    setDepenses((await r.json()).depenses);
    setDeletingId(null);
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

  const depensesByYear = depenses.reduce<Record<number, Depense[]>>((acc, d) => {
    (acc[d.annee] ??= []).push(d);
    return acc;
  }, {});

  return (
      <div>
        <div className="mb-6 mt-2 rounded-lg bg-zinc-400/10 md:mt-4">
          <h2 className="p-4 text-2xl font-bold md:text-3xl">Dépenses mensuelles</h2>
        </div>

        <form onSubmit={handleAddDepense} className="animate-fade-in-up mb-6 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md md:flex-row md:flex-wrap md:items-end md:p-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500">Libellé</label>
            <input type="text" value={depenseLibelle} onChange={(e) => setDepenseLibelle(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 w-full md:w-40" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500">Année</label>
            <input type="number" value={depenseAnnee} onChange={(e) => setDepenseAnnee(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 w-full md:w-24" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500">Mois</label>
            <select value={depenseMois} onChange={(e) => setDepenseMois(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 w-full md:w-auto">
              {moisNoms.map((nom, i) => (
                  <option key={i + 1} value={i + 1}>{nom}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500">Montant (DH)</label>
            <input type="number" step="0.01" value={depenseMontant} onChange={(e) => setDepenseMontant(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 w-full md:w-32" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500">Reçu (image)</label>
            <input type="file" accept="image/*" onChange={(e) => setDepenseImage(e.target.files?.[0] || null)} className="text-sm text-zinc-500 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary hover:file:bg-primary/20 w-full md:w-auto" />
          </div>
          <button type="submit" disabled={uploading} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover hover:shadow-lg active:scale-95 disabled:opacity-50 w-full md:w-auto">
            {uploading ? "Upload..." : "Ajouter"}
          </button>
        </form>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {depenses.length === 0 ? (
            <div className="animate-fade-in-up rounded-xl bg-white p-12 text-center shadow-sm"><p className="text-zinc-500">Aucune dépense ajoutée.</p></div>
        ) : (
            <div className="space-y-6">
              {Object.entries(depensesByYear).sort(([a], [b]) => Number(b) - Number(a)).map(([annee, anneeDepenses]) => {
                const totalAnnee = anneeDepenses.reduce((s, d) => s + d.montant, 0);
                return (
                    <div key={annee} className="animate-fade-in-up overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                      <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-6 py-4">
                        <h3 className="text-lg font-semibold">{annee}</h3>
                        <span className="text-sm font-medium text-primary">{totalAnnee.toLocaleString()} DH</span>
                      </div>
                      {/* Mobile card view */}
                      <div className="divide-y divide-zinc-100 sm:hidden">
                        {anneeDepenses.map((d) => (
                          <div key={d.id} className="p-3">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-semibold text-zinc-900">{d.libelle}</span>
                              <span className="text-xs font-medium">{d.montant.toLocaleString()} DH</span>
                            </div>
                            <div className="mb-2 space-y-1 text-xs text-zinc-600">
                              <p>Mois: {moisNoms[d.moisDepart - 1]}</p>
                              {d.imageUrl ? (
                                <a href={d.imageUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">Télécharger reçu</a>
                              ) : <p>Reçu: —</p>}
                            </div>
                            <button onClick={() => handleDeleteDepense(d.id)} disabled={deletingId === d.id} className="w-full rounded-lg bg-red-100 py-2 text-xs font-medium text-red-700 transition-all duration-200 hover:bg-red-500 hover:text-white active:scale-95 disabled:opacity-50">{deletingId === d.id ? "..." : "Supprimer"}</button>
                          </div>
                        ))}
                      </div>
                      {/* Desktop table */}
                      <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-sm md:text-base">
                          <thead className="bg-zinc-50">
                          <tr>
                            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Libellé</th>
                            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Montant</th>
                            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Mois</th>
                            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Reçu</th>
                            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Actions</th>
                          </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100">
                          {anneeDepenses.map((d) => (
                              <tr key={d.id} className="transition-colors duration-150 hover:bg-purple-50/70 even:bg-zinc-50/50">
                                <td className="whitespace-nowrap px-3 py-3 font-medium md:px-4">{d.libelle}</td>
                                <td className="whitespace-nowrap px-3 py-3 md:px-4">{d.montant.toLocaleString()} DH</td>
                                <td className="whitespace-nowrap px-3 py-3 md:px-4">{moisNoms[d.moisDepart - 1]}</td>
                                <td className="whitespace-nowrap px-3 py-3 md:px-4">
                                  {d.imageUrl ? (
                                      <a href={d.imageUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary-hover text-xs md:text-sm">Télécharger</a>
                                  ) : "—"}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3 md:px-4">
                                  <button onClick={() => handleDeleteDepense(d.id)} disabled={deletingId === d.id} className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 transition-all duration-200 hover:bg-red-500 hover:text-white active:scale-95 disabled:opacity-50">{deletingId === d.id ? "..." : "Supprimer"}</button>
                                </td>
                              </tr>
                          ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
}
