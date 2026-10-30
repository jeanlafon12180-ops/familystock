"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Archive, KeyRound, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Connexion impossible.");
        return;
      }
      window.location.replace("/admin/membres");
    } catch {
      setError("Le serveur est momentanément inaccessible.");
    } finally {
      setLoading(false);
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
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-blue-700"><ShieldCheck size={15}/> Espace administrateur</div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Connexion admin</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Cette connexion est distincte du code personnel utilisé par les membres.</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <label className="block text-xs font-semibold text-slate-700">Mot de passe administrateur
              <span className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-slate-500">
                <KeyRound size={16} className="text-slate-400"/>
                <input required type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Mot de passe admin" className="w-full bg-transparent py-3 text-sm outline-none"/>
              </span>
            </label>
            {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
            <button disabled={loading} type="submit" className="w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">{loading ? "Vérification…" : "Se connecter"}</button>
          </form>
          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <Link href="/connexion" className="text-xs font-semibold text-blue-700 underline">Retour à la connexion des membres</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
