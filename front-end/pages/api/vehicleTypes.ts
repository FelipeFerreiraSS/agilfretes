import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const vehicleTypes = await prisma.vehicleType.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    res.status(200).json(vehicleTypes);
  } else if (req.method === 'POST') {
    const { nome, weight } = req.body;
    const newVehicleType = await prisma.vehicleType.create({
      data: {
        nome,
        weight,
      },
    });
    res.status(201).json(newVehicleType);
  } else if (req.method === 'PUT') {
    const { id, nome, weight } = req.body;
    const updatedVehicleType = await prisma.vehicleType.update({
      where: { id: Number(id) },
      data: { nome, weight: parseFloat(weight) },
    });
    res.status(200).json(updatedVehicleType);
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    await prisma.vehicleType.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
