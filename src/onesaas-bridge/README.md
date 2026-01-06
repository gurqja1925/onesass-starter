# onesaas-bridge (연결 레이어)

> 공통 모듈(core)과 비즈니스 영역(custom)을 연결하는 최소한의 설정 파일

## 파일 목록
| 파일 | 설명 |
|-----|------|
| `routes.ts` | 페이지 라우팅 설정 |
| `feature-flags.ts` | 기능 활성화 플래그 |
| `theme.ts` | 테마 설정 연결 |
| `providers.tsx` | React Provider 조합 |
| `config.ts` | onesaas.json 로더 |

## 주의사항

- 이 폴더는 최대 5개 파일만 유지
- 복잡한 로직은 core 또는 custom으로 이동
- 업데이트 시 병합(merge) 방식으로 적용 (덮어쓰기 X)
