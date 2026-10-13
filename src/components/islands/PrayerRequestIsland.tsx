import { lazy, Suspense, useEffect, useState } from "react";

// O modal (Radix Dialog + formulário) só é baixado no primeiro clique.
const PrayerRequestDialog = lazy(() => import("./PrayerRequestDialog"));

/**
 * Escuta cliques em qualquer elemento com [data-prayer-open] e abre o modal.
 * Sem JS, esses elementos são links normais para /pedido-de-oracao.
 */
export default function PrayerRequestIsland() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest("[data-prayer-open]");
      if (!target || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      setMounted(true);
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <PrayerRequestDialog open={open} onOpenChange={setOpen} />
    </Suspense>
  );
}
