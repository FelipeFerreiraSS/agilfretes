import { useState } from 'react';
import { Inter } from 'next/font/google';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const inter = Inter({ subsets: ['latin'] });

export default function GenerateReport() {
  const [reportData, setReportData] = useState([]);

  const generate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = await generateReport();
      setReportData(data);
      downloadReport(data);
    } catch (error) {
      console.error('Erro ao generateReport:', error);
    }
  };

  const generateReport = async () => {
    try {
      const response = await fetch('/api/reports');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching delivered freights report:', error);
      throw error;
    }
  };

  const downloadReport = (data: any[]) => {
    const pdf = new jsPDF();

    pdf.text("Relatório de fretes entregues ontem, dia: " + formatarData(data[0].date), 10, 10);

    function formatarData(dataString: string) {
      const data = new Date(dataString);
      const dia = data.getDate();
      const mes = data.getMonth() + 1;
      const ano = data.getFullYear();
      
      const dataFormatada = `${(dia < 10 ? '0' : '') + dia}/${(mes < 10 ? '0' : '') + mes}/${ano}`;
      
      return dataFormatada;
    }

    const headers = ['ID', 'Produto', 'Veiculo', 'Km', 'Preço do Frete', 'Taxa', 'Status', 'Motorista', 'Data',];
    const rows = data.map((item) => [item.id, item.product.nome, item.vehicleType.nome, item.km, item.priceFreight, item.rate, item.status, item.driver, formatarData(item.date),]);

    (pdf as any).autoTable({
      startY: 20,
      head: [headers],
      body: rows,
      theme: 'striped',
    });

    pdf.save('delivered-freights-report.pdf');
  };

  console.log(reportData);

  return (
    <div className="flex items-center">
      <h2 className="text-xl mt-5 mb-5 font-bold">Gere um relatório de todos as entregas finalizadas ontem:</h2>
      <form onSubmit={generate}>
        <button 
          className="ml-5 inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
          type="submit"
        >
          Baixar Relatório
        </button>
      </form>
    </div>
  );
}
