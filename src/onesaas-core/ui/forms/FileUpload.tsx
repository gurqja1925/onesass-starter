'use client'

/**
 * FileUpload 컴포넌트
 * 파일 업로드
 */

import { useState, useRef, forwardRef, InputHTMLAttributes } from 'react'
import { Upload, X, File, Image, FileText } from 'lucide-react'

export interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  hint?: string
  error?: string
  maxSize?: number // MB
  maxFiles?: number
  accept?: string
  preview?: boolean
  onChange?: (files: File[]) => void
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      label,
      hint,
      error,
      maxSize = 10,
      maxFiles = 5,
      accept,
      preview = true,
      onChange,
      className = '',
      ...props
    },
    ref
  ) => {
    const [files, setFiles] = useState<File[]>([])
    const [dragOver, setDragOver] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFiles = (newFiles: FileList | null) => {
      if (!newFiles) return

      const validFiles = Array.from(newFiles).filter(file => {
        if (file.size > maxSize * 1024 * 1024) return false
        return true
      }).slice(0, maxFiles - files.length)

      const updatedFiles = [...files, ...validFiles]
      setFiles(updatedFiles)
      onChange?.(updatedFiles)
    }

    const removeFile = (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index)
      setFiles(updatedFiles)
      onChange?.(updatedFiles)
    }

    const getFileIcon = (type: string) => {
      if (type.startsWith('image/')) return <Image className="w-8 h-8" />
      if (type.includes('pdf')) return <FileText className="w-8 h-8" />
      return <File className="w-8 h-8" />
    }

    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
            {label}
          </label>
        )}

        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${dragOver ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5' : 'hover:border-[var(--color-accent)]'}
          `}
          style={{ borderColor: error ? '#ef4444' : 'var(--color-border)' }}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={maxFiles > 1}
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            {...props}
          />
          <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--color-text-secondary)' }} />
          <p className="font-medium" style={{ color: 'var(--color-text)' }}>
            클릭하거나 파일을 드래그하세요
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            최대 {maxSize}MB, {maxFiles}개 파일
          </p>
        </div>

        {files.length > 0 && preview && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: 'var(--color-bg-secondary)' }}
              >
                <span style={{ color: 'var(--color-text-secondary)' }}>{getFileIcon(file.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>{file.name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button onClick={() => removeFile(index)} className="p-1" style={{ color: 'var(--color-text-secondary)' }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {hint && !error && <p className="mt-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>{hint}</p>}
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)

FileUpload.displayName = 'FileUpload'
