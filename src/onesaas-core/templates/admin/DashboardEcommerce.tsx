'use client'

/**
 * DashboardEcommerce 템플릿
 * 이커머스 대시보드
 */

import { useState } from 'react'
import {
  ShoppingCart, Package, CreditCard, Users,
  ArrowUpRight, ArrowDownRight, MoreVertical,
  ChevronRight, Star
} from 'lucide-react'
import { BarChart } from '@/onesaas-core/ui/charts'

interface Product {
  id: string
  name: string
  image?: string
  price: number
  sales: number
  stock: number
}

interface Order {
  id: string
  customer: string
  amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  date: string
}

interface DashboardEcommerceProps {
  products?: Product[]
  orders?: Order[]
  className?: string
}

export function DashboardEcommerce({
  products,
  orders,
  className = '',
}: DashboardEcommerceProps) {
  const formatKRW = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount)
  }

  const stats = [
    { title: '총 매출', value: `₩${formatKRW(12450000)}`, change: 15.3, trend: 'up', icon: <CreditCard className="w-5 h-5" /> },
    { title: '주문 수', value: '324', change: 8.7, trend: 'up', icon: <ShoppingCart className="w-5 h-5" /> },
    { title: '상품 수', value: '1,234', change: 2.1, trend: 'up', icon: <Package className="w-5 h-5" /> },
    { title: '신규 고객', value: '89', change: -4.2, trend: 'down', icon: <Users className="w-5 h-5" /> },
  ]

  const defaultProducts: Product[] = products || [
    { id: '1', name: '프리미엄 노트북', price: 1890000, sales: 45, stock: 23 },
    { id: '2', name: '무선 이어폰', price: 289000, sales: 128, stock: 56 },
    { id: '3', name: '스마트워치', price: 459000, sales: 89, stock: 12 },
    { id: '4', name: '블루투스 스피커', price: 189000, sales: 67, stock: 34 },
  ]

  const defaultOrders: Order[] = orders || [
    { id: 'ORD-001', customer: '김철수', amount: 289000, status: 'delivered', date: '2024-01-15' },
    { id: 'ORD-002', customer: '이영희', amount: 1890000, status: 'shipped', date: '2024-01-14' },
    { id: 'ORD-003', customer: '박민수', amount: 459000, status: 'processing', date: '2024-01-14' },
    { id: 'ORD-004', customer: '정수진', amount: 189000, status: 'pending', date: '2024-01-13' },
  ]

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
  }

  const statusLabels = {
    pending: '대기중',
    processing: '처리중',
    shipped: '배송중',
    delivered: '배송완료',
  }

  return (
    <div className={`p-6 ${className}`} style={{ background: 'var(--color-bg)' }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            이커머스 대시보드
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            오늘의 판매 현황을 확인하세요
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg font-medium"
          style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
        >
          상품 추가
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-xl"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                {stat.icon}
              </div>
              <div className={`flex items-center text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <h3 className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>{stat.title}</h3>
            <span className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* 매출 차트 */}
      <div
        className="p-6 rounded-xl mb-6"
        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
      >
        <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>주간 매출</h3>
        <BarChart
          data={{
            labels: ['월', '화', '수', '목', '금', '토', '일'],
            datasets: [
              {
                label: '매출',
                data: [1850000, 2100000, 1780000, 2450000, 2890000, 3200000, 2650000],
                backgroundColor: '#00ff88',
              },
            ],
          }}
          height={200}
          showLegend={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 인기 상품 */}
        <div
          className="p-6 rounded-xl"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>인기 상품</h3>
            <button className="text-sm flex items-center gap-1" style={{ color: 'var(--color-accent)' }}>
              전체보기 <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {defaultProducts.map((product, i) => (
              <div key={product.id} className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold"
                  style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>{product.name}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    ₩{formatKRW(product.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>{product.sales}개 판매</p>
                  <p className="text-sm" style={{ color: product.stock < 20 ? '#ef4444' : 'var(--color-text-secondary)' }}>
                    재고 {product.stock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 주문 */}
        <div
          className="p-6 rounded-xl"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>최근 주문</h3>
            <button className="text-sm flex items-center gap-1" style={{ color: 'var(--color-accent)' }}>
              전체보기 <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {defaultOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>{order.id}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {order.customer} • {order.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    ₩{formatKRW(order.amount)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
