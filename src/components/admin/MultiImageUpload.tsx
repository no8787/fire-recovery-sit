"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { uploadProjectImageAction } from "@/app/admin/(dashboard)/projects/actions";

const MAX_FILES = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const STAGE_OPTIONS = [
  { value: "", label: "단계 없음(갤러리)" },
  { value: "before", label: "전(before)" },
  { value: "during", label: "중(during)" },
  { value: "after", label: "후(after)" },
];

type FileStatus = "pending" | "uploading" | "success" | "error";

interface FileItem {
  file: File;
  previewUrl: string;
  status: FileStatus;
  error?: string;
}

export function MultiImageUpload({
  projectId,
  inputClass,
  labelClass,
}: {
  projectId: string;
  inputClass: string;
  labelClass: string;
}) {
  const [items, setItems] = useState<FileItem[]>([]);
  const [stage, setStage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [limitMessage, setLimitMessage] = useState<string | null>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []).filter((f) => ALLOWED_TYPES.includes(f.type));

    items.forEach((it) => URL.revokeObjectURL(it.previewUrl));

    if (selected.length > MAX_FILES) {
      setLimitMessage(
        `한 번에 최대 ${MAX_FILES}장까지 선택할 수 있습니다. 처음 ${MAX_FILES}장만 선택되었습니다(선택한 ${selected.length}장 중).`
      );
    } else {
      setLimitMessage(null);
    }

    const capped = selected.slice(0, MAX_FILES);
    setItems(
      capped.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        status: "pending" as const,
      }))
    );
    setProgress({ done: 0, total: 0 });
    e.target.value = "";
  }

  function removeItem(index: number) {
    setItems((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleUploadAll() {
    if (items.length === 0 || uploading) return;
    setUploading(true);
    setProgress({ done: 0, total: items.length });

    for (let i = 0; i < items.length; i++) {
      setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, status: "uploading" } : it)));

      const fd = new FormData();
      fd.append("project_id", projectId);
      fd.append("file", items[i].file);
      fd.append("stage", stage);

      const result = await uploadProjectImageAction(fd);

      setItems((prev) =>
        prev.map((it, idx) =>
          idx === i
            ? { ...it, status: result.ok ? "success" : "error", error: result.ok ? undefined : result.error }
            : it
        )
      );
      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }

    setUploading(false);
  }

  const failedItems = items.filter((it) => it.status === "error");
  const allDone = progress.total > 0 && progress.done === progress.total;

  return (
    <div className="mt-4 rounded-lg bg-slate-50 p-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="sm:col-span-3">
          <label className={labelClass}>파일 (여러 장 선택 가능, 최대 {MAX_FILES}장)</label>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={uploading}
            className="block w-full text-sm"
          />
        </div>
        <div>
          <label className={labelClass}>단계(전체 공통 적용)</label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            disabled={uploading}
            className={inputClass}
          >
            {STAGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {limitMessage && <p className="mt-2 text-xs font-semibold text-red-600">{limitMessage}</p>}

      {items.length > 0 && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {items.map((it, idx) => (
              <div key={idx} className="relative overflow-hidden rounded-md border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.previewUrl}
                  alt={it.file.name}
                  className="aspect-square w-full object-cover"
                />
                {!uploading && it.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    aria-label="선택 취소"
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/70 text-xs font-bold text-white hover:bg-slate-900"
                  >
                    ×
                  </button>
                )}
                {it.status === "uploading" && (
                  <span className="absolute inset-x-0 bottom-0 bg-slate-900/80 px-1.5 py-1 text-center text-[10px] font-semibold text-white">
                    업로드 중...
                  </span>
                )}
                {it.status === "success" && (
                  <span className="absolute inset-x-0 bottom-0 bg-emerald-600/90 px-1.5 py-1 text-center text-[10px] font-semibold text-white">
                    완료
                  </span>
                )}
                {it.status === "error" && (
                  <span
                    className="absolute inset-x-0 bottom-0 truncate bg-red-600/90 px-1.5 py-1 text-center text-[10px] font-semibold text-white"
                    title={it.error}
                  >
                    실패
                  </span>
                )}
                <p className="truncate px-1.5 py-1 text-[10px] text-slate-500">{it.file.name}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button type="button" size="md" onClick={handleUploadAll} disabled={uploading}>
              {uploading ? `업로드 중 (${progress.done}/${progress.total}장 완료)` : `${items.length}장 업로드`}
            </Button>
            {progress.total > 0 && (
              <span className="text-xs text-slate-500">
                {progress.done}/{progress.total}장 완료
              </span>
            )}
          </div>

          {allDone && failedItems.length > 0 && (
            <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              <p className="font-semibold">업로드 실패 {failedItems.length}장</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4">
                {failedItems.map((it, idx) => (
                  <li key={idx}>
                    {it.file.name}: {it.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {allDone && failedItems.length === 0 && (
            <p className="mt-3 text-xs font-semibold text-emerald-600">
              전체 {progress.total}장 업로드 완료. 캡션/대체텍스트는 아래 이미지 목록에서 각각 수정할 수 있습니다.
            </p>
          )}
        </>
      )}
    </div>
  );
}
