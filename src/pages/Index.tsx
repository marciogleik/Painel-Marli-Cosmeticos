import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Phone, Instagram, Star, Clock, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-dark">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent" />
        </div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 mb-6">
              <Star className="w-3 h-3 text-gold" />
              <span className="text-xs text-gold font-medium tracking-wider uppercase">Prime Estética</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-surface-dark-foreground leading-tight">
              Marli
              <span className="gold-text-gradient"> Cosméticos</span>
            </h1>
            <p className="mt-4 text-lg text-surface-dark-foreground/60 max-w-md font-light leading-relaxed">
              Cuidado profissional, carinhoso e atencioso para realçar a sua beleza natural.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/agendar">
                <Button variant="gold" size="xl" className="gap-2">
                  <Calendar className="w-5 h-5" /> Agendar Horário
                </Button>
              </Link>
              <a href="https://wa.me/5566996342599" target="_blank" rel="noopener noreferrer">
                <Button variant="hero" size="xl" className="gap-2">
                  <Phone className="w-5 h-5" /> WhatsApp
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-surface-warm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Agendamento Online",
                description: "Escolha sua profissional, serviço e horário de forma prática e rápida.",
              },
              {
                icon: Clock,
                title: "Lembretes Automáticos",
                description: "Confirmação 24h antes e lembrete 30 min antes do seu horário.",
              },
              {
                icon: Shield,
                title: "Atendimento Seguro",
                description: "Ficha de anamnese digital e histórico completo do seu tratamento.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-display font-bold mb-6">Visite-nos</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                Avenida Planalto, nº 399 – Centro
              </p>
              <p className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                (66) 99634-2599
              </p>
              <a href="https://instagram.com/marlicosmeticos" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 hover:text-gold transition-colors">
                <Instagram className="w-4 h-4 text-gold" />
                @marlicosmeticos
              </a>
            </div>
            <div className="mt-8">
              <Link to="/agendar">
                <Button variant="gold" size="lg" className="gap-2">
                  <Calendar className="w-4 h-4" /> Agende Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-dark py-8 border-t border-gold/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-surface-dark-foreground/40">
            © 2026 Marli Cosméticos Prime Estética. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
