import { NextResponse } from "next/server";

type Result = {
  id: string;
  title: string;
  description: string;
  image: string;
  authors?: string;
  year?: string;
  category: "Livre" | "Jeu";
};

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#10;/g, " ")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim().slice(0, 120);
  const type = searchParams.get("type") || "book";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    if (type === "game") {
      const url = `https://boardgamegeek.com/xmlapi2/search?type=boardgame,boardgameexpansion&query=${encodeURIComponent(q)}`;
      const response = await fetch(url, {
        headers: { "User-Agent": "FamilyStock/1.0" },
        next: { revalidate: 3600 },
      });
      if (!response.ok) {
        throw new Error("Recherche de jeux momentanément indisponible.");
      }

      const xml = await response.text();
      const entries = [...xml.matchAll(/<item\b([^>]*)>([\s\S]*?)<\/item>/g)].slice(0, 12);
      const results: Result[] = entries
        .map((entry) => {
          const id = entry[1].match(/\bid="(\d+)"/)?.[1] || "";
          const body = entry[2];
          const name = body.match(/<name\b(?=[^>]*type="primary")[^>]*value="([^"]+)"/);
          const year = body.match(/<yearpublished\s+value="(\d+)"/);
          return {
            id: "bgg-" + id,
            title: decodeXml(name?.[1] || "Jeu sans titre"),
            description: year?.[1] ? "Jeu de société publié en " + year[1] : "Jeu de société",
            image: "",
            year: year?.[1],
            category: "Jeu" as const,
          };
        })
        .filter((result) => result.id !== "bgg-");

      return NextResponse.json({ results });
    }

    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=12&langRestrict=fr&printType=books`;
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) {
      throw new Error("Recherche de livres momentanément indisponible.");
    }

    const data = await response.json();
    const results: Result[] = (data.items || []).map((item: any) => {
      const info = item.volumeInfo || {};
      return {
        id: "gb-" + item.id,
        title: info.title || "Livre sans titre",
        description: info.description || "Aucune description fournie par la source.",
        image: (info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || "").replace("http://", "https://"),
        authors: (info.authors || []).join(", "),
        year: info.publishedDate?.slice(0, 4),
        category: "Livre",
      };
    });

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Une erreur est survenue." },
      { status: 502 },
    );
  }
}
