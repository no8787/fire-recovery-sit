"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  contactFormSchema,
  type ContactFormSchema,
  INQUIRY_TYPES,
  BUILDING_TYPES,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE_MB,
} from "@/lib/validation/contact";

const inputClass =
  "w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500";
const labelClass = "mb-1.5 block text-sm font-semibold text-slate-800";
const errorClass = "mt-1.5 text-xs font-medium text-red-600";

export function ContactForm() {
  const [fileError, setFileError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ inquiryNumber: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      hasInsurance: "unknown",
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nextFile = e.target.files?.[0];
    setFileError(null);
    setFile(null);
    if (!nextFile) return;

    if (!ALLOWED_FILE_TYPES.includes(nextFile.type)) {
      setFileError("jpg, png, webp, pdf 파일만 첨부할 수 있습니다.");
      e.target.value = "";
      return;
    }
    if (nextFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(`파일 용량은 ${MAX_FILE_SIZE_MB}MB 이하만 가능합니다.`);
      e.target.value = "";
      return;
    }
    setFile(nextFile);
  }

  async function onSubmit(values: ContactFormSchema) {
    setSubmitError(null);

    const formData = new FormData();
    formData.append("inquiryType", values.inquiryType);
    formData.append("name", values.name);
    formData.append("companyName", values.companyName ?? "");
    formData.append("phone", values.phone);
    formData.append("email", values.email ?? "");
    formData.append("siteAddress", values.siteAddress);
    formData.append("buildingType", values.buildingType);
    formData.append("fireDate", values.fireDate ?? "");
    formData.append("damageDescription", values.damageDescription);
    formData.append("hasInsurance", values.hasInsurance);
    formData.append("preferredVisitDate", values.preferredVisitDate ?? "");
    formData.append("message", values.message ?? "");
    formData.append("privacyAgreed", String(values.privacyAgreed));
    if (file) formData.append("file", file);

    try {
      const res = await fetch("/api/inquiries", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok || !json.inquiryNo) {
        setSubmitError(json.error ?? "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
      setResult({ inquiryNumber: json.inquiryNo });
      reset();
      setFile(null);
    } catch {
      setSubmitError("네트워크 오류로 접수하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  if (result) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" aria-hidden="true" />
        <p className="mt-4 text-lg font-bold text-slate-900">상담 신청이 접수되었습니다</p>
        <p className="mt-2 text-sm text-slate-600">
          상담번호{" "}
          <span className="font-mono font-semibold text-slate-900">
            {result.inquiryNumber}
          </span>
        </p>
        <p className="mt-4 text-sm text-slate-600">
          담당자가 영업일 기준 1~2일 이내 입력하신 연락처로 안내드립니다.
        </p>
        <Button className="mt-6" onClick={() => setResult(null)}>
          새 상담 신청하기
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <fieldset>
        <legend className={labelClass}>상담 유형</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {INQUIRY_TYPES.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center justify-center rounded-md border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 has-[:checked]:border-orange-600 has-[:checked]:bg-orange-50 has-[:checked]:text-orange-700"
            >
              <input
                type="radio"
                value={type}
                className="sr-only"
                {...register("inquiryType")}
              />
              {type}
            </label>
          ))}
        </div>
        {errors.inquiryType && <p className={errorClass}>{errors.inquiryType.message}</p>}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            이름 <span className="text-orange-600">*</span>
          </label>
          <input id="name" className={inputClass} {...register("name")} />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="companyName" className={labelClass}>
            업체명
          </label>
          <input id="companyName" className={inputClass} {...register("companyName")} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            연락처 <span className="text-orange-600">*</span>
          </label>
          <input
            id="phone"
            className={inputClass}
            placeholder="010-1234-5678"
            {...register("phone")}
          />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            이메일
          </label>
          <input id="email" type="email" className={inputClass} {...register("email")} />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="siteAddress" className={labelClass}>
            현장 주소 <span className="text-orange-600">*</span>
          </label>
          <input id="siteAddress" className={inputClass} {...register("siteAddress")} />
          {errors.siteAddress && <p className={errorClass}>{errors.siteAddress.message}</p>}
        </div>

        <div>
          <label htmlFor="buildingType" className={labelClass}>
            건물 유형 <span className="text-orange-600">*</span>
          </label>
          <select id="buildingType" className={inputClass} {...register("buildingType")}>
            <option value="">선택해 주세요</option>
            {BUILDING_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.buildingType && (
            <p className={errorClass}>{errors.buildingType.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="fireDate" className={labelClass}>
            화재 발생일
          </label>
          <input id="fireDate" type="date" className={inputClass} {...register("fireDate")} />
        </div>
      </div>

      <div>
        <label htmlFor="damageDescription" className={labelClass}>
          피해 내용 <span className="text-orange-600">*</span>
        </label>
        <textarea
          id="damageDescription"
          rows={4}
          className={inputClass}
          placeholder="피해 부위, 규모, 현재 상태 등을 알려주세요."
          {...register("damageDescription")}
        />
        {errors.damageDescription && (
          <p className={errorClass}>{errors.damageDescription.message}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <fieldset>
          <legend className={labelClass}>보험 가입 여부</legend>
          <div className="flex gap-3">
            {[
              { value: "yes", label: "가입" },
              { value: "no", label: "미가입" },
              { value: "unknown", label: "확인필요" },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex flex-1 cursor-pointer items-center justify-center rounded-md border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 has-[:checked]:border-orange-600 has-[:checked]:bg-orange-50 has-[:checked]:text-orange-700"
              >
                <input
                  type="radio"
                  value={opt.value}
                  className="sr-only"
                  {...register("hasInsurance")}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="preferredVisitDate" className={labelClass}>
            현장 방문 희망일
          </label>
          <input
            id="preferredVisitDate"
            type="date"
            className={inputClass}
            {...register("preferredVisitDate")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          문의 내용
        </label>
        <textarea
          id="message"
          rows={3}
          className={inputClass}
          placeholder="추가로 전달하고 싶은 내용이 있다면 남겨주세요."
          {...register("message")}
        />
      </div>

      <div>
        <label htmlFor="siteFile" className={labelClass}>
          현장 사진 첨부
        </label>
        <label
          htmlFor="siteFile"
          className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 px-3.5 py-3 text-sm text-slate-500 hover:border-orange-400"
        >
          <Paperclip className="h-4 w-4" aria-hidden="true" />
          {file?.name ?? "jpg, png, webp, pdf / 최대 10MB"}
        </label>
        <input
          id="siteFile"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="sr-only"
          onChange={handleFileChange}
        />
        {fileError && <p className={errorClass}>{fileError}</p>}
      </div>

      <div>
        <label className="flex items-start gap-2.5 text-sm text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
            {...register("privacyAgreed")}
          />
          <span>
            개인정보 수집·이용에 동의합니다. (필수) — 자세한 내용은{" "}
            <a href="/privacy" className="underline hover:text-orange-600">
              개인정보처리방침
            </a>
            을 확인해 주세요.
          </span>
        </label>
        {errors.privacyAgreed && (
          <p className={errorClass}>{errors.privacyAgreed.message}</p>
        )}
      </div>

      {submitError && <p className={errorClass}>{submitError}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "접수 중..." : "상담 신청하기"}
      </Button>
    </form>
  );
}
