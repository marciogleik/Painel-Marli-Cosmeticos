import { motion } from "framer-motion";
import { Professional } from "@/data/clinic";
import { cn } from "@/lib/utils";

interface ProfessionalCardProps {
  professional: Professional;
  selected?: boolean;
  onClick: (professional: Professional) => void;
}

const ProfessionalCard = ({ professional, selected, onClick }: ProfessionalCardProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(professional)}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200 text-left",
        selected
          ? "border-gold bg-gold-muted shadow-md"
          : "border-border bg-card hover:border-gold/40 hover:shadow-sm"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
        selected ? "gold-gradient text-primary" : "bg-muted text-muted-foreground"
      )}>
        {professional.avatar}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-foreground truncate">{professional.name}</p>
        <p className="text-sm text-muted-foreground">{professional.role}</p>
        <p className="text-xs text-gold mt-1">{professional.services.length} serviço(s)</p>
      </div>
    </motion.button>
  );
};

export default ProfessionalCard;
