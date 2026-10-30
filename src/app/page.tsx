"use client";

import { useMemo, useState } from "react";
import {
  Archive, ArrowDownRight, ArrowUpRight, Bell, BookOpen, CalendarDays,
  Check, ChevronDown, CircleHelp, Clock3, Film, Gamepad2, LayoutDashboard,
  LogOut, Menu, Plus, Search, Settings, ShieldCheck, SlidersHorizontal,
  Sparkles, UserRound, Users, X, Package, CheckCircle2, AlertCircle
} from "lucide-react";

type Category = "Livre" | "Jeu" | "Matériel";
type Item = { id: number; name: string; category: Category; detail: string; status: "Disponible" | "Emprunté"; borrower?: string; due?: string; color: string; icon: "book" | "game" | "projector" };
type Loan = { id: number; itemId: number; item: string; borrower: string; start: string; due: string; status: "À confirmer" | "Emprunté" | "Rendu" };
const initialItems: Item[] = [
  { id: 427, name: "J’aime lire n°427", category: "Livre", detail: "Collection J’aime lire · N° 427", status: "Emprunté", borrower: "Camille", due: "2026-11-06", color: "rose", icon: "book" },
  { id: 428, name: "J’aime lire n°428", category: "Livre", detail: "Collection J’aime lire · N° 428", status: "Disponible", color: "amber", icon: "book" },
  { id: 429, name: "J’aime lire n°429", category: "Livre", detail: "Collection J’aime lire · N° 429", status: "Disponible", color: "violet", icon: "book" },
  { id: 12, name: "Les Aventuriers du Rail", category: "Jeu", detail: "Jeu de société · 2 à 5 joueurs", status: "Disponible", color: "blue", icon: "game" },
  { id: 13, name: "Catan", category: "Jeu", detail: "Jeu de société · 3 à 4 joueurs", status: "Emprunté", borrower: "Lucas", due: "2026-11-02", color: "green", icon: "game" },
  { id: 20, name: "Vidéoprojecteur", category: "Matériel", detail: "Équipement cinéma · Réservation", status: "Disponible", color: "slate", icon: "projector" },
];
const initialLoans: Loan[] = [
  { id: 1, itemId: 427, item: "J’aime lire n°427", borrower: "Camille", start: "2026-10-30", due: "2026-11-06", status: "Emprunté" },
  { id: 2, itemId: 13, item: "Catan", borrower: "Lucas", start: "2026-10-29", due: "2026-11-02", status: "Emprunté" },
];
const currencyDate = (value?: string) => value ? new Date(value + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "—";

export default function Home() {
  const [items, setItems] = useState(initialItems);
  const [loans, setLoans] = useState(initialLoans);
  const [tab, setTab] = useState("overview");
  const [filter, setFilter] = useState("Tous");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<"borrow" | "add" | "return" | "reserve" | null>(null);
  const [selected, setSelected] = useState<Item | null>(null);
  const [name, setName] = useState("");
  const [due, setDue] = useState("2026-11-13");
  const [borrower, setBorrower] = useState("Camille");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("Livre");
  const [menuOpen, setMenuOpen] = useState(false);
  const available = items.filter(i => i.status === "Disponible").length;
  const activeLoans = loans.filter(l => l.status === "Emprunté").length;
  const filtered = useMemo(() => items.filter(i => (filter === "Tous" || i.category === filter) && (i.name.toLowerCase().includes(query.toLowerCase()) || i.detail.toLowerCase().includes(query.toLowerCase()))), [items, filter, query]);

  function borrow(item: Item) { setSelected(item); setModal("borrow"); setDue("2026-11-13"); }
  function confirmBorrow() {
    if (!selected || !borrower.trim()) return;
    setItems(old => old.map(i => i.id === selected.id ? { ...i, status: "Emprunté", borrower, due } : i));
    setLoans(old => [{ id: Date.now(), itemId: selected.id, item: selected.name, borrower, start: new Date().toISOString().slice(0,10), due, status: "Emprunté" }, ...old]);
    setModal(null); setSelected(null);
  }
  function markReturned(loan: Loan) {
    setItems(old => old.map(i => i.id === loan.itemId ? { ...i, status: "Disponible", borrower: undefined, due: undefined } : i));
    setLoans(old => old.map(l => l.id === loan.id ? { ...l, status: "Rendu" } : l));
    setModal(null);
  }
  function addItem() {
    if (!newTitle.trim()) return;
    const id = Math.max(0, ...items.map(i => i.id)) + 1;
    const color = newCategory === "Livre" ? "rose" : newCategory === "Jeu" ? "blue" : "slate";
    const icon = newCategory === "Livre" ? "book" : newCategory === "Jeu" ? "game" : "projector";
    setItems(old => [...old, { id, name: newTitle, category: newCategory, detail: newCategory + " · Ajouté au catalogue", status: "Disponible", color, icon }]);
    setNewTitle(""); setModal(null);
  }
  const nav = [
    { id: "overview", label: "Vue d’ensemble", icon: LayoutDashboard },
    { id: "catalog", label: "Catalogue", icon: Archive },
    { id: "loans", label: "Emprunts", icon: BookOpen },
    { id: "reservations", label: "Réservations", icon: CalendarDays },
  ];
  const heading = nav.find(n => n.id === tab)?.label ?? "Administration";

  return (
    <div className="min-h-screen lg:flex">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col border-r border-slate-200 bg-white px-5 py-6 transition-transform lg:static lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-10 flex items-center gap-3 px-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-300"><Archive size={21}/></div>
          <div><div className="text-[19px] font-bold tracking-tight">FamilyStock</div><div className="text-[10px] font-semibold uppercase tracking-[.19em] text-slate-400">Family inventory</div></div>
        </div>
        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.17em] text-slate-400">Espace familial</div>
        <nav className="space-y-1">
          {nav.map(n => <button key={n.id} onClick={() => {setTab(n.id);setMenuOpen(false);}} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-semibold transition ${tab === n.id ? "bg-slate-950 text-white shadow-md shadow-slate-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}><n.icon size={17}/>{n.label}{n.id==="loans" && <span className="ml-auto rounded-md bg-blue-100 px-2 py-0.5 text-[10px] text-blue-700">{activeLoans}</span>}</button>)}
        </nav>
        <div className="mt-9 mb-3 px-3 text-[10px] font-bold uppercase tracking-[.17em] text-slate-400">Gestion</div>
        <button onClick={() => setTab("admin")} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-semibold ${tab==="admin"?"bg-slate-950 text-white":"text-slate-500 hover:bg-slate-100"}`}><ShieldCheck size={17}/>Administration</button>
        <div className="mt-auto rounded-2xl bg-slate-950 p-4 text-white">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"><Sparkles size={17}/></div>
          <div className="text-sm font-semibold">Tout est organisé.</div>
          <p className="mt-1 text-[11px] leading-5 text-slate-400">Livres, jeux et équipements réunis au même endroit.</p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/3 rounded-full bg-blue-400"/></div>
        </div>
        <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">JL</div>
          <div className="min-w-0 flex-1"><div className="truncate text-xs font-bold">Administrateur</div><div className="text-[10px] text-slate-400">Espace personnel</div></div>
          <Settings size={16} className="text-slate-400"/>
        </div>
      </aside>
      {menuOpen && <button aria-label="Fermer le menu" onClick={()=>setMenuOpen(false)} className="fixed inset-0 z-30 bg-slate-950/20 lg:hidden"/>}
      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/85 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3"><button onClick={()=>setMenuOpen(true)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"><Menu size={19}/></button><div><div className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">FamilyStock / {heading}</div><div className="text-lg font-bold tracking-tight text-slate-900">{tab==="overview"?"Bonjour, bienvenue chez vous.":heading}</div></div></div>
          <div className="flex items-center gap-2 sm:gap-4"><button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"><Bell size={17}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500"/></button><div className="hidden h-8 w-px bg-slate-200 sm:block"/><div className="hidden items-center gap-2 sm:flex"><div className="text-right"><div className="text-xs font-bold">Jean</div><div className="text-[10px] text-slate-400">Administrateur</div></div><div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">JL</div></div></div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8">
          {tab==="overview" && <>
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> Votre espace est prêt</div><h1 className="text-3xl font-bold tracking-tight text-slate-950">Tout votre univers, <span className="text-slate-400">à portée de main.</span></h1><p className="mt-2 text-sm text-slate-500">Suivez les objets partagés et gardez un œil sur les emprunts de la famille.</p></div><button onClick={()=>setModal("add")} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800"><Plus size={16}/> Ajouter un objet</button></div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {label:"Objets au catalogue",value:items.length,sub:"Toutes catégories",icon:Package,trend:"Inventaire",tone:"slate"},
                {label:"Disponibles",value:available,sub:"Prêts à être empruntés",icon:CheckCircle2,trend:"En stock",tone:"green"},
                {label:"Emprunts en cours",value:activeLoans,sub:"À suivre actuellement",icon:BookOpen,trend:"En cours",tone:"blue"},
                {label:"Membres",value:3,sub:"Dans l’espace familial",icon:Users,trend:"Famille",tone:"violet"}
              ].map((s,i)=><div key={s.label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40"><div className="flex items-center justify-between"><div className="text-xs font-semibold text-slate-500">{s.label}</div><div className="rounded-xl bg-slate-100 p-2.5 text-slate-700"><s.icon size={18}/></div></div><div className="mt-4 flex items-end justify-between"><div><div className="text-3xl font-bold tracking-tight">{s.value}</div><div className="mt-1 text-[11px] text-slate-400">{s.sub}</div></div><span className="rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-500">{s.trend}</span></div></div>)}
            </div>
            <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-bold">Emprunts récents</h2><p className="mt-1 text-xs text-slate-400">Les objets actuellement sortis</p></div><button onClick={()=>setTab("loans")} className="text-xs font-bold text-blue-700 hover:text-blue-900">Tout voir →</button></div><div className="space-y-3">{loans.filter(l=>l.status==="Emprunté").map(l=><div key={l.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><BookOpen size={18}/></div><div className="min-w-0 flex-1"><div className="truncate text-xs font-bold">{l.item}</div><div className="mt-1 text-[10px] text-slate-400">Emprunté par {l.borrower}</div></div><div className="text-right"><div className="text-[10px] font-bold text-slate-700">Retour prévu</div><div className="mt-1 text-[11px] text-slate-500">{currencyDate(l.due)}</div></div></div>)}{activeLoans===0&&<p className="py-8 text-center text-sm text-slate-400">Aucun emprunt en cours.</p>}</div></section>
              <section className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-300/50"><div className="flex items-center justify-between"><div className="text-xs font-semibold text-slate-300">Votre inventaire</div><Archive size={18} className="text-slate-400"/></div><div className="mt-7 text-4xl font-bold">{items.length}<span className="ml-2 text-sm font-medium text-slate-400">objets</span></div><div className="mt-2 text-xs text-slate-400">répartis dans votre catalogue</div><div className="mt-7 space-y-4">{(["Livre","Jeu","Matériel"] as Category[]).map(c=>{const count=items.filter(i=>i.category===c).length;return <div key={c}><div className="mb-2 flex justify-between text-[11px]"><span className="text-slate-300">{c}s</span><span className="font-bold">{count}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-blue-400" style={{width:`${items.length?count/items.length*100:0}%`}}/></div></div>})}</div></section>
            </div>
            <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold">Accès rapide au catalogue</h2><p className="mt-1 text-xs text-slate-400">Retrouvez les objets disponibles</p></div><button onClick={()=>setTab("catalog")} className="text-xs font-bold text-blue-700">Explorer →</button></div><div className="grid gap-3 sm:grid-cols-3">{items.slice(0,3).map(i=><button key={i.id} onClick={()=>i.status==="Disponible"?borrow(i):setTab("loans")} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-slate-300 hover:bg-slate-50"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100"><BookOpen size={18}/></div><div className="min-w-0 flex-1"><div className="truncate text-xs font-bold">{i.name}</div><div className="mt-1 text-[10px] text-slate-400">{i.category}</div></div><span className={`h-2 w-2 rounded-full ${i.status==="Disponible"?"bg-emerald-500":"bg-amber-400"}`}/></button>)}</div></section>
          </>}

          {tab==="catalog" && <section><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-bold">Votre catalogue</h1><p className="mt-1 text-sm text-slate-500">Chaque objet possède sa propre fiche et sa disponibilité.</p></div><button onClick={()=>setModal("add")} className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white"><Plus size={16}/> Ajouter</button></div><div className="mb-5 flex flex-wrap gap-3"><div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3"><Search size={16} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un objet…" className="w-full bg-transparent py-3 text-xs outline-none"/></div><div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3"><SlidersHorizontal size={15} className="text-slate-400"/><select value={filter} onChange={e=>setFilter(e.target.value)} className="bg-transparent py-3 text-xs outline-none"><option>Tous</option><option>Livre</option><option>Jeu</option><option>Matériel</option></select></div></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filtered.map(i=><article key={i.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className={`mb-5 flex h-28 items-center justify-center rounded-xl ${i.color==="rose"?"bg-rose-50":i.color==="amber"?"bg-amber-50":i.color==="violet"?"bg-violet-50":i.color==="green"?"bg-emerald-50":i.color==="blue"?"bg-blue-50":"bg-slate-100"}`}>{i.icon==="book"?<BookOpen size={32} className="text-slate-500"/>:i.icon==="game"?<Gamepad2 size={32} className="text-slate-500"/>:<Film size={32} className="text-slate-500"/>}</div><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{i.category}</span><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${i.status==="Disponible"?"bg-emerald-50 text-emerald-700":"bg-amber-50 text-amber-700"}`}>{i.status}</span></div><h3 className="mt-2 font-bold">{i.name}</h3><p className="mt-1 text-xs text-slate-400">{i.detail}</p>{i.status==="Emprunté"&&<p className="mt-3 text-xs text-slate-500">Chez {i.borrower} · retour {currencyDate(i.due)}</p>}<button disabled={i.status!=="Disponible"} onClick={()=>borrow(i)} className="mt-5 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-950 hover:text-white disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300">{i.status==="Disponible"?"Emprunter cet objet":"Indisponible"}</button></article>)}</div>{filtered.length===0&&<div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-400">Aucun objet ne correspond à cette recherche.</div>}</section>}

          {tab==="loans" && <section><div className="mb-6"><h1 className="text-2xl font-bold">Suivi des emprunts</h1><p className="mt-1 text-sm text-slate-500">Consultez les objets sortis et confirmez leur retour.</p></div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="grid grid-cols-[1.4fr_1fr_1fr_auto] gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400"><span>Objet</span><span>Emprunteur</span><span>Retour prévu</span><span>Action</span></div>{loans.map(l=><div key={l.id} className="grid grid-cols-[1.4fr_1fr_1fr_auto] items-center gap-3 border-b border-slate-100 px-5 py-4 last:border-0"><div className="text-xs font-bold">{l.item}<div className="mt-1 text-[10px] font-normal text-slate-400">Départ : {currencyDate(l.start)}</div></div><span className="text-xs text-slate-600">{l.borrower}</span><span className="text-xs text-slate-600">{currencyDate(l.due)}</span>{l.status==="Emprunté"?<button onClick={()=>markReturned(l)} className="rounded-lg bg-emerald-50 px-3 py-2 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100">Confirmer retour</button>:<span className="text-[10px] font-bold text-slate-400">Rendu</span>}</div>)}</div></section>}

          {tab==="reservations" && <section><div className="mb-6"><h1 className="text-2xl font-bold">Réservations</h1><p className="mt-1 text-sm text-slate-500">Planifiez l’utilisation des équipements partagés.</p></div><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-6"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Film size={22}/></div><h2 className="font-bold">Vidéoprojecteur</h2><p className="mt-1 text-xs text-slate-500">Réservez un créneau pour votre prochaine soirée cinéma.</p><button onClick={()=>{setSelected(items.find(i=>i.category==="Matériel")??null);setModal("reserve");}} className="mt-5 rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white">Réserver le matériel</button></div><div className="rounded-2xl border border-slate-200 bg-white p-6"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><CalendarDays size={22}/></div><h2 className="font-bold">Calendrier familial</h2><p className="mt-1 text-xs text-slate-500">La vue calendrier partagée sera connectée à la base de données dans une prochaine étape.</p><div className="mt-5 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">Aucune réservation persistante pour le moment.</div></div></div></section>}

          {tab==="admin" && <section><div className="mb-6"><h1 className="text-2xl font-bold">Administration</h1><p className="mt-1 text-sm text-slate-500">Les outils de gestion du propriétaire de FamilyStock.</p></div><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-6"><ShieldCheck size={22}/><h2 className="mt-4 font-bold">Espace administrateur</h2><p className="mt-2 text-xs leading-5 text-slate-500">Cette maquette n’intègre pas encore de rôles sécurisés. Le compte administrateur sera protégé lors de la connexion à Supabase.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-6"><Users size={22}/><h2 className="mt-4 font-bold">Membres familiaux</h2><p className="mt-2 text-xs leading-5 text-slate-500">Les invitations, la gestion des comptes et les permissions arriveront avec l’authentification réelle.</p></div></div></section>}
        </div>
      </main>

      {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between"><div><div className="text-lg font-bold">{modal==="borrow"?"Emprunter un objet":modal==="add"?"Ajouter au catalogue":modal==="return"?"Confirmer le retour":"Réserver le matériel"}</div><div className="mt-1 text-xs text-slate-400">FamilyStock · Gestion familiale</div></div><button onClick={()=>setModal(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18}/></button></div>
        {modal==="borrow" && <><div className="mb-4 rounded-xl bg-slate-50 p-4"><div className="text-xs font-bold">{selected?.name}</div><div className="mt-1 text-[10px] text-slate-400">{selected?.detail}</div></div><label className="mb-2 block text-xs font-bold">Nom de l’emprunteur</label><input value={borrower} onChange={e=>setBorrower(e.target.value)} className="mb-4 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-500"/><label className="mb-2 block text-xs font-bold">Date de retour prévue</label><input type="date" value={due} onChange={e=>setDue(e.target.value)} className="mb-5 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none"/><button onClick={confirmBorrow} className="w-full rounded-xl bg-slate-950 py-3 text-xs font-bold text-white">Confirmer l’emprunt</button></>}
        {modal==="add" && <><label className="mb-2 block text-xs font-bold">Nom de l’objet</label><input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Ex. J’aime lire n°430" className="mb-4 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none"/><label className="mb-2 block text-xs font-bold">Catégorie</label><select value={newCategory} onChange={e=>setNewCategory(e.target.value as Category)} className="mb-5 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"><option>Livre</option><option>Jeu</option><option>Matériel</option></select><button onClick={addItem} className="w-full rounded-xl bg-slate-950 py-3 text-xs font-bold text-white">Ajouter l’objet</button></>}
        {modal==="reserve" && <><div className="mb-4 rounded-xl bg-slate-50 p-4 text-xs">{selected?.name??"Vidéoprojecteur"}</div><label className="mb-2 block text-xs font-bold">Réservé par</label><input value={borrower} onChange={e=>setBorrower(e.target.value)} className="mb-4 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"/><label className="mb-2 block text-xs font-bold">Date de réservation</label><input type="date" value={due} onChange={e=>setDue(e.target.value)} className="mb-4 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"/><label className="mb-2 block text-xs font-bold">Motif</label><select className="mb-5 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"><option>Soirée cinéma</option><option>Anniversaire</option><option>Autre</option></select><button onClick={()=>{setModal(null);alert("Réservation de démonstration enregistrée localement. Elle ne sera pas partagée tant que la base de données n’est pas connectée.");}} className="w-full rounded-xl bg-slate-950 py-3 text-xs font-bold text-white">Enregistrer la réservation</button></>}
      </div></div>}
    </div>
  );
}
