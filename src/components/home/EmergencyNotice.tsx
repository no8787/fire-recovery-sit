import { AlertTriangle, Camera, ShieldAlert, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const notices = [
  {
    icon: ShieldAlert,
    title: "현장 임의출입 주의",
    description: "안전 확인 전에는 현장에 임의로 재출입하지 마세요.",
  },
  {
    icon: Camera,
    title: "피해사진·영상 확보",
    description: "복구·보험 처리를 위해 피해 상태를 사진과 영상으로 남겨두세요.",
  },
  {
    icon: AlertTriangle,
    title: "손상물품 임의폐기 금지",
    description: "피해 물품을 임의로 폐기하거나 이동하지 마세요.",
  },
  {
    icon: Users,
    title: "보험사·전문업체 상담",
    description: "보험사와 전문 복구업체에 함께 연락해 대응 절차를 안내받으세요.",
  },
];

export function EmergencyNotice() {
  return (
    <section className="bg-amber-50 py-14 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="긴급 상황 안내"
          title="화재 발생 직후, 이것만은 꼭 확인하세요"
          align="center"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {notices.map(({ icon: NoticeIcon, title, description }) => (
            <div
              key={title}
              className="rounded-lg border border-amber-200 bg-white p-5"
            >
              <NoticeIcon className="h-6 w-6 text-amber-600" aria-hidden="true" />
              <p className="mt-3 text-sm font-bold text-slate-900">{title}</p>
              <p className="mt-1.5 text-sm text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
