'use client'

/**
 * PieChart 컴포넌트
 * 파이/도넛 차트 (Chart.js)
 */

import { useEffect, useRef } from 'react'
import { Chart, ChartConfiguration, registerables } from 'chart.js'

Chart.register(...registerables)

export interface PieChartProps {
  data: {
    labels: string[]
    datasets: {
      data: number[]
      backgroundColor?: string[]
      borderColor?: string[]
      borderWidth?: number
    }[]
  }
  height?: number
  doughnut?: boolean
  showLegend?: boolean
  legendPosition?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

const defaultColors = [
  'rgba(59, 130, 246, 0.8)',
  'rgba(16, 185, 129, 0.8)',
  'rgba(245, 158, 11, 0.8)',
  'rgba(239, 68, 68, 0.8)',
  'rgba(139, 92, 246, 0.8)',
  'rgba(236, 72, 153, 0.8)',
  'rgba(20, 184, 166, 0.8)',
  'rgba(249, 115, 22, 0.8)',
]

export function PieChart({
  data,
  height = 300,
  doughnut = false,
  showLegend = true,
  legendPosition = 'right',
  className = '',
}: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const config: ChartConfiguration = {
      type: doughnut ? 'doughnut' : 'pie',
      data: {
        labels: data.labels,
        datasets: data.datasets.map(ds => ({
          ...ds,
          backgroundColor: ds.backgroundColor || defaultColors,
          borderColor: ds.borderColor || defaultColors.map(c => c.replace('0.8', '1')),
          borderWidth: ds.borderWidth ?? 1,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: showLegend,
            position: legendPosition,
          },
        },
      },
    }

    chartRef.current = new Chart(ctx, config)

    return () => {
      chartRef.current?.destroy()
    }
  }, [data, doughnut, showLegend, legendPosition])

  return (
    <div className={className} style={{ height }}>
      <canvas ref={canvasRef} />
    </div>
  )
}
