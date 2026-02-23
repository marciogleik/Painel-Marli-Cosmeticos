import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { professionals, Professional, Service } from "@/data/clinic";
import Header from "@/components/Header";
import ProfessionalCard from "@/components/ProfessionalCard";
import ServiceSelector from "@/components/ServiceSelector";
import DateTimePicker from "@/components/DateTimePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, ArrowRight, Check, User, Scissors, CalendarDays, UserCircle } from "lucide-react";
import { toast } from "sonner";

type Step = 'professional' | 'service' | 'datetime' | 'client';

const steps: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: 'professional', label: 'Profissional', icon: User },
  { key: 'service', label: 'Serviço', icon: Scissors },
  { key: 'datetime', label: 'Data & Hora', icon: CalendarDays },
  { key: 'client', label: 'Seus Dados', icon: UserCircle },
];

const BookingPage = () => {
  const [step, setStep] = useState<Step>('professional');
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const currentStepIndex = steps.findIndex(s => s.key === step);

  const canAdvance = () => {
    switch (step) {
      case 'professional': return !!selectedProfessional;
      case 'service': return selectedServices.length > 0;
      case 'datetime': return !!selectedDate && !!selectedTime;
      case 'client': return clientName.trim().length > 2 && clientPhone.trim().length > 8;
    }
  };

  const next = () => {
    if (currentStepIndex < steps.length - 1) {
      setStep(steps[currentStepIndex + 1].key);
    }
  };

  const prev = () => {
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1].key);
    }
  };

  const handleToggleService = (service: Service) => {
    setSelectedServices(prev =>
      prev.some(s => s.id === service.id)
        ? prev.filter(s => s.id !== service.id)
        : [...prev, service]
    );
  };

  const handleConfirm = () => {
    toast.success("Agendamento realizado com sucesso!", {
      description: `${selectedProfessional?.name} — ${format(selectedDate!, "dd/MM/yyyy", { locale: ptBR })} às ${selectedTime}`,
    });
    // Reset
    setStep('professional');
    setSelectedProfessional(null);
    setSelectedServices([]);
    setSelectedDate(null);
    setSelectedTime(null);
    setClientName('');
    setClientPhone('');
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto max-w-2xl px-4 py-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={cn_step(i, currentStepIndex)}>
                  {i < currentStepIndex ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <s.icon className="w-4 h-4" />
                  )}
                </div>
                <span className="text-[10px] mt-1.5 text-muted-foreground font-medium hidden sm:block">
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-px w-8 sm:w-16 mx-1 sm:mx-2 transition-colors ${i < currentStepIndex ? 'bg-gold' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 'professional' && (
              <div>
                <h2 className="text-2xl font-display font-bold mb-1">Escolha a profissional</h2>
                <p className="text-muted-foreground text-sm mb-6">Selecione quem irá atendê-la</p>
                <div className="grid gap-3">
                  {professionals.map(p => (
                    <ProfessionalCard
                      key={p.id}
                      professional={p}
                      selected={selectedProfessional?.id === p.id}
                      onClick={(p) => { setSelectedProfessional(p); setSelectedServices([]); }}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 'service' && selectedProfessional && (
              <div>
                <h2 className="text-2xl font-display font-bold mb-1">Escolha o serviço</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Serviços de <span className="text-gold font-medium">{selectedProfessional.name}</span>
                </p>
                <ServiceSelector
                  services={selectedProfessional.services}
                  selectedServices={selectedServices}
                  onToggle={handleToggleService}
                />
                {selectedServices.length > 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-gold-muted flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {selectedServices.length} serviço(s) • {totalDuration} min
                    </span>
                    <span className="font-bold text-gold">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            {step === 'datetime' && (
              <div>
                <h2 className="text-2xl font-display font-bold mb-1">Escolha data e horário</h2>
                <p className="text-muted-foreground text-sm mb-6">Selecione quando deseja ser atendida</p>
                <DateTimePicker
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSelectDate={setSelectedDate}
                  onSelectTime={setSelectedTime}
                />
              </div>
            )}

            {step === 'client' && (
              <div>
                <h2 className="text-2xl font-display font-bold mb-1">Seus dados</h2>
                <p className="text-muted-foreground text-sm mb-6">Informe seus dados para confirmar</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Nome completo</label>
                    <Input
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      placeholder="Seu nome"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">WhatsApp</label>
                    <Input
                      value={clientPhone}
                      onChange={e => setClientPhone(e.target.value)}
                      placeholder="(66) 99999-9999"
                      className="h-12"
                    />
                  </div>

                  {/* Summary */}
                  <div className="p-4 rounded-lg border border-gold/30 bg-gold-muted space-y-2 mt-6">
                    <h4 className="font-display font-bold text-foreground">Resumo do agendamento</h4>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>👩‍⚕️ {selectedProfessional?.name}</p>
                      {selectedServices.map(s => <p key={s.id}>✨ {s.name}</p>)}
                      <p>📅 {selectedDate && format(selectedDate, "dd/MM/yyyy", { locale: ptBR })} às {selectedTime}</p>
                      <p className="font-bold text-gold text-base pt-1">Total: R$ {totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={prev}
            disabled={currentStepIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>

          {step === 'client' ? (
            <Button
              variant="gold"
              size="lg"
              disabled={!canAdvance()}
              onClick={handleConfirm}
              className="gap-2"
            >
              <Check className="w-4 h-4" /> Confirmar Agendamento
            </Button>
          ) : (
            <Button
              variant="gold"
              onClick={next}
              disabled={!canAdvance()}
              className="gap-2"
            >
              Próximo <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

const cn_step = (index: number, current: number) => {
  const base = "w-9 h-9 rounded-full flex items-center justify-center transition-all";
  if (index < current) return `${base} gold-gradient text-primary`;
  if (index === current) return `${base} border-2 border-gold text-gold`;
  return `${base} border-2 border-border text-muted-foreground`;
};

export default BookingPage;
