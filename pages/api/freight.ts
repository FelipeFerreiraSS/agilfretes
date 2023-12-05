import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const freights = await prisma.freight.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    res.status(200).json(freights);
  } else if (req.method === 'POST') {
    const { productId, vehicleTypeId, km, priceFreight, rate, status, driver, date } = req.body;
    const newFreight = await prisma.freight.create({
      data: {
        productId,
        vehicleTypeId,
        km,
        priceFreight,
        rate,
        status,
        driver,
        date,
      },
    });
    res.status(201).json(newFreight);
  } else if (req.method === 'PUT') {
    const { id, productId, vehicleTypeId, km, priceFreight, rate, status, driver, date } = req.body;
    const updatedFreight = await prisma.freight.update({
      where: { id: Number(id) },
      data: {
        productId,
        vehicleTypeId,
        km,
        priceFreight,
        rate,
        status,
        driver,
        date,
      },
    });
    res.status(200).json(updatedFreight);
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    await prisma.freight.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
