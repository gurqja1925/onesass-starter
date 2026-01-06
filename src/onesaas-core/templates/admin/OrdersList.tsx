'use client'

/**
 * OrdersList 템플릿
 * 주문 목록
 */

import { useState } from 'react'
import {
  Search, Filter, MoreVertical, ChevronLeft, ChevronRight,
  Download, Eye, Package, Truck, CheckCircle, XCircle, Clock
} from 'lucide-react'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customer: { name: string; email: string }
  items: OrderItem[]
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'paid' | 'pending' | 'refunded'
  createdAt: string
  shippingAddress?: string
}

interface OrdersListProps {
  orders?: Order[]
  onOrderClick?: (order: Order) => void
  className?: string
}

export function OrdersList({
  orders,
  onOrderClick,
  className = '',
}: OrdersListProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const formatKRW = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount)
  }

  const defaultOrders: Order[] = orders || [
    {
      id: 'ORD-2024-001',
      customer: { name: '김철수', email: 'kim@example.com' },
      items: [{ name: '프리미엄 노트북', quantity: 1, price: 1890000 }],
      total: 1890000,
      status: 'delivered',
      paymentStatus: 'paid',
      createdAt: '2024-01-15 14:30',
    },
    {
      id: 'ORD-2024-002',
      customer: { name: '이영희', email: 'lee@example.com' },
      items: [{ name: '무선 이어폰', quantity: 2, price: 289000 }],
      total: 578000,
      status: 'shipped',
      paymentStatus: 'paid',
      createdAt: '2024-01-14 10:15',
    },
    {
      id: 'ORD-2024-003',
      customer: { name: '박민수', email: 'park@example.com' },
      items: [{ name: '스마트워치', quantity: 1, price: 459000 }],
      total: 459000,
      status: 'processing',
      paymentStatus: 'paid',
      createdAt: '2024-01-14 09:00',
    },
    {
      id: 'ORD-2024-004',
      customer: { name: '정수진', email: 'jung@example.com' },
      items: [{ name: '블루투스 스피커', quantity: 1, price: 189000 }],
      total: 189000,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: '2024-01-13 16:45',
    },
    {
      id: 'ORD-2024-005',
      customer: { name: '최현우', email: 'choi@example.com' },
      items: [{ name: '키보드', quantity: 1, price: 159000 }],
      total: 159000,
      status: 'cancelled',
      paymentStatus: 'refunded',
      createdAt: '2024-01-12 11:20',
    },
  ]

  const statusConfig = {
    pending: { label: '대기중', icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
    confirmed: { label: '확인됨', icon: CheckCircle, color: 'text-blue-600 bg-blue-100' },
    processing: { label: '처리중', icon: Package, color: 'text-purple-600 bg-purple-100' },
    shipped: { label: '배송중', icon: Truck, color: 'text-indigo-600 bg-indigo-100' },
    delivered: { label: '배송완료', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
    cancelled: { label: '취소됨', icon: XCircle, color: 'text-red-600 bg-red-100' },
  }

  const paymentConfig = {
    paid: { label: '결제완료', color: 'text-green-600' },
    pending: { label: '결제대기', color: 'text-yellow-600' },
    refunded: { label: '환불완료', color: 'text-red-600' },
  }

  const filteredOrders = defaultOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className={`p-6 ${className}`} style={{ background: 'var(--color-bg)' }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            주문 관리
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            총 {defaultOrders.length}건의 주문
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg font-medium border flex items-center gap-2"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          <Download className="w-4 h-4" /> 내보내기
        </button>
      </div>

      {/* 필터 */}
      <div
        className="p-4 rounded-xl mb-4"
        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
      >
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="주문번호, 고객명, 이메일 검색..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border outline-none"
              style={{
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border outline-none"
            style={{
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            }}
          >
            <option value="all">모든 상태</option>
            <option value="pending">대기중</option>
            <option value="confirmed">확인됨</option>
            <option value="processing">처리중</option>
            <option value="shipped">배송중</option>
            <option value="delivered">배송완료</option>
            <option value="cancelled">취소됨</option>
          </select>
        </div>
      </div>

      {/* 테이블 */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--color-bg)' }}>
              <th className="p-4 text-left text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                주문번호
              </th>
              <th className="p-4 text-left text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                고객
              </th>
              <th className="p-4 text-left text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                상품
              </th>
              <th className="p-4 text-left text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                결제금액
              </th>
              <th className="p-4 text-left text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                상태
              </th>
              <th className="p-4 text-left text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                결제
              </th>
              <th className="p-4 text-left text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                주문일시
              </th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon
              return (
                <tr
                  key={order.id}
                  className="border-t cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  style={{ borderColor: 'var(--color-border)' }}
                  onClick={() => onOrderClick?.(order)}
                >
                  <td className="p-4 font-medium" style={{ color: 'var(--color-accent)' }}>
                    {order.id}
                  </td>
                  <td className="p-4">
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>{order.customer.name}</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{order.customer.email}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                      {order.items[0].name}
                      {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
                    </p>
                  </td>
                  <td className="p-4 font-medium" style={{ color: 'var(--color-text)' }}>
                    ₩{formatKRW(order.total)}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${statusConfig[order.status].color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig[order.status].label}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-sm ${paymentConfig[order.paymentStatus].color}`}>
                      {paymentConfig[order.paymentStatus].label}
                    </span>
                  </td>
                  <td className="p-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {order.createdAt}
                  </td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                      <Eye className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {filteredOrders.length}개 중 1-{Math.min(10, filteredOrders.length)} 표시
          </p>
          <div className="flex gap-1">
            <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <ChevronLeft className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
            </button>
            <button className="px-3 py-1 rounded" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>1</button>
            <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
