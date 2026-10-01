"use client";

import { useEffect, useState, FormEvent } from "react";

type Bureau = {
  id: string; nom: string;
  numeroBureau: number;
  userId: string;
};

type Copro = {
  id: string; nom: string; prenom: string;
  telephone: string | null; adresse: string; createdAt: string;
  _count?: { bureaux: number }; bureaux?: Bureau[];
  _password?: string;
};

const emptyCopro = { nom: "", prenom: "", telephone: "", adresse: "" };

export default function CoproprietairesPage() {
  const [copros, setCopros] = useState<Copro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCoproModal, setShowCoproModal] = useState(false);
  const [editingCopro, setEditingCopo] = useState<Copro | null>(null);
  const [coproForm, setCoproForm] = useState(emptyCopro);
  const [generatedCreds, setGeneratedCreds] = useState<{ telephone: string; password: string } | null>(null);
  const [resetPwdData, setResetPwdData] = useState<{ copro: Copro; password: string } | null>(null);
  const [bureauxDisponibles, setBureauxDisponibles] = useState<Bureau[]>([]);
  const [selectedBureauIds, setSelectedBureauIds] = useState<string[]>([]);

  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [resettingPwd, setResettingPwd] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/coproprietaires")
      .then((r) => r.json())
      .then((d) => setCopros(d?.coproprietaires ?? []))
      .catch(() => setCopros([]))
      .finally(() => setLoading(false));
  }, []);

  function openCreateCopro() {
    setEditingCopo(null);
    setCoproForm(emptyCopro);
    setError("");
    setGeneratedCreds(null);
    setSelectedBureauIds([]);
    fetch("/api/bureaux?disponible=true")
      .then((r) => r.json())
      .then((d) => setBureauxDisponibles(d.bureaux || []))
      .catch(() => setBureauxDisponibles([]));
    setShowCoproModal(true);
  }

  function openEditCopro(c: Copro) {
    setEditingCopo(c);
    setCoproForm({ nom: c.nom, prenom: c.prenom, telephone: c.telephone || "", adresse: c.adresse });
    setError("");
    setGeneratedCreds(null);
    const ownedIds = (c.bureaux || []).map((b) => b.id);
    setSelectedBureauIds(ownedIds);
    fetch("/api/bureaux")
      .then((r) => r.json())
      .then((d) => setBureauxDisponibles(d.bureaux || []))
      .catch(() => setBureauxDisponibles([]));
    setShowCoproModal(true);
  }

  async function handleCoproSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setGeneratedCreds(null);
    setSubmitting(true);
    const url = editingCopro ? `/api/coproprietaires/${editingCopro.id}` : "/api/coproprietaires";
    const method = editingCopro ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...coproForm, bureauIds: selectedBureauIds })
    });
    const data = await res.json();
    if (!res.ok) { setSubmitting(false); return setError(data.error); }
    setShowCoproModal(false);
    setSubmitting(false);
    if (data.credentials) {
      setGeneratedCreds(data.credentials);
    }
    const r = await fetch("/api/coproprietaires");
    const newCopros: Copro[] = (await r.json()).coproprietaires;
    if (data.credentials) {
      const match = newCopros.find((c) => c.id === data.coproprietaire?.id);
      if (match) match._password = data.credentials.password;
    }
    setCopros(newCopros);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/coproprietaires/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    setDeleting(false);
    const r = await fetch("/api/coproprietaires");
    setCopros((await r.json()).coproprietaires);
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
        <h2 className="p-4 text-2xl font-bold md:text-3xl">Copropriétaires</h2>
      </div>



      {copros.length === 0 ? (
        <div className="animate-fade-in-up rounded-xl bg-white p-12 text-center shadow-sm"><p className="text-zinc-500">Aucun copropriétaire pour le moment.</p></div>
      ) : (
        <div className="animate-fade-in-up overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          {/* Mobile card view */}
          <div className="divide-y divide-zinc-100 sm:hidden">
            {copros.map((c) => (
              <div key={c.id} className="p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-900">{c.prenom} {c.nom}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{c._count?.bureaux ?? 0} bureau(x)</span>
                </div>
                <div className="mb-2 space-y-1 text-xs text-zinc-600">
                  <p>Tél: <span className="text-blue-500">{c.telephone || "—"}</span></p>
                  <p>Adresse: {c.adresse}</p>
                  <p>MDP: {c._password ? <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-zinc-600">{c._password}</span> : "—"}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditCopro(c)} className="flex-1 rounded-lg bg-primary/10 py-2 text-xs font-medium text-primary transition-all duration-200 hover:bg-primary hover:text-white active:scale-95">Modifier</button>
                  <button onClick={async () => {
                    if (resettingPwd) return;
                    setResettingPwd(c.id);
                    const r = await fetch(`/api/coproprietaires/${c.id}`, { method: "PATCH" });
                    const d = await r.json();
                    setResettingPwd(null);
                    if (r.ok) {
                      setCopros((prev) => prev.map((x) => x.id === c.id ? { ...x, _password: d.password } : x));
                      setResetPwdData({ copro: { ...c, _password: d.password }, password: d.password });
                    }
                  }} className="flex-1 rounded-lg bg-amber-100 py-2 text-xs font-medium text-amber-700 transition-all duration-200 hover:bg-amber-500 hover:text-white active:scale-95 disabled:opacity-50">{resettingPwd === c.id ? "..." : "MDP"}</button>
                  <button onClick={() => setDeleteTarget({ type: "copro", id: c.id, name: `${c.prenom} ${c.nom}` })} className="flex-1 rounded-lg bg-red-100 py-2 text-xs font-medium text-red-700 transition-all duration-200 hover:bg-red-500 hover:text-white active:scale-95">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Prénom</th>
                  <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Nom</th>
                  <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Téléphone</th>
                  <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Adresse</th>
                  <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">MDP</th>
                  <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Bureaux</th>
                  <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:px-4 md:py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {copros.map((c) => (
                  <tr key={c.id} className="transition-colors duration-150 hover:bg-purple-50/70 even:bg-zinc-50/50">
                    <td className="whitespace-nowrap px-3 py-3 font-medium md:px-4">{c.prenom}</td>
                    <td className="whitespace-nowrap px-3 py-3 md:px-4">{c.nom}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-blue-500 md:px-4">{c.telephone || "—"}</td>
                    <td className="max-w-[120px] truncate px-3 py-3 text-zinc-500 md:max-w-xs md:px-4">{c.adresse}</td>
                    <td className="whitespace-nowrap px-3 py-3 md:px-4">
                      {c._password ? (
                        <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600">{c._password}</span>
                      ) : (
                        <span className="text-xs text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 md:px-4"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{c._count?.bureaux ?? 0}</span></td>
                    <td className="whitespace-nowrap px-3 py-3 md:px-4">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEditCopro(c)} className="rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary transition-all duration-200 hover:bg-primary hover:text-white active:scale-95 md:px-3">Modifier</button>
                        <button onClick={async () => {
                          if (resettingPwd) return;
                          setResettingPwd(c.id);
                          const r = await fetch(`/api/coproprietaires/${c.id}`, { method: "PATCH" });
                          const d = await r.json();
                          setResettingPwd(null);
                          if (r.ok) {
                            setCopros((prev) => prev.map((x) => x.id === c.id ? { ...x, _password: d.password } : x));
                            setResetPwdData({ copro: { ...c, _password: d.password }, password: d.password });
                          }
                        }} className="rounded-lg bg-amber-100 px-2.5 py-1.5 text-xs font-medium text-amber-700 transition-all duration-200 hover:bg-amber-500 hover:text-white active:scale-95 disabled:opacity-50 md:px-3">{resettingPwd === c.id ? "..." : "MDP"}</button>
                        <button onClick={() => setDeleteTarget({ type: "copro", id: c.id, name: `${c.prenom} ${c.nom}` })} className="rounded-lg bg-red-100 px-2.5 py-1.5 text-xs font-medium text-red-700 transition-all duration-200 hover:bg-red-500 hover:text-white active:scale-95 md:px-3">Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


      )}
      {
        <div className=" animate-fade-in-up mb-6 mt-7   flex flex-col gap-2 md:mt-0 md:flex-row md:items-center md:justify-between">
          <button onClick={openCreateCopro} className="self-start rounded-lg bg-primary mt-4 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover hover:shadow-lg active:scale-95 md:self-auto">+ Ajouter un copropriétaire</button>
        </div>
      }

      {generatedCreds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="animate-scale-in flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-8 shadow-lg">
            <h2 className="text-lg font-semibold text-green-700">Copropriétaire créé avec succès</h2>
            <p className="text-sm text-zinc-600">Identifiants générés automatiquement :</p>
            <div className="rounded-lg bg-zinc-100 p-4 text-sm">
              <p><strong>Téléphone :</strong> {generatedCreds.telephone}</p>
              <p><strong>Mot de passe :</strong> <span className="font-mono">{generatedCreds.password}</span></p>
            </div>
            <p className="text-xs text-zinc-500">Transmettez ces identifiants au copropriétaire.</p>
            <a href={`https://wa.me/${(coproForm.telephone.replace(/[^0-9]/g, "").replace(/^0+/, "212"))}?text=${encodeURIComponent(
              `Bonjour ${coproForm.prenom} ${coproForm.nom},\n\nVotre compte copropriétaire a été créé avec succès.\n\nTéléphone: ${generatedCreds.telephone}\nMot de passe: ${generatedCreds.password}\n\nLien de connexion: https://${window.location.host}/login\n\nCordialement,\nL'équipe de gestion immobilière`
            )}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-green-500 hover:shadow-lg active:scale-95">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Envoyer par WhatsApp
            </a>
            <button onClick={() => setGeneratedCreds(null)} className="rounded-lg bg-zinc-800 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-zinc-700 active:scale-95">Fermer</button>
          </div>
        </div>
      )}

      {resetPwdData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="animate-scale-in flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-8 shadow-lg">
            <h2 className="text-lg font-semibold text-amber-700">Mot de passe réinitialisé</h2>
            <p className="text-sm text-zinc-600">Nouveau mot de passe pour <strong>{resetPwdData.copro.prenom} {resetPwdData.copro.nom}</strong> :</p>
            <div className="rounded-lg bg-zinc-100 p-4 text-sm">
              <p><strong>Téléphone :</strong> {resetPwdData.copro.telephone}</p>
              <p><strong>Mot de passe :</strong> <span className="font-mono">{resetPwdData.password}</span></p>
            </div>
            <p className="text-xs text-zinc-500">Transmettez ce nouveau mot de passe au copropriétaire.</p>
            {resetPwdData.copro.telephone && (
              <a href={`https://wa.me/${resetPwdData.copro.telephone.replace(/[^0-9]/g, "").replace(/^0+/, "212")}?text=${encodeURIComponent(
                `Bonjour ${resetPwdData.copro.prenom} ${resetPwdData.copro.nom},\n\nVotre mot de passe a été réinitialisé.\n\nTéléphone: ${resetPwdData.copro.telephone}\nNouveau mot de passe: ${resetPwdData.password}\n\nLien de connexion: https://${window.location.host}/login\n\nCordialement,\nL'équipe de gestion immobilière`
              )}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-green-500 hover:shadow-lg active:scale-95">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Envoyer par WhatsApp
              </a>
            )}
            <button onClick={() => setResetPwdData(null)} className="rounded-lg bg-zinc-800 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-zinc-700 active:scale-95">Fermer</button>
          </div>
        </div>
      )}

      {showCoproModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <form onSubmit={handleCoproSubmit} className="animate-scale-in flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-8 shadow-lg">
            <h2 className="text-lg font-semibold">{editingCopro ? "Modifier le copropriétaire" : "Nouveau copropriétaire"}</h2>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700">Nom <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Nom" value={coproForm.nom} onChange={(e) => setCoproForm({ ...coproForm, nom: e.target.value })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700">Prenom <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Prénom" value={coproForm.prenom} onChange={(e) => setCoproForm({ ...coproForm, prenom: e.target.value })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700">Telephone <span className="text-red-500">*</span></label>
              <input type="tel" placeholder="Ex: 06 00 00 00 " value={coproForm.telephone} onChange={(e) => setCoproForm({ ...coproForm, telephone: e.target.value })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700">Adresse <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Adresse" value={coproForm.adresse} onChange={(e) => setCoproForm({ ...coproForm, adresse: e.target.value })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10" required />
            </div>
            {bureauxDisponibles.length > 0 && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-zinc-500">Bureaux</label>
                <div className="max-h-40 overflow-y-auto rounded-lg border border-zinc-300 p-2">
                  {bureauxDisponibles.map((b) => (
                    <label key={b.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors hover:bg-zinc-100">
                      <input type="checkbox" checked={selectedBureauIds.includes(b.id)} onChange={() => setSelectedBureauIds((prev) => prev.includes(b.id) ? prev.filter((x) => x !== b.id) : [...prev, b.id])} className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                      #{b.numeroBureau} — {b.nom}
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button type="submit" disabled={submitting} className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> {editingCopro ? "Enregistrement..." : "Création..."}</> : (editingCopro ? "Enregistrer" : "Créer le compte")}
              </button>
              <button type="button" onClick={() => setShowCoproModal(false)} className="flex-1 rounded-lg border border-zinc-300 py-2 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-100 active:scale-95">Annuler</button>
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
