import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import AdminDashboard from "./components/AdminDashboard";
import AuthScreen from "./components/AuthScreen";
import CharacterHub from "./components/CharacterHub";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "larypenha63@gmail.com";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"player" | "admin">("player");
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    let mounted = true;
    void client.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        const { data: profile } = await client.from("profiles").select("role").eq("id", data.session.user.id).maybeSingle();
        if (mounted) setRole(profile?.role === "admin" || data.session.user.email === ADMIN_EMAIL ? "admin" : "player");
      }
      setLoading(false);
    });
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) setRole("player");
      setLoading(false);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  const signOut = () => { void supabase?.auth.signOut(); };

  return (
    // Captura erros inesperados sem derrubar toda a interface.
    <ErrorBoundary>
      {/* Disponibiliza tooltips e notificações para os componentes filhos. */}
      <TooltipProvider>
        <Toaster position="bottom-right" richColors />
        {!isSupabaseConfigured || loading ? <AuthScreen /> : !user ? <AuthScreen /> : role === "admin" ? <AdminDashboard onSignOut={signOut} /> : selectedSheetId ? <Home user={user} sheetId={selectedSheetId} onBack={() => setSelectedSheetId(null)} onSignOut={signOut} /> : <CharacterHub user={user} onSelect={setSelectedSheetId} onSignOut={signOut} />}
      </TooltipProvider>
    </ErrorBoundary>
  );
}
