import { useState } from "react";
import { Heart } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PrayerRequestForm from "./PrayerRequestForm";

export default function PrayerRequestDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [key, setKey] = useState(0);
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setKey((k) => k + 1); // limpa o formulário ao fechar
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto border-co-warm-terracotta/20 bg-co-warm-sand font-dm-sans text-co-warm-brown sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-co-warm-terracotta/10">
            <Heart className="h-6 w-6 text-co-warm-terracotta" />
          </div>
          <DialogTitle className="text-center font-display text-xl text-co-warm-brown">Pedido de Oração</DialogTitle>
          <DialogDescription className="text-center text-sm text-co-warm-brown/80">Compartilhe suas intenções. Rezamos por você todos os dias.</DialogDescription>
        </DialogHeader>
        <PrayerRequestForm key={key} idPrefix="dialog" rows={4} />
      </DialogContent>
    </Dialog>
  );
}
