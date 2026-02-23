import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { generateTimeSlots, TimeSlot } from "@/data/clinic";

interface DateTimePickerProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
}

const DateTimePicker = ({ selectedDate, selectedTime, onSelectDate, onSelectTime }: DateTimePickerProps) => {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const timeSlots = generateTimeSlots();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setWeekStart(addDays(weekStart, -7))}
          className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium text-foreground capitalize">
          {format(weekStart, "MMMM yyyy", { locale: ptBR })}
        </span>
        <button
          onClick={() => setWeekStart(addDays(weekStart, 7))}
          className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const isPast = isBefore(day, today);
          const selected = selectedDate && isSameDay(day, selectedDate);
          return (
            <button
              key={day.toISOString()}
              disabled={isPast}
              onClick={() => onSelectDate(day)}
              className={cn(
                "flex flex-col items-center py-3 rounded-lg transition-all text-center",
                isPast && "opacity-30 cursor-not-allowed",
                selected
                  ? "gold-gradient text-primary shadow-md"
                  : "hover:bg-muted",
                isToday(day) && !selected && "ring-2 ring-gold/40"
              )}
            >
              <span className="text-[10px] uppercase tracking-wider opacity-70">
                {format(day, "EEE", { locale: ptBR })}
              </span>
              <span className="text-lg font-bold mt-1">{format(day, "d")}</span>
            </button>
          );
        })}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-3"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Horários disponíveis — {format(selectedDate, "dd/MM", { locale: ptBR })}
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                disabled={!slot.available}
                onClick={() => onSelectTime(slot.time)}
                className={cn(
                  "py-2.5 px-2 rounded-md text-sm font-medium transition-all",
                  !slot.available && "opacity-20 cursor-not-allowed line-through",
                  selectedTime === slot.time
                    ? "gold-gradient text-primary shadow-md"
                    : slot.available
                    ? "bg-muted hover:bg-gold/10 hover:text-gold"
                    : ""
                )}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DateTimePicker;
