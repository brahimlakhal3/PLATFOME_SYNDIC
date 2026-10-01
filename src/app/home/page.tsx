"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import GroupMessagesUI from "@/components/GroupMessagesUI";

type GroupMessage = {
  id: string; content: string; isAnonymous: boolean; createdAt: string;
  sender: { id: string; nom: string; prenom: string; role: string };
};

type User = { id: string; nom: string; prenom: string; role: string };

type Bureau = {
  id: string; nom: string;
  etage: number | null;
  titreFoncier: string | null;
  quotePartPrivee: number; quotePartCommunes: number | null;
  numeroBureau: number;
};

type Paiement = {
  id: string; mois: number; annee: number; montant: number; montantReel: number | null; statut: string;
  bureau?: { nom: string };
};

type Message = {
  id: string; content: string; lu: boolean; createdAt: string;
  sender: { id: string; nom: string; prenom: string; role: string };
};

const moisNoms = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bureaux, setBureaux] = useState<Bureau[]>([]);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [copros, setCopros] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("dashboard");

  const [msgReceiver, setMsgReceiver] = useState("");
  const [msgContent, setMsgContent] = useState("");
  const [msgError, setMsgError] = useState("");
  const [msgSending, setMsgSending] = useState("");

  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([]);
  const [grpContent, setGrpContent] = useState("");
  const [grpAnonymous, setGrpAnonymous] = useState(false);
  const [grpSending, setGrpSending] = useState(false);

  const [activeVotes, setActiveVotes] = useState<{ id: string; title: string; description: string | null }[]>([]);
  const [voting, setVoting] = useState(false);
  const activeVote = activeVotes[0] || null;

  const [showAllLots, setShowAllLots] = useState(false);
  const [showLotsModal, setShowLotsModal] = useState(false);

  // Paiements - filtres et modal
  const [showPaiementsModal, setShowPaiementsModal] = useState(false);
  const [paiementFilterAnnee, setPaiementFilterAnnee] = useState(new Date().getFullYear().toString());
  const [paiementFilterMois, setPaiementFilterMois] = useState(0); // 0 = tous
  const [paiementFilterStatut, setPaiementFilterStatut] = useState(""); // "" = tous

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        if (data.user.role !== "coproprietaire") router.push("/dashboard");
        else setUser(data.user);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch("/api/bureaux").then((r) => r.json()),
      fetch("/api/paiements").then((r) => r.json()),
      fetch("/api/messages").then((r) => r.ok ? r.json() : { messages: [] }),
      fetch("/api/coproprietaires?all=true").then((r) => r.json()),
      fetch("/api/group-messages").then((r) => r.ok ? r.json() : { messages: [] }),
      fetch("/api/votes").then((r) => r.ok ? r.json() : { votes: [], vote: null, aVote: true }),
    ])
      .then(([bData, pData, mData, cData, gData, vData]) => {
        setBureaux(bData.bureaux);
        setPaiements(pData.paiements);
        setMessages(mData.messages);
        setCopros((cData.coproprietaires || []).filter((c: User) => c.id !== user.id));
        setGroupMessages(gData.messages ?? []);
        if (vData.votes && vData.votes.length > 0) {
          setActiveVotes(vData.votes);
        } else if (vData.vote && !vData.aVote) {
          setActiveVotes([vData.vote]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    setMsgError("");
    setMsgSending("");

    if (!msgReceiver || !msgContent.trim()) {
      setMsgError("Veuillez sélectionner un destinataire et écrire un message.");
      return;
    }

    setMsgSending("Envoi...");
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: msgReceiver, content: msgContent }),
    });
    const data = await res.json();
    setMsgSending("");

    if (!res.ok) return setMsgError(data.error);

    setMsgContent("");
    setMsgReceiver("");
    const r = await fetch("/api/messages");
    setMessages((await r.json()).messages);
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-primary" />
          <p className="text-sm text-zinc-500">Chargement...</p>
        </div>
      </div>
    );
  }

  async function handleVote(choix: string) {
    if (!activeVote) return;
    setVoting(true);
    await fetch(`/api/votes/${activeVote.id}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ choix }),
    });
    setVoting(false);
    setActiveVotes((prev) => prev.slice(1));
  }

  const sidebarTabs = [
    { id: "dashboard", label: "Tableau de bord" },
    { id: "communication", label: "Communication" },
    { id: "messages", label: "Messagerie" },
  ];

  const totalImpaye = paiements.filter((p) => p.statut === "impayé").reduce((s, p) => s + p.montant, 0);
  const messagesNonLues = messages.filter((m) => !m.lu).length;
  const paiementsImpayes = paiements.filter((p) => p.statut === "impayé");
  const prochainPaiement = paiementsImpayes.length > 0
    ? paiementsImpayes.sort((a, b) => a.annee - b.annee || a.mois - b.mois)[0]
    : null;
  const totalQuotePrivee = bureaux.reduce((s, b) => s + b.quotePartPrivee, 0);
  const totalQuoteCommunes = bureaux.reduce((s, b) => s + (b.quotePartCommunes ?? 0), 0);

  // Années disponibles pour le filtre
  const anneesDisponibles = [...new Set(paiements.map((p) => p.annee.toString()))].sort((a, b) => Number(b) - Number(a));
  if (!anneesDisponibles.includes(paiementFilterAnnee) && anneesDisponibles.length > 0) {
    setPaiementFilterAnnee(anneesDisponibles[0]);
  }

  // Paiements filtrés pour la modal
  const paiementsFiltres = paiements.filter((p) => {
    const matchAnnee = p.annee.toString() === paiementFilterAnnee;
    const matchMois = paiementFilterMois === 0 || p.mois === paiementFilterMois;
    const matchStatut = paiementFilterStatut === "" || p.statut === paiementFilterStatut;
    return matchAnnee && matchMois && matchStatut;
  });

  // Paiements triés (plus récents d'abord)
  const paiementsTries = [...paiementsFiltres].sort((a, b) => b.annee - a.annee || b.mois - a.mois);

  return (
    <div className="min-h-screen bg-white">
      {activeVote && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="animate-scale-in w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 md:p-8 shadow-2xl border border-zinc-100">
            {/* Header icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-8 ring-primary/5">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Title & subtitle */}
            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Consultation Copropriété
              </span>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-zinc-900">Vote & Sondage en cours</h2>
              <p className="mt-1 text-sm text-zinc-500">Votre avis est requis pour enregistrer la décision collective.</p>
            </div>

            {/* Question card */}
            <div className="mt-6 rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.01" />
                  </svg>
                  Sujet du vote
                </div>
                {activeVotes.length > 1 && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold tracking-normal text-primary">
                    1 sur {activeVotes.length}
                  </span>
                )}
              </div>
              <h3 className="mt-1.5 text-base font-semibold text-zinc-900">{activeVote.title}</h3>
              {activeVote.description && (
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{activeVote.description}</p>
              )}
            </div>

            {/* Voting option buttons */}
            <div className="mt-6 grid grid-cols-1 gap-2.5">
              {/* Pour */}
              <button
                onClick={() => handleVote("pour")}
                disabled={voting}
                className="group flex items-center justify-between rounded-xl border border-emerald-200/80 bg-emerald-50/50 px-4 py-3.5 text-sm font-medium text-emerald-900 transition-all duration-150 hover:bg-emerald-100/70 hover:border-emerald-300 active:scale-[0.99] disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <span className="font-semibold">Pour</span>
                </div>
                <span className="text-xs font-medium text-emerald-600">Accepter la proposition</span>
              </button>

              {/* Contre */}
              <button
                onClick={() => handleVote("contre")}
                disabled={voting}
                className="group flex items-center justify-between rounded-xl border border-rose-200/80 bg-rose-50/50 px-4 py-3.5 text-sm font-medium text-rose-900 transition-all duration-150 hover:bg-rose-100/70 hover:border-rose-300 active:scale-[0.99] disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-700 transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  <span className="font-semibold">Contre</span>
                </div>
                <span className="text-xs font-medium text-rose-600">Refuser la proposition</span>
              </button>

              {/* Neutre / Abstention */}
              <button
                onClick={() => handleVote("neutre")}
                disabled={voting}
                className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm font-medium text-zinc-800 transition-all duration-150 hover:bg-zinc-100 hover:border-zinc-300 active:scale-[0.99] disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-200/80 text-zinc-600 transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                    </svg>
                  </span>
                  <span className="font-semibold">Neutre / Abstention</span>
                </div>
                <span className="text-xs font-medium text-zinc-500">Sans avis particulier</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <Sidebar
        tabs={sidebarTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userName={`${user.prenom} ${user.nom}`}
        userRole={user.role}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onMobileToggle={setMobileOpen}
      />
      {/* Mobile top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm"
            aria-label="Ouvrir le menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-zinc-800">CadSyndic</h1>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
        >
          {loggingOut ? "..." : "Déconnexion"}
        </button>
      </div>
      <div className="md:ml-64">
        <div className="mx-auto max-w-6xl px-3 py-4 animate-fade-in md:px-4 md:py-8">
          {/* ===== TABLEAU DE BORD UNIFIE ===== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Header avec bienvenue */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-zinc-900 md:text-3xl">Bonjour, {user.prenom}</h1>
                  <p className="mt-1 text-zinc-500">Voici un aperçu de votre situation.</p>
                </div>
                <div className="flex items-center gap-2 sm:ml-auto">
                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {bureaux.length} lot{bureaux.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* --- Cartes indicateurs clés --- */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 md:p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Mes lots</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900">{bureaux.length}</p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 md:p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Paiements en attente</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900">{paiementsImpayes.length}</p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 md:p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total impayé</p>
                  <p className="mt-1 text-2xl font-bold text-red-500">{totalImpaye.toLocaleString()} DH</p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 md:p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Messages non lus</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900">{messagesNonLues > 0 ? <span className="text-primary">{messagesNonLues}</span> : 0}</p>
                </div>
              </div>

              {/* --- Prochain paiement à venir --- */}
              {prochainPaiement && (
                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">Prochain paiement dû</p>
                        <p className="text-sm text-zinc-500">{prochainPaiement.bureau?.nom || "—"} • {moisNoms[prochainPaiement.mois - 1]} {prochainPaiement.annee}</p>
                      </div>
                    </div>
                    <div className="text-right sm:ml-auto">
                      <p className="text-2xl font-bold text-amber-600">{prochainPaiement.montant.toLocaleString()} DH</p>
                      <p className="text-xs text-zinc-500">Montant à régler</p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- Mes lots (1 ligne = 3 lots par défaut + Bouton Modale Tous les Lots) --- */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-zinc-900 md:text-xl">Mes lots</h2>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {bureaux.length} lot{bureaux.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  {bureaux.length > 0 && (
                    <button
                      onClick={() => setShowLotsModal(true)}
                      className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary transition-all duration-200 hover:bg-primary/10 active:scale-95 shadow-sm"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                      </svg>
                      <span>Voir toutes les informations</span>
                    </button>
                  )}
                </div>

                {bureaux.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                    {bureaux.slice(0, 3).map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs shadow-inner">
                            #{b.numeroBureau}
                          </div>
                          <div>
                            <h3 className="font-bold text-zinc-900 text-sm md:text-base leading-snug">{b.nom}</h3>
                            <p className="text-xs text-zinc-500">
                              {(b.quotePartPrivee + (b.quotePartCommunes || 0)).toLocaleString()} m² au total
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowLotsModal(true)}
                          className="inline-flex items-center gap-1 shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition-colors shadow-xs"
                        >
                          <span>Détails</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500">
                    <p>Aucun lot associé à votre compte.</p>
                  </div>
                )}
              </div>

              {/* --- Quotes-parts résumé --- */}
              {(totalQuotePrivee > 0 || totalQuoteCommunes > 0) && (
                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm md:p-6">
                  <h3 className="text-lg font-semibold text-zinc-900 mb-4">Récapitulatif quotes-parts</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-lg bg-zinc-50 p-4 text-center">
                      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Quote-part privative</p>
                      <p className="mt-1 text-2xl font-bold text-zinc-900">{totalQuotePrivee.toLocaleString()} m²</p>
                    </div>
                    <div className="rounded-lg bg-zinc-50 p-4 text-center">
                      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Quote-part communes</p>
                      <p className="mt-1 text-2xl font-bold text-zinc-900">{totalQuoteCommunes.toLocaleString()} m²</p>
                    </div>
                    <div className="rounded-lg bg-primary/5 p-4 text-center border border-primary/10">
                      <p className="text-xs font-medium uppercase tracking-wider text-primary">Superficie totale</p>
                      <p className="mt-1 text-2xl font-bold text-primary">{(totalQuotePrivee + totalQuoteCommunes).toLocaleString()} m²</p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- Paiements récents (EN BAS FINAL) --- */}
              <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h2 className="text-lg font-semibold text-zinc-900">Paiements récents</h2>
                    <div className="flex items-center gap-3">
                      {paiements.length > 3 && (
                        <span className="text-sm text-zinc-500">{paiements.length} au total</span>
                      )}
                      {paiements.length > 0 && (
                        <button
                          onClick={() => { setPaiementFilterAnnee(new Date().getFullYear().toString()); setPaiementFilterMois(0); setPaiementFilterStatut(""); setShowPaiementsModal(true); }}
                          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover active:scale-95 shadow-sm flex items-center gap-2"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Voir tous
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-50">
                      <tr>
                        <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 text-left">Bureau</th>
                        <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 text-left">Période</th>
                        <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 text-right">Montant</th>
                        <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 text-right">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {paiements.slice(0, 3).map((p) => (
                        <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-zinc-900">{p.bureau?.nom || "—"}</td>
                          <td className="px-4 py-3 text-zinc-500">{moisNoms[p.mois - 1]} {p.annee}</td>
                          <td className="px-4 py-3 text-right font-medium text-zinc-900">{p.montant.toLocaleString()} DH</td>
                          <td className="px-4 py-3 text-right">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              p.statut === "payé" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                            }`}>
                              {p.statut}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {paiements.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">Aucun paiement pour le moment.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {paiements.length > 3 && (
                  <div className="px-4 py-3 border-t border-zinc-100 bg-zinc-50 text-center">
                    <span className="text-sm text-zinc-500">Affichage des 3 plus récents sur {paiements.length}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== COMMUNICATION ===== */}
          {activeTab === "communication" && (
            <div className="mb-8">
              <div className="mb-6 mt-2 rounded-lg bg-zinc-400/10 md:mt-4">
                <h2 className="p-4 text-2xl font-bold md:text-3xl">Communication</h2>
              </div>
              <GroupMessagesUI
                messages={groupMessages}
                currentUserId={user?.id || null}
                onSendMessage={async (content, isAnonymous) => {
                  const res = await fetch("/api/group-messages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content, isAnonymous }),
                  });
                  if (!res.ok) {
                    const d = await res.json();
                    throw new Error(d.error || "Erreur lors de l'envoi du message");
                  }
                  const r = await fetch("/api/group-messages");
                  if (r.ok) {
                    const data = await r.json();
                    setGroupMessages(data.messages ?? []);
                  }
                }}
                allowAnonymous={true}
              />
            </div>
          )}

          {/* ===== MESSAGERIE ===== */}
          {activeTab === "messages" && (
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">Messagerie</h2>

              <div className="animate-fade-in-up mb-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-6 py-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">+</div>
                  <h3 className="text-lg font-semibold">Nouveau message</h3>
                </div>
                <form onSubmit={handleSendMessage} className="p-6">
                  {msgError && <p className="mb-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{msgError}</p>}
                  <div className="mb-3">
                    <select
                      value={msgReceiver}
                      onChange={(e) => setMsgReceiver(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                      required
                    >
                      <option value="">Choisir un destinataire</option>
                      {copros.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.prenom} {c.nom} ({c.role === "syndic" ? "Syndic" : "Copropriétaire"})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative mb-3">
                    <textarea
                      placeholder="Écrivez votre message..."
                      value={msgContent}
                      onChange={(e) => setMsgContent(e.target.value)}
                      className="min-h-[110px] w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 resize-y"
                      required
                    />
                    <span className="absolute bottom-3 right-3 text-xs text-zinc-400">{msgContent.length} caractères</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      disabled={!!msgSending}
                      className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-sm"
                    >
                      {msgSending ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Envoi...
                        </span>
                      ) : "Envoyer le message"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="animate-fade-in-up overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-6 py-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Messages reçus</h3>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{messages.length}</span>
                </div>
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                    <p className="text-zinc-500">Aucun message reçu.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100">
                    {messages.map((m) => (
                      <div key={m.id} className={`group px-6 py-5 transition-all duration-200 hover:bg-zinc-50/50 ${!m.lu ? "bg-primary/[0.03]" : ""}`}>
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${m.sender.role === "syndic" ? "bg-primary" : "bg-amber-500"}`}>
                              {m.sender.prenom[0]}{m.sender.nom[0]}
                            </div>
                            <div>
                              <p className="flex items-center gap-2 text-sm font-medium">
                                {m.sender.prenom} {m.sender.nom}
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${m.sender.role === "syndic" ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-700"}`}>
                                  {m.sender.role === "syndic" ? "Syndic" : "Copropriétaire"}
                                </span>
                              </p>
                              <p className="text-xs text-zinc-400">
                                {new Date(m.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                          {!m.lu && (
                            <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-primary shadow-sm shadow-primary/30">
                              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-primary opacity-75" />
                            </span>
                          )}
                        </div>
                        <div className={`ml-13 rounded-xl px-4 py-3 text-sm leading-relaxed ${!m.lu ? "bg-primary/[0.04] text-zinc-800" : "bg-zinc-50 text-zinc-600"}`}>
                          <p className="whitespace-pre-wrap">{m.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
)}
              </div>
            </div>
           )}

           {/* ===== MODAL TOUS LES PAIEMENTS ===== */}
           {showPaiementsModal && (
             <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setShowPaiementsModal(false)}>
               <div className="animate-scale-in w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                 {/* Header */}
                 <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
                   <h2 className="text-xl font-bold text-zinc-900">Tous les paiements</h2>
                   <button onClick={() => setShowPaiementsModal(false)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors">
                     <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                     </svg>
                   </button>
                 </div>

                 {/* Filtres */}
                 <div className="flex flex-wrap items-center gap-3 border-b border-zinc-100 bg-zinc-50 px-6 py-3">
                   <span className="text-sm font-medium text-zinc-600">Filtrer :</span>
                   <select
                     value={paiementFilterAnnee}
                     onChange={(e) => setPaiementFilterAnnee(e.target.value)}
                     className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20"
                   >
                     {anneesDisponibles.map((a) => (
                       <option key={a} value={a}>{a}</option>
                     ))}
                     {anneesDisponibles.length === 0 && <option value={new Date().getFullYear().toString()}>{new Date().getFullYear()}</option>}
                   </select>
                   <select
                     value={paiementFilterMois}
                     onChange={(e) => setPaiementFilterMois(Number(e.target.value))}
                     className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20"
                   >
                     <option value={0}>Tous les mois</option>
                     {moisNoms.map((m, i) => (
                       <option key={i} value={i + 1}>{m}</option>
                     ))}
                   </select>
                   <select
                     value={paiementFilterStatut}
                     onChange={(e) => setPaiementFilterStatut(e.target.value)}
                     className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20"
                   >
                     <option value="">Tous les statuts</option>
                     <option value="payé">Payé</option>
                     <option value="impayé">Impayé</option>
                   </select>
                   {(paiementFilterAnnee !== new Date().getFullYear().toString() || paiementFilterMois !== 0 || paiementFilterStatut !== "") && (
                     <button
                       onClick={() => { setPaiementFilterAnnee(new Date().getFullYear().toString()); setPaiementFilterMois(0); setPaiementFilterStatut(""); }}
                       className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
                     >
                       Réinitialiser
                     </button>
                   )}
                   <span className="ml-auto text-sm text-zinc-500">
                     {paiementsTries.length} résultat{paiementsTries.length !== 1 ? "s" : ""}
                   </span>
                 </div>

                 {/* Table */}
                 <div className="overflow-auto flex-1">
                   <table className="w-full text-sm">
                     <thead className="sticky top-0 bg-white border-b border-zinc-200">
                       <tr>
                         <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 text-left">Bureau</th>
                         <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 text-left">Période</th>
                         <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 text-right">Montant</th>
                         <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 text-center">Statut</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-100">
                       {paiementsTries.map((p) => (
                         <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                           <td className="px-4 py-3 font-medium text-zinc-900">{p.bureau?.nom || "—"}</td>
                           <td className="px-4 py-3 text-zinc-600">{moisNoms[p.mois - 1]} {p.annee}</td>
                           <td className="px-4 py-3 text-right font-medium text-zinc-900">{p.montant.toLocaleString()} DH</td>
                           <td className="px-4 py-3 text-center">
                             <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                               p.statut === "payé" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                             }`}>
                               {p.statut}
                             </span>
                           </td>
                         </tr>
                       ))}
                       {paiementsTries.length === 0 && (
                         <tr>
                           <td colSpan={4} className="px-4 py-12 text-center text-zinc-500">
                             <p className="font-medium">Aucun paiement trouvé</p>
                             <p className="mt-1 text-sm">Essayez de modifier vos filtres.</p>
                           </td>
                         </tr>
                       )}
                     </tbody>
                   </table>
                 </div>

                 {/* Footer */}
                 <div className="border-t border-zinc-200 bg-zinc-50 px-6 py-3 flex items-center justify-between">
                   <span className="text-sm text-zinc-500">
                     Total : {paiementsTries.reduce((s, p) => s + p.montant, 0).toLocaleString()} DH
                   </span>
                   <button onClick={() => setShowPaiementsModal(false)} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors">
                     Fermer
                   </button>
                 </div>
               </div>
             </div>
           )}

            {/* ===== MODALE DETAILS DE TOUS LES LOTS ===== */}
            {showLotsModal && (
              <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setShowLotsModal(false)}>
                <div className="animate-scale-in w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900">Mes Lots & Quote-parts</h2>
                      <p className="text-xs text-zinc-500">{bureaux.length} lot{bureaux.length > 1 ? "s" : ""} associé{bureaux.length > 1 ? "s" : ""} à votre compte</p>
                    </div>
                    <button onClick={() => setShowLotsModal(false)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Body */}
                  <div className="overflow-y-auto p-6 flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {bureaux.map((b) => (
                        <div key={b.id} className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 space-y-3 shadow-xs">
                          <div className="flex items-center justify-between gap-2 border-b border-zinc-200/60 pb-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 font-bold text-xs text-primary shadow-inner">
                                #{b.numeroBureau}
                              </div>
                              <span className="font-bold text-zinc-900 text-base">{b.nom}</span>
                            </div>
                            {b.titreFoncier && (
                              <span className="text-[11px] font-mono text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200 shadow-2xs">
                                TF: {b.titreFoncier}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1.5 text-xs text-zinc-600">
                            {b.etage != null && (
                              <div className="flex justify-between py-1 border-b border-zinc-100">
                                <span className="text-zinc-500">Étage</span>
                                <span className="font-semibold text-zinc-900">{b.etage}ᵉ étage</span>
                              </div>
                            )}
                            <div className="flex justify-between py-1 border-b border-zinc-100">
                              <span className="text-zinc-500">Quote-part privative</span>
                              <span className="font-semibold text-zinc-900">{b.quotePartPrivee} m²</span>
                            </div>
                            {b.quotePartCommunes != null && (
                              <div className="flex justify-between py-1 border-b border-zinc-100">
                                <span className="text-zinc-500">Quote-part communes</span>
                                <span className="font-semibold text-zinc-900">{b.quotePartCommunes} m²</span>
                              </div>
                            )}
                            <div className="flex justify-between pt-1 text-xs">
                              <span className="text-zinc-500 font-medium">Superficie totale</span>
                              <span className="text-primary font-bold text-sm">{(b.quotePartPrivee + (b.quotePartCommunes || 0)).toLocaleString()} m²</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-zinc-200 bg-zinc-50 px-6 py-3 text-right">
                    <button onClick={() => setShowLotsModal(false)} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors">
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            )}
         </div>
       </div>
     </div>
   );
 }
