"use client";

import type { ReactNode } from "react";

// 삭제 등 되돌릴 수 없는 서버 액션 제출 전에 확인창을 띄우는 작은 클라이언트 래퍼.
// 부모 <form action={...}>는 그대로 서버 액션으로 제출되고, 이 버튼은 확인 여부만 가로챈다.
export function ConfirmSubmitButton({
  children,
  confirmMessage,
  className,
}: {
  children: ReactNode;
  confirmMessage: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
