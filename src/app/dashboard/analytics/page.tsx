'use client'

import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DashboardAnalytics } from '@/onesaas-core/templates/admin'

export default function AnalyticsPage() {
  return (
    <DashboardLayout title="통계">
      <DashboardAnalytics />
    </DashboardLayout>
  )
}
