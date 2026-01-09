// GitHub API 클라이언트

import type { RepositoryInfo, DirectoryEntry, FileOperation } from './types'

export class GitHubClient {
  private token: string
  private baseUrl = 'https://api.github.com'

  constructor(token: string) {
    this.token = token
  }

  private async fetch(path: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`GitHub API Error: ${response.status} - ${error.message || response.statusText}`)
    }

    return response.json()
  }

  // 저장소 정보 가져오기
  async getRepositoryInfo(owner: string, repo: string): Promise<RepositoryInfo> {
    const data = await this.fetch(`/repos/${owner}/${repo}`)
    return {
      owner,
      repo,
      defaultBranch: data.default_branch,
    }
  }

  // 디렉토리 구조 가져오기
  async getDirectoryStructure(
    owner: string,
    repo: string,
    path: string = '',
    branch?: string
  ): Promise<DirectoryEntry[]> {
    const ref = branch ? `?ref=${branch}` : ''
    const data = await this.fetch(`/repos/${owner}/${repo}/contents/${path}${ref}`)

    if (!Array.isArray(data)) {
      return []
    }

    return data.map((item: { name: string; path: string; type: string }) => ({
      name: item.name,
      path: item.path,
      type: item.type === 'dir' ? 'dir' : 'file',
    }))
  }

  // 재귀적으로 전체 구조 가져오기 (최대 깊이 제한)
  async getFullStructure(
    owner: string,
    repo: string,
    branch?: string,
    maxDepth: number = 3
  ): Promise<DirectoryEntry[]> {
    const getRecursive = async (path: string, depth: number): Promise<DirectoryEntry[]> => {
      if (depth > maxDepth) return []

      try {
        const entries = await this.getDirectoryStructure(owner, repo, path, branch)

        for (const entry of entries) {
          if (entry.type === 'dir' && !this.shouldSkipDir(entry.name)) {
            entry.children = await getRecursive(entry.path, depth + 1)
          }
        }

        return entries
      } catch {
        return []
      }
    }

    return getRecursive('', 0)
  }

  private shouldSkipDir(name: string): boolean {
    const skipDirs = ['node_modules', '.git', '.next', 'dist', 'build', '.vercel', 'coverage']
    return skipDirs.includes(name)
  }

  // 파일 내용 읽기
  async getFileContent(owner: string, repo: string, path: string, branch?: string): Promise<string> {
    const ref = branch ? `?ref=${branch}` : ''
    const data = await this.fetch(`/repos/${owner}/${repo}/contents/${path}${ref}`)

    if (data.type !== 'file') {
      throw new Error(`${path} is not a file`)
    }

    return Buffer.from(data.content, 'base64').toString('utf-8')
  }

  // 파일 SHA 가져오기
  async getFileSha(owner: string, repo: string, path: string, branch?: string): Promise<string | null> {
    try {
      const ref = branch ? `?ref=${branch}` : ''
      const data = await this.fetch(`/repos/${owner}/${repo}/contents/${path}${ref}`)
      return data.sha
    } catch {
      return null
    }
  }

  // 브랜치 생성
  async createBranch(owner: string, repo: string, branchName: string, fromBranch: string): Promise<void> {
    // 소스 브랜치의 최신 커밋 SHA 가져오기
    const ref = await this.fetch(`/repos/${owner}/${repo}/git/ref/heads/${fromBranch}`)
    const sha = ref.object.sha

    // 새 브랜치 생성
    await this.fetch(`/repos/${owner}/${repo}/git/refs`, {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha,
      }),
    })
  }

  // 브랜치 존재 확인
  async branchExists(owner: string, repo: string, branchName: string): Promise<boolean> {
    try {
      await this.fetch(`/repos/${owner}/${repo}/git/ref/heads/${branchName}`)
      return true
    } catch {
      return false
    }
  }

  // 파일 생성/업데이트
  async createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch: string
  ): Promise<void> {
    const sha = await this.getFileSha(owner, repo, path, branch)
    const encodedContent = Buffer.from(content).toString('base64')

    await this.fetch(`/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: encodedContent,
        branch,
        ...(sha && { sha }),
      }),
    })
  }

  // 파일 삭제
  async deleteFile(
    owner: string,
    repo: string,
    path: string,
    message: string,
    branch: string
  ): Promise<void> {
    const sha = await this.getFileSha(owner, repo, path, branch)
    if (!sha) {
      throw new Error(`File not found: ${path}`)
    }

    await this.fetch(`/repos/${owner}/${repo}/contents/${path}`, {
      method: 'DELETE',
      body: JSON.stringify({
        message,
        sha,
        branch,
      }),
    })
  }

  // 여러 파일 변경 (단일 커밋)
  async commitMultipleFiles(
    owner: string,
    repo: string,
    branch: string,
    message: string,
    changes: FileOperation[]
  ): Promise<string> {
    // 현재 커밋 가져오기
    const ref = await this.fetch(`/repos/${owner}/${repo}/git/ref/heads/${branch}`)
    const latestCommitSha = ref.object.sha

    // 현재 트리 가져오기
    const commit = await this.fetch(`/repos/${owner}/${repo}/git/commits/${latestCommitSha}`)
    const treeSha = commit.tree.sha

    // 새 트리 항목 생성
    const treeItems = await Promise.all(
      changes.map(async (change) => {
        if (change.action === 'delete') {
          return null // 삭제는 별도 처리
        }

        // Blob 생성
        const blob = await this.fetch(`/repos/${owner}/${repo}/git/blobs`, {
          method: 'POST',
          body: JSON.stringify({
            content: change.content,
            encoding: 'utf-8',
          }),
        })

        return {
          path: change.path,
          mode: '100644',
          type: 'blob',
          sha: blob.sha,
        }
      })
    )

    // null 제거 (삭제 파일)
    const validTreeItems = treeItems.filter(Boolean)

    // 새 트리 생성
    const newTree = await this.fetch(`/repos/${owner}/${repo}/git/trees`, {
      method: 'POST',
      body: JSON.stringify({
        base_tree: treeSha,
        tree: validTreeItems,
      }),
    })

    // 새 커밋 생성
    const newCommit = await this.fetch(`/repos/${owner}/${repo}/git/commits`, {
      method: 'POST',
      body: JSON.stringify({
        message,
        tree: newTree.sha,
        parents: [latestCommitSha],
      }),
    })

    // 브랜치 업데이트
    await this.fetch(`/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
      method: 'PATCH',
      body: JSON.stringify({
        sha: newCommit.sha,
      }),
    })

    return newCommit.sha
  }

  // Pull Request 생성
  async createPullRequest(
    owner: string,
    repo: string,
    title: string,
    body: string,
    head: string,
    base: string
  ): Promise<{ url: string; number: number }> {
    const pr = await this.fetch(`/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        body,
        head,
        base,
      }),
    })

    return {
      url: pr.html_url,
      number: pr.number,
    }
  }

  // 코드 검색
  async searchCode(owner: string, repo: string, query: string): Promise<Array<{ path: string; matches: string[] }>> {
    const data = await this.fetch(`/search/code?q=${encodeURIComponent(query)}+repo:${owner}/${repo}`)

    return data.items.map((item: { path: string; text_matches?: Array<{ fragment: string }> }) => ({
      path: item.path,
      matches: item.text_matches?.map((m) => m.fragment) || [],
    }))
  }

  // 파일 검색 (이름으로)
  async searchFiles(owner: string, repo: string, filename: string): Promise<string[]> {
    const data = await this.fetch(`/search/code?q=filename:${encodeURIComponent(filename)}+repo:${owner}/${repo}`)
    return data.items.map((item: { path: string }) => item.path)
  }
}
