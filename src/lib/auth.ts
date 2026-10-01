import { prisma } from "./prisma";
import { getTokenFromCookie, verifyToken } from "./jwt";

export type AuthUser = {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  role: string;
  syndicId: string | null;
};

export async function authenticate(): Promise<AuthUser | null> {
  const token = await getTokenFromCookie();
  if (!token) return null;
  try {
    const { userId } = verifyToken(token);
    return await prisma.user.findUnique({ where: { id: userId } });
  } catch {
    return null;
  }
}

export function getPropertyId(user: AuthUser): string {
  return user.role === "syndic" ? user.id : (user.syndicId ?? "");
}
