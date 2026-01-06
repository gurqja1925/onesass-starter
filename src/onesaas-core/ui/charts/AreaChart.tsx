'use client'

/**
 * AreaChart 컴포넌트
 * 영역 차트 (Chart.js)
 */

import { useEffect, useRef } from 'react'
import { Chart, ChartConfiguration, registerables } from 'chart.js'

Chart.register(...registerables)

export interface AreaChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor?: string
      backgroundColor?: string
    }[]
  }
  height?: number
  stacked?: boolean
  showLegend?: boolean
  className?: string
}

export function AreaChart({
  data,
  height = 300,
  stacked = false,
  showLegend = true,
  className = '',
}: AreaChartProps) {
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
          borderColor: ds.borderColor || `hsl(${i * 60 + 200}, 70%, 50%)`,
          backgroundColor: ds.backgroundColor || `hsla(${i * 60 + 200}, 70%, 50%, 0.3)`,
          fill: true,
          tension: 0.4,
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
          x: { stacked },
          y: { stacked, beginAtZero: true },
        },
      },
    }

    chartRef.current = new Chart(ctx, config)

    return () => {
      chartRef.current?.destroy()
    }
  }, [data, stacked, showLegend])

  return (
    <div className={className} style={{ height }}>
      <canvas ref={canvasRef} />
    </div>
  )
}
