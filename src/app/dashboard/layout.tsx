"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const sidebarTabs = [
  { id: "accueil", label: "Tableau de bord" },
  { id: "charges", label: "Budget prévisionnelles" },
  { id: "bureaux", label: "Bureaux" },
  { id: "coproprietaires", label: "Copropriétaires" },
  { id: "depenses", label: "Dépenses" },
  { id: "paiements", label: "Paiements" },

  { id: "votes", label: "Sondages" },
  { id: "communication", label: "Communication" },
  { id: "messages", label: "Messages" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ nom: string; prenom: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        if (data.user.role !== "syndic") router.push("/home");
        else setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const activeTab = pathname === "/dashboard" ? "accueil" : pathname.split("/").pop() || "accueil";

  const handleTabChange = (tab: string) => {
    router.push(tab === "accueil" ? "/dashboard" : `/dashboard/${tab}`);
  };

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
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

  return (
    <div className="min-h-screen bg-white">

      <Sidebar
        tabs={sidebarTabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
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
        <div className="mx-auto max-w-7xl px-3 py-4 animate-fade-in md:px-4 md:py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
