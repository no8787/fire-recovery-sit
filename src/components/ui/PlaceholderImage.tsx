import { ImageOff } from "lucide-react";

export function PlaceholderImage({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-400 ${className}`}
    >
      <ImageOff className="h-7 w-7" aria-hidden="true" />
      <span className="text-xs font-medium text-slate-500">
        {label ?? "이미지 준비 중"}
      </span>
    </div>
  );
}
