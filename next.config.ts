import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Supabase Storage 공개 버킷(project-images)에 올라간 실제 시공사진을
    // next/image로 렌더링하려면 원격 호스트를 명시적으로 허용해야 한다.
    // 프로젝트마다 서브도메인이 다르므로 와일드카드로 매칭한다.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
