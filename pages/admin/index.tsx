import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

import CrudProducts from '../../components/CrudProducts'
import CrudVehicleTypes from '../../components/CrudVehicleTypes'
import CrudFreights from '../../components/CrudFreights'
import Header from '../../components/Header'

export default function Admin() {
  
  return (
    <>
      <Header />
      <main
        className={`min-h-screen p-24 pt-0 ${inter.className}`}
      >
        <h1 className="text-3xl mt-5 mb-5 font-bold">Bem vindo, administrador</h1>
        <CrudProducts />
        <CrudVehicleTypes />
        <CrudFreights />
      </main>
    </>
  );
}



