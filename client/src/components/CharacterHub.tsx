import { useEffect, useState } from "react";
import { LogOut, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type CharacterRecord = {
  id: string;
  data: { characterName?: string; concept?: string; photo?: string };
  updated_at: string;
};

const MAX_SHEETS = 5;

export default function CharacterHub({ user, onSelect, onSignOut }: { user: User; onSelect: (id: string) => void; onSignOut: () => void }) {
  const [sheets, setSheets] = useState<CharacterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function loadSheets() {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from("character_sheets").select("id, data, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível carregar suas fichas", { description: error.message });
      return;
    }
    setSheets((data ?? []) as CharacterRecord[]);
  }

  useEffect(() => { void loadSheets(); }, [user.id]);

  async function createSheet() {
    if (!supabase || creating || sheets.length >= MAX_SHEETS) return;
    setCreating(true);
    const { data, error } = await supabase.from("character_sheets").insert({ user_id: user.id, data: {} }).select("id").single();
    setCreating(false);
    if (error) {
      const description = error.code === "23505" && error.message.includes("character_sheets_user_id_key")
        ? "A migration de múltiplas fichas ainda não foi aplicada no Supabase."
        : error.message;
      toast.error("Não foi possível criar a ficha", { description });
      return;
    }
    onSelect(data.id);
  }

  async function deleteSheet(sheet: CharacterRecord) {
    if (!supabase || !window.confirm(`Excluir ${sheet.data?.characterName || "esta ficha"}?`)) return;
    const { error } = await supabase.from("character_sheets").delete().eq("id", sheet.id).eq("user_id", user.id);
    if (error) {
      toast.error("Não foi possível excluir a ficha", { description: error.message });
      return;
    }
    setSheets((current) => current.filter((item) => item.id !== sheet.id));
    toast.success("Ficha excluída");
  }

  return (
    <main className="hub-shell">
      <header className="hub-header">
        <div>
          <div className="wanted-kicker">✦ FRONTEIRA / REGISTRO DE VIAJANTES ✦</div>
          <p className="eyebrow">SOM DAS SEIS / SALOON</p>
          <h1>Olá, {user.email?.split("@")[0] || "viajante"}.</h1>
          <p>Escolha uma ficha para voltar à estrada ou crie uma nova personagem.</p>
        </div>
        <button className="hub-signout" onClick={onSignOut}><LogOut size={15} /> sair</button>
      </header>
      <section className="hub-toolbar"><div><span className="eyebrow">SEU ARQUIVO</span><strong>{sheets.length} / {MAX_SHEETS} fichas</strong></div><button className="hub-create" onClick={() => void createSheet()} disabled={creating || sheets.length >= MAX_SHEETS}><Plus size={17} /> {creating ? "criando..." : "nova ficha"}</button></section>
      {loading ? <p className="hub-empty">Abrindo o arquivo...</p> : sheets.length === 0 ? <section className="hub-empty"><Search size={26} /><h2>Nenhuma ficha encontrada</h2><p>Crie sua primeira personagem para começar a campanha.</p><button className="hub-create" onClick={() => void createSheet()} disabled={creating}><Plus size={17} /> {creating ? "criando..." : "criar primeira ficha"}</button></section> : <section className="character-grid">{sheets.map((sheet, index) => <article className="wanted-card" key={sheet.id}><div className="wanted-card-top"><span>PROCURADO</span><small>ARQUIVO {String(index + 1).padStart(2, "0")}</small></div><div className="wanted-portrait">{sheet.data?.photo ? <img src={sheet.data.photo} alt="Retrato da personagem" /> : <Search size={36} />}</div><h2>{sheet.data?.characterName || "Sem nome"}</h2><p>{sheet.data?.concept || "Personagem ainda não definida"}</p><div className="wanted-card-actions"><button className="hub-open" onClick={() => onSelect(sheet.id)}>abrir ficha</button><button className="hub-delete" onClick={() => void deleteSheet(sheet)} title="Excluir ficha"><Trash2 size={15} /></button></div></article>)}</section>}
    </main>
  );
}
