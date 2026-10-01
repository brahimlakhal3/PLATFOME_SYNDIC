import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken, setAuthCookie } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { telephone, password } = await req.json();

    if (!telephone || !password) {
      return NextResponse.json(
        { error: "Téléphone et mot de passe requis" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({ where: { telephone } });
    if (!user) {
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      );
    }

    const token = signToken(user.id);
    await setAuthCookie(token);

    let redirect = "/dashboard";

    if (user.role === "coproprietaire") {
      redirect = "/home";
    }

    return NextResponse.json({
      redirect,
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
