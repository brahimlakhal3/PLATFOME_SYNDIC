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
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

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

  const allDepenses = await prisma.depense.findMany({
    where: { annee, syndicId: user.id },
    select: { libelle: true, montant: true, moisDepart: true, imageUrl: true, createdAt: true },
  });

  const totalAttendu = allPaiements.reduce((s, p) => s + p.montant, 0);
  const totalPaye = allPaiements
    .filter((p) => p.statut === "payé")
    .reduce((s, p) => s + (p.montantReel ?? p.montant), 0);
  const totalImpaye = totalAttendu - totalPaye;
  const totalDepenses = allDepenses.reduce((s, d) => s + d.montant, 0);
  const profit = totalPaye - totalDepenses;
  const tauxRecouvrement = totalAttendu > 0 ? (totalPaye / totalAttendu) * 100 : 0;

  const nbBureaux = await prisma.bureau.count({ where: { syndicId: user.id } });
  const nbCopro = await prisma.user.count({ where: { role: "coproprietaire", syndicId: user.id } });

  const annees = await prisma.paiement.findMany({
    where: { bureau: { syndicId: user.id } },
    select: { annee: true },
    distinct: ["annee"],
    orderBy: { annee: "desc" },
  });

  if (mois) {
    const m = parseInt(mois);
    const paiementsMois = allPaiements.filter((p) => p.mois === m);
    const collecteMois = paiementsMois
      .filter((p) => p.statut === "payé")
      .reduce((s, p) => s + (p.montantReel ?? p.montant), 0);

    const depensesMois = allDepenses.filter((d) => d.moisDepart === m);
    const totalDepensesMois = depensesMois.reduce((s, d) => s + d.montant, 0);

    const coproMap = new Map<string, {
      id: string; nom: string; prenom: string;
      bureaux: { nom: string; montant: number; montantReel: number | null; statut: string }[];
      totalAttendu: number; totalPaye: number;
    }>();

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
      annee, mois: m,
      totalAttendu: Math.round(totalAttendu * 100) / 100,
      totalPaye: Math.round(totalPaye * 100) / 100,
      totalImpaye: Math.round(totalImpaye * 100) / 100,
      totalDepenses: Math.round(totalDepenses * 100) / 100,
      profit: Math.round(profit * 100) / 100,
      tauxRecouvrement: Math.round(tauxRecouvrement * 10) / 10,
      moisAttendu: Math.round(paiementsMois.reduce((s, p) => s + p.montant, 0) * 100) / 100,
      moisCollecte: Math.round(collecteMois * 100) / 100,
      moisDepenses: Math.round(totalDepensesMois * 100) / 100,
      depensesList: depensesMois.map((d) => ({ libelle: d.libelle, montant: d.montant, imageUrl: d.imageUrl, createdAt: d.createdAt })),
      coproprietaires: Array.from(coproMap.values()),
      annees: annees.map((a) => a.annee),
    });
  }

  const moisStats = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const paiementsMois = allPaiements.filter((p) => p.mois === m);
    const attendu = paiementsMois.reduce((s, p) => s + p.montant, 0);
    const collecte = paiementsMois
      .filter((p) => p.statut === "payé")
      .reduce((s, p) => s + (p.montantReel ?? p.montant), 0);
    const depensesMois = allDepenses.filter((d) => d.moisDepart === m);
    const totalDepensesMois = depensesMois.reduce((s, d) => s + d.montant, 0);
    return {
      mois: m,
      label: moisNoms[i],
      attendu: Math.round(attendu * 100) / 100,
      collecte: Math.round(collecte * 100) / 100,
      reste: Math.round((attendu - collecte) * 100) / 100,
      depenses: Math.round(totalDepensesMois * 100) / 100,
      total: paiementsMois.length,
      payes: paiementsMois.filter((p) => p.statut === "payé").length,
      impayes: paiementsMois.filter((p) => p.statut === "impayé").length,
    };
  });

  return NextResponse.json({
    annee,
    totalAttendu: Math.round(totalAttendu * 100) / 100,
    totalPaye: Math.round(totalPaye * 100) / 100,
    totalImpaye: Math.round(totalImpaye * 100) / 100,
    totalDepenses: Math.round(totalDepenses * 100) / 100,
    profit: Math.round(profit * 100) / 100,
    tauxRecouvrement: Math.round(tauxRecouvrement * 10) / 10,
    nbBureaux,
    nbCopro,
    moisStats,
    annees: annees.map((a) => a.annee),
  });
}
