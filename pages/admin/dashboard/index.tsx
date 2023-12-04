import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function DashboardAdmin() {
  return (
    <main
      className={`min-h-screen p-24 ${inter.className}`}
    >
      <h1>Bem vindo Administrador</h1>
      <h2>Dashboard</h2>
    </main>
  )
}
