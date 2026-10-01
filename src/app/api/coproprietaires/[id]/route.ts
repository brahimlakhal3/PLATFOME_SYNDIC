import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

function generatePassword() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pwd = "";
  for (let i = 0; i < 10; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  return pwd;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await authenticate();
  if (!user || user.role !== "syndic") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { id } = await params;
  const copro = await prisma.user.findFirst({
    where: { id, role: "coproprietaire", syndicId: user.id },
    include: { bureaux: true },
  });

  if (!copro) {
    return NextResponse.json(
      { error: "Copropriétaire not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    coproprietaire: {
      id: copro.id,
      nom: copro.nom,
      prenom: copro.prenom,
      telephone: copro.telephone,
      adresse: copro.adresse,
      bureaux: copro.bureaux,
    },
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await authenticate();
  if (!user || user.role !== "syndic") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { bureauIds } = body;
    const nom = body.nom?.trim();
    const prenom = body.prenom?.trim();
    const telephone = body.telephone?.trim();
    const adresse = body.adresse?.trim();

    if (!nom || !prenom || !adresse || !telephone) {
      return NextResponse.json(
        { error: "Nom, prénom, téléphone et adresse sont requis" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findFirst({
      where: { id, role: "coproprietaire", syndicId: user.id },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Copropriétaire not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { nom, prenom, telephone, adresse },
    });

    if (bureauIds && Array.isArray(bureauIds)) {
      await prisma.bureau.updateMany({
        where: { userId: id },
        data: { userId: null },
      });
      await prisma.bureau.updateMany({
        where: { id: { in: bureauIds }, syndicId: user.id },
        data: { userId: id },
      });
    }

    return NextResponse.json({
      coproprietaire: {
        id: updated.id,
        nom: updated.nom,
        prenom: updated.prenom,
        telephone: updated.telephone,
        adresse: updated.adresse,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await authenticate();
  if (!user || user.role !== "syndic") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.user.findFirst({
      where: { id, role: "coproprietaire", syndicId: user.id },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Copropriétaire not found" },
        { status: 404 }
      );
    }

    const rawPassword = generatePassword();
    const hashed = await bcrypt.hash(rawPassword, 12);
    await prisma.user.update({
      where: { id },
      data: { password: hashed },
    });

    return NextResponse.json({ password: rawPassword });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await authenticate();
  if (!user || user.role !== "syndic") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.user.findFirst({
      where: { id, role: "coproprietaire", syndicId: user.id },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Copropriétaire not found" },
        { status: 404 }
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
