"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          router.push(
            data.user.role === "coproprietaire" ? "/home" : "/dashboard"
          );
        } else {
          router.push("/syndicVitrine");
        }
      })
      .catch(() => router.push("/syndicVitrine"));
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-primary" />
        <p className="text-sm text-zinc-500">Chargement...</p>
      </div>
    </div>
  );
}
