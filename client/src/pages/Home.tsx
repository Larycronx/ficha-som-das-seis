import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Backpack,
  BookOpen,
  Camera,
  ChevronRight,
  CircleHelp,
  Download,
  Dice5,
  Eye,
  Flame,
  Heart,
  PawPrint,
  Info,
  Lock,
  NotebookPen,
  Plus,
  RotateCcw,
  Save,
  Shield,
  Sparkles,
  Swords,
  Trash2,
  Unlock,
  UserRound,
  WandSparkles,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type TabKey = "personagem" | "equipamentos" | "montaria" | "notas";
type Item = { id: number; nome: string; notas: string; qtd: number };
type Sheet = Record<string, any> & {
  characterName: string;
  player: string;
  concept: string;
  background: string;
  photo: string;
  misc_items: Item[];
  horse_items: Item[];
};
type RollResult = {
  name: string;
  score: number;
  die: number;
  total: number;
  success: boolean;
};

const STORAGE_KEY = "som-das-seis-ficha";
const LOCK_KEY = "som-das-seis-ficha-locked";

// Valores iniciais usados na primeira abertura ou ao restaurar a ficha.
const defaultSheet: Sheet = {
  characterName: "",
  player: "",
  concept: "",
  background: "",
  photo: "",
  fis_score: 0,
  agi_score: 0,
  int_score: 0,
  cor_score: 0,
  Vida: 0,
  Defesa: 5,
  Tormento: "",
  Recompensa: "",
  combate_score: 0,
  negocios_score: 0,
  montaria_score: 0,
  tradicao_score: 0,
  labuta_score: 0,
  exploracao_score: 0,
  roubo_score: 0,
  medicina_score: 0,
  Reputacao: "",
  dinheiro: 0,
  nome_cavalo: "",
  fidelidade_cavalo: 0,
  potencia_score: 0,
  vigor_score: 0,
  vida_cavalo: 0,
  defesa_cavalo: 5,
  dano_cavalo: 6,
  c1v: false,
  c1v_copy1: false,
  c1v_copy1_copy2: false,
  c1v_copy1_copy1: false,
  notas_campo: "",
  iniciativa_score: 0,
  acoes: 1,
  Nivel: 1,
  misc_items: [{ id: 1, nome: "", notas: "", qtd: 1 }],
  horse_items: [{ id: 1, nome: "", notas: "", qtd: 1 }],
};

const tabs: {
  key: TabKey;
  label: string;
  icon: typeof UserRound;
  hint: string;
}[] = [
  {
    key: "personagem",
    label: "Personagem",
    icon: UserRound,
    hint: "Atributos e habilidades",
  },
  {
    key: "equipamentos",
    label: "Equipamentos",
    icon: Backpack,
    hint: "Armas e itens",
  },
  {
    key: "montaria",
    label: "Montaria",
    icon: PawPrint,
    hint: "Companheiro de viagem",
  },
  {
    key: "notas",
    label: "Notas",
    icon: NotebookPen,
    hint: "Anotações da sessão",
  },
];

const attributes = [
  {
    key: "fis_score",
    label: "Físico",
    short: "FIS",
    icon: "◆",
    color: "amber",
    description: "Força, resistência e presença corporal.",
  },
  {
    key: "agi_score",
    label: "Agilidade",
    short: "AGI",
    icon: "↗",
    color: "cyan",
    description: "Reflexos, velocidade e precisão.",
  },
  {
    key: "int_score",
    label: "Intelecto",
    short: "INT",
    icon: "✦",
    color: "violet",
    description: "Raciocínio, percepção e conhecimento.",
  },
  {
    key: "cor_score",
    label: "Coragem",
    short: "COR",
    icon: "✹",
    color: "rose",
    description: "Vontade, ousadia e sangue-frio.",
  },
];

const skills = [
  { key: "combate_score", label: "Combate", icon: Swords },
  { key: "negocios_score", label: "Negócios", icon: Sparkles },
  { key: "montaria_score", label: "Montaria", icon: PawPrint },
  { key: "tradicao_score", label: "Tradição", icon: BookOpen },
  { key: "labuta_score", label: "Labuta", icon: Flame },
  { key: "exploracao_score", label: "Exploração", icon: Eye },
  { key: "roubo_score", label: "Roubo", icon: WandSparkles },
  { key: "medicina_score", label: "Medicina", icon: Heart },
];

const cloneDefault = (): Sheet => JSON.parse(JSON.stringify(defaultSheet));

function readInitialSheet(): Sheet {
  try {
    // Recupera a ficha salva no navegador e completa campos novos com os padrões.
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...cloneDefault(), ...JSON.parse(saved) };
  } catch {
    // Falls back to the authored sheet when local storage is unavailable.
  }
  return cloneDefault();
}

function Label({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <span className="field-label">
      {children}
      {hint ? (
        <span className="field-hint" title={hint}>
          <Info size={12} />
        </span>
      ) : null}
    </span>
  );
}

function TextField({
  label,
  value,
  onChange,
  disabled,
  placeholder = "Preencher",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  placeholder?: string;
}) {
  return (
    <label className="field-wrap">
      <Label>{label}</Label>
      <input
        className="text-input"
        value={value ?? ""}
        onChange={event => onChange(event.target.value)}
        disabled={disabled}
        placeholder={placeholder}
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  disabled,
  min = 0,
  max,
  hint,
  accent = "",
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
  min?: number;
  max?: number;
  hint?: string;
  accent?: string;
}) {
  return (
    <label className={`field-wrap ${accent}`}>
      <Label hint={hint}>{label}</Label>
      <input
        className="number-input"
        type="number"
        value={value ?? 0}
        min={min}
        max={max}
        onChange={event => onChange(Number(event.target.value))}
        disabled={disabled}
      />
    </label>
  );
}

function SectionTitle({
  eyebrow,
  title,
  detail,
  action,
}: {
  eyebrow: string;
  title: string;
  detail?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        {detail ? <p>{detail}</p> : null}
      </div>
      {action}
    </div>
  );
}

function ProgressDots({
  value,
  max = 5,
  color = "cyan",
}: {
  value: number;
  max?: number;
  color?: string;
}) {
  return (
    <div className={`progress-dots ${color}`} aria-label={`${value} de ${max}`}>
      {Array.from({ length: max }, (_, index) => (
        <span key={index} className={index < value ? "active" : ""} />
      ))}
    </div>
  );
}

export default function Home({
  user,
  sheetId,
  onBack,
  onSignOut,
}: {
  user: User;
  sheetId: string;
  onBack: () => void;
  onSignOut: () => void;
}) {
  // Estado principal da ficha e dos controles da tela.
  const [sheet, setSheet] = useState<Sheet>(() => readInitialSheet());
  const [locked, setLocked] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("personagem");
  const [roll, setRoll] = useState<RollResult | null>(null);
  const [lastSaved, setLastSaved] = useState("agora");
  const photoInputRef = useRef<HTMLInputElement>(null);
  const handleBack = () => onBack();

  useEffect(() => {
    let cancelled = false;
    void supabase
      ?.from("character_sheets")
      .select("data")
      .eq("id", sheetId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (data?.data) setSheet({ ...cloneDefault(), ...data.data });
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [sheetId]);

  useEffect(() => {
    if (!loaded || !supabase) return;
    void supabase
      .from("character_sheets")
      .upsert(
        { id: sheetId, user_id: user.id, data: sheet, updated_at: new Date().toISOString() }
      )
      .then(({ error }) => {
        if (error)
          toast.error("Não foi possível salvar a ficha", {
            description: error.message,
          });
        else setLastSaved("agora");
      });
  }, [loaded, sheet, sheetId, user.id]);

  const update = (key: string, value: any) =>
    setSheet(current => ({ ...current, [key]: value }));
  const tab = useMemo(
    () => tabs.find(item => item.key === activeTab) ?? tabs[0],
    [activeTab]
  );

  const doRoll = (label: string, key: string) => {
    // Soma o atributo escolhido a um dado de seis lados e exibe o resultado.
    const score = Number(sheet[key] ?? 0);
    const die = Math.floor(Math.random() * 6) + 1;
    const total = die + score;
    const success = total >= 7;
    setRoll({ name: label, score, die, total, success });
    void supabase?.from("roll_events").insert({
      user_id: user.id,
      character_name: sheet.characterName || "Personagem sem nome",
      roll_name: label,
      score,
      die,
      total,
      success,
    });
  };

  const toggleLock = () => {
    setLocked(current => !current);
    toast.success(
      locked ? "Edição desbloqueada" : "Ficha bloqueada para edição",
      {
        description: locked
          ? "Você pode alterar os campos novamente."
          : "Os campos estão protegidos, mas as rolagens continuam disponíveis.",
      }
    );
  };

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    // Converte a imagem escolhida em Data URL para poder salvá-la localmente.
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
            <button
              className="rail-help"
              onClick={handleBack}
            >
              <ArrowLeft size={15} /> Minhas fichas
            </button>
      update("photo", String(reader.result));
      toast.success("Retrato atualizado");
    };
    reader.readAsDataURL(file);
  };

  const resetSheet = () => {
    if (locked) return;
    setSheet(cloneDefault());
    toast.success("Ficha restaurada", {
      description: "Os valores iniciais da ficha foram recuperados.",
    });
  };

  const exportSheet = () => {
    // Cria um arquivo JSON no navegador sem precisar de um backend.
    const blob = new Blob([JSON.stringify(sheet, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${sheet.characterName || "personagem"}-som-das-seis.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Ficha exportada", {
      description: "Um arquivo JSON foi baixado para o seu dispositivo.",
    });
  };

  const addItem = (target: "misc_items" | "horse_items") => {
    // Adiciona uma linha vazia à lista de itens selecionada.
    if (locked) return;
    const next = [
      ...(sheet[target] || []),
      { id: Date.now(), nome: "", notas: "", qtd: 1 },
    ];
    update(target, next);
  };

  const updateItem = (
    target: "misc_items" | "horse_items",
    id: number,
    field: keyof Item,
    value: string | number
  ) => {
    if (locked) return;
    update(
      target,
      (sheet[target] || []).map((item: Item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeItem = (target: "misc_items" | "horse_items", id: number) => {
    if (locked) return;
    update(
      target,
      (sheet[target] || []).filter((item: Item) => item.id !== id)
    );
  };

  return (
    <div className="app-shell">
      <aside className="left-rail">
        <div className="brand-mark">
          <span>S</span>
          <small>6</small>
        </div>
        <div className="brand-copy">
          <strong>Som das Seis</strong>
          <span>FICHA DIGITAL</span>
        </div>
        <div className="rail-rule" />
        <nav className="tab-nav" aria-label="Seções da ficha">
          <div className="nav-label">
            FICHA DE {sheet.characterName.toUpperCase()}
          </div>
          {tabs.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => setActiveTab(item.key)}
              >
                <span className="nav-icon">
                  <Icon size={17} strokeWidth={1.8} />
                </span>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.hint}</small>
                </span>
                {isActive ? (
                  <ChevronRight size={15} className="nav-arrow" />
                ) : null}
              </button>
            );
          })}
        </nav>
        <div className="rail-bottom">
          <div className="status-chip">
            <span className="status-dot" /> Salvamento online ativo
          </div>
          <button
            className="rail-help"
            onClick={() =>
              toast("Como usar", {
                description:
                  "Clique nos nomes dos atributos para rolar. Use o cadeado para proteger os campos e a câmera para trocar o retrato.",
              })
            }
          >
            <CircleHelp size={15} /> Como usar
          </button>
          <button className="rail-help" onClick={onSignOut}>
            <Unlock size={15} /> Sair da conta
          </button>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <span>FICHA</span>
            <ChevronRight size={13} />
            <strong>{tab.label.toUpperCase()}</strong>
          </div>
          <div className="top-actions">
            <span className="saved-indicator">
              <Save size={13} /> salvo {lastSaved}
            </span>
            <button
              className={`lock-button ${locked ? "is-locked" : ""}`}
              onClick={toggleLock}
              aria-pressed={locked}
            >
              {locked ? <Lock size={15} /> : <Unlock size={15} />}
              <span>{locked ? "Desbloquear edição" : "Bloquear edição"}</span>
            </button>
            <button
              className="icon-button"
              onClick={exportSheet}
              title="Exportar ficha"
            >
              <Download size={16} />
            </button>
            <button
              className="icon-button"
              onClick={resetSheet}
              disabled={locked}
              title="Restaurar valores"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </header>

        <div className="page-scroll">
          <div className="mobile-page-intro">
            <div className="eyebrow">SOM DAS SEIS / FICHA DIGITAL</div>
            <h1>{sheet.characterName || "Personagem sem nome"}</h1>
          </div>

          {activeTab === "personagem" ? (
            <div className="tab-content">
              <section className="identity-panel panel-surface">
                <div className="portrait-column">
                  <div className="wanted-poster-label">PROCURADO</div>
                  <div
                    className={`portrait-frame wanted-frame ${sheet.photo ? "has-photo" : ""}`}
                  >
                    {sheet.photo ? (
                      <img
                        src={sheet.photo}
                        alt={`Retrato de ${sheet.characterName}`}
                      />
                    ) : (
                      <div className="portrait-placeholder">
                        <UserRound size={54} strokeWidth={1} />
                        <span>SEM RETRATO</span>
                      </div>
                    )}
                    <button
                      className="photo-button"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={locked}
                    >
                      <Camera size={14} /> trocar foto
                    </button>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhoto}
                      hidden
                    />
                  </div>
                  <div className="portrait-caption">
                    <span className="status-dot" /> personagem ativa
                  </div>
                </div>
                <div className="identity-fields">
                  <div className="identity-title-row">
                    <div>
                      <div className="eyebrow">ARQUIVO DE PERSONAGEM</div>
                      <h1>{sheet.characterName || "Personagem sem nome"}</h1>
                    </div>
                    <span className="version-tag">S6 · 01</span>
                  </div>
                  <div className="field-grid three">
                    <TextField
                      label="Nome da personagem"
                      value={sheet.characterName}
                      onChange={value => update("characterName", value)}
                      disabled={locked}
                      placeholder="Ex.: personagem"
                    />
                    <TextField
                      label="Jogador"
                      value={sheet.player}
                      onChange={value => update("player", value)}
                      disabled={locked}
                    />
                    <NumberField
                      label="Nível"
                      value={sheet.Nivel}
                      onChange={value => update("Nivel", value)}
                      disabled={locked}
                      min={1}
                      max={6}
                      hint="Nível atual da personagem"
                    />
                  </div>
                  <div className="field-grid two">
                    <TextField
                      label="Conceito"
                      value={sheet.concept}
                      onChange={value => update("concept", value)}
                      disabled={locked}
                      placeholder="Quem é esta personagem no mundo?"
                    />
                    <TextField
                      label="Antecedente"
                      value={sheet.background}
                      onChange={value => update("background", value)}
                      disabled={locked}
                      placeholder="De onde ela veio?"
                    />
                  </div>
                  <div className="identity-meta">
                    <span>
                      <span className="meta-line" /> Som das Seis
                    </span>
                    <span>
                      Última sessão: <b>não registrada</b>
                    </span>
                  </div>
                </div>
              </section>

              <SectionTitle
                eyebrow="01 / ATRIBUTOS"
                title="O que move a personagem"
                detail="Clique no nome de um atributo para rolar 1d6 + valor. O resultado aparece no painel ao lado."
                action={
                  <span className="rule-note">
                    <Dice5 size={15} /> dificuldade padrão 7
                  </span>
                }
              />
              <section className="attribute-grid">
                {attributes.map(attribute => (
                  <article
                    key={attribute.key}
                    className={`attribute-card ${attribute.color}`}
                  >
                    <button
                      className="attribute-trigger"
                      onClick={() => doRoll(attribute.label, attribute.key)}
                    >
                      <span className="attribute-symbol">{attribute.icon}</span>
                      <span className="attribute-short">{attribute.short}</span>
                      <Dice5 size={16} />
                    </button>
                    <div className="attribute-main">
                      <h3>{attribute.label}</h3>
                      <p>{attribute.description}</p>
                    </div>
                    <div className="attribute-score">
                      <input
                        type="number"
                        min={0}
                        max={5}
                        value={sheet[attribute.key]}
                        onChange={event =>
                          update(attribute.key, Number(event.target.value))
                        }
                        disabled={locked}
                      />
                      <span>/ 5</span>
                    </div>
                    <ProgressDots
                      value={Number(sheet[attribute.key])}
                      color={attribute.color}
                    />
                  </article>
                ))}
              </section>

              <section className="resource-grid">
                <div className="panel-surface resource-panel">
                  <div className="mini-panel-heading">
                    <span className="icon-disc heart">
                      <Heart size={15} />
                    </span>
                    <div>
                      <div className="eyebrow">RESISTÊNCIA</div>
                      <h3>Vida & Defesa</h3>
                    </div>
                  </div>
                  <div className="field-grid two">
                    <NumberField
                      label="Vida"
                      value={sheet.Vida}
                      onChange={value => update("Vida", value)}
                      disabled={locked}
                      min={0}
                      hint="Pontos de vida atuais"
                      accent="accent-coral"
                    />
                    <NumberField
                      label="Defesa"
                      value={sheet.Defesa}
                      onChange={value => update("Defesa", value)}
                      disabled={locked}
                      min={5}
                      hint="5 + modificadores"
                      accent="accent-cyan"
                    />
                  </div>
                  <div className="bar-track">
                    <span
                      style={{
                        width: `${Math.min(100, Math.max(0, Number(sheet.Vida) * 10))}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="panel-surface resource-panel">
                  <div className="mini-panel-heading">
                    <span className="icon-disc violet">
                      <Flame size={15} />
                    </span>
                    <div>
                      <div className="eyebrow">MARCADORES</div>
                      <h3>Tormento & Recompensa</h3>
                    </div>
                  </div>
                  <div className="field-grid two">
                    <label className="field-wrap">
                      <Label>Tormento</Label>
                      <textarea
                        className="compact-textarea"
                        value={sheet.Tormento}
                        onChange={event =>
                          update("Tormento", event.target.value)
                        }
                        disabled={locked}
                        placeholder="O que pesa sobre ela?"
                      />
                    </label>
                    <label className="field-wrap">
                      <Label>Recompensa</Label>
                      <textarea
                        className="compact-textarea"
                        value={sheet.Recompensa}
                        onChange={event =>
                          update("Recompensa", event.target.value)
                        }
                        disabled={locked}
                        placeholder="O que ela busca?"
                      />
                    </label>
                  </div>
                </div>
              </section>

              <SectionTitle
                eyebrow="02 / HABILIDADES"
                title="O que a personagem sabe fazer"
                detail="As habilidades seguem a mesma lógica: 1d6 + valor, com sucesso a partir de 7."
              />
              <section className="skills-grid">
                {skills.map(skill => {
                  const Icon = skill.icon;
                  return (
                    <button
                      key={skill.key}
                      className="skill-card"
                      onClick={() => doRoll(skill.label, skill.key)}
                    >
                      <span className="skill-icon">
                        <Icon size={16} />
                      </span>
                      <span className="skill-name">{skill.label}</span>
                      <span className="skill-score">
                        {sheet[skill.key]} <small>/5</small>
                      </span>
                      <Dice5 size={14} className="skill-die" />
                    </button>
                  );
                })}
              </section>

              <section className="bottom-stats panel-surface">
                <div className="bottom-stat">
                  <span className="eyebrow">INICIATIVA</span>
                  <NumberField
                    label=""
                    value={sheet.iniciativa_score}
                    onChange={value => update("iniciativa_score", value)}
                    disabled={locked}
                    min={0}
                  />
                </div>
                <div className="bottom-stat">
                  <span className="eyebrow">AÇÕES POR TURNO</span>
                  <NumberField
                    label=""
                    value={sheet.acoes}
                    onChange={value => update("acoes", value)}
                    disabled={locked}
                    min={1}
                  />
                </div>
                <div className="bottom-stat wide">
                  <TextField
                    label="Reputação"
                    value={sheet.Reputacao}
                    onChange={value => update("Reputacao", value)}
                    disabled={locked}
                    placeholder="Como o mundo conhece esta personagem?"
                  />
                </div>
                <div className="bottom-stat">
                  <NumberField
                    label="U$"
                    value={sheet.dinheiro}
                    onChange={value => update("dinheiro", value)}
                    disabled={locked}
                    min={0}
                  />
                </div>
              </section>
            </div>
          ) : null}

          {activeTab === "equipamentos" ? (
            <EquipmentTab
              sheet={sheet}
              locked={locked}
              update={update}
              addItem={addItem}
              updateItem={updateItem}
              removeItem={removeItem}
            />
          ) : null}
          {activeTab === "montaria" ? (
            <HorseTab
              sheet={sheet}
              locked={locked}
              update={update}
              addItem={addItem}
              updateItem={updateItem}
              removeItem={removeItem}
            />
          ) : null}
          {activeTab === "notas" ? (
            <NotesTab sheet={sheet} locked={locked} update={update} />
          ) : null}
        </div>
      </main>

      <aside className="roll-sidebar">
        <div className="roll-sidebar-header">
          <div>
            <div className="eyebrow">MESA DE ROLAGEM</div>
            <h2>Resultado</h2>
          </div>
          <span className="live-dot">
            <span /> ao vivo
          </span>
        </div>
        {roll ? (
          <div
            className={`roll-result ${roll.success ? "success" : "failure"}`}
          >
            <div className="roll-result-top">
              <span className="roll-label">
                TESTE DE {roll.name.toUpperCase()}
              </span>
              <span className="roll-rule">1d6 + {roll.score}</span>
            </div>
            <div className="die-stage">
              <div className="die-face">{roll.die}</div>
              <span className="plus">+</span>
              <strong>{roll.score}</strong>
              <span className="equals">=</span>
              <strong className="total">{roll.total}</strong>
            </div>
            <div className="outcome">
              <span className="outcome-mark">{roll.success ? "✓" : "×"}</span>
              <div>
                <strong>{roll.success ? "Sucesso" : "Falha"}</strong>
                <span>
                  {roll.success
                      ? "A sorte soprou a favor da personagem."
                    : "Nem toda estrada se abre na primeira tentativa."}
                </span>
              </div>
            </div>
            <div className="roll-again">
              <button
                onClick={() =>
                  doRoll(
                    roll.name,
                    attributes.find(attribute => attribute.label === roll.name)
                      ?.key ||
                      skills.find(skill => skill.label === roll.name)?.key ||
                      "fis_score"
                  )
                }
              >
                <Dice5 size={14} /> rolar novamente
              </button>
            </div>
          </div>
        ) : (
          <div className="roll-empty">
            <div className="empty-orbit">
              <Dice5 size={28} />
            </div>
            <h3>Escolha um teste</h3>
            <p>
              Clique em qualquer atributo ou habilidade para lançar o dado e ver
              a leitura do resultado.
            </p>
            <div className="empty-tip">
              <Sparkles size={14} />
              <span>
                um resultado <b>7 ou mais</b> é sucesso
              </span>
            </div>
          </div>
        )}
        <div className="sidebar-divider" />
        <div className="quick-sheet">
          <div className="quick-sheet-heading">
            <span>LEMBRETE DA FICHA</span>
            <CircleHelp size={14} />
          </div>
          <div className="quick-rule">
            <span className="rule-number">1d6</span>
            <span>+</span>
            <span className="rule-number">valor</span>
            <ChevronRight size={14} />
            <span className="rule-success">≥ 7</span>
          </div>
          <p>
            O valor é o número preenchido em cada cartão. Você pode editar
            enquanto a ficha estiver desbloqueada.
          </p>
        </div>
        <div className="sidebar-footer">
          <span>
            <span className="status-dot" /> pronto para jogar
          </span>
          <span>S6 / v1.0</span>
        </div>
      </aside>
    </div>
  );
}

function EquipmentTab({
  sheet,
  locked,
  update,
  addItem,
  updateItem,
  removeItem,
}: {
  sheet: Sheet;
  locked: boolean;
  update: (key: string, value: any) => void;
  addItem: (target: "misc_items" | "horse_items") => void;
  updateItem: (
    target: "misc_items" | "horse_items",
    id: number,
    field: keyof Item,
    value: string | number
  ) => void;
  removeItem: (target: "misc_items" | "horse_items", id: number) => void;
}) {
  return (
    <div className="tab-content">
      <SectionTitle
        eyebrow="03 / INVENTÁRIO"
        title="Equipamentos"
        detail="Armas, itens e recursos que acompanham a personagem na estrada."
        action={
          <span className="section-badge">
            <Backpack size={14} /> mochila aberta
          </span>
        }
      />
      <section className="equipment-layout">
        <div className="weapon-panel panel-surface">
          <div className="weapon-header">
            <div className="weapon-emblem">
              <Swords size={21} />
            </div>
            <div>
              <div className="eyebrow">ARMA PRINCIPAL</div>
              <h3>Arma não definida</h3>
              <p>Arraste um item de arma para cá no VTT ou preencha abaixo.</p>
            </div>
          </div>
          <div className="weapon-grid">
            <div className="formula-box">
              <span>ATAQUE</span>
              <strong>1d6 + {sheet.combate_score}</strong>
              <small>Combate</small>
            </div>
            <NumberField
              label="Dano perto"
              value={6}
              onChange={() => undefined}
              disabled={true}
              min={0}
            />
            <NumberField
              label="Dano longe"
              value={6}
              onChange={() => undefined}
              disabled={true}
              min={0}
            />
            <NumberField
              label="Munição"
              value={0}
              onChange={value => update("municao", value)}
              disabled={locked}
              min={0}
            />
          </div>
          <label className="field-wrap">
            <Label>Descrição da arma</Label>
            <textarea
              className="wide-textarea"
              value={sheet.arma_desc || ""}
              onChange={event => update("arma_desc", event.target.value)}
              disabled={locked}
              placeholder="Alcance, aparência, história..."
            />
          </label>
        </div>
        <div className="equipment-side panel-surface">
          <div className="mini-panel-heading">
            <span className="icon-disc amber">
              <Sparkles size={15} />
            </span>
            <div>
              <div className="eyebrow">RECURSOS</div>
              <h3>Inventário da personagem</h3>
            </div>
          </div>
          <div className="resource-summary">
            <span>Reputação</span>
            <strong>{sheet.Reputacao || "—"}</strong>
          </div>
          <div className="resource-summary">
            <span>Dinheiro</span>
            <strong>U$ {sheet.dinheiro || 0}</strong>
          </div>
          <div className="resource-summary">
            <span>Itens utilizáveis</span>
            <strong>
              {
                (sheet.misc_items || []).filter((item: Item) => item.nome)
                  .length
              }
            </strong>
          </div>
        </div>
      </section>
      <ItemTable
        title="Outros itens"
        items={sheet.misc_items || []}
        target="misc_items"
        locked={locked}
        addItem={addItem}
        updateItem={updateItem}
        removeItem={removeItem}
      />
    </div>
  );
}

function ItemTable({
  title,
  items,
  target,
  locked,
  addItem,
  updateItem,
  removeItem,
}: {
  title: string;
  items: Item[];
  target: "misc_items" | "horse_items";
  locked: boolean;
  addItem: (target: "misc_items" | "horse_items") => void;
  updateItem: (
    target: "misc_items" | "horse_items",
    id: number,
    field: keyof Item,
    value: string | number
  ) => void;
  removeItem: (target: "misc_items" | "horse_items", id: number) => void;
}) {
  return (
    <section className="items-panel">
      <div className="section-title compact">
        <div>
          <div className="eyebrow">LISTA LIVRE</div>
          <h2>{title}</h2>
        </div>
        <button
          className="add-button"
          onClick={() => addItem(target)}
          disabled={locked}
        >
          <Plus size={15} /> adicionar item
        </button>
      </div>
      <div className="items-table">
        <div className="items-head">
          <span>ITEM</span>
          <span>NOTAS</span>
          <span>QTD.</span>
          <span />
        </div>
        {items.length ? (
          items.map(item => (
            <div className="item-row" key={item.id}>
              <input
                value={item.nome}
                onChange={event =>
                  updateItem(target, item.id, "nome", event.target.value)
                }
                disabled={locked}
                placeholder="Nome do item"
              />
              <input
                value={item.notas}
                onChange={event =>
                  updateItem(target, item.id, "notas", event.target.value)
                }
                disabled={locked}
                placeholder="Observação"
              />
              <input
                className="qty-input"
                type="number"
                min={1}
                value={item.qtd}
                onChange={event =>
                  updateItem(target, item.id, "qtd", Number(event.target.value))
                }
                disabled={locked}
              />
              <button
                className="row-delete"
                onClick={() => removeItem(target, item.id)}
                disabled={locked}
                title="Remover item"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        ) : (
          <div className="empty-table">Nenhum item cadastrado.</div>
        )}
      </div>
    </section>
  );
}

function HorseTab({
  sheet,
  locked,
  update,
  addItem,
  updateItem,
  removeItem,
}: {
  sheet: Sheet;
  locked: boolean;
  update: (key: string, value: any) => void;
  addItem: (target: "misc_items" | "horse_items") => void;
  updateItem: (
    target: "misc_items" | "horse_items",
    id: number,
    field: keyof Item,
    value: string | number
  ) => void;
  removeItem: (target: "misc_items" | "horse_items", id: number) => void;
}) {
  const advantages = [
    {
      key: "c1v",
      text: "Dê um nome a seu animal. Agora ele sabe quando você está falando com ele.",
    },
    {
      key: "c1v_copy1",
      text: "Sua montaria ganha +1 em Potência e tem bônus para saltar obstáculos.",
    },
    {
      key: "c1v_copy1_copy2",
      text: "Com um assovio, sua montaria vai até você se estiver nas redondezas.",
    },
    {
      key: "c1v_copy1_copy1",
      text: "Seu cavalo não tem medo de fogo, rios ou perigos. +1 em Resistência.",
    },
  ];
  return (
    <div className="tab-content">
      <SectionTitle
        eyebrow="04 / COMPANHEIRO"
        title="Montaria"
        detail="Uma presença viva na jornada — com atributos, fidelidade e vantagens próprias."
        action={
          <span className="section-badge horse-badge">
            <PawPrint size={14} /> estábulo
          </span>
        }
      />
      <section className="horse-hero panel-surface">
        <div className="horse-symbol">
          <PawPrint size={36} strokeWidth={1.4} />
        </div>
        <div className="horse-intro">
          <div className="eyebrow">REGISTRO DA MONTARIA</div>
          <h3>{sheet.nome_cavalo || "Montaria sem nome"}</h3>
          <p>
            Escolha um nome e marque os vínculos conquistados durante a
            campanha.
          </p>
        </div>
        <div className="horse-name-field">
          <TextField
            label="Nome do animal"
            value={sheet.nome_cavalo}
            onChange={value => update("nome_cavalo", value)}
            disabled={locked}
            placeholder="Ex.: Estrela"
          />
          <NumberField
            label="Fidelidade"
            value={sheet.fidelidade_cavalo}
            onChange={value => update("fidelidade_cavalo", value)}
            disabled={locked}
            min={0}
            max={4}
          />
        </div>
      </section>
      <section className="horse-stats-grid">
        <div className="panel-surface">
          <div className="mini-panel-heading">
            <span className="icon-disc amber">
              <Flame size={15} />
            </span>
            <div>
              <div className="eyebrow">ATRIBUTOS</div>
              <h3>Força do vínculo</h3>
            </div>
          </div>
          <div className="field-grid two">
            <NumberField
              label="Potência"
              value={sheet.potencia_score}
              onChange={value => update("potencia_score", value)}
              disabled={locked}
              min={0}
              max={5}
              hint="Físico"
            />
            <NumberField
              label="Vigor"
              value={sheet.vigor_score}
              onChange={value => update("vigor_score", value)}
              disabled={locked}
              min={0}
              max={5}
              hint="Agilidade"
            />
          </div>
        </div>
        <div className="panel-surface">
          <div className="mini-panel-heading">
            <span className="icon-disc cyan">
              <Shield size={15} />
            </span>
            <div>
              <div className="eyebrow">RESISTÊNCIA</div>
              <h3>Estatísticas</h3>
            </div>
          </div>
          <div className="field-grid three">
            <NumberField
              label="Vida"
              value={sheet.vida_cavalo}
              onChange={value => update("vida_cavalo", value)}
              disabled={locked}
              min={0}
              hint="1d6 + Vigor"
            />
            <NumberField
              label="Defesa"
              value={sheet.defesa_cavalo}
              onChange={value => update("defesa_cavalo", value)}
              disabled={locked}
              min={5}
              hint="5 + Vigor"
            />
            <NumberField
              label="Dano"
              value={sheet.dano_cavalo}
              onChange={value => update("dano_cavalo", value)}
              disabled={locked}
              min={6}
              hint="Defesa"
            />
          </div>
        </div>
      </section>
      <section className="advantages-panel panel-surface">
        <div className="mini-panel-heading">
          <span className="icon-disc violet">
            <Sparkles size={15} />
          </span>
          <div>
            <div className="eyebrow">VANTAGENS</div>
            <h3>Laços de montaria</h3>
          </div>
        </div>
        <div className="advantages-list">
          {advantages.map(advantage => (
            <label
              className={`advantage-row ${sheet[advantage.key] ? "checked" : ""}`}
              key={advantage.key}
            >
              <input
                type="checkbox"
                checked={Boolean(sheet[advantage.key])}
                onChange={event => update(advantage.key, event.target.checked)}
                disabled={locked}
              />
              <span className="custom-check">
                {sheet[advantage.key] ? "✓" : ""}
              </span>
              <span>{advantage.text}</span>
            </label>
          ))}
        </div>
      </section>
      <ItemTable
        title="Itens no cavalo"
        items={sheet.horse_items || []}
        target="horse_items"
        locked={locked}
        addItem={addItem}
        updateItem={updateItem}
        removeItem={removeItem}
      />
    </div>
  );
}

function NotesTab({
  sheet,
  locked,
  update,
}: {
  sheet: Sheet;
  locked: boolean;
  update: (key: string, value: any) => void;
}) {
  return (
    <div className="tab-content">
      <SectionTitle
        eyebrow="05 / DIÁRIO"
        title="Notas da campanha"
        detail="Registre pistas, promessas, NPCs, mapas e tudo que não pode se perder entre uma sessão e outra."
        action={
          <span className="section-badge">
            <NotebookPen size={14} /> caderno aberto
          </span>
        }
      />
      <section className="notes-layout">
        <div className="notes-paper panel-surface">
          <div className="paper-top">
            <span className="paper-symbol">✦</span>
            <div>
              <div className="eyebrow">CADERNO DA PERSONAGEM</div>
              <h3>O que aconteceu?</h3>
            </div>
            <span className="paper-date">sessão atual</span>
          </div>
          <textarea
            className="notes-textarea"
            value={sheet.notas_campo}
            onChange={event => update("notas_campo", event.target.value)}
            disabled={locked}
            placeholder="Escreva livremente...\n\n• Lugares visitados\n• Pessoas conhecidas\n• Pistas e perguntas abertas\n• Próximos passos"
          />
        </div>
        <div className="notes-aside">
          <div className="panel-surface prompt-card">
            <Sparkles size={17} />
            <div>
              <div className="eyebrow">PROMPT DE SESSÃO</div>
              <h3>O que a personagem não contou?</h3>
              <p>
                Uma boa nota também pode ser uma pergunta. Deixe uma isca para a
                próxima mesa.
              </p>
            </div>
          </div>
          <div className="panel-surface notes-key">
            <div className="mini-panel-heading">
              <span className="icon-disc cyan">
                <Info size={15} />
              </span>
              <div>
                <div className="eyebrow">LEMBRETE</div>
                <h3>Ficha protegida?</h3>
              </div>
            </div>
            <p>
              {locked
                ? "O modo de edição está bloqueado. Desbloqueie pelo botão no topo para escrever novas notas."
                : "As notas são salvas automaticamente neste navegador."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
