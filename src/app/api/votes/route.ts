import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate, getPropertyId } from "@/lib/auth";

export async function GET() {
  const user = await authenticate();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    if (user.role === "syndic") {
      const votes = await prisma.vote.findMany({
        where: { syndicId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          responses: {
            include: {
              user: { select: { id: true, nom: true, prenom: true } },
            },
          },
          _count: { select: { responses: true } },
        },
      });

      const result = votes.map((v) => {
        const total = v.responses.length;
        const pour = v.responses.filter((r) => r.choix === "pour").length;
        const contre = v.responses.filter((r) => r.choix === "contre").length;
        const neutre = v.responses.filter((r) => r.choix === "neutre").length;
        return {
          id: v.id,
          title: v.title,
          description: v.description,
          actif: v.actif,
          createdAt: v.createdAt,
          total,
          pour: { count: pour, pct: total ? Math.round((pour / total) * 100) : 0 },
          contre: { count: contre, pct: total ? Math.round((contre / total) * 100) : 0 },
          neutre: { count: neutre, pct: total ? Math.round((neutre / total) * 100) : 0 },
          responses: v.responses.map((r) => ({
            id: r.id,
            choix: r.choix,
            user: r.user,
            createdAt: r.createdAt,
          })),
        };
      });

      return NextResponse.json({ votes: result });
    } else {
      const pid = getPropertyId(user);
      const activeVotes = await prisma.vote.findMany({
        where: { actif: true, syndicId: pid },
        orderBy: { createdAt: "desc" },
      });

      if (!activeVotes.length) {
        return NextResponse.json({ votes: [], vote: null, aVote: true });
      }

      const myResponses = await prisma.voteResponse.findMany({
        where: { userId: user.id },
        select: { voteId: true },
      });

      const answeredIds = new Set(myResponses.map((r) => r.voteId));
      const unansweredVotes = activeVotes.filter((v) => !answeredIds.has(v.id));

      return NextResponse.json({
        votes: unansweredVotes.map((v) => ({
          id: v.id,
          title: v.title,
          description: v.description,
          actif: v.actif,
          createdAt: v.createdAt,
        })),
        vote: unansweredVotes[0]
          ? {
              id: unansweredVotes[0].id,
              title: unansweredVotes[0].title,
              description: unansweredVotes[0].description,
              actif: unansweredVotes[0].actif,
              createdAt: unansweredVotes[0].createdAt,
            }
          : null,
        aVote: unansweredVotes.length === 0,
      });
    }
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await authenticate();
  if (!user || user.role !== "syndic") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const title = body.title?.trim();
    const description = body.description ?? null;
    if (!title) {
      return NextResponse.json({ error: "Titre requis" }, { status: 400 });
    }

    const vote = await prisma.vote.create({
      data: { title, description, syndicId: user.id },
    });

    return NextResponse.json({ vote }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
