import React, { Suspense } from 'react'
import TalentPoolClient from './TalentPoolClient'

export const metadata = {
  title: 'Join Our Talent Pool',
  description: 'Submit your CV to the OceanLK Holdings talent pool for future opportunities across our portfolio of companies.',
}

export default function TalentPoolPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a1628]" />}>
      <TalentPoolClient />
    </Suspense>
  )
}
