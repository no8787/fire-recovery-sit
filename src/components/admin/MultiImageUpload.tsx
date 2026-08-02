"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  uploadProjectImageAction,
  prepareImageUploadAction,
  finalizeImageUploadsAction,
} from "@/app/admin/(dashboard)/projects/actions";
import { buildDefaultCaption, buildDefaultAltText } from "@/lib/image-caption";
import { resizeImageForUpload } from "@/lib/image-resize";

const MAX_FILES = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
// 동시에 올릴 개수. 너무 크면 서버/네트워크에 부담이 되고, 1이면 기존처럼 느리다.
const UPLOAD_CONCURRENCY = 3;

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
  caption: string;
  altText: string;
  stage: string;
  status: FileStatus;
  error?: string;
}

export function MultiImageUpload({
  projectId,
  projectTitle,
  projectRegion,
  projectNature,
  inputClass,
  labelClass,
}: {
  projectId: string;
  projectTitle: string;
  projectRegion: string;
  projectNature: string;
  inputClass: string;
  labelClass: string;
}) {
  const [items, setItems] = useState<FileItem[]>([]);
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
    const project = { title: projectTitle, region: projectRegion, projectNature };
    setItems(
      capped.map((file, idx) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        caption: buildDefaultCaption(project, idx, capped.length),
        altText: buildDefaultAltText(project, idx, capped.length),
        stage: "",
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

  function updateItemField(index: number, field: "caption" | "altText" | "stage", value: string) {
    setItems((prev) => prev.map((it, idx) => (idx === index ? { ...it, [field]: value } : it)));
  }

  async function handleUploadAll() {
    if (items.length === 0 || uploading) return;
    const snapshot = items;
    setUploading(true);
    setProgress({ done: 0, total: snapshot.length });

    // sort_order 시작값을 한 번만 받아온다. 실패해도 업로드는 계속하고,
    // 그 경우 서버가 장마다 count로 보정한다.
    const prepared = await prepareImageUploadAction(projectId);
    const startSortOrder = prepared.ok ? prepared.startSortOrder : null;

    async function uploadOne(i: number) {
      setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, status: "uploading" } : it)));

      const item = snapshot[i];
      // 원본 대신 축소·WebP 변환본을 보낸다(실패 시 원본으로 자동 폴백).
      const fileToSend = await resizeImageForUpload(item.file);

      const fd = new FormData();
      fd.append("project_id", projectId);
      fd.append("file", fileToSend);
      fd.append("stage", item.stage);
      fd.append("caption", item.caption);
      fd.append("alt_text", item.altText);
      if (startSortOrder !== null) fd.append("sort_order", String(startSortOrder + i));

      let result: Awaited<ReturnType<typeof uploadProjectImageAction>>;
      try {
        result = await uploadProjectImageAction(fd);
      } catch {
        result = { ok: false, error: "업로드 중 오류가 발생했습니다." };
      }

      setItems((prev) =>
        prev.map((it, idx) =>
          idx === i
            ? { ...it, status: result.ok ? "success" : "error", error: result.ok ? undefined : result.error }
            : it
        )
      );
      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }

    // 동시 실행 개수를 UPLOAD_CONCURRENCY로 제한하는 워커 풀.
    // 커서를 공유해 워커가 끝나는 대로 다음 파일을 집어간다(느린 파일이 뒤를 막지 않는다).
    let cursor = 0;
    async function worker() {
      while (cursor < snapshot.length) {
        const i = cursor++;
        await uploadOne(i);
      }
    }
    await Promise.all(
      Array.from({ length: Math.min(UPLOAD_CONCURRENCY, snapshot.length) }, worker)
    );

    // 재검증은 전부 끝난 뒤 한 번만.
    try {
      await finalizeImageUploadsAction(projectId);
    } catch {
      // 재검증 실패가 업로드 결과 표시를 막지는 않는다.
    }

    setUploading(false);
  }

  const failedItems = items.filter((it) => it.status === "error");
  const allDone = progress.total > 0 && progress.done === progress.total;

  return (
    <div className="mt-4 rounded-lg bg-slate-50 p-4">
      <div>
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

      {limitMessage && <p className="mt-2 text-xs font-semibold text-red-600">{limitMessage}</p>}

      {items.length > 0 && (
        <>
          <p className="mt-4 text-xs text-slate-500">
            캡션·대체텍스트는 프로젝트 정보로 자동 채워집니다. 필요하면 업로드 전에 직접 수정하세요.
          </p>
          <div className="mt-2 space-y-2">
            {items.map((it, idx) => (
              <div
                key={idx}
                className="flex gap-3 rounded-md border border-slate-200 bg-white p-2.5"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.previewUrl} alt={it.file.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <p className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-700">
                      {it.file.name}
                    </p>
                    <select
                      value={it.stage}
                      onChange={(e) => updateItemField(idx, "stage", e.target.value)}
                      disabled={uploading}
                      className={`${inputClass} w-32 shrink-0 text-xs`}
                    >
                      {STAGE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    value={it.caption}
                    onChange={(e) => updateItemField(idx, "caption", e.target.value)}
                    placeholder="캡션"
                    disabled={uploading}
                    className={`${inputClass} text-xs`}
                  />
                  <input
                    value={it.altText}
                    onChange={(e) => updateItemField(idx, "altText", e.target.value)}
                    placeholder="대체텍스트"
                    disabled={uploading}
                    className={`${inputClass} text-xs`}
                  />
                </div>
                <div className="flex shrink-0 flex-col items-end justify-between">
                  {!uploading && it.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      aria-label="선택 취소"
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500 hover:bg-slate-200"
                    >
                      ×
                    </button>
                  )}
                  {it.status === "uploading" && (
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                      업로드 중
                    </span>
                  )}
                  {it.status === "success" && (
                    <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                      완료
                    </span>
                  )}
                  {it.status === "error" && (
                    <span
                      className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white"
                      title={it.error}
                    >
                      실패
                    </span>
                  )}
                </div>
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
              전체 {progress.total}장 업로드 완료. 캡션/대체텍스트는 아래 이미지 목록에서도 다시 수정할 수 있습니다.
            </p>
          )}
        </>
      )}
    </div>
  );
}
