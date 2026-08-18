"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ZoomImage from "@/components/ZoomImage";

type Img = { id: string; title: string; category: string; url: string };

export default function GalleryGrid({ images }: { images: Img[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(images.map((i) => i.category)))],
    [images]
  );
  const [active, setActive] = useState("All");

  // Honour a ?category=… deep link (e.g. from the homepage highlight tiles).
  const searchParams = useSearchParams();
  const wanted = searchParams.get("category");
  useEffect(() => {
    if (wanted && categories.includes(wanted)) setActive(wanted);
    else setActive("All");
  }, [wanted, categories]);
  const shown = active === "All" ? images : images.filter((i) => i.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              active === cat ? "bg-ink text-cream" : "border border-ink/15 text-ink/70 hover:border-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {shown.map((g) => (
          <figure key={g.id} className="group relative break-inside-avoid overflow-hidden rounded-2xl">
            <ZoomImage src={g.url} alt={g.title} wrapperClassName="block" imgClassName="w-full object-cover" />
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink-950/85 to-transparent p-4 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
              <span className="text-xs font-semibold uppercase tracking-wide text-gold-light">{g.category}</span>
              <p className="text-sm font-semibold text-cream">{g.title}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
