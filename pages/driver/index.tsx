import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function LoginDriver() {
  return (
    <main
      className={`min-h-screen p-24 ${inter.className}`}
    >
      <h1>Bem vindo Entregador</h1>
      <Link
        className="mr-5 inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
        href="/"
      >
        Home
      </Link>
      
    </main>
  )
}
