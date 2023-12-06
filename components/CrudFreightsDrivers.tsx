import React, { useState, useEffect, FormEvent } from 'react';
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

interface Product {
  id: number;
  nome: string;
}

interface VehicleType {
  id: number;
  nome: string;
}

interface Freight {
  id: number;
  productId: number;
  vehicleTypeId: number;
  km: number;
  priceFreight: number;
  rate: number;
  status: string;
  driver?: string;
  date: string;
}

const CrudFreightsDrivers: React.FC = () => {
  const [freights, setFreights] = useState<Freight[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [status, setStatus] = useState<string>('');
  const [driver, setDriver] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    fetch('/api/freight')
      .then((response) => response.json())
      .then((data) => setFreights(data));

    fetch('/api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data));

    fetch('/api/vehicleTypes')
      .then((response) => response.json())
      .then((data) => setVehicleTypes(data));
  }, []);

  const handleEdit = async (id: number) => {
    setEditingId(id);
    const freightToEdit = freights.find((freight) => freight.id === id);

    if (freightToEdit) {
      setStatus(freightToEdit.status);
      setDriver(freightToEdit.driver || '');
      setDate(freightToEdit.date);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editingId !== null) {
      const response = await fetch('/api/freight', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingId,
          status,
          driver,
          date,
        }),
      });

      const updatedFreight = await response.json();
      setFreights((prevFreights) =>
        prevFreights.map((freight) => (freight.id === updatedFreight.id ? updatedFreight : freight))
      );

      setStatus('');
      setDriver('');
      setDate('');

      setEditingId(null);
    }
  };

  function formatarData(dataString: string) {
    const data = new Date(dataString);
    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
    
    const dataFormatada = `${(dia < 10 ? '0' : '') + dia}/${(mes < 10 ? '0' : '') + mes}/${ano}`;
    
    return dataFormatada;
  }

  return (
    <div>
      <h2 className="text-xl mt-5 mb-5 font-bold">Visualize e Edite seus fretes:</h2>
      {editingId !== null && (
        <div>
          <h2 className="text-xl mt-5 mb-5 font-bold">Edite deus frtes:</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-10 flex">
              <div className="mr-10 flex flex-col">
                <label className="block text-xs font-medium text-gray-700">
                  Status:
                </label>
                <select 
                  className="mt-1 w-44 rounded-md border-gray-200 shadow-sm sm:text-sm"
                  value={status || ''} onChange={(e) => setStatus(String(e.target.value))}
                >
                  <option value={""}>Selecione o status</option>
                  <option value={"Aceito"}>Aceito</option>
                  <option value={"Rota de entrega"}>Rota de entrega</option>
                  <option value={"Finalizado"}>Finalizado</option>
                </select>
              </div>
              <div className="mr-10 flex flex-col">
                <label className="block text-xs font-medium text-gray-700">
                  Motorista:
                </label>
                <input 
                  type="text" 
                  value={driver} 
                  onChange={(e) => setDriver(e.target.value)}
                  className="mt-1 w-32 rounded-md border-gray-200 shadow-sm sm:text-sm"
                />
              </div>
              <div className="mr-10 flex flex-col">
                <label className="block text-xs font-medium text-gray-700">
                  Data:
                </label>
                <input 
                  type="text" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-48 rounded-md border-gray-200 shadow-sm sm:text-sm"
                />
              </div>
              <button 
                type="submit"
                className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
              >
                Atualizar Frete
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">ID</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Produto</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Tipo de Veículo</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Quilômetros</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Preço do Frete</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Taxa</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Status</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Motorista</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Data</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Editar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {freights.map((freight) => (
              <tr key={freight.id}>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{freight.id}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{products.find((product) => product.id === freight.productId)?.nome || 'Carregando...'}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{vehicleTypes.find((vehicleType) => vehicleType.id === freight.vehicleTypeId)?.nome || 'Carregando...'}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{freight.km}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{"R$ " + (freight.priceFreight).toFixed(2)}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{"R$ " + (freight.rate).toFixed(2)}{" (" + (freight.rate * 100 / freight.priceFreight).toFixed(0) + "%" + ")" }</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{freight.status}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{freight.driver}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatarData(freight.date)}</td>
                <td>
                  <button 
                    onClick={() => handleEdit(freight.id)}
                    className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CrudFreightsDrivers;
