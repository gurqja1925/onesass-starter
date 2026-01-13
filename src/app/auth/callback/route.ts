/**
 * OAuth 콜백 처리
 *
 * 소셜 로그인 후 리다이렉트되는 엔드포인트
 */

import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 환경 변수에서 관리자 이메일 목록 가져오기
function getAdminEmails(): string[] {
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  return adminEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 사용자 정보 가져오기
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();

      if (supabaseUser?.email) {
        try {
          // 기존 사용자 확인
          const existingUser = await prisma.user.findUnique({
            where: { email: supabaseUser.email },
          });

          const eventType = existingUser ? "login" : "signup";
          const isNewUser = !existingUser;

          // 신규 사용자인 경우 첫 번째 사용자인지 확인
          let shouldBeAdmin = false;
          if (isNewUser) {
            const userCount = await prisma.user.count();
            const isFirstUser = userCount === 0;
            const adminEmails = getAdminEmails();
            const isConfiguredAdmin = adminEmails.includes(
              supabaseUser.email.toLowerCase(),
            );
            shouldBeAdmin = isFirstUser || isConfiguredAdmin;
          }

          // Prisma에 사용자 동기화 (cuid 사용, Supabase ID는 사용하지 않음)
          const user = await prisma.user.upsert({
            where: { email: supabaseUser.email },
            update: {
              name:
                supabaseUser.user_metadata?.full_name ||
                supabaseUser.user_metadata?.name ||
                null,
              image:
                supabaseUser.user_metadata?.avatar_url ||
                supabaseUser.user_metadata?.picture ||
                null,
              emailVerified: supabaseUser.email_confirmed_at
                ? new Date(supabaseUser.email_confirmed_at)
                : null,
            },
            create: {
              // id는 Prisma가 자동 생성 (cuid)
              email: supabaseUser.email,
              name:
                supabaseUser.user_metadata?.full_name ||
                supabaseUser.user_metadata?.name ||
                null,
              image:
                supabaseUser.user_metadata?.avatar_url ||
                supabaseUser.user_metadata?.picture ||
                null,
              emailVerified: supabaseUser.email_confirmed_at
                ? new Date(supabaseUser.email_confirmed_at)
                : null,
              role: shouldBeAdmin ? "admin" : "user", // 첫 번째 사용자는 관리자로 설정
            },
          });

          // 이벤트 기록
          await prisma.analytics.create({
            data: {
              type: eventType,
              value: 1,
              metadata: {
                userId: user.id,
                email: supabaseUser.email,
                provider: supabaseUser.app_metadata?.provider || "oauth",
              },
            },
          });

          // 신규 가입 시 무료 구독 생성
          if (isNewUser) {
            const now = new Date();
            const oneMonthLater = new Date(
              now.getTime() + 30 * 24 * 60 * 60 * 1000,
            );

            await prisma.subscription.create({
              data: {
                userId: user.id, // Prisma user.id 사용
                plan: "free",
                planName: "Free",
                amount: 0,
                status: "active",
                currentPeriodStart: now,
                currentPeriodEnd: oneMonthLater,
              },
            });

            console.log(
              `✅ 새 사용자 생성: ${supabaseUser.email}, 관리자: ${shouldBeAdmin}`,
            );
          }
        } catch (e) {
          console.error("User sync failed:", e);
        }
      }

      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // 에러 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(
    new URL("/login?error=auth_failed", requestUrl.origin),
  );
}
