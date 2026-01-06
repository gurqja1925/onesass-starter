'use client'

/**
 * BarChart 컴포넌트
 * 막대 그래프 (Chart.js)
 */

import { useEffect, useRef } from 'react'
import { Chart, ChartConfiguration, registerables } from 'chart.js'

Chart.register(...registerables)

export interface BarChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string | string[]
      borderWidth?: number
    }[]
  }
  height?: number
  horizontal?: boolean
  stacked?: boolean
  showLegend?: boolean
  showGrid?: boolean
  className?: string
}

export function BarChart({
  data,
  height = 300,
  horizontal = false,
  stacked = false,
  showLegend = true,
  showGrid = true,
  className = '',
}: BarChartProps) {
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
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: data.datasets.map((ds, i) => ({
          ...ds,
          backgroundColor: ds.backgroundColor || `hsla(${i * 60 + 120}, 70%, 50%, 0.8)`,
          borderColor: ds.borderColor || `hsl(${i * 60 + 120}, 70%, 50%)`,
          borderWidth: ds.borderWidth ?? 1,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: horizontal ? 'y' : 'x',
        plugins: {
          legend: {
            display: showLegend,
            position: 'top',
          },
        },
        scales: {
          x: {
            stacked,
            grid: { display: showGrid },
          },
          y: {
            stacked,
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
  }, [data, horizontal, stacked, showLegend, showGrid])

  return (
    <div className={className} style={{ height }}>
      <canvas ref={canvasRef} />
    </div>
  )
}
