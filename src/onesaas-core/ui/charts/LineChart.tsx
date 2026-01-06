'use client'

/**
 * LineChart 컴포넌트
 * 선 그래프 (Chart.js)
 */

import { useEffect, useRef } from 'react'
import { Chart, ChartConfiguration, registerables } from 'chart.js'

Chart.register(...registerables)

export interface LineChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor?: string
      backgroundColor?: string
      fill?: boolean
      tension?: number
    }[]
  }
  height?: number
  showLegend?: boolean
  showGrid?: boolean
  className?: string
}

export function LineChart({
  data,
  height = 300,
  showLegend = true,
  showGrid = true,
  className = '',
}: LineChartProps) {
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
      type: 'line',
      data: {
        labels: data.labels,
        datasets: data.datasets.map((ds, i) => ({
          ...ds,
          borderColor: ds.borderColor || `hsl(${i * 60}, 70%, 50%)`,
          backgroundColor: ds.backgroundColor || `hsla(${i * 60}, 70%, 50%, 0.1)`,
          tension: ds.tension ?? 0.4,
          fill: ds.fill ?? true,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: showLegend,
            position: 'top',
          },
        },
        scales: {
          x: {
            grid: { display: showGrid },
          },
          y: {
            grid: { display: showGrid },
            beginAtZero: true,
          },
        },
      },
    }

    chartRef.current = new Chart(ctx, config)

    return () => {
      chartRef.current?.destroy()
    }
  }, [data, showLegend, showGrid])

  return (
    <div className={className} style={{ height }}>
      <canvas ref={canvasRef} />
    </div>
  )
}
