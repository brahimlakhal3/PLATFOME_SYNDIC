"use client";

import { useEffect, useState } from "react";

type MoisStat = {
  mois: number; label: string;
  attendu: number; collecte: number; reste: number;
  total: number; payes: number; impayes: number;
};

type CoproStat = {
  id: string; nom: string; prenom: string;
  totalAttendu: number; totalPaye: number;
  bureaux: { nom: string; montant: number; montantReel: number | null; statut: string }[];
};

export default function StatistiquesPage() {
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [totalAttendu, setTotalAttendu] = useState(0);
  const [totalCollecte, setTotalCollecte] = useState(0);
  const [totalImpaye, setTotalImpaye] = useState(0);
  const [moisStats, setMoisStats] = useState<MoisStat[]>([]);
  const [selectedMois, setSelectedMois] = useState<MoisStat | null>(null);
  const [copros, setCopros] = useState<CoproStat[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  function fetchStats(a: number) {
    setLoading(true);
    fetch(`/api/statistiques?annee=${a}`)
      .then((r) => r.json())
      .then((d) => {
        setTotalAttendu(d.totalAttendu);
        setTotalCollecte(d.totalCollecte);
        setTotalImpaye(d.totalImpaye);
        setMoisStats(d.moisStats ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    fetchStats(annee);
  }, [annee]);

  async function openMoisDetail(m: MoisStat) {
    setSelectedMois(m);
    setDetailLoading(true);
    const res = await fetch(`/api/statistiques?mois=${m.mois}&annee=${annee}`);
    const d = await res.json();
    setCopros(d.coproprietaires ?? []);
    setDetailLoading(false);
  }

  return (
    <div>
      <div className="mb-6 mt-2 rounded-lg bg-zinc-400/10 md:mt-4">
        <h2 className="p-4 text-2xl font-bold md:text-3xl">Statistiques</h2>
      </div>

      {/* Année selector */}
      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm font-medium text-zinc-600">Année :</label>
        <select
          value={annee}
          onChange={(e) => { setAnnee(parseInt(e.target.value)); setSelectedMois(null); }}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-primary"
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-primary" />
        </div>
      ) : (
        <>
          {/* Global stats cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-5 shadow-sm border border-zinc-200">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total attendu</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">{totalAttendu.toLocaleString()} DH</p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm border border-zinc-200">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total collecté</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">{totalCollecte.toLocaleString()} DH</p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm border border-zinc-200">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Reste à encaisser</p>
              <p className="mt-1 text-2xl font-bold text-red-600">{totalImpaye.toLocaleString()} DH</p>
            </div>
          </div>

          {/* Graphique ligne */}
          <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-zinc-800">Évolution mensuelle</h3>
            <div className="w-full" style={{ height: 260 }}>
              {(() => {
                const maxVal = Math.max(...moisStats.map((x) => x.attendu), 1);
                const pad = { top: 20, right: 20, bottom: 30, left: 60 };
                const w = 800;
                const h = 260;
                const graphW = w - pad.left - pad.right;
                const graphH = h - pad.top - pad.bottom;

                const stepX = graphW / (moisStats.length - 1 || 1);

                const yTicks = 5;
                const yStep = maxVal / yTicks;

                const pointsCollecte = moisStats.map((m, i) => ({
                  x: pad.left + i * stepX,
                  y: pad.top + graphH - (m.collecte / maxVal) * graphH,
                  val: m.collecte,
                }));
                const pointsReste = moisStats.map((m, i) => ({
                  x: pad.left + i * stepX,
                  y: pad.top + graphH - (m.reste / maxVal) * graphH,
                  val: m.reste,
                }));

                const linePathCollecte = pointsCollecte.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
                const linePathReste = pointsReste.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

                const areaPathCollecte = `M${pointsCollecte[0]?.x ?? 0},${pad.top + graphH} ${pointsCollecte.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")} L${pointsCollecte[pointsCollecte.length - 1]?.x ?? 0},${pad.top + graphH} Z`;
                const areaPathReste = `M${pointsReste[0]?.x ?? 0},${pad.top + graphH} ${pointsReste.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")} L${pointsReste[pointsReste.length - 1]?.x ?? 0},${pad.top + graphH} Z`;

                const formatDH = (n: number) => n.toLocaleString() + " DH";

                return (
                  <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                    {/* Grille horizontale */}
                    {Array.from({ length: yTicks + 1 }, (_, i) => {
                      const y = pad.top + graphH - (i * graphH) / yTicks;
                      const val = Math.round(i * yStep);
                      return (
                        <g key={i}>
                          <line x1={pad.left} y1={y} x2={w - pad.right} y2={y} stroke="#e4e4e7" strokeWidth={1} />
                          <text x={pad.left - 8} y={y + 4} textAnchor="end" className="fill-zinc-400" fontSize={11}>
                            {val.toLocaleString()}
                          </text>
                        </g>
                      );
                    })}

                    {/* Axe X mois */}
                    {moisStats.map((m, i) => (
                      <text key={m.mois} x={pad.left + i * stepX} y={h - pad.bottom + 16} textAnchor="middle" className="fill-zinc-400" fontSize={11}>
                        {m.label.slice(0, 3)}
                      </text>
                    ))}

                    {/* Aire collecte */}
                    <path d={areaPathCollecte} fill="rgba(52,211,153,0.12)" />
                    {/* Aire impayé */}
                    <path d={areaPathReste} fill="rgba(248,113,113,0.10)" />

                    {/* Ligne collecte */}
                    <path d={linePathCollecte} fill="none" stroke="#34d399" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    {/* Ligne impayé */}
                    <path d={linePathReste} fill="none" stroke="#f87171" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

                    {/* Points collecte */}
                    {pointsCollecte.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r={4} fill="#fff" stroke="#34d399" strokeWidth={2.5} />
                        <title>{formatDH(p.val)}</title>
                      </g>
                    ))}
                    {/* Points impayé */}
                    {pointsReste.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r={4} fill="#fff" stroke="#f87171" strokeWidth={2.5} />
                        <title>{formatDH(p.val)}</title>
                      </g>
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

          {/* Monthly cards */}
          <h3 className="mb-4 text-lg font-semibold text-zinc-800">Par mois</h3>
          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {moisStats.map((m) => (
              <button
                key={m.mois}
                onClick={() => openMoisDetail(m)}
                className={`rounded-xl border p-4 text-left shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                  selectedMois?.mois === m.mois ? "border-primary ring-2 ring-primary/20" : "border-zinc-200 bg-white"
                }`}
              >
                <p className="text-sm font-semibold text-zinc-800">{m.label}</p>
                <div className="mt-2 space-y-1 text-xs text-zinc-500">
                  <div className="flex justify-between"><span>Attendu</span><span className="font-medium text-zinc-700">{m.attendu.toLocaleString()} DH</span></div>
                  <div className="flex justify-between"><span>Collecté</span><span className="font-medium text-emerald-600">{m.collecte.toLocaleString()} DH</span></div>
                  <div className="flex justify-between"><span>Reste</span><span className="font-medium text-red-600">{m.reste.toLocaleString()} DH</span></div>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-medium text-emerald-700">{m.payes} payé{m.payes > 1 ? "s" : ""}</span>
                  <span className="rounded bg-red-100 px-1.5 py-0.5 font-medium text-red-700">{m.impayes} impayé{m.impayes > 1 ? "s" : ""}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Month detail */}
          {selectedMois && (
            <div className="animate-fade-in-up rounded-xl border border-zinc-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
                <h3 className="text-lg font-semibold">
                  Détail — {selectedMois.label} {annee}
                </h3>
                <button
                  onClick={() => setSelectedMois(null)}
                  className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200"
                >
                  Fermer
                </button>
              </div>

              {detailLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-primary" />
                </div>
              ) : (
                <div className="p-6">
                  {/* Sous-totaux */}
                  <div className="mb-4 grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-zinc-50 p-3 text-center">
                      <p className="text-xs text-zinc-500">Attendu</p>
                      <p className="text-lg font-bold text-zinc-800">{selectedMois.attendu.toLocaleString()} DH</p>
                    </div>
                    <div className="rounded-lg bg-emerald-50 p-3 text-center">
                      <p className="text-xs text-emerald-600">Collecté</p>
                      <p className="text-lg font-bold text-emerald-700">{selectedMois.collecte.toLocaleString()} DH</p>
                    </div>
                    <div className="rounded-lg bg-red-50 p-3 text-center">
                      <p className="text-xs text-red-600">Reste</p>
                      <p className="text-lg font-bold text-red-700">{selectedMois.reste.toLocaleString()} DH</p>
                    </div>
                  </div>

                  {/* Liste copropriétaires */}
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
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  estPaye ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                }`}>
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
                                  <span key={i} className={`rounded px-2 py-0.5 text-xs ${
                                    b.statut === "payé" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                  }`}>
                                    {b.nom}: {b.montant.toLocaleString()} DH
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
