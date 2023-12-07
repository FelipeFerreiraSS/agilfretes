import React, { useState, useEffect, FormEvent } from 'react';
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

interface Product {
  id: number;
  nome: string;
  weight: number;
}

interface VehicleType {
  id: number;
  nome: string;
  weight: number;
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

const CrudFreights: React.FC = () => {
  const [freights, setFreights] = useState<Freight[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [productId, setProductId] = useState<number | null>(null);
  const [vehicleTypeId, setVehicleTypeId] = useState<number | null>(null);
  const [km, setKm] = useState<number | null>(null);
  const [priceFreight, setPriceFreight] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [KmFrete, setKmFrete] = useState<number | null>(null);
  const [valorFrete, setValorFrete] = useState<string | null>(null);
  const [taxa, setTaxa] = useState<number | null>(null);
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

  useEffect(() => {
    const calcular = async () => {
      await calcularFrete();
    };

    calcular();
  }, [KmFrete, productId, vehicleTypeId]);

  const handleAddFreight = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        await calcularFrete();
        handleSubmit(e);
      } catch (error) {
        console.error('Erro ao calcularFrete:', error);
      }
  };

	const calcularFrete = () => {
    const selectedProduct = products.find((product) => product.id === productId);
    const selectedVehicleType = vehicleTypes.find((vehicleType) => vehicleType.id === vehicleTypeId);

    if (selectedProduct && selectedVehicleType) {
      const pesoCalculoProduto = selectedProduct.weight;
      const pesoCalculoVeiculo = selectedVehicleType.weight;
      const valorFreteCalculado = (KmFrete ?? 0) * pesoCalculoProduto * pesoCalculoVeiculo;

      setValorFrete((prevValorFrete) => valorFreteCalculado.toFixed(2));

      if ((KmFrete ?? 0) <= 100) {
        setTaxa((prevTaxa) => valorFreteCalculado * 0.05);
      } else if ((KmFrete ?? 0) <= 200) {
        setTaxa((prevTaxa) => valorFreteCalculado * 0.07);
      } else if ((KmFrete ?? 0) <= 500) {
        setTaxa((prevTaxa) => valorFreteCalculado * 0.09);
      } else {
        setTaxa((prevTaxa) => valorFreteCalculado * 0.1);
      }
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId !== null) {
      const localDate = new Date(date + 'T00:00:00');
      const isoDate = localDate.toISOString();
      
      const response = await fetch('/api/freight', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingId,
          productId,
          vehicleTypeId,
          km: (KmFrete ?? 0),
          priceFreight: parseFloat(Number(valorFrete).toFixed(2)),
          rate: parseFloat(Number(taxa).toFixed(2)),
          status,
          driver,
          date: isoDate,
        }),
      });

      const updatedFreight = await response.json();
      setFreights((prevFreights) =>
        prevFreights.map((freight) => (freight.id === updatedFreight.id ? updatedFreight : freight))
      );

      setProductId(null);
      setVehicleTypeId(null);
      setKm(null);
      setPriceFreight(null);
      setRate(null);
      setStatus('');
      setDriver('');
      setDate('');

      setEditingId(null);
    } else {
      const localDate = new Date(date + 'T00:00:00');
      const isoDate = localDate.toISOString();

      const response = await fetch('/api/freight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          vehicleTypeId,
          km: (KmFrete ?? 0),
          priceFreight: Number(valorFrete).toFixed(2),
          rate: Number(taxa).toFixed(2),
          status,
          driver,
          date: isoDate,
        }),
      });
      const newFreight = await response.json();
      setFreights([...freights, newFreight]);

      setProductId(null);
      setVehicleTypeId(null);
      setKm(null);
      setPriceFreight(null);
      setRate(null);
      setStatus('');
      setDriver('');
      setDate('');
    }
  };

  const handleEdit = async (id: number) => {
    setEditingId(id);
    const freightToEdit = freights.find((freight) => freight.id === id);

    if (freightToEdit) {
      setProductId(freightToEdit.productId);
      setVehicleTypeId(freightToEdit.vehicleTypeId);
      setKmFrete(freightToEdit.km);
      setValorFrete(freightToEdit.priceFreight.toFixed(2));
      setTaxa(parseFloat(freightToEdit.rate.toFixed(2)));
      setStatus(freightToEdit.status);
      setDriver(freightToEdit.driver || '');
      setDate(freightToEdit.date);
    }
  };

  const handleDelete = async (id: number) => {
    await fetch('/api/freight', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    setFreights(freights.filter((freight) => freight.id !== id));
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
      <h2 className="text-xl mt-5 mb-5 font-bold">Gerencie seus fretes:</h2>
      <form onSubmit={handleAddFreight}>
        <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
          <div>
            <div className="mr-10 mb-10 flex flex-col">
              <label className="block text-xs font-medium text-gray-700">
                Produto:
              </label>
              <select 
                className="mt-1 w-52 rounded-md border-gray-200 shadow-sm sm:text-sm" 
                value={productId || ''} onChange={(e) => setProductId(Number(e.target.value))}>
                <option value={0} >Selecione um produto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.nome}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mr-10 mb-10 flex flex-col">
              <label className="block text-xs font-medium text-gray-700">
              Tipo de Veículo:
              </label>
              <select 
                className="mt-1 w-64 rounded-md border-gray-200 shadow-sm sm:text-sm"
                value={vehicleTypeId || ''} onChange={(e) => setVehicleTypeId(Number(e.target.value))}>
                <option value={0}>Selecione um tipo de veículo</option>
                {vehicleTypes.map((vehicleType) => (
                  <option key={vehicleType.id} value={vehicleType.id}>
                    {vehicleType.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="mr-10 mb-10 flex flex-col">
              <label className="block text-xs font-medium text-gray-700">
                Quilômetros:
              </label>
              <input 
                type="number" 
                value={KmFrete !== null ? KmFrete.toString() : ''} 
                onChange={(e) => {
                  const newKmFrete = Number(e.target.value);
                  if (!isNaN(newKmFrete)) {
                    setKmFrete(newKmFrete);
                    calcularFrete(); // Chama calcularFrete quando KmFrete é alterado manualmente
                  }
                }}
                className="mt-1 w-32 rounded-md border-gray-200 shadow-sm sm:text-sm"
              />
            </div>

            <div className="mr-10 mb-10 flex flex-col">
              <label className="block text-xs font-medium text-gray-700">
                Status:
              </label>
              <select 
                className="mt-1 w-44 rounded-md border-gray-200 shadow-sm sm:text-sm"
                value={status || ''} onChange={(e) => setStatus(String(e.target.value))}
              >
                <option value={""}>Selecione o status</option>
                <option value={"Ativo"}>Ativo</option>
                <option value={"Cancelado"}>Cancelado</option>
              </select>
            </div>
          </div>

          <div>
            <div className="mb-10 flex flex-col">
              <label className="block text-xs font-medium text-gray-700">
                Data:
              </label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="mt-1 w-40 rounded-md border-gray-200 shadow-sm sm:text-sm"
              />
            </div>
            <button 
              type="submit"
              className="inline-block mb-5 rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
            >
              {editingId !== null ? 'Atualizar Frete' : 'Adicionar Frete'}
            </button>
          </div>
        </div>
      </form>

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
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Deletar</th>
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
                <td>
                  <button 
                    onClick={() => handleDelete(freight.id)}
                    className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    Deletar
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

export default CrudFreights;
