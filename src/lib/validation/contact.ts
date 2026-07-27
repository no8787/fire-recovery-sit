import { z } from "zod";

export const INQUIRY_TYPES = [
  "긴급화재복구",
  "일반상담",
  "현장방문",
  "협력문의",
] as const;

export const BUILDING_TYPES = [
  "주택",
  "아파트",
  "상가",
  "공장",
  "창고",
  "사무실",
  "공공시설",
  "기타",
] as const;

const PHONE_REGEX = /^0\d{1,2}-?\d{3,4}-?\d{4}$/;

export const contactFormSchema = z.object({
  inquiryType: z.enum(INQUIRY_TYPES, {
    message: "상담 유형을 선택해 주세요.",
  }),
  name: z.string().trim().min(2, "이름을 2자 이상 입력해 주세요.").max(30),
  companyName: z.string().trim().max(50).optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "올바른 연락처 형식으로 입력해 주세요. (예: 010-1234-5678)"),
  email: z
    .string()
    .trim()
    .email("올바른 이메일 형식으로 입력해 주세요.")
    .optional()
    .or(z.literal("")),
  siteAddress: z.string().trim().min(5, "현장 주소를 입력해 주세요."),
  buildingType: z.enum(BUILDING_TYPES, {
    message: "건물 유형을 선택해 주세요.",
  }),
  fireDate: z.string().trim().optional().or(z.literal("")),
  damageDescription: z
    .string()
    .trim()
    .min(10, "피해 내용을 10자 이상 입력해 주세요.")
    .max(1000),
  hasInsurance: z.enum(["yes", "no", "unknown"], {
    message: "보험 가입 여부를 선택해 주세요.",
  }),
  preferredVisitDate: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  privacyAgreed: z.literal(true, {
    error: "개인정보 수집·이용에 동의해 주세요.",
  }),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
export const MAX_FILE_SIZE_MB = 10;
