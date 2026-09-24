export type AbilityCategory =
  | "Combate e armas"
  | "Sobrevivência, mobilidade e resistência"
  | "Investigação, influência e apoio";

export type Ability = {
  id: string;
  name: string;
  category: AbilityCategory;
  description: string;
};

export const abilities: Ability[] = [
  {
    id: "light-my-fire",
    name: "LIGHT MY FIRE",
    category: "Combate e armas",
    description: "Sempre que atirar com seu revólver, receba +1 no teste para acertar. Além disso, adicione +1 ao dano para cada ponto de Agilidade.",
  },
  {
    id: "lets-dance",
    name: "LET'S DANCE",
    category: "Combate e armas",
    description: "É possível fazer dois disparos com uma única ação, mas com penalidade de -1 no teste do Antecedente Combate.",
  },
  {
    id: "dont-stop-believing",
    name: "DON'T STOP BELIEVING",
    category: "Combate e armas",
    description: "Ao atirar com armas de longa distância, como espingardas ou arcos longos, adicione +1 no teste para acertar. Some também +1 ao dano para cada ponto de Inteligência.",
  },
  {
    id: "immigrant-song",
    name: "IMMIGRANT SONG",
    category: "Combate e armas",
    description: "Em ataques desarmados, o dano passa de 1d3 para 1d6, além de somar +1 para cada ponto no Atributo Físico.",
  },
  {
    id: "gimme-shelter",
    name: "GIMME SHELTER",
    category: "Combate e armas",
    description: "Ataques surpresa usando facas ou navalhas causam dano adicional conforme o nível: nível 1 +1d6; nível 4 +2d6; nível 7 +3d6; nível 10 +4d6.",
  },
  {
    id: "another-one-bites-the-dust",
    name: "ANOTHER ONE BITES THE DUST",
    category: "Combate e armas",
    description: "Permite escolher manobras de combate corpo a corpo sem armas. As manobras são: Rasteira, Kung-fu, Suplex, Briga de bar e Tapa com as costas da mão. Essa habilidade pode ser escolhida mais de uma vez para obter outras manobras.",
  },
  {
    id: "riders-on-the-storm",
    name: "RIDERS ON THE STORM",
    category: "Combate e armas",
    description: "Aumenta o dano do ataque corpo a corpo em +1d6 por nível a cada 3 Pontos de Vida sacrificados. Pode ser usada apenas uma vez por combate.",
  },
  {
    id: "smoke-on-the-water",
    name: "SMOKE ON THE WATER",
    category: "Combate e armas",
    description: "Com armas rústicas, receba +1 nos testes para acertar e +1 no dano para cada ponto no Atributo Físico.",
  },
  {
    id: "crazy-train",
    name: "CRAZY TRAIN",
    category: "Combate e armas",
    description: "Uma vez por nível, permite aumentar o dano de uma arma de fogo em até +1d6 por sessão. Depois do combate, a arma fica inutilizável.",
  },
  {
    id: "war-pigs",
    name: "WAR PIGS",
    category: "Combate e armas",
    description: "Ao utilizar explosivos, como TNT, dinamite ou nitroglicerina, receba +1 no teste do Antecedente para causar a explosão.",
  },
  {
    id: "fortunate-son",
    name: "FORTUNATE SON",
    category: "Sobrevivência, mobilidade e resistência",
    description: "Ao cair a ZERO Pontos de Vida durante a sessão, a personagem recupera 3 PVs e se levanta no turno seguinte. Se cair novamente no mesmo combate, a habilidade não funciona outra vez.",
  },
  {
    id: "born-to-be-wild",
    name: "BORN TO BE WILD",
    category: "Sobrevivência, mobilidade e resistência",
    description: "Receba +1 em testes de Antecedente que envolvam furtividade ou percepção.",
  },
  {
    id: "under-pressure",
    name: "UNDER PRESSURE",
    category: "Sobrevivência, mobilidade e resistência",
    description: "Ao fazer testes de resistência contra venenos, doenças, clima extremo, fome, sede ou outros fatores adversos, some +1 por nível à rolagem, até o máximo de +5.",
  },
  {
    id: "a-horse-with-no-name",
    name: "A HORSE WITH NO NAME",
    category: "Sobrevivência, mobilidade e resistência",
    description: "Todos os testes que envolvam a personagem e sua montaria recebem +1.",
  },
  {
    id: "paranoid",
    name: "PARANOID",
    category: "Sobrevivência, mobilidade e resistência",
    description: "Receba +1 nos resultados de Iniciativa. A personagem nunca é pega desprevenida.",
  },
  {
    id: "ramble-on",
    name: "RAMBLE ON",
    category: "Sobrevivência, mobilidade e resistência",
    description: "Gaste uma única ação para se mover duas vezes. Também receba +1 em testes de Antecedente relacionados a situações de fuga.",
  },
  {
    id: "aqualung",
    name: "AQUALUNG",
    category: "Sobrevivência, mobilidade e resistência",
    description: "Receba +1 em testes atléticos, como natação, escalada, subir, saltar e atividades semelhantes.",
  },
  {
    id: "heartbreaker",
    name: "HEARTBREAKER",
    category: "Investigação, influência e apoio",
    description: "Uma vez por sessão, escolha um alvo por nível. Esse alvo sofre -1 em qualquer ação ofensiva contra a personagem. A vantagem pode ser transferida para outro membro do grupo.",
  },
  {
    id: "barracuda",
    name: "BARRACUDA",
    category: "Investigação, influência e apoio",
    description: "Receba +1 por nível, até o máximo de +5, em testes de Antecedente para descobrir informações sobre algo, alguém ou algum lugar.",
  },
  {
    id: "sweet-emotion",
    name: "SWEET EMOTION",
    category: "Investigação, influência e apoio",
    description: "Permite inspirar aliados e conceder bônus conforme o nível: Nível 1: +1 ação em combate, 1 uso; Nível 2: +1d6 PV temporários, 1 uso; Nível 3: +1 em testes de ataque, 2 usos; Nível 4: +1 jogada em teste de morte, 2 usos; Nível 5: +2 em testes de ataque, 3 usos; Nível 6: +2d6 PV temporários, 4 usos.",
  },
  {
    id: "carry-on-my-wayward-son",
    name: "CARRY ON MY WAYWARD SON",
    category: "Investigação, influência e apoio",
    description: "Uma vez por nível, permite refazer um teste que deu errado. Também pode ser usada em favor de outra pessoa.",
  },
  {
    id: "ace-of-spades",
    name: "ACE OF SPADES",
    category: "Investigação, influência e apoio",
    description: "Receba +1 em testes do Antecedente Roubo ao trapacear ou perceber alguém roubando em um jogo de cartas.",
  },
  {
    id: "i-want-to-hold-your-hand",
    name: "I WANT TO HOLD YOUR HAND",
    category: "Investigação, influência e apoio",
    description: "Ao ajudar alguém a se curar ou ao curar a si mesma, adicione 1d6 PV por nível durante o tratamento.",
  },
  {
    id: "more-than-a-feeling",
    name: "MORE THAN A FEELING",
    category: "Investigação, influência e apoio",
    description: "Faça um teste no Antecedente Negócios. Se passar, faça duas perguntas à Juíza para descobrir se alguém está escondendo uma informação importante. Pode ser usada apenas uma vez por sessão.",
  },
];

export const abilityCategories = [
  "Todas",
  "Combate e armas",
  "Sobrevivência, mobilidade e resistência",
  "Investigação, influência e apoio",
] as const;
