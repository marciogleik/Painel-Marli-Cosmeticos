import { motion, AnimatePresence } from "framer-motion";
import { Service } from "@/data/clinic";
import { cn } from "@/lib/utils";
import { Clock, AlertTriangle, Check } from "lucide-react";

interface ServiceSelectorProps {
  services: Service[];
  selectedServices: Service[];
  onToggle: (service: Service) => void;
}

const ServiceSelector = ({ services, selectedServices, onToggle }: ServiceSelectorProps) => {
  const categories = [...new Set(services.map(s => s.category))];
  const isSelected = (s: Service) => selectedServices.some(sel => sel.id === s.id);

  return (
    <div className="space-y-6">
      {categories.map(category => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {category}
          </h3>
          <div className="space-y-2">
            {services.filter(s => s.category === category).map(service => (
              <motion.button
                key={service.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onToggle(service)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 text-left",
                  isSelected(service)
                    ? "border-gold bg-gold-muted"
                    : "border-border bg-card hover:border-gold/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    isSelected(service) ? "border-gold bg-gold" : "border-muted-foreground/30"
                  )}>
                    {isSelected(service) && <Check className="w-3.5 h-3.5 text-primary" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{service.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" /> {service.duration} min
                      </span>
                      {service.requiresEvaluation && (
                        <span className="flex items-center gap-1 text-xs text-amber-600">
                          <AlertTriangle className="w-3 h-3" /> Requer avaliação
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="font-semibold text-gold whitespace-nowrap">
                  R$ {service.price.toFixed(2)}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceSelector;
