import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import placeLogo from "@/assets/place-logo.png";
import marliLogo from "@/assets/marli-logo.jpg";

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden">
      <img
        src={marliLogo}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] opacity-[0.08]"
      />
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-2">
            <span className="text-primary-foreground text-lg font-bold font-display">M</span>
          </div>
          <CardTitle className="text-xl">Marli Cosméticos</CardTitle>
          <CardDescription>
            {forgotMode ? "Recuperação de senha" : "Entre com suas credenciais"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {forgotMode ? (
            forgotSent ? (
              <div className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Um e-mail com o link de recuperação foi enviado para <strong>{forgotEmail}</strong>. Verifique sua caixa de entrada.
                </p>
                <Button variant="outline" className="w-full" onClick={() => { setForgotMode(false); setForgotSent(false); }}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgotEmail">E-mail</Label>
                  <Input
                    id="forgotEmail"
                    type="email"
                    placeholder="seu@email.com"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                {forgotError && <p className="text-sm text-destructive">{forgotError}</p>}
                <Button type="submit" className="w-full" disabled={forgotSubmitting}>
                  {forgotSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Enviar Link de Recuperação
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setForgotMode(false)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Login
                </Button>
              </form>
            )
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <button
                    type="button"
                    onClick={() => { setForgotMode(true); setForgotEmail(email); }}
                    className="text-xs text-primary hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Entrar
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
      <div className="absolute bottom-8 flex items-center gap-3">
        <span className="text-base font-medium text-muted-foreground">powered by</span>
        <img src={placeLogo} alt="Place" className="h-12" />
      </div>
    </div>
  );
};

export default LoginPage;
