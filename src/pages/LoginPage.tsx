import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, User, Lock } from "lucide-react";
import luxuryBg from "@/assets/luxury_marble_bg.png";
import marliLogo from "@/assets/marli_logo_premium.png";
import placeLogo from "@/assets/place-logo.png";

const LoginPage = () => {
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSubmitting, setForgotSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-[#c9a55a]" />
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError("E-mail ou senha incorretos.");
    }
    setSubmitting(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setForgotError("Erro ao enviar o e-mail. Verifique o endereço.");
    } else {
      setForgotSent(true);
    }
    setForgotSubmitting(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${luxuryBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 40px rgba(0,0,0,0.8) inset !important;
          -webkit-text-fill-color: white !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* Container with Glassmorphism */}
      <div className="w-full max-w-md flex flex-col items-center backdrop-blur-xl bg-black/40 p-10 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Animated accent glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#c9a55a]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#c9a55a]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo with screen blending to remove black background */}
        <img
          src={marliLogo}
          alt="Marli Cosméticos"
          className="w-48 h-auto mb-10 mix-blend-screen drop-shadow-[0_0_15px_rgba(201,165,90,0.2)]"
        />

        {/* Form Group */}
        <div className="w-full relative z-10 transition-all duration-500">
          {forgotMode ? (
            forgotSent ? (
              <div className="w-full space-y-4 text-center animate-in fade-in zoom-in duration-300">
                <p className="text-sm text-[#c9a55a]/80 leading-relaxed">
                  Um e-mail com o link de recuperação foi enviado para{" "}
                  <strong className="text-[#c9a55a]">{forgotEmail}</strong>. Verifique sua caixa de entrada.
                </p>
                <button
                  onClick={() => { setForgotMode(false); setForgotSent(false); }}
                  className="w-full py-3 mt-4 rounded-xl border border-[#c9a55a]/40 text-[#c9a55a] hover:bg-[#c9a55a]/10 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar ao Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="w-full space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9a55a]/60" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a55a]/70 transition-all focus:bg-black/50 shadow-inner"
                  />
                </div>
                {forgotError && <p className="text-sm text-red-400">{forgotError}</p>}
                <button
                  type="submit"
                  disabled={forgotSubmitting}
                  className="w-full py-4 rounded-xl font-bold text-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-[#c9a55a]/20"
                  style={{
                    background: "linear-gradient(135deg, #c9a55a 0%, #e8d5a0 50%, #c9a55a 100%)",
                  }}
                >
                  {forgotSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Enviar Link"}
                </button>
                <button
                  type="button"
                  onClick={() => setForgotMode(false)}
                  className="w-full text-sm text-[#c9a55a]/60 hover:text-[#c9a55a] transition-colors flex items-center justify-center gap-1 mt-4"
                >
                  <ArrowLeft className="w-3 h-3" /> Voltar ao Login
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleSubmit} className="w-full space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="space-y-4">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9a55a]/60 group-focus-within:text-[#c9a55a] transition-colors" />
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a55a]/70 transition-all focus:bg-black/50 shadow-inner"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9a55a]/60 group-focus-within:text-[#c9a55a] transition-colors" />
                  <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a55a]/70 transition-all focus:bg-black/50 shadow-inner"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-500 text-center font-medium drop-shadow-sm">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl font-bold text-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-[#c9a55a]/30"
                style={{
                  background: "linear-gradient(135deg, #c9a55a 0%, #e8d5a0 50%, #c9a55a 100%)",
                }}
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Entrar"}
              </button>

              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => { setForgotMode(true); setForgotEmail(email); }}
                  className="text-xs text-[#c9a55a]/70 hover:text-[#c9a55a] uppercase tracking-wider transition-colors font-medium"
                >
                  Esqueceu sua senha?
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Powered by */}
      <div className="mt-8 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-all cursor-default group">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-medium text-white/50 tracking-[0.2em] uppercase group-hover:text-white/70 transition-colors">powered by</span>
          <img src={placeLogo} alt="Place" className="h-7 brightness-110" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
