import { useEffect, useState } from "react";
import { LogOut, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type SheetRecord = {
  id: string;
  updated_at: string;
  data: { characterName?: string; player?: string };
  owner_email: string;
};

export default function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [sheets, setSheets] = useState<SheetRecord[]>([]);
  const [selected, setSelected] = useState<SheetRecord | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadSheets() {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from("admin_sheet_overview").select("*").order("updated_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível carregar as fichas", { description: error.message });
      return;
    }
    setSheets((data ?? []) as SheetRecord[]);
  }

  useEffect(() => { void loadSheets(); }, []);

  async function deleteSheet(sheet: SheetRecord) {
    if (!supabase || !window.confirm(`Excluir a ficha de ${sheet.data?.characterName || "Personagem sem nome"}?`)) return;
    const { error } = await supabase.from("character_sheets").delete().eq("id", sheet.id);
    if (error) {
      toast.error("Não foi possível excluir a ficha", { description: error.message });
      return;
    }
    setSheets((current) => current.filter((item) => item.id !== sheet.id));
    setSelected((current) => current?.id === sheet.id ? null : current);
    toast.success("Ficha excluída");
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div><p className="eyebrow">SOM DAS SEIS / ADMINISTRAÇÃO</p><h1>Fichas dos jogadores</h1><p>Consulte as fichas salvas pelas pessoas da sua mesa.</p></div>
        <div className="admin-actions"><button className="admin-button" onClick={() => void loadSheets()}><RefreshCw size={15} /> atualizar</button><button className="admin-button" onClick={onSignOut}><LogOut size={15} /> sair</button></div>
      </header>
      <section className="admin-list">
        {loading ? <p className="admin-empty">Carregando fichas...</p> : sheets.length === 0 ? <p className="admin-empty">Nenhuma ficha foi salva ainda.</p> : sheets.map((sheet) => <article className="admin-row" key={sheet.id}><div><strong>{sheet.data?.characterName || "Personagem sem nome"}</strong><span>{sheet.owner_email}</span></div><div className="admin-row-actions"><time>{new Date(sheet.updated_at).toLocaleString("pt-BR")}</time><button className="admin-button" onClick={() => setSelected(sheet)}>abrir ficha</button><button className="admin-button danger-button" onClick={() => void deleteSheet(sheet)}>excluir</button></div></article>)}
      </section>
      {selected ? <section className="admin-detail"><div className="admin-detail-header"><div><p className="eyebrow">FICHA SELECIONADA</p><h2>{selected.data?.characterName || "Personagem sem nome"}</h2><span>{selected.owner_email}</span></div><button className="admin-button" onClick={() => setSelected(null)}>fechar</button></div><pre>{JSON.stringify(selected.data, null, 2)}</pre></section> : null}
    </main>
  );
}
