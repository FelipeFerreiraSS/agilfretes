import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const formatarData = (data: Date): string => {
  const localDate = new Date(data);
  return localDate.toISOString().split('T')[0];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const currentDate = new Date();
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);

      const deliveredFreights = await prisma.freight.findMany({
        where: {
          status: 'Finalizado', // Considerando 'Finalizado' como o status correto, ajuste conforme necessário
          date: {
            gte: formatarData(yesterday) + "T00:00:00.000Z",
            lt: formatarData(currentDate) + "T00:00:00.000Z",
          },
        },
        include: {
          product: true,
          vehicleType: true,
        },
      });


      res.status(200).json(deliveredFreights);
    } catch (error) {
      console.error('Erro ao gerar o relatório de fretes finalizados:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
