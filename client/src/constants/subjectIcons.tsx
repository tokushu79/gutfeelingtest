import {
  Scroll,
  Globe2,
  Dna,
  Sigma,
  Atom,
  FlaskConical,
  Telescope,
  BookOpen,
  Cpu,
  Palette,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export const subjectIconMap: Record<string, LucideIcon> = {
  Scroll,
  Globe2,
  Dna,
  Sigma,
  Atom,
  FlaskConical,
  Telescope,
  BookOpen,
  Cpu,
  Palette,
};

export function getSubjectIcon(name: string): LucideIcon {
  return subjectIconMap[name] ?? HelpCircle;
}
