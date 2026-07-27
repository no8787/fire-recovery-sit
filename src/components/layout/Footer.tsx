import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { COMPANY, FOOTER_LINKS, NAV_LINKS, TEL_HREF } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <Container className="grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">{COMPANY.nameKo}</p>
          <p className="mt-1 text-sm text-slate-400">
            {COMPANY.nameEn} · {COMPANY.affiliate}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
              <span>
                {COMPANY.address}
                <br />({COMPANY.addressAlt})
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
              <a href={TEL_HREF} className="hover:text-white">
                {COMPANY.tel}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
              <a href={`mailto:${COMPANY.email}`} className="hover:text-white">
                {COMPANY.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">메뉴</p>
          <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">인증</p>
          <ul className="mt-4 space-y-1.5 text-sm text-slate-400">
            {COMPANY.certifications.map((cert) => (
              <li key={cert}>{cert}</li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-slate-800">
        <Container className="flex flex-col gap-2 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            대표 {COMPANY.ceo} · 사업분야 {COMPANY.businessScope.join(" · ")}
          </p>
          <p>
            &copy; {new Date().getFullYear()} {COMPANY.nameKo}. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
