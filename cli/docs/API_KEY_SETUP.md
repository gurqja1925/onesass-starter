# API 키 설정 가이드

K-Code CLI에서 사용할 AI 모델의 API 키를 설정하는 방법입니다.

## 📋 목차

- [빠른 시작](#빠른-시작)
- [프로바이더별 설정](#프로바이더별-설정)
- [API 키 저장 방법](#api-키-저장-방법)
- [보안 주의사항](#보안-주의사항)

---

## 🚀 빠른 시작

### 1. DeepSeek (권장)

가장 먼저 설정해야 할 모델입니다.

```bash
# 1. API 키 발급
# https://platform.deepseek.com 접속 → 회원가입 → API Keys 메뉴

# 2. API 키 설정
pnpm kcode --key deepseek sk-xxxxxxxxxxxxxxxx

# 3. 확인
pnpm kcode "테스트"
```

### 2. 무료 모델 (Google Gemini)

완전 무료로 사용 가능!

```bash
# 1. API 키 발급
# https://aistudio.google.com/app/apikey 접속 → Create API Key

# 2. API 키 설정
pnpm kcode --key google AIzaSyxxxxxxxxxxxxxxxx

# 3. 사용
pnpm kcode -m gemini-flash "테스트"
```

---

## 🔐 프로바이더별 설정

### DeepSeek
```bash
# API 키 발급: https://platform.deepseek.com
# 회원가입 → Dashboard → API Keys → Create new key

# 설정
pnpm kcode --key deepseek sk-xxxxxxxxxxxxxxxx
# 또는
export DEEPSEEK_API_KEY="sk-xxxxxxxxxxxxxxxx"

# 사용 가능 모델
pnpm kcode -m deepseek "작업"
pnpm kcode -m deepseek-reasoner "작업"  # 자동 사용됨
```

---

### OpenAI
```bash
# API 키 발급: https://platform.openai.com
# 회원가입 → API Keys → Create new secret key

# 설정
pnpm kcode --key openai sk-xxxxxxxxxxxxxxxx
# 또는
export OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxx"

# 사용 가능 모델
pnpm kcode -m gpt-4o "작업"
pnpm kcode -m gpt-4o-mini "작업"
pnpm kcode -m o1 "작업"
```

**참고:**
- 무료 크레딧: $5 (신규 가입자)
- 사용량 확인: https://platform.openai.com/usage
- 요금: https://openai.com/pricing

---

### Anthropic (Claude)
```bash
# API 키 발급: https://console.anthropic.com
# 회원가입 → API Keys → Create Key

# 설정
pnpm kcode --key anthropic sk-ant-xxxxxxxxxxxxxxxx
# 또는
export ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxxxxxx"

# 사용 가능 모델
pnpm kcode -m claude-sonnet "작업"
pnpm kcode -m claude-opus "작업"
pnpm kcode -m claude-haiku "작업"
```

**참고:**
- 무료 크레딧: $5 (신규 가입자)
- 콘솔: https://console.anthropic.com

---

### MiniMax (중국)
```bash
# API 키 발급: https://api.minimax.chat
# 회원가입 → API 관리 → 키 생성

# 설정
pnpm kcode --key minimax xxxxxxxxxxxxxxxx
# 또는
export MINIMAX_API_KEY="xxxxxxxxxxxxxxxx"

# 사용
pnpm kcode -m minimax-01 "작업"
```

**참고:**
- 초저렴: $0.07/$0.28 per M
- 긴 컨텍스트: 245K 토큰
- 중국 기반 서비스

---

### Qwen (Alibaba)
```bash
# API 키 발급: https://dashscope.console.aliyun.com
# Alibaba Cloud 계정 생성 → DashScope → API-KEY 관리

# 설정
pnpm kcode --key qwen sk-xxxxxxxxxxxxxxxx
# 또는
export QWEN_API_KEY="sk-xxxxxxxxxxxxxxxx"

# 사용 가능 모델
pnpm kcode -m qwq-32b "작업"        # 추론 모델
pnpm kcode -m qwen-turbo "작업"     # 가장 저렴!
```

**참고:**
- 가장 저렴: Qwen Turbo ($0.03/$0.06)
- 추론 특화: QwQ 32B
- 중국 기반 서비스 (Alibaba Cloud)

---

### Google Gemini
```bash
# API 키 발급: https://aistudio.google.com/app/apikey
# Google 계정으로 로그인 → Get API key → Create API key

# 설정
pnpm kcode --key google AIzaSyxxxxxxxxxxxxxxxx
# 또는
export GOOGLE_API_KEY="AIzaSyxxxxxxxxxxxxxxxx"

# 사용
pnpm kcode -m gemini-flash "작업"
```

**참고:**
- **완전 무료!** (Rate limit 있음)
- 100만 토큰 컨텍스트
- 빠른 응답 속도

---

### Groq
```bash
# API 키 발급: https://console.groq.com
# 회원가입 → API Keys → Create API Key

# 설정
pnpm kcode --key groq gsk_xxxxxxxxxxxxxxxx
# 또는
export GROQ_API_KEY="gsk_xxxxxxxxxxxxxxxx"

# 사용 가능 모델
pnpm kcode -m groq-llama-70b "작업"   # Llama 3.3 70B
pnpm kcode -m groq-mixtral "작업"     # Mixtral 8x7B
```

**참고:**
- **초고속**: ~500 tokens/sec
- 무료 티어 제공
- 속도가 필요한 경우 추천

---

## 💾 API 키 저장 방법

### 방법 1: CLI 명령어 (권장)

```bash
# 암호화되어 .onesaas/config.json에 저장됨
pnpm kcode --key <provider> <api-key>

# 예시
pnpm kcode --key deepseek sk-xxxxx
pnpm kcode --key openai sk-xxxxx
pnpm kcode --key google AIzaSyxxxxx
```

**장점:**
- 자동 암호화
- 프로젝트별 관리
- 안전한 저장

---

### 방법 2: 환경변수

```bash
# 셸 설정 파일에 추가 (~/.zshrc 또는 ~/.bashrc)
export DEEPSEEK_API_KEY="sk-xxxxx"
export OPENAI_API_KEY="sk-xxxxx"
export ANTHROPIC_API_KEY="sk-ant-xxxxx"
export GOOGLE_API_KEY="AIzaSyxxxxx"
export QWEN_API_KEY="sk-xxxxx"
export GROQ_API_KEY="gsk_xxxxx"
export MINIMAX_API_KEY="xxxxx"

# 적용
source ~/.zshrc  # 또는 source ~/.bashrc
```

**장점:**
- 모든 프로젝트에서 공유
- 간단한 설정

---

### 방법 3: .env 파일

```bash
# .env 파일에 추가
DEEPSEEK_API_KEY="sk-xxxxx"
OPENAI_API_KEY="sk-xxxxx"
ANTHROPIC_API_KEY="sk-ant-xxxxx"
GOOGLE_API_KEY="AIzaSyxxxxx"
QWEN_API_KEY="sk-xxxxx"
GROQ_API_KEY="gsk_xxxxx"
MINIMAX_API_KEY="xxxxx"
```

**주의:**
- `.env` 파일을 Git에 커밋하지 마세요!
- `.gitignore`에 `.env` 추가 확인

---

## 🔒 보안 주의사항

### ⚠️ 절대 하지 말아야 할 것

1. **Git에 API 키 커밋 금지**
   ```bash
   # .gitignore에 추가
   .env
   .env.local
   .onesaas/config.json
   ```

2. **공개 저장소에 키 노출 금지**
   - GitHub, GitLab 등에 업로드 시 주의
   - 실수로 업로드 시 즉시 키 재발급

3. **API 키 공유 금지**
   - 팀원에게 직접 전달 금지
   - 환경변수나 보안 저장소 사용

---

### ✅ 권장 보안 수칙

1. **API 키 정기 교체**
   ```bash
   # 3개월마다 키 재발급 권장
   # 각 프로바이더 콘솔에서 새 키 생성 → 기존 키 삭제
   ```

2. **사용량 모니터링**
   ```bash
   # 각 프로바이더 대시보드에서 사용량 확인
   # 예상치 못한 과금 방지
   ```

3. **IP 제한 설정** (프로바이더가 지원하는 경우)
   - OpenAI, Anthropic 등에서 IP 화이트리스트 설정 가능

4. **Rate Limit 설정**
   - 프로바이더 콘솔에서 사용량 제한 설정
   - 예상치 못한 과금 방지

---

## 🔍 설정 확인

### API 키가 설정되었는지 확인

```bash
# 모든 모델 목록과 키 상태 확인
pnpm kcode --list

# 출력 예시:
# ─── DeepSeek ─── ● 키 설정됨
# ─── OpenAI ─── ● 키 설정됨
# ─── Google Gemini ─── ○ 키 필요
```

### 테스트 실행

```bash
# 간단한 테스트
pnpm kcode "안녕하세요"

# 특정 모델 테스트
pnpm kcode -m gemini-flash "테스트"
pnpm kcode -m qwen-turbo "테스트"
```

---

## 🆘 문제 해결

### API 키 인식 안 됨

```bash
# 1. 환경변수 확인
echo $DEEPSEEK_API_KEY

# 2. 설정 파일 확인
cat .onesaas/config.json

# 3. 재설정
pnpm kcode --key deepseek sk-새로운키
```

### 401 Unauthorized 에러

```bash
# API 키가 유효하지 않거나 만료됨
# → 프로바이더 콘솔에서 새 키 발급
```

### 429 Rate Limit 에러

```bash
# 사용량 한도 초과
# → 잠시 대기 후 재시도
# → 유료 플랜 업그레이드 고려
```

---

## 📞 프로바이더 지원 링크

| 프로바이더 | 문서 | 지원 |
|-----------|------|------|
| DeepSeek | https://platform.deepseek.com/docs | Discord |
| OpenAI | https://platform.openai.com/docs | help.openai.com |
| Anthropic | https://docs.anthropic.com | support@anthropic.com |
| Google | https://ai.google.dev/docs | Community Forum |
| Qwen | https://help.aliyun.com/zh/dashscope | Alibaba Cloud Support |
| Groq | https://console.groq.com/docs | Discord |
| MiniMax | https://api.minimax.chat/document | 웹사이트 문의 |
