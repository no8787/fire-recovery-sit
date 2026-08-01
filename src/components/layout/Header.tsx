"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, PhoneCall } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { NAV_LINKS, COMPANY, TEL_HREF } from "@/lib/constants";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <Container className="flex h-[72px] items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 flex-col leading-tight" onClick={() => setOpen(false)}>
          <span className="text-[19px] font-extrabold tracking-[-0.02em] text-brand-navy-900">
            {COMPANY.nameKo}
          </span>
          <span className="text-[10px] font-semibold tracking-[0.2em] text-brand-orange-600">
            FIRE RECOVERY
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="주요 메뉴">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-[15px] font-semibold transition-colors ${
                  active ? "text-brand-navy-900" : "text-slate-600 hover:text-brand-navy-900"
                }`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full bg-brand-orange-600 transition-opacity ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <a
            href={TEL_HREF}
            className="flex items-center gap-1.5 text-[15px] font-semibold text-slate-600 transition-colors hover:text-brand-navy-900"
          >
            <PhoneCall className="h-4 w-4 text-brand-orange-600" aria-hidden="true" />
            {COMPANY.tel}
          </a>
          <Link
            href="/contact"
            className="rounded-lg bg-brand-orange-600 px-5 py-2.5 text-[15px] font-semibold text-white shadow-brand-soft transition-colors hover:bg-brand-orange-700"
          >
            화재복구 상담 신청
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 md:hidden"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={TEL_HREF}
              className="mt-1 flex items-center gap-1.5 rounded-lg px-3 py-3 text-[15px] font-semibold text-slate-700"
            >
              <PhoneCall className="h-4 w-4 text-brand-orange-600" aria-hidden="true" />
              {COMPANY.tel}
            </a>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-brand-orange-600 px-4 py-3 text-center text-[15px] font-semibold text-white"
            >
              화재복구 상담 신청
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
