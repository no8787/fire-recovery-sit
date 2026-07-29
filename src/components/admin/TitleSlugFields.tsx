"use client";

import { useState } from "react";
import { slugify } from "@/lib/slug";

// "제목"을 입력하면 슬러그를 자동 생성해 보여준다. 슬러그 입력란은 없애지 않고 그대로 두되,
// 필수 입력이 아닌 선택적 수정 필드로 남긴다 — 사용자가 슬러그를 직접 건드리면 그 다음부터는
// 자동 생성을 멈추고 사용자가 입력한 값을 존중한다. 최종 중복 처리(뒤에 -2, -3 등 붙이기)는
// 서버 액션에서 한 번 더 보장한다(클라이언트 미리보기는 참고용).
export function TitleSlugFields({
  titleLabel,
  slugLabel,
  labelClass,
  inputClass,
  titleDefaultValue = "",
  slugDefaultValue = "",
}: {
  titleLabel: string;
  slugLabel: string;
  labelClass: string;
  inputClass: string;
  titleDefaultValue?: string;
  slugDefaultValue?: string;
}) {
  const [slug, setSlug] = useState(slugDefaultValue);
  const [slugEdited, setSlugEdited] = useState(false);

  return (
    <>
      <div>
        <label className={labelClass}>{titleLabel}</label>
        <input
          name="title"
          required
          defaultValue={titleDefaultValue}
          className={inputClass}
          onChange={(e) => {
            if (!slugEdited) setSlug(slugify(e.target.value));
          }}
        />
      </div>

      <div>
        <label className={labelClass}>{slugLabel}</label>
        <input
          name="slug"
          value={slug}
          placeholder="제목을 입력하면 자동으로 채워집니다"
          pattern="[a-z0-9-]+"
          className={inputClass}
          onChange={(e) => {
            setSlugEdited(true);
            setSlug(e.target.value);
          }}
        />
      </div>
    </>
  );
}
