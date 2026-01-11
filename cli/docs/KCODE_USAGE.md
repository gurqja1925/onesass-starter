# K-Code 사용 가이드

K-Code CLI의 모든 사용법을 설명합니다.

## 📋 목차

- [기본 사용법](#기본-사용법)
- [모드별 사용법](#모드별-사용법)
- [모델 선택](#모델-선택)
- [고급 기능](#고급-기능)
- [실전 예제](#실전-예제)

---

## 🚀 기본 사용법

### 단일 작업 실행

```bash
# 기본 사용 (파이프라인 모드)
pnpm kcode "로그인 페이지 만들어줘"

# 결과:
# 📋 리지너 분석
# 🧠 DeepSeek 사고 과정
# → 분석 → 구현 → 검토 (3단계)
```

### 인터랙티브 모드

```bash
# 대화형 모드 시작
pnpm kcode -i

# 또는
pnpm kcode --interactive
```

**인터랙티브 모드 명령어:**
- `<작업>` - 작업 입력 후 Enter
- `s` - 작업 상태 확인
- `/m <모델>` - 모델 변경
- `q` - 종료

---

## 🎯 모드별 사용법

### 1. 파이프라인 모드 (기본)

분석 → 구현 → 검토 3단계로 실행

```bash
pnpm kcode "회원가입 기능 추가해줘"

# 또는 명시적으로
pnpm kcode "회원가입 기능 추가해줘" --pipe
```

**언제 사용?**
- 일반적인 코딩 작업
- 중간 복잡도 작업
- 기본 권장 모드

---

### 2. 개발 파이프라인 모드

분석 → 설계 → 개발 → 구현 → 테스트 5단계

```bash
# "개발" 키워드가 포함되면 자동 활성화
pnpm kcode "결제 시스템 개발해줘"
pnpm kcode "대시보드 개발 및 테스트"
```

**언제 사용?**
- 복잡한 기능 개발
- 여러 파일 수정 필요
- 설계가 중요한 작업

---

### 3. 싱글 모드

단일 단계로 빠르게 실행

```bash
# 리지너가 자동으로 판단하여 싱글 모드 선택
pnpm kcode "너는 누구야?"
pnpm kcode "이 파일 읽어줘"
```

**언제 사용?**
- 간단한 질문
- 정보 요청
- 빠른 답변 필요

---

### 4. 멀티 태스크 모드

여러 작업을 동시에 병렬 실행

```bash
pnpm kcode "작업1" "작업2" "작업3"

# 또는 명시적으로
pnpm kcode "작업1" "작업2" --multi
```

**언제 사용?**
- 독립적인 여러 작업
- 시간 절약 필요
- 병렬 처리 가능한 작업

---

## 🎨 모델 선택

### 기본 모델 사용

```bash
# DeepSeek V3.2 (기본)
pnpm kcode "작업"
```

### 특정 모델 지정

```bash
# 일회성 사용
pnpm kcode -m qwen-turbo "작업"
pnpm kcode -m gemini-flash "작업"
pnpm kcode -m gpt-4o "작업"

# 또는
pnpm kcode --model qwq-32b "작업"
```

### 모델 목록 확인

```bash
pnpm kcode --list
pnpm kcode -l
```

### 인터랙티브에서 모델 변경

```bash
pnpm kcode -i

> /m qwen-turbo    # Qwen Turbo로 변경
> /m gemini-flash  # Gemini Flash로 변경
> /m deepseek      # DeepSeek으로 변경
```

---

## 🛠️ 고급 기능

### API 키 관리

```bash
# API 키 저장
pnpm kcode --key deepseek sk-xxxxx
pnpm kcode --key openai sk-xxxxx
pnpm kcode --key google AIzaSyxxxxx

# 여러 provider 저장 가능
pnpm kcode --key qwen sk-xxxxx
pnpm kcode --key groq gsk-xxxxx
```

### 원스탑 가이드

```bash
# 개발→커밋→배포 전체 가이드
pnpm kcode --guide
pnpm kcode -g
```

### 버전 확인 및 업데이트

```bash
# 버전 확인
pnpm kcode --version
pnpm kcode -v

# 자동 업데이트
pnpm kcode --update
pnpm kcode -u
```

### 도움말

```bash
pnpm kcode --help
pnpm kcode -h
```

---

## 💡 실전 예제

### 예제 1: 새 페이지 추가

```bash
pnpm kcode "관리자 대시보드 페이지 만들어줘. Chart.js로 통계 차트 포함"

# 실행 과정:
# 📋 리지너: pipeline=dev 판단
# → 분석: 요구사항 파악
# → 설계: 파일 구조 설계
# → 개발: 컴포넌트 구조 계획
# → 구현: 코드 작성
# → 테스트: 검증 및 수정
```

---

### 예제 2: 버그 수정

```bash
pnpm kcode "로그인 시 TypeError 발생하는 버그 수정해줘"

# 실행 과정:
# 📋 리지너: pipeline=standard 판단
# → 분석: 에러 위치 파악
# → 구현: 버그 수정
# → 검토: 코드 검토
```

---

### 예제 3: 여러 작업 동시 실행

```bash
pnpm kcode \
  "README.md 업데이트" \
  "테스트 코드 추가" \
  "타입 에러 수정"

# 3개 작업이 병렬로 실행됨
```

---

### 예제 4: 저렴한 모델로 간단한 작업

```bash
# Qwen Turbo ($0.03/$0.06) 사용
pnpm kcode -m qwen-turbo "주석 추가해줘"

# 비용 절감:
# DeepSeek: $0.27/$1.10
# Qwen Turbo: $0.03/$0.06 (90% 절감!)
```

---

### 예제 5: 무료 모델로 실험

```bash
# Gemini Flash (완전 무료) 사용
pnpm kcode -m gemini-flash "이 코드 리뷰해줘"

# 무료로 사용 가능!
# 긴 컨텍스트 (1M 토큰) 지원
```

---

### 예제 6: 초고속 응답

```bash
# Groq (~500 tokens/sec)
pnpm kcode -m groq-llama-70b "빠른 답변 필요한 작업"

# 일반 모델: ~30-50 tokens/sec
# Groq: ~500 tokens/sec (10배 빠름!)
```

---

## 📊 모드 비교표

| 모드 | 명령어 | 단계 | 속도 | 사용 시기 |
|------|--------|------|------|-----------|
| **싱글** | 자동 판단 | 1 | ⚡⚡⚡ | 간단한 질문/작업 |
| **파이프라인** | 기본값 | 3 | ⚡⚡ | 일반 코딩 작업 |
| **개발** | "개발" 키워드 | 5 | ⚡ | 복잡한 기능 개발 |
| **멀티** | 여러 작업 | N개 병렬 | ⚡⚡⚡ | 독립 작업 여러 개 |
| **인터랙티브** | -i | 대화형 | ⚡⚡ | 여러 작업 순차 실행 |

---

## 🎯 작업별 권장 모델

### 간단한 코딩 (주석, 간단 수정)
```bash
pnpm kcode -m qwen-turbo "주석 추가"
# 가장 저렴 ($0.03/$0.06)
```

### 일반 코딩 (기능 구현, 버그 수정)
```bash
pnpm kcode -m deepseek "로그인 기능 구현"
# 가성비 최고 ($0.27/$1.10)
```

### 복잡한 로직 (알고리즘, 수학)
```bash
pnpm kcode -m qwq-32b "복잡한 알고리즘 구현"
# 추론 특화 ($0.06/$0.06)
```

### 빠른 응답 필요
```bash
pnpm kcode -m groq-llama-70b "긴급 버그 수정"
# 초고속 (~500 tokens/sec)
```

### 실험/테스트
```bash
pnpm kcode -m gemini-flash "테스트 작업"
# 완전 무료
```

### 높은 품질 필요
```bash
pnpm kcode -m claude-haiku "중요한 코드 작성"
# 고품질 ($0.8/$4)
```

---

## 📝 팁과 요령

### 1. 명확한 지시

```bash
# ❌ 나쁜 예
pnpm kcode "페이지 만들어줘"

# ✅ 좋은 예
pnpm kcode "로그인 페이지 만들어줘. 이메일/비밀번호 폼, Supabase Auth 사용"
```

### 2. 컨텍스트 제공

```bash
# ❌ 나쁜 예
pnpm kcode "에러 수정해줘"

# ✅ 좋은 예
pnpm kcode "src/app/login/page.tsx:42 라인에서 발생하는 TypeError 수정해줘"
```

### 3. 모델 선택 전략

```bash
# 1단계: 무료/저렴한 모델로 시도
pnpm kcode -m gemini-flash "작업"

# 2단계: 안 되면 DeepSeek
pnpm kcode -m deepseek "작업"

# 3단계: 복잡하면 추론 모델
pnpm kcode -m qwq-32b "작업"
```

### 4. 비용 절감

```bash
# 간단한 작업은 저렴한 모델
pnpm kcode -m qwen-turbo "주석 추가"    # $0.03
pnpm kcode -m minimax-01 "리팩토링"    # $0.07
pnpm kcode -m gemini-flash "테스트"    # FREE

# 복잡한 작업만 고급 모델
pnpm kcode -m deepseek "복잡한 구현"   # $0.27
```

### 5. 인터랙티브 활용

```bash
pnpm kcode -i

> 로그인 페이지 만들어줘
> (완료 대기)
> 회원가입 페이지도 만들어줘
> (완료 대기)
> 테스트 코드 추가해줘
```

---

## 🆘 자주 묻는 질문 (FAQ)

### Q: 어떤 모델을 선택해야 하나요?

**A:** 작업 복잡도에 따라:
- 간단: `qwen-turbo` (가장 저렴)
- 일반: `deepseek` (기본)
- 복잡: `qwq-32b` (추론)
- 테스트: `gemini-flash` (무료)

---

### Q: 비용이 얼마나 드나요?

**A:** 모델별 차이:
```
1M 토큰 기준 (대략 75만 단어)
- Qwen Turbo: $0.03/$0.06
- DeepSeek: $0.27/$1.10
- GPT-4o: $2.5/$10

일반적인 작업: 3K-10K 토큰 사용
→ $0.003 - $0.03 정도
```

---

### Q: 멀티 태스크는 언제 사용하나요?

**A:** 독립적인 작업들:
```bash
# ✅ 좋은 예 (독립 작업)
pnpm kcode "README 수정" "테스트 추가" "주석 추가"

# ❌ 나쁜 예 (의존 관계)
pnpm kcode "로그인 구현" "로그인 테스트"  # 순차 실행 필요
```

---

### Q: 작업이 실패하면?

**A:** 다른 모델 시도:
```bash
# 1. 먼저 deepseek 시도
pnpm kcode "작업"

# 2. 실패 시 추론 모델
pnpm kcode -m qwq-32b "작업"

# 3. 여전히 실패 시 고급 모델
pnpm kcode -m gpt-4o "작업"
```

---

## 📚 추가 문서

- [AI 모델 목록](./AI_MODELS.md)
- [API 키 설정](./API_KEY_SETUP.md)
- [프로젝트 가이드](../CLAUDE.md)

---

## 🔗 참고 링크

- K-Code GitHub: (추가 예정)
- OneSaaS 문서: https://onesaas.kr/docs
- 이슈 리포트: (추가 예정)
