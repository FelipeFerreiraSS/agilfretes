import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

import CrudFreightsDrivers from '../../../components/CrudFreightsDrivers'

export default function DashboardDriver() {
  return (
    <main
      className={`min-h-screen p-24 ${inter.className}`}
    >
      <CrudFreightsDrivers />
    </main>
  )
}
