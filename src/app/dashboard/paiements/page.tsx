"use client";

import { useEffect, useState } from "react";

type Bureau = {
  id: string; nom: string;
  quotePartPrivee: number; quotePartCommunes: number | null;
  user?: { nom: string; prenom: string };
};

type Charge = {
  id: string; annee: number;
};

type Paiement = {
  id: string; mois: number; annee: number; montant: number; montantReel: number | null; statut: string;
  bureauId: string;
  bureau?: {
    nom: string;
    quotePartPrivee: number;
    quotePartCommunes: number | null;
    user?: { nom: string; prenom: string }
  };
};

const moisNoms = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const moisNomsFilter = ["Tous", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

export default function PaiementsPage() {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [bureaux, setBureaux] = useState<Bureau[]>([]);
  const [charges, setCharges] = useState<Charge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [paiementFilterAnnee, setPaiementFilterAnnee] = useState(new Date().getFullYear().toString());
  const [generating, setGenerating] = useState(false);
  const [paiementFilterMois, setPaiementFilterMois] = useState(0);
  const [bureauFilter, setBureaufilter] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const [montantReels, setMontantReels] = useState<Record<string, string>>({});
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (paiements.length > 0) {
      setMontantReels((prev) => {
        const next = { ...prev };
        for (const p of paiements) {
          if (next[p.id] === undefined) {
            next[p.id] = (p.montantReel ?? p.montant).toFixed(2);
          }
        }
        return next;
      });
    }
  }, [paiements]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/paiements?annee=${paiementFilterAnnee}`).then((r) => r.json()),
      fetch("/api/bureaux").then((r) => r.json()),
      fetch("/api/charges").then((r) => r.json()),
    ]).then(([pData, bData, cData]) => {
      setPaiements(pData?.paiements ?? []);
      setBureaux(bData?.bureaux ?? []);
      setCharges(cData?.charges ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [paiementFilterAnnee]);

  async function handleGenererPaiements() {
    setError("");
    setGenerating(true);
    const res = await fetch("/api/paiements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ annee: paiementFilterAnnee }),
    });
    const data = await res.json();
    setGenerating(false);
    if (!res.ok) return setError(data.error);
    setPaiements(data.paiements || []);
  }

  async function handleSaveMontantReel(id: string) {
    const value = parseFloat(montantReels[id]);
    if (isNaN(value)) return;
    await fetch(`/api/paiements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ montantReel: value }),
    });
    setPaiements((prev) => prev.map((x) => (x.id === id ? { ...x, montantReel: value } : x)));
  }

  async function handleToggleStatut(p: Paiement) {
    if (togglingId) return;
    setTogglingId(p.id);
    const newStatut = p.statut === "impayé" ? "payé" : "impayé";
    const montantReel = parseFloat(montantReels[p.id]);
    const body: Record<string, unknown> = { statut: newStatut };
    if (!isNaN(montantReel)) {
      body.montantReel = montantReel;
    } else {
      body.montantReel = p.montant;
    }
    await fetch(`/api/paiements/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setPaiements((prev) => prev.map((x) => (x.id === p.id ? { ...x, statut: newStatut, montantReel: body.montantReel as number } : x)));
    setTogglingId(null);
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
        <h2 className="p-4 text-2xl font-bold md:text-3xl">Paiements</h2>
      </div>

    
      <div className="mb-4 flex flex-wrap items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-500">Bureau :</label>
          <select className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10" value={bureauFilter} onChange={(e) => setBureaufilter(e.target.value)}>
            <option value="">Tous</option>
            {bureaux.map((b) => (
              <option key={b.id} value={b.nom}>{b.nom}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-500">Mois :</label>
          <select className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10" value={paiementFilterMois} onChange={(e) => setPaiementFilterMois(Number(e.target.value))}>
            {moisNomsFilter.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-500">Statut :</label>
          <select className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10" value={statutFilter} onChange={(e) => setStatutFilter(e.target.value)}>
            <option value="">Tous</option>
            <option value="payé">Payé</option>
            <option value="impayé">Impayé</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-500">Année :</label>
          <select value={paiementFilterAnnee} onChange={(e) => setPaiementFilterAnnee(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10">
            {[...new Set([...charges.map((c) => c.annee.toString()), paiementFilterAnnee])].sort().reverse().map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {paiements.length === 0 && (
          <button onClick={handleGenererPaiements} disabled={generating} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none">
            {generating ? "Génération..." : "Générer"}
          </button>
        )}
      </div>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {paiements.length > 0 && (
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Total collecté</p>
            <p className="text-xl font-bold text-emerald-600 md:text-2xl">
              {paiements
                .filter((p) => p.statut === "payé")
                .reduce((s, p) => s + (p.montantReel ?? p.montant), 0)
                .toLocaleString()} DH
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Total impayé</p>
            <p className="text-xl font-bold text-amber-600 md:text-2xl">
              {paiements
                .filter((p) => p.statut === "impayé")
                .reduce((s, p) => s + (p.montantReel ?? p.montant), 0)
                .toLocaleString()} DH
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Total global</p>
            <p className="text-xl font-bold text-zinc-800 md:text-2xl">
              {paiements
                .reduce((s, p) => s + (p.montantReel ?? p.montant), 0)
                .toLocaleString()} DH
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Différence (payés)</p>
            <p className="text-xl font-bold text-blue-600 md:text-2xl">
              {(() => {
                const diff = paiements
                  .filter((p) => p.statut === "payé")
                  .reduce((s, p) => s + ((p.montantReel ?? p.montant) - p.montant), 0);
                return diff >= 0 ? `+${diff.toLocaleString()} DH` : `${diff.toLocaleString()} DH`;
              })()}
            </p>
          </div>
        </div>
      )}

      {paiements.length === 0 ? (
        <div className="animate-fade-in-up rounded-xl bg-white p-12 text-center shadow-sm"><p className="text-zinc-500">Aucun paiement pour {paiementFilterAnnee}.</p></div>
      ) : (
        <div className="animate-fade-in-up overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          {/* Mobile card view */}
          <div className="divide-y divide-zinc-100 sm:hidden">
            {paiements.filter((p) => {
              const matchBureau = bureauFilter === '' || p.bureau?.nom === bureauFilter;
              const matchMois = paiementFilterMois === 0 || p.mois === paiementFilterMois;
              const matchStatut = statutFilter === '' || p.statut === statutFilter;
              return matchBureau && matchMois && matchStatut;
            }).map((p) => (
              <div key={p.id} className="p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-900">{p.bureau?.nom || "—"}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.statut === "payé" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{p.statut}</span>
                </div>
                <div className="mb-2 space-y-1 text-xs text-zinc-600">
                  <p>Mois: {moisNoms[p.mois - 1]} | Montant: {Math.floor(p.montant)} DH</p>
                  <p>Quote-part: {p.bureau ? (p.bureau.quotePartPrivee + (p.bureau.quotePartCommunes ?? 0) * 0.5).toFixed(2) : "—"}</p>
                  <p>Copropriétaire: {p.bureau?.user ? `${p.bureau.user.prenom} ${p.bureau.user.nom}` : "—"}</p>
                  <p>Réel: {p.statut === "payé" ? <span className="font-bold text-emerald-600">{(p.montantReel ?? p.montant).toLocaleString()} DH</span> : "—"}</p>
                </div>
                {p.statut === "impayé" && (
                  <div className="mb-2">
                    <input
                      type="number"
                      step="0.01"
                      value={montantReels[p.id] ?? (p.montantReel ?? p.montant).toFixed(2)}
                      onChange={(e) => setMontantReels((prev) => ({ ...prev, [p.id]: e.target.value }))}
                      onBlur={() => handleSaveMontantReel(p.id)}
                      className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                      placeholder="Montant réel"
                    />
                  </div>
                )}
                {p.statut === "impayé" ? (
                  <button onClick={() => handleToggleStatut(p)} disabled={togglingId === p.id} className="w-full rounded-lg bg-emerald-500 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 shadow-sm">{togglingId === p.id ? "..." : "Marquer payé"}</button>
                ) : (
                  <button onClick={() => handleToggleStatut(p)} disabled={togglingId === p.id} className="w-full rounded-lg bg-amber-500 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-amber-600 active:scale-95 disabled:opacity-50 shadow-sm">{togglingId === p.id ? "..." : "Marquer impayé"}</button>
                )}
              </div>
            ))}
          </div>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Bureau</th>
                  <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Quote-part</th>
                  <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Copropriétaire</th>
                  <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Mois</th>
                  <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Montant</th>
                  <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Montant réel</th>
                  <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Statut</th>
                  <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {paiements.filter((p) => {
                  const matchBureau = bureauFilter === '' || p.bureau?.nom === bureauFilter;
                  const matchMois = paiementFilterMois === 0 || p.mois === paiementFilterMois;
                  const matchStatut = statutFilter === '' || p.statut === statutFilter;
                  return matchBureau && matchMois && matchStatut;
                }).map((p) => (
                  <tr key={p.id} className="transition-colors duration-150 hover:bg-purple-50/70 even:bg-zinc-50/50">
                    <td className="whitespace-nowrap px-3 py-3 font-medium md:px-4">{p.bureau?.nom || "—"}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-zinc-500 md:px-4">
                      {p.bureau ? (p.bureau.quotePartPrivee + (p.bureau.quotePartCommunes ?? 0) * 0.5).toFixed(2) : "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-zinc-500 md:px-4">
                      {p.bureau?.user ? `${p.bureau.user.prenom} ${p.bureau.user.nom}` : "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 md:px-4">{moisNoms[p.mois - 1]}</td>
                    <td className="whitespace-nowrap px-3 py-3 md:px-4">{Math.floor(p.montant)} DH</td>
                    <td className="whitespace-nowrap px-3 py-3 md:px-4">
                      {p.statut === "payé" ? (
                        <span className="font-bold text-emerald-600">{(p.montantReel ?? p.montant).toLocaleString()} DH</span>
                      ) : (
                        <input
                          type="number"
                          step="0.01"
                          value={montantReels[p.id] ?? (p.montantReel ?? p.montant).toFixed(2)}
                          onChange={(e) => setMontantReels((prev) => ({ ...prev, [p.id]: e.target.value }))}
                          onBlur={() => handleSaveMontantReel(p.id)}
                          className="w-24 rounded border border-zinc-300 px-2 py-1 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 md:px-4">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${p.statut === "payé" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {p.statut}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 md:px-4">
                      {p.statut === "impayé" ? (
                        <button onClick={() => handleToggleStatut(p)} disabled={togglingId === p.id} className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 shadow-sm">{togglingId === p.id ? "..." : "Marquer payé"}</button>
                      ) : (
                        <button onClick={() => handleToggleStatut(p)} disabled={togglingId === p.id} className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-amber-600 active:scale-95 disabled:opacity-50 shadow-sm">{togglingId === p.id ? "..." : "Marquer impayé"}</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
