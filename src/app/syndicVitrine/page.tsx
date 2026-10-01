"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CadLogo from "@/components/CadLogo .png";

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    title: "Budget Prévisionnel",
    desc: "Définissez les charges annuelles et mensuelles (fixes ou variables) avec suivi des devis et justificatifs.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    title: "Gestion des Bureaux",
    desc: "Gérez les lots avec numérotation, étage, titre foncier et quote-parts (privatives et communes).",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
    title: "Copropriétaires",
    desc: "Créez et gérez les copropriétaires, assignez-leur des lots, générez des mots de passe sécurisés.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    title: "Dépenses Exceptionnelles",
    desc: "Enregistrez des dépenses avec répartition automatique sur les quote-parts de chaque lot.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
    title: "Paiements Automatisés",
    desc: "Générez les paiements annuels par lot, suivez les impayés/payés avec montants réels.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
    title: "Messagerie Intégrée",
    desc: "Communication directe entre le syndic et les copropriétaires avec notification de messages non lus.",
  },
];

const steps = [
  { num: "01", title: "Inscrivez-vous", desc: "Créez votre compte syndic en quelques clics." },
  { num: "02", title: "Configurez votre copropriété", desc: "Ajoutez les bureaux/lots et les copropriétaires." },
  { num: "03", title: "Définissez les charges", desc: "Paramétrez le budget prévisionnel annuel." },
  { num: "04", title: "Générez les paiements", desc: "Lancez la génération automatique des paiements." },
  { num: "05", title: "Suivez et communiquez", desc: "Suivez les règlements et échangez avec les copropriétaires." },
];

export default function SyndicVitrine() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ prenom: string; nom: string; role: string } | null>(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">

          <div className="flex items-center justify-center border-b border-zinc-50 ">
            <div className=" w-10 h-10 md:h-15 md:w-15">
              <Image src={CadLogo} alt="log cad" />
            </div>
            <span className="text-lg font-bold text-zinc-800">CadSyndic</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-zinc-600 transition-colors hover:text-primary">
              Fonctionnalités
            </a>
            <a href="#conformite" className="text-sm text-zinc-600 transition-colors hover:text-primary">
              Conformité légale
            </a>
            <a href="#how-it-works" className="text-sm text-zinc-600 transition-colors hover:text-primary">
              Comment ça marche
            </a>
            {checking ? null : user ? (
              <button
                onClick={() => router.push(user.role === "coproprietaire" ? "/home" : "/dashboard")}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover active:scale-[0.98]"
              >
                Tableau de bord
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <a
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-100"
                >
                  Se connecter
                </a>
                <a
                  href="/signup"
                  className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover active:scale-[0.98]"
                >
                  S&apos;inscrire
                </a>
              </div>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 md:hidden"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-zinc-100 bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50"
              >
                Fonctionnalités
              </a>
              <a
                href="#conformite"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50"
              >
                Conformité légale
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50"
              >
                Comment ça marche
              </a>
              {checking ? null : user ? (
                <button
                  onClick={() => router.push(user.role === "coproprietaire" ? "/home" : "/dashboard")}
                  className="w-full rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white"
                >
                  Tableau de bord
                </button>
              ) : (
                <>
                  <a
                    href="/login"
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-center text-sm font-medium text-zinc-700"
                  >
                    Se connecter
                  </a>
                  <a
                    href="/signup"
                    className="w-full rounded-lg bg-primary px-5 py-2 text-center text-sm font-medium text-white"
                  >
                    S&apos;inscrire
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">

          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 md:text-6xl lg:text-7xl">
            Gérez votre{" "}
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              copropriété
            </span>{" "}
            en toute simplicité
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500 md:text-xl">
            CadSyndic vous offre une plateforme complète pour gérer vos lots, copropriétaires, charges,
            paiements et communications — le tout dans un espace centralisé et sécurisé.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {checking ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-primary" />
            ) : user ? (
              <button
                onClick={() =>
                  router.push(user.role === "coproprietaire" ? "/home" : "/dashboard")
                }
                className="rounded-xl bg-primary px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
              >
                Accéder à mon espace
              </button>
            ) : (
              <>
                <a
                  href="/signup"
                  className="rounded-xl bg-primary px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
                >
                  Commencer gratuitement
                </a>
                <a
                  href="/login"
                  className="rounded-xl border border-zinc-300 px-8 py-3.5 text-base font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-50 active:scale-[0.98]"
                >
                  Se connecter
                </a>
              </>
            )}
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-zinc-400">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Sécurisé
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Multi-utilisateurs
            </span>
          </div>
        </div>
        <div className="mountains" />
      </section>

      {/* Features */}
      <section id="features" className="relative px-4 py-24 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-zinc-900 md:text-4xl">
              Tout ce dont vous avez besoin
            </h2>
            <p className="mt-4 text-zinc-500">
              Une plateforme complète pour la gestion de votre copropriété, de la configuration des lots
              au suivi des paiements.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conformité légale */}
      <section id="conformite" className="bg-zinc-50 px-4 py-24 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
         
            <h2 className="text-3xl font-bold text-zinc-900 md:text-4xl">
              Conforme à la{" "}
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                loi 18-00
              </span>
            </h2>
            <p className="mt-4 text-zinc-500">
              CadSyndic a été conçue en parfaite adéquation avec la{" "}
              <strong>loi 18-00 relative à la copropriété des immeubles bâtis</strong> au Maroc
              (Dahir n&deg; 1-02-296 du 25 rejeb 1423). Notre plateforme vous assure une gestion
              conforme aux exigences légales et réglementaires en vigueur.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Quote-parts et tantièmes",
                desc: "Calcul automatique des charges basé sur les quote-parts privatives et communes de chaque lot, conformément aux articles 5 et 6 de la loi 18-00.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                  </svg>
                ),
              },
              {
                title: "Répartition des charges",
                desc: "Distribution des charges communes et dépenses exceptionnelles proportionnellement aux quote-parts de chaque copropriétaire (art. 67 et suivants).",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                ),
              },
              {
                title: "Registre des copropriétaires",
                desc: "Registre électronique complet avec historique des mutations et affectations des lots, répondant aux exigences de l'article 12 de la loi 18-00.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                ),
              },
              {
                title: "Traçabilité des décisions",
                desc: "Historique complet des charges votées, dépenses approuvées et communications avec les copropriétaires pour une transparence totale.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                  </svg>
                ),
              },
              {
                title: "Gestion des impayés",
                desc: "Suivi des paiements impayés avec alertes et historique, facilitant les procédures de recouvrement conformément aux délais légaux.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                ),
              },
              {
                title: "Communication légale",
                desc: "Messagerie intégrée avec accusés de lecture pour les notifications officielles entre le syndic et les copropriétaires (art. 14 et 44).",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  {item.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-primary/10 bg-primary/5 p-6 text-center">
            <p className="text-sm text-zinc-600">
              <strong className="text-primary">Garantie de conformité :</strong> CadSyndic est
              régulièrement mise à jour pour refléter les évolutions de la réglementation marocaine
              en matière de copropriété. Notre équipe juridique veille à ce que chaque fonctionnalité
              soit en adéquation avec les textes en vigueur.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-zinc-50 px-4 py-24 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-zinc-900 md:text-4xl">Comment ça marche</h2>
            <p className="mt-4 text-zinc-500">
              Mettez en place votre copropriété en quelques étapes simples.
            </p>
          </div>
          <div className="relative mt-16">
            <div className="absolute top-0 left-6 hidden h-full w-0.5 bg-primary/10 md:left-1/2 md:-translate-x-0.5 lg:block" />
            <div className="flex flex-col gap-12">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`relative flex flex-col gap-4 md:flex-row md:items-center ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1" />
                  <div className="flex shrink-0 items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-lg shadow-primary/20">
                      {step.num}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-zinc-900">{step.title}</h3>
                    <p className="mt-1 text-sm text-zinc-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 md:px-6 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-zinc-900 md:text-4xl">
            Prêt à simplifier votre gestion ?
          </h2>
          <p className="mt-4 text-zinc-500">
            Rejoignez CadSyndic et centralisez toute la gestion de votre copropriété.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {user ? (
              <button
                onClick={() =>
                  router.push(user.role === "coproprietaire" ? "/home" : "/dashboard")
                }
                className="rounded-xl bg-primary px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary-hover active:scale-[0.98]"
              >
                Accéder à mon espace
              </button>
            ) : (
              <>
                <a
                  href="/signup"
                  className="rounded-xl bg-primary px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary-hover active:scale-[0.98]"
                >
                  Créer un compte
                </a>
                <a
                  href="/login"
                  className="rounded-xl border border-zinc-300 px-8 py-3.5 text-base font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-50 active:scale-[0.98]"
                >
                  Se connecter
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 bg-zinc-50 px-4 pt-16 pb-8 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center justify-center border-b border-zinc-50 ">
                <div className=" w-15 h-15 md:h-20 md:w-20">
                  <Image src={CadLogo} alt="log cad" />
                </div>
                <span className="text-lg font-bold text-zinc-800">CadSyndic</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                La plateforme complète pour la gestion de copropriété au Maroc, conforme à la loi 18-00.
              </p>
            </div>

            {/* Produit */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900">Produit</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm text-zinc-500 transition-colors hover:text-primary">Fonctionnalités</a></li>
                <li><a href="#conformite" className="text-sm text-zinc-500 transition-colors hover:text-primary">Conformité légale</a></li>
                <li><a href="#how-it-works" className="text-sm text-zinc-500 transition-colors hover:text-primary">Comment ça marche</a></li>
                <li><a href="/signup" className="text-sm text-zinc-500 transition-colors hover:text-primary">S&apos;inscrire</a></li>
              </ul>
            </div>

            {/* Légal */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900">Légal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-zinc-500 transition-colors hover:text-primary">Conditions d&apos;utilisation</a></li>
                <li><a href="#" className="text-sm text-zinc-500 transition-colors hover:text-primary">Politique de confidentialité</a></li>
                <li><a href="#" className="text-sm text-zinc-500 transition-colors hover:text-primary">Mentions légales</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-zinc-500">
                  <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  contact@cadsyndic.ma
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-500">
                  <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  Fes, Maroc
                </li>
              </ul>
              {/* Social */}
              <div className="mt-6 flex gap-3">
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-zinc-500 transition-colors hover:bg-primary hover:text-white" aria-label="Facebook">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                </a>
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-zinc-500 transition-colors hover:bg-primary hover:text-white" aria-label="LinkedIn">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-zinc-500 transition-colors hover:bg-primary hover:text-white" aria-label="Twitter">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-zinc-200 pt-8 text-center">
            <p className="text-xs text-zinc-400">
              &copy; {new Date().getFullYear()} CadSyndic. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
