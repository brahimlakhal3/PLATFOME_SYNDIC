"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CadLogo from "@/components/CadLogo .png";

export default function SignupPage() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [password, setPassword] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          router.push(data.user.role === "coproprietaire" ? "/home" : "/dashboard");
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-primary" />
          <p className="text-sm text-zinc-500">Chargement...</p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, prenom, password, adresse, telephone }),
    });

    const data = await res.json();
    if (!res.ok) {
      setSubmitting(false);
      return setError(data.error);
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Side: Form Panel */}
      <div className="flex w-full flex-col justify-between bg-white p-6 sm:p-12 lg:w-1/2 xl:p-16 lg:border-r lg:border-zinc-200">
        <div>
          <Link href="/syndicVitrine" className="inline-flex items-center gap-2.5">
            <Image src={CadLogo} alt="CadSyndic Logo" width={40} height={40} className="h-10 w-auto" />
            <span className="text-xl font-bold text-zinc-900">CadSyndic</span>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">Créer un compte syndic</h1>
            <p className="mt-2 text-sm text-zinc-500">
              Rejoignez CadSyndic pour gérer efficacement vos immeubles et copropriétés.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Nom
                </label>
                <input
                  type="text"
                  placeholder="El Amrani"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Prénom
                </label>
                <input
                  type="text"
                  placeholder="Youssef"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                placeholder="06 XX XX XX XX"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Adresse
              </label>
              <input
                type="text"
                placeholder="Ex: Boulevard Mohamed V, Casablanca"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Inscription en cours...
                </>
              ) : (
                "S'inscrire"
              )}
            </button>

            <p className="mt-3 text-center text-sm text-zinc-500">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="font-semibold text-primary hover:text-primary-hover underline">
                Se connecter
              </Link>
            </p>
          </form>
        </div>

        <div className="text-xs text-zinc-400">
          © {new Date().getFullYear()} CadSyndic. Tous droits réservés.
        </div>
      </div>

      {/* Right Side: Pure White Graphic & Branding Panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-white p-12 lg:flex xl:p-16">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1.5 text-xs font-semibold text-zinc-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Espace Professionnel Syndic
          </span>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Une gestion moderne et sereine pour vos copropriétés.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Rejoignez des centaines de syndics qui simplifient la comptabilité, le suivi des cotisations et la communication avec leurs copropriétaires.
          </p>

          {/* Feature Highlight Cards */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-zinc-900">Multi-Immeubles</h3>
              <p className="mt-1 text-xs text-zinc-500">Gérez plusieurs résidences depuis un seul tableau de bord.</p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-zinc-900">Installation Rapide</h3>
              <p className="mt-1 text-xs text-zinc-500">Prise en main en quelques minutes seulement.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-zinc-400">
          <span>CadSyndic v2.0</span>
          <span>Données Chiffrées & Sécurisées</span>
        </div>
      </div>
    </div>
  );
}
