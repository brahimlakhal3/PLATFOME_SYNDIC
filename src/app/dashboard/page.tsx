"use client";

import { useEffect, useState, useCallback } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type MoisStat = {
  mois: number; label: string;
  attendu: number; collecte: number; reste: number;
  depenses: number;
  total: number; payes: number; impayes: number;
};

type CoproStat = {
  id: string; nom: string; prenom: string;
  totalAttendu: number; totalPaye: number;
  bureaux: { nom: string; montant: number; montantReel: number | null; statut: string }[];
};

type DashboardData = {
  totalAttendu: number;
  totalPaye: number;
  totalImpaye: number;
  totalDepenses: number;
  profit: number;
  tauxRecouvrement: number;
  nbBureaux: number;
  nbCopro: number;
  moisStats: MoisStat[];
  annees: number[];
};

export default function DashboardPage() {
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMois, setSelectedMois] = useState<MoisStat | null>(null);
  const [copros, setCopros] = useState<CoproStat[]>([]);
  const [depensesList, setDepensesList] = useState<{ libelle: string; montant: number; imageUrl?: string | null; createdAt?: string }[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showAllMonths, setShowAllMonths] = useState(false);

  function fetchData(a: number) {
    setLoading(true);
    fetch(`/api/dashboard?annee=${a}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { fetchData(annee); }, [annee]);

  const downloadPDF = useCallback(() => {
    if (!data) return;
    const doc = new jsPDF("p", "mm", "a4");
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentW = pageW - margin * 2;

    // Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageW, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("Rapport Annuel " + annee, margin, 18);
    doc.setFontSize(10);
    doc.text("CadSyndic - Tableau de bord", margin, 28);
    doc.text("Généré le " + new Date().toLocaleDateString("fr-FR"), margin, 34);

    // Summary
    let y = 50;
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(14);
    doc.text("Résumé financier", margin, y);
    y += 8;

    const summaryData = [
      ["Budget attendu", data.totalAttendu.toLocaleString() + " DH"],
      ["Total encaissé", data.totalPaye.toLocaleString() + " DH"],
      ["Reste à encaisser", data.totalImpaye.toLocaleString() + " DH"],
      ["Total dépenses", data.totalDepenses.toLocaleString() + " DH"],
      ["Résultat net", (data.profit >= 0 ? "+" : "") + data.profit.toLocaleString() + " DH"],
      ["Taux de recouvrement", data.tauxRecouvrement.toFixed(1) + "%"],
    ];

    autoTable(doc, {
      startY: y,
      head: [["Indicateur", "Valeur"]],
      body: summaryData,
      theme: "striped",
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      columnStyles: { 0: { cellWidth: contentW * 0.6 }, 1: { cellWidth: contentW * 0.4, halign: "right" } },
      margin: { left: margin, right: margin },
    });

    // General info
    y = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text("Informations générales", margin, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      head: [["Indicateur", "Valeur"]],
      body: [
        ["Nombre de bureaux", String(data.nbBureaux)],
        ["Nombre de copropriétaires", String(data.nbCopro)],
        ["Paiements effectués", String(data.moisStats.reduce((s, m) => s + m.payes, 0))],
        ["Paiements en retard", String(data.moisStats.reduce((s, m) => s + m.impayes, 0))],
      ],
      theme: "striped",
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      margin: { left: margin, right: margin },
    });

    // Monthly breakdown
    y = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text("Détail mensuel", margin, y);
    y += 8;

    const moisData = data.moisStats.map((m) => [
      m.label,
      m.attendu.toLocaleString() + " DH",
      m.collecte.toLocaleString() + " DH",
      m.depenses.toLocaleString() + " DH",
      m.reste.toLocaleString() + " DH",
      String(m.payes),
      String(m.impayes),
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Mois", "Attendu", "Collecté", "Dépenses", "Reste", "Payés", "Impayés"]],
      body: moisData,
      theme: "striped",
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      margin: { left: margin, right: margin },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("CadSyndic - Rapport " + annee + " | Page " + i + "/" + pageCount, margin, doc.internal.pageSize.getHeight() - 10);
    }

    doc.save("rapport-annuel-" + annee + ".pdf");
  }, [data, annee]);

  async function openMoisDetail(m: MoisStat) {
    setSelectedMois(m);
    setDetailLoading(true);
    const res = await fetch(`/api/dashboard?mois=${m.mois}&annee=${annee}`);
    const d = await res.json();
    setCopros(d.coproprietaires ?? []);
    setDepensesList(d.depensesList ?? []);
    setDetailLoading(false);
  }

  return (
    <div>
      <div className="mb-6 mt-2 rounded-lg bg-zinc-400/10 md:mt-4">
        <h2 className="p-4 text-2xl font-bold md:text-3xl">Tableau de bord</h2>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-zinc-500">Année :</label>
          <select
            value={annee}
            onChange={(e) => { setAnnee(Number(e.target.value)); setSelectedMois(null); }}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-primary"
          >
            {data?.annees?.length
              ? data.annees.map((a) => <option key={a} value={a}>{a}</option>)
              : <option value={annee}>{annee}</option>}
          </select>
        </div>
        <button
          onClick={downloadPDF}
          disabled={!data}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover active:scale-95 disabled:opacity-50 shadow-sm flex items-center justify-center gap-2 sm:ml-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Télécharger le rapport PDF
        </button>
      </div>

      {loading || !data ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-primary" />
        </div>
      ) : (
        <>
          {/* Infos générales */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Bureaux</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">{data.nbBureaux}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Copropriétaires</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">{data.nbCopro}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Paiements effectués</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">{data.moisStats.reduce((s, m) => s + m.payes, 0)}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Paiements en retard</p>
              <p className="mt-1 text-2xl font-bold text-red-600">{data.moisStats.reduce((s, m) => s + m.impayes, 0)}</p>
            </div>
          </div>

          {/* Row 1: 3 main financial cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Budget attendu</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">{data.totalAttendu.toLocaleString()} DH</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total encaissé</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">{data.totalPaye.toLocaleString()} DH</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Reste à encaisser</p>
              <p className="mt-1 text-2xl font-bold text-red-600">{data.totalImpaye.toLocaleString()} DH</p>
            </div>
          </div>

          {/* Row 2: profit, recouvrement, dépenses */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Résultat net</p>
              <p className={`mt-1 text-2xl font-bold ${data.profit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {data.profit >= 0 ? "+" : ""}{data.profit.toLocaleString()} DH
              </p>
              <p className="mt-0.5 text-xs text-zinc-400">Encaissé - Dépenses</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Taux de recouvrement</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{data.tauxRecouvrement.toFixed(1)}%</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
                <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min(data.tauxRecouvrement, 100)}%` }} />
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total dépenses</p>
              <p className="mt-1 text-2xl font-bold text-red-600">{data.totalDepenses.toLocaleString()} DH</p>
              <p className="mt-0.5 text-xs text-zinc-400">
                {data.moisStats.reduce((s, m) => s + m.attendu, 0) > 0
                  ? `Soit ${((data.totalDepenses / data.totalAttendu) * 100).toFixed(1)}% du budget`
                  : ""}
              </p>
            </div>
          </div>

          {/* Graphique */}
          <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-zinc-800">Évolution mensuelle</h3>
            <div className="w-full" style={{ height: 260 }}>
              {(() => {
                const maxVal = Math.max(...data.moisStats.map((x) => x.attendu), 1);
                const pad = { top: 20, right: 20, bottom: 30, left: 60 };
                const w = 800; const h = 260;
                const graphW = w - pad.left - pad.right;
                const graphH = h - pad.top - pad.bottom;
                const stepX = graphW / (data.moisStats.length - 1 || 1);
                const yTicks = 5; const yStep = maxVal / yTicks;

                const pointsCollecte = data.moisStats.map((m, i) => ({
                  x: pad.left + i * stepX, y: pad.top + graphH - (m.collecte / maxVal) * graphH, val: m.collecte,
                }));
                const pointsReste = data.moisStats.map((m, i) => ({
                  x: pad.left + i * stepX, y: pad.top + graphH - (m.reste / maxVal) * graphH, val: m.reste,
                }));

                const linePathCollecte = pointsCollecte.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
                const linePathReste = pointsReste.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
                const areaPathCollecte = `M${pointsCollecte[0]?.x ?? 0},${pad.top + graphH} ${pointsCollecte.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")} L${pointsCollecte[pointsCollecte.length - 1]?.x ?? 0},${pad.top + graphH} Z`;
                const areaPathReste = `M${pointsReste[0]?.x ?? 0},${pad.top + graphH} ${pointsReste.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")} L${pointsReste[pointsReste.length - 1]?.x ?? 0},${pad.top + graphH} Z`;
                const formatDH = (n: number) => n.toLocaleString() + " DH";

                return (
                  <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                    {Array.from({ length: yTicks + 1 }, (_, i) => {
                      const y = pad.top + graphH - (i * graphH) / yTicks;
                      const val = Math.round(i * yStep);
                      return (
                        <g key={i}>
                          <line x1={pad.left} y1={y} x2={w - pad.right} y2={y} stroke="#e4e4e7" strokeWidth={1} />
                          <text x={pad.left - 8} y={y + 4} textAnchor="end" className="fill-zinc-400" fontSize={11}>{val.toLocaleString()}</text>
                        </g>
                      );
                    })}
                    {data.moisStats.map((m, i) => (
                      <text key={m.mois} x={pad.left + i * stepX} y={h - pad.bottom + 16} textAnchor="middle" className="fill-zinc-400" fontSize={11}>{m.label.slice(0, 3)}</text>
                    ))}
                    <path d={areaPathCollecte} fill="rgba(52,211,153,0.12)" />
                    <path d={areaPathReste} fill="rgba(248,113,113,0.10)" />
                    <path d={linePathCollecte} fill="none" stroke="#34d399" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    <path d={linePathReste} fill="none" stroke="#f87171" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    {pointsCollecte.map((p, i) => (
                      <g key={i}><circle cx={p.x} cy={p.y} r={4} fill="#fff" stroke="#34d399" strokeWidth={2.5} /><title>{formatDH(p.val)}</title></g>
                    ))}
                    {pointsReste.map((p, i) => (
                      <g key={i}><circle cx={p.x} cy={p.y} r={4} fill="#fff" stroke="#f87171" strokeWidth={2.5} /><title>{formatDH(p.val)}</title></g>
                    ))}
                  </svg>
                );
              })()}
            </div>
            <div className="mt-3 flex items-center justify-center gap-6 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 bg-emerald-400" /> Payé</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 bg-red-400" /> Impayé</span>
            </div>
          </div>

          {/* Monthly grid - Simple & Compact (All 12 months) */}
          <h3 className="mb-4 text-lg font-semibold text-zinc-800">Par mois</h3>
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {data.moisStats.map((m) => (
              <button
                key={m.mois}
                onClick={() => openMoisDetail(m)}
                className={`flex flex-col items-center justify-between rounded-xl border p-3.5 text-center shadow-xs transition-all duration-200 hover:shadow-md hover:border-primary/40 active:scale-95 ${
                  selectedMois?.mois === m.mois ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-zinc-200 bg-white"
                }`}
              >
                <p className="text-sm font-bold text-zinc-800">{m.label}</p>
                <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700">
                    {m.payes} payé{m.payes > 1 ? "s" : ""}
                  </span>
                  <span className="rounded-full bg-red-100 px-2 py-0.5 font-semibold text-red-700">
                    {m.impayes} impayé{m.impayes > 1 ? "s" : ""}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Month detail */}
          {selectedMois && (
            <div className="animate-fade-in-up rounded-xl border border-zinc-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
                <h3 className="text-lg font-semibold">Détail — {selectedMois.label} {annee}</h3>
                <button onClick={() => setSelectedMois(null)} className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200">Fermer</button>
              </div>
              {detailLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-primary" />
                </div>
              ) : (
                <div className="p-6">
                  <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-lg bg-zinc-50 p-3 text-center">
                      <p className="text-xs text-zinc-500">Attendu</p>
                      <p className="text-lg font-bold text-zinc-800">{selectedMois.attendu.toLocaleString()} DH</p>
                    </div>
                    <div className="rounded-lg bg-emerald-50 p-3 text-center">
                      <p className="text-xs text-emerald-600">Collecté</p>
                      <p className="text-lg font-bold text-emerald-700">{selectedMois.collecte.toLocaleString()} DH</p>
                    </div>
                    <div className="rounded-lg bg-red-50 p-3 text-center">
                      <p className="text-xs text-red-600">Dépenses</p>
                      <p className="text-lg font-bold text-red-700">{selectedMois.depenses.toLocaleString()} DH</p>
                    </div>
                    <div className="rounded-lg bg-orange-50 p-3 text-center">
                      <p className="text-xs text-orange-600">Reste</p>
                      <p className="text-lg font-bold text-orange-700">{selectedMois.reste.toLocaleString()} DH</p>
                    </div>
                  </div>

                  {/* Depenses list for this month */}
                  {depensesList.length > 0 && (
                    <div className="mb-4">
                      <p className="mb-3 text-sm font-semibold text-red-700">Dépenses du mois</p>
                      <div className="space-y-2">
                        {depensesList.map((d, i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg border border-red-100 bg-white px-4 py-3 shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">DH</div>
                              <div>
                                <p className="text-sm font-medium text-zinc-800">{d.libelle}</p>
                                <p className="text-xs text-zinc-400">
                                  {d.createdAt ? new Date(d.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-red-600">{d.montant.toLocaleString()} DH</span>
                              {d.imageUrl && (
                                <a href={d.imageUrl} target="_blank" rel="noopener noreferrer" className="rounded bg-red-50 px-2 py-1 text-[10px] font-medium text-red-600 hover:bg-red-100">
                                  Reçu
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {copros.length === 0 ? (
                    <p className="py-8 text-center text-sm text-zinc-400">Aucun copropriétaire pour ce mois.</p>
                  ) : (
                    <div className="space-y-2">
                      {copros.map((c) => {
                        const totalRestant = c.totalAttendu - c.totalPaye;
                        const estPaye = totalRestant <= 0;
                        return (
                          <div key={c.id} className="rounded-lg border border-zinc-200 p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-zinc-800">{c.prenom} {c.nom}</span>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${estPaye ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                                  {estPaye ? "Payé" : "Impayé"}
                                </span>
                              </div>
                              <div className="text-right text-sm">
                                <span className="text-zinc-500">{c.totalPaye.toLocaleString()} / </span>
                                <span className="font-medium">{c.totalAttendu.toLocaleString()} DH</span>
                              </div>
                            </div>
                            {c.bureaux.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {c.bureaux.map((b, i) => (
                                  <span key={i} className={`rounded px-2 py-0.5 text-xs ${b.statut === "payé" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                                    {b.nom}: {(b.montantReel ?? b.montant).toLocaleString()} DH
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
