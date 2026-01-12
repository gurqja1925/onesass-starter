#!/bin/bash

# K-Code 배포 후 Git 태깅 스크립트
# 사용법: ./scripts/post-publish.sh

set -e

cd "$(dirname "$0")/.."

VERSION=$(node -p "require('./packages/kcode/package.json').version")

echo "📌 K-Code v$VERSION Git 태깅 중..."
echo ""

# Git 상태 확인
if ! git diff-index --quiet HEAD --; then
  echo "⚠️  커밋되지 않은 변경사항이 있습니다."
  echo ""
  git status
  echo ""
  read -p "   계속하시겠습니까? (y/N): " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 취소됨"
    exit 1
  fi
fi

# package.json 커밋
echo "📝 package.json 변경사항 커밋 중..."
git add packages/kcode/package.json
git commit -m "chore(kcode): release v$VERSION"
echo ""

# Git 태그 생성
echo "🏷️  Git 태그 생성 중: kcode-v$VERSION"
git tag "kcode-v$VERSION"
echo ""

# 푸시 확인
echo "⚠️  Git 푸시 확인"
echo "   태그: kcode-v$VERSION"
echo ""
read -p "   main 브랜치와 태그를 푸시하시겠습니까? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🚀 푸시 중..."
  git push origin main --tags
  echo ""
  echo "✨ 완료!"
  echo ""
  echo "🔗 GitHub 릴리스:"
  echo "   https://github.com/onesaas/kcode/releases/tag/kcode-v$VERSION"
else
  echo "❌ 푸시 취소됨"
  echo ""
  echo "나중에 수동으로 푸시하려면:"
  echo "   git push origin main --tags"
fi
