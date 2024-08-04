import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

import CrudFreightsDrivers from '../../components/CrudFreightsDrivers'
import Header from '../../components/Header'

export default function Driver() {
  return (
    <>
      <Header />
      <main
        className={`min-h-screen p-24 pt-0 ${inter.className}`}
      >
        <h1 className="text-3xl mt-5 mb-5 font-bold">Bem vindo, entregador</h1>
        <CrudFreightsDrivers />
      </main>
    </>
  )
}

