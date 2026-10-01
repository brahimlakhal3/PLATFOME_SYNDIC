import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

const moisNoms = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export async function GET(req: Request) {
  const user = await authenticate();
  if (!user || user.role !== "syndic") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const mois = searchParams.get("mois");
    const annee = parseInt(searchParams.get("annee") || String(new Date().getFullYear()));

    const allPaiements = await prisma.paiement.findMany({
      where: {
        annee,
        bureau: { syndicId: user.id },
      },
      include: {
        bureau: {
          select: {
            nom: true,
            user: { select: { id: true, nom: true, prenom: true } },
          },
        },
      },
    });

    const totalAttendu = allPaiements.reduce((s, p) => s + p.montant, 0);
    const totalCollecte = allPaiements
      .filter((p) => p.statut === "payé")
      .reduce((s, p) => s + (p.montantReel ?? p.montant), 0);
    const totalImpaye = totalAttendu - totalCollecte;

    if (mois) {
      const m = parseInt(mois);
      const paiementsMois = allPaiements.filter((p) => p.mois === m);
      const collecteMois = paiementsMois
        .filter((p) => p.statut === "payé")
        .reduce((s, p) => s + (p.montantReel ?? p.montant), 0);

      interface CoproStat {
        id: string;
        nom: string;
        prenom: string;
        bureaux: { nom: string; montant: number; montantReel: number | null; statut: string }[];
        totalAttendu: number;
        totalPaye: number;
      }

      const coproMap = new Map<string, CoproStat>();
      for (const p of paiementsMois) {
        const u = p.bureau.user;
        if (!u) continue;
        if (!coproMap.has(u.id)) {
          coproMap.set(u.id, { id: u.id, nom: u.nom, prenom: u.prenom, bureaux: [], totalAttendu: 0, totalPaye: 0 });
        }
        const entry = coproMap.get(u.id)!;
        entry.bureaux.push({ nom: p.bureau.nom, montant: p.montant, montantReel: p.montantReel, statut: p.statut });
        entry.totalAttendu += p.montant;
        if (p.statut === "payé") entry.totalPaye += p.montantReel ?? p.montant;
      }

      return NextResponse.json({
        mois: m,
        annee,
        totalAttendu: Math.round(totalAttendu * 100) / 100,
        totalCollecte: Math.round(totalCollecte * 100) / 100,
        totalImpaye: Math.round(totalImpaye * 100) / 100,
        moisAttendu: Math.round(paiementsMois.reduce((s, p) => s + p.montant, 0) * 100) / 100,
        moisCollecte: Math.round(collecteMois * 100) / 100,
        coproprietaires: Array.from(coproMap.values()),
      });
    }

    const moisStats = Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      const paiementsMois = allPaiements.filter((p) => p.mois === m);
      const attendu = paiementsMois.reduce((s, p) => s + p.montant, 0);
      const collecte = paiementsMois
        .filter((p) => p.statut === "payé")
        .reduce((s, p) => s + (p.montantReel ?? p.montant), 0);
      return {
        mois: m,
        label: moisNoms[i],
        attendu: Math.round(attendu * 100) / 100,
        collecte: Math.round(collecte * 100) / 100,
        reste: Math.round((attendu - collecte) * 100) / 100,
        total: paiementsMois.length,
        payes: paiementsMois.filter((p) => p.statut === "payé").length,
        impayes: paiementsMois.filter((p) => p.statut === "impayé").length,
      };
    });

    return NextResponse.json({
      annee,
      totalAttendu: Math.round(totalAttendu * 100) / 100,
      totalCollecte: Math.round(totalCollecte * 100) / 100,
      totalImpaye: Math.round(totalImpaye * 100) / 100,
      moisStats,
    });
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
