import React, { useState, useEffect } from 'react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId !== null) {
      const response = await fetch('/api/freight', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingId,
          productId,
          vehicleTypeId,
          km,
          priceFreight,
          rate,
          status,
          driver,
          date,
        }),
      });

      const updatedFreight = await response.json();
      setFreights((prevFreights) =>
        prevFreights.map((freight) => (freight.id === updatedFreight.id ? updatedFreight : freight))
      );

      // Limpar os campos após a edição
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
      const response = await fetch('/api/freight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          vehicleTypeId,
          km,
          priceFreight,
          rate,
          status,
          driver,
          date,
        }),
      });
      const newFreight = await response.json();
      setFreights([...freights, newFreight]);

      // Limpar os campos após a adição
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
      setKm(freightToEdit.km);
      setPriceFreight(freightToEdit.priceFreight);
      setRate(freightToEdit.rate);
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

  return (
    <div>
      <h2>Gerencie seus fretes:</h2>
      <form onSubmit={handleSubmit}>
        {/* Dropdown para selecionar o produto */}
        <label>
          Produto:
          <select value={productId || ''} onChange={(e) => setProductId(Number(e.target.value))}>
            <option value={0} >Selecione um produto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.nome}
              </option>
            ))}
          </select>
        </label>

        {/* Dropdown para selecionar o tipo de veículo */}
        <label>
          Tipo de Veículo:
          <select value={vehicleTypeId || ''} onChange={(e) => setVehicleTypeId(Number(e.target.value))}>
            <option value={0}>Selecione um tipo de veículo</option>
            {vehicleTypes.map((vehicleType) => (
              <option key={vehicleType.id} value={vehicleType.id}>
                {vehicleType.nome}
              </option>
            ))}
          </select>
        </label>

        {/* Outros campos */}
        <label>
          Quilômetros:
          <input type="number" value={km || ''} onChange={(e) => setKm(Number(e.target.value))} />
        </label>

        <label>
          Preço do Frete:
          <input type="number" value={priceFreight || ''} onChange={(e) => setPriceFreight(Number(e.target.value))} />
        </label>

        <label>
          Taxa:
          <input type="number" value={rate || ''} onChange={(e) => setRate(Number(e.target.value))} />
        </label>

        <label>
          Status:
          <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
        </label>

        <label>
          Motorista:
          <input type="text" value={driver} onChange={(e) => setDriver(e.target.value)} />
        </label>

        <label>
          Data:
          <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <button type="submit">{editingId !== null ? 'Atualizar Frete' : 'Adicionar Frete'}</button>
      </form>

      <div>
        {/* Tabela para exibir os freights existentes */}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Produto</th>
              <th>Tipo de Veículo</th>
              <th>Quilômetros</th>
              <th>Preço do Frete</th>
              <th>Taxa</th>
              <th>Status</th>
              <th>Motorista</th>
              <th>Data</th>
              <th>Editar</th>
              <th>Deletar</th>
            </tr>
          </thead>
          <tbody>
            {freights.map((freight) => (
              <tr key={freight.id}>
                <td>{freight.id}</td>
                <td>{products[freight.productId]?.nome || 'Carregando...'}</td>
				<td>{vehicleTypes[freight.vehicleTypeId]?.nome || 'Carregando...'}</td>
                <td>{freight.km}</td>
                <td>{freight.priceFreight}</td>
                <td>{freight.rate}</td>
                <td>{freight.status}</td>
                <td>{freight.driver}</td>
                <td>{freight.date}</td>
                <td>
                  <button onClick={() => handleEdit(freight.id)}>Editar</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(freight.id)}>Deletar</button>
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
