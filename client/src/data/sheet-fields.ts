import {
  BookOpen,
  Eye,
  Flame,
  Heart,
  PawPrint,
  Sparkles,
  Swords,
  WandSparkles,
} from "lucide-react";

export const attributes = [
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
] as const;

export const skills = [
  { key: "combate_score", label: "Combate", icon: Swords },
  { key: "negocios_score", label: "Negócios", icon: Sparkles },
  { key: "montaria_score", label: "Montaria", icon: PawPrint },
  { key: "tradicao_score", label: "Tradição", icon: BookOpen },
  { key: "labuta_score", label: "Labuta", icon: Flame },
  { key: "exploracao_score", label: "Exploração", icon: Eye },
  { key: "roubo_score", label: "Roubo", icon: WandSparkles },
  { key: "medicina_score", label: "Medicina", icon: Heart },
] as const;
