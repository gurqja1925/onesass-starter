'use client'

/**
 * ProductsList 템플릿
 * 상품 목록
 */

import { useState } from 'react'
import {
  Search, Plus, MoreVertical, ChevronLeft, ChevronRight,
  Download, Eye, Edit, Trash2, Package, Image as ImageIcon
} from 'lucide-react'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  comparePrice?: number
  stock: number
  category: string
  status: 'active' | 'draft' | 'archived'
  image?: string
  createdAt: string
}

interface ProductsListProps {
  products?: Product[]
  onProductClick?: (product: Product) => void
  onAddProduct?: () => void
  className?: string
}

export function ProductsList({
  products,
  onProductClick,
  onAddProduct,
  className = '',
}: ProductsListProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const formatKRW = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount)
  }

  const defaultProducts: Product[] = products || [
    { id: '1', name: '프리미엄 노트북', price: 1890000, comparePrice: 2100000, stock: 23, category: '전자기기', status: 'active', createdAt: '2024-01-15' },
    { id: '2', name: '무선 이어폰', price: 289000, stock: 56, category: '전자기기', status: 'active', createdAt: '2024-01-14' },
    { id: '3', name: '스마트워치', price: 459000, comparePrice: 499000, stock: 12, category: '전자기기', status: 'active', createdAt: '2024-01-13' },
    { id: '4', name: '블루투스 스피커', price: 189000, stock: 34, category: '음향기기', status: 'active', createdAt: '2024-01-12' },
    { id: '5', name: '기계식 키보드', price: 159000, stock: 0, category: '컴퓨터', status: 'draft', createdAt: '2024-01-11' },
    { id: '6', name: '게이밍 마우스', price: 89000, stock: 45, category: '컴퓨터', status: 'archived', createdAt: '2024-01-10' },
  ]

  const statusConfig = {
    active: { label: '판매중', color: 'bg-green-100 text-green-700' },
    draft: { label: '초안', color: 'bg-yellow-100 text-yellow-700' },
    archived: { label: '보관됨', color: 'bg-gray-100 text-gray-700' },
  }

  const categories = [...new Set(defaultProducts.map(p => p.category))]

  const filteredProducts = defaultProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className={`p-6 ${className}`} style={{ background: 'var(--color-bg)' }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            상품 관리
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            총 {defaultProducts.length}개의 상품
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg font-medium border flex items-center gap-2"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            <Download className="w-4 h-4" /> 내보내기
          </button>
          <button
            onClick={onAddProduct}
            className="px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            <Plus className="w-4 h-4" /> 상품 추가
          </button>
        </div>
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
              placeholder="상품명 검색..."
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
            <option value="active">판매중</option>
            <option value="draft">초안</option>
            <option value="archived">보관됨</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border outline-none"
            style={{
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            }}
          >
            <option value="all">모든 카테고리</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
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
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded"
                />
              </th>
              <th className="p-4 text-left text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                상품
              </th>
              <th className="p-4 text-left text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                가격
              </th>
              <th className="p-4 text-left text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                재고
              </th>
              <th className="p-4 text-left text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                카테고리
              </th>
              <th className="p-4 text-left text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                상태
              </th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="border-t cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                style={{ borderColor: 'var(--color-border)' }}
                onClick={() => onProductClick?.(product)}
              >
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleSelect(product.id)}
                    className="w-4 h-4 rounded"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--color-bg)' }}
                    >
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <ImageIcon className="w-6 h-6" style={{ color: 'var(--color-text-secondary)' }} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: 'var(--color-text)' }}>{product.name}</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>ID: {product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    ₩{formatKRW(product.price)}
                  </p>
                  {product.comparePrice && (
                    <p className="text-sm line-through" style={{ color: 'var(--color-text-secondary)' }}>
                      ₩{formatKRW(product.comparePrice)}
                    </p>
                  )}
                </td>
                <td className="p-4">
                  <span
                    className="font-medium"
                    style={{ color: product.stock === 0 ? '#ef4444' : product.stock < 10 ? '#f59e0b' : 'var(--color-text)' }}
                  >
                    {product.stock === 0 ? '품절' : `${product.stock}개`}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className="px-2 py-1 text-xs rounded-full"
                    style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
                  >
                    {product.category}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusConfig[product.status].color}`}>
                    {statusConfig[product.status].label}
                  </span>
                </td>
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                      <Eye className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                    </button>
                    <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                      <Edit className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                    </button>
                    <button className="p-2 rounded hover:bg-red-100 text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {filteredProducts.length}개 중 1-{Math.min(10, filteredProducts.length)} 표시
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
