import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate, getPropertyId } from "@/lib/auth";

export async function GET() {
  try {
    const user = await authenticate();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const pid = getPropertyId(user);

    const messages = await prisma.groupMessage.findMany({
      where: { syndicId: pid },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, nom: true, prenom: true, role: true } },
      },
    });

    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la récupération des messages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await authenticate();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const content = body.content?.trim();
    const isAnonymous = body.isAnonymous ?? false;

    if (!content) {
      return NextResponse.json(
        { error: "Contenu requis" },
        { status: 400 }
      );
    }

    const pid = getPropertyId(user);
    if (!pid) {
      return NextResponse.json(
        { error: "Aucun syndicat associé" },
        { status: 400 }
      );
    }

    const message = await prisma.groupMessage.create({
      data: {
        content,
        senderId: user.id,
        syndicId: pid,
        isAnonymous: isAnonymous ?? false,
      },
      include: {
        sender: { select: { id: true, nom: true, prenom: true, role: true } },
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
