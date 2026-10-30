"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Archive, ArrowLeft, Check, Clock3, Copy, ShieldCheck, UserRound, X } from "lucide-react";

type MemberRequest = { id: string; firstName: string; lastName: string; email: string; photo: string; status: "pending" | "approved" | "rejected"; accessCode?: string; createdAt: string };

function makeCode() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, n => (n % 36).toString(36)).join("").toUpperCase().replace(/(.{3})/, "$1-");
}

export default function MembersAdminPage() {
  const [requests, setRequests] = useState<MemberRequest[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");

  function refresh() {
    setRequests(JSON.parse(localStorage.getItem("familystock_requests") || "[]"));
    setLoaded(true);
  }
  useEffect(() => { refresh(); }, []);

  function save(next: MemberRequest[]) {
    localStorage.setItem("familystock_requests", JSON.stringify(next));
    setRequests(next);
  }
  function approve(id: string) {
    const code = makeCode();
    save(requests.map(r => r.id === id ? { ...r, status: "approved", accessCode: code } : r));
    setNotice("Demande acceptée. Communique le code au membre par un moyen privé.");
  }
  function reject(id: string) {
    save(requests.map(r => r.id === id ? { ...r, status: "rejected", accessCode: undefined } : r));
    setNotice("Demande refusée.");
  }

  const pending = requests.filter(r=>r.status==="pending");
  return <main className="min-h-screen bg-[#f6f7fb] px-4 py-8 sm:px-8">
    <div className="mx-auto max-w-5xl">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><ArrowLeft size={16}/> Retour au tableau de bord</Link>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-4"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-blue-700"><ShieldCheck size={15}/> Administration</div><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Demandes des membres</h1><p className="mt-2 text-sm text-slate-500">Examine les demandes et décide qui peut rejoindre l’espace familial.</p></div><div className="rounded-2xl border border-slate-200 bg-white px-5 py-3"><div className="text-2xl font-bold">{pending.length}</div><div className="text-xs text-slate-500">En attente</div></div></div>
      {notice && <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">{notice}<button onClick={()=>setNotice("")} className="ml-3 font-bold underline">Fermer</button></div>}
      <div className="mt-7 space-y-4">{!loaded ? <p className="text-sm text-slate-500">Chargement…</p> : requests.length===0 ? <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><UserRound size={30} className="mx-auto text-slate-300"/><h2 className="mt-4 font-bold text-slate-800">Aucune demande pour le moment</h2><p className="mt-2 text-sm text-slate-500">Les nouvelles demandes apparaîtront ici.</p><Link href="/inscription" className="mt-5 inline-flex rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white">Voir le formulaire d’inscription</Link></section> : requests.map(r=><article key={r.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"><div className="flex min-w-0 flex-1 items-center gap-4">{r.photo ? <img src={r.photo} alt="" className="h-12 w-12 rounded-full object-cover"/> : <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500"><UserRound size={20}/></div>}<div className="min-w-0"><h2 className="font-bold text-slate-950">{r.firstName} {r.lastName}</h2><p className="text-xs text-slate-500">{r.email || "Aucune adresse email fournie"}</p><p className="mt-1 text-[11px] text-slate-400">Demande du {new Date(r.createdAt).toLocaleString("fr-FR")}</p></div></div><div className="flex flex-wrap items-center gap-2">{r.status==="pending" ? <><span className="mr-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-700"><Clock3 size={14}/> En attente</span><button onClick={()=>approve(r.id)} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white"><Check size={15}/> Accepter</button><button onClick={()=>reject(r.id)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700"><X size={15}/> Refuser</button></> : r.status==="approved" ? <div className="text-right"><div className="text-xs font-bold text-emerald-700">Accepté</div><div className="mt-1 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 font-mono text-sm">{r.accessCode}<button title="Copier le code" onClick={()=>{navigator.clipboard.writeText(r.accessCode||"");setNotice("Code copié.");}}><Copy size={14}/></button></div></div> : <span className="text-xs font-bold text-slate-500">Refusé</span>}</div></article>)}</div>
      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900"><strong>Prototype uniquement :</strong> les demandes et codes sont stockés dans le navigateur de cet appareil. Ils ne sont pas partagés entre visiteurs et cette page n’est pas protégée par une authentification administrateur. Ne l’utilise pas encore avec de vraies données familiales. La prochaine étape sera de déplacer ce fonctionnement dans un stockage serveur sécurisé et de protéger l’administration.</div>
      <div className="mt-5 flex items-center gap-2 text-xs text-slate-500"><Archive size={14}/> FamilyStock · Gestion des accès</div>
    </div>
  </main>;
}
