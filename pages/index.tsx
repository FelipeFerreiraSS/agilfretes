import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

import Header from '../components/Header'
import Banner from '../components/Banner'

export default function Home() {
  return (
    <>
    <Header />
    <Banner /> 
    </>
  )
}
