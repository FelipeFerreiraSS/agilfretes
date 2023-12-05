import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

import CrudProducts from '../../../components/CrudProducts'
import CrudVehicleTypes from '../../../components/CrudVehicleTypes'

export default function DashboardAdmin() {
  
  return (
    <main
      className={`min-h-screen p-24 ${inter.className}`}
    >
      <CrudProducts />
      <CrudVehicleTypes />
    </main>
  );
}


