import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate, getPropertyId } from "@/lib/auth";

export async function GET() {
  try {
    const user = await authenticate();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      where: { receiverId: user.id },
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
    const receiverId = body.receiverId;
    const content = body.content?.trim();

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "Destinataire et contenu requis" },
        { status: 400 }
      );
    }

    const pid = getPropertyId(user);

    const receiver = await prisma.user.findFirst({
      where: {
        id: receiverId,
        OR: [
          { role: "syndic", id: pid },
          { role: "coproprietaire", syndicId: pid },
        ],
      },
    });
    if (!receiver) {
      return NextResponse.json(
        { error: "Destinataire introuvable" },
        { status: 404 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: user.id,
        receiverId,
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
