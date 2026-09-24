import { Check, Plus, Search, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  abilities,
  abilityCategories,
  type AbilityCategory,
} from "@/data/abilities";

type AbilitiesTabProps = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  locked: boolean;
};

export default function AbilitiesTab({
  selectedIds,
  onChange,
  locked,
}: AbilitiesTabProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"Todas" | AbilityCategory>("Todas");

  const selectedAbilities = useMemo(
    () => abilities.filter(ability => selectedIds.includes(ability.id)),
    [selectedIds]
  );

  const visibleAbilities = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return abilities.filter(ability => {
      const matchesCategory = category === "Todas" || ability.category === category;
      const matchesQuery =
        !normalizedQuery ||
        `${ability.name} ${ability.category} ${ability.description}`
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const toggleAbility = (id: string) => {
    if (locked) return;
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(selectedId => selectedId !== id));
      return;
    }
    onChange([...selectedIds, id]);
  };

  return (
    <div className="tab-content abilities-tab">
      <section className="abilities-intro">
        <div>
          <div className="eyebrow">02 / HABILIDADES</div>
          <h2>Habilidades da personagem</h2>
          <p>Escolha duas habilidades para destacar sua personagem.</p>
        </div>
        <div className="ability-counter">
          <Sparkles size={15} />
          <strong>Habilidades escolhidas: {selectedIds.length}</strong>
        </div>
      </section>

      <section className="selected-abilities panel-surface" aria-live="polite">
        <div className="abilities-section-heading">
          <div>
            <div className="eyebrow">ESCOLHAS DA PERSONAGEM</div>
            <h3>Em destaque</h3>
          </div>
          <span className="ability-limit-message"><Check size={14} /> escolhas livres</span>
        </div>
        {selectedAbilities.length ? (
          <div className="selected-ability-list">
            {selectedAbilities.map(ability => (
              <article className="selected-ability" key={ability.id}>
                <div>
                  <strong>{ability.name}</strong>
                  <span>{ability.category}</span>
                  <p>{ability.description}</p>
                </div>
                <button
                  type="button"
                  className="ability-remove-icon"
                  onClick={() => toggleAbility(ability.id)}
                  disabled={locked}
                  title={`Remover ${ability.name}`}
                  aria-label={`Remover ${ability.name}`}
                >
                  <X size={16} />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="abilities-empty-selected">Nenhuma habilidade escolhida ainda.</div>
        )}
      </section>

      <section className="abilities-browser">
        <div className="abilities-filters">
          <label className="ability-search">
            <Search size={16} />
            <span className="sr-only">Pesquisar habilidades</span>
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Pesquisar por nome ou descrição"
            />
          </label>
          <label className="ability-category-filter">
            <span>Categoria</span>
            <select
              value={category}
              onChange={event => setCategory(event.target.value as "Todas" | AbilityCategory)}
            >
              {abilityCategories.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>

        {visibleAbilities.length ? (
          <div className="abilities-list">
            {visibleAbilities.map(ability => {
              const selected = selectedIds.includes(ability.id);
              return (
                <article className={`ability-card ${selected ? "selected" : ""}`} key={ability.id}>
                  <div className="ability-card-copy">
                    <div className="ability-card-meta">
                      <span className="ability-category">{ability.category}</span>
                      {selected ? <span className="ability-selected-label"><Check size={12} /> escolhida</span> : null}
                    </div>
                    <h3>{ability.name}</h3>
                    <p>{ability.description}</p>
                  </div>
                  <button
                    type="button"
                    className={`ability-action ${selected ? "remove" : ""}`}
                    onClick={() => toggleAbility(ability.id)}
                    disabled={locked}
                    aria-pressed={selected}
                  >
                    {selected ? <X size={15} /> : <Plus size={15} />}
                    {selected ? "Remover" : "Adicionar"}
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="abilities-empty panel-surface">
            <Search size={23} />
            <strong>Nenhuma habilidade encontrada</strong>
            <span>Tente outro nome ou categoria.</span>
          </div>
        )}
      </section>
    </div>
  );
}
