// AI Agent API 라우트

import { NextRequest } from 'next/server'
import { AIAgent, AgentTask, AgentEvent } from '@/lib/ai-agent'

// 작업 실행 (스트리밍)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { task, repository, githubToken, model } = body

    if (!task || !repository) {
      return Response.json(
        { error: '작업 설명과 저장소가 필요합니다' },
        { status: 400 }
      )
    }

    if (!githubToken) {
      return Response.json(
        { error: 'GitHub 토큰이 필요합니다' },
        { status: 400 }
      )
    }

    // 에이전트 생성
    const agent = new AIAgent({
      githubToken,
      model: model || 'gemini-2.0-flash',
    })

    // 스트리밍 응답 설정
    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()

    // 이벤트 핸들러
    agent.onEvent(async (event: AgentEvent) => {
      const data = JSON.stringify(event)
      await writer.write(encoder.encode(`data: ${data}\n\n`))
    })

    // 작업 객체 생성
    const agentTask: AgentTask = {
      id: Date.now().toString(),
      description: task,
      repository,
      status: 'pending',
      createdAt: new Date(),
    }

    // 비동기로 실행
    ;(async () => {
      try {
        const result = await agent.execute(agentTask)
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ type: 'result', data: result })}\n\n`)
        )
      } catch (error) {
        const message = error instanceof Error ? error.message : '알 수 없는 오류'
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', data: { message } })}\n\n`)
        )
      } finally {
        await writer.close()
      }
    })()

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('AI Agent Error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : '서버 오류' },
      { status: 500 }
    )
  }
}

// 간단한 실행 (비스트리밍)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { task, repository, githubToken, model } = body

    if (!task || !repository) {
      return Response.json(
        { error: '작업 설명과 저장소가 필요합니다' },
        { status: 400 }
      )
    }

    if (!githubToken) {
      return Response.json(
        { error: 'GitHub 토큰이 필요합니다' },
        { status: 400 }
      )
    }

    const agent = new AIAgent({
      githubToken,
      model: model || 'gemini-2.0-flash',
    })

    const agentTask: AgentTask = {
      id: Date.now().toString(),
      description: task,
      repository,
      status: 'pending',
      createdAt: new Date(),
    }

    const result = await agent.execute(agentTask)

    return Response.json(result)
  } catch (error) {
    console.error('AI Agent Error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : '서버 오류' },
      { status: 500 }
    )
  }
}
