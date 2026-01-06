# onesaas-core (공통 모듈)

> **이 폴더는 수정하지 마세요!**
> OneSaaS 템플릿 업데이트 시 이 영역이 자동으로 패치됩니다.

## 포함된 기능

| 폴더 | 설명 | 주요 파일 |
|-----|------|----------|
| `auth/` | 인증 시스템 | `config.ts`, `provider.tsx`, `hooks.ts`, `components.tsx` |
| `payment/` | 결제 시스템 | `portone.ts`, `tosspay.ts`, `hooks.ts`, `components.tsx` |
| `admin/` | 관리자 대시보드 | `config.ts`, `hooks.ts`, `components.tsx` |
| `ui/` | 공통 UI 컴포넌트 | `Button.tsx`, `Card.tsx`, `Modal.tsx`, `Input.tsx`, `Badge.tsx`, `Loading.tsx` |
| `hooks/` | 공통 React Hooks | (예정) |
| `utils/` | 유틸리티 함수 | (예정) |

## 제공하는 컴포넌트

### 인증 (auth)
- `AuthProvider` - 인증 상태 관리 Provider
- `useAuth()` - 인증 상태 및 함수 훅
- `EmailLoginForm` - 이메일 로그인 폼
- `SignUpForm` - 회원가입 폼
- `SocialLoginButtons` - 소셜 로그인 버튼 그룹
- `UserMenu` - 사용자 메뉴

### 결제 (payment)
- `usePayment()` - 결제 기능 훅
- `PaymentButton` - 결제 버튼
- `PricingCard` - 가격 카드
- `PricingTable` - 가격표

### 관리자 (admin)
- `AdminLayout` - 관리자 레이아웃
- `DashboardStats` - 대시보드 통계
- `UserTable` - 사용자 테이블
- `RecentActivity` - 최근 활동

### UI 컴포넌트
- `Button` - 버튼 (primary, secondary, ghost, danger)
- `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`
- `Input`, `Textarea`, `Select`
- `Modal`, `ConfirmModal`
- `Badge`, `StatusBadge`
- `Loading`, `PageLoading`, `Skeleton`

## 커스터마이징이 필요하면?

`src/onesaas-custom/` 폴더에서 작업하세요.
이 폴더의 코드를 직접 수정하면 향후 업데이트 시 충돌이 발생합니다.

## 기능 활성화/비활성화

`onesaas.json` 설정 파일을 수정하면 됩니다:

```json
{
  "features": {
    "auth": {
      "enabled": true,
      "providers": ["email", "google", "kakao"]
    },
    "payment": {
      "enabled": true,
      "provider": "portone"
    }
  }
}
```
