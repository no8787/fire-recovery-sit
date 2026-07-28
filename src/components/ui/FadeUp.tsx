"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// CSS transition + IntersectionObserver만 쓰는 가벼운 스크롤 등장 애니메이션.
// 외부 라이브러리 없이 성능에 영향을 최소화한다.
// prefers-reduced-motion 사용자는 motion-reduce: 클래스로 애니메이션 없이 즉시 표시한다
// (JS에서 조건 분기해 effect 안에서 동기적으로 setState하는 방식은 피했다).
export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:!translate-y-0 motion-reduce:!opacity-100 motion-reduce:!transition-none ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
