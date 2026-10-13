/**
 * Abre o modal de pedido de oração sem carregar React em todas as páginas.
 * O React, o Radix Dialog e o formulário só são baixados no primeiro clique em [data-prayer-open].
 * Sem JavaScript, esses elementos continuam sendo links para /pedido-de-oracao.
 */
import { useEffect, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import PrayerRequestDialog from "@/components/islands/PrayerRequestDialog";

let raiz: Root | null = null;
let abrir: ((v: boolean) => void) | null = null;

function Host() {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    abrir = setOpen;
  }, []);
  return <PrayerRequestDialog open={open} onOpenChange={setOpen} />;
}

export function abrirPedidoDeOracao() {
  if (raiz) {
    abrir?.(true);
    return;
  }
  const el = document.createElement("div");
  document.body.appendChild(el);
  raiz = createRoot(el);
  raiz.render(<Host />);
}
