"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Gamepad2, Search, Sparkles, Plus, CheckCircle2 } from "lucide-react";

type Result = { id: string; title: string; description: string; image: string; authors?: string; year?: string; category: "Livre" | "Jeu"; players?: string };

export default function SmartAddPage() {
  const [type, setType] = useState<"book" | "game">("book");
  const [mode, setMode] = useState<"search" | "assistant">("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [added, setAdded] = useState<string[]>([]);

  async function search(value = query) {
    if (value.trim().length < 2) { setError("Saisis au moins deux caractères."); return; }
    setLoading(true); setError(""); setResults([]);
    try {
      const response = await fetch(`/api/catalog-search?type=${type}&q=${encodeURIComponent(value)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Recherche impossible.");
      setResults(data.results || []);
      if (!(data.results || []).length) setError("Aucun résultat trouvé. Essaie avec d'autres mots.");
    } catch (e) { setError(e instanceof Error ? e.message : "Erreur de recherche."); }
    finally { setLoading(false); }
  }

  function add(result: Result) {
    const current = JSON.parse(localStorage.getItem("familystock_items") || "[]");
    if (current.some((item: any) => item.name.toLowerCase() === result.title.toLowerCase())) { setError("Cet objet semble déjà être dans le catalogue."); return; }
    const id = Math.max(0, ...current.map((item: any) => Number(item.id) || 0)) + 1;
    current.push({ id, name: result.title, category: result.category, detail: [result.authors, result.year, result.description].filter(Boolean).join(" · ").slice(0, 900), status: "Disponible", color: type === "book" ? "rose" : "blue", icon: type === "book" ? "book" : "game", condition: "Bon état", photo: result.image || undefined, externalId: result.id });
    localStorage.setItem("familystock_items", JSON.stringify(current));
    setAdded(old => [...old, result.id]);
  }

  return <main className="min-h-screen bg-[#f6f7fb] px-4 py-8 sm:px-8"><div className="mx-auto max-w-5xl">
    <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600"><ArrowLeft size={16}/> Retour à FamilyStock</Link>
    <header className="mt-7"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-700"><Sparkles size={16}/> Catalogue intelligent</div><h1 className="mt-2 text-3xl font-bold text-slate-950">Trouver et ajouter un objet</h1><p className="mt-2 text-sm text-slate-500">Recherche un titre ou décris ce que tu aimerais trouver.</p></header>
    <div className="mt-6 flex flex-wrap gap-2"><button onClick={()=>setMode("search")} className={`rounded-xl px-4 py-3 text-sm font-bold ${mode==="search"?"bg-slate-950 text-white":"border bg-white text-slate-600"}`}>Recherche par titre</button><button onClick={()=>setMode("assistant")} className={`rounded-xl px-4 py-3 text-sm font-bold ${mode==="assistant"?"bg-slate-950 text-white":"border bg-white text-slate-600"}`}><Sparkles size={15} className="mr-2 inline"/>Assistant de recommandations</button></div>
    <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <div className="mb-4 flex gap-2"><button onClick={()=>{setType("book");setResults([]);}} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${type==="book"?"bg-blue-50 text-blue-800":"bg-slate-50 text-slate-500"}`}><BookOpen size={16}/> Livres</button><button onClick={()=>{setType("game");setResults([]);}} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${type==="game"?"bg-blue-50 text-blue-800":"bg-slate-50 text-slate-500"}`}><Gamepad2 size={16}/> Jeux</button></div>
      <form onSubmit={e=>{e.preventDefault();search();}} className="flex flex-col gap-3 sm:flex-row"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={mode==="assistant"?"Ex. un livre jeunesse sur les animaux…":type==="book"?"Titre, auteur ou ISBN…":"Nom du jeu de société…"} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"/><button disabled={loading} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"><Search size={16} className="mr-2 inline"/>{loading?"Recherche…":mode==="assistant"?"Trouver des idées":"Rechercher"}</button></form>
      {mode==="assistant"&&<p className="mt-3 text-xs text-slate-500">L'assistant transforme ta description en recherche thématique et propose des résultats du catalogue externe. Ce premier prototype n'utilise pas encore de modèle IA conversationnel.</p>}
      {error&&<p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{error}</p>}
    </section>
    {results.length>0&&<div className="mt-6 grid gap-4 sm:grid-cols-2">{results.map(result=><article key={result.id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex h-32 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">{result.image?<img src={result.image} alt={result.title} className="h-full w-full object-cover"/>:<Gamepad2 className="text-slate-400" size={30}/>}</div><div className="min-w-0 flex-1"><h2 className="font-bold text-slate-900">{result.title}</h2>{result.authors&&<p className="mt-1 text-xs text-slate-500">{result.authors}</p>}<p className="mt-1 text-xs text-slate-400">{result.year||""}</p><p className="mt-2 line-clamp-4 text-xs leading-5 text-slate-600">{result.description}</p><button disabled={added.includes(result.id)} onClick={()=>add(result)} className="mt-3 rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white disabled:bg-emerald-100 disabled:text-emerald-800">{added.includes(result.id)?<><CheckCircle2 size={14} className="mr-1 inline"/>Ajouté</>:<><Plus size={14} className="mr-1 inline"/>Ajouter au catalogue</>}</button></div></article>)}</div>}
  </div></main>;
}
