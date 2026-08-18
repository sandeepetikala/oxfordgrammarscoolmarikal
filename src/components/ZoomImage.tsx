"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Amazon/Flipkart-style image zoom.
 *  - Desktop (hover + fine pointer): resting the mouse on the photo shows a
 *    magnified panel beside it that follows the cursor, plus a lens on the photo.
 *  - Touch devices (no hover): tapping opens the photo full-screen.
 *  - Clicking on desktop also opens the full-screen view.
 */
export default function ZoomImage({
  src,
  alt,
  wrapperClassName = "",
  imgClassName = "",
  zoom = 2.4,
}: {
  src: string;
  alt: string;
  wrapperClassName?: string;
  imgClassName?: string;
  zoom?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [hoverable, setHoverable] = useState(false);
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [p, setP] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    setMounted(true);
    setHoverable(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  // Lock page scroll + allow Esc to close while the full-screen view is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect(r);
    setP({
      x: Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1),
      y: Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1),
    });
  }, []);

  const PANEL_W = 420;
  let panelStyle: React.CSSProperties = {};
  let lensStyle: React.CSSProperties = {};
  if (active && rect) {
    const panelH = Math.round(PANEL_W * (rect.height / rect.width));
    const fitsRight = window.innerWidth - rect.right > PANEL_W + 24;
    const left = fitsRight ? rect.right + 16 : Math.max(8, rect.left - PANEL_W - 16);
    const top = Math.min(Math.max(8, rect.top), window.innerHeight - panelH - 8);
    panelStyle = {
      left,
      top,
      width: PANEL_W,
      height: panelH,
      backgroundImage: `url("${src}")`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `${zoom * 100}%`,
      backgroundPosition: `${p.x * 100}% ${p.y * 100}%`,
    };
    const lensW = rect.width / zoom;
    const lensH = rect.height / zoom;
    lensStyle = {
      width: lensW,
      height: lensH,
      left: p.x * (rect.width - lensW),
      top: p.y * (rect.height - lensH),
    };
  }

  return (
    <>
      <div
        ref={ref}
        className={`relative cursor-zoom-in ${wrapperClassName}`}
        onMouseEnter={hoverable ? () => setActive(true) : undefined}
        onMouseLeave={hoverable ? () => setActive(false) : undefined}
        onMouseMove={hoverable ? onMove : undefined}
        onClick={() => setOpen(true)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className={imgClassName} />
        {active && rect && (
          <span
            className="pointer-events-none absolute z-20 rounded-sm border border-white/80 bg-white/25 shadow-[0_0_0_9999px_rgba(0,0,0,0.15)]"
            style={lensStyle}
          />
        )}
      </div>

      {mounted && active && rect &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[100] hidden overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-2xl md:block"
            style={panelStyle}
          />,
          document.body
        )}

      {mounted && open &&
        createPortal(
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="max-h-[92vh] max-w-[95vw] rounded-lg object-contain" />
            <button
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-2xl text-white backdrop-blur transition hover:bg-white/25"
              aria-label="Close"
            >
              ×
            </button>
          </div>,
          document.body
        )}
    </>
  );
}
