import React, { useState, useEffect } from 'react';
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

interface VehicleType {
  id: number;
  nome: string;
  weight: number;
}

const CrudVehicleTypes: React.FC = () => {
  const [nome, setNome] = useState('');
  const [weight, setWeight] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);

  useEffect(() => {
    fetch('/api/vehicleTypes')
      .then((response) => response.json())
      .then((data) => setVehicleTypes(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId !== null) {
      const response = await fetch('/api/vehicleTypes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: editingId, nome, weight: parseFloat(weight) }),
      });

      const updatedVehicleType = await response.json();
      setVehicleTypes((prevVehicleTypes: VehicleType[]) =>
        prevVehicleTypes.map((type) => (type.id === updatedVehicleType.id ? updatedVehicleType : type))
      );

      setNome('');
      setWeight('');
      setEditingId(null);
    } else {
      const response = await fetch('/api/vehicleTypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, weight: parseFloat(weight) }),
      });
      const newVehicleType = await response.json();
      setVehicleTypes([...vehicleTypes, newVehicleType]);
      setNome('');
      setWeight('');
    }
  };

  const handleEdit = async (id: number) => {
    setEditingId(id);
    const typeToEdit = vehicleTypes.find((type) => type.id === id);

    if (typeToEdit) {
      setNome(typeToEdit.nome);
      setWeight(typeToEdit.weight.toString());
    }
  };

  const handleDelete = async (id: number) => {
    await fetch('/api/vehicleTypes', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    setVehicleTypes(vehicleTypes.filter((type) => type.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl mt-5 mb-5 font-bold">Gerencie tipos de veículos:</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex mb-10">
          <div className="mr-10">
            <label className="block text-xs font-medium text-gray-700"> Nome: </label>
            <input
              type="text"
              value={nome} 
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 w-32 rounded-md border-gray-200 shadow-sm sm:text-sm"
            />
          </div>
          <div className="mr-10">
            <label className="block text-xs font-medium text-gray-700"> Peso: </label>
            <input
              type="number"
              value={weight} 
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1 w-32 rounded-md border-gray-200 shadow-sm sm:text-sm"
            />
          </div>
          <button 
            className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
            type="submit">{editingId !== null ? 'Atualizar tipo de veículo' : 'Adicionar tipo de veículo'}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">ID</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Nome</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Peso</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {vehicleTypes.map((type) => (
              <tr key={type.id}>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{type.id}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{type.nome}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{type.weight}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <button 
                    onClick={() => handleEdit(type.id)}
                    className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    Editar
                  </button>
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  <button 
                    onClick={() => handleDelete(type.id)}
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

export default CrudVehicleTypes;
