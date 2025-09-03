import React, { useState } from 'react';
import { Sale, SortOption, SortOrder } from '../types';
import { DollarSign, Calendar, Edit, Trash2, TrendingUp, TrendingDown, MapPin } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SaleListProps {
  sales: Sale[];
  onEdit: (sale: Sale) => void;
  onDelete: (id: string) => void;
}

export const SaleList: React.FC<SaleListProps> = ({ sales, onEdit, onDelete }) => {
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterDate, setFilterDate] = useState('');
  const [filterClient, setFilterClient] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredAndSortedSales = sales
    .filter(sale => {
      try {
        let dateObj: Date;
        if (typeof sale.date === 'string') {
          dateObj = parseISO(sale.date);
        } else {
          dateObj = sale.date;
        }
        
        const matchesDate = !filterDate || (isValid(dateObj) && format(dateObj, 'yyyy-MM-dd') === filterDate);
        const matchesClient = !filterClient || sale.clientName.toLowerCase().includes(filterClient.toLowerCase());
        return matchesDate && matchesClient;
      } catch (error) {
        return false;
      }
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'value') {
        comparison = a.value - b.value;
      } else if (sortBy === 'date') {
        try {
          let dateA: Date, dateB: Date;
          
          if (typeof a.date === 'string') {
            dateA = parseISO(a.date);
          } else {
            dateA = a.date;
          }
          
          if (typeof b.date === 'string') {
            dateB = parseISO(b.date);
          } else {
            dateB = b.date;
          }
          
          if (isValid(dateA) && isValid(dateB)) {
            comparison = dateA.getTime() - dateB.getTime();
          }
        } catch (error) {
          comparison = 0;
        }
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const totalValue = filteredAndSortedSales.reduce((sum, sale) => sum + sale.value, 0);
  const averageValue = filteredAndSortedSales.length > 0 ? totalValue / filteredAndSortedSales.length : 0;

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const formatDate = (date: Date | string) => {
    try {
      let dateObj: Date;
      if (typeof date === 'string') {
        dateObj = parseISO(date);
      } else {
        dateObj = date;
      }
      
      if (!isValid(dateObj)) {
        return 'Data inválida';
      }
      
      return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
              <p className="text-2xl font-bold text-gray-900">{filteredAndSortedSales.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Comissão Estimada</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalValue * 0.06)}</p>
              <p className="text-xs text-gray-500 mt-1">6% sobre o faturamento</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Faturamento Total</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalValue)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Filtrar por cliente..."
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Ordenar por Data</option>
              <option value="value">Ordenar por Valor</option>
            </select>

            <button
              onClick={toggleSortOrder}
              className="btn-secondary px-4 py-3 rounded-xl flex items-center gap-2"
              title={`Ordenar ${sortOrder === 'asc' ? 'decrescente' : 'crescente'}`}
            >
              {sortOrder === 'asc' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Vendas */}
      <div className="grid gap-4">
        {filteredAndSortedSales.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-gray-400 mb-4">
              <DollarSign size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhuma venda encontrada</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou adicione uma nova venda.</p>
          </div>
        ) : (
          filteredAndSortedSales.map((sale) => (
            <div key={sale.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">{sale.clientName}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {formatCurrency(sale.value)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={16} />
                        <span>{sale.city}</span>
                      </div>
                                             <div className="flex items-center gap-2 text-gray-600">
                         <Calendar size={16} />
                         <span>{formatDate(sale.date)}</span>
                       </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">
                        Registrado em {formatDate(sale.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onEdit(sale)}
                    className="btn-icon btn-edit p-2 text-gray-400 rounded-lg"
                    title="Editar venda"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(sale.id)}
                    className="btn-icon btn-delete p-2 text-gray-400 rounded-lg"
                    title="Excluir venda"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
