import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Users,
  FileText,
  DollarSign,
  Settings,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import placeLogo from "@/assets/place-logo.png";

const steps = [
  {
    icon: Sparkles,
    title: "Bem-vinda ao seu novo sistema!",
    description:
      "Este é o painel de gestão da clínica. Aqui você vai encontrar tudo o que precisa para organizar o dia a dia — agendamentos, clientes, financeiro e muito mais.",
    tip: "Navegue pelo menu lateral para acessar cada módulo.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: CalendarDays,
    title: "Agenda",
    description:
      "Visualize e gerencie todos os agendamentos por profissional. Você pode criar, editar, cancelar consultas e bloquear horários com poucos cliques.",
    tip: "Clique duas vezes em um horário vazio para agendar rapidamente.",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    icon: Users,
    title: "Clientes",
    description:
      "Cadastre e gerencie os dados dos seus clientes: contato, endereço, anamneses e histórico completo de atendimentos.",
    tip: "Use os filtros para localizar clientes rapidamente.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: FileText,
    title: "Prontuários",
    description:
      "Registre evoluções clínicas, anamneses e documentos de cada paciente de forma organizada e segura.",
    tip: "Cada registro fica vinculado ao profissional e ao cliente.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: DollarSign,
    title: "Financeiro",
    description:
      "Acompanhe receitas, pagamentos pendentes e relatórios financeiros por profissional e período.",
    tip: "Exporte relatórios em PDF ou Excel para controle externo.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Settings,
    title: "Configurações",
    description:
      "Gerencie profissionais, serviços oferecidos, vínculos entre profissionais e serviços, e modelos de anamnese.",
    tip: "Mantenha os serviços atualizados para agilizar os agendamentos.",
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
];

const WelcomePage = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const step = steps[current];
  const isLast = current === steps.length - 1;
  const Icon = step.icon;

  const finish = () => {
    localStorage.setItem("onboarding_done", "true");
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <img src={placeLogo} alt="Logo" className="h-12 object-contain" />
        </motion.div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-6">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 bg-primary"
                  : i < current
                  ? "w-1.5 bg-primary/40"
                  : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl border bg-card shadow-lg overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="p-8"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${step.bg} mb-5`}>
                <Icon className={`w-7 h-7 ${step.color}`} />
              </div>

              <h2 className="text-xl font-semibold font-display text-foreground mb-3">
                {step.title}
              </h2>

              <p className="text-muted-foreground leading-relaxed mb-4">
                {step.description}
              </p>

              <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Dica:</span>{" "}
                  {step.tip}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <div className="flex items-center justify-between border-t px-8 py-4 bg-muted/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrent((c) => c - 1)}
              disabled={current === 0}
              className="gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Anterior
            </Button>

            <span className="text-xs text-muted-foreground">
              {current + 1} / {steps.length}
            </span>

            {isLast ? (
              <Button size="sm" onClick={finish} className="gap-1">
                Começar <Sparkles className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setCurrent((c) => c + 1)}
                className="gap-1"
              >
                Próximo <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Skip */}
        <div className="text-center mt-4">
          <button
            onClick={finish}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Pular tutorial
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
