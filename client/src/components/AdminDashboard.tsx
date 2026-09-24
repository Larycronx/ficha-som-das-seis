import { useEffect, useState } from "react";
import { LogOut, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type SheetRecord = {
  id: string;
  updated_at: string;
  data: Record<string, any>;
  owner_email: string;
};

const attributes = [
  ["Físico", "fis_score"], ["Agilidade", "agi_score"], ["Intelecto", "int_score"], ["Coragem", "cor_score"],
];
const skills = [
  ["Combate", "combate_score"], ["Negócios", "negocios_score"], ["Montaria", "montaria_score"], ["Tradição", "tradicao_score"],
  ["Labuta", "labuta_score"], ["Exploração", "exploracao_score"], ["Roubo", "roubo_score"], ["Medicina", "medicina_score"],
];

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
      {selected ? <VisualSheet sheet={selected} onClose={() => setSelected(null)} /> : null}
    </main>
  );
}

function VisualSheet({ sheet, onClose }: { sheet: SheetRecord; onClose: () => void }) {
  const data = sheet.data;
  return <section className="admin-detail visual-sheet">
    <div className="admin-detail-header"><div><p className="eyebrow">FICHA SELECIONADA</p><h2>{data.characterName || "Personagem sem nome"}</h2><span>{sheet.owner_email}</span></div><button className="admin-button" onClick={onClose}>voltar para fichas</button></div>
    <div className="visual-sheet-grid">
      <div className="visual-sheet-portrait">{data.photo ? <img src={data.photo} alt="Retrato da personagem" /> : <span>SEM RETRATO</span>}</div>
      <div className="visual-sheet-identity"><p><b>Jogador:</b> {data.player || "não informado"}</p><p><b>Conceito:</b> {data.concept || "não informado"}</p><p><b>Antecedente:</b> {data.background || "não informado"}</p><p><b>Nível:</b> {data.Nivel || 1}</p></div>
    </div>
    <div className="visual-section"><h3>Atributos</h3><div className="visual-values">{attributes.map(([label, key]) => <span key={key}><b>{label}</b>{data[key] ?? 0} / 5</span>)}</div></div>
    <div className="visual-section"><h3>Habilidades</h3><div className="visual-values">{skills.map(([label, key]) => <span key={key}><b>{label}</b>{data[key] ?? 0} / 5</span>)}</div></div>
    <div className="visual-section visual-columns"><div><h3>Recursos</h3><p>Vida: {data.Vida ?? 0}</p><p>Defesa: {data.Defesa ?? 5}</p><p>Dinheiro: U$ {data.dinheiro ?? 0}</p><p>Reputação: {data.Reputacao || "não informada"}</p></div><div><h3>Montaria</h3><p>Nome: {data.nome_cavalo || "sem montaria"}</p><p>Fidelidade: {data.fidelidade_cavalo ?? 0}</p></div></div>
    <div className="visual-section"><h3>Notas</h3><p className="visual-notes">{data.notas_campo || "Nenhuma nota registrada."}</p></div>
  </section>;
}
