"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Archive, KeyRound, ShieldCheck } from "lucide-react";

type MemberRequest = {
  firstName: string;
  lastName: string;
  status: "pending" | "approved" | "rejected";
  accessCode?: string;
};

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      const requests = JSON.parse(localStorage.getItem("familystock_requests") || "[]") as MemberRequest[];
      const normalized = code.trim().toUpperCase();
      const member = requests.find((request) =>
        request.status === "approved" &&
        request.accessCode?.toUpperCase() === normalized
      );
      if (!member) {
        setError("Code inconnu ou compte non encore validé.");
        return;
      }
      sessionStorage.setItem("familystock_session", JSON.stringify({
        firstName: member.firstName,
        lastName: member.lastName,
      }));
      window.location.replace("/");
    } catch {
      setError("Impossible de lire les comptes enregistrés sur cet appareil.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f7fb] px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/connexion" className="mb-8 flex items-center justify-center gap-3 text-slate-900">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white"><Archive size={21}/></span>
          <span className="text-xl font-bold">FamilyStock</span>
        </Link>
        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9">
          <div className="mb-7">
            <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-700">Espace familial</div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Connexion</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Entre le code personnel qui t’a été communiqué après validation de ton inscription.</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <label className="block text-xs font-semibold text-slate-700">Code personnel
              <span className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-slate-500">
                <KeyRound size={16} className="text-slate-400"/>
                <input required autoComplete="one-time-code" maxLength={12} value={code} onChange={event=>setCode(event.target.value.toUpperCase())} placeholder="ABC-123" className="w-full bg-transparent py-3 text-sm tracking-widest outline-none"/>
              </span>
            </label>
            {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
            <button type="submit" className="w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white hover:bg-slate-800">Se connecter</button>
          </form>
          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-xs text-slate-500">Pas encore de code ?</p>
            <Link href="/inscription" className="mt-2 inline-flex text-xs font-semibold text-blue-700 underline">Demander un accès familial</Link>
          </div>
          <Link href="/admin/connexion" className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-slate-700"><ShieldCheck size={14}/> Accès administrateur</Link>
        </section>
        <p className="mt-5 text-center text-[11px] leading-5 text-amber-700">Prototype local : les codes et comptes sont stockés dans ce navigateur. Ils ne sont pas synchronisés et cette connexion ne constitue pas une sécurité suffisante pour des données privées.</p>
      </div>
    </main>
  );
}
