/**
 * K-Code 설정 UI (개선 버전)
 * 용도별 모델 선택 + 가격 표시
 */

import React, { useState } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { AVAILABLE_MODELS, getApiKey, saveApiKey, type ModelInfo, type Provider } from './models';

interface SettingsUIProps {
  onExit: () => void;
}

type Screen = 'provider-select' | 'api-key-input' | 'model-select' | 'summary';

export function SettingsUI({ onExit }: SettingsUIProps) {
  const { exit } = useApp();
  const [screen, setScreen] = useState<Screen>('provider-select');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [cursorIndex, setCursorIndex] = useState(0);

  const providers: Array<{ id: Provider; name: string; emoji: string }> = [
    { id: 'google', name: 'Google Gemini', emoji: '🆓' },
    { id: 'groq', name: 'Groq', emoji: '🆓' },
    { id: 'qwen', name: 'Qwen (Alibaba)', emoji: '💎' },
    { id: 'minimax', name: 'MiniMax', emoji: '💎' },
    { id: 'deepseek', name: 'DeepSeek', emoji: '🔧' },
  ];

  // 프로바이더별 모델 필터링
  const getModelsByProvider = (provider: Provider): ModelInfo[] => {
    return AVAILABLE_MODELS.filter(m => m.provider === provider);
  };

  // 키 입력 처리
  useInput((input, key) => {
    // API 키 입력 모드
    if (screen === 'api-key-input') {
      if (key.return) {
        if (inputValue.trim() && selectedProvider) {
          const success = saveApiKey(inputValue.trim(), selectedProvider);
          if (success) {
            setInputValue('');
            setScreen('summary');
          }
        }
      } else if (key.backspace || key.delete) {
        setInputValue(inputValue.slice(0, -1));
      } else if (input && !key.ctrl) {
        setInputValue(inputValue + input);
      }
      return;
    }

    // Provider 선택 화면
    if (screen === 'provider-select') {
      if (key.upArrow) {
        setCursorIndex(Math.max(0, cursorIndex - 1));
      } else if (key.downArrow) {
        setCursorIndex(Math.min(providers.length - 1, cursorIndex + 1));
      } else if (key.return) {
        setSelectedProvider(providers[cursorIndex].id);
        setScreen('api-key-input');
      } else if (input === 'q') {
        onExit();
        exit();
      }
    }

    // 요약 화면
    if (screen === 'summary') {
      if (input === 'q' || key.return) {
        onExit();
        exit();
      } else if (input === 'r') {
        setSelectedProvider(null);
        setInputValue('');
        setCursorIndex(0);
        setScreen('provider-select');
      }
    }
  });

  // 화면 렌더링
  return (
    <Box flexDirection="column" padding={1}>
      {/* 헤더 */}
      <Box borderStyle="double" borderColor="cyan" paddingX={2} marginBottom={1}>
        <Text bold color="cyan">⚙️  K-Code 설정 - 무료/저렴한 AI 모델</Text>
      </Box>

      {/* Provider 선택 화면 */}
      {screen === 'provider-select' && (
        <Box flexDirection="column">
          <Text bold color="green">API 키를 설정할 제공자를 선택하세요</Text>
          <Text dimColor>─────────────────────────────────────────</Text>
          <Box marginY={1} />

          {providers.map((provider, idx) => {
            const hasKey = !!getApiKey(provider.id);
            const models = getModelsByProvider(provider.id);
            const isSelected = idx === cursorIndex;

            return (
              <Box key={provider.id} flexDirection="column" marginBottom={1}>
                <Box>
                  <Text color={isSelected ? 'cyan' : 'white'} bold={isSelected}>
                    {isSelected ? '▶ ' : '  '}
                    {provider.emoji} {provider.name}
                  </Text>
                  {hasKey ? (
                    <Text color="green"> ✓ 설정됨</Text>
                  ) : (
                    <Text color="yellow"> ○ 필요</Text>
                  )}
                </Box>

                <Box marginLeft={4} flexDirection="column">
                  {models.map((model, modelIdx) => (
                    <Box key={`${provider.id}-model-${modelIdx}`}>
                      <Text dimColor>
                        • {model.name} - ${model.inputPrice}/${model.outputPrice} per M
                      </Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          })}

          <Box marginY={1} />
          <Text dimColor>↑↓ 선택 · Enter 진행 · q 종료</Text>
        </Box>
      )}

      {/* API 키 입력 화면 */}
      {screen === 'api-key-input' && selectedProvider && (
        <Box flexDirection="column">
          <Text bold color="green">API 키 입력</Text>
          <Text dimColor>─────────────────────────────────────────</Text>
          <Box marginY={1} />

          <Box flexDirection="column" marginBottom={1}>
            <Text>
              제공자: <Text color="cyan" bold>{providers.find(p => p.id === selectedProvider)?.name}</Text>
            </Text>

            <Box marginY={1} />

            <Text bold>사용 가능한 모델:</Text>
            {getModelsByProvider(selectedProvider).map((model, idx) => (
              <Box key={`model-info-${idx}`} marginLeft={2}>
                <Text color="yellow">✦</Text>
                <Text> {model.name}</Text>
                <Text dimColor> - {model.description}</Text>
              </Box>
            ))}

            <Box marginY={1} />

            <Text bold>가격:</Text>
            {getModelsByProvider(selectedProvider).map((model, idx) => (
              <Box key={`price-${idx}`} marginLeft={2}>
                <Text dimColor>
                  {model.name}: ${model.inputPrice} 입력 / ${model.outputPrice} 출력 (per M 토큰)
                </Text>
              </Box>
            ))}
          </Box>

          <Box marginY={1} />

          <Box borderStyle="single" borderColor="yellow" paddingX={1}>
            <Text>API 키: </Text>
            <Text color="cyan">{inputValue || '_'}</Text>
          </Box>

          <Box marginY={1} />
          <Text dimColor>키를 입력하고 Enter · Backspace로 삭제</Text>
        </Box>
      )}

      {/* 요약 화면 */}
      {screen === 'summary' && (
        <Box flexDirection="column">
          <Text bold color="green">✓ 설정 완료!</Text>
          <Text dimColor>─────────────────────────────────────────</Text>
          <Box marginY={1} />

          <Text>
            <Text color="cyan" bold>{providers.find(p => p.id === selectedProvider)?.name}</Text>
            <Text> API 키가 저장되었습니다.</Text>
          </Text>

          <Box marginY={1} />

          <Text bold>설정된 제공자:</Text>
          {providers.map((provider, idx) => {
            const hasKey = !!getApiKey(provider.id);
            if (!hasKey) return null;

            return (
              <Box key={`summary-${idx}`} marginLeft={2}>
                <Text color="green">✓</Text>
                <Text> {provider.emoji} {provider.name}</Text>
              </Box>
            );
          })}

          <Box marginY={1} />
          <Text dimColor>Enter 종료 · r 다른 키 추가 · q 종료</Text>
        </Box>
      )}

      {/* 푸터 */}
      <Box marginTop={1} borderStyle="single" borderColor="gray" paddingX={1}>
        <Text dimColor>💡 무료 모델 우선 추천: Gemini 3 Flash, Groq</Text>
      </Box>
    </Box>
  );
}
