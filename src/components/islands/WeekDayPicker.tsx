import { ChevronLeft, ChevronRight } from "lucide-react";
import { offsetDate, formatShortDate } from "@/lib/dateUtils";

interface Props {
  currentDate: string;
  todayStr: string;
  onDateChange: (date: string) => void;
}

export default function WeekDayPicker({ currentDate, todayStr, onDateChange }: Props) {
  const isToday = currentDate === todayStr;
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = offsetDate(currentDate, i - 3);
    return { date: d, ...formatShortDate(d), isToday: d === todayStr, isSelected: d === currentDate };
  });

  return (
    <div className="mb-8">
      <div className="flex items-center gap-0.5 overflow-hidden">
        <button type="button" aria-label="Dia anterior" onClick={() => onDateChange(offsetDate(currentDate, -1))} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-co-warm-brown/75 hover:text-co-warm-terracotta">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-1 justify-center gap-0.5 overflow-hidden md:gap-2">
          {days.map((d) => (
            <button
              key={d.date}
              type="button"
              aria-pressed={d.isSelected}
              aria-label={d.date}
              onClick={() => onDateChange(d.date)}
              className={`flex min-w-0 flex-1 flex-col items-center rounded-xl px-1.5 py-2 transition-all md:min-w-[3.5rem] md:px-4 md:py-3 ${
                d.isSelected
                  ? "bg-co-warm-terracotta text-co-warm-sand shadow-md"
                  : d.isToday
                    ? "bg-co-warm-terracotta/10 text-co-warm-terracotta hover:bg-co-warm-terracotta/20"
                    : "text-co-warm-brown/80 hover:bg-co-warm-sand-dark/50"
              }`}
            >
              <span className="text-[10px] font-medium uppercase md:text-xs">{d.weekday}</span>
              <span className="text-lg font-bold leading-tight md:text-xl">{d.day}</span>
            </button>
          ))}
        </div>
        <button type="button" aria-label="Próximo dia" onClick={() => onDateChange(offsetDate(currentDate, 1))} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-co-warm-brown/75 hover:text-co-warm-terracotta">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      {!isToday && (
        <div className="mt-2 flex justify-center">
          <button type="button" onClick={() => onDateChange(todayStr)} className="text-xs font-medium text-co-warm-terracotta hover:underline">
            Voltar para hoje
          </button>
        </div>
      )}
    </div>
  );
}
