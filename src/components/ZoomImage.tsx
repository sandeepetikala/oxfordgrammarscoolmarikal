"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Rest the mouse on a photo (~1.2s) and it opens larger in a centred lightbox.
 * Clicking or tapping opens it immediately (works on touch devices too).
 * Close by clicking the backdrop, the ×, or pressing Esc.
 */
export default function ZoomImage({
  src,
  alt,
  wrapperClassName = "",
  imgClassName = "",
  hoverDelay = 1200,
}: {
  src: string;
  alt: string;
  wrapperClassName?: string;
  imgClassName?: string;
  hoverDelay?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setMounted(true), []);

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

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const startHover = () => {
    clear();
    timer.current = setTimeout(() => setOpen(true), hoverDelay);
  };

  return (
    <>
      <div
        className={`cursor-zoom-in ${wrapperClassName}`}
        onMouseEnter={startHover}
        onMouseLeave={clear}
        onClick={() => {
          clear();
          setOpen(true);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className={imgClassName} />
      </div>

      {mounted && open &&
        createPortal(
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4 sm:p-8"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain shadow-2xl md:max-w-[880px]"
            />
            <button
              onClick={() => setOpen(false)}
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
