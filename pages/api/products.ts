import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const products = await prisma.product.findMany({
      orderBy: {
        id: 'asc', // Ordenar pelo ID em ordem ascendente
      },
    });
    res.status(200).json(products);
  } else if (req.method === 'POST') {
    const { nome, weight } = req.body;
    const newProduct = await prisma.product.create({
      data: {
        nome,
        weight,
      },
    });
    res.status(201).json(newProduct);
  } else if (req.method === 'PUT') {
    const { id, nome, weight } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: { nome, weight: parseFloat(weight) },
    });
    res.status(200).json(updatedProduct);
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    await prisma.product.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
