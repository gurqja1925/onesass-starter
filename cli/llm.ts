/**
 * K 코드 - 다중 LLM 프로바이더 지원
 */

import {
  type LLMConfig,
  type LLMResponse,
  type Message,
  type ToolCall,
  type ToolSchema,
  ToolChoice,
  Role,
} from './types';
import { type Provider } from './models';

// ============================================================
// LLM 클래스 (다중 프로바이더 지원)
// ============================================================

export class LLM {
  private config: LLMConfig;

  constructor(config: Partial<LLMConfig> = {}) {
    this.config = {
      model: config.model || 'deepseek-chat',
      apiKey: config.apiKey || '',
      baseUrl: config.baseUrl || 'https://api.deepseek.com',
      maxTokens: config.maxTokens || 8192,
      temperature: config.temperature ?? 0.7,
      provider: config.provider || 'deepseek',
    };
  }

  /**
   * 기본 텍스트 대화
   */
  async ask(
    messages: Message[],
    systemMessages?: Message[]
  ): Promise<LLMResponse> {
    const allMessages = this.prepareMessages(messages, systemMessages);
    return this.callAPI(allMessages);
  }

  /**
   * 도구 호출 포함 대화
   */
  async askTool(
    messages: Message[],
    tools: ToolSchema[],
    toolChoice: ToolChoice = ToolChoice.AUTO,
    systemMessages?: Message[]
  ): Promise<LLMResponse> {
    const allMessages = this.prepareMessages(messages, systemMessages);
    return this.callAPIWithTools(allMessages, tools, toolChoice);
  }

  // ============================================================
  // API 호출 (프로바이더별 분기)
  // ============================================================

  private async callAPI(messages: Message[]): Promise<LLMResponse> {
    switch (this.config.provider) {
      case 'anthropic':
        return this.callAnthropic(messages);
      case 'openai':
        return this.callOpenAI(messages);
      case 'deepseek':
      default:
        return this.callDeepSeek(messages);
    }
  }

  private async callAPIWithTools(
    messages: Message[],
    tools: ToolSchema[],
    toolChoice: ToolChoice
  ): Promise<LLMResponse> {
    switch (this.config.provider) {
      case 'anthropic':
        return this.callAnthropicWithTools(messages, tools, toolChoice);
      case 'openai':
        return this.callOpenAIWithTools(messages, tools, toolChoice);
      case 'deepseek':
      default:
        return this.callDeepSeekWithTools(messages, tools, toolChoice);
    }
  }

  // ============================================================
  // DeepSeek API
  // ============================================================

  private async callDeepSeek(messages: Message[]): Promise<LLMResponse> {
    const response = await fetch(`${this.config.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: this.toOpenAIMessages(messages),
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      const error = await response.json() as { error?: { message?: string } };
      throw new Error(error.error?.message || `DeepSeek API Error: ${response.status}`);
    }

    const data = await response.json() as {
      choices: Array<{ message: { content: string | null }; finish_reason: string }>;
      usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
    };
    const choice = data.choices[0];

    return {
      content: choice.message.content,
      finishReason: choice.finish_reason,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      } : undefined,
    };
  }

  private async callDeepSeekWithTools(
    messages: Message[],
    tools: ToolSchema[],
    toolChoice: ToolChoice
  ): Promise<LLMResponse> {
    const response = await fetch(`${this.config.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: this.toOpenAIMessages(messages),
        tools: tools,
        tool_choice: toolChoice,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      const error = await response.json() as { error?: { message?: string } };
      throw new Error(error.error?.message || `DeepSeek API Error: ${response.status}`);
    }

    const data = await response.json() as Parameters<typeof this.parseOpenAIResponse>[0];
    return this.parseOpenAIResponse(data);
  }

  // ============================================================
  // OpenAI API
  // ============================================================

  private async callOpenAI(messages: Message[]): Promise<LLMResponse> {
    const response = await fetch(`${this.config.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: this.toOpenAIMessages(messages),
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      const error = await response.json() as { error?: { message?: string } };
      throw new Error(error.error?.message || `OpenAI API Error: ${response.status}`);
    }

    const data = await response.json() as {
      choices: Array<{ message: { content: string | null }; finish_reason: string }>;
      usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
    };
    const choice = data.choices[0];

    return {
      content: choice.message.content,
      finishReason: choice.finish_reason,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      } : undefined,
    };
  }

  private async callOpenAIWithTools(
    messages: Message[],
    tools: ToolSchema[],
    toolChoice: ToolChoice
  ): Promise<LLMResponse> {
    const response = await fetch(`${this.config.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: this.toOpenAIMessages(messages),
        tools: tools,
        tool_choice: toolChoice,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      const error = await response.json() as { error?: { message?: string } };
      throw new Error(error.error?.message || `OpenAI API Error: ${response.status}`);
    }

    const data = await response.json() as Parameters<typeof this.parseOpenAIResponse>[0];
    return this.parseOpenAIResponse(data);
  }

  // ============================================================
  // Anthropic API
  // ============================================================

  private async callAnthropic(messages: Message[]): Promise<LLMResponse> {
    // 시스템 메시지 분리
    const { systemPrompt, userMessages } = this.extractSystemMessage(messages);

    const response = await fetch(`${this.config.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        system: systemPrompt,
        messages: this.toAnthropicMessages(userMessages),
      }),
    });

    if (!response.ok) {
      const error = await response.json() as { error?: { message?: string } };
      throw new Error(error.error?.message || `Anthropic API Error: ${response.status}`);
    }

    const data = await response.json() as {
      content: Array<{ type: string; text?: string }>;
      stop_reason: string;
      usage?: { input_tokens: number; output_tokens: number };
    };

    const textContent = data.content.find(c => c.type === 'text');

    return {
      content: textContent?.text || null,
      finishReason: data.stop_reason,
      usage: data.usage ? {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      } : undefined,
    };
  }

  private async callAnthropicWithTools(
    messages: Message[],
    tools: ToolSchema[],
    toolChoice: ToolChoice
  ): Promise<LLMResponse> {
    const { systemPrompt, userMessages } = this.extractSystemMessage(messages);

    // Anthropic 도구 형식으로 변환
    const anthropicTools = tools.map(t => ({
      name: t.function.name,
      description: t.function.description,
      input_schema: t.function.parameters,
    }));

    // tool_choice 변환
    let anthropicToolChoice: { type: string; name?: string } | undefined;
    if (toolChoice === ToolChoice.REQUIRED) {
      anthropicToolChoice = { type: 'any' };
    } else if (toolChoice === ToolChoice.NONE) {
      anthropicToolChoice = { type: 'none' };
    } else {
      anthropicToolChoice = { type: 'auto' };
    }

    const response = await fetch(`${this.config.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        system: systemPrompt,
        messages: this.toAnthropicMessages(userMessages),
        tools: anthropicTools,
        tool_choice: anthropicToolChoice,
      }),
    });

    if (!response.ok) {
      const error = await response.json() as { error?: { message?: string } };
      throw new Error(error.error?.message || `Anthropic API Error: ${response.status}`);
    }

    const data = await response.json() as {
      content: Array<{
        type: string;
        text?: string;
        id?: string;
        name?: string;
        input?: Record<string, unknown>;
      }>;
      stop_reason: string;
      usage?: { input_tokens: number; output_tokens: number };
    };

    // 텍스트와 도구 호출 추출
    const textContent = data.content.find(c => c.type === 'text');
    const toolUseBlocks = data.content.filter(c => c.type === 'tool_use');

    const toolCalls: ToolCall[] | undefined = toolUseBlocks.length > 0
      ? toolUseBlocks.map(tc => ({
          id: tc.id!,
          type: 'function' as const,
          function: {
            name: tc.name!,
            arguments: JSON.stringify(tc.input),
          },
        }))
      : undefined;

    return {
      content: textContent?.text || null,
      toolCalls,
      finishReason: data.stop_reason,
      usage: data.usage ? {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      } : undefined,
    };
  }

  // ============================================================
  // 메시지 변환
  // ============================================================

  private prepareMessages(
    messages: Message[],
    systemMessages?: Message[]
  ): Message[] {
    const allMessages: Message[] = [];

    if (systemMessages) {
      allMessages.push(...systemMessages);
    }

    allMessages.push(...messages);

    return allMessages;
  }

  private extractSystemMessage(messages: Message[]): { systemPrompt: string; userMessages: Message[] } {
    const systemMessages = messages.filter(m => m.role === Role.SYSTEM);
    const userMessages = messages.filter(m => m.role !== Role.SYSTEM);
    const systemPrompt = systemMessages.map(m => m.content).join('\n\n');
    return { systemPrompt, userMessages };
  }

  private toOpenAIMessages(
    messages: Message[]
  ): Array<{
    role: string;
    content: string | null;
    tool_calls?: Array<{
      id: string;
      type: string;
      function: { name: string; arguments: string };
    }>;
    tool_call_id?: string;
    name?: string;
  }> {
    return messages.map(m => {
      const msg: {
        role: string;
        content: string | null;
        tool_calls?: Array<{
          id: string;
          type: string;
          function: { name: string; arguments: string };
        }>;
        tool_call_id?: string;
        name?: string;
      } = {
        role: m.role,
        content: m.content,
      };

      if (m.toolCalls) {
        msg.tool_calls = m.toolCalls;
      }
      if (m.toolCallId) {
        msg.tool_call_id = m.toolCallId;
      }
      if (m.name) {
        msg.name = m.name;
      }

      return msg;
    });
  }

  private toAnthropicMessages(
    messages: Message[]
  ): Array<{
    role: string;
    content: string | Array<{ type: string; tool_use_id?: string; content?: string; id?: string; name?: string; input?: unknown }>;
  }> {
    const result: Array<{
      role: string;
      content: string | Array<{ type: string; tool_use_id?: string; content?: string; id?: string; name?: string; input?: unknown }>;
    }> = [];

    for (const m of messages) {
      if (m.role === Role.ASSISTANT) {
        if (m.toolCalls && m.toolCalls.length > 0) {
          // 도구 호출이 있는 어시스턴트 메시지
          const content: Array<{ type: string; id?: string; name?: string; input?: unknown; text?: string }> = [];
          if (m.content) {
            content.push({ type: 'text', text: m.content });
          }
          for (const tc of m.toolCalls) {
            content.push({
              type: 'tool_use',
              id: tc.id,
              name: tc.function.name,
              input: JSON.parse(tc.function.arguments),
            });
          }
          result.push({ role: 'assistant', content });
        } else {
          result.push({ role: 'assistant', content: m.content || '' });
        }
      } else if (m.role === Role.TOOL) {
        // 도구 결과
        result.push({
          role: 'user',
          content: [
            {
              type: 'tool_result',
              tool_use_id: m.toolCallId,
              content: m.content || '',
            },
          ],
        });
      } else {
        result.push({ role: 'user', content: m.content || '' });
      }
    }

    return result;
  }

  private parseOpenAIResponse(data: {
    choices: Array<{
      message: {
        content: string | null;
        tool_calls?: Array<{
          id: string;
          type: string;
          function: { name: string; arguments: string };
        }>;
      };
      finish_reason: string;
    }>;
    usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  }): LLMResponse {
    const choice = data.choices[0];
    const message = choice.message;

    const toolCalls: ToolCall[] | undefined = message.tool_calls?.map(tc => ({
      id: tc.id,
      type: 'function' as const,
      function: {
        name: tc.function.name,
        arguments: tc.function.arguments,
      },
    }));

    return {
      content: message.content,
      toolCalls,
      finishReason: choice.finish_reason,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      } : undefined,
    };
  }
}

// ============================================================
// 기본 인스턴스
// ============================================================

import { getCurrentModel, getApiKey, type ModelInfo } from './models';

let defaultLLM: LLM | null = null;

export function getDefaultLLM(): LLM {
  if (!defaultLLM) {
    const model = getCurrentModel();
    const apiKey = getApiKey(model.provider);

    if (!apiKey) {
      const envVar = {
        deepseek: 'DEEPSEEK_API_KEY',
        openai: 'OPENAI_API_KEY',
        anthropic: 'ANTHROPIC_API_KEY',
      }[model.provider];
      throw new Error(`${envVar}가 필요합니다`);
    }

    defaultLLM = new LLM({
      model: model.model,
      apiKey,
      maxTokens: model.maxTokens,
      baseUrl: model.baseUrl,
      provider: model.provider,
    });
  }
  return defaultLLM;
}

export function switchModel(modelId: string): ModelInfo | null {
  const { setCurrentModel } = require('./models') as { setCurrentModel: (id: string) => ModelInfo | null };
  const model = setCurrentModel(modelId);
  if (model) {
    const apiKey = getApiKey(model.provider);
    if (!apiKey) {
      const envVars: Record<string, string> = {
        deepseek: 'DEEPSEEK_API_KEY',
        openai: 'OPENAI_API_KEY',
        anthropic: 'ANTHROPIC_API_KEY',
      };
      const envVar = envVars[model.provider];
      console.warn(`${envVar}가 없습니다.`);
      return null;
    }
    defaultLLM = new LLM({
      model: model.model,
      apiKey,
      maxTokens: model.maxTokens,
      baseUrl: model.baseUrl,
      provider: model.provider,
    });
    return model;
  }
  return null;
}

export { getAvailableModels, getCurrentModel } from './models';

export function createLLM(config: Partial<LLMConfig>): LLM {
  return new LLM(config);
}
