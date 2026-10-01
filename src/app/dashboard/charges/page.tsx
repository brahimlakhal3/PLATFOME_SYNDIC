"use client";

import { useEffect, useState, FormEvent } from "react";

type Charge = {
  id: string;
  libelle: string;
  description: string | null;
  montantAnnuel: number | null;
  montantMensuel: number | null;
  typeFixe: boolean;
  imageUrl: string | null;
  annee: number;
};

export default function ChargesPage() {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [chargeAnnee, setChargeAnnee] = useState(new Date().getFullYear().toString());
  const [chargeLibelle, setChargeLibelle] = useState("");
  const [chargeDescription, setChargeDescription] = useState("");
  const [chargeMontantAnnuel, setChargeMontantAnnuel] = useState("");
  const [chargeMontantMensuel, setChargeMontantMensuel] = useState("");
  const [chargeTypeFixe, setChargeTypeFixe] = useState(true);
  const [chargeImage, setChargeImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [buttonAjoutBudget, setButtonAjoutBudget] = useState(false);
  const [deletingChargeId, setDeletingChargeId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/charges")
      .then((r) => r.json())
      .then((d) => setCharges(d?.charges ?? []))
      .catch(() => setCharges([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleAddCharge(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!chargeLibelle.trim()) return setError("Le libellé est requis");
    if (!chargeMontantAnnuel && !chargeMontantMensuel) return setError("Le montant annuel ou mensuel doit être renseigné");
    if (!chargeImage) {
      setButtonAjoutBudget(false);
    }

    let imageUrl = "";
    if (chargeImage) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", chargeImage);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        return setError(uploadData.error || "Erreur lors de l'upload");
      } else {
        setButtonAjoutBudget(false);
      }
      imageUrl = uploadData.url;
      setUploading(false);
    }

    const res = await fetch("/api/charges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        libelle: chargeLibelle,
        description: chargeDescription || null,
        montantAnnuel: chargeMontantAnnuel || null,
        montantMensuel: chargeMontantMensuel || null,
        typeFixe: chargeTypeFixe,
        annee: chargeAnnee,
        imageUrl: imageUrl || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    setChargeLibelle("");
    setChargeDescription("");
    setChargeMontantAnnuel("");
    setChargeMontantMensuel("");
    setChargeTypeFixe(true);
    setChargeImage(null);
    const r = await fetch("/api/charges");
    setCharges((await r.json()).charges);
  }

  async function handleDeleteCharge(id: string) {
    setDeletingChargeId(id);
    await fetch(`/api/charges/${id}`, { method: "DELETE" });
    const r = await fetch("/api/charges");
    setCharges((await r.json()).charges);
    setDeletingChargeId(null);
  }

  function handelButonAjoutBudjet() {
    setButtonAjoutBudget(!buttonAjoutBudget);
  }

  const chargesByYear = charges.reduce<Record<number, Charge[]>>((acc, c) => {
    (acc[c.annee] ??= []).push(c);
    return acc;
  }, {});

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
       <h2 className="p-4 text-2xl font-bold md:text-3xl">Budget prévisionnel</h2>
     </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {Object.keys(chargesByYear).length === 0 ? (
        <div className="animate-fade-in-up rounded-xl bg-white p-12 text-center shadow-sm"><p className="text-zinc-500">Aucune Budget prévisionnelle ajoutée.</p></div>
      ) : (
        <div className="space-y-6">
          {Object.entries(chargesByYear).sort(([a], [b]) => Number(b) - Number(a)).map(([annee, anneeCharges]) => {
            return (
              <div key={annee} className="animate-fade-in-up overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-4">
                  <h3 className="text-lg font-semibold">{annee}</h3>
                </div>
                {/* Mobile card view */}
                <div className="divide-y divide-zinc-100 sm:hidden">
                  {anneeCharges.map((c) => (
                    <div key={c.id} className="p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-zinc-900">{c.libelle}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.typeFixe ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{c.typeFixe ? "Fixe" : "Variable"}</span>
                      </div>
                      <div className="mb-2 space-y-1 text-xs text-zinc-600">
                        <p>Description: {c.description || "—"}</p>
                        <p>Annuel: {c.montantAnnuel?.toLocaleString() ?? "—"} DH | Mensuel: {c.montantMensuel?.toLocaleString() ?? "—"} DH</p>
                        {c.imageUrl && <a href={c.imageUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">Voir le devis</a>}
                      </div>
                      <button onClick={() => handleDeleteCharge(c.id)} disabled={deletingChargeId === c.id} className="w-full rounded-lg bg-red-100 py-2 text-xs font-medium text-red-700 transition-all duration-200 hover:bg-red-500 hover:text-white active:scale-95 disabled:opacity-50">{deletingChargeId === c.id ? "..." : "Supprimer"}</button>
                    </div>
                  ))}
                </div>
                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto p-3">
                  <table className="w-full text-sm md:text-base">
                    <thead>
                      <tr>
                        <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-5 md:py-3">Libellé</th>
                        <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-5 md:py-3">Description</th>
                        <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-5 md:py-3">Type</th>
                        <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-5 md:py-3">Montant annuel</th>
                        <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-5 md:py-3">Montant mensuel</th>
                        <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-5 md:py-3">Devis</th>
                        <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-5 md:py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {anneeCharges.map((c) => (
                        <tr key={c.id} className="transition-colors duration-150 hover:bg-purple-50/70 even:bg-zinc-50/50">
                          <td className="whitespace-nowrap px-3 py-3 font-medium md:px-5">{c.libelle}</td>
                          <td className="max-w-[120px] truncate px-3 py-3 text-zinc-500 md:max-w-xs md:px-5">{c.description || "—"}</td>
                          <td className="whitespace-nowrap px-3 py-3 md:px-5">
                            <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${c.typeFixe ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                              {c.typeFixe ? "Fixe" : "Variable"}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 md:px-5">{c.montantAnnuel?.toLocaleString() ?? "—"} DH</td>
                          <td className="whitespace-nowrap px-3 py-3 md:px-5">{c.montantMensuel?.toLocaleString() ?? "—"} DH</td>
                          <td className="whitespace-nowrap px-3 py-3 md:px-5">
                            {c.imageUrl ? (
                              <a href={c.imageUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary-hover text-xs md:text-sm">Voir le devis</a>
                            ) : "—"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 md:px-5">
                            <button onClick={() => handleDeleteCharge(c.id)} disabled={deletingChargeId === c.id} className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 transition-all duration-200 hover:bg-red-500 hover:text-white active:scale-95 md:px-4 disabled:opacity-50">{deletingChargeId === c.id ? "..." : "Supprimer"}</button>
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

      <div className=" animate-fade-in-up mt-4 flex justify-start">
        <button onClick={handelButonAjoutBudjet} className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover hover:shadow-lg active:scale-95 disabled:opacity-50">
          {buttonAjoutBudget ? "anuller " : "ajouter un Budget"}
        </button>
      </div>

      {buttonAjoutBudget && (
        <form onSubmit={handleAddCharge} className="mt-6 animate-fade-in-up rounded-xl bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md md:p-6">
          <h3 className="mb-4 text-lg font-semibold text-zinc-800">Nouvelle charge prévisionnelle</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500">Libellé</label>
              <input type="text" value={chargeLibelle} onChange={(e) => setChargeLibelle(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500">Année</label>
              <input type="number" value={chargeAnnee} onChange={(e) => setChargeAnnee(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 w-full md:w-24" required />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-medium text-zinc-500">Description</label>
              <textarea value={chargeDescription} onChange={(e) => setChargeDescription(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 resize-y min-h-[60px]" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500">Montant annuel (DH)</label>
              <input type="number" step="0.01" value={chargeMontantAnnuel} onChange={(e) => { setChargeMontantAnnuel(e.target.value); if (e.target.value) setChargeMontantMensuel(""); }} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500">Montant mensuel (DH)</label>
              <input type="number" step="0.01" value={chargeMontantMensuel} onChange={(e) => { setChargeMontantMensuel(e.target.value); if (e.target.value) setChargeMontantAnnuel(""); }} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10" />
            </div>
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input type="checkbox" checked={chargeTypeFixe} onChange={(e) => setChargeTypeFixe(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary" />
                Charge fixe
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input type="checkbox" checked={!chargeTypeFixe} onChange={(e) => setChargeTypeFixe(!e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-500" />
                Charge variable
              </label>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500">Devis (image) — optionnel</label>
            <input type="file" accept="image/*" onChange={(e) => setChargeImage(e.target.files?.[0] || null)} className="text-sm text-zinc-500 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary hover:file:bg-primary/20" />
          </div>
          <div className="mt-4 flex justify-start">
            <button type="submit" disabled={uploading} className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover hover:shadow-lg active:scale-95 disabled:opacity-50">
              {uploading ? "Upload en cours..." : "Ajouter la charge"}
            </button>
          </div>
        </form>
      )}

      <div className="animate-fade-in-up mt-6 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
        {Object.entries(chargesByYear).sort(([a], [b]) => Number(b) - Number(a)).map(([annee, anneeCharges]) => {
          const totalFixes = anneeCharges.filter((c) => c.typeFixe).reduce((s, c) => s + (c.montantAnnuel || 0), 0);
          const totalVariables = anneeCharges.filter((c) => !c.typeFixe).reduce((s, c) => s + (c.montantAnnuel || 0), 0);
          const grandTotal = totalFixes + totalVariables;
          return (
          <div key={annee} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm md:col-span-3">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total des charges {annee}</p>
            <hr className="mt-3 border-zinc-200" />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs text-zinc-500">Charges fixes</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900">{totalFixes.toLocaleString()} DH</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Charges variables</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900">{totalVariables.toLocaleString()} DH</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Total</p>
                <p className="mt-1 text-2xl font-bold text-primary">{grandTotal.toLocaleString()} DH</p>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
