import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authenticate, getPropertyId } from "@/lib/auth";

function generatePassword() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pwd = "";
  for (let i = 0; i < 10; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  return pwd;
}

function trim(v: string) { return v.trim(); }

export async function GET(request: Request) {
  const user = await authenticate();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";
  const pid = getPropertyId(user);

  if (all) {
    const users = await prisma.user.findMany({
      where: {
        id: { not: user.id },
        OR: [
          { role: "syndic", id: pid },
          { role: "coproprietaire", syndicId: pid },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ coproprietaires: users });
  }

  const users = await prisma.user.findMany({
    where: { role: "coproprietaire", syndicId: pid },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bureaux: true } } },
  });

  return NextResponse.json({ coproprietaires: users });
}

export async function POST(req: Request) {
  const syndic = await authenticate();
  if (!syndic || syndic.role !== "syndic") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { nom: nNom, prenom: nPrenom, telephone: nTelephone, adresse: nAdresse, bureauIds } = body;

    if (!nNom || !nPrenom || !nAdresse || !nTelephone) {
      return NextResponse.json(
        { error: "Nom, prénom, téléphone et adresse sont requis" },
        { status: 400 }
      );
    }
    const nom = trim(nNom);
    const prenom = trim(nPrenom);
    const adresse = trim(nAdresse);
    const telephone = trim(nTelephone);

    const rawPassword = generatePassword();
    const hashed = await bcrypt.hash(rawPassword, 12);

    const copro = await prisma.user.create({
      data: {
        nom,
        prenom,
        password: hashed,
        adresse,
        telephone,
        role: "coproprietaire",
        syndicId: syndic.id,
      },
    });

    if (bureauIds && Array.isArray(bureauIds) && bureauIds.length > 0) {
      await prisma.bureau.updateMany({
        where: { id: { in: bureauIds }, syndicId: syndic.id },
        data: { userId: copro.id },
      });
    }

    return NextResponse.json(
      {
        coproprietaire: {
          id: copro.id,
          nom: copro.nom,
          prenom: copro.prenom,
          telephone: copro.telephone,
          adresse: copro.adresse,
        },
        credentials: { telephone, password: rawPassword },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
