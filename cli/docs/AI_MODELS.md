# K-Code 지원 AI 모델

K-Code CLI에서 사용 가능한 모든 AI 모델 목록입니다.

## 📊 모델 비교표

| 모델 | 가격 (입력/출력) | 컨텍스트 | 특징 | 추천 용도 |
|------|-----------------|----------|------|-----------|
| **Qwen Turbo** | $0.03/$0.06 | 128K | 🏆 가장 저렴 | 간단한 코딩 |
| **QwQ 32B** | $0.06/$0.06 | 32K | 추론 특화 | 수학/복잡한 로직 |
| **MiniMax-01** | $0.07/$0.28 | 245K | 긴 컨텍스트 | 대용량 파일 |
| **DeepSeek V3.2** | $0.27/$1.10 | 128K | 검증됨 | 일반 코딩 |
| **Gemini Flash** | **FREE** | 1M | 무료! | 테스트/실험 |
| **Groq Llama 70B** | $0.59/$0.79 | 128K | 초고속 | 빠른 응답 필요 |
| **Groq Mixtral** | $0.24/$0.24 | 32K | 빠름 | 빠른 응답 필요 |
| **GPT-4o Mini** | $0.15/$0.60 | 128K | 균형 | OpenAI 생태계 |
| **Claude Haiku** | $0.8/$4 | 200K | 품질 | 고품질 응답 |

## 🏷️ 프로바이더별 모델

### DeepSeek (권장)
**API 키:** https://platform.deepseek.com

#### deepseek
- **이름:** DeepSeek V3.2
- **모델:** deepseek-chat
- **가격:** $0.27/$1.10 per M
- **컨텍스트:** 128K
- **특징:** 가성비 최고, 코딩 구현에 적합
- **추천:** ⭐⭐⭐⭐⭐ (기본 모델)

#### deepseek-reasoner
- **이름:** DeepSeek Reasoner (V3.2)
- **모델:** deepseek-reasoner
- **가격:** $0.55/$2.19 per M
- **컨텍스트:** 128K
- **특징:** 의도 분류/계획 수립용, 추론 모드
- **추천:** ⭐⭐⭐⭐ (자동 사용됨)

---

### OpenAI
**API 키:** https://platform.openai.com

#### gpt-4o
- **이름:** GPT-4o
- **가격:** $2.5/$10 per M
- **컨텍스트:** 128K
- **특징:** 최신 모델, 빠르고 강력함
- **추천:** ⭐⭐⭐⭐

#### gpt-4o-mini
- **이름:** GPT-4o Mini
- **가격:** $0.15/$0.60 per M
- **컨텍스트:** 128K
- **특징:** 경량 버전, 빠르고 저렴함
- **추천:** ⭐⭐⭐⭐

#### o1
- **이름:** OpenAI o1
- **가격:** $15/$60 per M
- **컨텍스트:** 200K
- **특징:** 추론 특화, 복잡한 문제 해결
- **추천:** ⭐⭐⭐ (비쌈)

---

### Anthropic (Claude)
**API 키:** https://console.anthropic.com

#### claude-sonnet
- **이름:** Claude 4 Sonnet
- **가격:** $3/$15 per M
- **컨텍스트:** 200K
- **특징:** 최신 균형 모델
- **추천:** ⭐⭐⭐⭐

#### claude-opus
- **이름:** Claude 4.5 Opus
- **가격:** $15/$75 per M
- **컨텍스트:** 200K
- **특징:** 최강 모델, 복잡한 작업에 최적
- **추천:** ⭐⭐⭐ (매우 비쌈)

#### claude-haiku
- **이름:** Claude 3.5 Haiku
- **가격:** $0.8/$4 per M
- **컨텍스트:** 200K
- **특징:** 경량 모델, 빠르고 저렴
- **추천:** ⭐⭐⭐⭐

---

### MiniMax (중국)
**API 키:** https://api.minimax.chat

#### minimax-01
- **이름:** MiniMax-01
- **가격:** $0.07/$0.28 per M
- **컨텍스트:** 245K
- **특징:** 초저렴, 코딩 작업에 적합, 긴 컨텍스트
- **추천:** ⭐⭐⭐⭐⭐ (가성비)

---

### Qwen (Alibaba)
**API 키:** https://dashscope.console.aliyun.com

#### qwq-32b
- **이름:** QwQ 32B Preview
- **가격:** $0.06/$0.06 per M
- **컨텍스트:** 32K
- **특징:** 초저렴 추론 모델, 수학/코딩 특화
- **추천:** ⭐⭐⭐⭐⭐ (추론 최고 가성비)

#### qwen-turbo
- **이름:** Qwen Turbo
- **가격:** $0.03/$0.06 per M
- **컨텍스트:** 128K
- **특징:** 초고속 경량 모델, 매우 저렴
- **추천:** ⭐⭐⭐⭐⭐ (가장 저렴!)

---

### Google Gemini
**API 키:** https://aistudio.google.com/app/apikey

#### gemini-flash
- **이름:** Gemini 2.0 Flash
- **가격:** **FREE** (무료!)
- **컨텍스트:** 1M (100만 토큰!)
- **특징:** 초고속, 무료 사용 가능, 긴 컨텍스트
- **추천:** ⭐⭐⭐⭐⭐ (무료!)

---

### Groq (초고속 추론)
**API 키:** https://console.groq.com

#### groq-llama-70b
- **이름:** Llama 3.3 70B (Groq)
- **가격:** $0.59/$0.79 per M (무료 티어 있음)
- **컨텍스트:** 128K
- **특징:** 초고속 추론 (~500 tokens/sec)
- **추천:** ⭐⭐⭐⭐⭐ (속도)

#### groq-mixtral
- **이름:** Mixtral 8x7B (Groq)
- **가격:** $0.24/$0.24 per M (무료 티어 있음)
- **컨텍스트:** 32K
- **특징:** 초고속 MoE 모델
- **추천:** ⭐⭐⭐⭐

---

## 💡 추천 시나리오

### 비용 최소화
```bash
# 가장 저렴한 모델
pnpm kcode -m qwen-turbo "간단한 작업"

# 추론이 필요한 경우
pnpm kcode -m qwq-32b "복잡한 로직 구현"
```

### 무료로 사용
```bash
# Google Gemini (완전 무료)
pnpm kcode -m gemini-flash "테스트 작업"

# Groq (무료 티어)
pnpm kcode -m groq-llama-70b "빠른 응답"
```

### 고품질 응답
```bash
# DeepSeek (가성비)
pnpm kcode -m deepseek "일반 코딩"

# Claude Haiku (품질)
pnpm kcode -m claude-haiku "높은 품질 필요"
```

### 초고속 응답
```bash
# Groq (500 tokens/sec)
pnpm kcode -m groq-llama-70b "빠른 응답 필요"
pnpm kcode -m groq-mixtral "더 빠른 응답"
```

### 긴 컨텍스트
```bash
# Gemini (1M 토큰)
pnpm kcode -m gemini-flash "대용량 파일 처리"

# MiniMax (245K 토큰)
pnpm kcode -m minimax-01 "긴 컨텍스트"
```

---

## 📈 비용 비교 (1M 토큰 기준)

### 입력 토큰
1. Gemini Flash: **FREE** 🏆
2. Qwen Turbo: $0.03
3. QwQ 32B: $0.06
4. MiniMax: $0.07
5. GPT-4o Mini: $0.15
6. DeepSeek: $0.27

### 출력 토큰
1. Gemini Flash: **FREE** 🏆
2. QwQ 32B: $0.06
3. Qwen Turbo: $0.06
4. Groq Mixtral: $0.24
5. MiniMax: $0.28
6. GPT-4o Mini: $0.60

---

## 🔑 API 키 발급 링크

| 프로바이더 | 발급 링크 | 무료 티어 |
|-----------|----------|-----------|
| **DeepSeek** | https://platform.deepseek.com | ✅ $5 크레딧 |
| **OpenAI** | https://platform.openai.com | ✅ $5 크레딧 |
| **Anthropic** | https://console.anthropic.com | ✅ $5 크레딧 |
| **MiniMax** | https://api.minimax.chat | ⚠️ 확인 필요 |
| **Qwen** | https://dashscope.console.aliyun.com | ✅ 크레딧 제공 |
| **Google** | https://aistudio.google.com/app/apikey | ✅ 완전 무료 |
| **Groq** | https://console.groq.com | ✅ 무료 티어 |

---

## 📝 참고사항

- 가격은 2026년 1월 기준이며 변경될 수 있습니다
- 무료 티어는 사용량 제한이 있을 수 있습니다
- 일부 모델은 지역 제한이 있을 수 있습니다
- 컨텍스트 길이는 최대값이며, 실제 사용 시 제한될 수 있습니다
