"use client";

import { useState } from "react";
import Link from "next/link";
import { Archive, CheckCircle2, Clock3, UserRoundPlus } from "lucide-react";

type Request = { id: string; firstName: string; lastName: string; email: string; photo: string; status: "pending" | "approved" | "rejected"; accessCode?: string; createdAt: string };

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const requests: Request[] = JSON.parse(localStorage.getItem("familystock_requests") || "[]");
    requests.push({ id: crypto.randomUUID(), firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), photo, status: "pending", createdAt: new Date().toISOString() });
    localStorage.setItem("familystock_requests", JSON.stringify(requests));
    setSent(true);
  }

  function handlePhoto(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Choisis un fichier image."); return; }
    if (file.size > 2 * 1024 * 1024) { setError("La photo doit faire moins de 2 Mo."); return; }
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#f6f7fb] px-4 py-10">
    <div className="w-full max-w-lg">
      <Link href="/" className="mb-8 flex items-center justify-center gap-3 text-slate-900"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white"><Archive size={21}/></span><span className="text-xl font-bold">FamilyStock</span></Link>
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9">
        {sent ? <div className="py-5 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><Clock3 size={27}/></span><h1 className="mt-5 text-2xl font-bold text-slate-950">Demande envoyée !</h1><p className="mt-3 text-sm leading-6 text-slate-500">Ta demande d’accès à FamilyStock est en attente de validation par l’administrateur. Tu pourras accéder à l’espace familial uniquement si ta demande est acceptée.</p><Link href="/" className="mt-7 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Retour à l’accueil</Link></div> : <>
          <div className="mb-7"><div className="text-xs font-bold uppercase tracking-[.16em] text-blue-700">Accès familial</div><h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Demander un accès</h1><p className="mt-2 text-sm leading-6 text-slate-500">Complète ces quelques informations. L’administrateur examinera ta demande avant de t’autoriser à rejoindre FamilyStock.</p></div>
          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-semibold text-slate-700">Prénom *<input required maxLength={50} value={firstName} onChange={e=>setFirstName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-500" placeholder="Ton prénom"/></label><label className="block text-xs font-semibold text-slate-700">Nom *<input required maxLength={60} value={lastName} onChange={e=>setLastName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-500" placeholder="Ton nom"/></label></div>
            <label className="block text-xs font-semibold text-slate-700">Adresse email <span className="font-normal text-slate-400">(facultatif)</span><input type="email" maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-500" placeholder="nom@exemple.fr"/></label>
            <div><label className="block text-xs font-semibold text-slate-700">Photo de profil <span className="font-normal text-slate-400">(facultative)</span></label><div className="mt-2 flex items-center gap-4">{photo ? <img src={photo} alt="Aperçu du profil" className="h-14 w-14 rounded-full object-cover"/> : <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400"><UserRoundPlus size={22}/></div>}<label className="cursor-pointer rounded-xl border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50">Choisir une photo<input type="file" accept="image/*" className="hidden" onChange={e=>handlePhoto(e.target.files?.[0])}/></label>{photo && <button type="button" onClick={()=>setPhoto("")} className="text-xs text-slate-500 underline">Retirer</button>}</div><p className="mt-2 text-[11px] text-slate-400">Image facultative, 2 Mo maximum.</p></div>
            {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
            <button type="submit" className="w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800">Envoyer ma demande</button>
          </form>
          <p className="mt-5 text-center text-[11px] leading-5 text-slate-400">L’envoi d’une demande ne donne pas automatiquement accès au site.</p>
        </>}
      </section>
      <p className="mt-5 text-center text-xs text-slate-400">Déjà autorisé ? <Link href="/" className="font-semibold text-slate-700 underline">Retourner à FamilyStock</Link></p>
    </div>
  </main>;
}
