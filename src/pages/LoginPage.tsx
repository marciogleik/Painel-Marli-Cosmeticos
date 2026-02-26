import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, User, Lock } from "lucide-react";
import marbleBg from "@/assets/marble-bg.jpg";
import marliLogo from "@/assets/marli-login-logo.png";
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
      className="min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-black"
      style={{
        backgroundImage: `url(${marbleBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Logo */}
      <img
        src={marliLogo}
        alt="Marli Cosméticos"
        className="w-64 h-auto mb-6"
        style={{
          maskImage: "radial-gradient(circle, black 40%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle, black 40%, transparent 70%)",
        }}
      />

      {/* Form */}
      <div className="w-full max-w-md">
        {forgotMode ? (
          forgotSent ? (
            <div className="w-full space-y-4 text-center">
              <p className="text-sm text-[#c9a55a]/80">
                Um e-mail com o link de recuperação foi enviado para{" "}
                <strong className="text-[#c9a55a]">{forgotEmail}</strong>. Verifique sua caixa de entrada.
              </p>
              <button
                onClick={() => { setForgotMode(false); setForgotSent(false); }}
                className="w-full py-3 rounded-md border border-[#c9a55a]/40 text-[#c9a55a] hover:bg-[#c9a55a]/10 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar ao Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="w-full space-y-5">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9a55a]/60" />
                <input
                  type="email"
                  placeholder="Email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-md bg-black/50 border border-[#c9a55a]/30 text-[#c9a55a] placeholder:text-[#c9a55a]/40 focus:outline-none focus:border-[#c9a55a]/70 transition-colors"
                />
              </div>
              {forgotError && <p className="text-sm text-red-400">{forgotError}</p>}
              <button
                type="submit"
                disabled={forgotSubmitting}
                className="w-full py-3.5 rounded-md font-semibold text-black tracking-wide transition-all disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #c9a55a 0%, #e8d5a0 50%, #c9a55a 100%)",
                }}
              >
                {forgotSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Enviar Link de Recuperação"}
              </button>
              <button
                type="button"
                onClick={() => setForgotMode(false)}
                className="w-full text-sm text-[#c9a55a]/60 hover:text-[#c9a55a] transition-colors flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Voltar ao Login
              </button>
            </form>
          )
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9a55a]/60" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-md bg-black/50 border border-[#c9a55a]/30 text-[#c9a55a] placeholder:text-[#c9a55a]/40 focus:outline-none focus:border-[#c9a55a]/70 transition-colors"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9a55a]/60" />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-md bg-black/50 border border-[#c9a55a]/30 text-[#c9a55a] placeholder:text-[#c9a55a]/40 focus:outline-none focus:border-[#c9a55a]/70 transition-colors"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-md font-semibold text-black tracking-wide transition-all disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #c9a55a 0%, #e8d5a0 50%, #c9a55a 100%)",
              }}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Entrar"}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => { setForgotMode(true); setForgotEmail(email); }}
                className="text-sm text-[#c9a55a]/60 hover:text-[#c9a55a] transition-colors"
              >
                Esqueceu sua senha?
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Powered by */}
      <div className="absolute bottom-4 flex items-center gap-3">
        <span className="text-base font-medium text-[#c9a55a]/40">powered by</span>
        <img src={placeLogo} alt="Place" className="h-10 opacity-40" />
      </div>
    </div>
  );
};

export default LoginPage;
