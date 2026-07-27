// 손으로 작성한 Supabase 스키마 타입 (supabase/migrations/*.sql과 1:1 대응).
// 실제 프로젝트에 마이그레이션을 적용(supabase link 이후)한 뒤에는
//   npx supabase gen types typescript --linked > src/lib/supabase/database.types.ts
// 로 자동 생성본으로 교체하는 것을 권장합니다. 그 전까지는 이 수기 버전을 사용합니다.
//
// Relationships: [] 는 실제 FK 관계 메타데이터가 아니라, 설치된 @supabase/postgrest-js가
// 타입 추론(GenericTable 제약조건)을 위해 각 테이블에 요구하는 필드라서 빈 배열로 채워둔다.

export type UserRole = "super_admin" | "admin" | "counselor" | "editor";
export type InquiryTypeDb = "긴급화재복구" | "일반상담" | "현장방문" | "협력문의";
export type InsuranceStatusDb = "yes" | "no" | "unknown";
export type InquiryStatusDb = "new" | "in_progress" | "visited" | "quoted" | "completed" | "closed";
export type ProjectKind = "construction" | "fire_case";
export type ContentStatus = "draft" | "published";
export type ImageStage = "before" | "during" | "after";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string; email: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      inquiries: {
        Row: {
          id: string;
          inquiry_no: string | null;
          inquiry_type: InquiryTypeDb;
          name: string;
          company_name: string | null;
          phone: string;
          email: string | null;
          site_address: string;
          building_type: string;
          fire_date: string | null;
          damage_description: string;
          has_insurance: InsuranceStatusDb;
          preferred_visit_date: string | null;
          message: string | null;
          privacy_agreed: boolean;
          status: InquiryStatusDb;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["inquiries"]["Row"],
          "id" | "inquiry_no" | "status" | "assigned_to" | "created_at" | "updated_at"
        > &
          Partial<
            Pick<Database["public"]["Tables"]["inquiries"]["Row"], "status" | "assigned_to">
          >;
        Update: Partial<Database["public"]["Tables"]["inquiries"]["Row"]>;
        Relationships: [];
      };
      inquiry_files: {
        Row: {
          id: string;
          inquiry_id: string;
          storage_path: string;
          file_name: string;
          file_size: number | null;
          mime_type: string | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["inquiry_files"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["inquiry_files"]["Row"]>;
        Relationships: [];
      };
      inquiry_notes: {
        Row: {
          id: string;
          inquiry_id: string;
          author_id: string;
          note: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["inquiry_notes"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["inquiry_notes"]["Row"]>;
        Relationships: [];
      };
      project_categories: {
        Row: {
          id: string;
          kind: ProjectKind;
          slug: string;
          label: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["project_categories"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["project_categories"]["Row"]>;
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          kind: ProjectKind;
          slug: string;
          title: string;
          category_id: string;
          region: string;
          building_type: string;
          project_nature: string;
          period: string;
          scope: string[];
          description: string;
          thumbnail_url: string | null;
          is_featured: boolean;
          is_sample: boolean;
          status: ContentStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
        Relationships: [];
      };
      project_images: {
        Row: {
          id: string;
          project_id: string;
          storage_path: string;
          stage: ImageStage | null;
          is_render: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["project_images"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["project_images"]["Row"]>;
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          slug: string;
          category: string;
          title: string;
          excerpt: string | null;
          content: string;
          status: ContentStatus;
          author_id: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["posts"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["posts"]["Row"]>;
        Relationships: [];
      };
      faq_items: {
        Row: {
          id: string;
          category: string;
          question: string;
          answer: string;
          sort_order: number;
          status: ContentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["faq_items"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["faq_items"]["Row"]>;
        Relationships: [];
      };
      activity_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          target_table: string | null;
          target_id: string | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["activity_logs"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["activity_logs"]["Row"]>;
        Relationships: [];
      };
      daily_sequences: {
        Row: { seq_date: string; last_value: number };
        Insert: { seq_date: string; last_value?: number };
        Update: Partial<Database["public"]["Tables"]["daily_sequences"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      inquiry_type: InquiryTypeDb;
      insurance_status: InsuranceStatusDb;
      inquiry_status: InquiryStatusDb;
      project_kind: ProjectKind;
    };
    CompositeTypes: Record<string, never>;
  };
}
