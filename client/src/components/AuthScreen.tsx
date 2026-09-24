import { FormEvent, useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setLoading(true);
    const result = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (result.error) {
      toast.error("Não foi possível entrar", { description: result.error.message });
      return;
    }

    if (isSignUp && !result.data.session) {
      toast.success("Cadastro criado", { description: "Confira seu e-mail para confirmar a conta." });
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <div className="auth-brand">S<span>6</span></div>
          <p className="eyebrow">CONFIGURAÇÃO NECESSÁRIA</p>
          <h1>Conecte o banco da ficha</h1>
          <p className="auth-copy">Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nas variáveis da Vercel para ativar login e salvamento online.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-brand">S<span>6</span></div>
        <p className="eyebrow">SOM DAS SEIS / FICHA DIGITAL</p>
        <h1>{isSignUp ? "Criar sua ficha" : "Entrar na mesa"}</h1>
        <p className="auth-copy">Cada conta mantém sua ficha salva e acessível em qualquer dispositivo.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label><span>E-mail</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>
          <label><span>Senha</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required autoComplete={isSignUp ? "new-password" : "current-password"} /></label>
          <button className="auth-submit" disabled={loading}>{isSignUp ? <UserPlus size={16} /> : <LogIn size={16} />}{loading ? "Aguarde..." : isSignUp ? "Criar conta" : "Entrar"}</button>
        </form>
        <button className="auth-switch" onClick={() => setIsSignUp((current) => !current)}>{isSignUp ? "Já tenho uma conta" : "Ainda não tenho conta"}</button>
      </section>
    </main>
  );
}
