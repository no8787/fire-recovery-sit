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
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex flex-col leading-tight" onClick={() => setOpen(false)}>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            {COMPANY.nameKo}
          </span>
          <span className="text-[11px] font-medium tracking-widest text-orange-600">
            FIRE RECOVERY
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="주요 메뉴">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  active ? "text-orange-600" : "text-slate-700 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={TEL_HREF}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-700"
          >
            <PhoneCall className="h-4 w-4 text-orange-600" aria-hidden="true" />
            {COMPANY.tel}
          </a>
          <Link
            href="/contact"
            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
          >
            긴급상담 신청
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 md:hidden"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={TEL_HREF}
              className="mt-1 flex items-center gap-1.5 rounded-md px-2 py-2.5 text-sm font-semibold text-slate-700"
            >
              <PhoneCall className="h-4 w-4 text-orange-600" aria-hidden="true" />
              {COMPANY.tel}
            </a>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-md bg-orange-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              긴급상담 신청
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
