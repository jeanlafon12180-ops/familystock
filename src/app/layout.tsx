import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FamilyStock — Votre maison, bien organisée",
  description: "Le catalogue familial pour gérer les livres, jeux et équipements empruntés.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
