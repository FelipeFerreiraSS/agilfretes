import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Banner() {
  return (
     <section className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Conectando Destinos, Superando Expectativas
            <strong className="font-extrabold text-blue-700 sm:block"> Solução Rápida e Confiável  </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed">
            Transporte com Eficiência e Segurança: Ágil Fretes, sua escolha confiável em logística
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              className="block w-full rounded bg-blue-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
              href="/admin"
            >
              Administradores
            </Link>

            <Link
              className="block w-full bg-gray-200 rounded px-12 py-3 text-sm font-medium text-blue-600 shadow hover:text-blue-700 focus:outline-none focus:ring active:text-blue-500 sm:w-auto"
              href="/driver"
            >
              Entregadores
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
