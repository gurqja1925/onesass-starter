#!/bin/bash

# K-Code npm 배포 스크립트
# 사용법:
#   ./scripts/publish-kcode.sh patch   # 1.0.0 → 1.0.1
#   ./scripts/publish-kcode.sh minor   # 1.0.0 → 1.1.0
#   ./scripts/publish-kcode.sh major   # 1.0.0 → 2.0.0

set -e

VERSION_TYPE=${1:-patch}

echo "🚀 K-Code npm 배포 시작..."
echo ""

# 1. npm 로그인 확인
echo "📋 Step 1/4: npm 로그인 확인..."
if ! npm whoami &> /dev/null; then
  echo "❌ npm에 로그인되어 있지 않습니다."
  echo "   터미널에서 'npm login'을 실행하세요."
  exit 1
fi

CURRENT_USER=$(npm whoami)
echo "✅ 로그인됨: $CURRENT_USER"
echo ""

# 2. 패키지 준비
echo "📦 Step 2/4: 패키지 준비 중..."
cd "$(dirname "$0")/.."
pnpm kcode:package
echo ""

# 3. 버전 업데이트
echo "🔢 Step 3/4: 버전 업데이트 ($VERSION_TYPE)..."
cd packages/kcode
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "   현재 버전: $CURRENT_VERSION"

npm version $VERSION_TYPE
NEW_VERSION=$(node -p "require('./package.json').version")
echo "   새 버전: $NEW_VERSION"
echo ""

# 4. 배포 확인
echo "⚠️  Step 4/4: 배포 확인"
echo "   패키지: onesaas-kcode@$NEW_VERSION"
echo "   레지스트리: https://registry.npmjs.org/"
echo ""
read -p "   npm에 배포하시겠습니까? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ 배포 취소됨"
  exit 1
fi

# 5. 배포
echo "🚀 배포 중..."
echo ""

# 2FA 확인
read -p "   2FA가 활성화되어 있나요? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo ""
  echo "   📱 npm Authenticator 앱을 열어 6자리 코드를 확인하세요"
  read -p "   OTP 코드 입력: " OTP_CODE
  npm publish --otp="$OTP_CODE"
else
  npm publish
fi

echo ""
echo "✨ 배포 완료!"
echo ""
echo "📦 설치 방법:"
echo "   npm install -g onesaas-kcode"
echo ""
echo "🔗 패키지 페이지:"
echo "   https://www.npmjs.com/package/onesaas-kcode"
echo ""
echo "📋 Git 태그 푸시:"
echo "   cd ../.."
echo "   git add packages/kcode/package.json"
echo "   git commit -m \"chore(kcode): release v$NEW_VERSION\""
echo "   git tag kcode-v$NEW_VERSION"
echo "   git push origin main --tags"
