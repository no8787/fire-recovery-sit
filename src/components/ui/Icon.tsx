import {
  Search,
  HardHat,
  Wind,
  Droplets,
  Zap,
  Building2,
  FileText,
  AlarmClockCheck,
  Layers,
  Handshake,
  Network,
  ClipboardList,
  Clock,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Search,
  HardHat,
  Wind,
  Droplets,
  Zap,
  Building2,
  FileText,
  AlarmClockCheck,
  Layers,
  Handshake,
  Network,
  ClipboardList,
  Clock,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Component = ICON_MAP[name] ?? FileText;
  return <Component className={className} aria-hidden="true" />;
}
