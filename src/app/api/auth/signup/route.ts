import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken, setAuthCookie } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = body.password;
    const nom = body.nom?.trim();
    const prenom = body.prenom?.trim();
    const adresse = body.adresse?.trim();
    const telephone = body.telephone?.trim();

    if (!nom || !prenom || !password || !adresse || !telephone) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findFirst({ where: { telephone } });
    if (existing) {
      return NextResponse.json(
        { error: "Ce téléphone est déjà utilisé" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { nom, prenom, password: hashed, adresse, telephone, role: "syndic" },
    });

    const token = signToken(user.id);
    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        adresse: user.adresse,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
