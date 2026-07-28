import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { randomBytes } from "crypto";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf-8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const { data: profiles, error: profileError } = await admin
  .from("profiles")
  .select("id, email, role, is_active")
  .eq("role", "super_admin");

if (profileError) { console.error(profileError.message); process.exit(1); }
const target = profiles[0];

// 실행할 때마다 새로 무작위 생성한다 — 평문 비밀번호를 코드에 고정하지 않는다.
const tempPassword = randomBytes(18).toString("base64url") + "!A1";
const { error } = await admin.auth.admin.updateUserById(target.id, { password: tempPassword });
if (error) { console.error("reset failed:", error.message); process.exit(1); }

console.log("EMAIL=" + target.email);
console.log("TEMP_PASSWORD=" + tempPassword);
console.log("\n이 비밀번호는 이 실행 결과에만 표시됩니다. 어떤 파일에도 저장되지 않았으니, 확인 후 반드시 본인만 아는 값으로 다시 변경하세요.");
